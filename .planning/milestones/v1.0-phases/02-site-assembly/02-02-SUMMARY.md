---
phase: 02-site-assembly
plan: 02
subsystem: ui
tags: [css, branding, analytics, gtm, posthog, simpleanalytics, infima, barlow-font]

# Dependency graph
requires:
  - phase: 02-01
    provides: "Multi-instance docs config, navbar items, sidebar structure"
provides:
  - "1NCE brand theme via Infima CSS custom properties (navy/teal palette)"
  - "Barlow font integration via Google Fonts"
  - "1NCE logo SVG placeholder in navbar"
  - "Footer with copyright and external links"
  - "Dark mode with brand-appropriate colors"
  - "GTM, SimpleAnalytics, PostHog analytics scripts"
  - "SPA route tracking client module for GTM virtual pageviews"
affects: [03-infrastructure-and-deployment]

# Tech tracking
tech-stack:
  added: [google-fonts-barlow, gtm, simpleanalytics, posthog]
  patterns: [infima-css-custom-properties, headTags-inline-scripts, clientModules-route-tracking]

key-files:
  created:
    - static/img/1nce-logo.svg
    - src/clientModules/routeTracking.ts
  modified:
    - src/css/custom.css
    - docusaurus.config.ts

key-decisions:
  - "Used Infima CSS custom properties for all branding rather than custom CSS classes"
  - "PostHog script injected via headTags innerHTML (same approach as readme_custom_head.html)"
  - "GTM noscript iframe skipped for v1 (headTags only injects into head, GTM works with JS)"
  - "Cookie consent banner deferred per CONTEXT.md"
  - "1NCE logo is a text-based SVG placeholder; replace with real asset when available"

patterns-established:
  - "Brand theming: All colors via --ifm-* CSS custom properties, never hardcoded in components"
  - "Analytics injection: headTags for inline scripts, scripts array for external scripts"
  - "SPA tracking: clientModules with onRouteDidUpdate lifecycle hook"

requirements-completed: [THEME-01, THEME-02, THEME-03, THEME-04, THEME-05, ANLYT-01, ANLYT-02, ANLYT-03]

# Metrics
duration: 2min
completed: 2026-03-21
---

# Phase 02 Plan 02: Branding & Analytics Summary

**1NCE navy/teal brand theme with Barlow font, dark mode, footer links, and GTM + SimpleAnalytics + PostHog analytics with SPA route tracking**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-21T17:47:11Z
- **Completed:** 2026-03-21T17:48:59Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Replaced default Docusaurus green theme with 1NCE navy/teal brand colors via Infima CSS custom properties
- Added Barlow font (400/500 weights) via Google Fonts, dark mode with brand-appropriate darker navy tones
- Injected all three analytics scripts (GTM, SimpleAnalytics, PostHog) matching the current ReadMe.com site
- Created SPA route tracking client module that fires GTM virtual pageview events on navigation

## Task Commits

Each task was committed atomically:

1. **Task 1: Apply 1NCE brand theme via CSS custom properties, Barlow font, logo, and footer** - `dc18899` (feat)
2. **Task 2: Inject analytics scripts (GTM, SimpleAnalytics, PostHog) and SPA route tracking** - `a0aef62` (feat)

## Files Created/Modified
- `src/css/custom.css` - Complete 1NCE brand theme: navy navbar, teal primary, Barlow font, dark mode overrides, footer styling
- `docusaurus.config.ts` - Added stylesheets (Barlow), logo ref, footer config, headTags (GTM/PostHog), scripts (SimpleAnalytics), clientModules
- `static/img/1nce-logo.svg` - Placeholder text-based 1NCE logo SVG for navbar (white on transparent)
- `src/clientModules/routeTracking.ts` - SPA route change tracking: pushes virtualPageview to GTM dataLayer

## Decisions Made
- Used Infima CSS custom properties exclusively for branding (no custom class overrides) to maintain Docusaurus upgrade compatibility
- PostHog uses the full loader script from readme_custom_head.html (not a simplified version) to ensure feature parity
- GTM noscript iframe tag skipped for v1 since Docusaurus headTags only supports head injection; GTM functions correctly with JavaScript enabled
- Cookie consent banner deferred per project CONTEXT.md deferred items list
- 1NCE logo created as simple text-based SVG placeholder; user can replace with official brand asset

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Site is fully branded with 1NCE identity and analytics scripts
- All Plan 01 config (multi-instance docs, navbar items, plugins) preserved
- Ready for build validation and deployment pipeline work in Phase 03

---
*Phase: 02-site-assembly*
*Completed: 2026-03-21*
