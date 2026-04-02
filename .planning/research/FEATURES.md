# Feature Research

**Domain:** Developer documentation site -- v1.2 design alignment with original ReadMe.com hub
**Researched:** 2026-04-02
**Confidence:** HIGH

> This file covers ONLY the v1.2 milestone features (design alignment). For v1.0 migration features and v1.1 AI assistant features, see git history.

## Feature Landscape

### Table Stakes (Users Expect These)

These changes are required to match the original 1NCE Developer Hub. Without them, the migration feels incomplete to anyone who used the ReadMe.com site.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Favicon replacement (1NCE 120x120 PNG) | Original hub has 1NCE brand favicon; current site shows Docusaurus default `favicon.ico` | LOW | Drop PNG into `static/img/`, update `favicon` in `docusaurus.config.ts`. Docusaurus accepts `.png` directly in `<link href>`. No `.ico` conversion needed for a developer audience. |
| Navbar logo replacement (1NCE SVG from 1nce.com) | Original hub shows official 1NCE logo; current `1nce-logo.svg` may not match latest branding from corporate site | LOW | Replace `static/img/1nce-logo.svg` with the official SVG from 1nce.com. Verify dimensions work with navbar height (~32px). Config already points to `img/1nce-logo.svg` so a file swap is likely sufficient. |
| Dark mode removal | Original ReadMe.com hub is light-only. Current dark mode has readability issues (PROJECT.md: "not readable"). | LOW | Set `colorMode: { defaultMode: 'light', disableSwitch: true, respectPrefersColorScheme: false }` in themeConfig. Remove `[data-theme='dark']` CSS blocks from `custom.css`. Optionally remove `darkTheme` from prism config. **Verified:** Docusaurus officially supports this 3-property pattern for light-only mode. |
| External navbar links (1NCE Home, Shop, Portal) | Original ReadMe.com hub header has these links for cross-navigation to main 1NCE properties | LOW | Add `{ href: 'https://...', label: '...', position: 'right' }` items to `navbar.items`. **Verified:** Docusaurus auto-adds `target="_blank" rel="noopener noreferrer"` to `href` links. Position `right` keeps them visually separate from doc tabs on the left. |
| Sidebar consolidation (merge Platform, Blueprints, Terms into Documentation) | Original ReadMe.com hub has one "Documentation" sidebar containing all content sections. Current Docusaurus site splits content across 5 separate docs plugin instances with 5 separate sidebars -- navigation does not match the original. | HIGH | This is the most complex change. See detailed analysis below. |

### Differentiators (Competitive Advantage)

Features not required for v1.2 design parity but that would improve the experience beyond the original hub.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Breadcrumb navigation in unified sidebar | Helps users orient within the now-deeper unified sidebar after merge | LOW | Already enabled by default in Docusaurus theme-classic. After sidebar merge, breadcrumbs become more valuable since the hierarchy deepens. No config change needed -- just verify it works after restructure. |
| `@docusaurus/plugin-client-redirects` for old URLs | Preserves bookmarks and external links pointing to old `/platform/*`, `/blueprints/*`, `/terms/*` paths | MEDIUM | Not something the original hub had, but protects SEO and user experience during the transition. Creates client-side redirects at build time. Alternative: CloudFront Function redirects (server-side, more reliable for SEO). |
| Consistent navbar active state for 2-tab layout | After reducing from 5 tabs to 2, the active state highlighting (teal color) becomes cleaner and more prominent | LOW | Current `.navbar__link--active { color: #29abe2; }` CSS will work. Just verify after tab removal. |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Keep dark mode but "fix readability" | Developers expect dark mode | Readability issues span all content -- headings, code blocks, admonitions, API schema viewers. Fixing requires auditing hundreds of pages and the openapi-docs theme components. Massive effort for a feature the original hub never had. | Remove entirely for v1.2. Can revisit in a future milestone with a proper theme design pass. |
| Mega-menu / dropdown navbar | Fits more navigation into the header to compensate for sidebar merge | Docusaurus navbar does not natively support multi-level dropdowns for doc links. Custom implementation is brittle and breaks with theme updates. | Use sidebar hierarchy for deep navigation. Keep navbar flat: 2 doc tabs + external links. |
| Keep Terms & Abbreviations as a separate tab | Currently exists as its own nav tab and plugin | Original hub likely had this within Documentation, not standalone. Keeping it as a separate plugin adds config complexity for what is essentially a single glossary page. | Merge into Documentation sidebar as a top-level category. |
| Move API Reference pages into the Documentation sidebar too | "Unify everything into one sidebar" | API pages are generated by `docusaurus-plugin-openapi-docs` which requires a dedicated docs plugin instance with `docItemComponent: '@theme/ApiItem'`. Merging would break the interactive Try It panels. The original hub also kept API Explorer as a separate tab. | Keep API Explorer as a separate nav tab with its own sidebar. Target is 2 plugins (docs + api), not 1. |

