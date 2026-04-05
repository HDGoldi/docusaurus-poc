# Stack Research: v1.4 Client-Side Search

**Domain:** Client-side full-text search for Docusaurus 3.9.2
**Researched:** 2026-04-05
**Confidence:** HIGH (plugin selection), MEDIUM (multi-instance indexing), HIGH (integration approach)

## Recommendation

Use **@easyops-cn/docusaurus-search-local v0.55.1** because it is the most actively maintained, most downloaded (195K weekly), supports Docusaurus 3.x natively, uses lunr.js for proven full-text search, and its config accepts arrays for `docsRouteBasePath` and `docsDir` -- directly supporting the multi-instance docs setup this project uses.

## Recommended Stack

### Search Plugin

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| @easyops-cn/docusaurus-search-local | ^0.55.1 | Client-side full-text search | 195K weekly downloads. Last published 2026-02-28. Supports Docusaurus 3.x (`@docusaurus/theme-common ^2 || ^3`). Lunr.js-based. Build-time index generation. Accepts `docsRouteBasePath` and `docsDir` as arrays, which is required for the dual docs-instance setup (preset-classic at `/docs` + standalone `@docusaurus/plugin-content-docs` at `/api`). Keyboard shortcut (Cmd+K), highlight on target page, fuzzy matching, search context by paths -- all included. | HIGH |

No additional dependencies required -- the plugin bundles lunr.js, mark.js, cheerio, and its own autocomplete UI.

### Configuration Required

| Setting | Value | Rationale |
|---------|-------|-----------|
| `docsRouteBasePath` | `["/docs", "/api"]` | Index both the documentation (298 pages at `/docs`) and API Explorer (125 pages at `/api`) |
| `docsDir` | `["docs/documentation", "docs/api"]` | Source directories corresponding to each docs plugin instance |
| `indexDocs` | `true` | Index all documentation content |
| `indexBlog` | `false` | No blog in this project |
| `indexPages` | `false` | No standalone pages need indexing |
| `hashed` | `true` | Cache-bust search index on content changes -- important for CloudFront CDN caching |
| `language` | `["en"]` | English only |
| `searchResultLimits` | `8` | Default is fine for overlay panel |
| `highlightSearchTermsOnTargetPage` | `true` | Matches the "click-to-navigate" requirement -- users see what matched |
| `searchBarShortcutKeymap` | `"mod+k"` | Standard keyboard shortcut (Cmd+K on Mac, Ctrl+K on Windows) |
| `searchBarPosition` | `"right"` | Matches requirement: "right side, next to Terms and Abbreviations" |
| `explicitSearchResultPath` | `true` | Show breadcrumb paths in results so users distinguish docs vs API results |
| `fuzzyMatchingDistance` | `1` | Allow single-character typo tolerance |

## Alternatives Considered

| Plugin | Version | Weekly Downloads | Last Published | Why Not |
|--------|---------|-----------------|----------------|---------|
| @easyops-cn/docusaurus-search-local | 0.55.1 | **195K** | 2026-02-28 | **SELECTED** |
| docusaurus-lunr-search | 3.6.0 | 97K | 2025-01-10 | Stale -- not updated in 15 months. Older autocomplete.js dependency. No explicit multi-docsDir array support. Indexes built HTML via rehype-parse rather than source markdown, which may work but is less well-documented for multi-instance setups. |
| @cmfcmf/docusaurus-search-local | 2.0.1 | 29K | 2025-10-25 | Lower adoption (29K vs 195K). Pulls in Algolia autocomplete UI dependencies (`@algolia/autocomplete-js`, `@algolia/client-search`, `algoliasearch`) even though it does NOT use Algolia servers -- unnecessary bundle bloat. No evidence of multi-docs-instance support in docs or issues. |
| Custom lunr.js / FlexSearch | N/A | N/A | N/A | Significant custom work: need to write build-time indexer, search UI component, result highlighting, keyboard shortcuts. The @easyops-cn plugin already does all of this. No benefit to rolling your own for a docs site. |
| Algolia DocSearch | N/A | N/A | N/A | **Explicitly out of scope** per PROJECT.md. Requires application approval process. External service dependency. Not zero-cost at scale. |

### Detailed Comparison: @easyops-cn vs @cmfcmf vs docusaurus-lunr-search

| Criterion | @easyops-cn | @cmfcmf | docusaurus-lunr-search |
|-----------|-------------|---------|----------------------|
| Docusaurus 3.x support | Yes (peer dep) | Yes (v2.0+) | Yes (peer dep) |
| Search engine | lunr.js | lunr.js | lunr.js |
| Multi-instance docs | Array config for `docsRouteBasePath`/`docsDir` | Not documented | Not documented |
| Weekly downloads | 195K | 29K | 97K |
| Last publish | Feb 2026 | Oct 2025 | Jan 2025 |
| Keyboard shortcut | Cmd+K built-in | Cmd+K built-in | None built-in |
| Highlight on target | Yes | Yes | Yes |
| Fuzzy matching | Yes (configurable distance) | No | No |
| Extra dependencies | None (self-contained) | Algolia autocomplete UI libs (unused but bundled) | autocomplete.js (older) |
| Search context by paths | Yes | No | No |
| Works in dev mode | No (build only) | No (build only) | No (build only) |
| i18n / CJK support | lunr-languages + jieba | lunr-languages | lunr-languages |

