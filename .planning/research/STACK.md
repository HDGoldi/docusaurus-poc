# Technology Stack: v1.1 AI Assistant + GitHub Pages Preview

**Project:** 1NCE Developer Hub -- Milestone v1.1
**Researched:** 2026-03-21
**Scope:** NEW capabilities only (AI Assistant + GitHub Pages). Existing stack validated in v1.0.
**Overall Confidence:** HIGH -- AWS Bedrock docs and Docusaurus deployment docs verified via official sources.

---

## New Stack Additions

### AI Assistant -- Backend (AWS Bedrock RAG)

| Technology | Version / ID | Purpose | Why | Confidence |
|------------|-------------|---------|-----|------------|
| AWS Bedrock Knowledge Bases | -- | Managed RAG pipeline | Handles document ingestion, chunking, embedding, vector storage, and retrieval in one managed service. Eliminates building a custom RAG pipeline. Already in the AWS ecosystem the project uses. | HIGH |
| Amazon Titan Text Embeddings V2 | `amazon.titan-embed-text-v2:0` | Embedding model | 8,192 token input, configurable dimensions (1024 default). Native to Bedrock -- no cross-service auth. Cheaper than Cohere alternatives. 1024 dimensions is sufficient for ~298 MDX docs. | HIGH |
| Anthropic Claude Sonnet 4 | `anthropic.claude-sonnet-4-20250514-v1:0` | Generation model for RAG responses | Best cost/quality ratio for documentation Q&A. Sonnet is the workhorse -- Haiku is too terse for documentation answers, Opus is overkill and expensive. Project requirement specifies Claude on Bedrock. | HIGH |
| Amazon OpenSearch Serverless | -- | Vector store | Recommended by Bedrock for Knowledge Bases. Managed via Bedrock console (auto-provisioned). No separate cluster to manage. Supports metadata filtering for scoping answers to specific doc sections. | MEDIUM |
| Amazon S3 (data source bucket) | -- | Document storage for KB ingestion | Upload stripped MDX content to a dedicated S3 bucket. Bedrock Knowledge Bases natively reads from S3. Reuse existing S3 expertise from v1.0 deployment. | HIGH |
| AWS Lambda | `nodejs22.x` runtime | Serverless backend for chat API | Handles chat requests: receives user query, calls Bedrock `RetrieveAndGenerate`, returns response with citations. Node.js 22 aligns with project's Node 20+ requirement and is the current LTS-adjacent runtime on Lambda. | HIGH |
| Lambda Function URL | -- | HTTP endpoint (replaces API Gateway) | Dedicated HTTPS endpoint with built-in CORS support. Simpler than API Gateway for a single-endpoint chat API. No API Gateway costs or configuration. Auth type `NONE` is acceptable since the endpoint is read-only against public documentation. | HIGH |
| @aws-sdk/client-bedrock-agent-runtime | ^3.x (latest) | SDK for RetrieveAndGenerate API | Official AWS SDK v3 client for Bedrock Agent Runtime. Provides `RetrieveAndGenerateCommand` and `RetrieveAndGenerateStreamCommand`. Ships with Lambda `nodejs22.x` runtime (no bundling strictly needed, but pin for reproducibility). | HIGH |

### AI Assistant -- Frontend (Chat UI)

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Custom React component | -- | Chat widget UI (`<AskAI />`) | No mature Docusaurus AI chat plugin exists. Build a lightweight component: floating button, slide-out panel, message list, input field. Follows Docusaurus swizzle patterns. Uses existing React 18+ from the project. ~200-300 lines of code. | HIGH |
| @docusaurus/theme-common | ^3.9.2 (already installed) | Theme hooks (useColorMode, etc.) | Access Docusaurus theme context for dark/light mode styling of the chat panel. Already bundled -- no new dependency. | HIGH |
| Infima CSS custom properties | -- | Chat UI styling | Style the chat widget using existing `--ifm-*` tokens for 1NCE branding consistency. No new CSS library needed. | HIGH |

### GitHub Pages Deployment

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| GitHub Pages | -- | Test/preview deployment | Free, zero-config hosting for PR previews and internal testing. Complements (not replaces) the production AWS deployment. No new dependencies -- built into GitHub. | HIGH |
| GitHub Actions workflow | -- | Build + deploy to `gh-pages` branch | New workflow file (e.g., `deploy-gh-pages.yml`) that builds with GitHub Pages-specific config and pushes to `gh-pages` branch. Reuses existing GitHub Actions expertise. | HIGH |
| `.nojekyll` file in `static/` | -- | Prevent Jekyll processing | GitHub Pages runs Jekyll by default, which strips files starting with `_`. Docusaurus uses `_` prefixed directories. Adding `.nojekyll` prevents this. | HIGH |

