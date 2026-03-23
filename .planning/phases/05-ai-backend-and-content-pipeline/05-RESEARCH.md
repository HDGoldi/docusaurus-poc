# Phase 5: AI Backend and Content Pipeline - Research

**Researched:** 2026-03-23
**Domain:** AWS Bedrock Knowledge Bases, Lambda streaming, content preprocessing, WAF rate limiting
**Confidence:** MEDIUM (newer AWS services like S3 Vectors have limited documentation accessibility)

## Summary

This phase builds a RAG (Retrieval-Augmented Generation) backend for the 1NCE Developer Hub documentation assistant. The work spans three domains: (1) a build-time TypeScript script that converts 293 MDX/MD docs and 6 OpenAPI specs into pre-chunked plain Markdown with metadata, (2) an AWS Bedrock Knowledge Base with S3 Vectors that ingests and indexes those chunks, and (3) a Lambda Function URL that streams answers with citations via SSE.

A critical finding is that **Claude Haiku 4.5 is NOT available in eu-central-1** per the Bedrock model availability table. Claude 3 Haiku IS available in eu-central-1. The user decision D-05 specifies "Claude Haiku 4.5" -- this must be resolved: either use Claude 3 Haiku in eu-central-1, or use a cross-region inference profile, or switch to us-east-1/us-west-2. Titan Embeddings V2 IS confirmed available in eu-central-1.

A second critical finding: **WAF cannot be directly attached to Lambda Function URLs**. WAF supports CloudFront, ALB, API Gateway, AppSync, Cognito, and App Runner -- but not Lambda Function URLs. The decision D-11 says "CloudFront-level WAF" which is correct: a small CloudFront distribution must proxy the Lambda Function URL, with WAF attached to that CloudFront distribution.

**Primary recommendation:** Use a CloudFront-fronted Lambda Function URL architecture. Configure the content preprocessing script as a standalone TypeScript build step. Use S3 Vectors with "no chunking" mode since files are pre-chunked. Resolve the Claude Haiku 4.5 eu-central-1 availability gap before implementation.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Structured chunks -- pre-chunk by page section (h2/h3 boundaries), one file per chunk with metadata (title, URL, breadcrumb, tags/category, content type)
- **D-02:** Include OpenAPI endpoint pages -- each endpoint extracted as its own chunk (method, path, description, parameters, responses)
- **D-03:** Rich metadata per chunk -- URL, title, breadcrumb path, tags/category, content type (guide/tutorial/api-reference/glossary)
- **D-04:** Standalone Node script (`scripts/prepare-rag-content.ts`) that outputs to a dedicated folder. Must be integrated into CI/CD pipeline to keep RAG content in sync with published docs.
- **D-05:** Claude Haiku 4.5 for generation, Titan Embeddings V2 for embeddings -- cost-effective for retrieval-grounded docs Q&A
- **D-06:** eu-central-1 (Frankfurt) region -- data locality for 1NCE (German company). Model availability must be verified during research.
- **D-07:** No re-chunking by Bedrock -- feed pre-chunked files as-is, each file = one chunk in the vector store. Preprocessing script owns granularity.
- **D-08:** Streaming via Server-Sent Events (SSE) -- tokens stream as they arrive from Bedrock. Aligns with CHAT-02 requirement.
- **D-09:** Inline numbered references -- citations embedded in answer text as [1][2] markers, with a sources array at the end containing URL, title, and relevance score.
- **D-10:** Honest fallback for unanswerable questions -- return "I don't have information about that" with suggested topics. No hallucinated answers.
- **D-11:** CloudFront-level WAF rate-based rules -- rate limiting at infrastructure layer, not in Lambda code.
- **D-12:** Conservative threshold: 10 requests per minute per IP.

