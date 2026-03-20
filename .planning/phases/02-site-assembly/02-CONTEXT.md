# Phase 2: Site Assembly - Context

**Gathered:** 2026-03-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Navigation, interactive API docs, 1NCE branding, and analytics — everything that makes the converted content into a complete, branded site experience functional in local dev. This phase takes the buildable Docusaurus project from Phase 1 and adds the five-tab navbar, 6 OpenAPI spec integrations with Try It panels, 1NCE theming (colors, fonts, logo, dark mode), custom footer, and three analytics scripts. The output is a locally-runnable site that looks and works like the production 1NCE Developer Hub.

</domain>

<decisions>
## Implementation Decisions

### Navigation Structure
- **D-01:** Separate Docusaurus docs plugin instance per navbar tab — 5 independent instances: Documentation (`/docs/`), API Explorer (`/api/`), 1NCE Platform (`/platform/`), Blueprints & Examples (`/blueprints/`), Terms & Abbreviations (`/terms/`)
- **D-02:** Each docs instance has its own independent sidebar generated from `_order.yaml` files (carried forward from Phase 1 D-09)
- **D-03:** Sidebar behavior: collapsible categories with auto-expand on active page — standard Docusaurus default
- **D-04:** Clean URLs derived from normalized folder/file names (e.g., `/platform/1nce-os/device-controller`)
- **D-05:** Generate a static redirect map file (old ReadMe slugs → new paths) for future CloudFront Function use — no active redirects in v1, just the mapping artifact

### API Explorer
- **D-06:** API Explorer tab is fully generated from the 6 OpenAPI JSON specs via `docusaurus-openapi-docs` plugin — no hand-written docs mixed in
- **D-07:** API Introduction markdown from the export becomes the API Explorer landing page
- **D-08:** Specs organized as top-level sidebar categories: Authorization, SIM Management, Order Management, Product Information, Support Management, 1NCE OS (matches REQ API-04)
- **D-09:** Try It panel shows auth fields (Bearer token) but leaves them empty — developers paste their own credentials. No proxy, no stored credentials
- **D-10:** Base URL for API calls uses whatever `servers` field is defined in each OpenAPI JSON spec — no override
- **D-11:** Code snippet languages use plugin defaults (typically cURL, Python, JavaScript, Java, Go) — no custom configuration

### Theming & Branding
- **D-12:** Brand-matched, not pixel-perfect — apply 1NCE colors, Barlow font, logo using Docusaurus CSS custom properties. Use standard Docusaurus layout components, don't replicate ReadMe's exact layout
- **D-13:** Color scheme via CSS custom properties: `--1nce-dark-blue: #194a7d`, `--1nce-light-blue: #29abe2`, `--1nce-text-color: #4a4a4a` mapped to Docusaurus `--ifm-*` tokens
- **D-14:** Dark mode enabled with Docusaurus built-in toggle (sun/moon icon). Dark mode overrides: dark backgrounds, teal accents preserved, headings stay `#29abe2`
- **D-15:** Barlow font loaded from Google Fonts CDN (same source as current site — fonts.gstatic.com). Medium weight for headings, regular for body
- **D-16:** Footer uses Docusaurus built-in footer config (dark style, navy background via CSS): copyright © 2026 1NCE GmbH + links to FAQ, Imprint, Terms & Conditions, Privacy Policy (all external to 1nce.com)
- **D-17:** 1NCE logo in navbar header, sized appropriately for Docusaurus navbar

### Analytics
- **D-18:** All three analytics scripts injected via Docusaurus `headTags`/`scripts` config in `docusaurus.config.ts` — declarative, no custom components
- **D-19:** GTM container ID: `GTM-NS9K9DT`
- **D-20:** SimpleAnalytics: `data-collect-dnt="true"`, loaded from `scripts.simpleanalyticscdn.com/latest.js`
- **D-21:** PostHog: EU instance (`eu.i.posthog.com`), project key `phc_M08s2Nrlv1o0bUfZ88Jo81VQqutezzTXDbIXEuavfh0`, `person_profiles: 'identified_only'`
- **D-22:** No cookie consent banner in v1 — maintain parity with current site. Consent banner deferred to future enhancement
- **D-23:** SPA route change tracking via Docusaurus `onRouteDidUpdate` lifecycle hook — GTM gets virtual pageview events, PostHog auto-captures, SimpleAnalytics handles SPA natively

