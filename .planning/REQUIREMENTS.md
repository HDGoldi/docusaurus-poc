# Requirements: 1NCE Developer Hub v1.1

**Defined:** 2026-03-21
**Core Value:** Developers can browse all existing documentation and interactively test API endpoints exactly as they can on the current ReadMe.com-hosted site.

## v1.1 Requirements

Requirements for AI Assistant + GitHub Pages Preview milestone. Each maps to roadmap phases.

### GitHub Pages Deployment

- [x] **DEPLOY-01**: Site builds with environment-aware config (GitHub Pages baseUrl vs AWS root)
- [x] **DEPLOY-02**: GitHub Actions workflow deploys to GitHub Pages on push to main
- [x] **DEPLOY-03**: All existing pages and API docs render correctly on GitHub Pages

### Content Pipeline

- [x] **CONTENT-01**: Build-time script strips MDX/JSX from docs to plain Markdown for RAG ingestion
- [x] **CONTENT-02**: OpenAPI spec content extracted and prepared for knowledge base indexing
- [ ] **CONTENT-03**: Processed content synced to S3 bucket for Bedrock Knowledge Base

### Backend Infrastructure

- [x] **INFRA-01**: AWS Bedrock Knowledge Base configured with S3 Vectors as the vector store
- [x] **INFRA-02**: Lambda Function URL proxies chat requests to Bedrock RetrieveAndGenerate API
- [x] **INFRA-03**: CORS configured for deployed origins (GitHub Pages + help.1nce.com)
- [x] **INFRA-04**: Rate limiting prevents abuse of the AI chat endpoint

### Chat UI

- [ ] **CHAT-01**: Floating chat drawer UI accessible from all pages via global widget
- [ ] **CHAT-02**: Streaming responses render tokens as they arrive
- [ ] **CHAT-03**: Source citations displayed as clickable links to relevant documentation pages
- [ ] **CHAT-04**: Suggested questions shown to help users get started
- [ ] **CHAT-05**: Dark mode support matching existing site theme

### CI/CD Integration

- [ ] **CICD-01**: Knowledge Base content sync integrated into deploy workflow
- [ ] **CICD-02**: Existing AWS production deploy workflow unchanged

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Search

- **SEARCH-01**: Algolia DocSearch integration for full-text search
- **SEARCH-02**: Search results include API endpoint pages

### Advanced AI

- **AI-01**: Multi-turn conversation with session memory
- **AI-02**: AI-powered search integration (hybrid search + AI answers)

## Out of Scope

| Feature | Reason |
|---------|--------|
| OpenSearch Serverless vector store | Too expensive (~$350/mo) for docs assistant use case |
| Algolia DocSearch | Requires approval process, deferred to v2 |
| Doc versioning | Single version sufficient |
| Mobile app | Web-first |
| Content rewriting | Migrated as-is from ReadMe |
| API Gateway | Lambda Function URL is simpler and free for single endpoint |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| DEPLOY-01 | Phase 4 | Complete |
| DEPLOY-02 | Phase 4 | Complete |
| DEPLOY-03 | Phase 4 | Complete |
| CONTENT-01 | Phase 5 | Complete |
| CONTENT-02 | Phase 5 | Complete |
| CONTENT-03 | Phase 5 | Pending |
| INFRA-01 | Phase 5 | Complete |
| INFRA-02 | Phase 5 | Complete |
| INFRA-03 | Phase 5 | Complete |
| INFRA-04 | Phase 5 | Complete |
| CHAT-01 | Phase 6 | Pending |
| CHAT-02 | Phase 6 | Pending |
| CHAT-03 | Phase 6 | Pending |
| CHAT-04 | Phase 6 | Pending |
| CHAT-05 | Phase 6 | Pending |
| CICD-01 | Phase 7 | Pending |
| CICD-02 | Phase 7 | Pending |

**Coverage:**
- v1.1 requirements: 17 total
- Mapped to phases: 17
- Unmapped: 0

---
*Requirements defined: 2026-03-21*
*Last updated: 2026-03-21 after roadmap creation*
