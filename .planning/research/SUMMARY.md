# Project Research Summary

**Project:** 1NCE Developer Hub Migration (ReadMe.com to Docusaurus)
**Domain:** Static developer documentation portal with interactive API explorer
**Researched:** 2026-03-20
**Confidence:** MEDIUM (stack versions unverified against live npm; content analysis is HIGH confidence)

## Executive Summary

This project migrates the 1NCE Developer Hub from ReadMe.com SaaS to a self-hosted Docusaurus 3.x static site on AWS (S3 + CloudFront), replicating a five-tab navigation structure, 298 content pages, and 6 interactive OpenAPI API specs. The migration is not a generic Docusaurus scaffold — it is a content transformation problem first. The exported ReadMe content contains at least six distinct proprietary syntax patterns (`<HTMLBlock>`, `(doc:slug)` cross-references, `<Table>` JSX, `> :warning:` admonitions, `<Image>` components, base64-encoded inline images) that each require their own conversion pass before a single Docusaurus build will succeed.

The recommended approach is to tackle content conversion as the critical path, with all other work depending on it. Docusaurus 3.x with `docusaurus-plugin-openapi-docs` for the API Explorer is the only realistic stack — no mature alternative provides equivalent "Try It" API console functionality as a native Docusaurus plugin. The AWS deployment architecture is standard and well-understood: S3 origin with CloudFront CDN, a CloudFront Function for SPA routing, ACM certificate, and GitHub Actions CI/CD using OIDC authentication (no stored AWS secrets).

The primary risk is underestimating the content conversion scope. 42 files contain `<HTMLBlock>` wrappers, 112 occurrences of `(doc:slug)` internal links exist across 44 files, and 31 files have 40 base64-encoded images. Teams that treat this as a "copy Markdown files over" migration will encounter cascading MDX build failures. Mitigation is straightforward: write conversion scripts with a full catalog of patterns before starting, and gate progress on `docusaurus build` passing cleanly after each conversion pass.

## Key Findings

### Recommended Stack

Docusaurus 3.x is the unambiguous choice for a developer documentation portal with interactive API docs. It provides multi-sidebar support, MDX, dark mode, and i18n natively, and is actively maintained by Meta. The `docusaurus-plugin-openapi-docs` (PaloAltoNetworks, v4.x) is the only mature plugin providing an integrated "Try It" console for Docusaurus — the alternatives (Redoc, Swagger UI embed, Stoplight Elements) are either read-only, paid SaaS, or require substantial custom integration. Stack versions require npm verification before scaffolding, as the research knowledge cutoff is May 2025 and the project is executing in March 2026.

**Core technologies:**
- Docusaurus 3.x (`^3.7`): Static site generator — only serious contender for docs with interactive API explorer
- `docusaurus-plugin-openapi-docs` + `docusaurus-theme-openapi-docs` (v4.x): Interactive API console — no comparable free alternative
- Node.js 20 LTS: Runtime — Docusaurus requires Node >=18; 20 LTS for CI/CD stability
- TypeScript (`^5.x`): Config type safety — Docusaurus supports `.config.ts` natively
- `@docusaurus/faster` (Rspack): Build performance — 2-5x faster than default Webpack; worthwhile given ~150+ pages plus generated API MDX
- `gray-matter` + `glob`: Migration scripting — frontmatter parsing and file discovery for conversion scripts
- AWS S3 + CloudFront + ACM + Route 53: Hosting — project constraint; standard static site pattern
- GitHub Actions with OIDC: CI/CD — keyless AWS authentication; industry best practice

**What not to use:** Tailwind CSS (conflicts with Infima), Docker (unnecessary for static site), Docusaurus versioning (no V2 exists), Algolia DocSearch (out of scope for v1), any CMS (Git is the CMS).

### Expected Features

The migration has 298 files across docs, reference, custom_pages, and recipes directories. The content is the product — parity is the baseline requirement.

**Must have (table stakes for launch):**
- All ~298 pages converted and rendering — missing pages break user trust and existing bookmarks
- Five-tab navbar with independent sidebars per tab — the primary navigation model users know
- Interactive "Try It" API console for all 6 OpenAPI specs — the #1 developer-facing feature; removing it is a regression
- 1NCE brand colors, logo, and dark mode — without branding it looks like an abandoned prototype
- AWS deployment at help.1nce.com with CI/CD — site must be reachable via automated deploys
- URL redirects from old ReadMe paths — protects SEO and existing bookmarks; commonly overlooked
- HTMLBlock and proprietary component conversion — build fails without this; everything else depends on it

