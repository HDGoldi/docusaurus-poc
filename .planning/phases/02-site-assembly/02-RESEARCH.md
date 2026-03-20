# Phase 2: Site Assembly - Research

**Researched:** 2026-03-20
**Domain:** Docusaurus multi-instance docs, OpenAPI integration, theming, analytics injection
**Confidence:** HIGH

## Summary

Phase 2 transforms the Phase 1 buildable Docusaurus project (currently a single docs instance with flat sidebar) into a fully branded, multi-tab site with interactive API documentation and analytics. The work spans four distinct domains: (1) navigation restructuring via five Docusaurus docs plugin instances, (2) OpenAPI spec integration via `docusaurus-plugin-openapi-docs` v4.7.1, (3) 1NCE brand theming via CSS custom properties and Google Fonts, and (4) analytics injection via declarative config and a client module for SPA tracking.

The current project uses Docusaurus 3.9.2 with `@docusaurus/preset-classic`. The preset includes one default docs instance. Four additional `@docusaurus/plugin-content-docs` instances must be added via the `plugins` array, each with a unique `id`, its own `path`, `routeBasePath`, and `sidebarPath`. The OpenAPI plugin targets a specific docs instance via `docsPluginId` and generates MDX pages + sidebar slices from the 6 JSON specs. All configuration converges in `docusaurus.config.ts`.

**Primary recommendation:** Structure the work as: (1) multi-instance docs + navbar first (gets navigation working), (2) OpenAPI plugin integration (adds API Explorer), (3) theming/branding (visual layer), (4) analytics + footer (final polish). Each step is independently verifiable.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Separate Docusaurus docs plugin instance per navbar tab -- 5 independent instances: Documentation (`/docs/`), API Explorer (`/api/`), 1NCE Platform (`/platform/`), Blueprints & Examples (`/blueprints/`), Terms & Abbreviations (`/terms/`)
- **D-02:** Each docs instance has its own independent sidebar generated from `_order.yaml` files (carried forward from Phase 1 D-09)
- **D-03:** Sidebar behavior: collapsible categories with auto-expand on active page -- standard Docusaurus default
- **D-04:** Clean URLs derived from normalized folder/file names (e.g., `/platform/1nce-os/device-controller`)
- **D-05:** Generate a static redirect map file (old ReadMe slugs -> new paths) for future CloudFront Function use -- no active redirects in v1, just the mapping artifact
- **D-06:** API Explorer tab is fully generated from the 6 OpenAPI JSON specs via `docusaurus-openapi-docs` plugin -- no hand-written docs mixed in
- **D-07:** API Introduction markdown from the export becomes the API Explorer landing page
- **D-08:** Specs organized as top-level sidebar categories: Authorization, SIM Management, Order Management, Product Information, Support Management, 1NCE OS (matches REQ API-04)
- **D-09:** Try It panel shows auth fields (Bearer token) but leaves them empty -- developers paste their own credentials. No proxy, no stored credentials
- **D-10:** Base URL for API calls uses whatever `servers` field is defined in each OpenAPI JSON spec -- no override
- **D-11:** Code snippet languages use plugin defaults (typically cURL, Python, JavaScript, Java, Go) -- no custom configuration
- **D-12:** Brand-matched, not pixel-perfect -- apply 1NCE colors, Barlow font, logo using Docusaurus CSS custom properties. Use standard Docusaurus layout components, don't replicate ReadMe's exact layout
- **D-13:** Color scheme via CSS custom properties: `--1nce-dark-blue: #194a7d`, `--1nce-light-blue: #29abe2`, `--1nce-text-color: #4a4a4a` mapped to Docusaurus `--ifm-*` tokens
- **D-14:** Dark mode enabled with Docusaurus built-in toggle (sun/moon icon). Dark mode overrides: dark backgrounds, teal accents preserved, headings stay `#29abe2`
- **D-15:** Barlow font loaded from Google Fonts CDN (same source as current site -- fonts.gstatic.com). Medium weight for headings, regular for body
- **D-16:** Footer uses Docusaurus built-in footer config (dark style, navy background via CSS): copyright 2026 1NCE GmbH + links to FAQ, Imprint, Terms & Conditions, Privacy Policy (all external to 1nce.com)
- **D-17:** 1NCE logo in navbar header, sized appropriately for Docusaurus navbar
- **D-18:** All three analytics scripts injected via Docusaurus `headTags`/`scripts` config in `docusaurus.config.ts` -- declarative, no custom components
- **D-19:** GTM container ID: `GTM-NS9K9DT`
- **D-20:** SimpleAnalytics: `data-collect-dnt="true"`, loaded from `scripts.simpleanalyticscdn.com/latest.js`
- **D-21:** PostHog: EU instance (`eu.i.posthog.com`), project key `phc_M08s2Nrlv1o0bUfZ88Jo81VQqutezzTXDbIXEuavfh0`, `person_profiles: 'identified_only'`
- **D-22:** No cookie consent banner in v1 -- maintain parity with current site. Consent banner deferred to future enhancement
- **D-23:** SPA route change tracking via Docusaurus `onRouteDidUpdate` lifecycle hook -- GTM gets virtual pageview events, PostHog auto-captures, SimpleAnalytics handles SPA natively

