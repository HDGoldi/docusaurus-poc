# Roadmap: 1NCE Developer Hub Migration

## Milestones

- ✅ **v1.0 Migration** — Phases 1-3 (shipped 2026-03-21)
- 🚧 **v1.1 AI Assistant + GitHub Pages Preview** — Phases 4-7 (in progress)
- 📋 **v1.2 Overall Enhancements & Fixing** — Phases 8-9 (planned)

## Phases

<details>
<summary>✅ v1.0 Migration (Phases 1-3) — SHIPPED 2026-03-21</summary>

- [x] Phase 1: Content Conversion (5/5 plans) — completed 2026-03-21
- [x] Phase 2: Site Assembly (5/5 plans) — completed 2026-03-21
- [x] Phase 3: Infrastructure and Deployment (2/2 plans) — completed 2026-03-21

See: `.planning/milestones/v1.0-ROADMAP.md` for full details.

</details>

<details>
<summary>🚧 v1.1 AI Assistant + GitHub Pages Preview (Phases 4-7)</summary>

- [ ] **Phase 4: GitHub Pages Deployment** — Environment-aware builds and automated GitHub Pages deploy
- [ ] **Phase 5: AI Backend and Content Pipeline** — Bedrock KB with S3 Vectors, content preprocessing, and Lambda proxy
- [x] **Phase 6: Chat UI** — Floating AI assistant widget with streaming responses and citations (completed 2026-03-23)
- [x] **Phase 7: CI/CD Integration** — Automated KB sync wired into deploy workflow (completed 2026-03-23)

</details>

### 📋 v1.2 Overall Enhancements & Fixing (Planned)

**Milestone Goal:** Align the Docusaurus site's branding and navigation with the original 1NCE Developer Hub on ReadMe.com — correct logo, favicon, light-only mode, external header links, and a single consolidated Documentation sidebar matching the original hub structure.

- [ ] **Phase 8: Branding & Visual Alignment** — Favicon, logo, dark mode removal, and external navbar links
- [ ] **Phase 9: Sidebar Consolidation & Navigation Restructuring** — Merge plugin instances, unify Documentation sidebar, add redirects for old URLs

## Phase Details

### Phase 4: GitHub Pages Deployment
**Goal**: Developers can preview the documentation site on GitHub Pages alongside the production AWS deployment
**Depends on**: Phase 3 (existing site and CI/CD)
**Requirements**: DEPLOY-01, DEPLOY-02, DEPLOY-03
**Success Criteria** (what must be TRUE):
  1. Site builds successfully with both GitHub Pages baseUrl (`/docusaurus_poc/`) and production root (`/`) from the same codebase
  2. Pushing to main automatically deploys to GitHub Pages without manual intervention
  3. All documentation pages, navigation tabs, and API Explorer pages render correctly on the GitHub Pages URL
**Plans**: 1 plan

Plans:
- [x] 04-01-PLAN.md — Environment-aware config and GitHub Pages workflow

### Phase 5: AI Backend and Content Pipeline
**Goal**: A working RAG backend exists — Bedrock Knowledge Base ingests clean documentation content via S3 Vectors, and a Lambda endpoint answers questions with citations
**Depends on**: Phase 4 (GitHub Pages origin needed for CORS config)
**Requirements**: CONTENT-01, CONTENT-02, CONTENT-03, INFRA-01, INFRA-02, INFRA-03, INFRA-04
**Success Criteria** (what must be TRUE):
  1. Build-time script produces plain Markdown from all 298 MDX docs and 6 OpenAPI specs, stripped of JSX/frontmatter
  2. Bedrock Knowledge Base with S3 Vectors vector store contains indexed documentation content and returns relevant results for test queries
  3. Lambda Function URL accepts a question and returns an answer with source citations from the knowledge base
  4. Lambda endpoint responds with correct CORS headers for help.1nce.com, GitHub Pages origin, and localhost
  5. Rate limiting prevents more than N requests per minute from a single source
**Plans**: 3 plans

Plans:
- [x] 05-01-PLAN.md — Content preprocessing script (MDX stripping + OpenAPI extraction)
- [x] 05-02-PLAN.md — AWS infrastructure template and Lambda handler (Bedrock KB, CloudFront, WAF)
- [x] 05-03-PLAN.md — Deployment scripts (S3 sync + Lambda deploy)