## What NOT to Add

| Technology | Why Not |
|------------|---------|
| Algolia DocSearch | Explicitly out of scope. Requires approval process. External dependency. |
| @cmfcmf/docusaurus-search-local | Bundles unused Algolia client libraries. Lower community adoption. |
| docusaurus-lunr-search | Stale maintenance. 15 months since last release. |
| FlexSearch | Would require custom integration. No Docusaurus plugin exists. Not worth the effort. |
| Typesense / Meilisearch | Server-side search engines. Require hosting infrastructure. Overkill for a static docs site with ~420 pages. |
| Custom search UI | The @easyops-cn plugin provides a complete search UI with overlay, keyboard shortcuts, and result highlighting. No reason to rebuild. |

## Installation

```bash
npm install @easyops-cn/docusaurus-search-local
```

No dev dependencies needed. No additional tooling required.

## Integration Point: docusaurus.config.ts

The plugin is added as a **theme** (not a plugin), in the `themes` array of `docusaurus.config.ts`:

```typescript
themes: [
  ['@easyops-cn/docusaurus-search-local', {
    docsRouteBasePath: ['/docs', '/api'],
    docsDir: ['docs/documentation', 'docs/api'],
    indexDocs: true,
    indexBlog: false,
    indexPages: false,
    hashed: true,
    language: ['en'],
    highlightSearchTermsOnTargetPage: true,
    searchBarShortcutKeymap: 'mod+k',
    searchBarPosition: 'right',
    explicitSearchResultPath: true,
    fuzzyMatchingDistance: 1,
    searchResultLimits: 8,
  }],
],
```

### Critical: Multi-Instance Awareness

The project uses two `@docusaurus/plugin-content-docs` instances:
1. **preset-classic** docs instance: `path: 'docs/documentation'`, `routeBasePath: '/docs'`
2. **standalone** docs instance: `id: 'api'`, `path: 'docs/api'`, `routeBasePath: '/api'`

The `docsRouteBasePath` and `docsDir` arrays MUST match these in the same order. The @easyops-cn plugin uses these arrays to correlate source directories with route prefixes for index building.

### API-Generated MDX Pages

The openapi-docs plugin generates `.mdx` files into `docs/api/` at `docusaurus gen-api-docs` time (pre-build). These files exist on disk before the search plugin's build-time indexer runs, so they WILL be indexed. No special configuration is needed beyond including `docs/api` in the `docsDir` array.

## Known Limitations

| Limitation | Impact | Mitigation |
|------------|--------|------------|
| No dev mode search | Cannot test search during `npm start` | Use `npm run build && npm run serve` to test search. Add to QA checklist. |
| Index size grows with content | ~420 pages will produce a non-trivial JSON index | `hashed: true` enables CDN caching. Lunr indices are typically 10-30% of source text size. For ~420 pages, expect 1-5 MB index. Gzip compression reduces this to ~200KB-1MB. |
| Multi-instance versioning bug (issue #544) | Open issue with search in versioned multi-instance setups | NOT APPLICABLE -- this project does not use doc versioning. Single version only. |
| No server-side search | All indexing/searching is client-side | Acceptable for ~420 pages. Server-side search (Algolia/Typesense) only needed at 1000+ pages. |

## Build Impact

The search plugin runs a build-time indexer that parses all source markdown/MDX files and generates a JSON search index. Expected impact:

- **Build time increase:** Moderate (5-15 seconds added to build, depending on content volume)
- **Output size increase:** 1-5 MB uncompressed index JSON (gzips to ~200KB-1MB)
- **Rspack compatibility:** The plugin is a theme (not a bundler plugin). It generates static assets consumed by the build. Should work with `@docusaurus/faster` (Rspack) without issues -- the search index is a JSON file loaded at runtime, not a webpack-specific artifact.

## Sources

- npm registry: `npm view @easyops-cn/docusaurus-search-local` -- HIGH confidence (version, peer deps, dependencies, publish date verified directly)
- npm registry: `npm view @cmfcmf/docusaurus-search-local` -- HIGH confidence
- npm registry: `npm view docusaurus-lunr-search` -- HIGH confidence
- npm downloads API: weekly download counts -- HIGH confidence (queried 2026-04-05)
- GitHub easyops-cn/docusaurus-search-local README -- MEDIUM confidence (configuration options, feature list)
- GitHub issue #550 (openapi-docs compatibility) -- MEDIUM confidence (resolved by upgrading openapi-docs, confirms compatibility works)
- GitHub issue #544 (multi-instance versioning) -- MEDIUM confidence (open issue but not applicable to this project's non-versioned setup)
- Project docusaurus.config.ts -- HIGH confidence (verified multi-instance setup, route paths, source directories)
