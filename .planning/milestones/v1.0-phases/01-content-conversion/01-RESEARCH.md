# Phase 1: Content Conversion - Research

**Researched:** 2026-03-20
**Domain:** ReadMe.com Markdown to Docusaurus MDX conversion pipeline
**Confidence:** HIGH

## Summary

Phase 1 converts 298 exported ReadMe.com Markdown files into valid Docusaurus MDX that builds without errors. The export contains 6 distinct proprietary syntax patterns that will crash the Docusaurus MDX parser if left unconverted: `<HTMLBlock>` (56 instances in 42 files), `<Image>` JSX (177 instances in 54 files), `(doc:slug)` links (112 occurrences in 44 files), `<Table>` JSX (17 instances in 13 files), blockquote admonitions (11 occurrences in 7 files), and base64-encoded inline images (40 images in 31 files). Additionally, 207 remote images hosted on `files.readme.io` across 62 files must be downloaded locally.

The conversion must be implemented as an automated, idempotent Node.js pipeline that reads from the export directory and writes to a new Docusaurus `docs/` folder. Each syntax pattern gets its own conversion step so individual steps can be debugged and re-run independently. The pipeline also scaffolds the Docusaurus project, normalizes folder names, converts ReadMe frontmatter to Docusaurus-compatible fields, and generates sidebar configuration from `_order.yaml` files.

**Primary recommendation:** Build a multi-step Node.js pipeline with one script per conversion concern (images, links, HTMLBlocks, tables, admonitions, frontmatter), plus a Docusaurus scaffold step and sidebar generator. Run `docusaurus build` as the ultimate validation gate after each pipeline run.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Node.js for all conversion scripts (same ecosystem as Docusaurus)
- **D-02:** Multi-step pipeline -- separate scripts for each pattern (images, links, admonitions, HTMLBlock, tables, frontmatter) so individual steps can be debugged and re-run independently
- **D-03:** Scripts read from the export folder (`dev-hub-v2.6-*/`) and write to a new Docusaurus `docs/` folder -- original export preserved as reference
- **D-04:** Scripts must be idempotent -- re-runnable on fresh ReadMe exports without breaking anything
- **D-05:** Download all remote images from `files.readme.io` to `/static/img/` locally -- no dependency on ReadMe servers
- **D-06:** Image folder structure mirrors doc hierarchy: `/static/img/1nce-os/device-controller/image.png`
- **D-07:** Base64-encoded images inside HTMLBlocks extracted to `.png` files in `/static/img/`, replaced with standard image references
- **D-08:** Folder names normalized from export (lowercase, hyphens) but same hierarchy preserved -- e.g., "1NCE OS" becomes "1nce-os", "Blueprints & Examples" becomes "blueprints-examples"
- **D-09:** Sidebar generation is a separate standalone tool (not part of the content conversion pipeline) that reads `_order.yaml` files and generates Docusaurus sidebar config
- **D-10:** Recipes (AT command tutorials) merged under Blueprints & Examples -- they're similar content, not a separate docs instance
- **D-11:** Skip AI support agent HTML pages (`ai-support-agent.html`, `ai-support-agent-brazil.html`) -- ReadMe-specific integrations, not standard docs
- **D-12:** HTMLBlocks with complex CSS layouts (grids, custom styling) should be recreated closely as custom MDX components -- match the original visual layout, not just extract raw content
- **D-13:** `custom_pages/terms-abbreviations.md` included in the migration as a standard docs page

