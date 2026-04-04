# Phase 11: LLM Discoverability - Research

**Researched:** 2026-04-04
**Domain:** llms.txt generation via Docusaurus postBuild plugin
**Confidence:** HIGH

## Summary

Phase 11 adds an `llms.txt` file to the site root following the llmstxt.org specification. The implementation is a custom Docusaurus plugin using the `postBuild` lifecycle hook that reads a hand-curated template from `static/llms-template.txt`, scans doc source files for frontmatter titles, and writes the final `llms.txt` to the build output directory.

The codebase has 166 documentation `.md`/`.mdx` files across 10 top-level sections in `docs/documentation/`, plus 6 API spec directories in `docs/api/`. All doc files have `title` in YAML frontmatter. The plugin needs to map filesystem sections to product-first H2/H3 groupings (1NCE Connect, 1NCE OS, API Reference) and generate markdown link lists under each section. API links point to the 6 spec landing pages only (the `.info.mdx` files), not individual endpoints.

**Primary recommendation:** Build a single-file custom Docusaurus plugin that reads `static/llms-template.txt` (with placeholder markers like `<!-- LINKS:section-name -->`), discovers all doc pages via filesystem scan + gray-matter frontmatter parsing, generates markdown link lists organized by the D-03 section mapping, and writes `build/llms.txt`.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Use product-first organization with three H2 sections: `## 1NCE Connect`, `## 1NCE OS`, `## API Reference`
- **D-02:** Detailed preamble blockquote (3-5 sentences) covering both product lines, target audience (IoT developers), and what the docs help with
- **D-03:** Section mapping -- 1NCE Connect: Introduction, Connectivity Services, Network Services, SIM Cards, Platform Services, Blueprints/Examples, 1NCE Portal, MCP Server, Troubleshooting. 1NCE OS: 1NCE OS section. API Reference: all 6 OpenAPI specs.
- **D-04:** Use page frontmatter titles (or first H1) as link labels -- no section prefix
- **D-05:** API Reference links grouped by spec (6 links to spec landing pages), not individual endpoints
- **D-06:** Doc pages grouped under H3 sub-headings within each product section (e.g., `### Connectivity Services` under `## 1NCE Connect`) -- preserves hierarchy
- **D-07:** Absolute URLs with full domain (https://help.1nce.com/docs/...)
- **D-08:** Custom Docusaurus plugin using `postBuild` lifecycle hook -- idiomatic, has access to route metadata and content
- **D-09:** Hand-curated template lives at `static/llms-template.txt` -- consistent with robots.txt pattern. Plugin reads template as input, writes final llms.txt to build output directory.
- **D-10:** Include all ~298 doc pages in auto-generated links -- llms.txt is a manifest for discoverability, not a curated summary
- **D-11:** API Reference includes spec landing pages only (6 links), not all 125 individual endpoints

### Claude's Discretion
- Plugin implementation details (file structure, helper functions, error handling)
- Exact preamble wording (within the "detailed overview" style decision)
- Template file format/syntax for marking auto-generated sections

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| LLM-01 | Site serves llms.txt at root following llmstxt.org specification (H1, blockquote summary, H2 sections) | llmstxt.org spec verified: H1 required, blockquote optional, H2-delimited sections with markdown link lists. Template provides H1+blockquote; plugin writes to `build/llms.txt` which S3+CloudFront serves at root. |
| LLM-02 | llms.txt uses product-first organization with sections for 1NCE Connect, 1NCE OS, and API Reference | D-01/D-03/D-06 define the section mapping. Plugin maps 10 filesystem directories to 3 H2 sections with H3 sub-headings. |
| LLM-03 | llms.txt link sections are auto-generated at build time from existing docs and OpenAPI specs | postBuild plugin scans `docs/documentation/` and `docs/api/` for frontmatter titles, generates link lists. Runs on every build automatically. |
| LLM-04 | llms.txt preamble and section structure are hand-curated in a template file | Template at `static/llms-template.txt` contains curated prose + placeholder markers. Plugin injects generated links at markers. |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Docusaurus postBuild plugin | 3.9.2 (project version) | Build-time llms.txt generation | Locked decision D-08. Idiomatic lifecycle hook, runs after every build automatically. |
| gray-matter | ^4.0 (already available) | YAML frontmatter parsing | Already a transitive dependency in node_modules. Battle-tested for extracting `title` from doc files. |
| Node.js fs/path | built-in | File I/O and path manipulation | No external deps needed for file scanning and writing. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| glob (node built-in) | Node 20+ | File discovery with patterns | Use `fs.readdirSync` recursive or `glob` to find all `.md`/`.mdx` files. Node 20 has `fs.globSync` but `readdirSync({recursive: true})` is simpler. |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Custom postBuild plugin | docusaurus-plugin-llms v0.3.0 | Plugin auto-generates from file paths, cannot do product-first organization with curated prose between sections. Rejected per D-08. |
| Custom postBuild plugin | Standalone post-build script | Works but not idiomatic. Plugin integrates into Docusaurus lifecycle, no extra npm script step needed. D-08 locks this. |
| gray-matter | Manual regex frontmatter parsing | gray-matter handles edge cases (TOML, JSON frontmatter, delimiters). Already available. No reason to hand-roll. |

**Installation:**
```bash
# No new packages needed. gray-matter is already available as transitive dep.
# If explicit dependency is desired:
npm install --save-dev gray-matter
```

## Architecture Patterns

### Recommended Project Structure
```
plugins/
  llms-txt-plugin.ts          # Custom Docusaurus plugin
static/
  llms-template.txt           # Hand-curated template with placeholder markers
  robots.txt                  # Existing static file (pattern to follow)
```

### Pattern 1: postBuild Plugin with Template Injection
**What:** A Docusaurus plugin that implements `postBuild()` to read a template, scan source docs, generate link lists, and write the final file to `outDir`.
**When to use:** When you need to generate a file that combines curated content with dynamically derived content at build time.
**Example:**
```typescript
// plugins/llms-txt-plugin.ts
import type {LoadContext, Plugin} from '@docusaurus/types';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Section mapping per D-03
const CONNECT_SECTIONS = [
  'introduction', 'connectivity-services', 'network-services',
  'sim-cards', 'platform-services', 'blueprints-examples',
  '1nce-portal', 'mcp-server', 'troubleshooting',
];
const OS_SECTIONS = ['1nce-os'];

// API spec landing pages per D-05/D-11
const API_SPECS = [
  { dir: 'authorization', infoFile: 'authorization.info.mdx', title: 'Authorization', route: '/api/authorization/authorization/' },
  { dir: 'sim-management', infoFile: 'sim-management.info.mdx', title: 'SIM Management', route: '/api/sim-management/sim-management/' },
  { dir: 'order-management', infoFile: 'order-management.info.mdx', title: 'Order Management', route: '/api/order-management/order-management/' },
  { dir: 'product-information', infoFile: 'product-information.info.mdx', title: 'Product Information', route: '/api/product-information/product-information/' },
  { dir: 'support-management', infoFile: 'support-management.info.mdx', title: 'Support Management', route: '/api/support-management/support-management/' },
  { dir: '1nce-os', infoFile: '1-nce-os.info.mdx', title: '1NCE OS API', route: '/api/1nce-os/1-nce-os/' },
];

export default function llmsTxtPlugin(context: LoadContext): Plugin {
  return {
    name: 'llms-txt-plugin',
    async postBuild({outDir, siteConfig}) {
      const baseUrl = siteConfig.url; // https://help.1nce.com
      const templatePath = path.join(context.siteDir, 'static', 'llms-template.txt');
      const template = fs.readFileSync(templatePath, 'utf-8');

      // Scan docs, generate links, replace placeholders
      // ... (implementation details)

      fs.writeFileSync(path.join(outDir, 'llms.txt'), finalContent);
    },
  };
}
```

### Pattern 2: Template Placeholder Syntax
**What:** Use HTML comment markers in the template to delimit where auto-generated content goes.
**When to use:** When mixing hand-curated prose with generated content.
**Example:**
```markdown
# 1NCE Developer Hub

> The 1NCE Developer Hub provides comprehensive documentation for IoT developers...

## 1NCE Connect

### Introduction
<!-- LINKS:introduction -->

### Connectivity Services
<!-- LINKS:connectivity-services -->

## 1NCE OS

### 1NCE OS
<!-- LINKS:1nce-os -->

## API Reference
<!-- LINKS:api -->
```

The plugin replaces each `<!-- LINKS:section-name -->` marker with the generated markdown link list for that section.

### Pattern 3: Filesystem-to-Route Mapping
**What:** Derive the URL route from the filesystem path of a doc file, matching Docusaurus routing conventions.
**When to use:** When postBuild hook does not provide rich route metadata.
**Rules for this project:**
- `docs/documentation/intro/welcome.md` with `slug: /` -> `https://help.1nce.com/docs/`
- `docs/documentation/connectivity-services/file.md` -> `https://help.1nce.com/docs/connectivity-services/file/`
- `docs/documentation/section/subsection/file.md` -> `https://help.1nce.com/docs/section/subsection/file/`
- `docs/documentation/section/index.md` -> `https://help.1nce.com/docs/section/`
- API info pages use known fixed routes (hardcoded in API_SPECS mapping)

**Key detail:** The `routesPaths` array from `postBuild` provides all built routes. The plugin can cross-reference its generated URLs against `routesPaths` to validate that links are not broken.

### Anti-Patterns to Avoid
- **Putting generated output in `static/`:** Generated files in `static/` get committed to git, causing stale content. Write directly to `build/` via `outDir`.
- **Scanning build HTML for titles:** Parsing `<title>` tags from built HTML is fragile. Use source frontmatter instead.
- **Hardcoding all links:** Defeats the purpose of auto-generation. Only hardcode the section mapping and API spec routes; let page links be discovered.
- **Using `docusaurus-plugin-llms`:** Cannot achieve product-first organization (D-01). The plugin organizes by file path.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| YAML frontmatter parsing | Custom regex parser | gray-matter | Edge cases with multiline values, TOML frontmatter, empty frontmatter |
| File discovery | Manual recursive directory walking | `fs.readdirSync(dir, {recursive: true})` | Node 20 built-in, handles symlinks and edge cases |

**Key insight:** The plugin itself is lightweight -- the hard parts (frontmatter parsing, file discovery) are solved by existing tools. The plugin's unique value is the section mapping logic.

## Common Pitfalls

### Pitfall 1: Slug Override in Frontmatter
**What goes wrong:** Some docs have `slug: /` or custom slugs in frontmatter that override the filesystem-derived route.
**Why it happens:** The introduction page (`introduction/introduction-welcome.md`) has `slug: /` making it the docs root.
**How to avoid:** Check for `slug` in frontmatter. If present, use it to compute the URL instead of deriving from filepath. Cross-reference against `routesPaths` for validation.
**Warning signs:** Links in llms.txt returning 404s.

### Pitfall 2: Troubleshooting Section is Special
**What goes wrong:** The Troubleshooting sidebar category in `docusaurus.config.ts` has a custom `sidebarItemsGenerator` that replaces child items with a single external link. But the source docs may still have files in `docs/documentation/troubleshooting/`.
**Why it happens:** The config overrides troubleshooting children at sidebar level, not at the filesystem level.
**How to avoid:** Check if `docs/documentation/troubleshooting/` actually has doc files. If it only has category metadata or the pages are not rendered, skip or handle specially.
**Warning signs:** Links to troubleshooting sub-pages that don't exist in the build.

### Pitfall 3: Template Not Found in Build Context
**What goes wrong:** The template is at `static/llms-template.txt` which Docusaurus copies to `build/llms-template.txt`. But in `postBuild`, you should read from `static/` (source) not `build/` to avoid the template itself being served publicly.
**Why it happens:** `static/` files are auto-copied to build output.
**How to avoid:** Read the template from `path.join(siteDir, 'static', 'llms-template.txt')`. After writing the final `llms.txt` to `outDir`, delete or don't worry about `build/llms-template.txt` -- or use a naming convention that makes it clear it's a template (the `-template` suffix helps). Alternatively, place the template outside `static/` (e.g., `templates/llms.txt.template`) to prevent it from being served. Decision D-09 says `static/llms-template.txt` so the template WILL be copied to build and publicly accessible. This is acceptable -- it's not sensitive data.

### Pitfall 4: baseUrl Differences Between Deploy Targets
**What goes wrong:** The project supports GitHub Pages (`baseUrl: '/docusaurus-poc/'`) and production (`baseUrl: '/'`). Links in llms.txt must use the correct base URL.
**Why it happens:** `isGitHubPages` flag in `docusaurus.config.ts`.
**How to avoid:** Use `siteConfig.url` and `siteConfig.baseUrl` from the postBuild props to construct absolute URLs. D-07 requires `https://help.1nce.com/docs/...` but the plugin should be environment-aware.
**Warning signs:** Links pointing to wrong domain in GitHub Pages preview builds.

### Pitfall 5: Index Files vs Category Pages
**What goes wrong:** Some sections have `index.md` files that serve as category landing pages. These should not be listed as separate link items -- they ARE the section link.
**Why it happens:** Docusaurus treats `index.md` in a directory as the category intro page.
**How to avoid:** When scanning a section directory, if an `index.md` exists, use its title as a potential section link but don't duplicate it in the child link list. Or include it as the first link in the sub-section.

## Code Examples

### Reading Frontmatter from Doc Files
```typescript
import matter from 'gray-matter';
import fs from 'fs';
import path from 'path';

interface DocInfo {
  title: string;
  slug?: string;
  relativePath: string;  // relative to docs root
  sidebarPosition?: number;
}

function scanDocs(docsDir: string): DocInfo[] {
  const files = fs.readdirSync(docsDir, {recursive: true, encoding: 'utf-8'});
  return files
    .filter(f => f.endsWith('.md') || f.endsWith('.mdx'))
    .map(f => {
      const content = fs.readFileSync(path.join(docsDir, f), 'utf-8');
      const {data} = matter(content);
      return {
        title: data.title || path.basename(f, path.extname(f)),
        slug: data.slug,
        relativePath: f,
        sidebarPosition: data.sidebar_position,
      };
    });
}
```

### Generating a Markdown Link List
```typescript
function generateLinkList(docs: DocInfo[], baseUrl: string, routePrefix: string): string {
  return docs
    .sort((a, b) => (a.sidebarPosition ?? 999) - (b.sidebarPosition ?? 999))
    .map(doc => {
      const url = doc.slug
        ? `${baseUrl}${routePrefix}${doc.slug}`
        : `${baseUrl}${routePrefix}${doc.relativePath.replace(/\.mdx?$/, '/').replace(/\/index\/$/, '/')}`;
      return `- [${doc.title}](${url})`;
    })
    .join('\n');
}
```

### Plugin Registration in docusaurus.config.ts
```typescript
// In the plugins array:
plugins: [
  // ... existing plugins ...
  './plugins/llms-txt-plugin.ts',
],
```

Docusaurus supports TypeScript plugin files natively when using `.ts` extension. The plugin exports a default function.

### Filesystem-to-Section Mapping
```typescript
// Per D-03: which filesystem directories map to which product sections
const SECTION_MAP: Record<string, {product: 'connect' | 'os', label: string}> = {
  'introduction':          {product: 'connect', label: 'Introduction'},
  'connectivity-services': {product: 'connect', label: 'Connectivity Services'},
  'network-services':      {product: 'connect', label: 'Network Services'},
  'sim-cards':             {product: 'connect', label: 'SIM Cards'},
  'platform-services':     {product: 'connect', label: 'Platform Services'},
  'blueprints-examples':   {product: 'connect', label: 'Blueprints & Examples'},
  '1nce-portal':           {product: 'connect', label: '1NCE Portal'},
  'mcp-server':            {product: 'connect', label: 'MCP Server'},
  'troubleshooting':       {product: 'connect', label: 'Troubleshooting'},
  '1nce-os':               {product: 'os',      label: '1NCE OS'},
};
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| No LLM discoverability | llms.txt at site root | 2024 (llmstxt.org spec) | LLMs can discover and index documentation structure |
| Manual page lists | Build-time auto-generation | Current best practice | Links stay in sync with content changes |
| File-path organization | Product-first organization | Project decision | Better UX for LLMs understanding product domain |

**Existing plugins (not used):**
- `docusaurus-plugin-llms` v0.3.0 (2026-02-08): Auto-generates llms.txt but organizes by file path, not product. Rejected per D-08.
- `@signalwire/docusaurus-plugin-llms-txt` v1.2.2: More mature but still file-path oriented. Not evaluated further given D-08 decision.

## Open Questions

1. **Troubleshooting section content**
   - What we know: The sidebar generator in `docusaurus.config.ts` replaces Troubleshooting children with a single external link
   - What's unclear: Whether `docs/documentation/troubleshooting/` contains actual renderable doc files
   - Recommendation: Check during implementation. If no doc pages render under troubleshooting, the H3 sub-heading in llms.txt should either be omitted or contain just a note about the external support link.

2. **Template exposure**
   - What we know: `static/llms-template.txt` will be copied to `build/llms-template.txt` and publicly served
   - What's unclear: Whether this is acceptable (it contains placeholder markers that look odd)
   - Recommendation: Acceptable -- not sensitive. Alternatively, could place template in a non-static directory (e.g., `templates/`) but D-09 specifies `static/`. Follow D-09.

3. **MCP Server and Introduction sections**
   - What we know: These are listed in D-03 under 1NCE Connect
   - What's unclear: How many pages each contains (could be just 1-2 pages)
   - Recommendation: Include regardless of page count. Even single-page sections get an H3 heading.

## Detailed Filesystem Analysis

### Documentation Sections (docs/documentation/)
| Directory | Category Label | Position | Product Group (D-03) |
|-----------|---------------|----------|---------------------|
| introduction | Introduction | 1 | 1NCE Connect |
| 1nce-portal | 1NCE Portal | 2 | 1NCE Connect |
| sim-cards | SIM Cards | 3 | 1NCE Connect |
| mcp-server | MCP Server | 4 | 1NCE Connect |
| connectivity-services | Connectivity Services | 5 | 1NCE Connect |
| platform-services | Platform Services | 6 | 1NCE Connect |
| network-services | Network Services | 7 | 1NCE Connect |
| 1nce-os | 1NCE OS | 8 | 1NCE OS |
| troubleshooting | Troubleshooting | 9 | 1NCE Connect |
| blueprints-examples | Blueprints & Examples | 10 | 1NCE Connect |

### API Spec Landing Pages (docs/api/)
| Spec Directory | Info File | Route |
|----------------|-----------|-------|
| authorization | authorization.info.mdx | /api/authorization/authorization/ |
| sim-management | sim-management.info.mdx | /api/sim-management/sim-management/ |
| order-management | order-management.info.mdx | /api/order-management/order-management/ |
| product-information | product-information.info.mdx | /api/product-information/product-information/ |
| support-management | support-management.info.mdx | /api/support-management/support-management/ |
| 1nce-os | 1-nce-os.info.mdx | /api/1nce-os/1-nce-os/ |

### Key Frontmatter Pattern
All documentation files use:
```yaml
---
title: "Page Title"
description: "Optional description"
sidebar_position: N
slug: "/optional-custom-slug"  # rare, only introduction-welcome.md uses slug: /
---
```

## Sources

### Primary (HIGH confidence)
- llmstxt.org specification -- fetched and verified 2026-04-04
- Docusaurus lifecycle APIs (docusaurus.io/docs/api/plugin-methods/lifecycle-apis) -- postBuild hook verified
- Project codebase direct inspection -- `docusaurus.config.ts`, `docs/`, `static/`, `build/`, `_category_.json` files

### Secondary (MEDIUM confidence)
- Prior architecture research (`.planning/research/ARCHITECTURE.md`) -- verified against current CONTEXT.md decisions

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - No new dependencies needed, all tools already available
- Architecture: HIGH - postBuild plugin pattern is well-documented, template injection is straightforward
- Pitfalls: HIGH - Identified from direct codebase inspection (slug overrides, troubleshooting special case, baseUrl differences)

**Research date:** 2026-04-04
**Valid until:** 2026-05-04 (stable domain, no fast-moving dependencies)
