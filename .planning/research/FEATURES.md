# Feature Research

**Domain:** AI Documentation Assistant + GitHub Pages Preview Deployment (v1.1 milestone)
**Researched:** 2026-03-21
**Confidence:** MEDIUM

> This file covers ONLY the v1.1 milestone features. For v1.0 migration features, see git history.

## Feature Landscape

### Table Stakes (Users Expect These)

Features that users of a "chat with docs" assistant assume exist. Missing these and the feature feels broken or unusable.

#### AI Assistant — Chat UI

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Floating chat button / drawer | Every docs AI assistant uses a bottom-right floating icon that opens a chat panel. ReadMe's Owlbot uses this pattern. Users will not find a separate page. | MEDIUM | Custom React component. Swizzle Docusaurus layout to inject a persistent floating button + slide-out drawer. Must work across all pages including API Explorer. |
| Streaming responses | Users expect text to appear word-by-word, not after a 5-10 second blank wait. ReadMe Owlbot streams. Every modern chat UI streams. Non-streaming feels broken. | MEDIUM | AWS Bedrock supports response streaming via `InvokeModelWithResponseStream`. Frontend needs EventSource or fetch with ReadableStream. |
| Source citations with links | Users need to verify AI answers. Owlbot returns source titles + URLs. Without citations, the AI is an ungrounded chatbot — a liability for technical docs. | LOW | Bedrock Knowledge Bases return source citations automatically with RetrieveAndGenerate. Frontend renders them as clickable links to doc pages. |
| Markdown rendering in responses | AI responses contain code snippets, lists, headers. Rendering as plain text makes technical answers unreadable. | LOW | Use a lightweight Markdown renderer (react-markdown) in the chat panel. Already have React in the stack. |
| Conversation context (multi-turn) | Users ask follow-up questions: "What about for SIM management?" after an initial query. Without context, every question is standalone and feels dumb. | MEDIUM | Bedrock RetrieveAndGenerate supports sessionId for multi-turn conversations. Pass sessionId in subsequent requests. Backend must manage session state (or let Bedrock manage it). |
| Loading indicator | Users need to know the system is working. No spinner = "is it broken?" | LOW | Standard React state management. Show typing indicator while awaiting stream. |
| Error handling with retry | API calls fail. Users need a "Something went wrong. Try again." message, not a silent failure or crash. | LOW | Catch errors in the API call, show user-friendly message, offer retry button. |

#### AI Assistant — Backend

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| RAG grounding on actual doc content | The entire point. Without retrieval, the model hallucinates about 1NCE APIs. Must index all 298 docs + 125 API pages. | HIGH | AWS Bedrock Knowledge Base with S3 data source. Must prepare docs for ingestion — strip MDX syntax, frontmatter, and React components to get clean text. Raw MDX files will produce noisy embeddings. |
| Low-latency responses (< 3s to first token) | Users abandon chat if nothing appears in 3+ seconds. ReadMe Owlbot responds within 1-2 seconds. | MEDIUM | Bedrock model inference is typically 1-2s to first token with streaming. The retrieval step adds latency. Use a fast embedding model (Titan Embeddings) and keep the knowledge base indexed. |
| Rate limiting | Without rate limiting, a single user (or bot) can run up massive Bedrock costs in minutes. | MEDIUM | Implement at the API Gateway level. Token bucket or fixed window. 10-20 requests/minute per IP is reasonable for docs chat. |

#### GitHub Pages Deployment

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Working build on GitHub Pages | The site must actually load and navigate correctly. This means baseUrl must be set correctly for the repo path (e.g., `/docusaurus_poc/`). | MEDIUM | Docusaurus requires `url` and `baseUrl` config changes for GitHub Pages. Since production uses `baseUrl: '/'` on help.1nce.com, GitHub Pages needs a different baseUrl. Use environment variable or build-time override. |
| Automated deploy via GitHub Actions | Manual deploys defeat the purpose. Push to branch, site updates. | LOW | Docusaurus docs provide a reference workflow using `actions/deploy-pages`. Add a new workflow file alongside the existing `deploy.yml`. |
| Accessible preview URL | Team members need a clickable URL to view the preview. | LOW | GitHub Pages URL follows pattern: `https://<org>.github.io/<repo>/`. Surface this in the workflow output or repo settings. |