### Claude's Discretion
- Exact Docusaurus `--ifm-*` token mapping for 1NCE colors
- Dark mode color fine-tuning beyond the core brand colors
- Logo sizing and navbar spacing
- `docusaurus-openapi-docs` plugin configuration details
- How to structure the redirect map file format
- `onRouteDidUpdate` implementation details for GTM virtual pageviews

### Deferred Ideas (OUT OF SCOPE)
- Cookie consent banner -- future enhancement, not in v1 requirements
- Active URL redirects from old ReadMe paths -- v2 scope (REDIR-01/02), but redirect map file generated in v1
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| NAV-01 | Five-tab navbar matching current help.1nce.com | Multi-instance docs plugin pattern with `type: 'docSidebar'` navbar items, each pointing to its instance via `docsPluginId` |
| NAV-02 | Deeply nested sidebars auto-generated from `_order.yaml` files | Phase 1 sidebar generation tool produces per-instance sidebar files; each instance references its own `sidebarPath` |
| NAV-03 | Multiple docs plugin instances configured for separate navbar tabs | Verified: preset-classic provides default instance; 4 additional instances via `plugins` array with unique `id` |
| NAV-04 | All internal navigation links resolve correctly (no broken links) | Docusaurus `onBrokenLinks: 'throw'` already configured; `npx docusaurus build` catches all broken links |
| API-01 | All 6 OpenAPI JSON specs integrated via `docusaurus-openapi-docs` plugin | Plugin v4.7.1 compatible with Docusaurus 3.9.2 (peer dep `>=3.5.0`); 6 specs configured in plugin `config` object |
| API-02 | Interactive "Try It" panel functional for each API endpoint | Enabled by default in docusaurus-theme-openapi-docs; no `hideSendButton` needed |
| API-03 | Auto-generated code snippets in multiple languages | Plugin generates snippets automatically; default languages sufficient per D-11 |
| API-04 | API documentation organized by spec (6 categories) | Each spec configured as separate entry in plugin config; `groupPathsBy: 'tag'` organizes within each spec |
| THEME-01 | 1NCE color scheme applied via CSS custom properties | Map `readme_custom.css` variables to Docusaurus `--ifm-*` tokens in `src/css/custom.css` |
| THEME-02 | Barlow font family loaded | Google Fonts CDN via `stylesheets` config array in `docusaurus.config.ts`; font-family overrides in `custom.css` |
| THEME-03 | Dark mode support with brand-consistent colors | `[data-theme='dark']` CSS selector for dark mode overrides; `colorMode.respectPrefersColorScheme: true` already set |
| THEME-04 | 1NCE logo in header | `navbar.logo.src` in themeConfig; place logo file in `static/img/` |
| THEME-05 | Custom footer with copyright and external links | Docusaurus `footer.links` array with `href` for external links; `footer.style: 'dark'` with CSS override for navy background |
| ANLYT-01 | Google Tag Manager integrated | GTM snippet via `headTags` config (inline script); noscript iframe via SSR consideration |
| ANLYT-02 | SimpleAnalytics script included | External script via `scripts` config array with `data-collect-dnt` attribute |
| ANLYT-03 | PostHog tracking integrated | PostHog bootstrap via `headTags` config (inline script); EU instance URL in config |
</phase_requirements>

## Standard Stack

### Core (already installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @docusaurus/core | 3.9.2 | Framework | Already installed in project |
| @docusaurus/preset-classic | 3.9.2 | Default docs+theme | Already installed; provides default docs instance |
| @docusaurus/faster | 3.9.2 | Rspack bundler | Already installed for faster builds |

