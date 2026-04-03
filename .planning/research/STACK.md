# Stack Research: v1.3 AI & Search Readiness

**Domain:** llms.txt, skill.md, robots.txt for Docusaurus 3.9.2
**Researched:** 2026-04-03
**Confidence:** HIGH (robots.txt, static file serving), MEDIUM (llms.txt plugin), LOW (skill.md convention)

---

## Executive Summary

All three features (llms.txt, skill.md, robots.txt) are achievable with one new plugin and static files. robots.txt is trivially a static file. skill.md is a static file served from `static/.well-known/skills/`. llms.txt has two viable approaches: the `@signalwire/docusaurus-plugin-llms-txt` plugin (auto-generates from built HTML) or a custom build script (hand-curated template with injected links). Given the project requirement for a **hybrid hand-curated + generated** approach, the recommended path is the SignalWire plugin with manual section configuration, falling back to a custom script only if the plugin's section customization proves insufficient.

---

## New Additions for v1.3

### 1. llms.txt Generation

#### Recommended: `@signalwire/docusaurus-plugin-llms-txt`

| Property | Value |
|----------|-------|
| Package | `@signalwire/docusaurus-plugin-llms-txt` |
| Version | `1.2.2` (stable) or `2.0.0-alpha.7` (latest pre-release) |
| Peer dependency | `@docusaurus/core ^3.0.0` -- compatible with 3.9.2 |
| License | MIT |
| Published | 2025-07-23 (v1.2.2) |

**Why this plugin:**
- Processes final rendered HTML, not source MDX -- captures resolved components, frontmatter, and generated API pages
- Supports **manual section definitions** with custom names and route patterns, plus auto-generated sections from URL depth -- this is the "hybrid" capability the project needs
- Generates both `llms.txt` (index with links) and optional `llms-full.txt` (all content inlined)
- Handles the 125 generated API endpoint pages automatically
- Shares 3 dependencies with the existing project (`unified ^11`, `remark-stringify ^11`, `unist-util-visit ^5`) -- minimal dependency bloat

**How it achieves the hybrid approach:**
1. Define manual sections for product-first organization (e.g., "1NCE Connect", "1NCE OS") with hand-curated descriptions and explicit route patterns
2. Let `autoSectionDepth` fill in link lists from matching built pages
3. Hand-curate the section names, ordering, and descriptions; let the plugin auto-discover the links within each section

**Configuration sketch:**
```typescript
['@signalwire/docusaurus-plugin-llms-txt', {
  llmsTxt: {
    title: '1NCE Developer Hub',
    description: 'Documentation for 1NCE IoT connectivity services',
    sections: [
      {
        name: '1NCE Connect',
        description: 'SIM management, connectivity, and network services',
        routes: ['/docs/connectivity-services/', '/docs/network-services/', '/docs/sim-cards/'],
      },
      {
        name: '1NCE OS',
        description: 'IoT operating system, device integration, data broker',
        routes: ['/docs/1nce-os/'],
      },
      {
        name: '1NCE Portal',
        description: 'Web portal for SIM management and account administration',
        routes: ['/docs/1nce-portal/'],
      },
      {
        name: 'API Reference',
        description: 'REST API endpoints for programmatic access',
        routes: ['/api/'],
      },
    ],
    autoSectionDepth: 2,
    generateFullTxt: true,
  },
  markdown: {
    contentSelector: 'article',
  },
}]
```

**Risk:** MEDIUM. The plugin's manual section configuration API is not fully documented in the README. The configuration sketch above is based on the plugin's described capabilities (manual sections with custom names and route patterns) but exact option names may differ. Recommend installing the plugin and inspecting its TypeScript types (`node_modules/@signalwire/docusaurus-plugin-llms-txt/lib/types.d.ts`) during implementation.

**Fallback:** If the plugin's section customization proves too limited, write a custom Docusaurus plugin (postBuild lifecycle hook) that:
1. Reads a hand-curated `llms-template.md` from the project root
2. Uses `glob` (already in devDeps) to discover built `.html` files
3. Injects link lists into marked sections of the template
4. Writes `llms.txt` to the `build/` directory