### Differentiators (Competitive Advantage)

Features that would make the AI assistant notably better than ReadMe's Owlbot or generic chatbots.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Suggested starter questions | Pre-populated questions like "How do I authenticate?", "What SIM management APIs are available?" reduce the blank-input problem. Guides users who do not know what to ask. | LOW | Hardcoded array of 3-5 questions rendered as clickable chips in the empty chat state. No backend work. |
| API-aware responses | The assistant can reference specific API endpoints with links to the interactive Try It panel. Goes beyond generic doc chat by connecting to the API Explorer. | HIGH | Requires the knowledge base to index API endpoint descriptions with metadata linking to endpoint URLs. Custom prompt engineering to instruct the model to include endpoint references. |
| Feedback thumbs up/down | Lets the team measure answer quality without complex analytics. ReadMe Owlbot does not expose this in their docs. | LOW | Two buttons per response. Log to CloudWatch or a simple DynamoDB table. No complex infrastructure. |
| Context-aware suggestions | Show "Ask AI about this page" with the current page title pre-filled as context. Makes the assistant page-aware. | MEDIUM | Pass current page URL/title as metadata in the API request. Include in the retrieval query context. Requires frontend to detect current page. |
| Dark mode chat panel | Chat UI respects the site's dark/light theme toggle. Looks native, not bolted-on. | LOW | Use Docusaurus CSS custom properties (`--ifm-*`) in the chat component. Inherits theme automatically if done correctly. |
| GitHub Pages as PR preview alternative | Use GitHub Pages for lightweight previews without the AWS preview infrastructure cost. Could replace or supplement the existing S3 preview deploy. | LOW | Configure the workflow to deploy on PR merges to a preview branch, or use the existing PR workflow. Lower cost than maintaining a separate S3 preview bucket. |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Full conversational agent with tool use | "Let the AI actually call our APIs for the user" | Massive security risk. Exposes API credentials, enables uncontrolled API calls against production systems. Also requires Bedrock Agents (more complex than Knowledge Bases), action group definitions, and IAM roles for each API. 10x the complexity. | Keep the assistant read-only: it answers questions about docs and links to the Try It panel where users authenticate themselves. |
| Custom fine-tuned model | "Train a model specifically on our docs for better answers" | Fine-tuning is expensive, slow to iterate, and unnecessary when RAG with a strong base model (Claude) handles documentation Q&A well. Fine-tuning is for changing model behavior, not for adding knowledge. | Use RAG with Bedrock Knowledge Bases. Claude with retrieved context will answer 1NCE doc questions accurately without fine-tuning. |
| Persistent chat history across sessions | "Users should see their previous conversations when they return" | Requires user identity (authentication), a database for chat storage, GDPR compliance for storing user queries. Adds backend complexity for a feature most docs chat users do not need. | Start fresh each page load. Keep conversation state in browser memory (sessionStorage) so it persists during a browsing session but not across sessions. |
| Voice input / speech-to-text | "Let users ask questions by voice" | Browser speech APIs are inconsistent. Adds accessibility complexity (what about hearing-impaired users who need the inverse?). Tiny user base for a developer docs site. | Text input only. Developers type. |
| Autonomous doc improvement suggestions | "Have the AI identify gaps in our docs and suggest edits" | Requires a separate pipeline, evaluation criteria, human review workflow. This is a content operations tool, not a user-facing feature. | Log unanswered questions (queries where confidence is low) to identify doc gaps manually. |
| Embedding the chat in every page as inline widget | "Put the AI answer right in the doc page content" | Breaks the reading flow. Confuses authored content with generated content. Users cannot tell what is official documentation vs. AI interpretation. | Keep chat in a separate floating drawer overlay. Clear visual separation between docs and AI. |
| Client-side RAG / local embeddings | "Run everything in the browser, no backend needed" | Embedding models are too large for browser. Vector search in the browser is slow and limited. Cannot use Bedrock without a backend proxy (API keys cannot be in frontend code). | Serverless backend (API Gateway + Lambda) is the right architecture. Keeps credentials secure, enables rate limiting, allows model upgrades without frontend changes. |

