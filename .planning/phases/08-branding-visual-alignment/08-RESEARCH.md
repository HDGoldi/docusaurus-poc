# Phase 8: Branding & Visual Alignment - Research

**Researched:** 2026-04-02
**Domain:** Docusaurus theming, branding, and navbar configuration
**Confidence:** HIGH

## Summary

Phase 8 is a straightforward configuration and asset replacement phase. The scope is narrow: update the favicon reference, verify the logo (already correct), disable dark mode via config, add three external navbar links, and replace the social card image.

Key finding: most assets are already in place. The existing `static/img/favicon.png` is already the official 1NCE 120x120 PNG favicon (verified visually against `1nce.com/favicons/favicon-120x120.png`). The existing `static/img/1nce-logo.svg` is byte-identical to the SVG served on 1nce.com. The work is primarily config changes in `docusaurus.config.ts` and creating a branded social card.

**Primary recommendation:** This phase requires ~4 config line changes, one asset download (favicon for .ico replacement), one asset creation (social card), and no custom code. Plan accordingly -- this is a small phase.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Extract both the official 1NCE favicon (120x120 PNG) and SVG logo from 1nce.com (not help.1nce.com)
- **D-02:** The existing `static/img/1nce-logo.svg` should be verified against what's on 1nce.com and replaced if different
- **D-03:** Config-only approach -- set `colorMode` to `defaultMode: 'light'` and `disableSwitch: true` in `docusaurus.config.ts`, remove `respectPrefersColorScheme: true`
- **D-04:** Leave existing `[data-theme='dark']` CSS rules in `src/css/custom.css` as harmless dead code -- no CSS cleanup needed
- **D-05:** Add three external links to the right side of the navbar: 1NCE Home, 1NCE Shop, 1NCE Portal
- **D-06:** URLs should match the original help.1nce.com header -- extract exact URLs during implementation
- **D-07:** Text-only labels, no icons -- open in new tabs with `target: '_blank'`
- **D-08:** Keep '1NCE Developer Hub' title text next to the logo (current behavior)
- **D-09:** Create a 1NCE-branded social card image to replace the default `docusaurus-social-card.jpg` for Open Graph/Twitter link previews

### Claude's Discretion
- Exact external link URL paths (e.g., whether to include `/en-eu/` regional prefix) -- match what the original hub uses
- Social card image design -- should feature 1NCE branding (logo, navy/teal colors) in appropriate Open Graph dimensions (1200x630)

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| BRAND-01 | Site uses official 1NCE 120x120 PNG favicon | Existing `favicon.png` is already the correct 1NCE favicon. Config needs to change from `favicon.ico` to `favicon.png`. The `.ico` file is a 32x27 Docusaurus default and should be replaced or removed. |
| BRAND-02 | Navbar displays official 1NCE SVG logo from 1nce.com | Existing `static/img/1nce-logo.svg` is already identical to the 1nce.com corporate logo. No replacement needed. Already configured in navbar. |
| BRAND-03 | Dark mode is fully removed -- no toggle, light-only, all dark CSS cleaned up | Per D-03/D-04: config-only change to `colorMode`. Dark CSS left as dead code. |
| NAV-01 | Navbar includes external links for 1NCE Home, 1NCE Shop, 1NCE Portal (matching original hub header) | External link URLs extracted from help.1nce.com. Docusaurus navbar items support `href` + `target` for external links. |
</phase_requirements>

## Architecture Patterns

### Current Config Structure (docusaurus.config.ts)

The file is well-structured. All changes are in `themeConfig`:

- **Line 10:** `favicon: 'img/favicon.ico'` -- change to `'img/favicon.png'`
- **Lines 174-176:** `colorMode` block -- replace with light-only config
- **Lines 173:** `image` field -- update social card filename
- **Lines 183-218:** `navbar.items` array -- append external links

### Pattern: Disabling Dark Mode (Config-Only)

```typescript
// Source: Docusaurus official docs - themeConfig.colorMode
colorMode: {
  defaultMode: 'light',
  disableSwitch: true,
  respectPrefersColorScheme: false,
},
```

This is the standard Docusaurus approach. Setting `disableSwitch: true` removes the toggle from the navbar. Setting `respectPrefersColorScheme: false` ensures OS-level dark mode is ignored.

### Pattern: External Navbar Links

```typescript
// Source: Docusaurus official docs - themeConfig.navbar.items
{
  href: 'https://1nce.com',
  label: '1NCE Home',
  position: 'right',
  target: '_blank',
},
```

Docusaurus navbar items with `href` (instead of `to`) are treated as external links. The `target` property is passed through to the anchor element.

### Pattern: Favicon Configuration

```typescript
// docusaurus.config.ts top-level
favicon: 'img/favicon.png',
```

Docusaurus supports PNG favicons directly. No need for `.ico` format.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Dark mode removal | Custom CSS overrides or JS to force light | `colorMode.disableSwitch: true` config | Config approach is the official Docusaurus way; CSS hacks break on updates |
| External links in navbar | Custom navbar component | `navbar.items` with `href` + `target` | Built-in feature, no swizzling needed |
| Social card | Complex image generation pipeline | Static 1200x630 PNG/JPG file | Simple asset replacement, no build-time generation needed |

## Common Pitfalls

