# 1NCE Developer Hub Migration (ReadMe.com to Docusaurus)

## What This Is

A self-hosted Docusaurus documentation site replacing the 1NCE Developer Hub previously hosted on ReadMe.com. The site serves ~298 documentation pages across five navigation tabs, 125 interactive API endpoint pages generated from 6 OpenAPI specs, with 1NCE branding and analytics. Deployed on AWS (S3 + CloudFront) with automated CI/CD via GitHub Actions.

## Core Value

Developers can browse all existing documentation and interactively test API endpoints exactly as they can on the current ReadMe.com-hosted site.

## Requirements

### Validated

- ✓ Automated 12-step conversion pipeline for ReadMe.com Markdown to Docusaurus MDX — v1.0
- ✓ All 298 documentation pages migrated with correct content, images, and formatting — v1.0
- ✓ Five-tab navbar matching help.1nce.com (Documentation, API Explorer, 1NCE Platform, Blueprints & Examples, Terms & Abbreviations) — v1.0
- ✓ Deeply nested sidebar navigation auto-generated from _order.yaml/_category_.json — v1.0
- ✓ Interactive API Explorer with "Try It" panels via docusaurus-openapi-docs plugin — v1.0
- ✓ 6 OpenAPI specs generating 125 endpoint pages with code snippets — v1.0
- ✓ 1NCE branding (navy/teal colors, Barlow font, logo, footer, dark mode) — v1.0
- ✓ GTM, SimpleAnalytics, PostHog analytics with SPA route tracking — v1.0
- ✓ AWS S3 + CloudFront with OAC, ACM certificate, Route 53 DNS — v1.0
- ✓ CloudFront Function for SPA routing (index.html rewrite) — v1.0
- ✓ GitHub Actions CI/CD with OIDC auth, preview deploys, production deploy — v1.0
- ✓ Lighthouse CI and smoke test script for quality gates — v1.0

### Active

- [ ] AI Assistant replicating ReadMe.com "Ask AI" — RAG-style chat grounded in documentation content
- [ ] AWS Bedrock backend (Claude/Anthropic model) for AI chat processing
- [ ] GitHub Pages deployment for test/preview (alongside existing AWS infra)
- ✓ Automated RAG content sync — GitHub Actions workflow triggers KB re-ingestion on doc changes — v1.1 Phase 7
- ✓ CloudFormation resource tagging (environment:dev, component:ai) across all infra templates — v1.1 Phase 7

## Current Milestone: v1.2 Overall Enhancements & Fixing

**Goal:** Align the Docusaurus site's design and navigation with the original 1NCE Developer Hub on ReadMe.com

**Target features:**
- ~~Replace favicon with official 1NCE 120x120 PNG~~ — Done (Phase 8)
- ~~Replace navbar logo with official 1NCE SVG from 1nce.com~~ — Done (Phase 8, already correct)
- ~~Remove dark mode (not readable)~~ — Done (Phase 8)
- ~~Add external navbar links matching original header (1NCE Home, Shop, Portal)~~ — Done (Phase 8)
- Fix Documentation sidebar: merge 1NCE Portal, Platform Services, 1NCE OS, and Blueprints & Examples back into main Documentation sidebar to match original hub structure

### Out of Scope

- Algolia DocSearch / search integration — deferred, requires approval process
- ~~AI Assistant (Ask AI replacement)~~ — moved to Active for v1.1
- Doc versioning (version dropdown) — single version sufficient for now
- Mobile app or native integrations
- Content rewriting or restructuring — migrated as-is
- Offline mode

## Context

Shipped v1.0 with ~42,864 LOC across MDX, TypeScript, and CSS.
Tech stack: Docusaurus 3.9.2, React 18, Rspack bundler, docusaurus-openapi-docs v4.7.1.
Infrastructure: CloudFormation template (13 resources), GitHub Actions CI/CD.

Known limitation: API Explorer "Try It" panels encounter CORS errors when calling 1NCE APIs directly from the browser — this is a server-side CORS configuration issue, not a Docusaurus bug. Documented as accepted deviation.

Human verification pending: deploy CloudFormation stack and confirm site loads at https://help.1nce.com.

## Constraints

- **Deployment**: Must be AWS S3 + CloudFront — no Vercel/Netlify/GitHub Pages
- **Domain**: Must serve from help.1nce.com
- **Content fidelity**: All existing pages and API endpoints must be present and functional
- **Tech stack**: Docusaurus (latest stable), Node.js, MDX

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Docusaurus 3.9.2 with Rspack | Fastest build times for ~400+ pages | ✓ Good — builds in seconds |
| Skip versioning for v1 | Single version simplifies migration | ✓ Good — no complexity |
| Skip search for v1 | Reduces scope; Algolia requires approval | ✓ Good — deferred cleanly |
| Skip AI assistant | Not core to migration | ✓ Good — deferred cleanly |
| AWS S3 + CloudFront | Required infrastructure, cost-effective | ✓ Good |
| Automate ReadMe block conversion | 298 pages make manual conversion impractical | ✓ Good — 12-step pipeline |
| routeBasePath: /docs with root redirect | Clean URL structure, root serves welcome page | ✓ Good |
| Infima CSS custom properties for branding | Idiomatic Docusaurus theming, no Tailwind conflict | ✓ Good |
| path-browserify polyfill | Rspack + postman-code-generators compatibility | ✓ Good — unblocked API docs |
| Two-tier CloudFront cache | Hashed assets 1yr immutable, HTML 10min must-revalidate | ✓ Good |
| Full CF stack in us-east-1 | ACM cert compatibility with CloudFront | ✓ Good |
| S3 OAC (not OAI) | Modern AWS best practice, separate bucket policies | ✓ Good |
| onBrokenLinks: warn | Allows build to complete during development | ⚠️ Revisit — tighten to error for production |

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
*Last updated: 2026-04-02 after Phase 8 (branding & visual alignment) complete*
