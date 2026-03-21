# Project Research Summary

**Project:** 1NCE Developer Hub — Milestone v1.1 (AI Assistant + GitHub Pages)
**Domain:** RAG documentation assistant on AWS Bedrock + GitHub Pages preview deployment for existing Docusaurus site
**Researched:** 2026-03-21
**Confidence:** MEDIUM-HIGH (backend patterns HIGH; cost model and streaming implementation MEDIUM)

## Executive Summary

This milestone adds two independent features to an existing, production-grade Docusaurus site: an AI documentation assistant powered by AWS Bedrock Knowledge Bases (RAG), and a GitHub Pages deployment for lightweight team previews. The AI assistant is the more complex concern — it requires building a content preprocessing pipeline, provisioning AWS Bedrock infrastructure (Knowledge Base + OpenSearch Serverless + Lambda), and developing a custom React chat widget injected globally via Docusaurus Root swizzling. GitHub Pages is a parallel, low-risk concern solved entirely through environment-variable-driven config and a new GitHub Actions workflow.

The recommended approach is to use AWS Bedrock Knowledge Bases as a fully managed RAG pipeline, avoiding the operational burden of a custom embedding + vector store + retrieval stack. A Lambda Function URL serves as a thin proxy between the static Docusaurus frontend and Bedrock — this is the correct pattern because AWS credentials cannot be embedded in a static site. The dominant cost driver is OpenSearch Serverless (approximately $350/month at the 2 OCU minimum), which makes cost validation a prerequisite decision before committing to the architecture. If that cost is unacceptable for expected query volume, Pinecone Serverless is the next-best alternative with no base cost.

The critical risks are: (1) content quality for the RAG index — raw MDX files must be stripped of JSX/frontmatter before embedding or retrieval quality will be poor; (2) the 125 generated API pages are invisible to the RAG index if only authored MDX files are indexed, creating a major blindspot for the most-queried content on a developer hub; (3) the baseUrl conflict between production (`/`) and GitHub Pages (`/docusaurus_poc/`) that will break all assets if not handled via environment-conditional config. All three risks have clear, well-documented mitigations and must be addressed before development begins.

## Key Findings

### Recommended Stack

The existing Docusaurus + AWS stack requires no new frontend npm dependencies for the chat UI — the component is built with React (already bundled) and styled with Infima CSS custom properties. The AI backend introduces four new AWS resources: a separate S3 bucket for preprocessed doc content, a Bedrock Knowledge Base, an auto-provisioned OpenSearch Serverless collection, and a Lambda function with a Function URL. The Lambda function uses `@aws-sdk/client-bedrock-agent-runtime` in a separate `lambda/ask-ai/` directory, keeping it isolated from the Docusaurus site.

**Core technologies:**
- AWS Bedrock Knowledge Bases — managed RAG pipeline (chunking, embedding, vector storage, retrieval); eliminates need for custom pipeline code
- Amazon Titan Text Embeddings V2 (`amazon.titan-embed-text-v2:0`) — embedding model, native to Bedrock, no cross-service auth needed
- Anthropic Claude Sonnet 4 (`anthropic.claude-sonnet-4-20250514-v1:0`) — generation model, best cost/quality ratio for documentation Q&A
- Amazon OpenSearch Serverless — vector store, auto-provisioned by Bedrock KB; no direct management needed
- Lambda Function URL (Node.js 22.x) — HTTPS endpoint, free, built-in CORS; no API Gateway needed for a single endpoint
- Custom React component (`<AiAssistant />`) — floating chat widget, injected globally via `src/theme/Root.tsx` swizzle; zero new npm packages
- GitHub Pages + `actions/deploy-pages@v4` — zero-cost preview deployment; no new npm dependencies

**What not to add:** LangChain/LlamaIndex (over-engineering atop managed KB), Pinecone/Weaviate (external vendor adds ops burden), Vercel AI SDK (40-line Lambda needs no framework), Tailwind CSS (still conflicts with Infima), WebSockets for streaming (start sync, add streaming if latency is unacceptable), API Gateway (single endpoint, no auth, no usage plans — Lambda Function URL is sufficient).

### Expected Features