### Claude's Discretion
- Exact chunk file format (JSON, YAML frontmatter + Markdown, etc.)
- S3 Vectors namespace/prefix strategy
- Lambda runtime choice (Node.js vs Python)
- SSE implementation details (response stream format, keep-alive)
- WAF rule configuration specifics
- Error handling and retry logic within Lambda

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CONTENT-01 | Build-time script strips MDX/JSX from docs to plain Markdown for RAG ingestion | Content preprocessing script pattern, MDX stripping approach, file walker over docs/ directory |
| CONTENT-02 | OpenAPI spec content extracted and prepared for knowledge base indexing | OpenAPI JSON spec parsing, endpoint extraction into individual chunks |
| CONTENT-03 | Processed content synced to S3 bucket for Bedrock Knowledge Base | S3 upload via AWS SDK, prefix strategy for S3 Vectors data source |
| INFRA-01 | AWS Bedrock Knowledge Base configured with S3 Vectors as the vector store | CreateKnowledgeBase API, S3 Vectors storage config, Titan Embeddings V2, no-chunking mode |
| INFRA-02 | Lambda Function URL proxies chat requests to Bedrock RetrieveAndGenerateStream API | Lambda streaming handler pattern, RetrieveAndGenerateStream event types, citation mapping |
| INFRA-03 | CORS configured for deployed origins (GitHub Pages + help.1nce.com) | Lambda Function URL CORS config, CloudFront origin headers |
| INFRA-04 | Rate limiting prevents abuse of the AI chat endpoint | CloudFront + WAF rate-based rule, 60s window with 10 request limit per IP |
</phase_requirements>

## Standard Stack

### Core AWS Services
| Service | Purpose | Why Standard | Confidence |
|---------|---------|--------------|------------|
| Amazon Bedrock Knowledge Bases | RAG orchestration | Managed service -- handles embedding, retrieval, and generation in one API call. No custom vector DB infra. | HIGH |
| S3 Vectors | Vector store | Decision locked. Cost-effective (~$0 at rest, pay per query). No OpenSearch Serverless ($350/mo). Available in eu-central-1. | MEDIUM |
| Lambda Function URL | Chat endpoint | Decision locked. Free, no API Gateway overhead. Supports response streaming with RESPONSE_STREAM invoke mode. | HIGH |
| CloudFront | WAF proxy + caching | Required for WAF attachment. Lambda Function URLs cannot have WAF directly. Also provides geographic routing and caching for CORS preflight. | HIGH |
| AWS WAF | Rate limiting | Rate-based rules at CloudFront layer. Supports 60-second evaluation window with minimum 10-request threshold. | HIGH |
| Titan Text Embeddings V2 | Embedding model | Confirmed available in eu-central-1. 1024 dimensions (default). $0.00002/1K tokens. | HIGH |
| Claude 3 Haiku | Generation model | Available in eu-central-1. Claude Haiku 4.5 NOT available in eu-central-1 -- fallback recommendation. | MEDIUM |

### Build-Time Dependencies
| Library | Purpose | Why | Confidence |
|---------|---------|-----|------------|
| gray-matter | Frontmatter parsing | Already a project pattern (used in migration scripts). Parse and strip YAML frontmatter from MDX files. | HIGH |
| glob | File discovery | Already a project pattern. Find all .md/.mdx files for processing. | HIGH |
| unified + remark-parse + remark-stringify | MDX to plain Markdown | Standard Markdown AST pipeline. Strip JSX nodes, imports, and custom components from MDX. | HIGH |
| @aws-sdk/client-s3 | S3 upload | Upload processed chunks to S3 data source bucket. | HIGH |
| @aws-sdk/client-bedrock-agent | KB management | CreateKnowledgeBase, CreateDataSource, StartIngestionJob APIs. | HIGH |
| @aws-sdk/client-bedrock-agent-runtime | KB querying | RetrieveAndGenerateStream API for Lambda handler. | HIGH |

### Lambda Runtime
| Runtime | Recommendation | Reason |
|---------|---------------|--------|
| Node.js 20.x | **Recommended** | Native streaming support via `awslambda.streamifyResponse`. Project is TypeScript throughout. Bedrock SDK available. No custom runtime needed. Python would require Lambda Web Adapter for streaming. |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| S3 Vectors | OpenSearch Serverless | $350/mo minimum. Overkill for docs assistant with ~500 chunks. |
| RetrieveAndGenerateStream | Retrieve + InvokeModelWithResponseStream | More control over prompt but more code. RAG orchestration becomes custom. |
| CloudFront + WAF | Lambda-level throttling | No WAF support on Function URLs. Could use reserved concurrency but no per-IP control. |
| Claude 3 Haiku (eu-central-1) | Claude Haiku 4.5 (us-east-1) | Better model but cross-region latency + data leaves EU. |

