# Roadmap: 1NCE Developer Hub Migration

## Overview

This migration moves the 1NCE Developer Hub from ReadMe.com to a self-hosted Docusaurus site on AWS. The critical path is content conversion -- 298 files with six proprietary syntax patterns must build cleanly before anything else can be validated. Once the content compiles, site structure (navigation, API Explorer, theming) is assembled as one coherent deliverable. Finally, AWS infrastructure and CI/CD are provisioned for production deployment at help.1nce.com.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Content Conversion** - Scaffold Docusaurus project and convert all 298 ReadMe pages to valid MDX that builds without errors
- [ ] **Phase 2: Site Assembly** - Navigation, API Explorer, theming, and analytics -- everything that makes the site complete and branded
- [ ] **Phase 3: Infrastructure and Deployment** - AWS hosting, CI/CD pipeline, SSL, DNS, and production go-live

## Phase Details

### Phase 1: Content Conversion
**Goal**: All exported ReadMe content builds as valid Docusaurus MDX with zero errors
**Depends on**: Nothing (first phase)
**Requirements**: CONV-01, CONV-02, CONV-03, CONV-04, CONV-05, CONV-06, CONV-07, CONV-08, CONV-09, CONV-10
**Success Criteria** (what must be TRUE):
  1. `docusaurus build` completes with zero errors on all 298 converted pages
  2. All images render correctly (no broken images, no base64 data URIs left inline)
  3. All internal cross-reference links resolve (no `(doc:slug)` syntax remaining)
  4. Admonitions, tables, and code blocks render with correct formatting
  5. Conversion is fully automated via script (re-runnable, not manual edits)
**Plans:** 5 plans

Plans:
- [x] 01-01-PLAN.md -- Scaffold Docusaurus, copy/normalize export, convert frontmatter, create shared utilities
- [x] 01-02-PLAN.md -- Image pipeline: extract base64, download remote images, convert Image JSX to Markdown
- [x] 01-03-PLAN.md -- Content conversion: HTMLBlocks, tables, doc links, admonitions
- [x] 01-04-PLAN.md -- Pipeline orchestrator, sidebar generation, build validation, human verification
- [x] 01-05-PLAN.md -- Gap closure: wire scripts 11-12 into pipeline orchestrator, validate full re-runnable build

### Phase 2: Site Assembly
**Goal**: The complete site experience -- navigation, interactive API docs, 1NCE branding, and analytics -- is functional in local dev
**Depends on**: Phase 1
**Requirements**: NAV-01, NAV-02, NAV-03, NAV-04, API-01, API-02, API-03, API-04, THEME-01, THEME-02, THEME-03, THEME-04, THEME-05, ANLYT-01, ANLYT-02, ANLYT-03
**Success Criteria** (what must be TRUE):
  1. Five-tab navbar is visible and each tab navigates to its correct content section with a working sidebar
  2. All 6 OpenAPI specs render interactive "Try It" panels where a developer can execute API calls
  3. The site displays 1NCE branding (navy/teal colors, Barlow font, logo) in both light and dark mode
  4. All navigation links across the site resolve without 404s (broken link checker passes)
  5. Analytics scripts (GTM, SimpleAnalytics, PostHog) are present in page source
**Plans:** 3/4 plans executed

Plans:
- [x] 02-01-PLAN.md -- Content reorganization into per-instance directories, multi-instance docs config, five-tab navbar
- [x] 02-02-PLAN.md -- 1NCE brand theme (colors, Barlow font, logo, footer, dark mode) and analytics injection (GTM, SimpleAnalytics, PostHog)
- [x] 02-03-PLAN.md -- OpenAPI plugin integration with 6 specs, API Explorer with Try It panels
- [ ] 02-04-PLAN.md -- Redirect map generation, full build verification, human sign-off

### Phase 3: Infrastructure and Deployment
**Goal**: The site is live at help.1nce.com with automated deployments on merge to main
**Depends on**: Phase 2
**Requirements**: INFRA-01, INFRA-02, INFRA-03, INFRA-04, INFRA-05, INFRA-06, INFRA-07
**Success Criteria** (what must be TRUE):
  1. The site loads at https://help.1nce.com with a valid SSL certificate
  2. Direct URL access to any page works (CloudFront SPA routing handles deep links)
  3. Merging to main triggers an automated build, S3 sync, and CloudFront cache invalidation
  4. The GitHub Actions pipeline authenticates to AWS via OIDC (no stored secrets)
**Plans:** 2 plans

Plans:
- [x] 03-01-PLAN.md -- CloudFormation template (S3, CloudFront, OAC, ACM, Route 53, IAM OIDC) and CloudFront Function for SPA routing
- [x] 03-02-PLAN.md -- GitHub Actions CI/CD pipeline (build, preview deploy, production deploy), Lighthouse CI, smoke test, human review

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Content Conversion | 5/5 | Complete | 2026-03-21 |
| 2. Site Assembly | 3/4 | In Progress|  |
| 3. Infrastructure and Deployment | 2/2 | Complete | 2026-03-21 |
