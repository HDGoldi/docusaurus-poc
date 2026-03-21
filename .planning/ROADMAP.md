# Roadmap: 1NCE Developer Hub Migration

## Milestones

- ✅ **v1.0 Migration** — Phases 1-3 (shipped 2026-03-21)
- 🚧 **v1.1 AI Assistant + GitHub Pages Preview** — Phases 4-7 (in progress)

## Phases

<details>
<summary>✅ v1.0 Migration (Phases 1-3) — SHIPPED 2026-03-21</summary>

- [x] Phase 1: Content Conversion (5/5 plans) — completed 2026-03-21
- [x] Phase 2: Site Assembly (5/5 plans) — completed 2026-03-21
- [x] Phase 3: Infrastructure and Deployment (2/2 plans) — completed 2026-03-21

See: `.planning/milestones/v1.0-ROADMAP.md` for full details.

</details>

### 🚧 v1.1 AI Assistant + GitHub Pages Preview (In Progress)

**Milestone Goal:** Add an AI-powered documentation assistant using AWS Bedrock (Claude) with S3 Vectors, and enable GitHub Pages as a lightweight preview deployment.

- [ ] **Phase 4: GitHub Pages Deployment** — Environment-aware builds and automated GitHub Pages deploy
- [ ] **Phase 5: AI Backend and Content Pipeline** — Bedrock KB with S3 Vectors, content preprocessing, and Lambda proxy
- [ ] **Phase 6: Chat UI** — Floating AI assistant widget with streaming responses and citations
- [ ] **Phase 7: CI/CD Integration** — Automated KB sync wired into deploy workflow

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
**Plans**: TBD

Plans:
- [ ] 05-01: TBD
- [ ] 05-02: TBD
- [ ] 05-03: TBD

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
**Plans**: TBD

Plans:
- [ ] 06-01: TBD

### Phase 7: CI/CD Integration
**Goal**: Documentation updates automatically flow through to the AI knowledge base without manual intervention
**Depends on**: Phase 5, Phase 6 (all AI components must be working)
**Requirements**: CICD-01, CICD-02
**Success Criteria** (what must be TRUE):
  1. Pushing a documentation change to main triggers content preprocessing, S3 sync, and Bedrock KB re-ingestion automatically
  2. Existing AWS production deploy workflow continues to function without regressions
**Plans**: TBD

Plans:
- [ ] 07-01: TBD

## Progress

**Execution Order:** Phase 4 → 5 → 6 → 7

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Content Conversion | v1.0 | 5/5 | Complete | 2026-03-21 |
| 2. Site Assembly | v1.0 | 5/5 | Complete | 2026-03-21 |
| 3. Infrastructure and Deployment | v1.0 | 2/2 | Complete | 2026-03-21 |
| 4. GitHub Pages Deployment | v1.1 | 0/1 | Not started | - |
| 5. AI Backend and Content Pipeline | v1.1 | 0/3 | Not started | - |
| 6. Chat UI | v1.1 | 0/1 | Not started | - |
| 7. CI/CD Integration | v1.1 | 0/1 | Not started | - |