## Feature Dependencies

```
[Content preparation for KB]
    |
    v
[Bedrock Knowledge Base setup] ---requires---> [S3 bucket with processed docs]
    |
    v
[Serverless API backend] ---requires---> [API Gateway + Lambda + Bedrock permissions]
    |
    v
[Chat UI component] ---requires---> [Serverless API backend]
    |
    +---enhances---> [Suggested questions] (no backend dependency)
    +---enhances---> [Feedback mechanism] (needs DynamoDB or CloudWatch)
    +---enhances---> [Context-aware suggestions] (frontend-only, page detection)

[GitHub Pages workflow] ---independent of---> [AI Assistant]
    |
    v
[baseUrl configuration] ---requires---> [Environment-aware build config]
```

### Dependency Notes

- **Knowledge Base requires processed content:** Raw MDX files with JSX components, frontmatter, and import statements will produce poor embeddings. Need a build-time script to strip MDX to plain text for ingestion.
- **Chat UI requires backend first:** Cannot develop the frontend meaningfully without a working API to call. Use a mock API for initial UI development, but real integration testing needs the backend.
- **GitHub Pages is fully independent:** Can be done in parallel with AI work. No shared dependencies.
- **Suggested questions have zero dependencies:** Can ship with the chat UI immediately — just a hardcoded array.
- **Feedback mechanism is loosely coupled:** Can be added after initial chat UI ships. Only needs a simple logging endpoint.

## MVP Definition

### Launch With (v1.1)

- [ ] **Bedrock Knowledge Base** with all doc content indexed — this is the foundation; without it, the AI has nothing to retrieve
- [ ] **Serverless API** (API Gateway + Lambda) calling Bedrock RetrieveAndGenerate — the backend that connects chat to knowledge
- [ ] **Floating chat drawer UI** with streaming responses and citations — the user-facing feature
- [ ] **Multi-turn conversation** via Bedrock sessionId — without this, follow-up questions fail
- [ ] **Rate limiting** at API Gateway — cost protection is non-negotiable before exposing a pay-per-token API
- [ ] **GitHub Pages deployment workflow** — separate concern, low effort, high utility for team previews
- [ ] **Suggested starter questions** — zero-cost UX improvement that ships with the UI

### Add After Validation (v1.1.x)

- [ ] **Feedback thumbs up/down** — add once the assistant is live and answer quality can be measured
- [ ] **Context-aware page suggestions** — add once basic chat is validated; pass current page URL to improve retrieval
- [ ] **API-aware responses** — requires custom prompt engineering and knowledge base metadata enrichment; validate basic RAG quality first
- [ ] **Usage analytics dashboard** — track query volume, popular questions, error rates; add after patterns emerge

### Future Consideration (v2+)

- [ ] **Semantic search replacing Algolia** — if the RAG infrastructure works well, the same embeddings could power site search
- [ ] **Multi-language support** — only if i18n is added to the docs site itself
- [ ] **Custom model routing** — use cheaper models for simple questions, Claude for complex ones; optimize cost at scale

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Floating chat drawer with streaming | HIGH | MEDIUM | P1 |
| Bedrock Knowledge Base (RAG) | HIGH | HIGH | P1 |
| Serverless API backend | HIGH | MEDIUM | P1 |
| Source citations | HIGH | LOW | P1 |
| Multi-turn conversation | MEDIUM | LOW | P1 |
| Rate limiting | LOW (user) / HIGH (ops) | MEDIUM | P1 |
| GitHub Pages workflow | MEDIUM | LOW | P1 |
| Suggested starter questions | MEDIUM | LOW | P1 |
| Feedback mechanism | MEDIUM | LOW | P2 |
| Context-aware page suggestions | MEDIUM | MEDIUM | P2 |
| Dark mode chat panel | MEDIUM | LOW | P2 |
| API-aware responses | HIGH | HIGH | P3 |
| Usage analytics | LOW | MEDIUM | P3 |