### New Dependencies for Phase 2
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| docusaurus-plugin-openapi-docs | 4.7.1 | OpenAPI spec ingestion + MDX generation | Only mature Docusaurus plugin for interactive API docs. Peer dep requires `@docusaurus/plugin-content-docs >=3.5.0` and `@docusaurus/utils >=3.5.0` -- compatible with 3.9.2 |
| docusaurus-theme-openapi-docs | 4.7.1 | Theme components for Try It panel, schemas | Companion theme. Peer dep requires `docusaurus-plugin-sass ^0.2.3` |
| docusaurus-plugin-sass | 0.2.6 | SASS compilation | Required peer dep of docusaurus-theme-openapi-docs |
| sass | ^1.86 | SASS runtime | Required by docusaurus-plugin-sass |
| @docusaurus/plugin-content-docs | 3.9.2 | Additional docs instances | Must match core version exactly. Needed for 4 extra instances beyond preset default |

### Installation
```bash
npm install docusaurus-plugin-openapi-docs@4.7.1 docusaurus-theme-openapi-docs@4.7.1 docusaurus-plugin-sass@0.2.6 sass @docusaurus/plugin-content-docs@3.9.2
```

**CRITICAL:** `docusaurus-theme-openapi-docs` has a peer dependency on `docusaurus-plugin-sass`. Without it, the build will fail with a peer dependency warning or missing SASS compilation error.

## Architecture Patterns

### Multi-Instance Docs Structure

The current `docusaurus.config.ts` has one docs instance in preset-classic with `routeBasePath: '/'`. This must be restructured:

**Approach:** The preset-classic docs instance becomes the "Documentation" tab. Four additional instances are added via the `plugins` array:

```typescript
// In docusaurus.config.ts
presets: [
  ['classic', {
    docs: {
      // DEFAULT instance (id: 'default') -- Documentation tab
      path: 'docs/documentation',
      routeBasePath: '/docs',
      sidebarPath: './sidebars/documentation.ts',
      docItemComponent: '@theme/ApiItem', // Needed for OpenAPI pages if mixed
    },
    blog: false,
    theme: { customCss: './src/css/custom.css' },
  }],
],
plugins: [
  // API Explorer -- generated by openapi plugin
  ['@docusaurus/plugin-content-docs', {
    id: 'api',
    path: 'docs/api',
    routeBasePath: '/api',
    sidebarPath: './sidebars/api.ts',
    docItemComponent: '@theme/ApiItem', // REQUIRED for Try It panels
  }],
  // 1NCE Platform
  ['@docusaurus/plugin-content-docs', {
    id: 'platform',
    path: 'docs/platform',
    routeBasePath: '/platform',
    sidebarPath: './sidebars/platform.ts',
  }],
  // Blueprints & Examples
  ['@docusaurus/plugin-content-docs', {
    id: 'blueprints',
    path: 'docs/blueprints',
    routeBasePath: '/blueprints',
    sidebarPath: './sidebars/blueprints.ts',
  }],
  // Terms & Abbreviations
  ['@docusaurus/plugin-content-docs', {
    id: 'terms',
    path: 'docs/terms',
    routeBasePath: '/terms',
    sidebarPath: './sidebars/terms.ts',
  }],
  // OpenAPI docs plugin
  ['docusaurus-plugin-openapi-docs', {
    id: 'openapi',
    docsPluginId: 'api', // Targets the API docs instance
    config: {
      authorization: {
        specPath: 'specs/authorization.json',
        outputDir: 'docs/api/authorization',
        sidebarOptions: { groupPathsBy: 'tag', categoryLinkSource: 'tag' },
      },
      // ... 5 more specs
    },
  }],
],
themes: ['docusaurus-theme-openapi-docs'],
```

### Content Directory Restructuring

Phase 1 outputs all content to a flat `docs/` folder. Phase 2 must reorganize into per-instance subdirectories:

