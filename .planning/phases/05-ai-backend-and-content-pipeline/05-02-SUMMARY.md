---
phase: 05-ai-backend-and-content-pipeline
plan: 02
subsystem: backend-infrastructure
tags: [aws, bedrock, lambda, cloudformation, rag, sse, waf]
dependency_graph:
  requires: [05-01]
  provides: [infra/rag-stack.yaml, lambda/chat-handler/]
  affects: [05-03, 06-01, 07-01]
tech_stack:
  added: [aws-bedrock-kb, s3-vectors, lambda-function-url, cloudfront, waf, sse-streaming]
  patterns: [two-region-deployment, response-streaming, citation-mapping, rate-limiting]
key_files:
  created:
    - infra/rag-stack.yaml
    - lambda/chat-handler/index.ts
    - lambda/chat-handler/citation-mapper.ts
    - lambda/chat-handler/types.ts
    - lambda/chat-handler/package.json
    - lambda/chat-handler/tsconfig.json
  modified: []
decisions:
  - S3 Vectors for Bedrock KB storage (cost-effective vs OpenSearch Serverless)
  - Two-region CloudFormation split: eu-central-1 for Bedrock+Lambda, us-east-1 for CloudFront+WAF
  - Claude 3 Haiku as default model (Haiku 4.5 not yet available in eu-central-1)
  - Lambda Function URL with RESPONSE_STREAM over API Gateway (simpler, free)
  - CORS handled by Lambda Function URL config and CloudFront response headers policy (not in-code)
  - WAF rate limit at 10 req/min per IP with 60-second evaluation window
metrics:
  duration: ~15min
  completed: "2026-03-23"
  tasks_completed: 3
  tasks_total: 3
requirements: [INFRA-01, INFRA-02, INFRA-03, INFRA-04]
---

# Phase 5 Plan 2: AWS Infrastructure Template and Lambda Handler Summary

CloudFormation template and Lambda handler for RAG chat backend -- Bedrock KB with S3 Vectors and Titan Embeddings V2, streaming Lambda Function URL with citation mapping, CloudFront proxy with WAF rate limiting at 10 req/min per IP.

## What Was Built

### Lambda Handler (`lambda/chat-handler/`)

- **index.ts**: Streaming Lambda handler using `awslambda.streamifyResponse` that calls Bedrock `RetrieveAndGenerateStreamCommand`, streams SSE events (`text`, `sources`, `error`, `done`), and returns honest fallback for unanswerable questions (D-10)
- **citation-mapper.ts**: Maps Bedrock citation references to numbered `[1][2]` format with URL, title, and relevance score (D-09)
- **types.ts**: Shared TypeScript interfaces for `ChatRequest`, `SSEEvent`, `Source`, `BedrockCitation`
- **package.json**: ESM module with esbuild bundling for Node 20 Lambda, externalizing `@aws-sdk/*`
- **tsconfig.json**: ES2022 target with bundler module resolution

### CloudFormation Template (`infra/rag-stack.yaml`)

Single template with two deployment sections:

**eu-central-1 section (primary):**
- `RagContentBucket` -- S3 bucket for pre-chunked RAG content with versioning enabled
- `BedrockKBRole` -- IAM role for Bedrock with S3 read and Titan Embeddings invoke permissions
- `KnowledgeBase` -- Bedrock KB with S3_VECTORS storage and Titan Embed Text V2 (D-06, D-07)
- `KnowledgeBaseDataSource` -- S3 data source with `ChunkingStrategy: NONE` (pre-chunked content)
- `ChatFunctionRole` -- IAM role with RetrieveAndGenerate and InvokeModelWithResponseStream permissions
- `ChatFunction` -- Lambda function (Node 20, 256MB, 30s timeout) with KB_ID and MODEL_ARN env vars
- `ChatFunctionUrl` -- Function URL with RESPONSE_STREAM invoke mode and CORS for all origins
- `ChatFunctionUrlPermission` -- Public invoke permission for Function URL

**us-east-1 section (edge resources, documented for separate deployment):**
- `ChatApiResponseHeadersPolicy` -- CloudFront CORS headers for help.1nce.com, hdgoldi.github.io, localhost:3000
- `ChatApiDistribution` -- CloudFront distribution proxying Lambda Function URL with caching disabled
- `ChatWafWebAcl` -- WAF WebACL with rate-based rule: 10 requests per 60 seconds per IP (D-11, D-12)

## Tasks Completed

| Task | Name | Commit | Key Files |
|------|------|--------|-----------|
| 1 | Lambda handler with SSE streaming and citation mapping | 5fc303d | lambda/chat-handler/*.ts, package.json, tsconfig.json |
| 2 | CloudFormation template for Bedrock KB, Lambda, CloudFront, WAF | c1b33d1 | infra/rag-stack.yaml |
| 3 | Verify infrastructure template and Lambda handler | -- (checkpoint approved) | -- |

## Deviations from Plan

None -- plan executed exactly as written.

## Decisions Made

1. **Two-region CloudFormation approach**: Core resources (Bedrock KB, Lambda) deploy to eu-central-1 where Bedrock is available. Edge resources (CloudFront, WAF) documented as us-east-1 section in same template file, to be deployed separately or merged into existing `infra/template.yaml`.

2. **Claude 3 Haiku as default model**: ModelArn parameter defaults to `anthropic.claude-3-haiku-20240307-v1:0` since Haiku 4.5 is not yet confirmed available in eu-central-1. Parameter is configurable for upgrade.

3. **CORS at two layers**: Lambda Function URL handles CORS for direct access; CloudFront response headers policy handles CORS when accessed through the CDN proxy. No in-code CORS headers in Lambda.

4. **WAF rate limit: 10 req/60s per IP**: Uses WAFv2 rate-based rule with `EvaluateWindowSec: 60` for precise 1-minute windows rather than the default 5-minute aggregation.

## Known Stubs

None. All infrastructure resources and Lambda handler code are fully implemented. Deployment and runtime wiring will be handled by plan 05-03.

## Verification Results

- Lambda TypeScript compiles successfully (`npm run typecheck` exits 0)
- CloudFormation YAML is valid (python3 yaml.safe_load succeeds)
- Template contains all 12 required resource types
- User reviewed and approved infrastructure template and Lambda handler

## Self-Check: PASSED

- FOUND: infra/rag-stack.yaml
- FOUND: lambda/chat-handler/index.ts
- FOUND: lambda/chat-handler/citation-mapper.ts
- FOUND: lambda/chat-handler/types.ts
- FOUND: .planning/phases/05-ai-backend-and-content-pipeline/05-02-SUMMARY.md
- FOUND: commit 5fc303d (Task 1)
- FOUND: commit c1b33d1 (Task 2)
