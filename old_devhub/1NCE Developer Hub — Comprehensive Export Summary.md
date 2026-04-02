# 1NCE Developer Hub — Comprehensive Export Summary

**Export Date:** April 1, 2026  
**Source URL:** https://help.1nce.com/dev-hub  
**Archive Size:** 493 MB (uncompressed) / 121 MB (ZIP)  
**Total Files:** 1,386 files across all categories

---

## 1. What Was Captured

This archive is a complete, multi-layer export of the 1NCE Developer Hub. The capture was performed using three complementary methods to ensure maximum completeness:

1. **Direct API/Markdown Fetch** — All 227 pages were fetched directly via the ReadMe.io Markdown API endpoint (`.md` URLs), providing clean, portable content.
2. **Full HTML Render Fetch** — All 227 pages were also fetched as fully rendered HTML, preserving the exact DOM structure, CSS classes, and embedded styles.
3. **`wget` Mirror Crawl** — A full recursive mirror crawl was executed, capturing 679 files including CDN assets, images, CSS, and JavaScript bundles.

---

## 2. Page Inventory

| Category | Page Count |
|---|---|
| 1NCE OS Services | 8 |
| Admin Logs | 5 |
| Cloud Integrator | 6 |
| Connectivity Services | 4 |
| Data Services | 5 |
| Device Services (Auth, Controller, Inspector, Integrator, Locator) | 18 |
| Energy Saver | 6 |
| Examples & Blueprints | 14 |
| Hardware & Modem Guides (page/) | 7 |
| Introduction / Welcome | 1 |
| LwM2M Service | 6 |
| Mobile Network Services | 3 |
| Network Services (VPN, Internet Breakout) | 6 |
| Platform Services (Data Streamer, SMS Forwarder, Blockchain) | 10 |
| Plugin System | 6 |
| Portal Guide | 6 |
| SDK & Blueprints | 4 |
| SIM Cards | 5 |
| SMS Services | 7 |
| API Reference Endpoints | 106 |
| **Total** | **227** |

---

## 3. Navigation Structure

The hub is organized into the following top-level sections in the sidebar:

**Top Navigation Bar:**
- Documentation (`/dev-hub/docs`)
- API Explorer (`/dev-hub/reference`)
- 1NCE Platform (`/dev-hub/v200/docs/introduction-welcome`)
- Blueprints & Examples (`/dev-hub/docs/examples-overview`)
- Terms & Abbreviations (`/dev-hub/page/terms-abbreviations`)

**External Links in Header:**
- 1NCE Home: https://1nce.com
- 1NCE Shop: https://portal.1nce.com/portal/shop/cart
- 1NCE Portal: https://portal.1nce.com/portal/customer/login

**Sidebar Categories (in order):**
1. Introduction
2. 1NCE Portal
3. SIM Cards
4. HCP Server
5. 1NCE MCP
6. Connectivity Services
7. Platform Services
8. Network Services
9. 1NCE OS
10. Troubleshooting
11. Blueprints & Examples

---

## 4. Brand & Styling Reference

The hub uses a custom theme built on top of ReadMe.io's platform. The following CSS custom properties define the 1NCE brand:

| Variable | Value | Usage |
|---|---|---|
| `--1nce-dark-blue` | `#194a7d` | Primary brand color, sidebar background |
| `--1nce-light-blue` | `#29abe2` | Accent color, H1 headings, buttons |
| `--1nce-h1-blue` | `#29abe2` | H1 heading color |
| `--1nce-h2-blue` | `#1e4d7d` | H2/H3 heading color |
| `--1nce-light-grey` | `#f0f0f0` | Background for tables/callouts |
| `--1nce-text-color` | `#4a4a4a` | Body text color (graphite) |
| `--Header-background` | `#d8e0e3` | Header bar background |
| `--color-primary` | `#194a7d` | Primary interactive color |
| `--color-primary-alt` | `#072443` | Deep navy alternative |
| `--markdown-font-size` | `15px` | Base font size |

**Typography:** The hub uses the **Barlow** font family (regularBarlow, mediumBarlow) for all text.

