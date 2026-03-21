# Architecture Research: AI Assistant + GitHub Pages Integration

**Domain:** RAG documentation assistant (AWS Bedrock) + GitHub Pages deployment for existing Docusaurus site
**Researched:** 2026-03-21
**Confidence:** MEDIUM (Bedrock KB patterns well-documented; chat UI is custom work; OpenSearch Serverless cost is the main concern)

## System Overview

### Current Architecture (v1.0 -- no changes needed)

```
GitHub Repo ──push──> GitHub Actions ──s3 sync──> S3 Prod Bucket
                       (build + deploy)            (static HTML/CSS/JS)
                                                        │
                                                   CloudFront CDN
                                                   (SSL + SPA routing)
                                                        │
                                                   help.1nce.com
                                                        │
                                                   Browser
                                                   (Docusaurus SPA)
```

### New Components (v1.1)

```
┌──────────────────────────────────────────────────────────────────────┐
│                     NEW: AI Assistant Backend                        │
│                                                                      │
│  S3 Docs Bucket ──sync──> Bedrock Knowledge Base ──> OpenSearch     │
│  (preprocessed MD)         (data source: S3)     Serverless (vector) │
│                                                        │             │
│  Browser ──POST──> Lambda Function URL ──boto3──> Bedrock Runtime   │
│  (chat widget)      (proxy, no API GW)            RetrieveAndGenerate│
│                          │                        (Claude model)     │
│                     CORS: help.1nce.com                              │
│                     + GH Pages origin                                │
│                     + localhost:3000                                  │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                     NEW: GitHub Pages Deployment                     │
│                                                                      │
│  GitHub Repo ──push──> GH Actions ──deploy-pages──> GitHub Pages    │
│                         (build with                  (preview site)  │
│                          baseUrl: /<repo>/)                │         │
│                                                   <org>.github.io   │
│                                                   /<repo>/          │
└──────────────────────────────────────────────────────────────────────┘
```

### Combined Data Flow Diagram

```
                    ┌──────────────────────┐
                    │   GitHub Repository   │
                    │   (MDX + OpenAPI)     │
                    └──────┬───────┬───────┘
                           │       │
              push to main │       │ push to main
                           │       │
                    ┌──────▼──┐ ┌──▼──────────────┐
                    │ deploy  │ │ deploy-gh-pages  │
                    │ .yml    │ │ .yml (NEW)       │
                    │(exists) │ └──────┬───────────┘
                    └──┬──┬──┘        │
                       │  │     ┌─────▼──────────┐
           ┌───────────┘  │     │  GitHub Pages   │
           │              │     │  (preview)      │
     ┌─────▼──────┐  ┌───▼─────────────┐  └─────────────────┘
     │ S3 Prod    │  │ S3 Docs-KB      │
     │ (static)   │  │ (preprocessed   │
     └─────┬──────┘  │  content)       │
           │         └───────┬─────────┘
     ┌─────▼──────┐          │
     │ CloudFront │    ┌─────▼──────────────┐
     └─────┬──────┘    │ Bedrock Knowledge  │
           │           │ Base + OpenSearch   │
     ┌─────▼──────┐    │ Serverless         │
     │ Browser    │    └─────┬──────────────┘
     │ help.1nce  │          │
     └─────┬──────┘    ┌─────▼──────────────┐
           │           │ Lambda Function URL │
           └──POST────>│ (chat proxy)        │
             /ask      └────────────────────┘
```

## Component Responsibilities

### New Components

