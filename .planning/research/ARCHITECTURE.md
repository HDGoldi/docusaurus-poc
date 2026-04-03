# Architecture: AI & Search Readiness Integration

**Domain:** llms.txt, skill.md, robots.txt integration with Docusaurus 3.9.2
**Researched:** 2026-04-03
**Overall confidence:** HIGH (standards are well-documented; integration with existing architecture is straightforward)

## Executive Summary

This document covers how three new file types -- `llms.txt`, `skill.md` (at `/.well-known/skills/`), and `robots.txt` -- integrate with the existing Docusaurus 3.9.2 site deployed on S3 + CloudFront. The recommended approach is a **hybrid strategy**: static files for hand-curated content (`robots.txt`, `skill.md` templates) combined with a build-time generation script for `llms.txt` that assembles curated prose with dynamically generated link inventories. No Docusaurus plugin is needed for `robots.txt` or `skill.md`; the `docusaurus-plugin-llms` package (v0.3.0) exists but is not recommended because the project requires product-first curated organization, not auto-generated page dumps.

## Integration Strategy Overview

| File | Approach | Location in Repo | Served At | Why |
|------|----------|-------------------|-----------|-----|
| `robots.txt` | Pure static file | `static/robots.txt` | `/robots.txt` | Simple, no dynamic content. Docusaurus copies `static/` contents to `build/` root. |
| `llms.txt` | Build-time script (hybrid) | Template in `templates/llms.txt.template` + script in `scripts/generate-llms-txt.ts` + output to `build/llms.txt` | `/llms.txt` | Curated product-first structure with dynamically generated link sections from sidebar data. |
| `llms-full.txt` | Build-time script | Same script generates both | `/llms-full.txt` | Full concatenated content for LLMs that want everything in one request. |
| `skill.md` | Pure static file | `static/.well-known/skills/1nce-api.md` | `/.well-known/skills/1nce-api.md` | Hand-curated auth flows, patterns, gotchas. No dynamic content needed. |
| `skills/index.json` | Pure static file | `static/.well-known/skills/index.json` | `/.well-known/skills/index.json` | Discovery file listing available skills. Static because skill inventory changes rarely. |

## Component Architecture

### New Components

```
Project Root
+-- static/
|   +-- robots.txt                          # NEW: static file
|   +-- .well-known/
|       +-- skills/
|           +-- index.json                  # NEW: skill discovery index
|           +-- 1nce-api.md                 # NEW: curated API skill doc
+-- templates/
|   +-- llms.txt.template                   # NEW: curated Markdown template with placeholders
+-- scripts/
|   +-- generate-llms-txt.ts                # NEW: build-time script
```

### Modified Components

| Component | Modification | Reason |
|-----------|-------------|--------|
| `package.json` | Add `generate:llms` script | Run llms.txt generation as part of build pipeline |
| `scripts/smoke-test.sh` | Add URL checks for new files | Verify files are served correctly after deploy |
| `infra/cf-function.js` | No change needed | Files have extensions (`.txt`, `.md`, `.json`) so the existing function already passes them through correctly |

### Unchanged Components

| Component | Why Unchanged |
|-----------|---------------|
| `docusaurus.config.ts` | No plugin additions needed. Static files handled by Docusaurus natively. |
| `infra/template.yaml` | CloudFront config already serves all S3 objects. No new behaviors/origins needed. |
| `.github/workflows/deploy.yml` | Build step already runs `npm run build` which produces `build/` directory. Post-build llms.txt generation needs one new step but no structural changes. |
| `sidebars/` | Read-only input for the llms.txt generator. Not modified. |

## Detailed Design

### 1. robots.txt -- Pure Static File

**Approach:** Place `static/robots.txt` in the repo. Docusaurus copies it verbatim to `build/robots.txt`.

**Content structure:**
```
User-agent: *
Allow: /

Sitemap: https://help.1nce.com/sitemap.xml
```

**Why static:** robots.txt for this site has no dynamic content. The sitemap URL is fixed. There is no reason to generate it at build time.

**Integration points:** None. Docusaurus's static file handling does this automatically.

### 2. llms.txt -- Hybrid Build-Time Generation

This is the most architecturally interesting piece. The project requires **product-first curated organization** (1NCE Connect, 1NCE OS sections) but also needs the actual page links to stay in sync with the ~298 doc pages and ~125 API pages.

**Approach: Template + Build Script**