### Content Pipeline (Build-time script)

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Custom Node.js script (`scripts/export-for-kb.ts`) | -- | Strip MDX to plain text for KB ingestion | Bedrock Knowledge Bases needs plain text or Markdown, not MDX with JSX components. Write a build script that strips frontmatter metadata, JSX imports, custom components, and outputs clean Markdown for S3 upload. Reuses the project's existing `tsx` + `glob` tooling. | HIGH |

---

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| RAG Pipeline | Bedrock Knowledge Bases (managed) | Custom RAG (LangChain + Pinecone/pgvector) | Over-engineering. Bedrock KB handles chunking, embedding, vector store, and retrieval as a managed service. Custom RAG adds 3-4 more components to maintain for a docs chatbot. |
| Vector Store | OpenSearch Serverless (auto-provisioned) | Amazon S3 Vectors | S3 Vectors is cheaper for infrequent queries but OpenSearch Serverless gives better retrieval quality and is auto-provisioned by Bedrock console. The query volume for a docs chatbot does not justify optimizing for cost over simplicity. |
| Vector Store | OpenSearch Serverless | Pinecone / MongoDB Atlas | Third-party services require separate credentials management (Secrets Manager), cross-service networking, and vendor dependency on top of AWS. No benefit for this use case. |
| Generation Model | Claude Sonnet 4 | Claude Haiku 4.5 | Haiku is cheaper but produces noticeably shorter, less helpful documentation answers. Sonnet's quality justifies the cost for a user-facing feature. Can downgrade to Haiku later if costs are a concern. |
| Generation Model | Claude Sonnet 4 | Claude Opus 4.x | 10-15x more expensive than Sonnet with minimal quality improvement for documentation Q&A. Opus is for complex reasoning, not "find and summarize from docs." |
| Embedding Model | Titan Text Embeddings V2 | Cohere Embed Multilingual | 1NCE docs are English-only. Titan V2 is native to Bedrock (simpler), cheaper, and performs well for English text. |
| Chat API Endpoint | Lambda Function URL | API Gateway HTTP API | API Gateway adds a separate service to configure, monitor, and pay for. Lambda Function URL provides the same HTTPS endpoint with built-in CORS for a single-function API. API Gateway's added value (rate limiting, API keys, custom domains) is unnecessary for a docs chatbot querying public content. |
| Chat API Endpoint | Lambda Function URL | CloudFront + Lambda@Edge | Lambda@Edge has 5-second timeout (too short for RAG generation which takes 2-5s) and cannot call Bedrock from edge locations. |
| Chat UI | Custom React component | Third-party chatbot widget (Intercom, Drift) | SaaS dependency -- contradicts the project's goal of moving off SaaS. Cannot integrate with Bedrock KB natively. |
| Chat UI | Custom React component | Vercel AI SDK chat component | Brings in a Vercel dependency for a single component. The chat UI is simple enough (messages list + input) that a custom component is less code than integrating a third-party library. |
| GitHub Pages | GitHub Actions deploy | `docusaurus deploy` command | The built-in `docusaurus deploy` command works but requires SSH keys and modifies git history directly. A GitHub Actions workflow with `actions/deploy-pages` is cleaner, more transparent, and follows the project's existing CI/CD patterns. |
| Preview Hosting | GitHub Pages | Vercel/Netlify preview deployments | Project constraint -- stay within GitHub/AWS ecosystem. GitHub Pages is free and sufficient for preview/testing. |

---

## What NOT to Add

| Technology | Why Not |
|------------|---------|
| LangChain / LlamaIndex | Over-engineering. Bedrock Knowledge Bases IS the RAG orchestrator. Adding LangChain on top creates two abstraction layers doing the same thing. |
| Pinecone / Weaviate / pgvector | External vector DB adds operational complexity. OpenSearch Serverless is auto-provisioned by Bedrock and requires zero management. |
| Vercel AI SDK | Unnecessary dependency. The Lambda function is ~40 lines of code calling `RetrieveAndGenerateCommand`. No framework needed. |
| Tailwind CSS (for chat UI) | Still conflicts with Infima. Style the chat widget with CSS custom properties like the rest of the site. |
| WebSocket / Server-Sent Events | `RetrieveAndGenerateStreamCommand` supports streaming, but streaming adds complexity to both Lambda (response streaming config) and the client. Start with synchronous responses. RAG answers are typically 2-4 seconds -- acceptable without streaming for v1.1. Add streaming in a future iteration if needed. |
| AWS CloudFormation / CDK for KB | Bedrock Knowledge Bases are best configured via console for initial setup (many clickops-friendly settings like chunking strategy, embedding model selection). Export to CloudFormation after it works. Do not over-engineer the IaC upfront. |
| Algolia DocSearch | Explicitly out of scope per PROJECT.md. AI Assistant is a separate feature from search. |
| Authentication / API keys for chat endpoint | The endpoint queries public documentation. No user data is involved. Rate limiting via Lambda reserved concurrency is sufficient protection against abuse. Adding auth adds friction for no security benefit. |
| Terraform / CDK for Lambda + KB | Console setup first, IaC later. The AI backend is 2-3 AWS resources (Lambda, KB, S3 bucket). Manually create and validate before codifying. |

