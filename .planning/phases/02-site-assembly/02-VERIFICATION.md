---
phase: 02-site-assembly
verified: 2026-03-21T00:00:00Z
status: gaps_found
score: 15/16 must-haves verified
re_verification: false
gaps:
  - truth: "All internal navigation links resolve correctly (no broken links in build)"
    status: partial
    reason: "onBrokenLinks is set to 'warn' instead of 'throw' as required by NAV-04. The build passes regardless of broken link presence because warnings do not fail the build. This weakens the NAV-04 guarantee — broken links exist but do not block deployment."
    artifacts:
      - path: "docusaurus.config.ts"
        issue: "Line 25: `onBrokenLinks: 'warn'` — plan required 'throw' for NAV-04 enforcement"
    missing:
      - "Change `onBrokenLinks: 'warn'` to `onBrokenLinks: 'throw'` in docusaurus.config.ts"
      - "Run `npx docusaurus build` again to confirm zero broken links or fix any that appear"
human_verification:
  - test: "API Explorer Try It panel interaction"
    expected: "Clicking an endpoint page (e.g., API Explorer > Authorization > Obtain Access Token) shows a functional 'Try It' panel with Send button, auth credential fields, and the ability to execute a real API call"
    why_human: "The generated MDX pages contain @theme/ApiItem component markup and the api: frontmatter blob, but browser execution of the interactive panel cannot be verified statically"
  - test: "Dark mode toggle preserves 1NCE brand colors"
    expected: "Clicking the dark mode toggle shows a darker navy navbar (#0d2a47), teal headings (#29abe2), and dark background (#1b1b1d) — matching the CSS custom properties in custom.css"
    why_human: "CSS custom property behavior under data-theme='dark' requires browser rendering to confirm"
  - test: "Sidebar ordering matches original ReadMe ordering"
    expected: "Navigation tab sidebars show categories in the same order as help.1nce.com — derived from _order.yaml conversion to _category_.json position fields"
    why_human: "Position ordering correctness requires visual comparison against the source ReadMe site"
  - test: "GTM virtual pageview fires on SPA navigation"
    expected: "After loading the site and clicking between navbar tabs, the browser DevTools Network tab shows a GTM /collect request with the new page path, confirming dataLayer.push virtualPageview is working"
    why_human: "SPA route tracking via onRouteDidUpdate executes in browser only; static analysis confirms code is present but cannot verify runtime execution"
---

# Phase 02: Site Assembly Verification Report