**Custom CSS Classes of Note:**
- `.navigationTable`, `.navigationTableRow`, `.navigationTableCell` — Custom table layout used on the Welcome page
- `.button-flex-container`, `.button-flex-item` — Flex button layout
- `.glossary-key-letter`, `.glossary-term`, `.glossary-letter-map` — Glossary page styles
- `.hw-guides-*` — Hardware guides page styles
- `.footer-container`, `.footer-content` — Custom footer

---

## 5. API Reference Structure

The hub contains **106 API reference endpoints** across the following categories:

| HTTP Method | Count |
|---|---|
| GET | ~55 |
| POST | ~25 |
| PATCH | ~10 |
| DELETE | ~10 |
| PUT | ~6 |

Key API groups:
- **SIM Management** (legacy): `getSimsByCustomerUsingGet`, `updateSimUsingPut`, `sendSmsToSimUsingPost`, etc.
- **1NCE OS — Device Integration**: `/v1/integrate/devices/*` (endpoints, actions, PSK)
- **1NCE OS — Cloud Integration**: `/v1/integrate/clouds/*` (AWS, Webhooks)
- **1NCE OS — Device Location**: `/v1/locate/geofences/*`
- **1NCE OS — Energy Saver**: `/v1/optimize/templates/*`, `/v1/optimize/messages/*`
- **1NCE OS — Admin**: `/v1/settings/*`, `/v1/agreements/*`
- **1NCE OS — Plugins**: `/v1/partners/*` (Datacake, Mender, Tartabit, Memfault)

---

## 6. Link Inventory

| Category | Count |
|---|---|
| Total internal links found | 695 |
| Total external links found | 222 |
| Images referenced | 189 |
| CSS stylesheets | 12 |
| JavaScript bundles | 41 |
| Pages requiring authentication | 454 (login redirect) |
| Regular redirects | 4 |

**Key External Destinations:**
- `1nce.com` — Main website
- `portal.1nce.com` — Customer portal
- `github.com/1NCE-GmbH` — GitHub repositories (SDK, blueprints)
- `files.readme.io` — CDN for documentation images
- `cdn.readme.io` — CDN for ReadMe.io platform assets

---

## 7. Redirect Map

The site uses **Microsoft Azure AD SAML SSO** for authentication. Pages that require login redirect through:
```
https://help.1nce.com/login?redirect_uri=<page>
  → https://login.microsoftonline.com/30d91adf-8d2e-4258-bc92-ac01a70ea088/saml2?...
```

**Tenant ID:** `30d91adf-8d2e-4258-bc92-ac01a70ea088`

The 4 regular (non-auth) redirects are documented in `data_exports/regular_redirects.json`.

---

## 8. Files Reference

| File/Directory | Description |
|---|---|
| `html_pages/*.html` | 227 fully rendered HTML pages |
| `markdown_pages/*.md` | 220 clean Markdown content files |
| `v200_html_pages/` | 1NCE Platform (v2.0) HTML pages |
| `assets/images/` | 189 images (23 MB) |
| `assets/css/` | 12 CSS stylesheets from CDN |
| `raw_wget_mirror/` | Full wget mirror (679 files, 248 MB) |
| `data_exports/llms.txt` | LLM-optimized page index (34 KB) |
| `data_exports/llms-full.txt` | Full LLM content dump (670 KB) |
| `data_exports/page_index.md` | Human-readable page index by category |
| `data_exports/page_index.json` | Machine-readable page index |
| `data_exports/pages_content.json` | Structured content extraction (3 MB) |
| `data_exports/sidebar_nav_complete.json` | Full sidebar navigation hierarchy |
| `data_exports/api_endpoints.json` | All 106 API endpoints |
| `data_exports/redirect_map.json` | All 695 internal links with redirect info |
| `data_exports/css_variables.json` | Brand CSS custom properties |
| `data_exports/extracted_custom_css.css` | Inline/custom CSS extracted from pages |
| `data_exports/all_internal_links.txt` | 695 internal links |
| `data_exports/all_external_links.txt` | 222 external links |
| `data_exports/robots.txt` | Original robots.txt |

---

*Exported by Manus AI on April 1, 2026. Source: https://help.1nce.com/dev-hub*
