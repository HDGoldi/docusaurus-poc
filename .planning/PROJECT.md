# 1NCE Developer Hub Migration (ReadMe.com to Docusaurus)

## What This Is

A migration of the 1NCE Developer Hub (help.1nce.com) from ReadMe.com to a self-hosted Docusaurus site deployed on AWS (S3 + CloudFront). The site contains ~120-150 documentation pages across five navigation tabs and ~40-50 interactive API endpoints spread across multiple OpenAPI specs. The goal is to replicate the existing experience — including the interactive API Explorer — while eliminating SaaS licensing costs.

## Core Value

Developers can browse all existing documentation and interactively test API endpoints exactly as they can on the current ReadMe.com-hosted site.

## Requirements

### Validated

- [x] AWS deployment: S3 static hosting + CloudFront CDN with OAC — Validated in Phase 3: Infrastructure and Deployment
- [x] SSL via ACM + Route 53 DNS for help.1nce.com — Validated in Phase 3: Infrastructure and Deployment
- [x] CloudFront Function for SPA routing (index.html rewrite) — Validated in Phase 3: Infrastructure and Deployment
- [x] GitHub Actions CI/CD pipeline with OIDC auth for automated deploy on merge to main — Validated in Phase 3: Infrastructure and Deployment

### Active

- [ ] Automated conversion of ReadMe.com Markdown (magic blocks, callouts) to Docusaurus MDX/Admonitions
- [ ] All ~120-150 documentation pages migrated with correct content and images
- [ ] Five-tab navbar matching current help.1nce.com structure (Documentation, API Explorer, 1NCE Platform, Blueprints & Examples, Terms & Abbreviations)
- [ ] Deeply nested sidebar navigation recreated for each tab (multiple sidebars)
- [ ] Interactive API Explorer with "Try It" functionality via docusaurus-openapi-docs plugin
- [ ] Multiple OpenAPI specs integrated and generating endpoint pages with code snippets
- [ ] 1NCE branding applied (colors, logos, fonts matched from current site)
- [ ] Dark mode support with brand-consistent theming

### Out of Scope

- Algolia DocSearch / search integration — deferred, not needed for initial launch
- AI Assistant (Ask AI replacement) — deferred
- Doc versioning (V1.0 dropdown) — single version sufficient for now
- Mobile app or native integrations
- Content rewriting or restructuring — migrate as-is first

## Context

- Content is fully exported from ReadMe.com (Markdown files, multiple OpenAPI specs, images all available)
- ReadMe.com uses proprietary "magic blocks" (`[block:callout]`, etc.) that need programmatic conversion to Docusaurus admonitions (`:::note`, `:::warning`)
- The `docusaurus-openapi-docs` plugin (PaloAltoNetworks) handles interactive API rendering
- Current site has a dark navy/teal color scheme — will be matched by inspecting current site CSS
- A community tool `holistics/readme-exporter` may have been used for initial export
- Priority is speed: automate conversion scripts, get functional site first, then polish

## Constraints

- **Deployment**: Must be AWS S3 + CloudFront — no Vercel/Netlify/GitHub Pages
- **Domain**: Must serve from help.1nce.com
- **Content fidelity**: All existing pages and API endpoints must be present and functional
- **Tech stack**: Docusaurus (latest stable), Node.js, MDX

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Skip versioning for v1 | Single version simplifies migration; can add later | — Pending |
| Skip search for v1 | Reduces scope; Algolia requires approval process anyway | — Pending |
| Skip AI assistant | Not core to migration; can layer on post-launch | — Pending |
| AWS S3 + CloudFront | Required infrastructure — cost-effective for static site | — Pending |
| Automate ReadMe block conversion | ~120-150 pages make manual conversion impractical | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-21 after Phase 3 completion — infrastructure and CI/CD pipeline defined*