```
docs/
  documentation/        # Documentation tab (intro, connectivity, sim-cards, troubleshooting, etc.)
  api/                  # API Explorer tab (generated by openapi plugin)
    authorization/      # Generated MDX from authorization.json
    sim-management/     # Generated MDX from sim-management.json
    ...
  platform/            # 1NCE Platform tab (1nce-os, 1nce-portal, platform-services)
  blueprints/          # Blueprints & Examples tab (blueprints-examples content + recipes)
  terms/               # Terms & Abbreviations tab (terms-abbreviations.md)
specs/                 # OpenAPI JSON specs (copied from export reference/)
sidebars/
  documentation.ts
  api.ts               # May be auto-generated by openapi plugin
  platform.ts
  blueprints.ts
  terms.ts
```

**Key insight:** The current `docs/` flat structure has all content mixed together. The content needs to be moved into subdirectories matching the 5 tab instances. The mapping from export folders to instances:

| Export Folder | Target Instance | Target Path |
|---------------|----------------|-------------|
| introduction/, connectivity-services/, sim-cards/, network-services/, troubleshooting/, mcp-server/ | documentation | `docs/documentation/` |
| reference/ (OpenAPI specs only) | api | `docs/api/` (generated) |
| 1nce-os/, 1nce-portal/, platform-services/ | platform | `docs/platform/` |
| blueprints-examples/, recipes.md, hardware guide .md files | blueprints | `docs/blueprints/` |
| terms-abbreviations.md | terms | `docs/terms/` |

### Navbar Configuration

```typescript
navbar: {
  title: '1NCE Developer Hub',
  logo: { alt: '1NCE Logo', src: 'img/1nce-logo.svg' },
  items: [
    { type: 'docSidebar', sidebarId: 'docsSidebar', label: 'Documentation', position: 'left' },
    { type: 'docSidebar', sidebarId: 'apiSidebar', label: 'API Explorer', position: 'left', docsPluginId: 'api' },
    { type: 'docSidebar', sidebarId: 'platformSidebar', label: '1NCE Platform', position: 'left', docsPluginId: 'platform' },
    { type: 'docSidebar', sidebarId: 'blueprintsSidebar', label: 'Blueprints & Examples', position: 'left', docsPluginId: 'blueprints' },
    { type: 'docSidebar', sidebarId: 'termsSidebar', label: 'Terms & Abbreviations', position: 'left', docsPluginId: 'terms' },
  ],
},
```

### OpenAPI Plugin Configuration Pattern

Each of the 6 specs gets its own config entry:

```typescript
config: {
  authorization: {
    specPath: 'specs/authorization.json',
    outputDir: 'docs/api/authorization',
    sidebarOptions: {
      groupPathsBy: 'tag',
      categoryLinkSource: 'tag',
    },
  },
  'sim-management': {
    specPath: 'specs/sim-management.json',
    outputDir: 'docs/api/sim-management',
    sidebarOptions: {
      groupPathsBy: 'tag',
      categoryLinkSource: 'tag',
    },
  },
  'order-management': {
    specPath: 'specs/order-management.json',
    outputDir: 'docs/api/order-management',
    sidebarOptions: {
      groupPathsBy: 'tag',
      categoryLinkSource: 'tag',
    },
  },
  'product-information': {
    specPath: 'specs/product-information.json',
    outputDir: 'docs/api/product-information',
    sidebarOptions: {
      groupPathsBy: 'tag',
      categoryLinkSource: 'tag',
    },
  },
  'support-management': {
    specPath: 'specs/support-management.json',
    outputDir: 'docs/api/support-management',
    sidebarOptions: {
      groupPathsBy: 'tag',
      categoryLinkSource: 'tag',
    },
  },
  '1nce-os': {
    specPath: 'specs/1nce-os.json',
    outputDir: 'docs/api/1nce-os',
    sidebarOptions: {
      groupPathsBy: 'tag',
      categoryLinkSource: 'tag',
    },
  },
},
```

After configuring, run: `npx docusaurus gen-api-docs all` to generate the MDX pages.