### Claude's Discretion
- Exact Docusaurus version selection (latest stable 3.x)
- Frontmatter field mapping details (ReadMe to Docusaurus)
- Script file organization and naming
- Error handling and logging approach in conversion scripts
- How to handle edge cases in HTMLBlock conversion

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CONV-01 | All 298 Markdown files converted to valid MDX that builds without errors | Docusaurus scaffold + full pipeline run + `docusaurus build` validation |
| CONV-02 | `<HTMLBlock>` components (42 files, 56 instances) converted to standard MDX-compatible markup | HTMLBlock converter script -- strips wrapper, handles inline CSS, converts `class` to `className`, extracts base64 images |
| CONV-03 | `<Image>` JSX tags (54 files, 177 instances) converted to standard Markdown image syntax with local paths | Image converter script -- parses JSX attributes (src, alt, width, align), outputs `![alt](/img/path.png)` |
| CONV-04 | Remote images from `files.readme.io` (207 URLs in 62 files) downloaded to `/static/img/` directory | Image download script -- fetches all remote URLs, saves with hierarchy-mirroring paths, rewrites references |
| CONV-05 | Base64-encoded inline images (40 images in 31 files) extracted to static image files | Base64 extractor script -- decodes data URIs, saves as PNG/JPEG, replaces with standard image refs |
| CONV-06 | `(doc:slug)` cross-reference links (112 occurrences in 44 files) converted to Docusaurus internal links | Link converter script -- builds slug-to-path lookup table from all files, rewrites links using the table |
| CONV-07 | Blockquote admonitions (`:warning:`, `:info:`, etc. -- 11 occurrences in 7 files) converted to Docusaurus `:::` admonitions | Admonition converter script -- regex replaces `> :type:` with `:::type` blocks |
| CONV-08 | `<Table>` JSX components (13 files, 17 instances) converted to standard Markdown tables | Table converter script -- parses JSX table structure, extracts text content, outputs GFM tables |
| CONV-09 | ReadMe YAML frontmatter converted to Docusaurus-compatible frontmatter (title, description, slug) | Frontmatter converter script -- maps ReadMe fields to Docusaurus equivalents |
| CONV-10 | Conversion implemented as automated Node.js script (not manual per-file editing) | Orchestrator script that runs all conversion steps in order |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @docusaurus/core | 3.9.2 | Static site generator | Latest stable. Required as the target build system for all converted content. |
| @docusaurus/preset-classic | 3.9.2 | Docs + blog + pages preset | Standard preset bundled with Docusaurus scaffold. Includes docs plugin, theme-classic, sitemap. |
| @docusaurus/faster | 3.9.2 | Rspack-based bundler | 2-5x faster builds. With 298 pages this significantly speeds up the build validation cycle. |
| React | ^18.x (bundled) | UI framework | Ships with Docusaurus 3.x. No separate install needed. |
| TypeScript | ^5.x | Type safety for config | Docusaurus supports `docusaurus.config.ts` natively. Use for config files. |

### Migration Tooling (devDependencies)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| gray-matter | 4.0.3 | Frontmatter parsing | Parse and transform YAML frontmatter in each Markdown file during conversion. |
| glob | 13.0.6 | File discovery | Find all `.md` files in the export directory for batch processing. |
| js-yaml | 4.1.1 | YAML parsing | Parse `_order.yaml` files for sidebar generation. |
| node:fs/promises | (built-in) | File I/O | Read/write files during conversion. No external dependency needed. |
| node:path | (built-in) | Path manipulation | Normalize paths, construct output directories. |
| node:https | (built-in) | HTTP client | Download remote images from `files.readme.io`. No need for axios/node-fetch. |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| node:https | axios/node-fetch | Adds a dependency for simple GET requests. Built-in is sufficient for image downloads. |
| glob | fast-glob | fast-glob is faster but glob 13.x is plenty fast for 298 files and has simpler API. |
| Custom regex transforms | unified/remark AST | AST approach is more robust but significantly more complex for 6 targeted pattern conversions. Regex is pragmatic for known, consistent patterns. |

**Installation:**
```bash
npx create-docusaurus@3.9.2 help-1nce-docs classic --typescript
cd help-1nce-docs
npm install @docusaurus/faster@3.9.2
npm install --save-dev gray-matter@4.0.3 glob@13.0.6 js-yaml@4.1.1 @types/js-yaml
```

**Version verification (confirmed 2026-03-20):**
| Package | Registry Version | Verified |
|---------|-----------------|----------|
| @docusaurus/core | 3.9.2 | Yes |
| @docusaurus/preset-classic | 3.9.2 | Yes (same release) |
| @docusaurus/faster | 3.9.2 | Yes |
| gray-matter | 4.0.3 | Yes |
| glob | 13.0.6 | Yes |
| js-yaml | 4.1.1 | Yes |

## Architecture Patterns

