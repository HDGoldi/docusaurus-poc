# Phase 11: LLM Discoverability - Context

**Gathered:** 2026-04-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Serve llms.txt at the site root following the llmstxt.org specification, with product-first organization (1NCE Connect, 1NCE OS, API Reference) and build-time auto-generated link sections that stay in sync with the site content.

</domain>

<decisions>
## Implementation Decisions

### Template Structure
- **D-01:** Use product-first organization with three H2 sections: `## 1NCE Connect`, `## 1NCE OS`, `## API Reference`
- **D-02:** Detailed preamble blockquote (3-5 sentences) covering both product lines, target audience (IoT developers), and what the docs help with
- **D-03:** Section mapping — 1NCE Connect: Introduction, Connectivity Services, Network Services, SIM Cards, Platform Services, Blueprints/Examples, 1NCE Portal, MCP Server, Troubleshooting. 1NCE OS: 1NCE OS section. API Reference: all 6 OpenAPI specs.

### Link Generation
- **D-04:** Use page frontmatter titles (or first H1) as link labels — no section prefix
- **D-05:** API Reference links grouped by spec (6 links to spec landing pages), not individual endpoints
- **D-06:** Doc pages grouped under H3 sub-headings within each product section (e.g., `### Connectivity Services` under `## 1NCE Connect`) — preserves hierarchy
- **D-07:** Absolute URLs with full domain (https://help.1nce.com/docs/...)

### Build Integration
- **D-08:** Custom Docusaurus plugin using `postBuild` lifecycle hook — idiomatic, has access to route metadata and content
- **D-09:** Hand-curated template lives at `static/llms-template.txt` — consistent with robots.txt pattern. Plugin reads template as input, writes final llms.txt to build output directory.

### Content Scope
- **D-10:** Include all ~298 doc pages in auto-generated links — llms.txt is a manifest for discoverability, not a curated summary
- **D-11:** API Reference includes spec landing pages only (6 links), not all 125 individual endpoints

### Claude's Discretion
- Plugin implementation details (file structure, helper functions, error handling)
- Exact preamble wording (within the "detailed overview" style decision)
- Template file format/syntax for marking auto-generated sections

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### llmstxt.org Specification
- https://llmstxt.org — The specification that llms.txt must follow (H1 title, blockquote summary, H2 sections, markdown links)

### Site Configuration
- `docusaurus.config.ts` — Main config; shows docs path (`docs/documentation`), API path (`docs/api`), plugin configuration, and base URL logic
- `static/robots.txt` — Existing static file pattern to follow for template placement
- `static/` — Directory where `llms-template.txt` will be placed

### Content Structure
- `docs/documentation/` — 10 doc sections that map to 1NCE Connect and 1NCE OS groups
- `docs/api/` — 6 API spec directories (authorization, sim-management, order-management, product-information, support-management, 1nce-os)
- `specs/` — 6 OpenAPI spec JSON files (source of truth for API structure)
- `sidebars/documentation.ts` — Documentation sidebar definition (section ordering)
- `sidebars/api.ts` — API sidebar definition

### Requirements
- `.planning/REQUIREMENTS.md` — LLM-01, LLM-02, LLM-03, LLM-04 requirements for this phase
- `.planning/ROADMAP.md` §Phase 11 — Success criteria (4 conditions that must be TRUE)

### Prior Phase
- `.planning/phases/10-crawler-foundation/10-CONTEXT.md` — Phase 10 decisions on static file serving, CloudFront passthrough

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `@docusaurus/plugin-sitemap` (bundled in preset-classic) — generates sitemap.xml; similar pattern of build-time file generation
- `static/robots.txt` — established pattern for static files at site root
- Docusaurus `postBuild` plugin lifecycle — standard hook for post-build file generation

### Established Patterns
- Static files in `static/` copied to build root automatically
- Plugin configuration in `docusaurus.config.ts` `plugins` array
- Docs use frontmatter with `title` field for page titles
- API docs generated from OpenAPI specs in `specs/` directory via `docusaurus-plugin-openapi-docs`

### Integration Points
- New plugin registered in `docusaurus.config.ts` `plugins` array
- Plugin reads `static/llms-template.txt` for hand-curated sections
- Plugin discovers doc pages from build output or route metadata
- Output: `build/llms.txt` served at help.1nce.com/llms.txt via S3+CloudFront
- CloudFront Function already passes through `.txt` files (Phase 10 fix)

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches within the decisions above.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 11-llm-discoverability*
*Context gathered: 2026-04-03*