### Pitfall 1: Favicon Caching
**What goes wrong:** Browser aggressively caches favicons. After replacing the file, the old Docusaurus dinosaur icon may persist for developers testing the change.
**Why it happens:** Favicons are cached at the browser level, independent of normal HTTP caching.
**How to avoid:** Hard refresh (Cmd+Shift+R) or open in incognito. Not a deployment issue -- CloudFront invalidation handles production.
**Warning signs:** "I replaced the favicon but nothing changed" -- always a cache issue.

### Pitfall 2: Dark Mode CSS Remnants Causing Flash
**What goes wrong:** Even with `disableSwitch: true`, if a user had previously selected dark mode, localStorage may retain `theme: 'dark'`, causing a brief flash of dark styles on first visit.
**Why it happens:** Docusaurus persists theme preference in localStorage.
**How to avoid:** The `disableSwitch: true` + `defaultMode: 'light'` combination handles this correctly -- Docusaurus ignores stored preference when switch is disabled. No action needed beyond the config change.
**Warning signs:** If dark flash is reported, verify both `disableSwitch` AND `defaultMode` are set.

### Pitfall 3: External Link Missing rel="noopener"
**What goes wrong:** External links with `target: '_blank'` without `rel="noopener noreferrer"` are a minor security concern.
**Why it happens:** Developers forget to add the `rel` attribute.
**How to avoid:** Docusaurus automatically adds `rel="noopener noreferrer"` to external links. No manual action needed.
**Warning signs:** None -- this is handled by the framework.

## Code Examples

### Complete colorMode Config Change

```typescript
// BEFORE (current - docusaurus.config.ts lines 174-176)
colorMode: {
  respectPrefersColorScheme: true,
},

// AFTER
colorMode: {
  defaultMode: 'light',
  disableSwitch: true,
  respectPrefersColorScheme: false,
},
```

### Complete External Navbar Links

```typescript
// Append to navbar.items array (after existing left-positioned items)
{
  href: 'https://1nce.com',
  label: '1NCE Home',
  position: 'right',
  target: '_blank',
},
{
  href: 'https://portal.1nce.com/portal/shop/cart',
  label: '1NCE Shop',
  position: 'right',
  target: '_blank',
},
{
  href: 'https://portal.1nce.com/portal/customer/login',
  label: '1NCE Portal',
  position: 'right',
  target: '_blank',
},
```

**URL source:** Extracted from the live help.1nce.com header via WebFetch. The original hub links to:
- Home: `https://1nce.com`
- Shop: `https://portal.1nce.com/portal/shop/cart`
- Portal: `https://portal.1nce.com/portal/customer/login`

Note: The footer already uses `/en-eu/` paths (e.g., `https://1nce.com/en-eu/support/faq`), but the header external links on the original hub do NOT include the regional prefix.

### Favicon Config Change

```typescript
// BEFORE
favicon: 'img/favicon.ico',

// AFTER
favicon: 'img/favicon.png',
```

### Social Card Config Change

```typescript
// BEFORE
image: 'img/docusaurus-social-card.jpg',

// AFTER
image: 'img/1nce-social-card.png',
```

## Asset Verification Results

| Asset | File | Status | Action |
|-------|------|--------|--------|
| Favicon PNG (120x120) | `static/img/favicon.png` | Already correct 1NCE favicon | Change config to point here instead of `.ico` |
| Favicon ICO (32x27) | `static/img/favicon.ico` | Docusaurus default dinosaur | Remove or replace (config will no longer reference it) |
| SVG Logo | `static/img/1nce-logo.svg` | Already identical to 1nce.com corporate logo | No action needed |
| Social Card | `static/img/docusaurus-social-card.jpg` | Docusaurus default | Replace with 1NCE-branded 1200x630 image |

### Social Card Creation Guidance

The social card should be a 1200x630 pixel PNG or JPG featuring:
- 1NCE logo (from the existing SVG)
- Navy background (`#194a7d`) matching the navbar/footer
- "Developer Hub" text in white or teal (`#29abe2`)
- Clean, minimal design appropriate for Open Graph previews

This can be created with any image tool (Figma, Canva, or even a simple HTML-to-image approach). It is a static asset, not generated at build time.

## Open Questions

1. **Favicon .ico file disposition**
   - What we know: Config will change to reference `.png`. The `.ico` is the Docusaurus default.
   - What's unclear: Whether to delete `favicon.ico` or leave it as a dead file.
   - Recommendation: Delete it to avoid confusion. It serves no purpose once config points to `.png`.

2. **Social card creation method**
   - What we know: Need a 1200x630 branded image.
   - What's unclear: Whether to hand-create or generate programmatically.
   - Recommendation: Create a simple static image. The design is straightforward enough that it can be done inline during implementation using a canvas approach or by providing a pre-made file.

## Sources

### Primary (HIGH confidence)
- Visual comparison of `static/img/favicon.png` against `1nce.com/favicons/favicon-120x120.png` -- identical
- Visual comparison of `static/img/1nce-logo.svg` against `a.storyblok.com/f/335000/300x122/f889be49d5/logo.svg` -- identical SVG content
- Live help.1nce.com header -- extracted exact external link URLs
- Docusaurus official docs -- colorMode, navbar.items configuration

### Secondary (MEDIUM confidence)
- Social card dimensions (1200x630) -- standard Open Graph specification

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - all changes are standard Docusaurus configuration
- Architecture: HIGH - direct config edits, no custom code
- Pitfalls: HIGH - well-known Docusaurus behaviors
- Asset verification: HIGH - visually confirmed favicon and logo against source

**Research date:** 2026-04-02
**Valid until:** 2026-05-02 (stable -- Docusaurus config API rarely changes)