**Priority key:**
- P1: Must have for v1.1 launch
- P2: Should have, add in v1.1.x iteration
- P3: Nice to have, future consideration

## Competitor Feature Analysis

| Feature | ReadMe Owlbot | Mintlify AI | GitBook AI | Our Approach |
|---------|---------------|-------------|------------|--------------|
| Chat UI | Floating drawer, bottom-right | Inline search + chat hybrid | Floating panel | Floating drawer, bottom-right (matches ReadMe pattern users already know) |
| Streaming | Yes | Yes | Yes | Yes, via Bedrock response streaming |
| Citations | Yes (page title + URL) | Yes (inline links) | Yes (page references) | Yes, via Bedrock Knowledge Base citations |
| Multi-turn | Limited (session-based) | Yes | Yes | Yes, via Bedrock sessionId |
| Grounding | Own docs only | Own docs only | Own docs only | Own docs only (Bedrock Knowledge Base) |
| Suggested questions | No (from docs) | Yes | No | Yes, hardcoded starter set |
| Feedback | Not documented | Yes (thumbs) | Yes (thumbs) | Yes, P2 priority |
| Cost model | Included in SaaS fee | Included in SaaS fee | Included in SaaS fee | Pay-per-query (Bedrock pricing). Roughly $0.003-0.01 per query depending on model and retrieval. |
| Self-hosted | No | No | No | Yes — runs on your AWS account, full control |

## Complexity Assessment Summary

| Feature Area | Estimated Effort | Risk Level | Notes |
|--------------|-----------------|------------|-------|
| Content preparation for Knowledge Base | 2-3 days | MEDIUM | Must strip MDX to plain text. ~400+ pages. Script development + validation. |
| Bedrock Knowledge Base setup | 1-2 days | MEDIUM | First-time Bedrock setup, model access approval, IAM roles. Straightforward but unfamiliar territory. |
| Serverless API (Gateway + Lambda) | 2-3 days | LOW | Well-documented AWS pattern. Node.js Lambda calling Bedrock. |
| Chat UI component | 3-5 days | MEDIUM | Custom React component integrated into Docusaurus layout. Streaming, markdown rendering, responsive design, dark mode. |
| GitHub Pages workflow | 0.5-1 day | LOW | Standard Docusaurus deployment pattern. Main complexity is baseUrl handling. |
| Integration testing | 2-3 days | HIGH | End-to-end flow: user types question -> API Gateway -> Lambda -> Bedrock -> Knowledge Base -> response streamed back. Many failure points. |

**Total estimated effort: 10-17 days** for a single developer, including integration testing and iteration.

## Sources

- ReadMe Owlbot documentation (docs.readme.com/main/docs/owlbot-ai) — MEDIUM confidence (legacy API, may have evolved)
- AWS Bedrock Knowledge Bases documentation (docs.aws.amazon.com) — HIGH confidence for architecture patterns
- AWS Bedrock Agents documentation (docs.aws.amazon.com) — HIGH confidence
- AWS Bedrock model access documentation — HIGH confidence for setup process
- Docusaurus GitHub Pages deployment guide (docusaurus.io/docs/deployment) — HIGH confidence
- Existing project docusaurus.config.ts and deploy.yml — direct codebase analysis
- npm ecosystem search for Docusaurus AI plugins — confirmed no mature plugins exist; custom build required
- Training data knowledge of Mintlify AI, GitBook AI patterns — LOW confidence (may have changed)

---
*Feature research for: AI Documentation Assistant + GitHub Pages Preview (v1.1)*
*Researched: 2026-03-21*