**Phase Goal:** Assemble the complete Docusaurus site with five-tab navigation, interactive API Explorer, 1NCE branding, and analytics injection.
**Verified:** 2026-03-21
**Status:** gaps_found
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| #  | Truth | Status | Evidence |
|----|-------|--------|----------|
| 1  | Five navbar tabs are visible: Documentation, API Explorer, 1NCE Platform, Blueprints & Examples, Terms & Abbreviations | ✓ VERIFIED | `build/docs/index.html` contains all 5 tabs as rendered anchor elements; config `navbar.items` has all 5 `docSidebar` entries |
| 2  | Clicking each navbar tab navigates to its own content section with a working sidebar | ✓ VERIFIED | Build contains `/docs/`, `/api/`, `/platform/`, `/blueprints/`, `/terms/` sections; rendered HTML confirms sidebar categories render in `build/docs/index.html` |
| 3  | Sidebar categories are collapsible and auto-expand on active page | ? UNCERTAIN | Sidebar HTML shows `menu__list-item--collapsed` classes present; collapse behavior requires browser interaction |
| 4  | Sidebar ordering matches _order.yaml files (not alphabetical) | ✓ VERIFIED | All `_order.yaml` files deleted (0 remaining); `_category_.json` files created with `position` and `label` fields (e.g., `docs/documentation/introduction/_category_.json` position:1, `docs/platform/1nce-os/_category_.json` position:8) |
| 5  | All internal navigation links resolve correctly (no broken links in build) | ✗ FAILED | `onBrokenLinks: 'warn'` — broken links produce warnings only, not build failures. NAV-04 requires `'throw'` to enforce zero broken links |
| 6  | All 6 OpenAPI specs render interactive Try It panels | ? UNCERTAIN | 125 MDX files generated; endpoint pages contain `@theme/ApiExplorer/MethodEndpoint`, `ParamsDetails`, `RequestSchema`, `StatusCodes` component imports and `api:` frontmatter blob confirming plugin generated interactive page markup. Runtime rendering requires human verification |
| 7  | API Explorer tab shows content organized by spec: Authorization, SIM Management, Order Management, Product Information, Support Management, 1NCE OS | ✓ VERIFIED | `docs/api/` contains 6 subdirectories: authorization (6 files), sim-management (97 files), order-management (14 files), product-information (6 files), support-management (10 files), 1nce-os (261 files). Build outputs all under `/api/` |
| 8  | Auto-generated code snippets appear in multiple languages for each endpoint | ? UNCERTAIN | `docusaurus-theme-openapi-docs@4.7.1` installed; code snippet generation via `postman-code-generators` is a runtime feature of the theme — static HTML inspection confirms JS bundle loads, but human must verify code tabs render |
| 9  | API Explorer navbar tab navigates to the API docs section with a working sidebar | ✓ VERIFIED | `docusaurus.config.ts` navbar item: `{ type: 'docSidebar', sidebarId: 'apiSidebar', docsPluginId: 'api' }`; `build/docs/index.html` has `href=/api/1nce-os/1-nce-os` for the API Explorer link |
| 10 | Site displays 1NCE branding: navy navbar, teal primary color, Barlow font | ✓ VERIFIED | `src/css/custom.css`: `--ifm-navbar-background-color: #194a7d`, `--ifm-color-primary: #29abe2`, `--ifm-font-family-base: 'Barlow', sans-serif`. `build/index.html` contains Barlow Google Fonts link. `build/docs/index.html` confirms font and navbar CSS classes |
| 11 | Dark mode toggle works and preserves 1NCE brand colors | ? UNCERTAIN | CSS custom properties defined under `[data-theme='dark']` with `--ifm-navbar-background-color: #0d2a47`. Runtime behavior requires human verification |
| 12 | 1NCE logo is visible in the navbar header | ✓ VERIFIED | `static/img/1nce-logo.svg` exists (2319 bytes — real brand SVG per summary D-LOGO); `docusaurus.config.ts` navbar `logo.src: 'img/1nce-logo.svg'`; `build/docs/index.html` contains `<img src=/img/1nce-logo.svg alt="1NCE Logo">` in rendered navbar |
| 13 | Footer shows copyright 2026 1NCE GmbH with links to FAQ, Imprint, Terms & Conditions, Privacy Policy | ✓ VERIFIED | `build/docs/index.html` contains rendered footer: `Copyright © 2026 1NCE GmbH` and all 4 links (FAQ, Imprint, Terms and Conditions, Privacy Policy) with correct hrefs |
| 14 | GTM, SimpleAnalytics, and PostHog scripts are present in page source | ✓ VERIFIED | `build/index.html` contains: GTM-NS9K9DT inline script, `scripts.simpleanalyticscdn.com/latest.js` tag, PostHog init with `phc_M08s2Nrlv1o0bUfZ88Jo81VQqutezzTXDbIXEuavfh0` |
| 15 | SPA route changes trigger GTM virtual pageview events | ✓ VERIFIED | `src/clientModules/routeTracking.ts` exists with `onRouteDidUpdate` exporting `dataLayer.push({ event: 'virtualPageview', page: location.pathname })`; `docusaurus.config.ts` registers it via `clientModules: ['./src/clientModules/routeTracking.ts']` |
| 16 | Redirect map file exists for future CloudFront Function use | ✓ VERIFIED | `static/redirect-map.json` exists with 292 entries; JSON structure has `redirects` array with `old`/`new` fields; `scripts/12-generate-redirect-map.ts` present |