### Anti-Patterns to Avoid
- **Mixing hand-written and generated content in API docs instance:** The openapi plugin manages generated files. Do not place manual docs in the same outputDir -- they will be overwritten by `gen-api-docs`.
- **Using `routeBasePath: '/'` with multi-instance:** Only one instance can own root. The default Documentation instance should use `/docs/` not `/`.
- **Forgetting `docItemComponent: '@theme/ApiItem'` on the API docs instance:** Without this, Try It panels will not render.
- **Mismatched plugin/theme versions:** Always keep `docusaurus-plugin-openapi-docs` and `docusaurus-theme-openapi-docs` at the same version.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| API documentation pages | Custom MDX pages per endpoint | `docusaurus-plugin-openapi-docs` gen-api-docs | 6 specs with dozens of endpoints; manual authoring is error-prone and unmaintainable |
| Try It interactive panel | Custom fetch-based API tester | `docusaurus-theme-openapi-docs` ApiItem component | Auth handling, request building, response display, code generation all built-in |
| Sidebar generation | Manual sidebar.ts with hardcoded entries | `autogenerated` sidebars + openapi plugin sidebar output | Content changes frequently; auto-generation prevents stale navigation |
| Dark mode toggle | Custom theme switcher component | Docusaurus built-in `colorMode` | Already works, respects system preference, persists choice |
| SPA page tracking | Custom history listener | Docusaurus `onRouteDidUpdate` client module | Integrated with Docusaurus router lifecycle; fires at correct time |
| Google Fonts loading | @font-face declarations in CSS | Docusaurus `stylesheets` config | Proper preconnect and async loading; works with SSR |

## Common Pitfalls

### Pitfall 1: routeBasePath Collision
**What goes wrong:** Two docs instances claim the same URL prefix, causing build failure or routing conflicts.
**Why it happens:** Forgetting to change the preset default `routeBasePath: '/'` when adding instances.
**How to avoid:** Each instance MUST have a unique `routeBasePath`. Change the default from `/` to `/docs/`.
**Warning signs:** Build error "Multiple plugins generating the same route."

### Pitfall 2: Missing docItemComponent for API Instance
**What goes wrong:** API pages render as plain markdown without Try It panels, code snippets, or schema viewers.
**Why it happens:** The docs instance hosting OpenAPI-generated pages must use `@theme/ApiItem` instead of the default `@theme/DocItem`.
**How to avoid:** Set `docItemComponent: '@theme/ApiItem'` on the docs instance referenced by `docsPluginId`.
**Warning signs:** API pages load but look like regular docs pages with no interactive elements.

### Pitfall 3: SASS Peer Dependency Missing
**What goes wrong:** Build crashes with "Cannot find module 'sass'" or peer dependency warning.
**Why it happens:** `docusaurus-theme-openapi-docs` has a peer dep on `docusaurus-plugin-sass` which in turn needs `sass`.
**How to avoid:** Install both `docusaurus-plugin-sass` and `sass` alongside the theme.
**Warning signs:** `npm ls` shows unmet peer dependency warnings.

### Pitfall 4: OpenAPI Generated Files Not Committed
**What goes wrong:** Build works locally but fails in CI because generated API docs are missing.
**Why it happens:** `gen-api-docs` output is not committed to git, and CI doesn't run the generation step.
**How to avoid:** Either (a) commit generated files, or (b) add `npx docusaurus gen-api-docs all` to the CI build step before `docusaurus build`. Option (a) is simpler for this project.
**Warning signs:** CI build fails with "docs not found" or empty API Explorer.

### Pitfall 5: Navbar Item docsPluginId Mismatch
**What goes wrong:** Clicking a navbar tab leads to a 404 or wrong content section.
**Why it happens:** The `docsPluginId` in navbar items must exactly match the `id` of the target plugin instance. The preset default instance has id `'default'` (omitted in config).
**How to avoid:** Explicitly verify that each navbar item's `docsPluginId` matches the plugin instance `id`.
**Warning signs:** Navbar link points to `/docs/` path of wrong instance.

### Pitfall 6: Content Directory Must Exist Before Build
**What goes wrong:** Build fails with "docs folder does not exist" for a plugin instance.
**Why it happens:** Each docs instance's `path` must point to an existing directory with at least one document.
**How to avoid:** Ensure content reorganization (moving files from flat `docs/` to per-instance subdirs) is done before the multi-instance config is applied.
**Warning signs:** Build error mentioning empty or missing directory.

### Pitfall 7: GTM Noscript Tag Placement
**What goes wrong:** GTM's `<noscript>` iframe (for non-JS users) cannot be placed in `<head>` -- it belongs in `<body>`.
**Why it happens:** Docusaurus `headTags` only injects into `<head>`. The noscript tag requires `<body>`.
**How to avoid:** For v1, skip the noscript fallback (GTM works fine with JavaScript enabled for analytics). If needed later, swizzle the Root component.
**Warning signs:** HTML validation errors about noscript in head.

## Code Examples

### CSS Custom Properties Mapping (src/css/custom.css)