The template (`templates/llms.txt.template`) contains:
- H1 heading and blockquote (curated)
- Product-first narrative sections (curated)
- Placeholder markers like `<!-- DOCS_LINKS:section-name -->` and `<!-- API_LINKS -->` where the script injects generated link lists

The build script (`scripts/generate-llms-txt.ts`) runs **after `docusaurus build`** and:
1. Reads the curated template
2. Scans `docs/documentation/` and `docs/api/` directories, reading frontmatter for titles
3. Uses sidebar structure to determine section grouping and ordering
4. Generates Markdown link lists organized by the curated section structure
5. Replaces placeholders in the template with generated link lists
6. Writes `build/llms.txt`
7. Generates `build/llms-full.txt` by concatenating curated intro + all page content (stripped of JSX/imports)

**Data flow:**

```
templates/llms.txt.template (curated prose + placeholders)
        |
        v
scripts/generate-llms-txt.ts
        |
        +-- reads: docs/documentation/**/*.mdx (frontmatter for titles)
        +-- reads: docs/api/**/*.mdx (frontmatter for titles)
        +-- reads: sidebars/documentation.ts (section ordering)
        |
        v
build/llms.txt (final output: curated prose + generated links)
build/llms-full.txt (curated intro + all page content concatenated)
```

**Why not `docusaurus-plugin-llms`?**

The `docusaurus-plugin-llms` package (v0.3.0, published 2026-02-08) auto-generates `llms.txt` and `llms-full.txt` from all docs pages. It supports `customLLMFiles`, `includeOrder`, and `rootContent` options. However:

1. **Product-first organization requires curated prose between sections.** The plugin generates link lists organized by file path. The project needs sections like "1NCE Connect Suite" and "1NCE OS" that group pages by product concept, not directory structure. The `rootContent` option only adds prose at the top, not between sections.
2. **The plugin operates as a Docusaurus lifecycle plugin.** It hooks into `postBuild`. A standalone script gives more control and is easier to debug and test independently.
3. **The plugin is at v0.3.0.** Young package, 9 versions in a month. API surface may change. A standalone script has zero external dependencies.

A standalone build-time script is more maintainable for this use case.

**Why not pure static?**

With ~423 pages (298 docs + 125 API), manually maintaining link URLs in `llms.txt` is error-prone. When pages are added, renamed, or removed, the links go stale. Build-time generation from source content ensures links stay in sync.

**Build order dependency:** Must run **after** `docusaurus build` (so the build output exists to verify against) but **before** `aws s3 sync` (so the generated file gets deployed).

### 3. skill.md -- Pure Static File at /.well-known/skills/

**Background on skill.md:** This is an emerging convention for providing AI coding agents with structured instructions about how to interact with an API. Unlike `llms.txt` (which is about documentation discovery), `skill.md` is about **operational knowledge**: authentication flows, common request patterns, error handling, rate limit behavior, and gotchas.

**Approach:** Pure static files in `static/.well-known/skills/`.

```
static/.well-known/skills/
+-- index.json          # Discovery: lists available skill files
+-- 1nce-api.md         # Skill doc: auth, patterns, gotchas
```

**Docusaurus handles `static/.well-known/` correctly.** The `static/` directory contents are copied verbatim to `build/`, preserving directory structure including dotfile-prefixed directories. The `.well-known` directory is not filtered out. Docusaurus docs state: "Every file you put into that directory will be copied into the root of the generated build folder with the directory hierarchy preserved."

**LOW confidence note on skill.md standard:** The `skill.md` standard does not yet have a formal public specification. spec.skillmd.org was unreachable; no RFC or W3C draft exists as of this research date. The convention appears to be emerging from the AI agent ecosystem but lacks a canonical format definition. The project should treat the format as a curated best-effort Markdown file following the structure described in PROJECT.md, and be prepared to adapt if a spec stabilizes.

**index.json format (proposed):**
```json
{
  "skills": [
    {
      "id": "1nce-api",
      "name": "1NCE IoT Platform API",
      "description": "Authentication, SIM management, connectivity services, and 1NCE OS integration patterns",
      "path": "/.well-known/skills/1nce-api.md",
      "version": "1.0"
    }
  ]
}
```

**1nce-api.md content structure (proposed):**
```markdown
# 1NCE IoT Platform API

## Authentication
- OAuth2 client credentials flow against management API
- Bearer token in Authorization header
- Token refresh patterns

## Common Patterns
- SIM lifecycle management (activate, suspend, resume)
- Data usage queries
- 1NCE OS device integration

## Rate Limits & Quotas
[Documented limits from existing content]

## Gotchas
- CORS restrictions on browser-based API calls
- Region-specific API endpoints
- Pagination patterns
```