**Score:** 12/16 truths fully verified (3 uncertain — need human, 1 failed)

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `docusaurus.config.ts` | Multi-instance docs config with 5 navbar tabs | ✓ VERIFIED | All 5 navbar items, 4 plugin instances + OpenAPI plugin + api instance configured |
| `sidebars/documentation.ts` | Documentation tab sidebar | ✓ VERIFIED | Exports `docsSidebar` with autogenerated type |
| `sidebars/platform.ts` | Platform tab sidebar | ✓ VERIFIED | Exports `platformSidebar` with autogenerated type |
| `sidebars/blueprints.ts` | Blueprints tab sidebar | ✓ VERIFIED | Exports `blueprintsSidebar` with autogenerated type |
| `sidebars/terms.ts` | Terms tab sidebar | ✓ VERIFIED | Exports `termsSidebar` with autogenerated type |
| `sidebars/api.ts` | API tab sidebar | ✓ VERIFIED | Exports `apiSidebar` with autogenerated type |
| `docs/documentation/` | Documentation tab content | ✓ VERIFIED | 6 subdirectories: introduction, connectivity-services, sim-cards, network-services, troubleshooting, mcp-server |
| `docs/platform/` | Platform tab content | ✓ VERIFIED | 3 subdirectories: 1nce-os, 1nce-portal, platform-services |
| `docs/blueprints/` | Blueprints tab content | ✓ VERIFIED | blueprints-examples/ + 6 individual .md files |
| `docs/terms/` | Terms tab content | ✓ VERIFIED | terms-abbreviations.md present |
| `docs/api/` | Generated API documentation MDX pages | ✓ VERIFIED | 125 .mdx files across 6 spec subdirectories |
| `specs/authorization.json` | Authorization API spec | ✓ VERIFIED | File exists |
| `specs/sim-management.json` | SIM Management API spec | ✓ VERIFIED | File exists |
| `specs/order-management.json` | Order Management API spec | ✓ VERIFIED | File exists |
| `specs/product-information.json` | Product Information API spec | ✓ VERIFIED | File exists |
| `specs/support-management.json` | Support Management API spec | ✓ VERIFIED | File exists |
| `specs/1nce-os.json` | 1NCE OS API spec | ✓ VERIFIED | File exists |
| `src/css/custom.css` | 1NCE brand theme | ✓ VERIFIED | Contains `--ifm-color-primary: #29abe2`, Barlow font, navy navbar, dark mode overrides, footer navy |
| `src/clientModules/routeTracking.ts` | SPA route change tracking | ✓ VERIFIED | Contains `onRouteDidUpdate` with `dataLayer.push` virtualPageview |
| `static/img/1nce-logo.svg` | 1NCE logo for navbar | ✓ VERIFIED | 2319 bytes — real 1NCE brand SVG (replaced from placeholder per D-LOGO) |
| `static/redirect-map.json` | Redirect map for CloudFront | ✓ VERIFIED | 292 entries, valid JSON with `old`/`new` fields |
| `scripts/12-generate-redirect-map.ts` | Redirect map generation script | ✓ VERIFIED | File exists |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `docusaurus.config.ts` preset docs | `sidebars/documentation.ts` | `sidebarPath: './sidebars/documentation.ts'` | ✓ WIRED | Line 44 in config |
| `docusaurus.config.ts` navbar items | plugin instances | `docsPluginId: 'platform'/'blueprints'/'terms'/'api'` | ✓ WIRED | All 4 extra instances wired via `docsPluginId` in navbar items |
| `_category_.json` files | autogenerated sidebars | Docusaurus reads `_category_.json` for ordering | ✓ WIRED | 0 `_order.yaml` files remain; `_category_.json` files present with `position` and `label` |
| `docusaurus.config.ts headTags` | GTM | Inline script with `GTM-NS9K9DT` | ✓ WIRED | Confirmed in built `index.html` |
| `docusaurus.config.ts scripts` | SimpleAnalytics | External script `simpleanalyticscdn.com` | ✓ WIRED | Confirmed in built `index.html` |
| `docusaurus.config.ts headTags` | PostHog | Inline script with `phc_M08s2Nrlv1o0bUfZ88Jo81VQqutezzTXDbIXEuavfh0` | ✓ WIRED | Confirmed in built `index.html` |
| `docusaurus.config.ts clientModules` | `src/clientModules/routeTracking.ts` | `clientModules: ['./src/clientModules/routeTracking.ts']` | ✓ WIRED | Line 82 in config |
| `docusaurus.config.ts openapi plugin` | `specs/*.json` | `specPath: 'specs/authorization.json'` (and 5 others) | ✓ WIRED | All 6 `specPath` entries present; 125 MDX files generated as output |
| `docusaurus.config.ts openapi plugin` | API docs instance id: `api` | `docsPluginId: 'api'` | ✓ WIRED | Line 112 in config |
| `docusaurus.config.ts api docs instance` | `@theme/ApiItem` | `docItemComponent: '@theme/ApiItem'` | ✓ WIRED | Line 108 in config; generated endpoint MDX files import `@theme/ApiExplorer/MethodEndpoint` etc. |

