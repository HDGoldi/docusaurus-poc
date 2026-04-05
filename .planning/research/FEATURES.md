# Feature Research

**Domain:** Client-side full-text search for Docusaurus documentation site
**Researched:** 2026-04-05
**Confidence:** HIGH

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist on any documentation site with search. Missing these means the search feels broken or half-baked.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Search bar in navbar | Every doc site has one. Users look top-right instinctively. Docusaurus reserves a slot for it in the theme. | LOW | `@easyops-cn/docusaurus-search-local` auto-injects into the Docusaurus SearchBar theme slot. No navbar config changes needed -- it replaces the placeholder. |
| Cmd/Ctrl+K keyboard shortcut | Industry standard (Stripe, Tailwind, Next.js docs all use it). Developers expect this muscle memory to work. | LOW | Built into `@easyops-cn/docusaurus-search-local` (default `Mod+K`). Zero config. |
| Full-content indexing (headings + body + code) | Heading-only search misses most content. Users search for error messages, config values, parameter names -- all body text. | MEDIUM | The plugin indexes full page content at build time via Lunr.js. Covers headings, paragraphs, and code blocks. Index size scales with content (~298 doc pages + ~125 API pages = ~423 pages total). Expect index file of 2-5 MB compressed. |
| Search overlay/modal with dimmed background | Modern doc search UX. Users expect a centered modal with darkened backdrop, not an inline dropdown. | LOW | Built into the plugin. Modal-based UI with backdrop. Customizable via `--search-local-modal-width` CSS variable (default 560px). |
| Type-ahead / instant results as user types | Results must appear on every keystroke, not after pressing Enter. Latency must be <100ms for perceived instant feedback. | LOW | Lunr.js client-side search is inherently instant -- no network round-trip. Results update on every keystroke against the in-memory index. |
| Click-to-navigate from results to target page | Clicking a result must navigate to the correct page. Matters for generated API pages with complex routes like `/api/sim-management/get-all-sims/`. | LOW | Plugin generates links using Docusaurus route metadata. Works with both `/docs/` and `/api/` route bases since both use `@docusaurus/plugin-content-docs`. |
| Result context snippets | Users need to see WHY a result matched -- a snippet of surrounding text, not just the page title. | LOW | Plugin shows ~50 characters of context around the match (configurable via `searchResultContextMaxLength`). |
| Escape key dismisses modal | Standard modal UX. Every overlay in every app closes on Escape. | LOW | Built into the plugin. No config needed. |
| Mobile-responsive search modal | ~30% of doc traffic is mobile. Search modal must not break on small screens. | LOW | Plugin modal is responsive. Width adjusts via CSS variable. Touch-friendly result items. |
| Doc + API page coverage (both docs instances) | Both `/docs/` (298 pages) and `/api/` (125 pages) must be searchable. Users do not know or care about internal plugin boundaries. | MEDIUM | **Critical integration point.** Requires `docsRouteBasePath: ["/docs", "/api"]` array config. The plugin supports multiple docs plugin instances. Must verify it indexes the second `@docusaurus/plugin-content-docs` instance (id: `api`) and the `docusaurus-theme-openapi-docs` generated MDX content. |

### Differentiators (Competitive Advantage)