**Must have (P1, launch with v1.1):**
- Floating chat button + slide-out drawer — every peer product uses this pattern; page-embedded chat is an anti-pattern that breaks the reading flow
- Streaming responses — non-streaming with 5–10 second blank wait feels broken to users; Bedrock supports `RetrieveAndGenerateStreamCommand`
- Source citations with clickable links — Bedrock KB returns citations automatically; required for user trust on technical docs
- Multi-turn conversation via Bedrock `sessionId` — follow-up questions fail without session context
- Rate limiting — cost protection is non-negotiable before exposing a pay-per-token API publicly
- GitHub Pages workflow with correct baseUrl — automated deploy on push to `main` via `actions/deploy-pages`, env-var-driven config
- Suggested starter questions — zero-cost UX improvement, ships immediately with the chat UI; no backend dependency

**Should have (P2, add after validation):**
- Feedback thumbs up/down — measure answer quality once the assistant is live
- Context-aware page suggestions — pass current page URL as query context to improve retrieval precision
- Dark mode chat panel — inherits Docusaurus theme automatically via `--ifm-*` CSS custom properties

**Defer (v2+):**
- Semantic search replacing Algolia — same embeddings could power site search, but needs separate scoping
- API-aware responses with endpoint deep-links — requires custom prompt engineering + KB metadata enrichment; validate basic RAG quality first
- Multi-language support — only relevant if i18n is added to the docs site itself

**Anti-features (explicitly do not build):** full conversational agent with tool use (security risk, 10x complexity), custom fine-tuned model (RAG with Claude handles doc Q&A without fine-tuning), persistent cross-session chat history (requires user identity + GDPR compliance), voice input (tiny audience for a developer docs site), client-side RAG (embedding models are too large for browser; API keys cannot be in frontend code).

### Architecture Approach

The architecture is a thin serverless proxy pattern: the React chat widget POSTs JSON to a Lambda Function URL, the Lambda calls Bedrock `RetrieveAndGenerate`, and the response (answer + citations array + sessionId) flows back to the client. The critical upstream dependency is a separate S3 bucket containing preprocessed plain Markdown — not the production static site bucket, which contains compiled JS/CSS/HTML that would poison the RAG index. Content preprocessing (stripping MDX JSX, imports, and admonitions) is handled by a build script that runs as a CI/CD step after production deploy, followed by a Bedrock KB ingestion trigger. GitHub Pages is an entirely separate workflow with no shared state with the AWS deployment pipeline.

**Major components:**
1. Content preprocessing script (`scripts/export-for-kb.ts`) — strips MDX to plain Markdown; also parses OpenAPI specs for endpoint descriptions; writes output to `dist-kb/`; uploads to S3 docs-KB bucket
2. Bedrock Knowledge Base + OpenSearch Serverless — managed RAG: ingests S3 content, generates Titan V2 embeddings, handles vector search and Claude generation
3. Lambda Function URL + handler (`lambda/ask-ai/handler.ts`) — validates input, calls `RetrieveAndGenerate`, maps S3 citation URIs to site URLs, returns JSON response
4. `<AiAssistant />` React component — floating button + conversation drawer; injected globally via `src/theme/Root.tsx` swizzle so state persists across page navigations
5. `deploy-gh-pages.yml` GitHub Actions workflow — builds with `DEPLOY_TARGET=github-pages` env var, deploys via `actions/deploy-pages@v4`; independent trigger from the production `deploy.yml`

**Key patterns to follow:**
- Lambda Function URL as thin proxy, not API Gateway — free, built-in CORS, sufficient for single-endpoint API with no auth requirements
- Separate S3 bucket for KB content, not the production static site bucket — critical for retrieval quality
- Environment-variable-driven `baseUrl`/`url` in `docusaurus.config.ts` — single codebase, two deployment targets
- Root-level swizzle (`src/theme/Root.tsx`) for chat widget injection — persists across client-side route transitions

### Critical Pitfalls

1. **baseUrl conflict between production and GitHub Pages** — use `DEPLOY_TARGET=github-pages` env var in `docusaurus.config.ts` to conditionally set `url` and `baseUrl`; never share a build artifact between the two targets. One-time fix that must happen before any dual-deployment work begins.