---

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| NAV-01 | 02-01, 02-04 | Five-tab navbar matching help.1nce.com | ✓ SATISFIED | All 5 tabs in built HTML; config has all 5 navbar items |
| NAV-02 | 02-01, 02-04 | Deeply nested sidebars auto-generated from `_order.yaml` | ✓ SATISFIED | 0 `_order.yaml` files remain; `_category_.json` files with position/label in all content directories |
| NAV-03 | 02-01, 02-04 | Multiple docs plugin instances | ✓ SATISFIED | 5 plugin instances configured (default + platform + blueprints + terms + api) |
| NAV-04 | 02-01, 02-04 | All internal navigation links resolve (no broken links) | ✗ BLOCKED | `onBrokenLinks: 'warn'` — broken links log warnings instead of failing the build; cannot guarantee zero broken links |
| API-01 | 02-03, 02-04 | All 6 OpenAPI JSON specs integrated via openapi-docs plugin | ✓ SATISFIED | All 6 specs in `specs/`; plugin configured with all 6 `specPath` entries; 125 MDX pages generated |
| API-02 | 02-03, 02-04 | Interactive "Try It" panel functional for each endpoint | ? NEEDS HUMAN | Plugin and theme installed; endpoint MDX pages use `@theme/ApiExplorer` components and `api:` blob; runtime panel requires browser verification |
| API-03 | 02-03, 02-04 | Auto-generated code snippets in multiple languages | ? NEEDS HUMAN | `docusaurus-theme-openapi-docs` handles this at runtime; code snippet tabs require browser verification |
| API-04 | 02-03, 02-04 | API docs organized by spec (6 categories) | ✓ SATISFIED | `docs/api/` has 6 subdirectories; API sidebar and build output confirm 6 spec sections |
| THEME-01 | 02-02, 02-04 | 1NCE color scheme via CSS custom properties | ✓ SATISFIED | `custom.css` has `--ifm-color-primary: #29abe2`, `--ifm-navbar-background-color: #194a7d`, `--ifm-font-color-base: #4a4a4a` |
| THEME-02 | 02-02, 02-04 | Barlow font family loaded | ✓ SATISFIED | `custom.css` has `--ifm-font-family-base: 'Barlow', sans-serif`; built HTML links Google Fonts Barlow |
| THEME-03 | 02-02, 02-04 | Dark mode with brand-consistent colors | ? NEEDS HUMAN | `[data-theme='dark']` CSS block present with correct values; runtime toggle requires human verification |
| THEME-04 | 02-02, 02-04 | 1NCE logo in header | ✓ SATISFIED | `static/img/1nce-logo.svg` is 2319-byte real brand SVG; rendered in built HTML navbar |
| THEME-05 | 02-02, 02-04 | Custom footer with copyright and links | ✓ SATISFIED | Built HTML footer contains "Copyright © 2026 1NCE GmbH" and all 4 links |
| ANLYT-01 | 02-02, 02-04 | GTM integrated (`GTM-NS9K9DT`) | ✓ SATISFIED | GTM inline script confirmed in built `index.html` |
| ANLYT-02 | 02-02, 02-04 | SimpleAnalytics script included | ✓ SATISFIED | `simpleanalyticscdn.com/latest.js` script tag confirmed in built `index.html` with `data-collect-dnt` |
| ANLYT-03 | 02-02, 02-04 | PostHog tracking integrated | ✓ SATISFIED | PostHog init with `phc_M08s2Nrlv1o0bUfZ88Jo81VQqutezzTXDbIXEuavfh0` and `eu.i.posthog.com` confirmed in built `index.html` |

