# Phase 5: AI Backend and Content Pipeline - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-23
**Phase:** 05-ai-backend-and-content-pipeline
**Areas discussed:** Content Preprocessing, Bedrock KB Configuration, Lambda Response Design, Rate Limiting

---

## Content Preprocessing

### Q1: How should content be prepared for RAG ingestion?

| Option | Description | Selected |
|--------|-------------|----------|
| Strip to plain Markdown | Remove JSX/frontmatter, keep Markdown formatting. Bedrock handles chunking. | |
| Strip to plain text | Remove all formatting, flat text files. Maximum embeddings compatibility. | |
| Structured chunks | Pre-chunk by h2/h3 boundaries, one file per chunk with metadata. | ✓ |

**User's choice:** Structured chunks
**Notes:** None

### Q2: How should OpenAPI spec content be handled?

| Option | Description | Selected |
|--------|-------------|----------|
| Include endpoint pages | Each endpoint as its own chunk (method, path, description, params, responses) | ✓ |
| Skip API specs | Only index 298 prose docs | |
| Summary only | High-level summary per API, not individual endpoints | |

**User's choice:** Include endpoint pages
**Notes:** None

### Q3: What metadata per chunk?

| Option | Description | Selected |
|--------|-------------|----------|
| Page URL + title | Minimal — just enough for citation links | |
| URL + title + breadcrumb | Adds navigation hierarchy context | |
| Rich metadata | URL, title, breadcrumb, tags/category, content type | ✓ |

**User's choice:** Rich metadata
**Notes:** None

### Q4: How should the preprocessing script run?

| Option | Description | Selected |
|--------|-------------|----------|
| Standalone Node script | Separate scripts/prepare-rag-content.ts, outputs to dedicated folder | ✓ |
| Docusaurus plugin | Custom plugin hooks into build lifecycle | |
| You decide | Claude picks best fit | |

**User's choice:** Standalone Node script, but must be included in CI/CD pipeline to keep in sync
**Notes:** User emphasized CI/CD integration is required

---

## Bedrock KB Configuration

### Q1: Which models?

| Option | Description | Selected |
|--------|-------------|----------|
| Claude Sonnet 4 + Titan V2 | Fast, cost-effective. As noted in blockers. | |
| Claude Haiku 4.5 + Titan V2 | Cheaper and faster. May be sufficient for retrieval-grounded Q&A. | ✓ |
| You decide | Claude picks cost/quality tradeoff | |

**User's choice:** Claude Haiku 4.5 + Titan Embeddings V2
**Notes:** None

### Q2: Which AWS region?

| Option | Description | Selected |
|--------|-------------|----------|
| eu-central-1 (Frankfurt) | Closest to 1NCE, data stays in EU. Needs model availability check. | ✓ |
| us-east-1 (Virginia) | Best model availability, where CloudFront/ACM lives. Cross-Atlantic latency. | |
| You decide | Claude checks availability and picks | |

**User's choice:** eu-central-1
**Notes:** None

### Q3: Should Bedrock re-chunk?

| Option | Description | Selected |
|--------|-------------|----------|
| No re-chunking | Pre-chunked files as-is, each file = one chunk | ✓ |
| Let Bedrock re-chunk | Feed pre-chunked but allow further splitting | |
| You decide | Claude picks based on KB constraints | |

**User's choice:** No re-chunking
**Notes:** None

---

## Lambda Response Design

### Q1: How should responses be delivered?

| Option | Description | Selected |
|--------|-------------|----------|
| Streaming (SSE) | Tokens stream via Server-Sent Events. Progressive display. | ✓ |
| Full response | Wait for complete answer, return as one JSON payload. | |
| You decide | Claude picks based on Phase 6 requirements | |

**User's choice:** Streaming via SSE
**Notes:** Aligns with CHAT-02

### Q2: Citation format?

| Option | Description | Selected |
|--------|-------------|----------|
| Inline references | Numbered [1][2] markers in text, sources array at end | ✓ |
| Separate sources block | No inline markers, sources as separate array after answer | |
| You decide | Claude picks based on Bedrock response format | |

**User's choice:** Inline numbered references
**Notes:** None

### Q3: Behavior for unanswerable questions?

| Option | Description | Selected |
|--------|-------------|----------|
| Honest fallback | "I don't have information about that" + suggested topics | ✓ |
| Redirect to search | Suggest browsing specific doc sections with links | |
| You decide | Claude handles no-results UX | |

**User's choice:** Honest fallback
**Notes:** None

---

## Rate Limiting

### Q1: Rate limiting approach?

| Option | Description | Selected |
|--------|-------------|----------|
| IP-based sliding window | Track per-IP in rolling window. Simple. | |
| CloudFront WAF | AWS WAF rate-based rules. Infrastructure layer. | ✓ |
| Lambda + DynamoDB | Track in DynamoDB from Lambda. More flexible but adds dependency. | |
| You decide | Claude picks simplest for INFRA-04 | |

**User's choice:** CloudFront-level WAF
**Notes:** None

### Q2: Rate limit threshold?

| Option | Description | Selected |
|--------|-------------|----------|
| Conservative (10 req/min) | Prevents abuse, sufficient for normal Q&A | ✓ |
| Moderate (30 req/min) | More generous, accommodates rapid follow-ups | |
| You decide | Claude picks reasonable default | |

**User's choice:** Conservative, 10 req/min per IP
**Notes:** None

---

## Claude's Discretion

- Chunk file format
- S3 Vectors namespace strategy
- Lambda runtime choice
- SSE implementation details
- WAF rule configuration
- Error handling and retry logic

## Deferred Ideas

None