Based on `readme_custom.css` analysis, the exact mapping:

```css
/* Source: readme_custom.css color variables + Docusaurus Infima tokens */

@import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500&display=swap');

:root {
  /* 1NCE Brand Colors mapped to Infima tokens */
  --ifm-color-primary: #29abe2;        /* 1NCE light blue -- primary action color */
  --ifm-color-primary-dark: #1a9ad4;
  --ifm-color-primary-darker: #1890c8;
  --ifm-color-primary-darkest: #1377a5;
  --ifm-color-primary-light: #3eb5e6;
  --ifm-color-primary-lighter: #4abbe8;
  --ifm-color-primary-lightest: #6ccaed;

  --ifm-navbar-background-color: #194a7d;  /* 1NCE dark blue */
  --ifm-navbar-link-color: #ffffff;
  --ifm-navbar-link-hover-color: #29abe2;

  --ifm-heading-color: #29abe2;            /* Headings in light blue */
  --ifm-font-color-base: #4a4a4a;         /* Body text */

  --ifm-font-family-base: 'Barlow', sans-serif;
  --ifm-heading-font-family: 'Barlow', sans-serif;
  --ifm-heading-font-weight: 500;          /* Medium weight for headings */
  --ifm-font-weight-normal: 400;           /* Regular weight for body */

  --ifm-footer-background-color: #194a7d;  /* Navy footer */
  --ifm-footer-color: #ffffff;
  --ifm-footer-link-color: #ffffff;
  --ifm-footer-link-hover-color: #29abe2;

  --ifm-code-font-size: 95%;
  --docusaurus-highlighted-code-line-bg: rgba(0, 0, 0, 0.1);
}

[data-theme='dark'] {
  --ifm-color-primary: #29abe2;            /* Keep teal accent in dark mode */
  --ifm-color-primary-dark: #1a9ad4;
  --ifm-color-primary-darker: #1890c8;
  --ifm-color-primary-darkest: #1377a5;
  --ifm-color-primary-light: #3eb5e6;
  --ifm-color-primary-lighter: #4abbe8;
  --ifm-color-primary-lightest: #6ccaed;

  --ifm-heading-color: #29abe2;            /* Headings stay teal per D-14 */
  --ifm-background-color: #1b1b1d;
  --ifm-navbar-background-color: #0d2a47;  /* Darker navy for dark mode */
  --ifm-footer-background-color: #0d2a47;

  --docusaurus-highlighted-code-line-bg: rgba(0, 0, 0, 0.3);
}
```

### Google Fonts via Stylesheets Config

```typescript
// In docusaurus.config.ts
stylesheets: [
  {
    href: 'https://fonts.googleapis.com/css2?family=Barlow:wght@400;500&display=swap',
    type: 'text/css',
  },
],
```

### Analytics via headTags and scripts Config

```typescript
// In docusaurus.config.ts
headTags: [
  // GTM (inline script in head)
  {
    tagName: 'script',
    attributes: {},
    innerHTML: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NS9K9DT');`,
  },
  // PostHog (inline script in head)
  {
    tagName: 'script',
    attributes: {},
    innerHTML: `!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug getPageViewId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);posthog.init('phc_M08s2Nrlv1o0bUfZ88Jo81VQqutezzTXDbIXEuavfh0',{api_host:'https://eu.i.posthog.com',person_profiles:'identified_only',});`,
  },
],
scripts: [
  // SimpleAnalytics (external script)
  {
    src: 'https://scripts.simpleanalyticscdn.com/latest.js',
    async: true,
    'data-collect-dnt': 'true',
  },
],
```

### SPA Route Tracking Client Module

```typescript
// src/clientModules/routeTracking.ts
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

