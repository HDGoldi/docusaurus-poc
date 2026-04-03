# Roadmap: 1NCE Developer Hub Migration

## Milestones

- ✅ **v1.0 Migration** — Phases 1-3 (shipped 2026-03-21)
- 🚧 **v1.1 AI Assistant + GitHub Pages Preview** — Phases 4-7 (in progress)
- ✅ **v1.2 Overall Enhancements & Fixing** — Phases 8-9 (shipped 2026-04-02)
- 📋 **v1.3 AI & Search Readiness** — Phases 10-12 (planned)

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

### v1.3 AI & Search Readiness

**Milestone Goal:** Make the Developer Hub discoverable and usable by LLMs, AI coding agents, and search engine crawlers as first-class consumers.

- [ ] **Phase 10: Crawler Foundation** - robots.txt, AI crawler directives, and CloudFront Function fix for static file paths
- [ ] **Phase 11: LLM Discoverability** - llms.txt with product-first organization and build-time link generation
- [ ] **Phase 12: AI Agent Integration** - skill.md and .well-known discovery for AI coding agents

## Phase Details

### Phase 10: Crawler Foundation
**Goal**: Search engines and AI crawlers can discover and index all site content through a properly served robots.txt with sitemap reference
**Depends on**: Phase 9 (existing site infrastructure)
**Requirements**: CRAWL-01, CRAWL-02, CRAWL-03
**Success Criteria** (what must be TRUE):
  1. Visiting help.1nce.com/robots.txt returns a valid robots.txt with Sitemap directive pointing to sitemap.xml
  2. robots.txt includes explicit Allow directives for AI crawler user agents (GPTBot, ClaudeBot, PerplexityBot, Google-Extended)
  3. Requesting a .txt, .md, or .json file through CloudFront returns the actual file content, not the SPA index.html page
  4. Requesting /.well-known/skills/ through CloudFront returns the directory content, not a rewritten SPA path
**Plans**: TBD

### Phase 11: LLM Discoverability
**Goal**: LLMs consuming help.1nce.com/llms.txt get a curated, product-organized overview of all documentation with working links that stay in sync with the site
**Depends on**: Phase 10 (static file serving validated)
**Requirements**: LLM-01, LLM-02, LLM-03, LLM-04
**Success Criteria** (what must be TRUE):
  1. Visiting help.1nce.com/llms.txt returns a document following llmstxt.org spec (H1 title, blockquote summary, H2 sections)
  2. llms.txt organizes content under product-first sections (1NCE Connect, 1NCE OS, API Reference) rather than filesystem paths
  3. Link sections in llms.txt are regenerated on every build, reflecting current pages and API endpoints without manual link maintenance
  4. The preamble text and section structure in llms.txt remain stable across builds (only auto-generated link lists change)
**Plans**: TBD

### Phase 12: AI Agent Integration
**Goal**: AI coding agents can discover and consume structured guidance for working with 1NCE APIs, including auth flows, common patterns, and gotchas
**Depends on**: Phase 10 (CloudFront .well-known path fix)
**Requirements**: AGENT-01, AGENT-02, AGENT-03, AGENT-04
**Success Criteria** (what must be TRUE):
  1. Visiting help.1nce.com/.well-known/skills/default/skill.md returns a markdown document describing 1NCE API auth flows, common multi-step patterns, and known gotchas
  2. Visiting help.1nce.com/.well-known/skills/ returns a JSON index listing available skills
  3. skill.md covers general platform best practices (not limited to individual API endpoints) including error handling and rate limiting guidance
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 10 -> 11 -> 12

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
| 10. Crawler Foundation | v1.3 | 0/0 | Not started | - |
| 11. LLM Discoverability | v1.3 | 0/0 | Not started | - |
| 12. AI Agent Integration | v1.3 | 0/0 | Not started | - |
