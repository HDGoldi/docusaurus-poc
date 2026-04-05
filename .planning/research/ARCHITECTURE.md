# Architecture Research

**Domain:** Client-side full-text search for Docusaurus 3.9.2 documentation site
**Researched:** 2026-04-05
**Confidence:** HIGH

## System Overview

```
BUILD TIME                                    RUNTIME (Browser)
==========                                    =================

┌──────────────────────────────┐
│  Docusaurus Build Pipeline   │
│                              │
│  preset-classic (docs)       │              ┌─────────────────────────┐
│    /docs/ -- 166 MDX files   │──build───>   │  Static HTML pages      │
│                              │              │  /docs/**/*.html        │
│  plugin-content-docs (api)   │──build───>   │  /api/**/*.html         │
│    /api/ -- 126 MDX files    │              └──────────┬──────────────┘
│                              │                         │
│  Search Theme (postBuild)    │                         │
│    ├─ Scans all HTML output  │              ┌──────────▼──────────────┐
│    ├─ Extracts text + titles │              │  search-index.json      │
│    ├─ Builds lunr.js index   │──writes──>   │  (chunked by route)     │
│    └─ Hashes for caching     │              └──────────┬──────────────┘
│                              │                         │
└──────────────────────────────┘                         │
                                                         │ fetch on search
                                              ┌──────────▼──────────────┐
                                              │  SearchBar Component    │
                                              │  (in Navbar)            │
                                              │                         │
                                              │  ┌───────────────────┐  │
                                              │  │  Web Worker        │  │
                                              │  │  (lunr.js query)   │  │
                                              │  └───────┬───────────┘  │
                                              │          │              │
                                              │  ┌───────▼───────────┐  │
                                              │  │  Results Dropdown  │  │
                                              │  │  (overlay + nav)   │  │
                                              │  └───────────────────┘  │
                                              └─────────────────────────┘
```

### How It Works End-to-End

1. **Build time:** Docusaurus builds all pages (docs + API) into static HTML in `build/`.
2. **Post-build hook:** The search theme's `postBuild` lifecycle hook scans all generated HTML files, extracts text content (title, headings, paragraphs), and builds a lunr.js inverted index.
3. **Index output:** The index is written as one or more JSON files into `build/` (e.g., `search-index-{hash}.json`), chunked by route prefix for lazy loading.
4. **Runtime:** When a user focuses the search bar or types, the browser fetches the relevant index chunk(s) and loads them into a Web Worker.
5. **Query:** The Web Worker runs lunr.js queries against the in-memory index, returning ranked results with title, URL, and context snippets.
6. **Navigation:** Clicking a result navigates to the target page via Docusaurus's client-side router.

### Component Responsibilities

| Component | Responsibility | Implementation |
|-----------|----------------|----------------|
| Search Theme (`@easyops-cn/docusaurus-search-local`) | Provides SearchBar component + postBuild index generator | Registered as a Docusaurus "theme" in `themes` array |
| SearchBar (React) | Renders input field in navbar, handles keyboard shortcuts (Cmd+K), shows dropdown results | Auto-injected into Docusaurus navbar's search slot |
| Web Worker | Runs lunr.js queries off the main thread to avoid UI jank | Bundled with the theme, loaded on first search interaction |
| postBuild index generator | Scans `build/` HTML, extracts text, creates lunr.js index | Runs after `docusaurus build`, uses `postBuild` lifecycle |
| lunr.js | Full-text search engine (inverted index, stemming, TF-IDF ranking) | Dependency of the search theme, runs both at build time (indexing) and runtime (querying) |

## Integration with Existing Architecture

### What Changes in `docusaurus.config.ts`

The search theme is added to the `themes` array (NOT plugins). It sits alongside the existing `docusaurus-theme-openapi-docs`:

```typescript
// docusaurus.config.ts -- CHANGES ONLY

themes: [
  'docusaurus-theme-openapi-docs',
  // ADD: search theme
  ['@easyops-cn/docusaurus-search-local', {
    indexDocs: true,
    indexBlog: false,
    indexPages: false,
    docsRouteBasePath: ['/docs', '/api'],  // CRITICAL: both doc instances
    language: ['en'],
    hashed: 'filename',                     // Cache-friendly hashed filenames
    searchBarShortcutHint: true,            // Show Cmd+K hint
    searchBarPosition: 'right',             // Right side of navbar
    searchResultLimits: 12,                 // More results for ~400 pages
    searchResultContextMaxLength: 80,       // Longer context snippets
    highlightSearchTermsOnTargetPage: true, // Highlight matches on navigation
    searchBarShortcutKeymap: { focusSearchInput: ['mod+k'] },
  }],
],
```