## Architecture Patterns

### Recommended Project Structure
```
scripts/
  prepare-rag-content.ts          # Main preprocessing script (D-04)
  prepare-rag-content/
    strip-mdx.ts                  # MDX/JSX stripping logic
    extract-openapi.ts            # OpenAPI endpoint extraction
    chunk-by-headings.ts          # h2/h3 boundary splitting (D-01)
    generate-metadata.ts          # URL, breadcrumb, tags (D-03)

infra/
  template.yaml                   # Existing CloudFormation (extend)
  rag-stack.yaml                  # New: KB, Lambda, CloudFront, WAF

lambda/
  chat-handler/
    index.ts                      # Lambda streaming handler
    bedrock-client.ts             # RetrieveAndGenerateStream wrapper
    citation-mapper.ts            # Map Bedrock citations to [1][2] format (D-09)
    types.ts                      # Shared types

.rag-content/                     # Gitignored output of prepare-rag-content.ts
  chunks/
    docs/                         # Documentation chunks
    api/                          # API endpoint chunks
  manifest.json                   # Chunk inventory for validation
```

### Pattern 1: Pre-Chunked Content with Metadata Files
**What:** Each chunk is a pair of files: `chunk-id.txt` (plain text) and `chunk-id.txt.metadata.json` (Bedrock metadata format).
**When to use:** When using Bedrock KB "no chunking" mode with S3 data source (D-07).
**Why:** Bedrock expects a `.metadata.json` sidecar file for each document to enable metadata filtering and rich citations.

```
.rag-content/chunks/
  docs-introduction-welcome-001.txt
  docs-introduction-welcome-001.txt.metadata.json
  api-authorization-obtain-access-token.txt
  api-authorization-obtain-access-token.txt.metadata.json
```

Metadata file format (Bedrock convention):
```json
{
  "metadataAttributes": {
    "url": "/docs/introduction-welcome/",
    "title": "Welcome",
    "breadcrumb": "Documentation > Introduction > Welcome",
    "content_type": "guide",
    "category": "introduction",
    "section_heading": "Getting Started"
  }
}
```

### Pattern 2: Lambda Streaming with SSE
**What:** Lambda Function URL with RESPONSE_STREAM invoke mode, wrapping Bedrock RetrieveAndGenerateStream.
**When to use:** For the chat endpoint (INFRA-02, D-08).

```typescript
// lambda/chat-handler/index.ts
import { BedrockAgentRuntimeClient, RetrieveAndGenerateStreamCommand } from '@aws-sdk/client-bedrock-agent-runtime';

const client = new BedrockAgentRuntimeClient({ region: 'eu-central-1' });

export const handler = awslambda.streamifyResponse(
  async (event, responseStream, _context) => {
    const body = JSON.parse(event.body || '{}');
    const question = body.question;

    if (!question) {
      const metadata = { statusCode: 400, headers: { 'Content-Type': 'application/json' } };
      responseStream = awslambda.HttpResponseStream.from(responseStream, metadata);
      responseStream.write(JSON.stringify({ error: 'question is required' }));
      responseStream.end();
      return;
    }

    const metadata = {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    };
    responseStream = awslambda.HttpResponseStream.from(responseStream, metadata);

    const command = new RetrieveAndGenerateStreamCommand({
      input: { text: question },
      retrieveAndGenerateConfiguration: {
        type: 'KNOWLEDGE_BASE',
        knowledgeBaseConfiguration: {
          knowledgeBaseId: process.env.KB_ID,
          modelArn: `arn:aws:bedrock:eu-central-1::foundation-model/anthropic.claude-3-haiku-20240307-v1:0`,
          generationConfiguration: {
            inferenceConfig: {
              textInferenceConfig: {
                maxTokens: 512,
                temperature: 0.1,
              },
            },
          },
          retrievalConfiguration: {
            vectorSearchConfiguration: {
              numberOfResults: 5,
            },
          },
        },
      },
    });

    const response = await client.send(command);
    const citations = [];

    // Stream events from Bedrock
    for await (const event of response.stream) {
      if (event.output) {
        responseStream.write(`data: ${JSON.stringify({ type: 'text', content: event.output.text })}\n\n`);
      }
      if (event.citation) {
        citations.push(event.citation);
      }
    }

    // Send citations at end
    const sources = mapCitationsToSources(citations);
    responseStream.write(`data: ${JSON.stringify({ type: 'sources', sources })}\n\n`);
    responseStream.write('data: [DONE]\n\n');
    responseStream.end();
  }
);
```