2. **AWS credentials in client-side code** — Docusaurus is a static site; all build-time env vars are baked into the JS bundle and visible to anyone. The Lambda proxy pattern is mandatory. Use IAM roles on the Lambda function, never access keys in frontend code.

3. **Bedrock model access not enabled in target region** — requires manual console approval + Anthropic FTU form; can take up to 15 minutes and blocks all development until complete. Enable both Claude Sonnet 4 and Titan Embeddings V2 access in `eu-central-1` before writing any backend code. Verify with `aws bedrock-runtime invoke-model` CLI.

4. **Raw MDX fed to the RAG index produces garbage answers** — strip JSX components, import statements, frontmatter YAML, and admonition markers before embedding. Chunk by heading boundaries (200–800 tokens per chunk). Test retrieval precision with 20 representative queries before building any UI.

5. **OpenAPI/API Explorer content invisible to RAG** — the 125 generated API pages are not authored MDX; they are generated at build time from 6 OpenAPI spec files in `specs/`. The content preprocessing script must also parse these specs (endpoint descriptions, parameters, request/response schemas) or the AI assistant will be blind to the most-queried content on a developer hub.

## Implications for Roadmap

The work has one independent track (GitHub Pages) and one sequential track with clear dependencies (infrastructure → content pipeline → Lambda backend → chat UI → CI/CD integration). The phase structure below reflects these constraints and is ordered to validate the riskiest assumptions early.

### Phase 1: GitHub Pages Deployment

**Rationale:** Fully independent of AI work; highest ratio of value to effort (0.5–1 day); delivers a useful artifact for the team immediately; solves the baseUrl conflict that must be resolved anyway before any multi-target build work.
**Delivers:** Preview site at `https://HDGoldi.github.io/docusaurus_poc/` deploying automatically on push to `main`; environment-conditional `docusaurus.config.ts` config; `static/.nojekyll` file committed.
**Addresses:** Automated deploy workflow, accessible preview URL (FEATURES.md table stakes).
**Avoids:** baseUrl conflict (Pitfall 1), `.nojekyll` missing (Pitfall 10), trailingSlash routing issues (Pitfall 15), workflow naming conflicts with existing `deploy.yml` (Pitfall 6), accidental custom domain on GitHub Pages (Pitfall 14).

### Phase 2: Bedrock Prerequisites and Infrastructure

**Rationale:** Model access approval is the single biggest external dependency blocker — it cannot be parallelized with code and has an unpredictable wait time. Infrastructure provisioning (S3 bucket, Knowledge Base, OpenSearch Serverless collection) must complete before Lambda or UI can be integration-tested. Research flags this as the riskiest phase; validate early with CLI test calls before writing application code.
**Delivers:** Working AWS infrastructure: S3 docs-KB bucket, Bedrock Knowledge Base with OpenSearch Serverless vector store, confirmed model access for Claude Sonnet 4 and Titan Embeddings V2 in `eu-central-1`, a test `RetrieveAndGenerate` call succeeding via AWS CLI.
**Uses:** All Bedrock-related stack components from STACK.md; IAM Lambda execution role and KB service role as documented.
**Avoids:** Credential exposure anti-pattern (Pitfall 2), model access blocking all development (Pitfall 3).

### Phase 3: Content Preprocessing Pipeline and RAG Quality Validation

**Rationale:** Content quality is the single biggest determinant of AI assistant quality. The chunking strategy and MDX stripping logic must be solved before the Lambda or chat UI are built, or all downstream testing will be based on flawed embeddings. This phase also forces early resolution of the OpenAPI spec indexing question, which is the most commonly missed scope item for this type of project.
**Delivers:** `scripts/export-for-kb.ts` producing clean Markdown chunks from 298 MDX files + 6 OpenAPI specs; initial KB ingestion completed; retrieval quality validated with 20 representative queries via AWS CLI with >70% precision target.
**Implements:** Content preprocessing pipeline (ARCHITECTURE.md Pattern 2).
**Avoids:** Bad chunking producing garbage answers (Pitfall 4), OpenAPI content blindspot in RAG (Pitfall 9), re-embedding all docs on every deploy (Pitfall 8 — hash-based incremental sync).

### Phase 4: Lambda Proxy Backend

