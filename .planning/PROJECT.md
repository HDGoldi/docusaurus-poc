# 1NCE Developer Hub Migration (ReadMe.com to Docusaurus)

## What This Is

A self-hosted Docusaurus documentation site replacing the 1NCE Developer Hub previously hosted on ReadMe.com. The site serves ~298 documentation pages in a single unified Documentation sidebar with 11 sections matching the original hub order, plus 125 interactive API endpoint pages generated from 6 OpenAPI specs, with official 1NCE branding (favicon, logo, light-only mode) and analytics. Deployed on AWS (S3 + CloudFront) with automated CI/CD via GitHub Actions.

## Core Value

Developers can browse all existing documentation and interactively test API endpoints exactly as they can on the current ReadMe.com-hosted site.

## Requirements

### Validated

- ✓ Automated 12-step conversion pipeline for ReadMe.com Markdown to Docusaurus MDX — v1.0
- ✓ All 298 documentation pages migrated with correct content, images, and formatting — v1.0
- ✓ Two-tab navbar (Documentation, API Explorer) + 3 external links — v1.2
- ✓ Unified 11-section Documentation sidebar matching original ReadMe.com hub order — v1.2
- ✓ Interactive API Explorer with "Try It" panels via docusaurus-openapi-docs plugin — v1.0
- ✓ 6 OpenAPI specs generating 125 endpoint pages with code snippets — v1.0
- ✓ 1NCE branding: official favicon, SVG logo, light-only mode, navy/teal colors, Barlow font — v1.0 + v1.2
- ✓ GTM, SimpleAnalytics, PostHog analytics with SPA route tracking — v1.0
- ✓ AWS S3 + CloudFront with OAC, ACM certificate, Route 53 DNS — v1.0
- ✓ CloudFront Function for SPA routing (index.html rewrite) — v1.0
- ✓ GitHub Actions CI/CD with OIDC auth, preview deploys, production deploy — v1.0
- ✓ Lighthouse CI and smoke test script for quality gates — v1.0
- ✓ Official 1NCE favicon (120x120 PNG) — v1.2
- ✓ Dark mode fully removed (light-only, no toggle, no remnant CSS) — v1.2
- ✓ External navbar links for 1NCE Home, Shop, Portal matching original header — v1.2
- ✓ Client-side redirects preserving old /platform/*, /blueprints/*, /terms/* URLs — v1.2

### Active

- [ ] AI Assistant replicating ReadMe.com "Ask AI" — RAG-style chat grounded in documentation content
- [ ] AWS Bedrock backend (Claude/Anthropic model) for AI chat processing
- [ ] GitHub Pages deployment for test/preview (alongside existing AWS infra)
- ✓ llms.txt with product-first organization and build-time link generation — v1.3 Phase 11
- [ ] skill.md for AI coding agents at .well-known/skills/ with discovery index.json
- ✓ robots.txt with AI crawler directives, sitemap reference, and CloudFront .well-known passthrough — v1.3 Phase 10
- ✓ Automated RAG content sync — GitHub Actions workflow triggers KB re-ingestion on doc changes — v1.1 Phase 7
- ✓ CloudFormation resource tagging (environment:dev, component:ai) across all infra templates — v1.1 Phase 7

### Out of Scope

- Algolia DocSearch / search integration — deferred, requires approval process
- Doc versioning (version dropdown) — single version sufficient for now
- Mobile app or native integrations
- Content rewriting or restructuring — migrated as-is
- Offline mode
- Two-tier header layout — Docusaurus single navbar sufficient with external links

## Current Milestone: v1.3 AI & Search Readiness

**Goal:** Make the Developer Hub discoverable and usable by LLMs, AI coding agents, and search engine crawlers as first-class consumers.

**Target features:**
- llms.txt with product-first organization (1NCE Connect, 1NCE OS) — hand-curated structure with build-time generated link sections
- skill.md for AI coding agents — auth flows, common patterns, best practices, gotchas; served at /.well-known/skills/ with discovery index.json
- robots.txt with sitemap.xml reference for search engine crawlers

## Context

Shipped v1.2 with site branding and navigation fully aligned to original ReadMe.com hub.
Tech stack: Docusaurus 3.9.2, React 18, Rspack bundler, docusaurus-openapi-docs v4.7.1.
Infrastructure: CloudFormation template (13 resources), GitHub Actions CI/CD.
Additional: @docusaurus/plugin-client-redirects for backward-compatible URLs.

v1.1 AI phases (4-7) are code-complete but not formally closed — AWS Bedrock deployment needed for end-to-end validation.

Known limitation: API Explorer "Try It" panels encounter CORS errors when calling 1NCE APIs directly from the browser — server-side CORS configuration issue, not a Docusaurus bug.

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
| AWS S3 + CloudFront | Required infrastructure, cost-effective | ✓ Good |
| Automate ReadMe block conversion | 298 pages make manual conversion impractical | ✓ Good — 12-step pipeline |
| routeBasePath: /docs with root redirect | Clean URL structure, root serves welcome page | ✓ Good |
| Infima CSS custom properties for branding | Idiomatic Docusaurus theming, no Tailwind conflict | ✓ Good |
| path-browserify polyfill | Rspack + postman-code-generators compatibility | ✓ Good — unblocked API docs |
| Two-tier CloudFront cache | Hashed assets 1yr immutable, HTML 10min must-revalidate | ✓ Good |
| Full CF stack in us-east-1 | ACM cert compatibility with CloudFront | ✓ Good |
| S3 OAC (not OAI) | Modern AWS best practice, separate bucket policies | ✓ Good |
| onBrokenLinks: warn | Allows build to complete during development | ⚠️ Revisit — tighten to error for production |
| Consolidate 3 plugin instances into preset-classic | Single docs instance simplifies config and sidebar | ✓ Good — unified sidebar with correct ordering |
| @docusaurus/plugin-client-redirects for old URLs | Preserves external links to /platform/*, /blueprints/*, /terms/* | ✓ Good — meta-refresh redirects in production build |
| Config-only dark mode disable | defaultMode light, disableSwitch true, respectPrefersColorScheme false | ✓ Good — minimal code change |
| git mv for content moves | Preserve file history during sidebar restructuring | ✓ Good — clean git blame |

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
*Last updated: 2026-04-04 after Phase 11 completion*