### Pattern 3: CloudFront Proxy for WAF
**What:** A dedicated CloudFront distribution in front of the Lambda Function URL, with WAF web ACL attached.
**When to use:** For rate limiting (D-11, D-12, INFRA-04).
**Why:** WAF cannot attach to Lambda Function URLs directly.

```yaml
# In rag-stack.yaml
ChatApiDistribution:
  Type: AWS::CloudFront::Distribution
  Properties:
    DistributionConfig:
      WebACLId: !GetAtt ChatWafWebAcl.Arn
      Origins:
        - Id: LambdaOrigin
          DomainName: !Select [2, !Split ["/", !GetAtt ChatFunction.FunctionUrl]]
          CustomOriginConfig:
            OriginProtocolPolicy: https-only
      DefaultCacheBehavior:
        TargetOriginId: LambdaOrigin
        ViewerProtocolPolicy: redirect-to-https
        CachePolicyId: 4135ea2d-6df8-44a3-9df3-4b5a84be39ad  # CachingDisabled
        OriginRequestPolicyId: b689b0a8-53d0-40ab-baf2-68738e2966ac  # AllViewerExceptHostHeader
        AllowedMethods: [GET, HEAD, OPTIONS, PUT, PATCH, POST, DELETE]

ChatWafWebAcl:
  Type: AWS::WAFv2::WebACL
  Properties:
    Scope: CLOUDFRONT  # Must be CLOUDFRONT scope, deployed in us-east-1
    DefaultAction:
      Allow: {}
    Rules:
      - Name: RateLimitPerIP
        Priority: 1
        Action:
          Block: {}
        Statement:
          RateBasedStatement:
            Limit: 10
            EvaluateWindowSec: 60
            AggregateKeyType: IP
        VisibilityConfig:
          SampledRequestsEnabled: true
          CloudWatchMetricsEnabled: true
          MetricName: ChatRateLimit
```

### Anti-Patterns to Avoid
- **Embedding CORS handling in Lambda code when using Function URL CORS config:** Configure CORS on the Function URL resource, not in the handler. Mixing both causes duplicate header errors.
- **Using default chunking in Bedrock when pre-chunking:** Must explicitly set "no chunking" strategy. Default will re-chunk your already-split files into ~300 token segments.
- **Putting WAF CloudFront in us-east-1 while Lambda is in eu-central-1:** WAF with CLOUDFRONT scope must be in us-east-1, but CloudFront will route to the eu-central-1 Lambda origin. This is correct architecture -- the WAF resource lives in us-east-1, the Lambda stays in eu-central-1.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| MDX stripping | Custom regex | unified + remark-parse + remark-stringify + remark-mdx | AST-based approach handles nested JSX, imports, exports reliably. Regex will miss edge cases. |
| Vector search | Custom embedding + kNN | Bedrock Knowledge Base | Managed embedding, indexing, retrieval. No vector math code. |
| Citation extraction | Custom prompt parsing | Bedrock RetrieveAndGenerateStream citation events | Citations are structured objects with span offsets, not text to parse. |
| Rate limiting | Lambda-level counters | WAF rate-based rule | Per-IP tracking at infrastructure layer. No DynamoDB counter table. |
| SSE formatting | Custom string concatenation | Consistent `data: JSON\n\n` format | Follow SSE spec exactly. The `data:` prefix and double newline are mandatory. |

## Common Pitfalls

### Pitfall 1: Claude Haiku 4.5 Not Available in eu-central-1
**What goes wrong:** Deployment fails because the model ID is not found in the region.
**Why it happens:** Newer Claude models roll out to us-east-1/us-west-2 first. EU regions get them later.
**How to avoid:** Use `anthropic.claude-3-haiku-20240307-v1:0` (confirmed available) or use a cross-region inference profile if Haiku 4.5 is required.
**Warning signs:** `ResourceNotFoundException` when calling RetrieveAndGenerate with the model ARN.

