# Phase 14: Search UI Branding & Polish - Research

**Researched:** 2026-04-05
**Domain:** CSS theming and configuration of @easyops-cn/docusaurus-search-local for 1NCE branding
**Confidence:** HIGH

## Summary

Phase 14 adds visual polish and branding to the search overlay installed in Phase 13. The work is purely CSS overrides in `src/css/custom.css` and configuration additions in `docusaurus.config.ts` -- no new packages, no swizzling, no custom components. The plugin exposes well-documented CSS custom properties (`--search-local-*`) that map directly to the 1NCE brand palette (navy #194a7d, teal #29abe2). The highlight-on-target-page feature uses mark.js under the hood and is enabled via a single boolean config option (`highlightSearchTermsOnTargetPage: true`).

One critical finding: **the `searchContextByPaths` feature does NOT create UI tabs for switching between "Docs" and "API"**. It creates separate search indexes per path and auto-detects context from the current URL. When a user is on `/docs/*`, they see docs results; on `/api/*`, they see API results. A footer link allows bridging to "all results." This differs from the D-06/D-07/D-08 decisions which assumed tab-based filtering. The planner must reconcile this -- either accept auto-detection behavior (simpler, no custom UI needed) or flag to the user that tabs require custom React development beyond what the plugin provides.

Title boosting (D-10) is not exposed as a plugin configuration option. Lunr.js supports field boosting, but the plugin does not surface this in its config. Achieving title-first ranking would require a custom lunr configuration callback, which the plugin may or may not expose. This is flagged as LOW confidence.

**Primary recommendation:** Apply CSS overrides targeting `--search-local-*` variables and `mark` element styles. Enable `highlightSearchTermsOnTargetPage`. Configure `searchContextByPaths` for auto-detection (not tabs). Measure index size and optimize only if above 5MB threshold.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Search modal uses navy header (#194a7d) with white text, white body for result readability, teal (#29abe2) accent for selected/hovered results. Matches existing navbar/footer branding pattern.
- **D-02:** Backdrop uses medium dim -- rgba(0,0,0,0.5). Standard modal pattern, content behind partially visible.
- **D-03:** Barlow font applied to search input and results via CSS custom properties (already set as --ifm-font-family-base).
- **D-04:** Matched search terms highlighted with light teal background (rgba(41,171,226,0.15)) and bold text in the results list. Consistent with 1NCE teal accent.
- **D-05:** Enable `highlightSearchTermsOnTargetPage` -- after navigating from a result, matching terms on the target page get the same teal highlight briefly so users can find what they searched for.
- **D-06:** Implement `searchContextByPaths` to enable tab-based filtering above results: "All" | "Docs" | "API".
- **D-07:** Tab labels are "All", "Docs", "API" -- shorter than navbar labels, saves horizontal space in modal.
- **D-08:** "All" tab is the default when opening search.
- **D-09:** Optimize only if search index exceeds 5MB compressed (measurement-driven, per Phase 13 D-08 threshold).
- **D-10:** Boost title matches over body content matches in search result ranking. Title matches should appear first.

### Claude's Discretion
- Exact CSS selectors for plugin modal override (inspect plugin DOM structure)
- Teal highlight fade timing on target page (brief flash vs persistent)
- searchContextByPaths path configuration mapping to dual docs instances
- Whether title boosting is achievable via plugin config or requires custom scoring

### Deferred Ideas (OUT OF SCOPE)
- Stop-word removal tuning for IoT/telecom domain terms -- Future (SRCH-05)
- PostHog search analytics (track queries, click-through) -- Future (SRCH-06)
- Scroll-to-match on navigation -- Could be part of highlightSearchTermsOnTargetPage behavior or separate
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| UI-02 | Clicking the search bar opens an overlay with a slightly darkened background | Plugin provides modal with backdrop; CSS override `--search-local-modal-background` and backdrop CSS targets the dim level per D-02 |
| UI-05 | Search overlay styled to match 1NCE branding (navy/teal theme, light-only mode) | Plugin exposes `--search-local-*` CSS variables; override in `custom.css` with navy/teal palette; force light mode via `[data-theme='dark']` overrides |
| UI-07 | Matching terms are highlighted in search results | Plugin uses `<mark>` elements in results with `.hitWrapper mark` selector; override with teal highlight per D-04 |
</phase_requirements>

## Standard Stack

### Core (already installed from Phase 13)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @easyops-cn/docusaurus-search-local | 0.55.1 | Search plugin (theme) | Already installed. CSS variables exposed for theming. [VERIFIED: npm registry, 2026-04-05] |
| mark.js | (bundled) | Term highlighting on target page | Bundled with the search plugin; used when `highlightSearchTermsOnTargetPage: true` [VERIFIED: plugin source code] |

### No Additional Packages Needed

This phase requires zero new npm packages. All work is CSS overrides and config changes.

**Installation:** None required. Phase 13 installed the search plugin.

## Architecture Patterns

### CSS Override Strategy

The plugin uses CSS Modules internally (class names are hashed at build time), but exposes two theming surfaces:

1. **CSS Custom Properties** (`--search-local-*`) -- set in `:root` to override plugin defaults globally
2. **Global CSS selectors** -- the plugin applies some global classes (`.navbar__search`, `.navbar__search-input`) and uses `<mark>` elements that can be targeted directly

```
src/css/custom.css additions:
├── :root overrides for --search-local-* variables
├── .navbar__search-input overrides (input styling)
├── [data-theme='dark'] forced light overrides
├── mark element styling (result list + target page)
└── Backdrop/overlay dim level
```

### Pattern 1: CSS Variable Overrides for Plugin Theming

**What:** Override the plugin's exposed CSS custom properties to apply 1NCE branding without touching plugin source.
**When to use:** Always -- this is the intended customization mechanism.

**Available CSS custom properties:** [VERIFIED: plugin source CSS module]

| Variable | Default (light) | 1NCE Override | Purpose |
|----------|-----------------|---------------|---------|
| `--search-local-modal-background` | `#f5f6f7` | `#ffffff` (white body per D-01) | Modal body background |
| `--search-local-modal-shadow` | `inset 1px 1px 0 0 hsla(0,0%,100%,0.5), 0 3px 8px 0 #555a64` | Keep default or lighten | Modal box shadow |
| `--search-local-modal-width` | `560px` | Keep default | Modal width |
| `--search-local-hit-background` | `#fff` | `#ffffff` | Result item background |
| `--search-local-hit-color` | `#444950` | `var(--ifm-font-color-base)` (4a4a4a) | Result item text color |
| `--search-local-highlight-color` | `var(--ifm-color-primary)` | `#29abe2` (teal, already primary) | Selected result / active highlight |
| `--search-local-hit-active-color` | `var(--ifm-color-white)` | `#ffffff` | Text color when result is selected |
| `--search-local-muted-color` | `#969faf` | Keep default or adjust | Path/icon muted color |
| `--search-local-spacing` | `12px` | Keep default | Internal spacing |
| `--search-local-hit-height` | `56px` | Keep default | Result item height |
| `--search-local-input-active-border-color` | `var(--ifm-color-primary)` | `#29abe2` (teal) | Input focus ring |

**Example override in custom.css:**
```css
/* Source: Plugin CSS module inspection (GitHub) */
:root {
  --search-local-modal-background: #ffffff;
  --search-local-hit-background: #ffffff;
  --search-local-hit-color: var(--ifm-font-color-base);
  --search-local-highlight-color: #29abe2;
  --search-local-muted-color: #7a8599;
}
```

### Pattern 2: Mark Element Styling for Result Highlighting

**What:** The plugin wraps matched terms in `<mark>` tags inside `.hitWrapper`. On the target page, mark.js also wraps terms in `<mark>` tags.
**When to use:** To style the in-result highlights (D-04) and target-page highlights (D-05).

**In search results** (`.hitWrapper mark`): [VERIFIED: plugin CSS source]
```css
/* Plugin default: background: none; color: var(--search-local-highlight-color) */
/* Override for D-04: light teal background + bold */
.hitWrapper mark {
  background-color: rgba(41, 171, 226, 0.15);
  font-weight: 700;
  color: #29abe2;
}
```

**On target page** (mark.js `<mark>` elements): [ASSUMED]
```css
/* mark.js creates <mark> elements in the article content */
article mark {
  background-color: rgba(41, 171, 226, 0.15);
  padding: 2px 0;
  border-radius: 2px;
}
```

### Pattern 3: Forced Light Mode on Search Overlay

**What:** Prevent dark-mode bleed by overriding `[data-theme='dark']` selectors for search components.
**When to use:** Always -- the site is light-only but the plugin ships dark mode styles.

```css
/* Source: Pitfall 6 from PITFALLS.md research */
[data-theme='dark'] .searchBar .dropdownMenu {
  background: #ffffff;
  box-shadow: inset 1px 1px 0 0 hsla(0, 0%, 100%, 0.5), 0 3px 8px 0 #d4d9e1;
}

[data-theme='dark'] .dropdownMenu .suggestion {
  background: #ffffff;
  color: var(--ifm-font-color-base);
}
```

### Anti-Patterns to Avoid
- **Swizzling SearchBar component:** The plugin's SearchBar uses CSS Modules with hashed class names. Swizzling creates an upgrade burden. Use CSS variable overrides instead. [VERIFIED: plugin architecture]
- **Using `!important` broadly:** The plugin already uses `!important` on some properties (e.g., dropdown positioning). Only use `!important` when the plugin's own `!important` must be overridden.
- **Targeting hashed CSS Module class names directly:** Class names like `searchBar_xyz` change between builds. Target via attribute selectors (`[class*="searchBar"]`) or via the global classes the plugin uses (`.navbar__search`, `.navbar__search-input`).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Search result highlighting | Custom JS to wrap matches | Plugin's built-in `<mark>` elements + CSS override | Plugin already handles tokenization and match wrapping |
| Target page highlighting | Custom mark.js integration | `highlightSearchTermsOnTargetPage: true` config option | Plugin bundles mark.js, passes keywords via URL `_highlight` param |
| Modal backdrop dim | Custom overlay div with z-index | Plugin's built-in modal + CSS backdrop override | Plugin manages focus trap, escape key, click-outside |
| Search context filtering UI | Custom React tabs component | `searchContextByPaths` auto-detection | See critical finding below about tabs |

## Critical Finding: searchContextByPaths Does NOT Create Tabs

**Confidence: HIGH** [VERIFIED: plugin source code SearchBar.tsx + README]

The user decisions D-06/D-07/D-08 assume `searchContextByPaths` creates tab-based filtering ("All" | "Docs" | "API") above search results. **This is incorrect.**

What `searchContextByPaths` actually does:
1. Creates **separate search indexes** per path at build time
2. **Auto-detects** the current context from the page URL (on `/docs/*` pages, only docs results show; on `/api/*` pages, only API results show)
3. Shows a **footer link** to "See all results" that lets users bridge to the other context
4. With `useAllContextsWithNoSearchContext: true`, pages outside defined paths (like the homepage) show results from all contexts

What it does NOT do:
- Does NOT render tabs, buttons, or a dropdown for switching contexts
- Does NOT provide an "All" tab
- Does NOT let users manually select which context to search in

**Implication for planning:**
- Option A (recommended): Accept auto-detection behavior. This is still useful -- users on API pages see API results, users on docs pages see docs results. Configure `searchContextByPaths` + `useAllContextsWithNoSearchContext: true` so the homepage/non-doc pages show all results. No custom UI needed.
- Option B: Build custom tabs UI by swizzling SearchBar. This requires wrapping the search component in custom React code that switches the active context. Significant custom work, high upgrade risk, and contradicts the "Don't swizzle" guidance.

**Recommendation:** Accept Option A. The auto-detection UX is reasonable. Flag D-06/D-07/D-08 for user re-confirmation -- the assumed "tabs" behavior is not what the plugin provides.

## Critical Finding: Title Boosting Not Configurable via Plugin

**Confidence: MEDIUM** [VERIFIED: README has no field boosting option; ASSUMED: lunr.js supports it internally]

Decision D-10 requests boosting title matches over body content. The plugin's README does not expose any ranking/boosting configuration option. Lunr.js itself supports field boosting via its builder API, but the plugin does not surface a callback or config for this.

**Options:**
- The plugin may already boost titles by default (lunr.js commonly does this). This needs empirical testing.
- A custom lunr configuration callback may be possible but is not documented.

**Recommendation:** Test with the existing plugin and check if title matches already rank higher than body matches. If not, flag for future investigation. Do not attempt to modify lunr internals.

## Common Pitfalls

### Pitfall 1: CSS Module Class Name Targeting
**What goes wrong:** Developers try to target `.searchBarContainer` or `.dropdownMenu` directly in custom.css, but these are CSS Module class names that get hashed (e.g., `searchBarContainer_abc123`).
**Why it happens:** The class names visible in browser DevTools look stable but change between plugin versions.
**How to avoid:** Use CSS custom properties (`--search-local-*`) as the primary override mechanism. For structural overrides, use attribute selectors (`[class*="dropdownMenu"]`) or the global classes (`.navbar__search`, `.navbar__search-input`).
**Warning signs:** Styles work in dev but break after plugin update.

### Pitfall 2: Dark Mode Bleed on Search Overlay
**What goes wrong:** With OS dark mode enabled, the search overlay renders with dark backgrounds even though the site is light-only.
**Why it happens:** The plugin ships `html[data-theme='dark']` CSS rules that override backgrounds. Even with `disableSwitch: true`, the `data-theme` attribute may still be set on `<html>` if the browser/OS preference is dark. [VERIFIED: plugin CSS source contains dark mode selectors]
**How to avoid:** Add explicit `[data-theme='dark']` overrides in `custom.css` that force light-mode colors on all search-related selectors.
**Warning signs:** Only visible when testing with OS dark mode enabled.

### Pitfall 3: Backdrop Overlay Selector
**What goes wrong:** The modal backdrop may not be a separate DOM element that can be styled. The plugin's dropdown is positioned relative to the search bar, and the backdrop dim comes from a separate mechanism.
**Why it happens:** The plugin may not have a built-in backdrop element -- the "dimmed backdrop" mentioned in FEATURES.md needs verification against the actual rendered DOM.
**How to avoid:** After Phase 13 is complete and the plugin is installed, inspect the rendered DOM in browser DevTools to find the exact backdrop element. If no backdrop element exists, one can be added via a CSS `::before` pseudo-element on the body when the search modal is open.
**Warning signs:** No visible backdrop despite expecting one from Phase 13 notes. [ASSUMED -- actual DOM structure needs verification after plugin install]

### Pitfall 4: mark.js Styling Specificity
**What goes wrong:** Custom `mark` element styles don't apply because the plugin's CSS Module styles have higher specificity.
**Why it happens:** The plugin applies `background: none` and `color: var(--search-local-highlight-color)` to `.hitWrapper mark` with CSS Module specificity. A bare `mark {}` selector in custom.css won't win.
**How to avoid:** Match or exceed the plugin's specificity. Use `.searchBar .dropdownMenu .hitWrapper mark` or attribute selectors. For target page marks (from mark.js), `article mark` should be sufficient since those are outside the plugin's CSS Module scope.
**Warning signs:** Highlight styling partially applies (target page works but in-result highlights don't).

## Code Examples

### Complete CSS Override Block for 1NCE Branding
```css
/* Source: Plugin CSS module analysis + CONTEXT.md decisions D-01 through D-05 */

/* === Search Modal: 1NCE Branding === */

/* Modal body: white background for readability (D-01) */
:root {
  --search-local-modal-background: #ffffff;
  --search-local-hit-background: #ffffff;
  --search-local-hit-color: var(--ifm-font-color-base);
  --search-local-highlight-color: #29abe2;
  --search-local-hit-active-color: #ffffff;
  --search-local-muted-color: #7a8599;
  --search-local-input-active-border-color: #29abe2;
}

/* Force light mode on search overlay (dark mode prevention) */
[data-theme='dark'] {
  --search-local-modal-background: #ffffff;
  --search-local-hit-background: #ffffff;
  --search-local-hit-color: var(--ifm-font-color-base);
  --search-local-highlight-color: #29abe2;
  --search-local-hit-active-color: #ffffff;
  --search-local-muted-color: #7a8599;
}

/* Result highlight: teal background + bold text (D-04) */
[class*="hitWrapper"] mark {
  background-color: rgba(41, 171, 226, 0.15) !important;
  font-weight: 700;
  color: #29abe2;
}

/* Target page highlight from mark.js (D-05) */
article mark {
  background-color: rgba(41, 171, 226, 0.15);
  padding: 2px 0;
  border-radius: 2px;
}
```

### Config Additions for docusaurus.config.ts
```typescript
// Source: Plugin README + CONTEXT.md decisions D-05, D-06
// Add to existing search plugin config in themes array:
{
  // ... existing config from Phase 13 ...

  // Enable target page highlighting (D-05)
  highlightSearchTermsOnTargetPage: true,

  // Auto-detect search context by path (D-06, revised from tabs to auto-detection)
  searchContextByPaths: [
    { label: 'Docs', path: '/docs' },
    { label: 'API', path: '/api' },
  ],
  useAllContextsWithNoSearchContext: true,
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Swizzle SearchBar for custom UI | CSS custom properties (`--search-local-*`) | Plugin v0.40+ | No swizzling needed for theming |
| Manual mark.js integration | `highlightSearchTermsOnTargetPage: true` | Plugin v0.35+ | One config flag replaces custom JS |
| Single search index for multi-instance | `searchContextByPaths` auto-detection | Plugin v0.44+ (issue #550 fix) | Separate indexes per docs instance |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | mark.js on target page creates `<mark>` elements that can be styled with `article mark` selector | Code Examples | If mark.js uses a different element or class, the target page highlight CSS won't apply. Verify after install. |
| A2 | Plugin has a visible backdrop/overlay element when modal opens | Pitfall 3 | If no backdrop exists, need to create one via CSS pseudo-element or custom wrapper. |
| A3 | Plugin already boosts title matches over body matches by default | Critical Finding: Title Boosting | If titles aren't boosted, D-10 cannot be achieved without custom lunr config. Low user impact since results are already decent. |
| A4 | `[data-theme='dark']` selectors in custom.css will successfully override plugin's dark mode styles | Code Examples | If plugin uses more specific selectors (e.g., scoped to CSS module class), may need `!important`. |
| A5 | Highlight fade timing on target page can be controlled via CSS animation on `mark` elements | D-05 implementation | mark.js may add/remove marks dynamically, making CSS transitions unreliable. May need to accept persistent highlights until page navigation. |

## Open Questions

1. **Backdrop DOM structure**
   - What we know: The plugin renders a modal-style dropdown, and FEATURES.md says it has a "dimmed backdrop"
   - What's unclear: Whether the backdrop is a separate DOM element or needs to be created via CSS
   - Recommendation: Inspect rendered DOM after running `npm run build && npm run serve` with search open. If no backdrop element exists, add one via `body::before` triggered by a search-active body class, or accept the dropdown-without-backdrop pattern.

2. **searchContextByPaths tabs vs auto-detection (D-06/D-07/D-08)**
   - What we know: The plugin auto-detects context from URL, does NOT create tabs
   - What's unclear: Whether the user will accept auto-detection as sufficient or requires actual tabs
   - Recommendation: Configure auto-detection. Flag to user that "tabs" require custom React work. Auto-detection covers the core UX need (filtering results by content type).

3. **Title boosting (D-10)**
   - What we know: Plugin README has no ranking config option
   - What's unclear: Whether titles are already boosted by default in the plugin's lunr configuration
   - Recommendation: Test empirically after Phase 13 build. Search for a term that appears in both a title and a body, check if title match ranks first.

4. **Index size measurement**
   - What we know: Phase 13 D-08 set 5MB compressed threshold for optimization
   - What's unclear: Actual index size until Phase 13 build runs
   - Recommendation: After Phase 13 build, measure `build/search-index-*.json` file size. Only optimize if > 5MB.

## Project Constraints (from CLAUDE.md)

- **Theming:** Use Infima CSS custom properties (`--ifm-*` tokens), no Tailwind
- **CSS Framework:** Infima (built-in), do not add Tailwind
- **Color Mode:** Light-only (`disableSwitch: true`, `respectPrefersColorScheme: false`)
- **Font:** Barlow via `--ifm-font-family-base`
- **Brand Colors:** Navy #194a7d, Teal #29abe2
- **Plugin:** @easyops-cn/docusaurus-search-local v0.55.1 (already in package.json)
- **GSD Workflow:** Must use GSD commands for execution

## Sources

### Primary (HIGH confidence)
- Plugin CSS Module source (GitHub): `SearchBar.module.css` -- full CSS variable listing, class names, dark mode selectors
- Plugin SearchBar.tsx source (GitHub) -- confirmed searchContextByPaths auto-detection, no tab UI
- Plugin README (GitHub) -- `highlightSearchTermsOnTargetPage`, `searchContextByPaths`, `useAllContextsWithNoSearchContext` config options
- npm registry: @easyops-cn/docusaurus-search-local v0.55.1 [VERIFIED: 2026-04-05]
- Project `src/css/custom.css` -- existing brand variables, no search overrides yet
- Project `docusaurus.config.ts` lines 315-364 -- current search plugin config from Phase 13

### Secondary (MEDIUM confidence)
- `.planning/research/PITFALLS.md` -- dark mode bleed, navbar overflow, index size concerns
- `.planning/research/FEATURES.md` -- feature prioritization, CSS variable theming guidance

### Tertiary (LOW confidence)
- mark.js default behavior for target page highlighting -- not directly verified against this plugin version
- Title boosting behavior -- not documented, assumed from lunr.js defaults

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no new packages, CSS-only changes
- Architecture: HIGH -- plugin CSS variables verified from source
- Pitfalls: MEDIUM-HIGH -- dark mode bleed verified from source; backdrop DOM unknown
- searchContextByPaths behavior: HIGH -- verified does NOT create tabs
- Title boosting: LOW -- not documented, needs empirical testing

**Research date:** 2026-04-05
**Valid until:** 2026-05-05 (stable -- CSS APIs unlikely to change in patch releases)
