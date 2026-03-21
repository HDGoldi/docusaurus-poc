# Requirements: 1NCE Developer Hub Migration

**Defined:** 2026-03-20
**Core Value:** Developers can browse all existing documentation and interactively test API endpoints exactly as they can on the current ReadMe.com-hosted site.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Content Conversion

- [x] **CONV-01**: All 298 Markdown files converted to valid MDX that builds without errors
- [x] **CONV-02**: `<HTMLBlock>` components (42 files) converted to standard MDX-compatible markup
- [x] **CONV-03**: `<Image>` JSX tags converted to standard Markdown image syntax with local paths
- [x] **CONV-04**: Remote images from `files.readme.io` downloaded to `/static/img/` directory
- [x] **CONV-05**: Base64-encoded inline images (40 images in 31 files) extracted to static image files
- [x] **CONV-06**: `(doc:slug)` cross-reference links (112 occurrences) converted to Docusaurus internal links
- [x] **CONV-07**: Blockquote admonitions (`:warning:`, `:info:`, etc.) converted to Docusaurus `:::` admonitions
- [x] **CONV-08**: `<Table>` JSX components converted to standard Markdown tables
- [x] **CONV-09**: ReadMe YAML frontmatter converted to Docusaurus-compatible frontmatter (title, description, slug)
- [x] **CONV-10**: Conversion implemented as automated Node.js script (not manual per-file editing)

### Navigation & Structure

- [x] **NAV-01**: Five-tab navbar matching current help.1nce.com (Documentation, API Explorer, 1NCE Platform, Blueprints & Examples, Terms & Abbreviations)
- [x] **NAV-02**: Deeply nested sidebars auto-generated from `_order.yaml` files for each content area
- [x] **NAV-03**: Multiple docs plugin instances configured for separate navbar tabs
- [x] **NAV-04**: All internal navigation links resolve correctly (no broken links)

### API Explorer

- [ ] **API-01**: All 6 OpenAPI JSON specs integrated via `docusaurus-openapi-docs` plugin
- [ ] **API-02**: Interactive "Try It" panel functional for each API endpoint
- [ ] **API-03**: Auto-generated code snippets in multiple languages for each endpoint
- [ ] **API-04**: API documentation organized by spec (Authorization, SIM Management, Order Management, Product Information, Support Management, 1NCE OS)

### Theming & Branding

- [ ] **THEME-01**: 1NCE color scheme applied via CSS custom properties (`--1nce-dark-blue: #194a7d`, `--1nce-light-blue: #29abe2`, `--1nce-text-color: #4a4a4a`)
- [ ] **THEME-02**: Barlow font family loaded (medium for headings, regular for body text)
- [ ] **THEME-03**: Dark mode support with brand-consistent colors
- [ ] **THEME-04**: 1NCE logo in header matching current site sizing
- [ ] **THEME-05**: Custom footer with copyright, FAQ, Imprint, Terms & Conditions, Privacy Policy links

### Analytics

- [ ] **ANLYT-01**: Google Tag Manager integrated (`GTM-NS9K9DT`)
- [ ] **ANLYT-02**: SimpleAnalytics script included
- [ ] **ANLYT-03**: PostHog tracking integrated (EU instance, `eu.i.posthog.com`)

### Infrastructure & Deployment

- [ ] **INFRA-01**: S3 bucket configured for static website hosting
- [ ] **INFRA-02**: CloudFront distribution with Origin Access Control (OAC)
- [ ] **INFRA-03**: SSL certificate via ACM in us-east-1 for help.1nce.com
- [ ] **INFRA-04**: Route 53 DNS alias records pointing to CloudFront
- [ ] **INFRA-05**: CloudFront Function for SPA routing (index.html rewrite on sub-directory requests)
- [x] **INFRA-06**: GitHub Actions CI/CD pipeline with OIDC auth to AWS
- [x] **INFRA-07**: Automated build + S3 sync + CloudFront cache invalidation on merge to main

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Search

- **SRCH-01**: Algolia DocSearch integration (or local search plugin)
- **SRCH-02**: Full-text search across all documentation and API pages

### URL Redirects

- **REDIR-01**: Redirect map from old ReadMe.com URLs to new Docusaurus paths
- **REDIR-02**: CloudFront Function or S3 redirect rules for SEO preservation

### Enhanced UX

- **UX-01**: AI-powered search assistant (Inkeep/Mendable)
- **UX-02**: Doc versioning with version dropdown
- **UX-03**: Glossary component for Terms & Abbreviations page

## Out of Scope

| Feature | Reason |
|---------|--------|
| Content rewriting or restructuring | Migrate as-is first; content improvements are a separate initiative |
| Mobile native app | Web-first, responsive Docusaurus handles mobile |
| Real-time API monitoring | Not part of documentation scope |
| Multi-language / i18n | Not present in current site |
| Custom CMS or admin panel | Content managed via Git + MDX |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| CONV-01 | Phase 1 | Complete |
| CONV-02 | Phase 1 | Complete |
| CONV-03 | Phase 1 | Complete |
| CONV-04 | Phase 1 | Complete |
| CONV-05 | Phase 1 | Complete |
| CONV-06 | Phase 1 | Complete |
| CONV-07 | Phase 1 | Complete |
| CONV-08 | Phase 1 | Complete |
| CONV-09 | Phase 1 | Complete |
| CONV-10 | Phase 1 | Complete |
| NAV-01 | Phase 2 | Complete |
| NAV-02 | Phase 2 | Complete |
| NAV-03 | Phase 2 | Complete |
| NAV-04 | Phase 2 | Complete |
| API-01 | Phase 2 | Pending |
| API-02 | Phase 2 | Pending |
| API-03 | Phase 2 | Pending |
| API-04 | Phase 2 | Pending |
| THEME-01 | Phase 2 | Pending |
| THEME-02 | Phase 2 | Pending |
| THEME-03 | Phase 2 | Pending |
| THEME-04 | Phase 2 | Pending |
| THEME-05 | Phase 2 | Pending |
| ANLYT-01 | Phase 2 | Pending |
| ANLYT-02 | Phase 2 | Pending |
| ANLYT-03 | Phase 2 | Pending |
| INFRA-01 | Phase 3 | Pending |
| INFRA-02 | Phase 3 | Pending |
| INFRA-03 | Phase 3 | Pending |
| INFRA-04 | Phase 3 | Pending |
| INFRA-05 | Phase 3 | Pending |
| INFRA-06 | Phase 3 | Complete |
| INFRA-07 | Phase 3 | Complete |

**Coverage:**
- v1 requirements: 33 total
- Mapped to phases: 33
- Unmapped: 0

---
*Requirements defined: 2026-03-20*
*Last updated: 2026-03-20 after roadmap creation*