### Pitfall 2: WAF CLOUDFRONT Scope Must Be in us-east-1
**What goes wrong:** CloudFormation fails with "WAFv2 WebACL with CLOUDFRONT scope must be created in us-east-1."
**Why it happens:** WAF rules for CloudFront are global and must be in us-east-1, regardless of where the origin is.
**How to avoid:** Deploy the WAF WebACL + ChatAPI CloudFront distribution as a separate stack in us-east-1, or use a single multi-region stack with us-east-1 as the deployment region.
**Warning signs:** Stack creation fails immediately with region constraint error.

### Pitfall 3: S3 Vectors Metadata Size Limit
**What goes wrong:** Ingestion fails silently for chunks with too much metadata.
**Why it happens:** S3 Vectors has a maximum of 1 KB custom metadata per vector and 35 metadata keys per vector.
**How to avoid:** Keep metadata lean. URL, title, breadcrumb, category, content_type = 5 keys, well under limits. Truncate long breadcrumb paths.
**Warning signs:** Chunks appear missing from query results after ingestion.

### Pitfall 4: Lambda Function URL CORS vs In-Code CORS Conflict
**What goes wrong:** Browser gets duplicate CORS headers, request fails.
**Why it happens:** Function URL CORS config adds headers automatically. If Lambda code also sets `Access-Control-Allow-Origin`, the browser sees the header twice.
**How to avoid:** Use Function URL CORS config for non-streaming responses. For streaming responses where you control headers via `HttpResponseStream.from()`, you may need to handle CORS in code since CloudFront is the actual entry point (not the Function URL directly).
**Warning signs:** Browser console shows "Multiple values in Access-Control-Allow-Origin" error.

### Pitfall 5: Streaming Responses Through CloudFront
**What goes wrong:** CloudFront buffers the SSE stream and delivers it all at once.
**Why it happens:** CloudFront default cache behavior buffers responses.
**How to avoid:** Set `CachePolicyId` to CachingDisabled (`4135ea2d-6df8-44a3-9df3-4b5a84be39ad`) and ensure the origin request policy forwards all headers. CloudFront should pass through streaming responses when caching is disabled.
**Warning signs:** Client receives all tokens at once after a long delay instead of streaming.

### Pitfall 6: OpenAPI Generated MDX Files Are Heavily JSX
**What goes wrong:** The API endpoint MDX files (125 files in docs/api/) are almost entirely JSX components with minimal plain text. The "api" field in frontmatter is a base64-encoded blob.
**Why it happens:** `docusaurus-plugin-openapi-docs` generates MDX files that import and render `@theme/ApiExplorer`, `@theme/MethodEndpoint`, etc. The actual content is in the OpenAPI spec JSON, not in the MDX.
**How to avoid:** For API endpoint chunks (D-02), parse the OpenAPI spec JSON files directly (`specs/*.json`) rather than trying to strip the generated MDX. Extract method, path, description, parameters, and response schemas from the JSON.
**Warning signs:** Chunks contain mostly JSX tags and base64 blobs instead of useful text.

## Code Examples

### MDX Stripping with Unified/Remark
```typescript
// scripts/prepare-rag-content/strip-mdx.ts
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';
import remarkStringify from 'remark-stringify';
import { visit } from 'unist-util-visit';
import matter from 'gray-matter';

function removeMdxNodes() {
  return (tree: any) => {
    // Remove import/export declarations
    tree.children = tree.children.filter(
      (node: any) => !['mdxjsEsm', 'mdxJsxFlowElement', 'mdxJsxTextElement', 'mdxFlowExpression'].includes(node.type)
    );
    // Remove inline JSX elements within paragraphs
    visit(tree, (node: any, index, parent) => {
      if (node.type === 'mdxJsxTextElement' && parent && index !== undefined) {
        parent.children.splice(index, 1);
        return index; // revisit this index
      }
    });
  };
}

export async function stripMdx(content: string): Promise<{ frontmatter: Record<string, any>; plainMarkdown: string }> {
  const { data: frontmatter, content: markdownBody } = matter(content);

  const result = await unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(removeMdxNodes)
    .use(remarkStringify)
    .process(markdownBody);

  return { frontmatter, plainMarkdown: String(result) };
}
```