| Component | Responsibility | Implementation |
|-----------|----------------|----------------|
| **S3 Docs-KB Bucket** | Store preprocessed documentation for KB ingestion | Separate S3 bucket. Plain Markdown (JSX stripped from MDX). Synced during CI/CD after production deploy. |
| **Bedrock Knowledge Base** | Index docs, vector search, orchestrate RAG | AWS-managed. S3 data source. Auto-provisions OpenSearch Serverless for embeddings. |
| **OpenSearch Serverless** | Vector embeddings storage + similarity search | Auto-provisioned by Bedrock KB. No direct management needed. 2 OCU minimum. |
| **Lambda Function** | Accept chat requests, invoke Bedrock, return responses | Python 3.12. Uses `boto3` `bedrock-agent-runtime` client. Thin proxy -- no business logic beyond validation. |
| **Lambda Function URL** | HTTPS endpoint for chat widget | Auth type: NONE (public). CORS configured for allowed origins. No API Gateway needed. |
| **Chat UI Widget** | Floating chat button + conversation panel | React component injected via Docusaurus `Root` wrapper. Client-side conversation state. |
| **GH Pages Workflow** | Build + deploy Docusaurus to GitHub Pages | Separate workflow file. Builds with `DEPLOY_TARGET=github-pages` env var to set `baseUrl`. |

### Existing Components (unchanged)

| Component | Change Required |
|-----------|-----------------|
| Docusaurus build pipeline | None. Chat widget is a new React component, not a plugin. |
| S3 Prod Bucket | None. |
| CloudFront + OAC | None. |
| `docusaurus.config.ts` | Minor: add env-var-driven `baseUrl`/`url` for GH Pages. |
| Deploy workflow (`deploy.yml`) | Add 2 steps: sync docs to KB bucket + trigger ingestion. |
| 4 docs plugin instances | None. |

## Recommended Project Structure (new files only)

```
src/
├── components/
│   └── AiAssistant/            # NEW: Chat widget
│       ├── AiAssistant.tsx      # Main component (floating button + panel)
│       ├── AiAssistant.module.css
│       ├── ChatMessage.tsx      # Message bubble (user + assistant)
│       ├── CitationLink.tsx     # Renders KB citations as internal doc links
│       └── useChat.ts           # Hook: conversation state, API calls, sessionId
├── theme/
│   └── Root.tsx                 # NEW: Swizzle wrapper to inject AiAssistant globally
infra/
├── ai-assistant/
│   ├── lambda/
│   │   └── handler.py           # Lambda function (Python 3.12)
│   ├── template.yaml            # CloudFormation: Lambda + KB + IAM roles
│   └── sync-docs.sh             # Preprocess MDX -> plain MD, upload to S3
static/
├── .nojekyll                    # NEW: Prevents GitHub Pages Jekyll processing
.github/workflows/
├── deploy.yml                   # MODIFIED: add docs-KB sync steps
└── deploy-gh-pages.yml          # NEW: GitHub Pages deployment
```

### Structure Rationale

- **`src/components/AiAssistant/`**: Isolated React component. Not a Docusaurus plugin -- it has no build-time behavior. Pure runtime UI.
- **`src/theme/Root.tsx`**: Official Docusaurus extension point for wrapping the entire app. Injects the chat widget on every page without modifying existing layouts. Created via `npx docusaurus swizzle @docusaurus/theme-classic Root --wrap`.
- **`infra/ai-assistant/`**: Separates infrastructure-as-code from site code. Python Lambda because `boto3` Bedrock integration is better documented and more idiomatic than the JS SDK for this use case.
- **`static/.nojekyll`**: Required for GitHub Pages. Without it, files starting with `_` (common in Docusaurus builds) are ignored by Jekyll processing.

## Architectural Patterns

### Pattern 1: Lambda Function URL as Thin Proxy (not API Gateway)

**What:** Lambda Function URL provides a dedicated HTTPS endpoint directly on the Lambda function. No API Gateway resource needed.
**When to use:** Single-endpoint APIs with no need for API keys, usage plans, custom domains, or request transformation.
**Trade-offs:**
- Pro: Zero additional cost (Lambda invocation pricing only). Zero additional infrastructure.
- Pro: Built-in CORS configuration. Handles OPTIONS preflight automatically.
- Con: No built-in rate limiting (add WAF later if needed).
- Con: Auto-generated URL (`<id>.lambda-url.<region>.on.aws`), not a custom domain.
- Con: No request/response transformation (fine -- we do not need it).

**Why not API Gateway:** For a single POST endpoint with no auth, API Gateway adds $3.50/million requests + REST API provisioning complexity for zero benefit. Lambda Function URL is free and sufficient.