Features that elevate the search beyond basic functionality. Not required for launch, but noticeably improve the experience.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Search result highlighting on target page | After navigating to a result, the matched term gets highlighted (yellow) on the destination page. Helps users find the searched term in long pages. | LOW | Built into `@easyops-cn/docusaurus-search-local`. Enabled by default. Adds `<mark>` tags around matched terms on the target page. |
| Separate search contexts (docs vs API) | Let users filter results by section. "I know I want an API endpoint, not a guide." Reduces noise when 423 pages return many results. | MEDIUM | Plugin supports `searchContextByPaths: ["/docs", "/api"]`. Creates separate sub-indexes. Users see a context selector dropdown in the modal. Adds value given the two distinct content types (guides vs API references). |
| Fuzzy matching / typo tolerance | Users misspell technical terms (e.g., "autherization" instead of "authorization", "SIM mangement"). Fuzzy search still returns correct results. | LOW | Lunr.js supports edit-distance fuzzy matching natively. Plugin exposes it via Lunr configuration callback. |
| Weighted field ranking (title > heading > body) | A page titled "APN Configuration" should rank above one that mentions APN once in a paragraph. Prevents irrelevant results from burying the right answer. | LOW | Lunr.js supports field boosting. Plugin applies sensible defaults (title boosted over content). Can tune via custom Lunr config if needed. |
| Up/Down arrow keyboard navigation in results | Power users navigate results without touching the mouse. Arrow keys move highlight, Enter opens selected result. | LOW | Built into the plugin's modal UI. Standard keyboard navigation pattern. |
| Hashed search index filenames for cache busting | Index files get content-based hash in filename. CloudFront serves latest version after deploys without manual cache invalidation. | LOW | Plugin option `hashed: true`. Produces `search-index-{hash}.json` filenames. Critical for S3+CloudFront -- avoids serving stale search results from CDN cache. |
| Stop word filter removal for technical terms | Default English stop words filter strips "is", "not", "no" -- but in technical docs "NOT" in a boolean context or "no" in error messages carries meaning. | LOW | Plugin option `removeDefaultStopWordFilter: true`. Worth enabling for IoT/API technical content where short words are semantically meaningful. |
| Search result limit configuration | Default shows 8 results. For a site with 423 pages, increasing to 10-12 gives users better coverage without overwhelming the modal. | LOW | Plugin option `searchResultLimits: 12`. Simple config change. |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems in this context.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Algolia DocSearch | "Industry standard" search with better relevance, analytics dashboard. | Requires application/approval process (explicitly deferred in PROJECT.md Out of Scope). Free tier requires open-source project -- 1NCE docs are commercial. Paid tier adds recurring SaaS cost, defeating the goal of eliminating SaaS licensing. | Client-side Lunr.js search is zero-cost, zero-dependency. The Docusaurus SearchBar slot is the same for both -- migration to Algolia later is straightforward if ever needed. |
| AI-powered "Ask AI" in search | The `@easyops-cn/docusaurus-search-local` plugin offers optional AI search via `open-ask-ai` peer dependency. Sounds impressive. | Requires external AI API key and service. Adds per-query cost. Introduces network latency vs instant local search. Privacy concerns for enterprise users querying IoT docs. Questionable value for 423 pages. | Standard full-text search handles 423 pages well. Use PostHog (already installed) to identify zero-result searches -- fix those with content, not AI. |
| Dev-mode search (hot-reloading index) | "Why can't I test search while developing?" | All client-side search plugins only work on production builds. Build-time indexing is fundamental to how Lunr.js works. Attempting dev-mode search requires a watcher + rebuild pipeline that adds complexity for a developer-only workflow. | Run `npm run build && npm run serve` to test search. With Rspack bundler, full build takes <30 seconds. Document in CONTRIBUTING. |
| Fully swizzled custom search UI | "We want the search to look exactly like [competitor]." | Swizzling the entire SearchBar component means owning all future plugin updates. Upgrades become breaking changes. The built-in modal is already well-designed and themeable. | Use CSS custom properties (`--search-local-modal-width`, `--search-local-highlight-color`, `--search-local-hit-background`, `--search-local-spacing`) to match 1NCE branding. No swizzling needed. |
| Search analytics dashboard | "We need to know what people search for." | Building a custom analytics pipeline (event capture, storage, dashboard) is significant scope creep for a search feature. | PostHog is already installed and tracking SPA navigation. Add a single `posthog.capture('search_query', { query })` event via a lightweight wrapper. PostHog's built-in funnel/event analysis handles the rest. Zero custom dashboard needed. |
| Indexing external content (main 1nce.com) | "Can search also find content on the main site?" | Different domain, different CMS, different content pipeline. Would require a custom crawler and massive cross-origin index. | Keep search scoped to help.1nce.com only. External links in navbar (already present) handle cross-site navigation. |
| Versioned search indexes | "What if we add doc versioning later?" | Doc versioning is explicitly out of scope. Building version-aware search now creates unused complexity. | The plugin supports `docsPluginIdForPreferredVersion` for future use. No config needed until versioning is actually added. |

## Feature Dependencies