## Detailed Analysis: Sidebar Consolidation

This is the dominant feature of v1.2. The current architecture uses **5 separate `@docusaurus/plugin-content-docs` instances**, each with its own route base path and sidebar file.

### Current Structure (5 plugins + 1 openapi plugin)
```
Navbar Tab              Plugin ID     Route        Sidebar File                  Content Dir
---                     ---           ---          ---                           ---
Documentation           (default)     /docs/*      sidebars/documentation.ts     docs/documentation/
API Explorer            api           /api/*       sidebars/api.ts               docs/api/
1NCE Platform           platform      /platform/*  sidebars/platform.ts          docs/platform/
Blueprints & Examples   blueprints    /blueprints/* sidebars/blueprints.ts       docs/blueprints/
Terms & Abbreviations   terms         /terms/*     sidebars/terms.ts             docs/terms/
```

### Target Structure (2 plugins)
```
Navbar Tab              Plugin ID     Route        Sidebar File                  Content Dir
---                     ---           ---          ---                           ---
Documentation           (default)     /docs/*      sidebars/documentation.ts     docs/documentation/
API Explorer            api           /api/*       sidebars/api.ts               docs/api/
```

### Content That Must Move

| Source Directory | Destination Directory | Content Description | Approx. Files |
|------------------|-----------------------|---------------------|---------------|
| `docs/platform/1nce-os/` | `docs/documentation/1nce-os/` | 1NCE OS services (12 subcategories, ~35 pages) | ~35 |
| `docs/platform/1nce-portal/` | `docs/documentation/1nce-portal/` | Portal guides (already exists in documentation sidebar as a category) | ~6 |
| `docs/platform/platform-services/` | `docs/documentation/platform-services/` | Data Streamer, SMS Forwarder, Blockchain (already exists in documentation sidebar) | ~10 |
| `docs/blueprints/blueprints-examples/` | `docs/documentation/blueprints-examples/` | Hardware tutorials, examples (~40 pages) | ~40 |
| `docs/blueprints/*.md` (root files) | `docs/documentation/` (as appropriate) | Standalone hardware guides (quectel, sara, sim7000g, etc.) | ~6 |
| `docs/terms/` | `docs/documentation/terms-abbreviations/` | Glossary content | ~1-3 |

**Key observation:** The current `sidebars.ts` (root file, 700 lines) already contains manual entries for `1nce-portal`, `platform-services`, `1nce-os`, and `blueprints-examples` categories -- but these point to paths under `docs/documentation/`. The `sidebars/documentation.ts` uses `autogenerated` mode. There is a disconnect: the root `sidebars.ts` appears to be a legacy artifact from before the multi-plugin split. The actual `sidebars/documentation.ts` is the one Docusaurus uses (configured in `docusaurus.config.ts`).

### Implementation Steps

1. **Move content files** from `docs/platform/`, `docs/blueprints/`, `docs/terms/` into `docs/documentation/` preserving subdirectory structure
2. **Update `sidebars/documentation.ts`** -- switch from `autogenerated` to a manual sidebar definition that includes all merged sections in the correct order
3. **Remove 3 plugin-content-docs instances** from `docusaurus.config.ts` (platform, blueprints, terms)
4. **Remove 3 sidebar files** (`sidebars/platform.ts`, `sidebars/blueprints.ts`, `sidebars/terms.ts`)
5. **Update navbar items** -- remove 3 tabs, keep Documentation and API Explorer
6. **Handle URL redirects** for old paths (`/platform/*`, `/blueprints/*`, `/terms/*`) to new paths under `/docs/*`
7. **Audit and fix internal cross-references** -- any MDX files linking to `/platform/...` or `/blueprints/...` paths need updating
8. **Delete the root `sidebars.ts`** if it is confirmed unused (it is not referenced in the current config)

### Why This Is HIGH Complexity

- **~90+ content files** must be moved across 3 directories while preserving relative links and image references
- **Cross-references between docs** may use absolute paths that break after the move
- **Sidebar ordering** must be manually defined to match the original hub's navigation hierarchy
- **URL redirect handling** is critical for SEO and external links/bookmarks
- **The root `sidebars.ts` (700 lines)** may or may not be an accurate representation of the desired merged sidebar -- needs investigation
- **`_category_.json` files** in moved directories may need `position` values adjusted for correct ordering
- **Testing** requires verifying that all ~400 pages build correctly after the restructure