### Pattern 2: Bedrock Knowledge Base with S3 Data Source

**What:** Store documentation as plain Markdown in S3. Bedrock KB ingests files, chunks them, generates vector embeddings (Titan Embeddings model), and stores them in auto-provisioned OpenSearch Serverless. At query time, `RetrieveAndGenerate` API searches the vector store, retrieves relevant chunks, and passes them to Claude for answer generation.

**When to use:** When you have a static documentation corpus and want managed RAG without building your own pipeline.

**Trade-offs:**
- Pro: Fully managed -- no embedding code, no vector DB ops, no prompt engineering for RAG.
- Pro: Built-in citation support -- responses include S3 URI references to source documents.
- Pro: Multi-turn conversation via `sessionId` parameter.
- Con: OpenSearch Serverless base cost (~$350/month for 2 OCU minimum). This is the dominant cost.
- Con: Ingestion is async (1-5 minutes). Not suitable for real-time content updates.
- Con: Limited control over chunking strategy (configurable but constrained).

**Content preparation required:** MDX files need preprocessing before S3 upload:
1. Strip JSX components and import statements
2. Convert admonitions to plain text (e.g., `:::note` -> `Note:`)
3. Keep frontmatter title/description as document metadata
4. Include API endpoint descriptions extracted from OpenAPI specs
5. Preserve Markdown structure (headings, lists, code blocks)

### Pattern 3: Environment-Aware Dual Deployment

**What:** Use `DEPLOY_TARGET` environment variable to switch Docusaurus configuration between AWS production and GitHub Pages preview at build time.

**When to use:** When deploying the same site to multiple hosts with different URL structures.

**Trade-offs:**
- Pro: Single codebase, multiple targets. No config file duplication.
- Con: Must verify all internal links use Docusaurus conventions (`useBaseUrl`, relative paths) and not hardcoded absolute paths.

**Implementation:**
```typescript
// docusaurus.config.ts
const isGitHubPages = process.env.DEPLOY_TARGET === 'github-pages';

const config: Config = {
  url: isGitHubPages
    ? 'https://<org>.github.io'
    : 'https://help.1nce.com',
  baseUrl: isGitHubPages
    ? '/<repo>/'
    : '/',
  trailingSlash: isGitHubPages ? false : undefined,
  // ... rest unchanged
};
```

## Data Flow

### AI Assistant Query Flow

```
1. User clicks chat button, types: "How do I activate a SIM?"
     │
2. useChat hook sends POST to Lambda Function URL
   Body: { "query": "How do I activate a SIM?", "sessionId": "abc-123" }
     │
3. Lambda validates input (max length, basic sanitization)
     │
4. Lambda calls bedrock-agent-runtime.retrieve_and_generate()
   Params:
     input: { text: query }
     retrieveAndGenerateConfiguration:
       type: KNOWLEDGE_BASE
       knowledgeBaseConfiguration:
         knowledgeBaseId: <KB_ID>
         modelArn: anthropic.claude-3-haiku-...  (fast + cheap)
     sessionId: abc-123  (for multi-turn)
     │
5. Bedrock Knowledge Base internally:
   a. Embeds query via Titan Embeddings
   b. Vector search in OpenSearch Serverless
   c. Retrieves top-K document chunks (default: 5)
   d. Constructs prompt: system instructions + context + query
   e. Invokes Claude model
   f. Returns answer + citations array
     │
6. Lambda maps S3 URIs in citations to site URLs:
   s3://docs-kb/documentation/sim-management/activation.md
   -> /docs/sim-management/activation
     │
7. Lambda returns:
   { "answer": "To activate a SIM...", "citations": [{"title": "SIM Activation", "url": "/docs/sim-management/activation"}], "sessionId": "abc-123" }
     │
8. Chat widget renders answer with clickable citation links
```

### Documentation Sync Flow (added to CI/CD)