```
[Search bar in navbar]
    └──requires──> [Build-time Lunr.js index generation]
                       └──requires──> [Multi-docs-instance config]
                                          ├── /docs/ (preset-classic, 298 pages)
                                          └── /api/ (plugin-content-docs id:api, 125 pages)

[Type-ahead instant results] ──requires──> [Full-content index loaded in browser]

[Search result highlighting on page] ──requires──> [Click-to-navigate working]

[Separate search contexts] ──enhances──> [Search bar in navbar]
    └──requires──> [searchContextByPaths config]

[Hashed index filenames] ──enhances──> [Existing CloudFront cache strategy]
    └──integrates-with──> [Two-tier cache: hashed assets 1yr / HTML 10min]

[PostHog search tracking] ──requires──> [PostHog (already installed)]
    └──enhances──> [Search bar in navbar]

[1NCE CSS branding] ──requires──> [Existing custom.css with --ifm-* variables]
    └──enhances──> [Search modal UI]
```

### Dependency Notes

- **Multi-docs-instance config is the critical path.** The project has TWO `@docusaurus/plugin-content-docs` instances: one in `preset-classic` (routeBasePath `/docs/`) and one standalone (id `api`, routeBasePath `/api/`). The search plugin must index both. Configure `docsRouteBasePath: ["/docs", "/api"]` and `docsDir: ["docs/documentation", "docs/api"]`. This is the most likely integration failure point.
- **Hashed index files integrate with existing CloudFront cache strategy.** The site already uses content-hashed assets with 1-year immutable cache and 10-minute HTML must-revalidate. Hashed search index files fit this pattern -- they are effectively static assets that change only when content changes.
- **OpenAPI-generated pages must be indexed.** The `/api/` pages are MDX generated by `docusaurus-plugin-openapi-docs`. These contain endpoint descriptions, parameters, request/response examples. The search plugin indexes the MDX output, not the OpenAPI specs directly. Must verify generated API page content appears in search results.
- **PostHog search tracking is additive.** Can be layered on after core search works. No dependency on search internals -- just fire a custom event when search executes.
- **CSS branding depends on existing theme.** The site uses light-only mode with custom `--ifm-*` CSS variables (navy/teal). Search modal CSS variables (`--search-local-*`) should extend, not conflict with, existing theme.

## MVP Definition

### Launch With (v1.4)

Minimum viable search -- what is needed for developers to find content effectively.

- [ ] `@easyops-cn/docusaurus-search-local` plugin installed and configured
- [ ] Both `/docs/` and `/api/` routes indexed via multi-instance config
- [ ] Full-content indexing (headings + body text + code blocks)
- [ ] Search bar visible in navbar (auto-injected by plugin into SearchBar slot)
- [ ] Cmd/Ctrl+K keyboard shortcut opens modal
- [ ] Modal overlay with dimmed backdrop
- [ ] Type-ahead results with context snippets on every keystroke
- [ ] Click-to-navigate to correct page (both doc and API pages)
- [ ] Search result highlighting on target page (yellow marks)
- [ ] Hashed index files (`hashed: true`) for CloudFront cache compatibility
- [ ] Mobile-responsive modal
- [ ] CSS variables customized for 1NCE branding (navy/teal palette, Barlow font)
- [ ] Escape key closes modal
- [ ] Arrow key navigation through results

### Add After Validation (v1.4.x)

Features to add once core search is confirmed working across all 423 pages.

- [ ] Separate search contexts for docs vs API -- add if user testing shows result noise is a problem with mixed content types
- [ ] Stop word filter removal (`removeDefaultStopWordFilter: true`) -- add if users report technical terms like "NOT", "no", "is" not being found
- [ ] Fuzzy matching tuning -- add if analytics show typo-related zero-result searches
- [ ] PostHog search event tracking (`posthog.capture`) -- add to measure what users search for and identify content gaps
- [ ] Increased result limit (8 to 12) -- add if users report not finding results within default limit

### Future Consideration (v2+)

Features to defer until evidence shows they are needed.