**Rationale:** Depends on Phase 2 (Bedrock KB must exist) and Phase 3 (KB must have quality content). Lambda is the well-documented AWS pattern and is approximately 2–3 days of work. Build before the chat UI so the frontend can test against a real API rather than a mock.
**Delivers:** Lambda Function URL accepting `{ query, sessionId? }` POST, returning `{ answer, citations[], sessionId }`; CORS configured for `help.1nce.com`, GitHub Pages origin, and `localhost:3000`; Lambda reserved concurrency for rate limiting; response streaming enabled.
**Uses:** Lambda Function URL pattern, `@aws-sdk/client-bedrock-agent-runtime` ^3.x, Node.js 22.x runtime.
**Avoids:** CORS blocking chat API calls from the static site (Pitfall 5), cold start latency making chat feel broken (Pitfall 7 — Node.js runtime + streaming), Bedrock throttling (Pitfall 13 — retry logic + exponential backoff), prompt injection (Pitfall 16 — input length limits, structured system prompt).

### Phase 5: Chat UI Component

**Rationale:** Depends on Phase 4 (Lambda must be live for real integration testing, including streaming). This is the most user-visible phase and the most time-intensive (3–5 days estimated). Root swizzling is the required injection pattern — not page-level components — to prevent conversation state from being lost on client-side navigation.
**Delivers:** `<AiAssistant />` floating chat widget injected via `src/theme/Root.tsx`; streaming responses rendered incrementally; citation links pointing to actual doc pages; suggested starter questions in empty state; error handling with retry; dark mode support via `--ifm-*` CSS tokens.
**Addresses:** All P1 chat UI features from FEATURES.md prioritization matrix; suggested questions differentiator shipped at zero cost.
**Avoids:** SSR build crash from browser-only APIs (Pitfall 11 — `BrowserOnly` wrapper, `useEffect` guards), chat state loss on page navigation (Pitfall 12 — Root-level swizzle injection).

### Phase 6: CI/CD Integration and Docs Sync

**Rationale:** Final integration step connecting all components. Adds automated KB sync to the existing production deploy workflow so the RAG index stays current when docs are updated. Also stores the Lambda Function URL as a GitHub Actions variable accessible to the Docusaurus build.
**Delivers:** Modified `deploy.yml` with a docs preprocessing step (`aws s3 sync dist-kb/`) and a Bedrock ingestion trigger (`aws bedrock-agent start-ingestion-job`) after each production deploy; Lambda Function URL stored as GitHub Actions variable/secret; end-to-end verified: push docs change → KB updates → chat reflects updated content.
**Avoids:** Stale RAG index diverging from the deployed documentation.

### Phase Ordering Rationale

- Phase 1 (GitHub Pages) is fully independent and can deliver team value immediately without touching the AI work.
- Phase 2 (Bedrock infrastructure) must precede content and Lambda because resources must exist before they can be tested against.
- Phase 3 (content pipeline) must precede Lambda integration testing — invalid embeddings produce unreliable test results that waste Phase 4 effort.
- Phase 4 (Lambda) must precede the chat UI — mocking the API is insufficient for realistic streaming and citation rendering tests.
- Phase 5 (chat UI) must precede Phase 6 — CI/CD integration is only meaningful once there is a complete feature to keep in sync.
- Phase 6 (CI/CD) is last because it wires together already-validated components; doing it earlier creates noise from half-built integrations.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 2 (Bedrock Infrastructure):** OpenSearch Serverless 2 OCU base cost (~$350/month) needs an explicit cost/benefit decision before provisioning. If expected query volume is low, evaluate Pinecone Serverless as an alternative vector store upfront. This is a go/no-go gate, not an implementation detail.
- **Phase 3 (Content Pipeline):** The approach for indexing OpenAPI spec content (direct spec parsing vs. post-build generated MDX) has no established precedent in this project and needs a concrete decision and proof-of-concept during planning.
- **Phase 4 (Lambda Streaming):** `RetrieveAndGenerateStreamCommand` with Lambda response streaming mode requires specific function configuration (response streaming mode is distinct from standard invocation) that needs verification — confirm this works with Bedrock KB before Phase 5 assumes streaming is available.