**Why static, not generated?** Skill files are curated operational knowledge, not page inventories. They change when the API behavior changes, not when doc pages are added. There is no sidebar data to derive them from. Hand-curation is the correct approach.

### 4. CloudFront Considerations

**The existing CloudFront setup requires no changes for these files.**

**CloudFront Function (SPA routing):**
The existing `infra/cf-function.js` rewrites URIs that end with `/` (appends `index.html`) or have no file extension (appends `/index.html`). Files with extensions pass through untouched:
- `/robots.txt` -- has `.txt` extension, passes through, S3 serves `robots.txt`
- `/llms.txt` -- has `.txt` extension, passes through
- `/llms-full.txt` -- has `.txt` extension, passes through
- `/.well-known/skills/index.json` -- has `.json` extension, passes through
- `/.well-known/skills/1nce-api.md` -- has `.md` extension, passes through

**Cache behavior:**
The deploy pipeline uses two-tier caching:
- `build/assets/*` synced with `max-age=31536000, immutable` (hashed filenames)
- Everything else synced with `max-age=600, must-revalidate`

The new files fall into the "everything else" category and get 10-minute must-revalidate cache. This is appropriate -- these files change infrequently, and 10 minutes is fine for propagation after a deploy (CloudFront invalidation runs after sync anyway).

**Content-Type headers:**
S3 auto-detects MIME types on upload via `aws s3 sync`:
- `.txt` files --> `text/plain` (correct for robots.txt, llms.txt, llms-full.txt)
- `.json` files --> `application/json` (correct for index.json)
- `.md` files --> may default to `application/octet-stream` depending on S3 MIME detection

**Potential issue with .md MIME type:** S3 may not serve `.md` files with `text/markdown` or `text/plain` content type. This is unlikely to matter for AI agent consumption (agents parse content, not MIME types), but if needed, the `aws s3 sync` command can be extended with a separate sync for `.md` files specifying `--content-type text/markdown`. Monitor after first deploy and fix only if agents report issues.

**No new CloudFront behaviors, origins, or function changes are needed.**

### 5. CI/CD Pipeline Integration

**The deploy workflow needs one new step:**

```yaml
# In deploy-production job, after "Build with CHAT_ENDPOINT":
- name: Generate llms.txt
  run: npx tsx scripts/generate-llms-txt.ts

# Existing S3 sync steps pick up all files in build/ -- no change needed
```

Static files (`robots.txt`, `.well-known/skills/*`) are automatically handled by `docusaurus build` copying `static/` to `build/`. No extra step needed for those.

**Smoke test additions:**
```bash
URLS=(
  # ... existing URLs ...
  "/robots.txt"
  "/llms.txt"
  "/.well-known/skills/index.json"
)
```

## Build Order and Dependencies

```
Phase 1: Static files (no dependencies, can be done in parallel)
  +-- robots.txt                    # Independent, no build-time deps
  +-- .well-known/skills/index.json # Independent
  +-- .well-known/skills/1nce-api.md# Independent (needs API knowledge to write well)

Phase 2: llms.txt generation (depends on content structure being understood)
  +-- templates/llms.txt.template   # Depends on: knowing the product sections
  +-- scripts/generate-llms-txt.ts  # Depends on: template + sidebar structure + docs content

Phase 3: CI/CD integration (depends on Phase 1 + 2)
  +-- deploy.yml update             # Depends on: generate script existing
  +-- smoke-test.sh update          # Depends on: knowing all new URLs
```

**Recommended implementation order:**
1. `robots.txt` first -- zero risk, immediate SEO value, validates static file serving path
2. `skill.md` + `index.json` second -- validates `.well-known/` path serving through S3 + CloudFront
3. `llms.txt` template + generation script third -- most complex, benefits from phases 1-2 validating the serving infrastructure
4. Smoke test and CI/CD updates last -- wraps everything with quality gates

## Patterns to Follow

### Pattern: Post-Build Generation
**What:** Run a script after `docusaurus build` that reads source files and produces additional output in `build/`.
**When:** Content needs to be derived from source data but does not need Docusaurus's rendering pipeline.
**Why:** Decoupled from Docusaurus's plugin system. Easier to test, debug, and maintain. Already established in this project (`scripts/prepare-rag-content.ts` follows this exact pattern).

