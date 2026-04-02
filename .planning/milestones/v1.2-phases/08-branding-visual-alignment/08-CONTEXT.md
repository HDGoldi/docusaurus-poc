# Phase 8: Branding & Visual Alignment - Context

**Gathered:** 2026-04-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Make the Docusaurus site visually match the original 1NCE Developer Hub — replace the default Docusaurus favicon and verify the logo, force light-only mode, add external navigation links to the header, and create a branded social card image. This phase covers BRAND-01, BRAND-02, BRAND-03, and NAV-01.

</domain>

<decisions>
## Implementation Decisions

### Favicon & Logo Sourcing
- **D-01:** Extract both the official 1NCE favicon (120x120 PNG) and SVG logo from 1nce.com (not help.1nce.com)
- **D-02:** The existing `static/img/1nce-logo.svg` should be verified against what's on 1nce.com and replaced if different

### Dark Mode Removal
- **D-03:** Config-only approach — set `colorMode` to `defaultMode: 'light'` and `disableSwitch: true` in `docusaurus.config.ts`, remove `respectPrefersColorScheme: true`
- **D-04:** Leave existing `[data-theme='dark']` CSS rules in `src/css/custom.css` as harmless dead code — no CSS cleanup needed

### External Navbar Links
- **D-05:** Add three external links to the right side of the navbar: 1NCE Home, 1NCE Shop, 1NCE Portal
- **D-06:** URLs should match the original help.1nce.com header — extract exact URLs during implementation
- **D-07:** Text-only labels, no icons — open in new tabs with `target: '_blank'`

### Navbar Title & Branding
- **D-08:** Keep '1NCE Developer Hub' title text next to the logo (current behavior)
- **D-09:** Create a 1NCE-branded social card image to replace the default `docusaurus-social-card.jpg` for Open Graph/Twitter link previews

### Claude's Discretion
- Exact external link URL paths (e.g., whether to include `/en-eu/` regional prefix) — match what the original hub uses
- Social card image design — should feature 1NCE branding (logo, navy/teal colors) in appropriate Open Graph dimensions (1200x630)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Configuration
- `docusaurus.config.ts` — Current navbar, colorMode, favicon, and logo configuration (lines 10, 170-214)

### Styling
- `src/css/custom.css` — Current CSS with dark mode blocks and branding variables

### Static Assets
- `static/img/1nce-logo.svg` — Current logo file (verify against 1nce.com)
- `static/img/favicon.ico` — Current favicon (Docusaurus default, to be replaced)
- `static/img/favicon.png` — Current favicon PNG variant
- `static/img/docusaurus-social-card.jpg` — Current social card (to be replaced)

### Requirements
- `.planning/REQUIREMENTS.md` — BRAND-01, BRAND-02, BRAND-03, NAV-01 definitions

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `static/img/1nce-logo.svg` — May already be the correct official logo; needs verification against 1nce.com
- `src/css/custom.css` — Navy/teal color palette already established via `--ifm-*` custom properties

### Established Patterns
- Docusaurus `themeConfig.colorMode` for color mode control
- Docusaurus `themeConfig.navbar.items` array for navbar link management
- Infima CSS custom properties for all branding (v1.0 decision)

### Integration Points
- `docusaurus.config.ts:10` — favicon path
- `docusaurus.config.ts:170-171` — colorMode config (currently `respectPrefersColorScheme: true`)
- `docusaurus.config.ts:173-214` — navbar items array (external links to be added at `position: 'right'`)
- `docusaurus.config.ts:168` — `image` field for social card

</code_context>

<specifics>
## Specific Ideas

- Assets sourced from 1nce.com corporate site, not the ReadMe-hosted help.1nce.com
- External links should replicate the original help.1nce.com header navigation pattern

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 08-branding-visual-alignment*
*Context gathered: 2026-04-02*
