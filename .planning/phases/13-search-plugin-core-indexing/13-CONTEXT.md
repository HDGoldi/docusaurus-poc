# Phase 13: Search Plugin & Core Indexing - Context

**Gathered:** 2026-04-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Install `@easyops-cn/docusaurus-search-local` v0.55.1, validate Rspack compatibility, configure dual-instance indexing for all 423 pages (298 documentation + 125 API endpoint), and deliver a working search bar in the navbar with Cmd/K keyboard shortcut. Users can type a query, see matching results from both docs instances, and click to navigate to the correct page.

</domain>

<decisions>
## Implementation Decisions

### Rspack Fallback Strategy
- **D-01:** If Rspack (`experimental_faster: true`) breaks search on first build, disable it immediately. Do not spend time debugging the interaction.
- **D-02:** Confirm search works with Rspack disabled, then ship. Re-enable Rspack later only if upstream compatibility is confirmed.
- **D-03:** Build speed regression (seconds → ~30-60s) is acceptable to unblock search delivery.

### Search Context Filtering
- **D-04:** Phase 13 ships with combined results only — no Documentation vs API filtering.
- **D-05:** `searchContextByPaths` configuration deferred to Phase 14 after observing real search behavior with mixed results.
- **D-06:** SRCH-04 (filter by context tab) is partially addressed — results from both instances appear, but no toggle yet.

### Index Exclusions
- **D-07:** Exclude 80+ redirect stub pages from the search index immediately via `ignoreFiles` pattern. They have no search value and would pollute results.
- **D-08:** Index API code samples for now. Measure total index size after first build, then optimize in Phase 14 if the index exceeds reasonable size (~5 MB compressed).
- **D-09:** Measurement-driven optimization: no speculative exclusions beyond redirect stubs.

### Search Result Behavior
- **D-10:** Use plugin defaults for Phase 13: modal overlay with type-ahead, dimmed backdrop, context snippets, click-to-navigate.
- **D-11:** No customization of result display in this phase. Highlighting and scroll-to-match deferred to Phase 14 UI polish.

### Claude's Discretion
- Exact `ignoreFiles` glob pattern for redirect stubs (based on file inspection)
- `docsDir` array configuration matching the dual-instance setup
- Any additional plugin options needed for correct functioning (language, `hashed`, `indexBlog`)
- Order of operations: install → config → build → validate

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Search Plugin
- `.planning/research/SUMMARY.md` — Full research summary: plugin selection rationale, architecture, pitfalls, acceptance criteria
- `.planning/research/STACK.md` — Technology stack details for search plugin
- `.planning/research/PITFALLS.md` — Critical pitfalls with mitigation strategies
- `.planning/research/FEATURES.md` — Feature prioritization (must-have vs should-have vs defer)
- `.planning/research/ARCHITECTURE.md` — Integration architecture and component boundaries

### Project Configuration
- `docusaurus.config.ts` — Current Docusaurus config with dual docs instances, Rspack setting, navbar layout
- `src/css/custom.css` — 1NCE branding CSS variables (search overlay must not conflict)
- `src/theme/Navbar/Layout/index.tsx` — Custom navbar layout (search bar auto-injects via plugin slot, not here)

### Requirements
- `.planning/REQUIREMENTS.md` — SRCH-01 through SRCH-04, UI-01, UI-03, UI-04, UI-06 mapped to this phase

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/theme/Navbar/Layout/` — Custom navbar layout; search plugin auto-injects SearchBar component into Docusaurus's built-in slot, so no modification needed here
- `src/css/custom.css` — CSS custom properties for 1NCE branding; search overlay CSS overrides will go here (Phase 14)
- `src/theme/Root.tsx` — Root theme wrapper; no changes expected

### Established Patterns
- **Theming:** Infima CSS custom properties (`--ifm-*` tokens), no Tailwind. Search CSS must follow this pattern.
- **Bundler:** Rspack via `experimental_faster: true` in `future` config. This is the primary compatibility risk.
- **Dual docs instances:** preset-classic `docs` at `/docs/` + `docusaurus-plugin-openapi-docs` at `/api/`. Search plugin must index both via `docsRouteBasePath: ['/docs', '/api']` array.
- **Build pipeline:** `npm run build` triggers all postBuild hooks. Search index generation plugs into this automatically.

### Integration Points
- `docusaurus.config.ts` `themes` array — single entry point for search plugin registration
- `build/` output directory — search index JSON files land here alongside existing static assets
- GitHub Actions deploy workflow — no changes needed; `npm run build` already triggers postBuild hooks
- CloudFront — hashed index files served as static assets under existing cache policy

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches. User selected recommended options for all decisions, indicating preference for pragmatic defaults with measurement-driven optimization.

</specifics>

<deferred>
## Deferred Ideas

- **Search context filtering (searchContextByPaths)** — Phase 14, after observing real mixed-result behavior
- **Result highlighting on target page** — Phase 14 UI polish
- **Scroll-to-match on navigation** — Phase 14 UI polish
- **Index size optimization** — Phase 14, based on Phase 13 measurement data
- **Stop word filter removal** — Future, for IoT/telecom domain terms
- **PostHog search analytics** — Future, track queries and click-through

None — discussion stayed within phase scope

</deferred>

---

*Phase: 13-search-plugin-core-indexing*
*Context gathered: 2026-04-05*