```
1. Developer pushes to main
     │
2. Existing deploy workflow runs (build + S3 prod sync + CF invalidation)
     │
3. NEW STEP after production deploy:
   a. Run sync-docs.sh:
      - Read all MDX files from docs/
      - Strip JSX imports and components
      - Write plain Markdown to processed-docs/
   b. aws s3 sync processed-docs/ s3://1nce-docs-knowledge-base/ --delete
     │
4. NEW STEP: Trigger KB re-ingestion:
   aws bedrock-agent start-ingestion-job \
     --knowledge-base-id <KB_ID> \
     --data-source-id <DS_ID>
     │
5. Bedrock re-indexes changed documents asynchronously (1-5 minutes)
```

### GitHub Pages Build Flow

```
1. Push to main (triggers both deploy.yml and deploy-gh-pages.yml)
     │
2. deploy-gh-pages.yml:
   a. Checkout + npm ci
   b. DEPLOY_TARGET=github-pages npm run build
      (sets baseUrl to /<repo>/, url to https://<org>.github.io)
   c. Upload build/ as pages artifact
   d. Deploy to GitHub Pages
     │
3. Site available at https://<org>.github.io/<repo>/
   - AI chat widget works (calls same Lambda, CORS allows this origin)
   - All docs render correctly with adjusted baseUrl
```

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-100 queries/day | Current design is fine. Lambda cold starts (~1-2s) acceptable. |
| 100-1K queries/day | Add Lambda provisioned concurrency (1-2 instances). Monitor Bedrock throttle limits. |
| 1K+ queries/day | Cache frequent queries in DynamoDB (TTL: 1 hour). Add WAF rate limiting on Lambda Function URL. Request Bedrock quota increase if needed. |

### Scaling Priorities

1. **First bottleneck: Lambda cold starts.** Python 3.12 cold starts are ~1-2 seconds. Noticeable on the first message in a session. Fix: provisioned concurrency (1 instance = ~$10/month).
2. **Second bottleneck: Bedrock response latency.** `RetrieveAndGenerate` takes 2-5 seconds (embedding + vector search + Claude generation). Inherent to RAG. Mitigation: use Claude 3 Haiku (fastest) or stream responses if Bedrock supports streaming for this API.
3. **Third bottleneck: Cost, not performance.** OpenSearch Serverless 2 OCU minimum (~$350/month) is the dominant cost. At low volume, this is expensive per-query. Only becomes cost-efficient at high volume.

## Anti-Patterns

### Anti-Pattern 1: Exposing Bedrock Directly to the Browser

**What people do:** Use AWS SDK in the browser with Cognito Identity Pool to call Bedrock directly.
**Why it is wrong:** Exposes model ARN, knowledge base ID, and temporary AWS credentials to the client. No server-side input validation. Prompt injection attacks go directly to the model. Cannot rate-limit effectively.
**Do this instead:** Lambda proxy. All AWS resource identifiers stay server-side. Lambda validates input length and content before forwarding.

### Anti-Pattern 2: Using the Production S3 Bucket as KB Data Source

**What people do:** Point Bedrock KB at the same S3 bucket that hosts the static site build output.
**Why it is wrong:** The production bucket contains compiled HTML, JavaScript bundles, CSS, source maps, and other build artifacts. Bedrock would index `main.abc123.js` alongside actual documentation. Retrieval quality degrades dramatically.
**Do this instead:** Separate S3 bucket with preprocessed plain Markdown content only. Strip all JSX, HTML, and build artifacts.

### Anti-Pattern 3: Building a Custom RAG Pipeline

**What people do:** Set up their own embedding pipeline, manage a vector database, write custom retrieval logic, and engineer RAG prompts.
**Why it is wrong for this project:** ~300 pages of relatively static documentation. Custom pipeline adds significant operational complexity for marginal quality improvement over Bedrock KB's managed approach.
**Do this instead:** Start with Bedrock KB `RetrieveAndGenerate`. If retrieval quality is poor after testing, then consider the `Retrieve` API (vector search only) + custom prompt to Claude via `InvokeModel`. This is an incremental step, not a ground-up rebuild.

### Anti-Pattern 4: Sharing baseUrl Between AWS and GitHub Pages