### Chunk by Heading Boundaries (D-01)
```typescript
// scripts/prepare-rag-content/chunk-by-headings.ts
interface Chunk {
  id: string;
  heading: string;
  headingLevel: number;
  content: string;
  startLine: number;
}

export function chunkByHeadings(markdown: string, docId: string): Chunk[] {
  const lines = markdown.split('\n');
  const chunks: Chunk[] = [];
  let currentChunk: Partial<Chunk> | null = null;
  let contentLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(/^(#{2,3})\s+(.+)/); // h2 or h3
    if (match) {
      // Save previous chunk
      if (currentChunk) {
        currentChunk.content = contentLines.join('\n').trim();
        if (currentChunk.content) chunks.push(currentChunk as Chunk);
      }
      // Start new chunk
      const level = match[1].length;
      const heading = match[2].trim();
      const chunkIndex = String(chunks.length + 1).padStart(3, '0');
      currentChunk = {
        id: `${docId}-${chunkIndex}`,
        heading,
        headingLevel: level,
        startLine: i,
      };
      contentLines = [lines[i]]; // include heading in content
    } else {
      contentLines.push(lines[i]);
    }
  }

  // Save last chunk
  if (currentChunk) {
    currentChunk.content = contentLines.join('\n').trim();
    if (currentChunk.content) chunks.push(currentChunk as Chunk);
  }

  // If no h2/h3 headings found, treat entire doc as one chunk
  if (chunks.length === 0 && markdown.trim()) {
    chunks.push({
      id: `${docId}-001`,
      heading: '',
      headingLevel: 0,
      content: markdown.trim(),
      startLine: 0,
    });
  }

  return chunks;
}
```