## Feature Dependencies

```
[Favicon replacement]           (independent -- no dependencies)
[Logo replacement]              (independent -- no dependencies)
[Dark mode removal]             (independent -- no dependencies)
[External navbar links]         (independent -- no dependencies)

[Sidebar consolidation]
    |-- requires --> [Content file moves (platform, blueprints, terms -> documentation)]
    |-- requires --> [Sidebar config rewrite (sidebars/documentation.ts)]
    |-- requires --> [Plugin removal from docusaurus.config.ts]
    |-- requires --> [Navbar tab reduction (5 -> 2 + external links)]
    |-- requires --> [URL redirect setup (plugin-client-redirects or CloudFront)]
    |-- requires --> [Internal link audit/fix across all MDX files]
    |-- should follow --> [Dark mode removal]
```

### Dependency Notes

- **All 4 simple features are independent:** Favicon, logo, dark mode, external links can be done in any order with zero dependencies on each other or on the sidebar consolidation.
- **Sidebar consolidation has 6 sub-tasks that are sequential:** Content moves must happen before sidebar config rewrite, which must happen before plugin removal, etc.
- **Dark mode removal should precede sidebar consolidation:** Not a hard dependency, but removing `[data-theme='dark']` CSS blocks first means less CSS to audit after the restructure. Cleaner sequencing.
- **URL redirects depend on knowing old-to-new path mapping:** This is only finalized after the content moves are complete.

## v1.2 Milestone Definition

### Phase 1: Quick Wins (all independent, low complexity)

- [ ] Favicon replacement -- drop in 1NCE 120x120 PNG, update `favicon` config property
- [ ] Logo replacement -- swap SVG file, verify navbar rendering at ~32px height
- [ ] Dark mode removal -- 3 colorMode config properties + remove `[data-theme='dark']` CSS blocks
- [ ] External navbar links -- add 3 `href` items to `navbar.items` with `position: 'right'`

### Phase 2: Sidebar Consolidation (high complexity, core of v1.2)

- [ ] Move `docs/platform/*` into `docs/documentation/` preserving subdirectory structure
- [ ] Move `docs/blueprints/*` into `docs/documentation/` preserving subdirectory structure
- [ ] Move `docs/terms/*` into `docs/documentation/` preserving subdirectory structure
- [ ] Rewrite `sidebars/documentation.ts` with manual sidebar definition matching original hub order
- [ ] Remove platform, blueprints, terms plugin instances from `docusaurus.config.ts`
- [ ] Remove unused sidebar files (`sidebars/platform.ts`, `sidebars/blueprints.ts`, `sidebars/terms.ts`)
- [ ] Update navbar to 2 doc tabs (Documentation, API Explorer) + 3 external links (right side)
- [ ] Set up URL redirects for old paths (`/platform/*` -> `/docs/*`, etc.)
- [ ] Audit and fix internal cross-references in all MDX files
- [ ] Verify build succeeds with all ~400 pages

### Defer (not v1.2)

- [ ] Dark mode reimplementation -- requires full theme design pass, not just a toggle flip
- [ ] Search integration -- still deferred per PROJECT.md
- [ ] Mobile navigation optimization -- test after sidebar merge, fix only if broken
- [ ] Server-side redirects via CloudFront Function -- client-side redirects are sufficient for v1.2; add server-side later if SEO impact is measured

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority | Risk |
|---------|------------|---------------------|----------|------|
| Sidebar consolidation | HIGH | HIGH | P1 | URL breakage, cross-ref breakage, build failures |
| Dark mode removal | HIGH | LOW | P1 | Minimal -- config change + CSS cleanup |
| External navbar links | MEDIUM | LOW | P1 | None -- additive change |
| Favicon replacement | MEDIUM | LOW | P1 | None -- file swap |
| Logo replacement | MEDIUM | LOW | P1 | SVG dimension mismatch possible, easy to fix |
| URL redirects for old paths | MEDIUM | MEDIUM | P1 | Must be done as part of sidebar consolidation |
| Root `sidebars.ts` cleanup | LOW | LOW | P2 | Investigate whether it is referenced anywhere before removing |

**Priority key:**
- P1: Must have for v1.2 milestone completion
- P2: Should have, add when possible
- P3: Nice to have, future consideration

All core features are P1 because this milestone is specifically about design alignment. The differentiation is in sequencing: quick wins first (Phase 1), then sidebar consolidation (Phase 2).

## Implementation Reference: Docusaurus Config Changes