**What people do:** Deploy to GitHub Pages with `baseUrl: '/'` (same as production) or use path hacks.
**Why it is wrong:** GitHub Pages project sites serve from `/<repo>/`. All asset paths, internal links, and client-side routing break if `baseUrl` does not match the actual URL prefix.
**Do this instead:** Environment variable at build time. `DEPLOY_TARGET=github-pages` sets `baseUrl: '/<repo>/'`.

### Anti-Pattern 5: Using API Gateway for a Single Endpoint

**What people do:** Create a full API Gateway (REST or HTTP API) for one POST route.
**Why it is wrong for this project:** API Gateway adds cost ($3.50/million requests for HTTP API), a separate resource to manage, and complexity (stages, deployments) for zero benefit when you have one endpoint, no auth requirements, and no usage plans.
**Do this instead:** Lambda Function URL. Free. Built-in CORS. If rate limiting is needed later, add WAF or migrate to API Gateway HTTP API (straightforward migration).

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| AWS Bedrock (Claude model) | Via Lambda using boto3 `bedrock-agent-runtime` | Must enable model access + complete Anthropic FTU form in AWS console. Verify Claude availability in target region (eu-central-1). |
| AWS Bedrock (Titan Embeddings) | Used internally by KB for indexing | No direct integration needed. Selected during KB creation. |
| OpenSearch Serverless | Auto-managed by Bedrock KB | No direct access needed. Created and managed by KB setup. |
| GitHub Pages | GitHub Actions `deploy-pages` action | Requires Pages enabled in repo settings. Uses `actions/upload-pages-artifact` + `actions/deploy-pages`. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Chat Widget <-> Lambda | HTTPS POST (JSON), cross-origin | Lambda Function URL handles CORS. No auth tokens. Public endpoint. |
| Lambda <-> Bedrock KB | AWS SDK, IAM role auth, same region | `retrieve_and_generate()` call with KB ID + model ARN. |
| CI/CD <-> S3 Docs-KB | `aws s3 sync`, OIDC role | Add S3 permissions to existing OIDC role. |
| CI/CD <-> Bedrock KB | `aws bedrock-agent start-ingestion-job` | Add `bedrock:StartIngestionJob` to OIDC role. |
| Docusaurus <-> GitHub Pages | `actions/deploy-pages`, separate workflow | Independent from AWS deploy. Different build config. |

## New AWS Resources Required

| Resource | Purpose | Region | Monthly Cost Estimate |
|----------|---------|--------|-----------------------|
| S3 Bucket (docs-kb) | KB content store | eu-central-1 | ~$1 |
| Bedrock Knowledge Base | Managed RAG | eu-central-1 | Per-query (no base cost) |
| OpenSearch Serverless (2 OCU) | Vector store | eu-central-1 | **~$350** (dominant cost) |
| Bedrock Claude 3 Haiku | Generation model | eu-central-1 | ~$0.25/1K queries |
| Bedrock Titan Embeddings | Embedding model | eu-central-1 | ~$0.02/sync cycle |
| Lambda Function | Chat proxy | eu-central-1 | ~$0 (free tier) |
| Lambda Function URL | HTTPS endpoint | eu-central-1 | Free |
| IAM Role (Lambda execution) | Bedrock + S3 access | Global | Free |

**Total estimated: ~$355/month base + per-query Bedrock costs.**

