# Phase 2: Site Assembly - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-20
**Phase:** 02-site-assembly
**Areas discussed:** Navigation structure, API Explorer setup, Theming & branding, Analytics integration

---

## Navigation Structure

| Option | Description | Selected |
|--------|-------------|----------|
| Separate docs plugin per tab | Each tab is its own Docusaurus docs plugin instance with independent sidebar. Cleanest URL separation. | ✓ |
| Single docs instance with multi-sidebar | One docs plugin instance, different sidebars per tab. Simpler config but all URLs under /docs/. | |
| Hybrid approach | API Explorer gets its own plugin, other 4 tabs share a single docs instance. | |

**User's choice:** Separate docs plugin per tab
**Notes:** Clean URL paths preferred (/docs/, /api/, /platform/, /blueprints/, /terms/)

| Option | Description | Selected |
|--------|-------------|----------|
| OpenAPI plugin only | API Explorer tab fully generated from 6 OpenAPI specs. No hand-written docs mixed in. | ✓ |
| Mixed docs + API pages | Hand-written guides alongside generated API endpoint pages. | |

**User's choice:** OpenAPI plugin only
**Notes:** API Introduction markdown becomes the landing page.

| Option | Description | Selected |
|--------|-------------|----------|
| Collapsible categories, auto-expand active | Standard Docusaurus sidebar behavior. Categories collapse/expand on click, active page's parents auto-expand. | ✓ |
| Always expanded | All sidebar categories always open. | |
| Top-level collapsed, sub-levels expanded | First level starts collapsed, children visible once expanded. | |

**User's choice:** Collapsible categories, auto-expand active

| Option | Description | Selected |
|--------|-------------|----------|
| Clean URLs based on folder structure | URLs derived from normalized folder/file names. No attempt to match old ReadMe URLs. | |
| Match old ReadMe URL slugs | Preserve ReadMe URL slugs using Docusaurus frontmatter slug field. | |
| Clean URLs + static redirect page | Clean URLs but generate a redirect map file for future CloudFront Function use. | ✓ |

**User's choice:** Clean URLs + static redirect page
**Notes:** No active redirects in v1, just the mapping artifact ready for future use.

---

## API Explorer Setup

| Option | Description | Selected |
|--------|-------------|----------|
| Grouped by spec name | Each of the 6 specs becomes a top-level sidebar category. Matches REQ API-04. | ✓ |
| Flat list by endpoint | All endpoints in one flat list. | |
| Custom grouping | Re-organize endpoints into custom categories. | |

**User's choice:** Grouped by spec name

| Option | Description | Selected |
|--------|-------------|----------|
| Auth input in panel, not pre-filled | Try It panel shows auth fields but leaves them empty. Developers paste their own credentials. | ✓ |
| Pre-configured with demo credentials | Ship with demo/sandbox API credentials. | |
| You decide | Claude chooses based on plugin defaults. | |

**User's choice:** Auth input in panel, not pre-filled

| Option | Description | Selected |
|--------|-------------|----------|
| Use whatever's in the OpenAPI specs | Server URL defined in each spec used as-is. | ✓ |
| Override with a configurable base URL | Global config option to override API base URL. | |
| Let me check the specs first | Inspect specs before deciding. | |

**User's choice:** Use whatever's in the OpenAPI specs

| Option | Description | Selected |
|--------|-------------|----------|
| Plugin defaults | Whatever languages docusaurus-openapi-docs generates by default. | ✓ |
| Curated set | Explicitly configure a specific set of languages. | |
| You decide | Claude picks based on plugin support and IoT developer needs. | |

**User's choice:** Plugin defaults

---

## Theming & Branding

| Option | Description | Selected |
|--------|-------------|----------|
| Brand-matched, not pixel-perfect | Apply 1NCE colors, Barlow font, logo. Use Docusaurus default layout. | ✓ |
| Pixel-perfect match | Swizzle components to replicate ReadMe's exact layout. | |
| Minimal branding | Just colors and logo, everything else stock Docusaurus. | |

**User's choice:** Brand-matched, not pixel-perfect
**Notes:** Should feel like 1NCE, not like ReadMe. Standard Docusaurus layout with brand colors/fonts applied.

| Option | Description | Selected |
|--------|-------------|----------|
| Docusaurus toggle with brand colors | Built-in dark mode toggle with 1NCE color overrides. | ✓ |
| Light mode only | Disable dark mode toggle. | |
| Respect system preference only | No manual toggle, follows OS preference. | |

**User's choice:** Docusaurus toggle with brand colors

| Option | Description | Selected |
|--------|-------------|----------|
| Google Fonts CDN | Load Barlow from Google Fonts CDN. Already used by current site. | ✓ |
| Self-hosted font files | Download woff2 files, serve locally. | |
| You decide | Claude picks best approach. | |

**User's choice:** Google Fonts CDN

| Option | Description | Selected |
|--------|-------------|----------|
| Docusaurus footer with same links | Built-in footer config with copyright + 4 links. Navy background via CSS. | ✓ |
| Custom footer component | Swizzle Footer component, recreate exact HTML/CSS. | |

**User's choice:** Docusaurus footer with same links

---

## Analytics Integration

| Option | Description | Selected |
|--------|-------------|----------|
| Docusaurus head tags config | Use headTags/scripts config in docusaurus.config.ts. Declarative, no custom components. | ✓ |
| Docusaurus plugins/packages | Community plugins for GTM, custom plugin for PostHog/SA. | |
| Custom client module | clientModules JS file for all three. | |

**User's choice:** Docusaurus head tags config

| Option | Description | Selected |
|--------|-------------|----------|
| No consent banner for v1 | Maintain parity with current site. | ✓ |
| Basic consent banner | Simple cookie consent that gates analytics loading. | |
| You decide | Claude determines based on GDPR and current site. | |

**User's choice:** No consent banner for v1

| Option | Description | Selected |
|--------|-------------|----------|
| Track route changes | onRouteDidUpdate hook for GTM virtual pageviews. PostHog auto-captures. SA handles SPA natively. | ✓ |
| Page loads only | Only track initial page loads. | |
| You decide | Claude implements standard approach. | |

**User's choice:** Track route changes

---

## Claude's Discretion

- Exact `--ifm-*` token mapping for 1NCE colors
- Dark mode color fine-tuning
- Logo sizing and navbar spacing
- `docusaurus-openapi-docs` plugin configuration details
- Redirect map file format
- `onRouteDidUpdate` implementation details

## Deferred Ideas

- Cookie consent banner — future enhancement
- Active URL redirects — v2 scope (REDIR-01/02)