### Recommended Project Structure
```
help-1nce-docs/
|-- docusaurus.config.ts         # Docusaurus configuration
|-- package.json
|-- tsconfig.json
|
|-- docs/                        # Converted documentation content (output of pipeline)
|   |-- introduction/
|   |-- sim-cards/
|   |-- connectivity-services/
|   |-- network-services/
|   |-- mcp-server/
|   |-- troubleshooting/
|   |-- 1nce-portal/
|   |-- platform-services/
|   |-- 1nce-os/
|   |-- blueprints-examples/     # Merged: Blueprints & Examples + Recipes
|   |-- terms-abbreviations.md   # From custom_pages
|
|-- static/
|   |-- img/                     # All migrated images (remote + extracted base64)
|       |-- introduction/
|       |-- 1nce-os/
|       |   |-- device-controller/
|       |   |-- energy-saver/
|       |-- ...
|
|-- scripts/                     # Conversion pipeline scripts
|   |-- 00-scaffold.ts           # Scaffold Docusaurus project
|   |-- 01-copy-and-normalize.ts # Copy export to docs/, normalize folder names
|   |-- 02-convert-frontmatter.ts # ReadMe frontmatter -> Docusaurus frontmatter
|   |-- 03-extract-base64.ts     # Extract base64 images to /static/img/
|   |-- 04-download-images.ts    # Download remote images from files.readme.io
|   |-- 05-convert-images.ts     # <Image> JSX -> standard Markdown images
|   |-- 06-convert-htmlblocks.ts # <HTMLBlock> -> clean HTML/MDX
|   |-- 07-convert-tables.ts     # <Table> JSX -> Markdown tables
|   |-- 08-convert-links.ts      # (doc:slug) -> Docusaurus internal links
|   |-- 09-convert-admonitions.ts # > :warning: -> :::warning
|   |-- 10-generate-sidebars.ts  # _order.yaml -> sidebars config (standalone)
|   |-- run-pipeline.ts          # Orchestrator: runs steps 01-09 in order
|   |-- utils/                   # Shared utilities
|       |-- slug-map.ts          # Builds slug-to-path lookup table
|       |-- file-utils.ts        # Common file operations
|       |-- logger.ts            # Pipeline logging
|
|-- src/
|   |-- css/
|   |   |-- custom.css           # Minimal for now (Phase 2: theming)
|   |-- components/              # Custom MDX components for complex HTMLBlocks
|       |-- NavigationGrid.tsx   # Replacement for welcome page CSS grid
```

### Pattern 1: Multi-Step Conversion Pipeline
**What:** Each conversion concern is a separate script that reads from and writes to the `docs/` directory. Scripts are numbered to indicate execution order. An orchestrator runs them sequentially.
**When to use:** Always -- this is the locked decision (D-02).
**Example:**
```typescript
// scripts/run-pipeline.ts
import { execSync } from 'child_process';

const steps = [
  '01-copy-and-normalize',
  '02-convert-frontmatter',
  '03-extract-base64',
  '04-download-images',
  '05-convert-images',
  '06-convert-htmlblocks',
  '07-convert-tables',
  '08-convert-links',
  '09-convert-admonitions',
];

for (const step of steps) {
  console.log(`\n=== Running ${step} ===`);
  execSync(`npx tsx scripts/${step}.ts`, { stdio: 'inherit' });
  console.log(`=== Completed ${step} ===`);
}
```

### Pattern 2: Slug-to-Path Lookup Table for Link Conversion
**What:** Before converting `(doc:slug)` links, build a complete mapping from ReadMe slugs to Docusaurus document paths. This is critical because ReadMe uses flat global slugs while Docusaurus uses filesystem-based document IDs.
**When to use:** Required for CONV-06 (link conversion).
**Example:**
```typescript
// scripts/utils/slug-map.ts
import { globSync } from 'glob';
import matter from 'gray-matter';
import * as fs from 'fs';
import * as path from 'path';

export function buildSlugMap(docsDir: string): Map<string, string> {
  const slugMap = new Map<string, string>();
  const files = globSync('**/*.md', { cwd: docsDir });

  for (const file of files) {
    const fullPath = path.join(docsDir, file);
    const content = fs.readFileSync(fullPath, 'utf-8');
    const { data } = matter(content);

    // The slug is derived from the filename (without extension)
    const slug = path.basename(file, '.md');
    // The Docusaurus doc ID is the relative path without extension
    const docId = file.replace(/\.md$/, '');

    slugMap.set(slug, '/' + docId);
  }

  return slugMap;
}
```