**Should have (high value, defer post-launch):**
- Full-text search (Algolia DocSearch or `docusaurus-search-local`) — important UX improvement; not launch-blocking
- Structured glossary component — raw HTML table will render; componentization is a UX upgrade
- Hardware recipe card grid — existing links work; card layout improves discoverability

**Defer to v2+:**
- AI assistant — requires RAG infrastructure; massive scope for marginal migration value
- Doc versioning — only one version exists; add when V2 actually ships
- PWA / offline docs — evaluate only if IoT developer feedback requests it
- i18n — no multi-language requirement exists today

**Anti-features (explicitly do not build):** user authentication, custom analytics dashboard, CMS web editor, real-time API status widget, comment system.

### Architecture Approach

The system is fully static: built at CI time from three content sources (converted MDX, OpenAPI JSON specs, custom React pages), deployed as flat files to S3, served via CloudFront. There is no runtime server — all interactivity runs client-side in the browser, with "Try It" API calls going directly from the user's browser to `api.1nce.com`. This is the simplest possible hosting model and the correct one for a docs site.

**Major components:**
1. **Content Conversion Pipeline** — one-time scripts (`scripts/`) transforming ReadMe export to Docusaurus-compatible MDX; the critical path item; must run before any other phase can complete
2. **Multi-docs Plugin System** — 3 `plugin-content-docs` instances (Documentation, Platform, Blueprints) + 1 OpenAPI plugin instance (API Explorer) + 1 standalone page (Terms); each with its own sidebar generated from `_order.yaml` files
3. **OpenAPI Plugin** (`docusaurus-plugin-openapi-docs`) — parses all 6 OpenAPI JSON specs at build time, generates interactive MDX pages with "Try It" panels; run as `gen-api-docs` step in CI before `npm run build`
4. **Theme Layer** — CSS custom property overrides on Infima for 1NCE navy/teal palette; covers both light and dark mode; no CSS-in-JS needed
5. **AWS Infrastructure** — S3 (OAC, not public website endpoint) + CloudFront (SPA routing via CloudFront Function) + ACM (us-east-1) + Route 53; provisioned manually for v1
6. **GitHub Actions CI/CD** — build, `gen-api-docs`, S3 sync, CloudFront invalidation; OIDC authentication

**Key patterns to follow:**
- Multiple docs plugin instances, not a single sidebar with nesting (Pattern 1)
- Programmatic sidebar generation from `_order.yaml`, not hand-crafted entries (Pattern 3)
- CloudFront Function for SPA routing, not S3 website hosting endpoint (Pattern 4)
- Generated API MDX excluded from git (`.gitignore`), regenerated in CI (Pattern 2/Anti-pattern 3 caveat: evaluate per team preference)

### Critical Pitfalls

1. **Incomplete ReadMe proprietary syntax conversion** — Six distinct patterns (`<HTMLBlock>`, `(doc:slug)`, `<Table>`, admonitions, `<Image>`, base64 images) each crash MDX independently. Catalog all patterns before writing conversion code; test build after each conversion pass. Do not assume the export is "mostly standard Markdown."

2. **Base64-encoded images left inline** — 31 files, 40 images encoded as data URIs; these bloat files, slow builds, and may hit MDX parser limits. Extract images to `static/img/` as the very first conversion step, before any other transformation.

3. **Broken internal link graph** — 112 `(doc:slug)` cross-references that map flat ReadMe slugs to nested Docusaurus paths. Build a slug-to-path lookup table from the export before writing the link converter. Set `onBrokenLinks: 'throw'` in `docusaurus.config.ts` to catch any misses at build time.

4. **SPA routing failures on CloudFront** — Direct URL access returns 403 from S3 without the CloudFront Function URI rewrite. This is the most common post-deployment complaint for Docusaurus-on-AWS. Implement and test before go-live; also set `trailingSlash: true` in Docusaurus config.

5. **Multiple OpenAPI spec conflicts** — 6 specs need unique `id`, separate `outputDir`, and separate sidebar configs in the plugin. Test each spec independently after generation; verify "Try It" server URLs match spec `servers` configuration.

## Implications for Roadmap

Based on the dependency graph established in research, content conversion gates everything else. The build must succeed before navigation, branding, or API integration work can be validated. AWS infrastructure and API Explorer can proceed in parallel once the project is scaffolded.

### Phase 1: Project Scaffold and Content Conversion

**Rationale:** The MDX build must pass cleanly before any other phase can be verified. HTMLBlock, base64 images, `(doc:slug)` links, and frontmatter issues all cause build failures that make it impossible to test navigation, theming, or API integration. This is the highest-risk, highest-effort item and must come first.