**Critical detail:** `docsRouteBasePath` must be an array `['/docs', '/api']` to cover BOTH the preset-classic docs instance (`/docs/`) AND the separate docs plugin instance (`/api/`). Without this, API pages will not be indexed.

### Where the Search Bar Renders

Docusaurus has a built-in "search bar slot" in the navbar. When no search theme is installed, the slot is empty. When a theme provides a `SearchBar` component (via `src/theme/SearchBar/index.jsx`), Docusaurus automatically renders it in the navbar.

**Current navbar layout:**
```
[Logo] [1NCE Home] [1NCE Shop] [1NCE Portal]
       ──────── SecondaryNavbar ────────
[Documentation] [API Explorer] [Terms & Abbreviations]
```

**After search integration:**
```
[Logo] [SearchBar ______ Cmd+K] [1NCE Home] [1NCE Shop] [1NCE Portal]
       ──────── SecondaryNavbar ────────
[Documentation] [API Explorer] [Terms & Abbreviations]
```

The SearchBar component renders in the primary navbar (the `<nav>` element), NOT in the SecondaryNavbar. This is automatic -- no swizzling or manual placement needed. The `searchBarPosition: 'right'` config places it to the right of the logo but before the navbar items (standard Docusaurus behavior).

### How OpenAPI-Generated Pages Get Indexed

The search indexing happens at the **HTML level**, not the MDX level. This is critical:

1. `docusaurus-plugin-openapi-docs` generates `.api.mdx` files in `docs/api/` at prebuild time.
2. Docusaurus compiles these MDX files into React components, which render into static HTML during `docusaurus build`.
3. The search theme's `postBuild` hook scans the resulting HTML in `build/api/**/*.html`.
4. It extracts: page title (from `<h1>` or `<title>`), heading hierarchy (`<h2>`, `<h3>`), and body text (paragraphs, list items).
5. The API endpoint descriptions (e.g., "Obtain a token for accessing other 1NCE API resources...") are present in the rendered HTML and WILL be indexed.
6. The interactive "Try It" panel components (request/response schemas, code tabs) render as HTML text that gets indexed too -- endpoint paths, parameter names, and response field names become searchable.

**What will NOT be indexed from API pages:** The base64-encoded `api` frontmatter blob (it is not rendered as visible text). JSON schema files loaded via `require()` render as interactive components, but the rendered parameter names and descriptions DO get indexed from the HTML output.

### Multi-Instance Docs: The Key Integration Point

The project has two docs plugin instances:

| Instance | Plugin | Route | Source |
|----------|--------|-------|--------|
| `default` (preset-classic) | `@docusaurus/plugin-content-docs` | `/docs/` | `docs/documentation/` |
| `api` | `@docusaurus/plugin-content-docs` | `/api/` | `docs/api/` |

The search theme must know about BOTH. The `docsRouteBasePath` array config handles this. Under the hood, the theme's `postBuild` hook scans ALL HTML in `build/` regardless, but the route base paths determine how results are categorized and how URLs are constructed for navigation.

