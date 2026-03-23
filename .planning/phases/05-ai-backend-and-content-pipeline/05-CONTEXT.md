# Phase 5: AI Backend and Content Pipeline - Context

**Gathered:** 2026-03-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Build a RAG backend for the documentation assistant. A build-time preprocessing script converts MDX docs and OpenAPI specs into pre-chunked plain Markdown with rich metadata. AWS Bedrock Knowledge Base with S3 Vectors ingests the chunks. A Lambda Function URL streams answers with inline citations via SSE. WAF rate limiting protects the endpoint.

</domain>

<decisions>
## Implementation Decisions

### Content Preprocessing
- **D-01:** Structured chunks — pre-chunk by page section (h2/h3 boundaries), one file per chunk with metadata (title, URL, breadcrumb, tags/category, content type)
- **D-02:** Include OpenAPI endpoint pages — each endpoint extracted as its own chunk (method, path, description, parameters, responses)
- **D-03:** Rich metadata per chunk — URL, title, breadcrumb path, tags/category, content type (guide/tutorial/api-reference/glossary)
- **D-04:** Standalone Node script (`scripts/prepare-rag-content.ts`) that outputs to a dedicated folder. Must be integrated into CI/CD pipeline to keep RAG content in sync with published docs.

### Bedrock KB Configuration
- **D-05:** Claude Haiku 4.5 for generation, Titan Embeddings V2 for embeddings — cost-effective for retrieval-grounded docs Q&A
- **D-06:** eu-central-1 (Frankfurt) region — data locality for 1NCE (German company). Model availability must be verified during research.
- **D-07:** No re-chunking by Bedrock — feed pre-chunked files as-is, each file = one chunk in the vector store. Preprocessing script owns granularity.

### Lambda Response Design
- **D-08:** Streaming via Server-Sent Events (SSE) — tokens stream as they arrive from Bedrock. Aligns with CHAT-02 requirement.
- **D-09:** Inline numbered references — citations embedded in answer text as [1][2] markers, with a sources array at the end containing URL, title, and relevance score.
- **D-10:** Honest fallback for unanswerable questions — return "I don't have information about that" with suggested topics. No hallucinated answers.

### Rate Limiting
- **D-11:** CloudFront-level WAF rate-based rules — rate limiting at infrastructure layer, not in Lambda code.
- **D-12:** Conservative threshold: 10 requests per minute per IP.

### Claude's Discretion
- Exact chunk file format (JSON, YAML frontmatter + Markdown, etc.)
- S3 Vectors namespace/prefix strategy
- Lambda runtime choice (Node.js vs Python)
- SSE implementation details (response stream format, keep-alive)
- WAF rule configuration specifics
- Error handling and retry logic within Lambda

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Existing Infrastructure
- `docusaurus.config.ts` — Site config, deployed origins for CORS (help.1nce.com, hdgoldi.github.io)
- `.github/workflows/deploy.yml` — Current AWS production CI/CD pipeline. Must not be broken.
- `.github/workflows/gh-pages.yml` — GitHub Pages workflow. RAG content sync will be added to CI/CD in Phase 7.

### Content Source
- `docs/` — 298 MDX documentation pages to be preprocessed
- `openapi/` — 6 OpenAPI specs generating 125 endpoint pages
- `scripts/` — Existing 12-step conversion pipeline (pattern reference for new preprocessing script)

### Prior Phase Context
- `.planning/phases/04-github-pages-deployment/04-CONTEXT.md` — DEPLOY_TARGET env var pattern, GitHub Pages origin URL for CORS

### Requirements
- `.planning/REQUIREMENTS.md` — CONTENT-01 through CONTENT-03, INFRA-01 through INFRA-04

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `scripts/` directory has 12 existing TypeScript conversion scripts — established pattern for Node.js build-time processing
- `scripts/run-pipeline.ts` — Pipeline runner pattern that could inform RAG preprocessing orchestration
- `src/clientModules/routeTracking.ts` — SPA route tracking, relevant for understanding page URL structure for citation links

### Established Patterns
- TypeScript for all build scripts (`.ts` extension, run via ts-node or similar)
- Config uses `satisfies` type assertions (TypeScript strict patterns)
- DEPLOY_TARGET env var for build-time config switching (from Phase 4)

### Integration Points
- `docs/` directory structure defines breadcrumb paths and URL hierarchy for chunk metadata
- `sidebars.ts` or `_category_.json` files define navigation structure (useful for breadcrumb generation)
- GitHub Actions workflows in `.github/workflows/` — RAG sync will be added in Phase 7, but Lambda deploy may need its own workflow or CloudFormation

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches within the decisions above.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 05-ai-backend-and-content-pipeline*
*Context gathered: 2026-03-23*