### Claude's Discretion
- Exact Docusaurus `--ifm-*` token mapping for 1NCE colors
- Dark mode color fine-tuning beyond the core brand colors
- Logo sizing and navbar spacing
- `docusaurus-openapi-docs` plugin configuration details
- How to structure the redirect map file format
- `onRouteDidUpdate` implementation details for GTM virtual pageviews

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Brand and theme assets
- `readme_custom.css` — 1NCE CSS variables, font-face definitions, color scheme, heading styles, footer styles, sidebar styling
- `readme_custom_head.html` — GTM, SimpleAnalytics, and PostHog script snippets with exact IDs and configuration
- `readme_custom_foot.html` — Footer HTML with copyright and external links (FAQ, Imprint, T&C, Privacy)

### OpenAPI specs (source for API Explorer)
- `dev-hub-v2.6-2026-03-20T20-39-14_8a4df1b/reference/authorization.json` — Authorization API spec
- `dev-hub-v2.6-2026-03-20T20-39-14_8a4df1b/reference/sim-management.json` — SIM Management API spec
- `dev-hub-v2.6-2026-03-20T20-39-14_8a4df1b/reference/order-management.json` — Order Management API spec
- `dev-hub-v2.6-2026-03-20T20-39-14_8a4df1b/reference/product-information.json` — Product Information API spec
- `dev-hub-v2.6-2026-03-20T20-39-14_8a4df1b/reference/support-management.json` — Support Management API spec
- `dev-hub-v2.6-2026-03-20T20-39-14_8a4df1b/reference/1nce-os.json` — 1NCE OS API spec

### Navigation structure (source for sidebar generation)
- `dev-hub-v2.6-2026-03-20T20-39-14_8a4df1b/_order.yaml` — Top-level navigation ordering
- `dev-hub-v2.6-2026-03-20T20-39-14_8a4df1b/reference/_order.yaml` — API reference ordering

### Phase 1 context (upstream decisions)
- `.planning/phases/01-content-conversion/01-CONTEXT.md` — Folder naming conventions (D-08), sidebar generation approach (D-09), recipes merge decision (D-10)

### Requirements
- `.planning/REQUIREMENTS.md` §Navigation & Structure — NAV-01 through NAV-04
- `.planning/REQUIREMENTS.md` §API Explorer — API-01 through API-04
- `.planning/REQUIREMENTS.md` §Theming & Branding — THEME-01 through THEME-05
- `.planning/REQUIREMENTS.md` §Analytics — ANLYT-01 through ANLYT-03

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- No Docusaurus project exists yet — Phase 1 creates it. All Phase 2 work builds on Phase 1 output
- `readme_custom.css` contains complete CSS variable definitions that can be directly mapped to Docusaurus `--ifm-*` tokens
- `readme_custom_head.html` contains copy-pasteable analytics script snippets
- `readme_custom_foot.html` contains footer link URLs and copyright text

### Established Patterns
- Phase 1 D-08: Folder names normalized to lowercase-hyphen (e.g., "1nce-os", "blueprints-examples")
- Phase 1 D-09: `_order.yaml` files drive sidebar generation
- Phase 1 D-10: Recipes merged under Blueprints & Examples (not a separate tab)
- 6 OpenAPI JSON specs already in the export — no spec creation needed

### Integration Points
- Phase 1 output: Docusaurus project with `docs/` folder containing converted MDX pages
- `docusaurus.config.ts`: Central config file for navbar, footer, plugins, theme, scripts
- `src/css/custom.css`: Theme overrides via CSS custom properties
- `sidebars.ts` (or per-instance sidebar files): Auto-generated from `_order.yaml`
- `docusaurus-plugin-openapi-docs` + `docusaurus-theme-openapi-docs`: Plugin pair for API Explorer

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches. All decisions align with Docusaurus defaults where possible, customizing only for 1NCE branding.

</specifics>

<deferred>
## Deferred Ideas

- Cookie consent banner — future enhancement, not in v1 requirements
- Active URL redirects from old ReadMe paths — v2 scope (REDIR-01/02), but redirect map file generated in v1

</deferred>

---

*Phase: 02-site-assembly*
*Context gathered: 2026-03-20*