### Pattern 3: Frontmatter Field Mapping
**What:** Transform ReadMe-specific frontmatter fields to Docusaurus-compatible equivalents.
**When to use:** Required for CONV-09.

**Mapping table:**
| ReadMe Field | Docusaurus Equivalent | Transform |
|---|---|---|
| `title` | `title` | Direct copy |
| `excerpt` | `description` | Copy if no `metadata.description` exists |
| `metadata.title` | (drop) | Docusaurus uses `title` for both page and meta title |
| `metadata.description` | `description` | Promote to top-level |
| `metadata.robots` | (drop) | Handle via Docusaurus SEO config globally |
| `hidden: true` | `draft: true` | Direct mapping |
| `deprecated` | (drop) | No Docusaurus equivalent; add admonition to content if needed |
| `next` | (drop) | Docusaurus uses sidebar ordering for prev/next |

**Example:**
```typescript
// scripts/02-convert-frontmatter.ts
import matter from 'gray-matter';

function convertFrontmatter(content: string): string {
  const { data, content: body } = matter(content);

  const newFrontmatter: Record<string, any> = {};

  // Title
  if (data.title) newFrontmatter.title = data.title;

  // Description: prefer metadata.description, fall back to excerpt
  if (data.metadata?.description) {
    newFrontmatter.description = data.metadata.description;
  } else if (data.excerpt) {
    newFrontmatter.description = data.excerpt;
  }

  // Hidden -> draft
  if (data.hidden === true) {
    newFrontmatter.draft = true;
  }

  return matter.stringify(body, newFrontmatter);
}
```

### Pattern 4: HTMLBlock Conversion Strategy
**What:** HTMLBlocks come in several variants that need different handling.
**When to use:** Required for CONV-02.

**HTMLBlock categories (from analysis):**
| Category | Count (est.) | Conversion Strategy |
|---|---|---|
| Centered image (base64 or remote) | ~30 | Extract/download image, replace with `![alt](/img/path.png)` |
| CSS grid/table layout (welcome page, etc.) | ~5-8 | Create custom MDX component (`<NavigationGrid>`) |
| Simple HTML wrapper (divs, spans) | ~15 | Strip `<HTMLBlock>{``...``}</HTMLBlock>` wrapper, clean HTML for MDX compatibility (`class` -> `className`, self-close tags) |
| Styled content with `<style>` tags | ~5 | Move styles to `custom.css` or CSS module, keep HTML structure |