The OpenSearch Serverless 2 OCU minimum is the elephant in the room. Alternatives to reduce cost:
1. **Pinecone Serverless** as vector store (Bedrock KB supports it) -- starts at ~$0 with pay-per-read pricing. Requires Pinecone account.
2. **Aurora PostgreSQL with pgvector** -- if already running Aurora, add a pgvector extension. No additional base cost.
3. **Skip Bedrock KB entirely** -- use the `Retrieve` API against a self-managed vector store, or embed documents at build time and use Claude `InvokeModel` directly with a context window approach (~300 pages may fit in Claude's 200K context if summarized). Significant code overhead.

**Recommendation:** Start with OpenSearch Serverless (simplest setup). Evaluate cost after 1 month. If usage is low and cost is unacceptable, migrate to Pinecone Serverless.

## GitHub Pages Configuration Details

### Required Changes to `docusaurus.config.ts`

```typescript
const isGitHubPages = process.env.DEPLOY_TARGET === 'github-pages';

const config: Config = {
  title: '1NCE Developer Hub',
  url: isGitHubPages ? 'https://<org>.github.io' : 'https://help.1nce.com',
  baseUrl: isGitHubPages ? '/<repo>/' : '/',
  organizationName: '<org>',       // GitHub org (only used for GH Pages)
  projectName: '<repo>',           // Repo name (only used for GH Pages)
  trailingSlash: false,            // Explicit -- prevents GH Pages routing issues
  // ... rest unchanged
};
```

### Workflow File Structure

```yaml
# .github/workflows/deploy-gh-pages.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: DEPLOY_TARGET=github-pages npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: build/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

### CORS for Lambda Function URL

Must allow all deployment targets:

```json
{
  "AllowOrigins": [
    "https://help.1nce.com",
    "https://<org>.github.io",
    "http://localhost:3000"
  ],
  "AllowMethods": ["POST"],
  "AllowHeaders": ["Content-Type"],
  "MaxAge": 300
}
```

## Build Order (Dependency-Driven)

```
Phase 1: GitHub Pages Deployment          (no AWS dependencies)
  ├── Add .nojekyll to static/
  ├── Add env-aware config to docusaurus.config.ts
  ├── Create deploy-gh-pages.yml workflow
  └── Verify: site loads at <org>.github.io/<repo>/

Phase 2: AI Backend Infrastructure        (AWS resources, no code)
  ├── Create S3 docs-kb bucket
  ├── Enable Bedrock model access (Claude + Titan) in eu-central-1
  ├── Create Bedrock Knowledge Base with S3 data source
  ├── Write sync-docs.sh (preprocess MDX -> plain MD)
  ├── Upload initial content + trigger ingestion
  └── Verify: test RetrieveAndGenerate via AWS CLI

Phase 3: Lambda Proxy                     (depends on Phase 2)
  ├── Write handler.py
  ├── Create Lambda + Function URL + IAM role (CloudFormation)
  ├── Configure CORS
  └── Verify: curl Lambda URL -> get Bedrock response

Phase 4: Chat UI Widget                   (depends on Phase 3)
  ├── Build AiAssistant React component
  ├── Swizzle Root.tsx to inject widget globally
  ├── Wire useChat hook to Lambda Function URL
  ├── Style to match 1NCE branding
  ├── Render citations as clickable doc links
  └── Verify: test on localhost, GH Pages, then production

Phase 5: CI/CD Integration                (depends on all above)
  ├── Add docs sync step to deploy.yml
  ├── Add KB ingestion trigger step
  ├── Store Lambda URL + KB IDs as GitHub Actions variables
  └── Verify: push docs change -> KB updates -> chat reflects it
```

**Critical path:** Phase 2 -> Phase 3 -> Phase 4. GitHub Pages (Phase 1) is independent and can run in parallel.

**Riskiest component:** Phase 2 (Bedrock KB setup). OpenSearch Serverless provisioning, model access enablement, and content preprocessing quality all affect downstream phases. Verify retrieval quality early with representative queries.

## Sources

- AWS Bedrock Knowledge Bases documentation (docs.aws.amazon.com/bedrock) -- HIGH confidence
- AWS Bedrock RetrieveAndGenerate API reference -- HIGH confidence
- AWS Lambda Function URLs documentation -- HIGH confidence
- AWS API Gateway CORS documentation -- HIGH confidence
- Docusaurus GitHub Pages deployment guide (docusaurus.io/docs/deployment) -- HIGH confidence
- OpenSearch Serverless pricing (2 OCU minimum at ~$0.24/OCU-hour) -- MEDIUM confidence (pricing may change)
- Bedrock model pricing (Claude 3 Haiku) -- MEDIUM confidence (pricing changes frequently)
- Existing project configuration analyzed: docusaurus.config.ts, deploy.yml, package.json -- HIGH confidence

---
*Architecture research for: AI Assistant (RAG) + GitHub Pages integration with existing Docusaurus + AWS site*
*Researched: 2026-03-21*