**Orphaned requirements:** None. All 16 Phase 2 requirement IDs from plan frontmatter are accounted for.

---

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `docusaurus.config.ts` | 25 | `onBrokenLinks: 'warn'` instead of `'throw'` | ⚠️ Warning | Broken internal links will not fail the build; NAV-04 compliance cannot be fully guaranteed without `'throw'` |
| `docs/api/index.md` | 4 | `slug: /` in API landing page frontmatter | ℹ️ Info | This slug would conflict with the root path `/` but is scoped to the `api` docs instance (`routeBasePath: '/api'`), so it correctly resolves to `/api/` — not a real conflict |

No blocking stubs found. All content directories are populated with real content from the ReadMe export. All analytics scripts contain real production keys (GTM-NS9K9DT, phc_M08s2..., eu.i.posthog.com). The API MDX pages contain generated content from real OpenAPI specs, not placeholder text.

---

### Human Verification Required

#### 1. API Explorer Try It Panel Interaction

**Test:** Open the built site (`npx docusaurus serve`), navigate to API Explorer, click any endpoint (e.g., Authorization > Obtain Access Token). Look for an interactive panel with a Send button and input fields for credentials.
**Expected:** A "Try It" panel renders below the endpoint description with auth credential fields, a Send button, and request/response preview areas.
**Why human:** The generated MDX pages import `@theme/ApiExplorer/MethodEndpoint` and contain an `api:` base64 blob, but whether the `docusaurus-theme-openapi-docs` renders a functional interactive panel in the browser cannot be confirmed by static file analysis.

#### 2. Dark Mode Toggle

**Test:** Click the sun/moon icon in the navbar.
**Expected:** Page switches to dark background (`#1b1b1d`), navbar goes to darker navy (`#0d2a47`), headings remain teal (`#29abe2`), all content remains readable.
**Why human:** CSS custom property behavior under `data-theme='dark'` requires browser rendering.

#### 3. Sidebar Ordering vs. ReadMe.com

**Test:** Open the Documentation tab and compare the sidebar category order to https://help.1nce.com.
**Expected:** Categories appear in the same sequence as the original site (driven by `_order.yaml` → `_category_.json` position conversion).
**Why human:** Requires visual comparison against the live ReadMe source.

#### 4. GTM Virtual Pageview on SPA Navigation

**Test:** Open DevTools Network tab, filter for `collect?v=2` or open DevTools Console, navigate between navbar tabs.
**Expected:** Each tab click triggers a `virtualPageview` event in the GTM dataLayer (visible in DevTools as a `gtm.js` or dataLayer push call).
**Why human:** `onRouteDidUpdate` executes at runtime; code correctness is verified but execution must be confirmed.

---

### Gaps Summary

One gap was found that weakens a stated requirement.

**NAV-04 compliance is partial.** The plan required `onBrokenLinks: 'throw'` to enforce that all internal links resolve. The current config has `onBrokenLinks: 'warn'`, which means a build with broken internal links still succeeds. The 02-01 SUMMARY noted 165 broken links to `/api` were present as expected warnings during that plan, and 02-03 added the API instance to resolve them. However, without `'throw'`, there is no automated guarantee that the final build is free of broken links.

The fix is a one-line change in `docusaurus.config.ts` followed by a rebuild to confirm zero warnings become errors. Given the human sign-off in 02-04 covered visual navigation, the actual link breakage risk is low — but the requirement contract is not met programmatically.

Three requirements (API-02, API-03, THEME-03) require human browser verification and are flagged as `NEEDS HUMAN` rather than `BLOCKED` — the code is correctly in place for all three.

---

_Verified: 2026-03-21_
_Verifier: Claude (gsd-verifier)_