**Example for simple wrapper stripping:**
```typescript
function convertSimpleHtmlBlock(htmlBlockContent: string): string {
  // Remove <HTMLBlock>{` and `}</HTMLBlock> wrapper
  let html = htmlBlockContent
    .replace(/<HTMLBlock>\{`/g, '')
    .replace(/`\}<\/HTMLBlock>/g, '');

  // MDX compatibility: class -> className
  html = html.replace(/\bclass="/g, 'className="');

  // Self-close void elements
  html = html.replace(/<(img|br|hr|input)([^>]*?)(?<!\/)>/g, '<$1$2 />');

  return html;
}
```

### Anti-Patterns to Avoid
- **Manual file-by-file editing:** With 298 files and 400+ syntax instances, manual editing is infeasible and unreproducible. Every change must be scripted.
- **Single monolithic conversion script:** A 1000-line script handling all patterns is impossible to debug. Separate scripts per concern (D-02).
- **Converting in-place on the export:** Never modify the original export. Always read from export, write to a fresh output directory (D-03).
- **String-based link conversion without a lookup table:** Naive slug-to-path guessing will break 50%+ of internal links. Build the slug map first.
- **Ignoring HTMLBlock complexity:** Not all HTMLBlocks are simple image wrappers. The welcome page has a full CSS grid layout that needs a custom MDX component.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Frontmatter parsing | Custom YAML parser | `gray-matter` | Handles edge cases in YAML frontmatter: multi-line strings, special chars, empty values. |
| File globbing | `fs.readdirSync` recursion | `glob` package | Handles nested dirs, exclusion patterns, cross-platform paths. |
| YAML parsing | Regex on `_order.yaml` | `js-yaml` | Correct YAML parsing handles arrays, nested structures, special chars. |
| Docusaurus project scaffold | Manual folder/config creation | `create-docusaurus` CLI | Produces correct boilerplate with all required deps and config structure. |
| Static site building | Custom build | `docusaurus build` | The entire point is a working Docusaurus build. Use it as the validation gate. |

**Key insight:** The conversion scripts themselves are custom by necessity (no existing tool handles ReadMe proprietary syntax), but every supporting task (parsing, file ops, building) should use established tools.

## Common Pitfalls

### Pitfall 1: MDX Parser Strictness
**What goes wrong:** Docusaurus uses MDX v3 which is much stricter than standard Markdown. A single unclosed tag, `class` instead of `className`, or unescaped `{` will crash the entire build.
**Why it happens:** ReadMe exports contain raw HTML that was rendered in a permissive HTML context. MDX parses it as JSX.
**How to avoid:** After each conversion step, run `npx docusaurus build` to catch failures early. Use `onBrokenLinks: 'throw'` in config.
**Warning signs:** Build errors mentioning "Could not parse expression" or "Unexpected token" in MDX files.

### Pitfall 2: Incomplete Slug-to-Path Mapping
**What goes wrong:** The `(doc:slug)` link converter cannot find the target page because the slug does not match any filename exactly, or the file is in a different directory than expected.
**Why it happens:** Some pages have slugs that differ from their filename (due to ReadMe slug customization). Some links may target pages in `reference/` (API docs) that are handled in Phase 2.
**How to avoid:** Build the slug map from ALL 298 files before converting. Log every unresolved slug. For API reference links (targeting Phase 2 content), convert to a placeholder path and document them.
**Warning signs:** Conversion log showing "unresolved slug: xyz" entries.

### Pitfall 3: Base64 Image Corruption
**What goes wrong:** Base64 images are extracted but the decoded file is corrupted or truncated.
**Why it happens:** The base64 string may be split across lines or contain whitespace that must be stripped before decoding. Some images may be JPEG but saved as .png.
**How to avoid:** Strip all whitespace from the base64 string before decoding. Detect the actual image format from the data URI prefix (`data:image/png` vs `data:image/jpeg`) and use the correct extension. Verify each extracted image file has a valid header.
**Warning signs:** Extracted images that are 0 bytes or cannot be opened.

### Pitfall 4: Remote Image Download Failures
**What goes wrong:** Some of the 207 remote image URLs from `files.readme.io` return 404 or timeout.
**Why it happens:** ReadMe may have CDN URL expiration or the images may have been deleted. The export may have been generated while some images were being migrated.
**How to avoid:** Implement retry logic (3 attempts with backoff). Log all failed downloads. After the pipeline runs, check for broken image references by inspecting the `static/img/` directory. Use a fallback placeholder image for any permanently missing images.
**Warning signs:** HTTP 404 or timeout errors in the download log.

### Pitfall 5: HTMLBlock Content Between Template Literals
**What goes wrong:** The HTMLBlock content is wrapped in JavaScript template literals (`` `...` ``), which means any backticks inside the HTML content will prematurely close the template literal.
**Why it happens:** ReadMe uses `<HTMLBlock>{`...`}</HTMLBlock>` where the content is a JS template literal. If the inner HTML contains code blocks with backticks, the extraction regex breaks.
**How to avoid:** Use a parser-aware extraction approach: find `<HTMLBlock>{`` `` and then scan for the matching `` `` `}</HTMLBlock>`, accounting for nested backticks. Test on all 56 HTMLBlock instances.
**Warning signs:** Partially extracted HTML content or regex match failures.

### Pitfall 6: Folder Name Normalization Breaking Links
**What goes wrong:** After normalizing "1NCE OS" to "1nce-os", internal links and image paths that referenced the original folder name no longer resolve.
**Why it happens:** The copy-and-normalize step changes directory names, but subsequent steps may still have references to the original names.
**How to avoid:** Run normalization as the FIRST step (01-copy-and-normalize). All subsequent steps work only with normalized paths. Build the slug map AFTER normalization.
**Warning signs:** Broken links or missing images that worked in the original export.

## Code Examples

### Example 1: Image Component Conversion
```typescript
// Convert: <Image align="center" alt="text" border={false} caption="cap"
//          title="t" src="https://files.readme.io/xxx.png" width="80%" />
// To:      ![text](/img/path/xxx.png)