The custom approach uses no new dependencies -- `glob`, `unified`, `remark-stringify`, and `gray-matter` are already in the project.

#### Companion Theme (Optional)

| Property | Value |
|----------|-------|
| Package | `@signalwire/docusaurus-theme-llms-txt` |
| Version | `1.2.2` |
| Purpose | Adds copy-to-clipboard UI, page-level `.md` download links |

**Recommendation:** Skip for v1.3. The theme adds UI flourishes that are not part of the v1.3 scope. The plugin alone generates the files.

### 2. robots.txt -- Static File

**No plugin needed.** Docusaurus does not generate robots.txt. Place it in `static/robots.txt` and it will be copied to `build/robots.txt`, served at `https://help.1nce.com/robots.txt`.

```
User-agent: *
Allow: /

Sitemap: https://help.1nce.com/sitemap.xml
```

The sitemap.xml is already generated by `@docusaurus/plugin-sitemap` (included in preset-classic). No new packages.

| Item | Status |
|------|--------|
| sitemap.xml generation | Already handled by preset-classic |
| robots.txt | Static file, zero dependencies |
| CloudFront compatibility | Static files from S3 are served directly, no special config needed |

**Confidence:** HIGH -- verified against Docusaurus official SEO docs.

### 3. skill.md at `/.well-known/skills/`

**Important caveat:** The `/.well-known/skills/` convention with `skill.md` and `index.json` discovery is NOT an established public standard. No RFC, no widely-adopted specification repository, and no GitHub repositories were found documenting this convention. It appears to be a project-defined or emerging convention.

**Confidence:** LOW on the convention itself. HIGH on the serving mechanism.

**Serving mechanism:** Place files in `static/.well-known/skills/`:
```
static/
  .well-known/
    skills/
      index.json       # Discovery manifest
      1nce-api.md      # Skill file for API integration
```

Docusaurus copies the `static/` directory structure to `build/` preserving hierarchy. Files at `static/.well-known/skills/index.json` will be served at `https://help.1nce.com/.well-known/skills/index.json`.

**CloudFront consideration:** The existing CloudFront Function rewrites paths to `index.html` for SPA routing. It must NOT rewrite requests for `/.well-known/*`, `robots.txt`, `llms.txt`, or `sitemap.xml`. The CloudFront Function likely already handles this correctly (it should only rewrite paths without file extensions), but **verify during implementation**.

**No npm packages needed.** These are hand-authored static files.

---

## Summary of New Packages

| Package | Version | Purpose | Required? |
|---------|---------|---------|-----------|
| `@signalwire/docusaurus-plugin-llms-txt` | `^1.2.2` | llms.txt + llms-full.txt generation | YES (recommended) |

That's it. One new package.

### Installation

```bash
npm install @signalwire/docusaurus-plugin-llms-txt@^1.2.2
```

### New Static Files (no packages needed)

| File | Served At | Hand-Authored? |
|------|-----------|----------------|
| `static/robots.txt` | `/robots.txt` | Yes |
| `static/.well-known/skills/index.json` | `/.well-known/skills/index.json` | Yes |
| `static/.well-known/skills/1nce-api.md` | `/.well-known/skills/1nce-api.md` | Yes |

---

## Alternatives Considered

| Recommended | Alternative | Why Not |
|-------------|-------------|---------|
| `@signalwire/docusaurus-plugin-llms-txt` for llms.txt | Custom postBuild script | Plugin handles HTML-to-Markdown conversion, page discovery, and section organization. Only fall back to custom if plugin sections are too rigid. |
| `@signalwire/docusaurus-plugin-llms-txt` v1.2.2 (stable) | v2.0.0-alpha.7 (pre-release) | Alpha releases risk breaking changes. v1.2.2 is stable and sufficient. |
| Static `robots.txt` in `static/` | `docusaurus-plugin-robots-txt` npm package | Over-engineering. A 3-line static file does not need a plugin. |
| Static skill.md files in `static/.well-known/` | Docusaurus plugin to generate skill.md | The skill files are entirely hand-authored (auth flows, patterns, gotchas). No generation needed. |
| Skip `@signalwire/docusaurus-theme-llms-txt` | Install it for UI features | Out of scope for v1.3. The theme adds per-page markdown download buttons -- not a v1.3 requirement. |