**Delivers:** Docusaurus project scaffolded; all ~298 pages converted to valid MDX; build succeeds with zero errors; images extracted to `static/img/`; frontmatter cleaned; internal links resolved.

**Addresses:**
- Content parity (all 298 pages)
- HTMLBlock/ReadMe proprietary component conversion
- Base64 image extraction
- Frontmatter mapping (`hidden` -> `draft`, `excerpt` -> `description`, etc.)
- `(doc:slug)` link resolution

**Avoids:**
- Pitfall 1: Incomplete syntax conversion
- Pitfall 2: Base64 images inline
- Pitfall 3: Broken internal links
- Pitfall 5: Frontmatter incompatibility
- Pitfall 8: Custom HTML without CSS equivalents
- Pitfall 11: `<Image>` component build failures

**Research flag:** Needs phase research — conversion complexity depends on full pattern audit; consider running `grep` analysis pass as first task.

### Phase 2: Navigation and Site Structure

**Rationale:** Navigation defines URL paths, which are required before URL redirects can be built and before the link checker can validate cross-references. Must come after content exists but before deployment.

**Delivers:** Five-tab navbar; multi-docs plugin instances; sidebars auto-generated from `_order.yaml`; all pages navigable with correct sidebar context; breadcrumbs and prev/next working.

**Addresses:**
- Five-tab navbar
- Deeply nested sidebar (10+ categories)
- Multiple sidebars
- Sidebar ordering from `_order.yaml`

**Avoids:**
- Pitfall 6: Multi-sidebar misconfiguration
- Anti-Pattern 1: Single sidebar for all tabs
- Anti-Pattern 2: Manually crafting sidebar entries

**Research flag:** Standard Docusaurus multi-instance pattern — well-documented, skip deep research.

### Phase 3: API Explorer Integration

**Rationale:** Independent of content conversion once the project is scaffolded (OpenAPI specs are separate JSON files, not affected by Markdown conversion). Can begin in parallel with Phase 2 once Phase 1 scaffolding is done.

**Delivers:** All 6 OpenAPI specs rendered as interactive MDX pages; "Try It" console functional against `api.1nce.com`; API Explorer tab with auto-generated sidebar; code snippets per endpoint.

**Addresses:**
- Interactive "Try It" API console (6 specs)
- Multi-spec API documentation
- Auto-generated code snippets
- Bearer token auth in Try It panel
- API endpoint sidebar navigation

**Avoids:**
- Pitfall 4: Multiple OpenAPI spec conflicts (unique IDs, separate output dirs)
- Pitfall 9: Plugin version mismatch (pin compatible versions at scaffold time)

**Research flag:** Verify exact compatible version matrix between Docusaurus 3.x and `docusaurus-openapi-docs` v4.x via `npm view` before scaffolding.

### Phase 4: Theming and Visual Polish

**Rationale:** Depends on navigation structure being stable (Phase 2) and API pages rendered (Phase 3) so branding can be validated across all page types. Last before deployment.

**Delivers:** 1NCE navy/teal color palette via CSS custom properties; dark mode covering both themes; logo and favicon; custom fonts; landing page or redirect from root.

**Addresses:**
- 1NCE brand colors
- Dark mode parity
- Logo/favicon
- Custom fonts

**Research flag:** Standard Docusaurus CSS custom property theming — well-documented, skip deep research. Extract exact hex values from current help.1nce.com before starting.

### Phase 5: AWS Infrastructure and CI/CD Deployment

**Rationale:** Can be provisioned in parallel with Phases 2-3 since it does not depend on content being final. Must be complete before go-live. DNS cutover is the final step after staging validation.

**Delivers:** S3 bucket with OAC; CloudFront distribution with SSL; CloudFront Function for SPA routing; ACM certificate; Route 53 DNS; GitHub Actions workflow (build, gen-api-docs, S3 sync, CF invalidation, OIDC auth); staging domain validation; URL redirect map from old ReadMe paths; DNS cutover.

**Addresses:**
- AWS S3 + CloudFront hosting
- SSL certificate (help.1nce.com)
- CloudFront SPA routing function
- CI/CD automated deploy
- URL redirects from old ReadMe paths

**Avoids:**
- Pitfall 7: SPA routing breaks on CloudFront (CloudFront Function required)
- Pitfall 10: DNS cutover downtime (staging domain, reduced TTL, rollback plan)
- Pitfall 12: URL structure mismatch breaking SEO (comprehensive redirect map)
- Anti-Pattern 4: S3 website hosting endpoint (use REST endpoint + OAC)

**Research flag:** Standard AWS static hosting pattern — well-documented. Redirect map construction needs attention; build it during Phase 2 when Docusaurus URL structure is finalized.