**Past issue (resolved):** Multi-instance setups previously caused duplicated paths in search result URLs (issue #442, fixed in v0.41.1). Current version 0.55.1 handles this correctly.

## Recommended Project Structure Changes

```
docusaurus_poc/
├── docusaurus.config.ts       # MODIFY: add search theme to themes array
├── src/
│   ├── css/
│   │   └── custom.css         # MODIFY: add search overlay/result styling overrides
│   └── theme/
│       └── SearchBar/         # NEW (optional): only if default UI needs customization
│           └── index.tsx      # Wrap or override default SearchBar
├── build/                     # BUILD OUTPUT (not committed)
│   ├── search-index-*.json    # GENERATED: lunr.js search index chunks
│   └── ...                    # Existing HTML pages
└── package.json               # MODIFY: add @easyops-cn/docusaurus-search-local
```

### Structure Rationale

- **No new source directories needed.** The search theme is entirely configuration-driven. It provides its own SearchBar component and generates its own index files.
- **`src/css/custom.css` modifications** are likely needed for the search overlay to match 1NCE branding (navy/teal palette, Barlow font). The default search UI uses its own CSS module, but the overlay backdrop and result highlight colors should be themed.
- **`src/theme/SearchBar/`** is only needed if the default search bar UI is insufficient. Creating this directory "swizzles" the search bar component, giving full control. For v1.4, start WITHOUT swizzling -- customize via CSS first.

## Architectural Patterns

### Pattern 1: Theme-Based Search Integration

**What:** Docusaurus search plugins register as "themes" rather than "plugins" because they provide UI components (SearchBar). A theme can provide React components that fill Docusaurus's built-in component slots.

**When to use:** Always -- this is how Docusaurus search works. The `themes` array is the correct place.

**Trade-offs:**
- Pro: Zero-config UI integration; SearchBar appears automatically in the navbar
- Pro: No swizzling needed for basic functionality
- Con: Only one search theme can be active at a time (cannot combine two search providers)
- Con: Theme order matters if multiple themes provide the same component

**Example:**
```typescript
// docusaurus.config.ts
export default {
  themes: [
    'docusaurus-theme-openapi-docs',  // provides ApiItem, ApiExplorer, etc.
    ['@easyops-cn/docusaurus-search-local', { /* options */ }],  // provides SearchBar
  ],
};
// No conflicts: openapi-docs and search-local provide DIFFERENT theme components
```

### Pattern 2: PostBuild Index Generation

**What:** The search index is built AFTER the full Docusaurus build completes, by scanning the static HTML output. This is fundamentally different from build-time MDX processing.

**When to use:** This is how all local search plugins work. The postBuild approach means:
- API pages generated by openapi-docs are already compiled to HTML when indexing runs
- All content transformations (MDX -> React -> HTML) are complete
- The indexed text matches what users see in the browser

**Trade-offs:**
- Pro: Indexes the RENDERED content, including dynamically generated API docs
- Pro: No coupling between the search plugin and content plugins
- Con: Adds ~5-15 seconds to build time (scanning ~400 HTML files)
- Con: Search is NOT available in `docusaurus start` (dev mode) -- must use `docusaurus build && docusaurus serve` to test

### Pattern 3: Lazy-Loaded Chunked Index

**What:** The search index is split into chunks by route prefix and loaded on demand. The browser does not download the entire index upfront.

**When to use:** For sites with more than ~100 pages. With ~292 pages (166 docs + 126 API), chunking prevents a large initial download.

**Trade-offs:**
- Pro: First search interaction is fast (only loads the relevant chunk)
- Pro: Hashed filenames enable aggressive caching (S3/CloudFront)
- Con: First search on a different route prefix has a brief loading delay
- Con: Cross-section search (docs + API simultaneously) loads multiple chunks

## Data Flow

### Build-Time Index Generation Flow

```
docusaurus build
    |
    ├── [1] preset-classic: compiles docs/documentation/*.mdx -> build/docs/**/*.html
    ├── [2] plugin-content-docs(api): compiles docs/api/*.mdx -> build/api/**/*.html
    ├── [3] plugin-openapi-docs: generates MDX from OpenAPI specs (runs BEFORE step 2)
    ├── [4] Other plugins (redirects, llms-txt, etc.)
    |
    └── [5] postBuild hooks fire
            |
            └── search-local postBuild:
                ├── Glob build/**/*.html
                ├── For each HTML file:
                │   ├── Parse DOM (cheerio/jsdom)
                │   ├── Extract title from <h1> or <title>
                │   ├── Extract sections by <h2>/<h3> headings
                │   ├── Extract body text (strip HTML tags)
                │   └── Store as { title, url, sections[], content }
                ├── Build lunr.js inverted index from all documents
                ├── Split index into chunks by route prefix
                ├── Hash each chunk filename for cache busting
                └── Write search-index-*.json files to build/
```

### Runtime Search Query Flow

```
User types in SearchBar
    |
    ├── Debounce input (150-300ms)
    |
    ├── Load index chunk(s) if not cached
    |   └── fetch('/search-index-{hash}.json')
    |       └── CloudFront serves from S3 (cached at edge)
    |
    ├── Post query to Web Worker
    |   └── Worker: lunr.search(query)
    |       ├── Tokenize query
    |       ├── Apply stemming
    |       ├── Look up inverted index
    |       └── Rank by TF-IDF score
    |
    ├── Worker returns ranked results
    |
    ├── SearchBar renders results dropdown
    |   ├── Each result: title + context snippet + URL
    |   └── Overlay with darkened backdrop
    |
    └── User clicks result
        └── Docusaurus router.push(resultUrl)
            └── Client-side navigation (no full page reload)
```

### Key Data Flows

1. **Index generation (build-time):** HTML files -> DOM parsing -> text extraction -> lunr.js indexing -> JSON chunks on disk. This is a ONE-WAY flow that runs once per build.
2. **Search query (runtime):** User input -> debounce -> Web Worker query -> ranked results -> dropdown render -> client-side navigation. This is a REQUEST-RESPONSE flow per keystroke (after debounce).
3. **Index delivery (CDN):** S3 bucket stores index JSON files -> CloudFront caches them at edge (hashed filenames = immutable caching) -> browser fetches on first search. The existing CloudFront 2-tier cache policy (hashed assets = 1yr immutable) will automatically cover search index files if `hashed: 'filename'` is set (the hash is part of the filename).

## Integration Points

### New Components (to be installed)

| Component | Type | Source |
|-----------|------|--------|
| `@easyops-cn/docusaurus-search-local` | npm package (theme) | Added to `package.json` |
| SearchBar | React component | Auto-provided by theme, renders in navbar search slot |
| Web Worker | JS worker | Bundled with theme, loaded on demand |
| search-index-*.json | Build artifact | Generated by postBuild hook into `build/` |

### Modified Components

| Component | What Changes | Why |
|-----------|-------------|-----|
| `docusaurus.config.ts` | Add theme to `themes` array with config options | Core integration point |
| `src/css/custom.css` | Add CSS overrides for search overlay, backdrop, result styling | Match 1NCE navy/teal branding |
| GitHub Actions workflow | No changes needed -- `npm run build` already runs postBuild hooks | Index generation is automatic |
| CloudFront Function | No changes needed -- search-index JSON files are static assets served normally | No SPA routing involved for JSON files |

### Components That Do NOT Change

| Component | Why Unchanged |
|-----------|--------------|
| `src/theme/Navbar/Layout/index.tsx` | SearchBar renders in the primary `<nav>` via Docusaurus's component slot system, not in the custom NavbarLayout |
| `src/components/SecondaryNavbar/` | Search bar goes in the primary navbar, not the secondary tab bar |
| `sidebars/documentation.ts` | Search indexes HTML output, not sidebar config |
| `sidebars/api.ts` | Same -- sidebar config is irrelevant to search indexing |
| `plugins/llms-txt-plugin.ts` | Independent postBuild hook; no interaction with search |
| OpenAPI specs (`specs/*.json`) | Already processed by openapi-docs plugin; search indexes the resulting HTML |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Search theme <-> Docusaurus core | Lifecycle hooks (`postBuild`), theme component slots (`SearchBar`) | Standard Docusaurus theme API, no custom wiring |
| Search theme <-> openapi-docs theme | None (independent) | Both are themes but provide different components. No conflicts -- openapi-docs provides ApiItem/ApiExplorer, search provides SearchBar |
| SearchBar <-> Web Worker | `postMessage` / `onmessage` | Standard browser Worker API. Query sent to worker, results returned |
| Search index <-> CloudFront | Static file serving | Index JSON files are served like any other static asset. Hashed filenames work with existing cache policy |

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| ~400 pages (current) | Client-side lunr.js is ideal. Index size ~500KB-2MB compressed. Fast on all devices. |
| ~1,000 pages | Still fine with chunked index. May want to increase chunking granularity. Monitor index download size. |
| ~5,000+ pages | Consider switching to Algolia DocSearch or Typesense. Client-side index becomes too large (>10MB). |

### Scaling Priorities

1. **First concern: Index size.** At ~400 pages the compressed index will be ~500KB-2MB. Perfectly acceptable. The hashed-filename caching means repeat visitors pay zero cost after first load.
2. **Second concern: Build time.** PostBuild HTML scanning adds ~5-15 seconds. Negligible compared to the OpenAPI spec generation step. Not a concern until page count triples.

## Anti-Patterns

### Anti-Pattern 1: Adding Search as a Plugin Instead of a Theme

**What people do:** Put the search package in the `plugins` array instead of `themes`.
**Why it's wrong:** The package provides a React component (SearchBar) that fills a Docusaurus theme slot. Plugins cannot provide theme components. The search bar will not appear.
**Do this instead:** Always add to `themes` array: `themes: [['@easyops-cn/docusaurus-search-local', { ... }]]`

### Anti-Pattern 2: Forgetting to Include `/api` in `docsRouteBasePath`

**What people do:** Leave `docsRouteBasePath` at its default `'/docs'` or forget to include the second docs instance route.
**Why it's wrong:** API Explorer pages under `/api/` will not appear in search results. Users searching for "Obtain Access Token" or "SIM management" will get zero API results.
**Do this instead:** Set `docsRouteBasePath: ['/docs', '/api']` to cover both docs plugin instances.

### Anti-Pattern 3: Testing Search in Dev Mode

**What people do:** Run `npm start` and wonder why the search bar shows "no results" or is missing.
**Why it's wrong:** Local search plugins generate their index during `docusaurus build`. The dev server does not run the build pipeline, so no index exists.
**Do this instead:** Test search with `npm run build && npm run serve`. Document this for anyone working on the project.

### Anti-Pattern 4: Swizzling SearchBar Prematurely

**What people do:** Immediately swizzle the SearchBar component to customize it before trying CSS-only customization.
**Why it's wrong:** Swizzling creates a maintenance burden -- the swizzled component will not receive upstream bug fixes or features. The default SearchBar is highly customizable via CSS.
**Do this instead:** First customize via `src/css/custom.css` targeting the search bar's CSS classes. Only swizzle if CSS customization is genuinely insufficient (e.g., you need to change the results layout or add custom result types).

### Anti-Pattern 5: Using `@cmfcmf/docusaurus-search-local` for This Project

**What people do:** Pick the other popular local search plugin without checking multi-instance support.
**Why it's wrong:** `@cmfcmf/docusaurus-search-local` has no documented support for multiple docs plugin instances. Its docs do not address `docsRouteBasePath` as an array. It also does not work in dev mode (same as easyops) but has fewer configuration options for tuning result quality.
**Do this instead:** Use `@easyops-cn/docusaurus-search-local` which explicitly supports multi-instance docs via `docsRouteBasePath` array and has resolved past multi-instance URL issues.

## Build Order for Implementation

Given the dependency chain, the recommended build order is:

1. **Install package** -- `npm install @easyops-cn/docusaurus-search-local`
2. **Configure theme** -- Add to `themes` array in `docusaurus.config.ts` with multi-instance config
3. **Build and verify** -- `npm run build && npm run serve`, confirm search bar appears and indexes both `/docs/` and `/api/` pages
4. **Style the search UI** -- Add CSS overrides in `custom.css` for 1NCE branding (overlay backdrop color, result highlight, font family)
5. **Test edge cases** -- Verify API endpoint pages appear in results, verify result URLs navigate correctly, verify keyboard shortcut (Cmd+K)
6. **Optimize** -- Tune `searchResultLimits`, `searchResultContextMaxLength`, and `highlightSearchTermsOnTargetPage` based on UX testing

Steps 1-3 are the critical path with zero ambiguity. Steps 4-6 are polish that can be iterated.

## Sources

- `@easyops-cn/docusaurus-search-local` GitHub repository (github.com/easyops-cn/docusaurus-search-local) -- MEDIUM confidence (issue tracker verified multi-instance support, configuration options verified via npm metadata and README)
- `@cmfcmf/docusaurus-search-local` GitHub repository -- MEDIUM confidence (evaluated and rejected for this use case due to no documented multi-instance support)
- Docusaurus official search documentation (docusaurus.io/docs/search) -- HIGH confidence (theme slot mechanism, swizzle pattern)
- npm registry metadata for all three search plugins -- HIGH confidence (version numbers, peer dependencies verified via `npm view`)
- Existing `docusaurus.config.ts` direct inspection -- HIGH confidence
- Issue #442 resolution (multi-instance URL fix in v0.41.1) -- HIGH confidence (confirmed closed and resolved)
- npm package contents inspection (`npm pack --dry-run`) -- HIGH confidence (confirmed SearchBar component, Web Worker, postBuild architecture)

---
*Architecture research for: Client-side search integration in Docusaurus 3.9.2*
*Researched: 2026-04-05*