### Pattern: Template + Placeholder Injection
**What:** A curated Markdown template with `<!-- PLACEHOLDER -->` markers that a script replaces with generated content.
**When:** Output needs both curated prose and dynamic data.
**Why:** Curators edit the template without touching the script. The script generates link lists without touching the prose. Clean separation of concerns.

### Pattern: Static .well-known via static/
**What:** Place `.well-known/` contents in Docusaurus's `static/` directory.
**When:** Serving standardized discovery files that do not need build-time processing.
**Why:** Docusaurus preserves directory structure including dot-prefixed directories. No plugin needed.

## Anti-Patterns to Avoid

### Anti-Pattern: Using docusaurus-plugin-llms for curated content
**What:** Installing `docusaurus-plugin-llms` and trying to force product-first organization through its configuration.
**Why bad:** The plugin auto-generates from file paths. Forcing product-first structure through `includeOrder` and `customLLMFiles` creates a brittle configuration that fights the plugin's design. When the curated structure diverges from the file structure (which it will -- "1NCE Connect" spans multiple directories), the configuration becomes unmaintainable.
**Instead:** Use a standalone build script with a template.

### Anti-Pattern: Generating skill.md from OpenAPI specs
**What:** Auto-generating skill files from the 6 OpenAPI spec JSON files.
**Why bad:** OpenAPI specs describe endpoints, not operational knowledge. A skill file needs to explain "how to authenticate, what order to call things in, what to watch out for" -- none of which is in the spec. Auto-generation produces a worse-than-useless file that looks complete but misses the hard-won operational knowledge.
**Instead:** Hand-curate skill files. They are small (one file, ~200-400 lines) and change rarely.

### Anti-Pattern: Putting generated files in static/
**What:** Running the llms.txt generator and writing output to `static/llms.txt` so Docusaurus copies it to `build/`.
**Why bad:** Generated files in `static/` get committed to git, creating merge conflicts and stale content. The `static/` directory should contain only truly static, hand-maintained assets.
**Instead:** Generate directly into `build/` as a post-build step.

## File Format Reference

### llms.txt Format (per llmstxt.org)

Required structure per the specification:
1. **H1 heading** (required) -- site/project name
2. **Blockquote** (optional) -- brief summary with key information
3. **Markdown prose** (optional) -- additional context paragraphs
4. **H2-delimited sections** -- each containing link lists as `- [Title](URL): Description`
5. **"Optional" section** (special designation) -- links that can be skipped for shorter context

### robots.txt Format (RFC 9309)

Standard robots exclusion protocol. Note: Docusaurus with `@docusaurus/preset-classic` auto-generates `sitemap.xml` in the build output. The robots.txt references this sitemap. No additional sitemap generation needed.

## Scalability Considerations

| Concern | Current (~423 pages) | At 1000 pages | Mitigation |
|---------|---------------------|---------------|------------|
| llms.txt generation time | <1 second (frontmatter scanning) | <2 seconds | Script reads frontmatter only, not full page content |
| llms-full.txt file size | ~2-3 MB estimated | ~5-8 MB | LLMs handle large context; llms.txt (links only) serves as lightweight alternative |
| Template maintenance | One curated template | Same template, more links auto-generated | Template sections stable; link lists grow automatically |
| skill.md maintenance | 1 file, ~300 lines | Same | Skills scale with API surface, not page count |

## Sources

- llmstxt.org specification -- HIGH confidence (fetched and verified directly)
- Docusaurus static assets documentation (docusaurus.io/docs/static-assets) -- HIGH confidence (fetched and verified)
- `docusaurus-plugin-llms` v0.3.0 npm package README -- MEDIUM confidence (evaluated via npm view, decided against)
- `@signalwire/docusaurus-plugin-llms-txt` v1.2.2 -- MEDIUM confidence (noted as alternative, not evaluated in depth)
- RFC 8615 (.well-known URIs) -- HIGH confidence (established IETF standard)
- RFC 9309 (robots.txt) -- HIGH confidence (established IETF standard)
- Existing project codebase (`docusaurus.config.ts`, `infra/cf-function.js`, `deploy.yml`, `package.json`) -- HIGH confidence (direct inspection)
- skill.md convention -- LOW confidence (no formal spec found as of 2026-04-03; treat as emerging convention)
- Stripe llms.txt as real-world reference -- MEDIUM confidence (demonstrates product-first organization pattern)