Phases with standard patterns (skip research-phase):
- **Phase 1 (GitHub Pages):** Fully documented in Docusaurus deployment guide and in PITFALLS.md. Pattern is mechanical — env var config + new workflow file + `.nojekyll`.
- **Phase 5 (Chat UI):** Standard React component work within existing Docusaurus patterns. Root swizzling is documented. No novel architecture decisions.
- **Phase 6 (CI/CD):** Follows existing `deploy.yml` patterns already in the project. AWS CLI commands are fully documented in ARCHITECTURE.md.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | AWS Bedrock docs verified via official sources on 2026-03-21. All model IDs and Lambda runtime versions confirmed. Frontend adds zero new packages. |
| Features | MEDIUM | User expectations based on competitor analysis (ReadMe Owlbot, Mintlify, GitBook). Competitor feature details from training data — may have evolved. Core P1 features are well-grounded in project requirements. |
| Architecture | MEDIUM | Bedrock KB patterns and Lambda Function URL patterns are HIGH confidence from official docs. OpenSearch Serverless pricing and Lambda response streaming configuration are MEDIUM — pricing changes frequently, streaming config needs hands-on verification. |
| Pitfalls | HIGH | Most pitfalls grounded in official documentation and existing project evidence (CORS issue already documented in `.planning/debug/cors-try-it-panel.md`). RAG chunking best practices are MEDIUM (well-established but empirical, not officially specified). |

**Overall confidence:** MEDIUM-HIGH

### Gaps to Address

- **OpenSearch Serverless cost validation:** The ~$350/month base cost is a training-data estimate. Verify current pricing at `aws.amazon.com/opensearch-service/pricing/` before committing to this vector store. Have the Pinecone Serverless alternative decision ready as a documented fallback with its own trade-offs.
- **Claude Sonnet 4 availability in eu-central-1:** Verify that `anthropic.claude-sonnet-4-20250514-v1:0` is available in `eu-central-1` via the AWS Bedrock console before Phase 2 begins. Some Claude model versions have limited regional availability; have a fallback model ID ready.
- **Lambda response streaming with Bedrock KB:** `RetrieveAndGenerateStreamCommand` support via Lambda Function URL with response streaming enabled requires a proof-of-concept. FEATURES.md marks streaming as a P1 must-have; confirm the technical path before Phase 4 is planned in detail.
- **Exact GitHub repo/org identifiers for baseUrl:** STACK.md references `HDGoldi/docusaurus_poc` but uses placeholders in places. Confirm the exact values (`organizationName`, `projectName`) to hard-code in the environment-conditional config before Phase 1 begins.

## Sources

### Primary (HIGH confidence)
- AWS Bedrock Knowledge Bases documentation — docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base.html (verified 2026-03-21)
- AWS Bedrock model IDs — docs.aws.amazon.com/bedrock/latest/userguide/model-ids.html (verified 2026-03-21)
- AWS Bedrock RetrieveAndGenerate API reference — docs.aws.amazon.com/bedrock/latest/APIReference/
- Amazon Titan Embeddings V2 — docs.aws.amazon.com/bedrock/latest/userguide/titan-embedding-models.html
- AWS Lambda Function URLs — docs.aws.amazon.com/lambda/latest/dg/urls-configuration.html
- AWS Lambda Node.js runtimes — docs.aws.amazon.com/lambda/latest/dg/lambda-nodejs.html
- Docusaurus GitHub Pages deployment guide — docusaurus.io/docs/deployment
- Existing project configuration analyzed directly: `docusaurus.config.ts`, `.github/workflows/deploy.yml`, `package.json`
- Known CORS issue from v1.0: `.planning/debug/cors-try-it-panel.md`

### Secondary (MEDIUM confidence)
- OpenSearch Serverless pricing — training data estimate (verify at aws.amazon.com/opensearch-service/pricing/)
- Bedrock model pricing (Claude Sonnet 4, Titan V2) — training data estimate (verify before cost modeling)
- Lambda cold start latency characteristics — widely documented but exact values vary by runtime/region
- RAG chunking best practices — well-established community patterns from training data

### Tertiary (LOW confidence)
- ReadMe Owlbot feature comparison — docs.readme.com/main/docs/owlbot-ai (may have evolved since training cutoff)
- Mintlify AI and GitBook AI feature parity — training data only, not verified against current products

---
*Research completed: 2026-03-21*
*Ready for roadmap: yes*
