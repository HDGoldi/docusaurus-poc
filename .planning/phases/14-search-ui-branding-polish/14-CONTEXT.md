# Phase 14: Search UI Branding & Polish - Context

**Gathered:** 2026-04-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Search overlay matches 1NCE branding (navy/teal colors, Barlow font, light-only mode) and provides a polished user experience with highlighted search term matches in results and on target pages. Includes context tab filtering (Documentation vs API) and measurement-driven index optimization.

</domain>

<decisions>
## Implementation Decisions

### Overlay Styling
- **D-01:** Search modal uses navy header (#194a7d) with white text, white body for result readability, teal (#29abe2) accent for selected/hovered results. Matches existing navbar/footer branding pattern.
- **D-02:** Backdrop uses medium dim — rgba(0,0,0,0.5). Standard modal pattern, content behind partially visible.
- **D-03:** Barlow font applied to search input and results via CSS custom properties (already set as --ifm-font-family-base).

### Result Highlighting
- **D-04:** Matched search terms highlighted with light teal background (rgba(41,171,226,0.15)) and bold text in the results list. Consistent with 1NCE teal accent.
- **D-05:** Enable `highlightSearchTermsOnTargetPage` — after navigating from a result, matching terms on the target page get the same teal highlight briefly so users can find what they searched for.

### Context Tab Filtering
- **D-06:** Implement `searchContextByPaths` to enable tab-based filtering above results: "All" | "Docs" | "API".
- **D-07:** Tab labels are "All", "Docs", "API" — shorter than navbar labels, saves horizontal space in modal.
- **D-08:** "All" tab is the default when opening search.

### Index Optimization
- **D-09:** Optimize only if search index exceeds 5MB compressed (measurement-driven, per Phase 13 D-08 threshold).
- **D-10:** Boost title matches over body content matches in search result ranking. Title matches should appear first.

### Claude's Discretion
- Exact CSS selectors for plugin modal override (inspect plugin DOM structure)
- Teal highlight fade timing on target page (brief flash vs persistent)
- searchContextByPaths path configuration mapping to dual docs instances
- Whether title boosting is achievable via plugin config or requires custom scoring

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Search Plugin Configuration
- `.planning/research/SUMMARY.md` — Plugin selection rationale, architecture, pitfalls
- `.planning/research/FEATURES.md` — Feature prioritization including searchContextByPaths and highlightSearchTermsOnTargetPage
- `.planning/research/PITFALLS.md` — Critical pitfalls with mitigation strategies

### Existing Search Setup (Phase 13)
- `docusaurus.config.ts` lines 315-345 — Current @easyops-cn/docusaurus-search-local config (dual instance, hashed filenames, ignoreFiles)
- `.planning/phases/13-search-plugin-core-indexing/13-CONTEXT.md` — Phase 13 decisions including deferred items for this phase

### Branding Assets
- `src/css/custom.css` — 1NCE brand CSS variables (navy #194a7d, teal #29abe2, Barlow font). Search CSS overrides go here.

### Requirements
- `.planning/REQUIREMENTS.md` — UI-02 (overlay), UI-05 (branding), UI-07 (highlighting) mapped to this phase

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/css/custom.css` — All 1NCE CSS custom properties already defined; search overlay CSS overrides append here
- `docusaurus.config.ts` themes array — Search plugin already registered, config options extend in place

### Established Patterns
- **Theming:** Infima CSS custom properties (`--ifm-*` tokens), no Tailwind. All search CSS must use this pattern.
- **Color palette:** Navy (#194a7d) for header/footer backgrounds, teal (#29abe2) for primary accents and hover states, white text on navy backgrounds.
- **Font:** Barlow via --ifm-font-family-base — automatically inherited by search plugin components.
- **Light-only mode:** Dark mode disabled via config (defaultMode: 'light', disableSwitch: true). Search CSS only needs light mode rules.

### Integration Points
- `docusaurus.config.ts` search plugin options — add searchContextByPaths, highlightSearchTermsOnTargetPage
- `src/css/custom.css` — add search modal CSS overrides targeting plugin's DOM classes
- Build output — measure index size from Phase 13 build to decide on optimization

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches. User selected recommended options for all decisions, indicating preference for consistent branding patterns and measurement-driven optimization.

</specifics>

<deferred>
## Deferred Ideas

- **Stop-word removal tuning for IoT/telecom domain terms** — Future (SRCH-05)
- **PostHog search analytics (track queries, click-through)** — Future (SRCH-06)
- **Scroll-to-match on navigation** — Could be part of highlightSearchTermsOnTargetPage behavior or separate

None — discussion stayed within phase scope

</deferred>

---

*Phase: 14-search-ui-branding-polish*
*Context gathered: 2026-04-05*