### Phase 6: Post-Launch — Search and UX Enhancements

**Rationale:** Non-blocking for launch. Users can use browser find initially. Algolia requires application approval process which may have lead time.

**Delivers:** Full-text search (Algolia DocSearch or `docusaurus-search-local` as interim); structured glossary component; hardware recipe card grid; `editUrl` links to GitHub.

**Addresses:**
- Full-text search
- Glossary component refactor
- Recipe card grid
- Edit this page links

**Research flag:** Algolia DocSearch application process has variable approval timelines — start application early in Phase 5 if Algolia is preferred over `docusaurus-search-local`.

### Phase Ordering Rationale

- Phase 1 is a hard prerequisite for everything: the build must pass before navigation or theming can be verified
- Phases 2 and 3 can overlap once Phase 1 scaffolding is complete (API Explorer is independent of Markdown content)
- Phase 5 (AWS) can start immediately after Phase 1 scaffolding (infrastructure setup does not depend on final content)
- Phase 4 (theming) should be last before launch so it can be validated against all page types
- Phase 6 is explicitly post-launch per project requirements

### Research Flags

Needs deeper research during planning:
- **Phase 1:** Full pattern audit of all 298 files before writing conversion scripts — run grep analysis to confirm/extend the known pattern list; exact counts matter for scoping effort
- **Phase 3:** Verify `docusaurus-plugin-openapi-docs` v4.x compatibility matrix with current Docusaurus 3.x version via `npm view` before scaffolding; plugin version lag is a known risk

Standard patterns (skip research-phase):
- **Phase 2:** Multi-instance Docusaurus docs — official docs cover this thoroughly
- **Phase 4:** Infima CSS custom property theming — well-documented in Docusaurus theming docs
- **Phase 5:** S3 + CloudFront static hosting + GitHub Actions OIDC — well-established AWS pattern with extensive documentation

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | MEDIUM | Core Docusaurus/React/Node HIGH; `docusaurus-plugin-openapi-docs` version numbers need npm verification before scaffolding (knowledge cutoff May 2025, executing March 2026) |
| Features | HIGH | Based on direct analysis of the actual 298-file export; content patterns, frontmatter fields, and proprietary components are primary source, not inference |
| Architecture | HIGH | Standard Docusaurus multi-instance pattern + AWS static hosting; well-documented; content analysis confirms component boundaries |
| Pitfalls | HIGH | Pitfall counts derived from direct grep analysis of the exported codebase; not estimated — e.g., 112 `(doc:slug)` occurrences in 44 files is a measured fact |

**Overall confidence:** MEDIUM-HIGH

### Gaps to Address

- **Exact package versions:** Run `npm view @docusaurus/core version`, `npm view docusaurus-plugin-openapi-docs version`, `npm view docusaurus-theme-openapi-docs version`, `npm view @docusaurus/faster version` before scaffolding. Do not trust version numbers from this research document without verification.
- **Old URL structure mapping:** The full ReadMe URL patterns (e.g., `/dev-hub/docs/...`, `/dev-hub/reference/...`) need to be documented from the live site before it is decommissioned. The redirect map cannot be finalized until both old URLs and new Docusaurus paths are known.
- **1NCE brand exact values:** Extract exact hex color codes, font names, and logo assets from the current `help.1nce.com` or brand guidelines before Phase 4 begins.
- **`<Table>` JSX component scope:** The pitfalls research mentions `<Table align={[...]}>` components but did not quantify the count across all files. Add a grep pass for `<Table` during Phase 1 pattern audit.
- **OpenAPI spec server URLs:** Verify each of the 6 specs' `servers` field points to the correct base URL before Phase 3 "Try It" testing.

## Sources

### Primary (HIGH confidence)
- Direct analysis of exported ReadMe content (`dev-hub-v2.6-2026-03-20T20-39-14_8a4df1b/`) — 298 markdown files, 6 OpenAPI JSON specs, `_order.yaml` files
- Docusaurus official documentation (docusaurus.io) — core config, multi-instance docs, sidebars, MDX, theming
- AWS documentation — S3 OAC, CloudFront Functions, ACM, Route 53
- GitHub Actions aws-actions documentation — OIDC configuration

### Secondary (MEDIUM confidence)
- PaloAltoNetworks/docusaurus-openapi-docs GitHub repository — plugin configuration, version matrix (version numbers may have advanced since training data)
- Manus AI migration guide (project root, 2026-03-18) — initial content analysis

### Tertiary (LOW confidence)
- Training data knowledge (knowledge cutoff May 2025) — version numbers flagged throughout; verify with npm before use

---
*Research completed: 2026-03-20*
*Ready for roadmap: yes*
