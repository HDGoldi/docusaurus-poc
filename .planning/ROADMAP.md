# Roadmap: 1NCE Developer Hub Migration

## Milestones

- ✅ **v1.0 Migration** — Phases 1-3 (shipped 2026-03-21)
- 🚧 **v1.1 AI Assistant + GitHub Pages Preview** — Phases 4-7 (in progress)
- ✅ **v1.2 Overall Enhancements & Fixing** — Phases 8-9 (shipped 2026-04-02)
- ✅ **v1.3 AI & Search Readiness** — Phases 10-12 (shipped 2026-04-04)
- 🚧 **v1.4 Client-Side Search** — Phases 13-15 (in progress)

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

- [x] **Phase 4: GitHub Pages Deployment** (1/1 plans) — completed
- [x] **Phase 5: AI Backend and Content Pipeline** (3/3 plans) — completed
- [x] **Phase 6: Chat UI** (1/1 plans) — completed 2026-03-23
- [x] **Phase 7: CI/CD Integration** (1/1 plans) — completed 2026-03-23

**Note:** v1.1 phases are code-complete but milestone was not formally closed. AI backend (Phase 5) requires AWS deployment to validate end-to-end.

</details>

<details>
<summary>✅ v1.2 Overall Enhancements & Fixing (Phases 8-9) — SHIPPED 2026-04-02</summary>

- [x] Phase 8: Branding & Visual Alignment (1/1 plans) — completed 2026-04-02
- [x] Phase 9: Sidebar Consolidation & Navigation Restructuring (2/2 plans) — completed 2026-04-02

See: `.planning/milestones/v1.2-ROADMAP.md` for full details.

</details>

<details>
<summary>✅ v1.3 AI & Search Readiness (Phases 10-12) — SHIPPED 2026-04-04</summary>

- [x] Phase 10: Crawler Foundation (1/1 plans) — completed 2026-04-03
- [x] Phase 11: LLM Discoverability (1/1 plans) — completed 2026-04-04
- [x] Phase 12: AI Agent Integration (1/1 plans) — completed 2026-04-04

See: `.planning/milestones/v1.3-ROADMAP.md` for full details.

</details>

### 🚧 v1.4 Client-Side Search (In Progress)

**Milestone Goal:** Developers can instantly find any documentation page, API endpoint page, or in-page content via a zero-cost client-side search bar.

- [ ] **Phase 13: Search Plugin & Core Indexing** - Install search plugin, validate Rspack compatibility, index all 423 pages across both docs instances
- [ ] **Phase 14: Search UI Branding & Polish** - Style search overlay to 1NCE branding, add result highlighting, optimize index size
- [ ] **Phase 15: Deployment & Verification** - Cache-busted index filenames, smoke test for search index, deploy pipeline validation

## Phase Details

### Phase 13: Search Plugin & Core Indexing
**Goal**: Users can search across all documentation and API pages from the navbar and navigate to results
**Depends on**: Phase 12
**Requirements**: SRCH-01, SRCH-02, SRCH-03, SRCH-04, UI-01, UI-03, UI-04, UI-06
**Success Criteria** (what must be TRUE):
  1. User sees a search bar in the main navbar (right side, next to Terms and Abbreviations)
  2. User can type a query and see matching results from both documentation pages and API endpoint pages
  3. User can search for in-page content (headings, paragraphs, code blocks) and find matches
  4. User can click a search result and navigate directly to the correct page (both /docs/ and /api/ paths)
  5. User can open search with Cmd/K (macOS) or Ctrl/K (Windows/Linux)
**Plans**: TBD

Plans:
- [ ] 13-01: TBD

### Phase 14: Search UI Branding & Polish
**Goal**: Search overlay matches 1NCE branding and provides a polished user experience with highlighted matches
**Depends on**: Phase 13
**Requirements**: UI-02, UI-05, UI-07
**Success Criteria** (what must be TRUE):
  1. Search overlay has a darkened background behind it, consistent with modal patterns
  2. Search overlay uses 1NCE navy/teal colors, Barlow font, and light-only mode (no dark mode bleed even with OS dark mode enabled)
  3. Matching search terms are highlighted in the results list so users can scan relevance
**Plans**: TBD
**UI hint**: yes

Plans:
- [ ] 14-01: TBD

### Phase 15: Deployment & Verification
**Goal**: Search index deploys reliably through the existing S3/CloudFront pipeline with cache-busting and automated verification
**Depends on**: Phase 14
**Requirements**: DEPL-01, DEPL-02
**Success Criteria** (what must be TRUE):
  1. Search index files use hashed filenames so CloudFront serves fresh indexes after every deploy
  2. Smoke test script verifies the search index URL returns HTTP 200 after deploy to staging
**Plans**: TBD

Plans:
- [ ] 15-01: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 13 → 14 → 15

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Content Conversion | v1.0 | 5/5 | Complete | 2026-03-21 |
| 2. Site Assembly | v1.0 | 5/5 | Complete | 2026-03-21 |
| 3. Infrastructure and Deployment | v1.0 | 2/2 | Complete | 2026-03-21 |
| 4. GitHub Pages Deployment | v1.1 | 1/1 | Complete | - |
| 5. AI Backend and Content Pipeline | v1.1 | 3/3 | Complete | - |
| 6. Chat UI | v1.1 | 1/1 | Complete | 2026-03-23 |
| 7. CI/CD Integration | v1.1 | 1/1 | Complete | 2026-03-23 |
| 8. Branding & Visual Alignment | v1.2 | 1/1 | Complete | 2026-04-02 |
| 9. Sidebar Consolidation | v1.2 | 2/2 | Complete | 2026-04-02 |
| 10. Crawler Foundation | v1.3 | 1/1 | Complete | 2026-04-03 |
| 11. LLM Discoverability | v1.3 | 1/1 | Complete | 2026-04-04 |
| 12. AI Agent Integration | v1.3 | 1/1 | Complete | 2026-04-04 |
| 13. Search Plugin & Core Indexing | v1.4 | 0/0 | Not started | - |
| 14. Search UI Branding & Polish | v1.4 | 0/0 | Not started | - |
| 15. Deployment & Verification | v1.4 | 0/0 | Not started | - |