- [ ] Algolia DocSearch -- defer until free tier is approved or budget allocated for paid tier. Migration is easy: swap plugin, same SearchBar slot.
- [ ] AI-powered "Ask AI" search -- defer until search analytics show standard search is insufficient
- [ ] Custom search UI beyond CSS theming -- defer unless specific UX requirements emerge from user testing
- [ ] Per-page search scope (search within current section only) -- defer, overkill for 423 pages

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Plugin install + basic config | HIGH | LOW | P1 |
| Multi-docs-instance indexing (/docs + /api) | HIGH | MEDIUM | P1 |
| Keyboard shortcut (Cmd/Ctrl+K) | HIGH | ZERO (built-in) | P1 |
| Modal overlay with dimmed backdrop | HIGH | ZERO (built-in) | P1 |
| Full-content indexing | HIGH | LOW (default behavior) | P1 |
| Click-to-navigate | HIGH | ZERO (built-in) | P1 |
| Result context snippets | HIGH | ZERO (built-in) | P1 |
| Search result highlighting on page | MEDIUM | ZERO (built-in) | P1 |
| Hashed index for CloudFront | MEDIUM | LOW (config flag) | P1 |
| 1NCE CSS branding for search modal | MEDIUM | LOW | P1 |
| Mobile-responsive modal | HIGH | ZERO (built-in) | P1 |
| Separate search contexts (docs/API) | MEDIUM | MEDIUM | P2 |
| PostHog search event tracking | MEDIUM | LOW | P2 |
| Stop word filter removal | LOW | LOW (config flag) | P2 |
| Fuzzy matching config | LOW | LOW | P3 |
| Increased result limit | LOW | LOW (config flag) | P3 |

**Priority key:**
- P1: Must have for launch -- core search functionality and integration
- P2: Should have, add based on user feedback after launch
- P3: Nice to have, future refinement

## Competitor Feature Analysis

| Feature | ReadMe.com (previous host) | Stripe Docs | Tailwind Docs | Our Approach |
|---------|---------------------------|-------------|---------------|--------------|
| Search trigger | Click bar or Cmd+K | Cmd+K modal | Cmd+K modal | Cmd+K modal (plugin default) |
| Search engine | Algolia (server-side) | Algolia (server-side) | Algolia DocSearch (free) | Lunr.js (client-side, zero-cost) |
| Result display | Inline dropdown | Full modal with categories | Full modal with sections | Full modal with context snippets |
| Content indexed | Full page content | Full content + API refs | Full content | Full content + API endpoint pages |
| Result highlighting on page | No | Yes (jumps to section) | Yes | Yes (plugin built-in) |
| Fuzzy matching | Yes (Algolia) | Yes (Algolia) | Yes (Algolia) | Yes (Lunr.js built-in) |
| Section filtering | By category | By product area | No | By path context (configurable P2) |
| Mobile UX | Responsive | Responsive | Responsive | Responsive (plugin built-in) |
| Offline capable | No (requires Algolia API) | No | No | Yes (entire index is local) |
| Cost | Included in SaaS fee | Algolia enterprise | Algolia DocSearch free | Zero (no external service) |
| Index freshness | Real-time (Algolia crawler) | Real-time | Crawl-based | Build-time (updates on deploy) |

**Key competitive insight:** Client-side search trades real-time index updates and sophisticated relevance ranking for zero cost and offline capability. For a 423-page doc site with weekly-or-less update cadence, this tradeoff is strongly favorable. The index updates on every deploy, which is sufficient.

## Sources

- Docusaurus official search documentation: https://docusaurus.io/docs/search -- HIGH confidence (verified 2026-04-05, lists search plugin ecosystem)
- `@easyops-cn/docusaurus-search-local` v0.55.1 (883 GitHub stars, last release 2026-02-28): https://github.com/easyops-cn/docusaurus-search-local -- HIGH confidence (verified README, config options, CSS variables, multi-instance support)
- `@cmfcmf/docusaurus-search-local` v2.0.1 (496 GitHub stars): https://github.com/cmfcmf/docusaurus-search-local -- HIGH confidence (evaluated as alternative; uses Algolia autocomplete UI but local index; requires `nodejieba` for CJK)
- `docusaurus-lunr-search` v3.6.0 (554 GitHub stars): https://github.com/praveenn77/docusaurus-lunr-search -- HIGH confidence (evaluated as alternative; simpler feature set, fewer config options)
- npm registry version and peer dependency checks for all three plugins -- verified 2026-04-05
- Existing project `docusaurus.config.ts` -- direct inspection (two docs plugin instances, preset-classic + standalone id:api, openapi-docs theme, light-only mode, navbar structure)
- Lunr.js search engine: https://lunrjs.com -- HIGH confidence (underlying search engine for all three plugins)

---
*Feature research for: client-side full-text search in Docusaurus documentation site*
*Researched: 2026-04-05*