### Phase 6: Chat UI
**Goal**: Developers can ask questions about the documentation from any page and receive AI-generated answers with links to source pages
**Depends on**: Phase 5 (Lambda endpoint must be live)
**Requirements**: CHAT-01, CHAT-02, CHAT-03, CHAT-04, CHAT-05
**Success Criteria** (what must be TRUE):
  1. A floating chat button is visible on every page and opens a slide-out drawer without navigating away
  2. Responses stream token-by-token as they arrive rather than appearing all at once after a delay
  3. Each response includes clickable citation links that navigate to the relevant documentation page
  4. Empty chat state shows suggested starter questions that users can click to ask
  5. Chat widget appearance matches both light and dark mode themes
**Plans**: 1 plan

Plans:
- [x] 06-01-PLAN.md — Chat widget foundation: types, SSE streaming hook, all components, CSS module, Root.tsx wrapper, visual verification

### Phase 7: CI/CD Integration
**Goal**: Documentation updates automatically flow through to the AI knowledge base without manual intervention
**Depends on**: Phase 5, Phase 6 (all AI components must be working)
**Requirements**: CICD-01, CICD-02
**Success Criteria** (what must be TRUE):
  1. Pushing a documentation change to main triggers content preprocessing, S3 sync, and Bedrock KB re-ingestion automatically
  2. Existing AWS production deploy workflow continues to function without regressions
**Plans**: 1 plan

Plans:
- [x] 07-01-PLAN.md — RAG sync workflow and CloudFormation resource tagging

### Phase 8: Branding & Visual Alignment
**Goal**: The site visually matches the original 1NCE Developer Hub — correct favicon, official logo, light-only mode, and cross-navigation links in the header
**Depends on**: Phase 3 (existing Docusaurus site with branding infrastructure)
**Requirements**: BRAND-01, BRAND-02, BRAND-03, NAV-01
**Success Criteria** (what must be TRUE):
  1. Browser tab shows the official 1NCE favicon (120x120 PNG), not the Docusaurus default
  2. Navbar displays the official 1NCE SVG logo from 1nce.com, linking to the site root
  3. No dark mode toggle is visible anywhere on the site, OS-level dark mode preference is ignored, and all pages render in light mode only with no remnant dark CSS
  4. Navbar contains external links for 1NCE Home, 1NCE Shop, and 1NCE Portal that open in new tabs, matching the original hub header
**Plans**: 1 plan

Plans:
- [x] 08-01-PLAN.md — Favicon, dark mode removal, external navbar links, and social card

### Phase 9: Sidebar Consolidation & Navigation Restructuring
**Goal**: The Documentation sidebar and navbar match the original ReadMe.com hub structure — a single Documentation tab with all content sections in the correct order, and old URLs redirect to new locations
**Depends on**: Phase 8 (branding cleanup complete, dark CSS removed before structural audit)
**Requirements**: NAV-02, NAV-03, NAV-04
**Success Criteria** (what must be TRUE):
  1. The Documentation sidebar displays all 11 sections in the original hub order: Introduction, 1NCE Portal, SIM Cards, MCP Server, Connectivity Services, Platform Services, Network Services, 1NCE OS, Troubleshooting, Blueprints & Examples, Terms & Abbreviations
  2. The navbar shows exactly 2 doc tabs (Documentation and API Explorer) plus 3 external links — no separate Platform, Blueprints, or Terms tabs
  3. Visiting any old URL under `/platform/*`, `/blueprints/*`, or `/terms/*` redirects the user to the correct new location under `/docs/*`
  4. The API Explorer tab and all 125 API endpoint pages continue to function with working "Try It" panels after the plugin consolidation
**Plans**: 2 plans

Plans:
- [ ] 09-01-PLAN.md — Content moves and sidebar ordering metadata
- [ ] 09-02-PLAN.md — Plugin cleanup, navbar consolidation, and client-side redirects

## Progress

**Execution Order:** Phase 8 → 9

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Content Conversion | v1.0 | 5/5 | Complete | 2026-03-21 |
| 2. Site Assembly | v1.0 | 5/5 | Complete | 2026-03-21 |
| 3. Infrastructure and Deployment | v1.0 | 2/2 | Complete | 2026-03-21 |
| 4. GitHub Pages Deployment | v1.1 | 0/1 | Not started | - |
| 5. AI Backend and Content Pipeline | v1.1 | 2/3 | In Progress | |
| 6. Chat UI | v1.1 | 1/1 | Complete | 2026-03-23 |
| 7. CI/CD Integration | v1.1 | 1/1 | Complete | 2026-03-23 |
| 8. Branding & Visual Alignment | v1.2 | 0/? | Not started | - |
| 9. Sidebar Consolidation | v1.2 | 0/2 | Not started | - |