function convertImageTag(tag: string, docRelPath: string): string {
  const srcMatch = tag.match(/src="([^"]+)"/);
  const altMatch = tag.match(/alt="([^"]*)"/) || tag.match(/title="([^"]*)"/);

  if (!srcMatch) return tag; // Leave unchanged if no src

  const src = srcMatch[1];
  const alt = altMatch ? altMatch[1] : '';

  // Remote URL: will be handled by download step, just rewrite path
  if (src.startsWith('https://files.readme.io/')) {
    const filename = src.split('/').pop()!;
    const imgDir = docRelPath.replace(/\.md$/, '').replace(/\/index$/, '');
    return `![${alt}](/img/${imgDir}/${filename})`;
  }

  // Base64: will be handled by extract step
  if (src.startsWith('data:image/')) {
    return tag; // Leave for base64 extraction step
  }

  return `![${alt}](${src})`;
}
```

### Example 2: Doc Link Conversion
```typescript
// Convert: [link text](doc:device-controller-api#retry-mechanism)
// To:      [link text](/1nce-os/1nce-os-device-controller/device-controller-api#retry-mechanism)

function convertDocLink(
  match: string,
  linkText: string,
  slug: string,
  anchor: string,
  slugMap: Map<string, string>
): string {
  const path = slugMap.get(slug);
  if (!path) {
    console.warn(`Unresolved slug: ${slug}`);
    return match; // Leave unchanged for manual review
  }
  return `[${linkText}](${path}${anchor || ''})`;
}