### OpenAPI Endpoint Extraction (D-02)
```typescript
// scripts/prepare-rag-content/extract-openapi.ts
import { readFileSync } from 'fs';

interface EndpointChunk {
  id: string;
  method: string;
  path: string;
  summary: string;
  description: string;
  parameters: string;
  responses: string;
  tags: string[];
}

export function extractEndpoints(specPath: string, specName: string): EndpointChunk[] {
  const spec = JSON.parse(readFileSync(specPath, 'utf-8'));
  const chunks: EndpointChunk[] = [];

  for (const [path, methods] of Object.entries(spec.paths || {})) {
    for (const [method, operation] of Object.entries(methods as Record<string, any>)) {
      if (['get', 'post', 'put', 'patch', 'delete'].includes(method)) {
        const opId = operation.operationId || `${method}-${path.replace(/\//g, '-')}`;
        const paramText = (operation.parameters || [])
          .map((p: any) => `- ${p.name} (${p.in}, ${p.required ? 'required' : 'optional'}): ${p.description || ''}`)
          .join('\n');
        const responseText = Object.entries(operation.responses || {})
          .map(([code, resp]: [string, any]) => `- ${code}: ${resp.description || ''}`)
          .join('\n');

        chunks.push({
          id: `api-${specName}-${opId}`,
          method: method.toUpperCase(),
          path,
          summary: operation.summary || '',
          description: operation.description || '',
          parameters: paramText,
          responses: responseText,
          tags: operation.tags || [],
        });
      }
    }
  }

  return chunks;
}
```

### Bedrock Metadata Sidecar File Format
```json
{
  "metadataAttributes": {
    "url": "/docs/connectivity-services/data-services/",
    "title": "Data Services Overview",
    "breadcrumb": "Documentation > Connectivity Services > Data Services",
    "content_type": "guide",
    "category": "connectivity-services"
  }
}
```

The file must be named `{document-filename}.metadata.json` and placed alongside the document file in S3. Bedrock automatically discovers and associates metadata during ingestion.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| OpenSearch Serverless for KB | S3 Vectors | Late 2025 | Massive cost reduction. No $350/mo minimum for vector store. |
| Buffered Lambda responses | Lambda streaming (Function URLs) | 2023 | Enables real-time token streaming without WebSockets. |
| API Gateway + Lambda | Lambda Function URL | 2022 | Simpler, free, direct HTTP. No API Gateway configuration. |
| Custom RAG pipeline | Bedrock RetrieveAndGenerateStream | 2024 | Managed RAG with streaming. No custom embedding/retrieval code. |
| WAF classic | WAFv2 rate-based rules | 2019 | 60-second evaluation windows, per-IP tracking, CloudWatch metrics. |

## Open Questions

1. **Claude Haiku 4.5 in eu-central-1**
   - What we know: Not currently listed in the Bedrock model availability table for eu-central-1. Claude 3 Haiku IS available.
   - What's unclear: Whether it has been added since the docs were last updated, or if a cross-region inference profile could bridge this.
   - Recommendation: Start with Claude 3 Haiku in eu-central-1. Make the model ARN configurable via environment variable so it can be swapped when Haiku 4.5 becomes available. Flag this to the user before planning.

2. **S3 Vectors Query Performance**
   - What we know: S3 Vectors is described as "cost-effective for infrequent queries." The docs assistant may get moderate traffic.
   - What's unclear: Exact latency characteristics under load. Bedrock documentation describes it as suitable for "infrequent queries."
   - Recommendation: Acceptable for a docs assistant. If latency becomes an issue post-launch, migrate to OpenSearch Serverless.

3. **CloudFront Streaming Pass-Through**
   - What we know: CloudFront can pass through streaming responses when caching is disabled.
   - What's unclear: Whether there are edge cases with SSE specifically, or if CloudFront adds buffering.
   - Recommendation: Test during implementation. If CloudFront buffers SSE, consider exposing the Lambda Function URL directly (losing WAF) or using API Gateway WebSocket as fallback.

4. **CloudFormation Stack Regions**
   - What we know: WAF CLOUDFRONT scope must be in us-east-1. Lambda must be in eu-central-1. The existing infra template deploys to us-east-1.
   - What's unclear: Best way to manage cross-region resources in CloudFormation.
   - Recommendation: Create `rag-stack.yaml` as a separate stack. Deploy Lambda + Bedrock KB resources in eu-central-1. Deploy WAF + CloudFront for chat API in us-east-1 (or add to existing template). Use stack outputs/parameters to link them.

## Sources

### Primary (HIGH confidence)
- AWS Bedrock API Reference: RetrieveAndGenerate and RetrieveAndGenerateStream -- full request/response schema with citation structure
- AWS Lambda docs: Response streaming with Function URLs -- handler pattern, `awslambda.streamifyResponse`
- AWS WAF docs: Rate-based rule high-level settings -- 60s window, minimum 10 requests, per-IP aggregation
- AWS Bedrock model availability table -- eu-central-1 model list verified
- Project codebase: docusaurus.config.ts, specs/*.json, docs/ directory structure, scripts/ patterns, infra/template.yaml

### Secondary (MEDIUM confidence)
- AWS Bedrock KB chunking strategies -- no-chunking mode confirmed, metadata file format partially documented
- S3 Vectors vector store setup -- dimensions, distance metric, metadata limits from setup docs
- Lambda Function URL CORS -- AllowOrigins, AllowMethods configuration from Lambda docs

### Tertiary (LOW confidence)
- CloudFront SSE streaming pass-through behavior -- based on general CloudFront caching-disabled behavior, not SSE-specific testing
- S3 Vectors query latency characteristics -- "infrequent queries" descriptor from docs, no benchmark data

## Metadata

**Confidence breakdown:**
- Content preprocessing: HIGH -- standard Node.js/unified patterns, project already has 12 TypeScript conversion scripts
- Bedrock Knowledge Base: MEDIUM -- S3 Vectors is a newer service, some docs inaccessible, but API reference is solid
- Lambda streaming: HIGH -- well-documented pattern with Node.js native support
- WAF rate limiting: HIGH -- mature service, clear configuration, verified minimum thresholds
- CloudFront proxy for WAF: MEDIUM -- standard pattern but SSE pass-through not verified
- Model availability: HIGH -- verified against Bedrock regions table

**Research date:** 2026-03-23
**Valid until:** 2026-04-07 (14 days -- AWS services evolve; model availability may change)