---

## Architecture Overview (Stack Perspective)

```
User Browser (Docusaurus site)
  |
  |  POST /  (JSON: { query, sessionId? })
  v
Lambda Function URL (HTTPS, CORS enabled, auth: NONE)
  |
  |  RetrieveAndGenerateCommand
  v
AWS Bedrock Knowledge Bases
  |-- Titan V2 Embeddings (query embedding)
  |-- OpenSearch Serverless (vector similarity search)
  |-- Claude Sonnet 4 (response generation with retrieved context)
  |
  v
Response: { answer, citations[], sessionId }
```

### Data Ingestion Pipeline (Offline / CI)

```
MDX docs (298 files in docs/)
  |
  |  scripts/export-for-kb.ts -- strip JSX, imports, frontmatter metadata
  v
Clean Markdown files (in dist-kb/)
  |
  |  aws s3 sync dist-kb/ s3://1nce-kb-data-source/
  v
S3 Bucket (KB data source)
  |
  |  Bedrock KB sync (manual trigger or GitHub Actions post-deploy)
  v
Titan V2 embeddings -> OpenSearch Serverless vector index
```

---

## GitHub Pages Configuration Details

### Problem

The current `docusaurus.config.ts` hardcodes `url: 'https://help.1nce.com'` and `baseUrl: '/'`. GitHub Pages for `HDGoldi/docusaurus-poc` requires `url: 'https://HDGoldi.github.io'` and `baseUrl: '/docusaurus-poc/'`.

### Solution: Environment-Aware Config

```typescript
// docusaurus.config.ts (additions at top)
const isGitHubPages = process.env.DEPLOY_TARGET === 'github-pages';

const config: Config = {
  url: isGitHubPages
    ? 'https://HDGoldi.github.io'
    : 'https://help.1nce.com',
  baseUrl: isGitHubPages
    ? '/docusaurus-poc/'
    : '/',
  organizationName: 'HDGoldi',         // GitHub org/user
  projectName: 'docusaurus-poc',        // repo name
  trailingSlash: false,                 // Explicit -- GitHub Pages adds trailing slashes by default
  // ... rest unchanged
};
```

### Required Static File

Add `static/.nojekyll` (empty file) to prevent Jekyll processing on GitHub Pages.

### GitHub Actions Workflow Pattern

New workflow: `.github/workflows/deploy-gh-pages.yml`
- Trigger: push to `main` or `workflow_dispatch`
- Build with `DEPLOY_TARGET=github-pages npm run build`
- Deploy using `actions/deploy-pages@v4` (official GitHub action)
- Result: site available at `https://HDGoldi.github.io/docusaurus-poc/`

---

## IAM Permissions Required

