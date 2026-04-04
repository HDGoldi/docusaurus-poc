# Phase 12: AI Agent Integration - Context

**Gathered:** 2026-04-04
**Status:** Ready for planning

<domain>
## Phase Boundary

AI coding agents can discover and consume structured guidance for working with 1NCE APIs via a skill.md file served at `/.well-known/skills/default/skill.md` and a discovery index.json at `/.well-known/skills/`. Covers auth flows, common multi-step patterns, platform best practices, and known gotchas.

</domain>

<decisions>
## Implementation Decisions

### Content Scope
- **D-01:** Full auth walkthrough — step-by-step: how to get credentials, obtain a token via the Authorization API, use it in headers, handle expiry/refresh. Enough that an AI agent can authenticate without reading the full API docs.
- **D-02:** Include 2-4 common multi-step workflows that combine calls across specs (e.g., provision a SIM = create order → activate SIM → configure APN). No code snippets per workflow — describe the sequence and which APIs are involved.
- **D-03:** Gotchas focused on rate limiting behavior, common error codes and what they mean, and the known CORS limitation with browser-based API calls.
- **D-04:** General platform best practices per AGENT-04 — not limited to individual API endpoints.

### File Serving Strategy
- **D-05:** Static files — skill.md at `static/.well-known/skills/default/skill.md` and index.json at `static/.well-known/skills/index.json`. Hand-curated, versioned in git. No build-time generation needed (unlike llms.txt, skill.md doesn't need auto-generated links).
- **D-06:** S3 deploy metadata override for .md content-type — add `--content-type text/markdown` to the `aws s3 sync` command for .md files in the GitHub Actions deploy workflow. Resolves the deferred content-type issue from Phase 10.

### index.json Discovery Format
- **D-07:** Minimal JSON — path and name only. Example: `{"skills": [{"name": "1NCE API", "path": "default/skill.md"}]}`
- **D-08:** Single skill, simple array. One entry for the default skill. Add entries later if needed — no over-engineering.

### skill.md Structure
- **D-09:** Workflow-first organization — lead with auth, then common workflows (provision SIM, manage connectivity, etc.), then gotchas/best practices. Mirrors how an agent would actually use the APIs step by step.
- **D-10:** AI agent instruction tone — written FOR AI coding agents: direct, imperative ("Use Bearer token in Authorization header"), structured for machine consumption. Assumes the reader is an LLM helping a developer.
- **D-11:** Include curl examples for auth token acquisition and 1-2 key operations. Enough for an agent to construct real requests.

### Claude's Discretion
- Exact wording and depth of each workflow section (within the workflow-first structure)
- Which 2-4 workflows to document (Claude picks the most common/useful based on API spec analysis)
- Exact curl example selection beyond auth
- Detailed error code list (Claude picks the most impactful ones)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### skills.md Convention
- Research the emerging `.well-known/skills/` convention and `npx skills add` discovery format during planning phase

### API Specs (Source of Truth for Skill Content)
- `specs/authorization.json` — Auth flow, token endpoint, credentials format
- `specs/sim-management.json` — SIM lifecycle operations
- `specs/order-management.json` — Order creation and management
- `specs/product-information.json` — Product catalog queries
- `specs/support-management.json` — Support ticket operations
- `specs/1nce-os.json` — 1NCE OS device management APIs

### Site Configuration
- `docusaurus.config.ts` — Base URL, site URL needed for any absolute references in skill.md
- `static/` — Directory where `.well-known/skills/` structure will be placed

### Infrastructure
- `infra/cf-function.js` — CloudFront Function already passes through `/.well-known/*` paths (Phase 10)
- `.github/workflows/` — Deploy workflow where S3 sync content-type override will be added

### Prior Phase Context
- `.planning/phases/10-crawler-foundation/10-CONTEXT.md` — CloudFront .well-known passthrough (D-06), content-type fix deferred to this phase (D-09)
- `.planning/phases/11-llm-discoverability/11-CONTEXT.md` — llms.txt plugin pattern, static file conventions

### Requirements
- `.planning/REQUIREMENTS.md` — AGENT-01, AGENT-02, AGENT-03, AGENT-04 requirements for this phase
- `.planning/ROADMAP.md` §Phase 12 — Success criteria (3 conditions that must be TRUE)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `static/` directory — established pattern for static files copied to build root (robots.txt, llms-template.txt)
- `infra/cf-function.js` — already handles `.well-known/*` passthrough, no changes needed
- 6 OpenAPI spec files in `specs/` — source of truth for API operations, auth flows, error codes

### Established Patterns
- Static files in `static/` are copied verbatim to build output by Docusaurus
- CloudFront Function skips SPA rewrite for `/.well-known/` paths
- GitHub Actions deploy uses `aws s3 sync` to push build output to S3

### Integration Points
- `static/.well-known/skills/default/skill.md` → copied to `build/.well-known/skills/default/skill.md` → served via S3+CloudFront
- `static/.well-known/skills/index.json` → copied to `build/.well-known/skills/index.json` → served via S3+CloudFront
- GitHub Actions deploy workflow — add `--content-type` metadata override for `.md` files during S3 sync

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

*Phase: 12-ai-agent-integration*
*Context gathered: 2026-04-04*