### Dark Mode Removal (verified against Docusaurus official docs)
```typescript
// In themeConfig:
colorMode: {
  defaultMode: 'light',
  disableSwitch: true,
  respectPrefersColorScheme: false,
},
```
**Source:** https://docusaurus.io/docs/api/themes/configuration -- HIGH confidence

### CSS Cleanup After Dark Mode Removal
Remove from `src/css/custom.css`:
- Lines 42-57: `[data-theme='dark'] { ... }` block
- Lines 64-67: `[data-theme='dark'] h2, [data-theme='dark'] h3 { ... }`
- Lines 98-101: `[data-theme='dark'] .footer--dark { ... }`
- Optionally remove `darkTheme: prismThemes.dracula` from prism config

### External Navbar Links (verified against Docusaurus official docs)
```typescript
// In themeConfig.navbar.items, add to right side:
{ href: 'https://1nce.com', label: '1NCE Home', position: 'right' },
{ href: 'https://shop.1nce.com', label: 'Shop', position: 'right' },
{ href: 'https://portal.1nce.com', label: 'Portal', position: 'right' },
```
External `href` links automatically get `target="_blank" rel="noopener noreferrer"`.
**Source:** https://docusaurus.io/docs/api/themes/configuration -- HIGH confidence

### Favicon Replacement (verified against Docusaurus official docs)
```typescript
// In config root:
favicon: 'img/1nce-favicon.png',  // PNG is valid, place in static/img/
```
**Source:** https://docusaurus.io/docs/api/docusaurus-config -- HIGH confidence

### Plugin Removal After Sidebar Merge
Remove from `plugins` array in `docusaurus.config.ts`:
```typescript
// DELETE these 3 plugin entries:
['@docusaurus/plugin-content-docs', { id: 'platform', ... }],
['@docusaurus/plugin-content-docs', { id: 'blueprints', ... }],
['@docusaurus/plugin-content-docs', { id: 'terms', ... }],
```

### Navbar Tab Reduction
Remove from `navbar.items`:
```typescript
// DELETE these 3 navbar items:
{ type: 'docSidebar', sidebarId: 'platformSidebar', label: '1NCE Platform', docsPluginId: 'platform' },
{ type: 'docSidebar', sidebarId: 'blueprintsSidebar', label: 'Blueprints & Examples', docsPluginId: 'blueprints' },
{ type: 'docSidebar', sidebarId: 'termsSidebar', label: 'Terms & Abbreviations', docsPluginId: 'terms' },
```

## Competitor Feature Analysis

| Feature | ReadMe.com (original hub) | Docusaurus v1.0 (current) | Target v1.2 |
|---------|---------------------------|---------------------------|-------------|
| Sidebar structure | Single unified sidebar with all doc sections | 5 separate sidebars via 5 plugin instances | 2 sidebars: unified docs + API |
| Dark mode | Light only | Light + dark (dark unreadable) | Light only |
| External header links | 1NCE Home, Shop, Portal in header | None | Match original |
| Favicon | 1NCE branded | Docusaurus default | 1NCE branded |
| Logo | Official 1NCE SVG | 1NCE SVG (possibly outdated) | Official from 1nce.com |
| Navbar tabs | Documentation, API Explorer | 5 tabs | 2 doc tabs + 3 external links |

## Complexity Assessment Summary

| Feature | Estimated Effort | Risk Level | Notes |
|---------|-----------------|------------|-------|
| Favicon replacement | < 1 hour | NONE | File swap + config update |
| Logo replacement | < 1 hour | LOW | File swap, verify dimensions |
| Dark mode removal | 1-2 hours | LOW | Config + CSS cleanup, straightforward |
| External navbar links | < 1 hour | NONE | 3 config entries |
| Sidebar consolidation | 2-4 days | HIGH | Content moves, sidebar rewrite, link audit, redirect setup, build verification |

**Total estimated effort: 3-5 days** for a single developer, with sidebar consolidation consuming ~80% of the time.

## Sources

- Docusaurus theme configuration (colorMode): https://docusaurus.io/docs/api/themes/configuration -- HIGH confidence
- Docusaurus navbar configuration (href items): https://docusaurus.io/docs/api/themes/configuration -- HIGH confidence
- Docusaurus favicon configuration: https://docusaurus.io/docs/api/docusaurus-config -- HIGH confidence
- Current codebase analysis: `docusaurus.config.ts`, `sidebars.ts`, `sidebars/*.ts`, `src/css/custom.css` -- HIGH confidence (direct inspection)
- PROJECT.md v1.2 milestone definition -- HIGH confidence (direct inspection)

---
*Feature research for: v1.2 Design Alignment with Original 1NCE Developer Hub*
*Researched: 2026-04-02*