---

## What NOT to Add

| Technology | Why Not |
|------------|---------|
| `docusaurus-plugin-robots-txt` | Static file is simpler and more maintainable than a plugin for 3 lines of config |
| `@signalwire/docusaurus-theme-llms-txt` | UI theme for llms.txt pages -- not needed for v1.3 scope (file generation only) |
| Any `sitemap.xml` changes | Already generated by preset-classic, already correct. Just reference it from robots.txt. |
| Custom Docusaurus plugin for robots.txt | Static file. Zero complexity. |
| `generate-robotstxt` npm package | Designed for webpack/build pipelines. A static file is the Docusaurus-idiomatic approach. |

---

## Integration with Existing Config

### docusaurus.config.ts Changes

Add the llms.txt plugin to the existing `plugins` array:

```typescript
plugins: [
  // ... existing plugins (api docs, openapi, client-redirects, sass, polyfill)
  ['@signalwire/docusaurus-plugin-llms-txt', {
    // Section configuration -- exact options TBD after type inspection
  }],
],
```

No other config changes needed. No theme changes. No preset changes.

### CloudFront Function Verification

The existing CloudFront Function at `/scripts/` or in the CloudFormation template must be checked to ensure it does NOT rewrite these paths to `index.html`:
- `/robots.txt`
- `/llms.txt`
- `/llms-full.txt`
- `/.well-known/*`
- `/sitemap.xml` (already working, but verify)

Typical CloudFront Functions check for a file extension or known static paths before rewriting. If the function rewrites ALL paths without extensions, `robots.txt` and `llms.txt` (which have extensions) should be fine, but `/.well-known/skills/` (directory path) may need an exception.

### Shared Dependencies (No Conflicts Expected)

The plugin's dependencies overlap with existing project deps:

| Dependency | Plugin Needs | Project Has | Conflict? |
|------------|-------------|-------------|-----------|
| `unified` | `^11` | `^11.0.5` | No |
| `remark-stringify` | `^11` | `^11.0.0` | No |
| `unist-util-visit` | `^5` | `^5.1.0` | No |
| `remark-gfm` | `^4` | Bundled with Docusaurus | No |
| `rehype-parse` | `^9` | Not installed | New transitive dep |
| `rehype-remark` | `^10` | Not installed | New transitive dep |
| `fs-extra` | `^11` | Not installed | New transitive dep |
| `p-map` | `^7` | Not installed | New transitive dep |

No version conflicts expected. The 4 new transitive dependencies are standard ecosystem packages.

---

## Sources

- llms.txt specification: `https://llmstxt.org/` -- format and requirements (HIGH confidence)
- `@signalwire/docusaurus-plugin-llms-txt` npm: v1.2.2, peer dep `@docusaurus/core ^3.0.0` (HIGH confidence -- verified via npm CLI)
- SignalWire plugin GitHub: `github.com/signalwire/docusaurus-plugins` -- features and configuration (MEDIUM confidence -- README describes capabilities but exact config option names not fully documented)
- Docusaurus static assets: `docusaurus.io/docs/static-assets` -- files in `static/` copied to `build/` root (HIGH confidence)
- Docusaurus SEO docs: `docusaurus.io/docs/seo` -- robots.txt as static asset, sitemap from preset-classic (HIGH confidence)
- skill.md / `.well-known/skills/` convention: No public specification found (LOW confidence on the convention; HIGH confidence on the serving mechanism via Docusaurus static files)
- Current project `package.json` and `docusaurus.config.ts` -- direct inspection (HIGH confidence)

---
*Stack research for: v1.3 AI & Search Readiness*
*Researched: 2026-04-03*