export function onRouteDidUpdate({location, previousLocation}) {
  if (ExecutionEnvironment.canUseDOM && location.pathname !== previousLocation?.pathname) {
    // GTM virtual pageview
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'virtualPageview',
        page: location.pathname,
      });
    }
    // PostHog auto-captures page views when configured -- no manual call needed
    // SimpleAnalytics handles SPA natively -- no manual call needed
  }
}
```

Register in config:
```typescript
clientModules: ['./src/clientModules/routeTracking.ts'],
```

### Footer Configuration

```typescript
// Source: readme_custom_foot.html
footer: {
  style: 'dark',
  links: [
    { label: 'FAQ', href: 'https://1nce.com/en-eu/support/faq' },
    { label: 'Imprint', href: 'https://1nce.com/en-eu/imprint' },
    { label: 'Terms and Conditions', href: 'https://1nce.com/en-eu/terms-conditions' },
    { label: 'Privacy Policy', href: 'https://1nce.com/en-eu/privacy-policy' },
  ],
  copyright: 'Copyright &copy; 2026 1NCE GmbH',
},
```

**Note:** The footer `links` array without column structure renders as a simple horizontal row (matching the current site layout from `readme_custom_foot.html`).

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| docusaurus-openapi-docs v3 | v4.7.1 | 2024-2025 | Breaking config changes; uses `@redocly/openapi-core` for validation |
| Separate @font-face in CSS | Google Fonts via `stylesheets` config | Docusaurus 2+ | Proper SSR support, preconnect hints |
| Custom webpack config | `experimental_faster` (Rspack) | Docusaurus 3.6+ | Already enabled in project |
| Manual sidebar authoring | `autogenerated` sidebars | Docusaurus 2+ | Already used in project |

## Open Questions

1. **Content reorganization from flat docs/ to per-instance subdirs**
   - What we know: Phase 1 outputs everything to `docs/` flat. Phase 2 needs `docs/documentation/`, `docs/platform/`, `docs/blueprints/`, `docs/terms/`.
   - What's unclear: Whether Phase 1 remaining plans will output to a different structure or keep the flat layout.
   - Recommendation: Plan a content reorganization step early in Phase 2 that moves folders to per-instance directories. This can be a simple script or manual move.

2. **API Introduction page as landing page for API Explorer tab**
   - What we know: D-07 says the API Introduction markdown from the export becomes the API Explorer landing page.
   - What's unclear: The exact file location in the export and how to make it the index of the api docs instance.
   - Recommendation: Place the API Introduction markdown as `docs/api/index.md` (or `intro.md` with `slug: /`) so it becomes the default page when clicking the API Explorer tab.

3. **OpenAPI specs -- copy or reference in place?**
   - What we know: Specs are at `dev-hub-v2.6-*/reference/*.json`. The plugin needs a `specPath`.
   - Recommendation: Copy specs to `specs/` directory at project root for clean separation from the raw export. The openapi plugin `specPath` points there.

## Sources

### Primary (HIGH confidence)
- Verified `docusaurus-plugin-openapi-docs` v4.7.1 and `docusaurus-theme-openapi-docs` v4.7.1 via `npm view` -- peer deps compatible with Docusaurus 3.9.2
- Docusaurus official docs (docusaurus.io/docs/docs-multi-instance) -- multi-instance configuration
- Docusaurus official docs (docusaurus.io/docs/api/docusaurus-config) -- headTags, scripts, stylesheets, clientModules
- Docusaurus official docs (docusaurus.io/docs/advanced/client) -- onRouteDidUpdate lifecycle hook
- Docusaurus official docs (docusaurus.io/docs/api/themes/configuration) -- footer and navbar config
- PaloAltoNetworks/docusaurus-openapi-docs README -- plugin config, multi-spec, CLI commands
- `readme_custom.css` -- exact 1NCE color values, font definitions
- `readme_custom_head.html` -- exact analytics script snippets with IDs and keys
- `readme_custom_foot.html` -- exact footer links and copyright text
- `package.json` -- current installed Docusaurus version 3.9.2

### Secondary (MEDIUM confidence)
- PaloAltoNetworks demo config -- multi-spec pattern (demo may not reflect all edge cases)
- `docusaurus-plugin-sass` peer dependency requirement -- confirmed via `npm view`

### Tertiary (LOW confidence)
- None -- all findings verified against primary sources

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - all versions verified via npm registry, peer deps checked
- Architecture: HIGH - multi-instance docs pattern is well-documented in official Docusaurus docs
- OpenAPI integration: HIGH - plugin/theme v4.7.1 confirmed compatible; config pattern from official README
- Theming: HIGH - CSS variables extracted directly from `readme_custom.css`; Infima token mapping is straightforward
- Analytics: HIGH - exact script snippets available from `readme_custom_head.html`; Docusaurus injection methods documented
- Pitfalls: HIGH - based on known Docusaurus patterns and verified peer dependency requirements

**Research date:** 2026-03-20
**Valid until:** 2026-04-20 (stable ecosystem, no breaking changes expected)
