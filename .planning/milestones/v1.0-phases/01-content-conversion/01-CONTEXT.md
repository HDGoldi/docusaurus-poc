# Phase 1: Content Conversion - Context

**Gathered:** 2026-03-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Scaffold a Docusaurus project and convert all 298 exported ReadMe.com pages to valid MDX that builds without errors. This includes converting 6 proprietary syntax patterns, downloading remote images, extracting base64 images, and auto-generating sidebars from `_order.yaml` files. The output is a buildable Docusaurus site with all documentation content — navigation assembly, API Explorer integration, theming, and deployment are separate phases.

</domain>

<decisions>
## Implementation Decisions

### Conversion Strategy
- **D-01:** Node.js for all conversion scripts (same ecosystem as Docusaurus)
- **D-02:** Multi-step pipeline — separate scripts for each pattern (images, links, admonitions, HTMLBlock, tables, frontmatter) so individual steps can be debugged and re-run independently
- **D-03:** Scripts read from the export folder (`dev-hub-v2.6-*/`) and write to a new Docusaurus `docs/` folder — original export preserved as reference
- **D-04:** Scripts must be idempotent — re-runnable on fresh ReadMe exports without breaking anything

### Image Handling
- **D-05:** Download all remote images from `files.readme.io` to `/static/img/` locally — no dependency on ReadMe servers
- **D-06:** Image folder structure mirrors doc hierarchy: `/static/img/1nce-os/device-controller/image.png`
- **D-07:** Base64-encoded images inside HTMLBlocks extracted to `.png` files in `/static/img/`, replaced with standard image references

### Docusaurus Scaffolding
- **D-08:** Folder names normalized from export (lowercase, hyphens) but same hierarchy preserved — e.g., "1NCE OS" becomes "1nce-os", "Blueprints & Examples" becomes "blueprints-examples"
- **D-09:** Sidebar generation is a separate standalone tool (not part of the content conversion pipeline) that reads `_order.yaml` files and generates Docusaurus sidebar config
- **D-10:** Recipes (AT command tutorials) merged under Blueprints & Examples — they're similar content, not a separate docs instance

### Content Fidelity
- **D-11:** Skip AI support agent HTML pages (`ai-support-agent.html`, `ai-support-agent-brazil.html`) — ReadMe-specific integrations, not standard docs
- **D-12:** HTMLBlocks with complex CSS layouts (grids, custom styling) should be recreated closely as custom MDX components — match the original visual layout, not just extract raw content
- **D-13:** `custom_pages/terms-abbreviations.md` included in the migration as a standard docs page

### Claude's Discretion
- Exact Docusaurus version selection (latest stable 3.x)
- Frontmatter field mapping details (ReadMe → Docusaurus)
- Script file organization and naming
- Error handling and logging approach in conversion scripts
- How to handle edge cases in HTMLBlock conversion

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Export content (source material)
- `dev-hub-v2.6-2026-03-20T20-39-14_8a4df1b/docs/` — 298 Markdown files with ReadMe proprietary syntax
- `dev-hub-v2.6-2026-03-20T20-39-14_8a4df1b/reference/` — 6 OpenAPI JSON specs + API doc markdown
- `dev-hub-v2.6-2026-03-20T20-39-14_8a4df1b/recipes/` — AT command tutorials to merge under Blueprints
- `dev-hub-v2.6-2026-03-20T20-39-14_8a4df1b/custom_pages/` — Glossary, hardware guides (skip HTML agent pages)
- `dev-hub-v2.6-2026-03-20T20-39-14_8a4df1b/_order.yaml` — Top-level navigation ordering

### Brand/theme assets (for later phases but referenced in export)
- `readme_custom.css` — 1NCE brand colors, fonts, CSS variables
- `readme_custom_head.html` — Analytics scripts (GTM, SimpleAnalytics, PostHog)
- `readme_custom_foot.html` — Custom footer HTML

### Research findings
- `.planning/research/STACK.md` — Recommended Docusaurus stack and versions
- `.planning/research/FEATURES.md` — Feature analysis including syntax pattern counts
- `.planning/research/PITFALLS.md` — Migration pitfalls and prevention strategies
- `.planning/research/ARCHITECTURE.md` — Component structure and build order

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None — greenfield Docusaurus project, no existing codebase

### Established Patterns
- ReadMe export uses consistent `_order.yaml` at every directory level for sidebar ordering
- ReadMe frontmatter follows a consistent pattern: title, excerpt, deprecated, hidden, metadata (title, description, robots), next
- `<Image>` tags have consistent attributes: align, alt, border, caption, title, src, width

### Integration Points
- Export folder is the input; Docusaurus `docs/` folder is the output
- `_order.yaml` files are the input for sidebar generation
- OpenAPI JSON specs in `reference/` will be consumed by Phase 2 (API Explorer)

### Syntax Pattern Inventory (from audit)
| Pattern | File Count | Example |
|---------|-----------|---------|
| `<HTMLBlock>` | 42 | Wraps raw HTML/CSS, often with base64 images |
| `<Image>` JSX | 54 | `<Image src="https://files.readme.io/..." />` |
| `(doc:slug)` links | 44 | `[link text](doc:device-controller-api)` |
| Base64 inline images | 31 | `data:image/png;base64,...` inside HTMLBlock |
| `<Table>` JSX | 13 | ReadMe table components |
| Blockquote admonitions | 7 | `> :warning: text` |

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches as long as the pipeline is modular and re-runnable.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 01-content-conversion*
*Context gathered: 2026-03-20*