// Regex pattern for (doc:slug) and (doc:slug#anchor)
const docLinkRegex = /\[([^\]]*)\]\(doc:([a-z0-9-]+)(#[a-z0-9-]*)?\)/g;
```

### Example 3: Admonition Conversion
```typescript
// Convert: > :warning: Some text here
// To:      :::warning
//          Some text here
//          :::

function convertAdmonitions(content: string): string {
  // Match > :type: followed by text (may span multiple > lines)
  const admonitionRegex = /^> :(\w+):\s*(.+(?:\n>.*)*)/gm;

  return content.replace(admonitionRegex, (match, type, text) => {
    // Map emoji names to Docusaurus admonition types
    const typeMap: Record<string, string> = {
      'warning': 'warning',
      'info': 'info',
      'memo': 'note',
      'bulb': 'tip',
      'check': 'note',
    };

    const docuType = typeMap[type] || 'note';
    const cleanText = text.replace(/^>\s?/gm, '').trim();

    return `:::${docuType}\n${cleanText}\n:::`;
  });
}
```

### Example 4: Table JSX to Markdown Conversion
```typescript
// Convert <Table align={[...]}> with <thead>/<tbody>/<tr>/<td>
// To standard GFM Markdown table

function convertJsxTable(tableHtml: string): string {
  const rows: string[][] = [];

  // Extract all rows
  const rowRegex = /<tr>([\s\S]*?)<\/tr>/g;
  let rowMatch;
  while ((rowMatch = rowRegex.exec(tableHtml)) !== null) {
    const cells: string[] = [];
    const cellRegex = /<(?:td|th)>([\s\S]*?)<\/(?:td|th)>/g;
    let cellMatch;
    while ((cellMatch = cellRegex.exec(rowMatch[1])) !== null) {
      cells.push(cellMatch[1].trim().replace(/\n/g, ' '));
    }
    rows.push(cells);
  }

  if (rows.length === 0) return tableHtml;

  // Build Markdown table
  const header = '| ' + rows[0].join(' | ') + ' |';
  const separator = '| ' + rows[0].map(() => '---').join(' | ') + ' |';
  const body = rows.slice(1).map(row => '| ' + row.join(' | ') + ' |').join('\n');

  return `${header}\n${separator}\n${body}`;
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| MDX v1 (loose parsing) | MDX v3 (strict JSX parsing) | Docusaurus 3.0 | All HTML must be valid JSX. `class` -> `className`, self-closing tags required. |
| Webpack bundler | Rspack via @docusaurus/faster | Docusaurus 3.6 | 2-5x faster builds. Critical for iterative validation of 298 pages. |
| docusaurus-openapi-docs v3 | docusaurus-openapi-docs v4 | 2024 | Must use v4 with Docusaurus 3.x. Phase 2 concern but affects scaffold. |

**Deprecated/outdated:**
- Docusaurus v2: End of life. Use v3 (3.9.2 latest).
- MDX v1 compatibility mode: Do not enable. Write MDX v3-compatible content from the start.

## Open Questions

1. **HTMLBlock complexity triage**
   - What we know: 56 HTMLBlock instances exist. Some are simple image wrappers, others have CSS grid layouts.
   - What's unclear: Exact breakdown of how many need custom MDX components vs. simple conversion. The welcome page's `navigationTable` CSS grid is confirmed complex.
   - Recommendation: During implementation, triage each HTMLBlock into categories before writing conversion code. Start with simple cases (image wrappers), tackle complex layouts last.

2. **API reference links targeting Phase 2 content**
   - What we know: Some `(doc:slug)` links may target API reference pages from the `reference/` directory, which are Phase 2 content.
   - What's unclear: How many links cross the docs/reference boundary.
   - Recommendation: Convert what resolves, log unresolved slugs. For links targeting API reference content, use a placeholder path format (e.g., `/api/slug`) that Phase 2 will define.

3. **ReadMe CDN image availability**
   - What we know: 207 remote images need downloading from `files.readme.io`.
   - What's unclear: Whether all URLs are still valid. ReadMe CDN URLs may expire after account cancellation.
   - Recommendation: Download images as early as possible while the ReadMe account is active. Log any failures for manual resolution.

## Refined Pattern Counts (Verified)

| Pattern | File Count | Total Instances |
|---------|-----------|-----------------|
| `<HTMLBlock>` | 42 | 56 |
| `<Image>` JSX | 54 | 177 |
| `(doc:slug)` links | 44 | 112 |
| Base64 inline images | 31 | 40 |
| `<Table>` JSX | 13 | 17 |
| Blockquote admonitions | 7 | 11 |
| Remote image URLs | 62 | 207 |

**Total files in export:** 298 (122 in docs/, 131 in reference/, 38 in recipes/, 7 in custom_pages/)
**Phase 1 scope:** All 298 files, but `reference/` markdown is supplementary to the OpenAPI specs (Phase 2). Focus conversion effort on docs/ (122), recipes/ (38), and custom_pages/ (7) = 167 files with ReadMe syntax.

## Sources

### Primary (HIGH confidence)
- Direct grep/analysis of export directory `dev-hub-v2.6-2026-03-20T20-39-14_8a4df1b/` -- all pattern counts verified
- npm registry -- all package versions verified via `npm view`
- `.planning/research/PITFALLS.md` -- pitfall catalog from initial research
- `.planning/research/ARCHITECTURE.md` -- project structure patterns
- `.planning/research/FEATURES.md` -- feature landscape and complexity estimates

### Secondary (MEDIUM confidence)
- `.planning/research/STACK.md` (via CLAUDE.md Technology Stack section) -- stack recommendations
- Docusaurus documentation (training data, May 2025 cutoff) -- MDX v3 strictness, multi-sidebar config

### Tertiary (LOW confidence)
- HTMLBlock complexity estimates (simple/complex split) -- based on sampling, not full audit. Needs validation during implementation.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- versions verified against npm registry
- Architecture: HIGH -- pipeline structure is straightforward, patterns well-established
- Pitfalls: HIGH -- based on direct inspection of actual export content
- Pattern counts: HIGH -- verified via grep on actual files
- HTMLBlock conversion complexity: MEDIUM -- sampled but not fully categorized

**Research date:** 2026-03-20
**Valid until:** 2026-04-20 (stable domain, Docusaurus versions may advance)