### Lambda Execution Role

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:RetrieveAndGenerate",
        "bedrock:Retrieve"
      ],
      "Resource": "arn:aws:bedrock:<region>:<account>:knowledge-base/<kb-id>"
    },
    {
      "Effect": "Allow",
      "Action": "bedrock:InvokeModel",
      "Resource": "arn:aws:bedrock:<region>::foundation-model/anthropic.claude-sonnet-4-*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:<region>:<account>:*"
    }
  ]
}
```

### Knowledge Base Service Role

- `s3:GetObject` on the data source bucket
- `aoss:APIAccessAll` on the OpenSearch Serverless collection
- `bedrock:InvokeModel` on `amazon.titan-embed-text-v2:0`

---

## Installation / Setup Summary

### Frontend (zero new npm packages)

The chat UI component uses only React (already installed) and Docusaurus theme hooks (already available). No new `npm install` required for the frontend.

### Backend (Lambda function -- separate directory)

```bash
# Create Lambda function directory at project root
mkdir -p lambda/ask-ai
cd lambda/ask-ai
npm init -y
npm install @aws-sdk/client-bedrock-agent-runtime
```

The Lambda `nodejs22.x` runtime includes AWS SDK v3 globally, but pinning in `package.json` ensures reproducible builds and IDE support during development.

### GitHub Pages (zero new packages)

```bash
# Add .nojekyll to static directory
touch static/.nojekyll
```

### Content Export Script (uses existing dev deps)

```bash
# No new packages -- uses existing tsx, glob, gray-matter from devDependencies
# Add npm script to package.json:
#   "export:kb": "tsx scripts/export-for-kb.ts"
```

---

## Version Verification Checklist

| Component | Expected | Verify With |
|-----------|----------|-------------|
| @aws-sdk/client-bedrock-agent-runtime | ^3.x (latest) | `npm view @aws-sdk/client-bedrock-agent-runtime version` |
| Lambda runtime | nodejs22.x | AWS Console or `aws lambda get-function-configuration` |
| Titan Embed V2 model ID | `amazon.titan-embed-text-v2:0` | AWS Bedrock console > Model access |
| Claude Sonnet 4 model ID | `anthropic.claude-sonnet-4-20250514-v1:0` | AWS Bedrock console > Model access |
| Bedrock model access enabled | Both models | AWS Bedrock console > Model access (must request access) |
| Docusaurus (unchanged) | 3.9.2 | `npm ls @docusaurus/core` |
| GitHub repo | HDGoldi/docusaurus-poc | `git remote -v` |

---

## Cost Estimates (Monthly, Low-Traffic Docs Site)

| Component | Estimated Cost | Notes |
|-----------|---------------|-------|
| Lambda Function URL | ~$0 | Free tier covers 1M requests/month |
| Bedrock KB (OpenSearch Serverless) | ~$25-50/month | Minimum 0.5 OCU for indexing + 0.5 OCU for search. This is the main cost driver. |
| Titan V2 embeddings (ingestion) | <$1 one-time | ~298 docs x ~2K tokens avg = ~600K tokens |
| Titan V2 embeddings (queries) | <$5/month | Per-query embedding at ~100 tokens each |
| Claude Sonnet 4 (generation) | ~$5-20/month | Depends on query volume. ~$3/1M input, ~$15/1M output tokens |
| S3 (data source bucket) | <$1/month | ~298 text files, negligible storage |
| GitHub Pages | Free | Included with GitHub |
| **Total incremental** | **~$35-75/month** | OpenSearch Serverless minimum is the main cost driver |

**Cost optimization note:** If the ~$25-50/month OpenSearch Serverless minimum is too high for a low-traffic chatbot, switch to **Amazon S3 Vectors** as the vector store instead. S3 Vectors charges per-query with no minimum -- better for sporadic usage. Trade-off is slightly lower retrieval quality and no metadata filtering. This is a decision to make during setup, not a blocker.

---

## Bedrock Knowledge Base Configuration Recommendations

### Chunking Strategy

Use **Standard chunking** with default settings (~300 tokens per chunk, sentence boundary awareness). For documentation pages that are well-structured with headers, this produces good retrieval chunks. Semantic chunking costs more (extra model calls) and is not necessary for well-organized docs.

### Supported File Formats for S3 Data Source

Bedrock KB supports: `.txt`, `.md`, `.html`, `.doc`, `.docx`, `.csv`, `.xls`, `.xlsx`, `.pdf`. The export script should output `.md` files -- natively supported without parsing overhead.

### Sync Strategy

Manual sync after each deploy to production. Add to the existing GitHub Actions deploy workflow:
```bash
aws bedrock-agent start-ingestion-job --knowledge-base-id <kb-id> --data-source-id <ds-id>
```

---

## Sources

- AWS Bedrock model IDs -- docs.aws.amazon.com/bedrock/latest/userguide/model-ids.html (verified 2026-03-21) -- HIGH confidence
- AWS Bedrock Knowledge Bases overview -- docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base.html -- HIGH confidence
- AWS Bedrock RetrieveAndGenerate API -- docs.aws.amazon.com/bedrock/latest/APIReference/ -- HIGH confidence
- Amazon Titan Embeddings V2 -- docs.aws.amazon.com/bedrock/latest/userguide/titan-embedding-models.html -- HIGH confidence
- Lambda Function URLs -- docs.aws.amazon.com/lambda/latest/dg/urls-configuration.html -- HIGH confidence
- Lambda Node.js runtimes -- docs.aws.amazon.com/lambda/latest/dg/lambda-nodejs.html (nodejs22.x and nodejs24.x available) -- HIGH confidence
- @aws-sdk/client-bedrock-agent-runtime -- docs.aws.amazon.com/AWSJavaScriptSDK/v3/ -- HIGH confidence
- Docusaurus GitHub Pages deployment -- docusaurus.io/docs/deployment -- HIGH confidence
- OpenSearch Serverless pricing -- training data estimate -- LOW confidence (verify at aws.amazon.com/opensearch-service/pricing/)
- Bedrock chunking strategies -- docs.aws.amazon.com/bedrock/latest/userguide/kb-chunking-parsing.html -- HIGH confidence
- Bedrock vector store options -- docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base-setup.html -- HIGH confidence
