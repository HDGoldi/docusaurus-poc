# Phase 12: AI Agent Integration - Research

**Researched:** 2026-04-04
**Domain:** Agent Skills specification, static file serving, S3 content-type metadata
**Confidence:** HIGH

## Summary

Phase 12 creates two static files -- `skill.md` and `index.json` -- served under the `.well-known/skills/` path, plus a deploy pipeline fix for `.md` content-type headers. The infrastructure groundwork (CloudFront Function `.well-known/*` passthrough) was completed in Phase 10. The remaining work is: (1) authoring the skill.md content by analyzing the 6 OpenAPI specs, (2) creating a minimal index.json, and (3) adding a `--content-type` override to the GitHub Actions deploy workflow so S3 serves `.md` files as `text/markdown` instead of `application/octet-stream`.

The Agent Skills specification (agentskills.io) defines `SKILL.md` as a file with YAML frontmatter (`name` + `description` required) followed by Markdown instructions. The `.well-known/skills/` web path is NOT part of the official spec -- it is a project-specific decision (D-05, D-07) that provides HTTP-based discovery. The `npx skills add` CLI supports URL-based installation (`npx skills add https://example.com/path/to/SKILL.md`), so serving skill.md at a known URL enables discovery.

**Primary recommendation:** Create hand-curated static files at `static/.well-known/skills/default/skill.md` and `static/.well-known/skills/index.json`. Modify the deploy workflow to handle `.md` content-type. No build-time generation needed.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- D-01: Full auth walkthrough -- step-by-step: how to get credentials, obtain a token via the Authorization API, use it in headers, handle expiry/refresh
- D-02: Include 2-4 common multi-step workflows that combine calls across specs (e.g., provision a SIM = create order -> activate SIM -> configure APN). No code snippets per workflow -- describe the sequence and which APIs are involved
- D-03: Gotchas focused on rate limiting behavior, common error codes and what they mean, and the known CORS limitation with browser-based API calls
- D-04: General platform best practices per AGENT-04 -- not limited to individual API endpoints
- D-05: Static files -- skill.md at `static/.well-known/skills/default/skill.md` and index.json at `static/.well-known/skills/index.json`. Hand-curated, versioned in git. No build-time generation needed
- D-06: S3 deploy metadata override for .md content-type -- add `--content-type text/markdown` to the `aws s3 sync` command for .md files in the GitHub Actions deploy workflow
- D-07: Minimal JSON -- path and name only. Example: `{"skills": [{"name": "1NCE API", "path": "default/skill.md"}]}`
- D-08: Single skill, simple array. One entry for the default skill
- D-09: Workflow-first organization -- lead with auth, then common workflows, then gotchas/best practices
- D-10: AI agent instruction tone -- written FOR AI coding agents: direct, imperative ("Use Bearer token in Authorization header"), structured for machine consumption
- D-11: Include curl examples for auth token acquisition and 1-2 key operations

### Claude's Discretion
- Exact wording and depth of each workflow section (within the workflow-first structure)
- Which 2-4 workflows to document (Claude picks the most common/useful based on API spec analysis)
- Exact curl example selection beyond auth
- Detailed error code list (Claude picks the most impactful ones)

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| AGENT-01 | Site serves skill.md describing how to work with 1NCE APIs -- auth flows, common patterns, best practices, gotchas | Auth flow from `specs/authorization.json` (Basic Auth -> Bearer token, 3600s expiry). API patterns from all 6 specs. Served as static file via Docusaurus `static/` directory. |
| AGENT-02 | skill.md is served at /.well-known/skills/default/skill.md with proper discovery path | CloudFront Function already passes through `/.well-known/*` (Phase 10). File at `static/.well-known/skills/default/skill.md` copies to build output. S3 content-type fix needed. |
| AGENT-03 | Site serves index.json at /.well-known/skills/ listing available skills for npx skills add discovery | Static file at `static/.well-known/skills/index.json`. JSON served with correct content-type by default from S3. |
| AGENT-04 | skill.md includes general best practices for working with 1NCE platform (not just API endpoints) | Research of API specs reveals: token expiry handling, error code patterns, base URL convention, pagination patterns. |
</phase_requirements>

## Standard Stack

No new libraries needed. This phase creates static files and modifies a GitHub Actions workflow.

### Core
| Technology | Version | Purpose | Why Standard |
|------------|---------|---------|--------------|
| Static files (hand-curated) | -- | skill.md and index.json content | Decision D-05: no build-time generation needed |
| GitHub Actions workflow | -- | S3 deploy with content-type override | Decision D-06: fix .md MIME type |

### Supporting
| Technology | Version | Purpose | When to Use |
|------------|---------|---------|-------------|
| AWS CLI `s3 sync` | v2 | Deploy with `--content-type` flags | Production deploy step |

## Architecture Patterns

### File Structure
```
static/
└── .well-known/
    └── skills/
        ├── index.json              # Discovery index
        └── default/
            └── skill.md            # AI agent skill file
```

### Pattern 1: Agent Skills SKILL.md Format
**What:** YAML frontmatter with `name` and `description` fields, followed by Markdown instructions
**When to use:** Always -- this is the Agent Skills specification format
**Source:** https://agentskills.io/specification

The official spec requires:
- `name`: 1-64 chars, lowercase alphanumeric + hyphens, must match parent directory name
- `description`: 1-1024 chars, describes what the skill does and when to use it
- Body: Free-form Markdown instructions

**Important:** The spec states `name` must match the parent directory name. Parent directory is `default`, so `name: default` is required for spec compliance. However, the CONTEXT.md decision D-07 specifies `"name": "1NCE API"` in the index.json. The SKILL.md frontmatter `name` field and the index.json `name` field serve different purposes -- the frontmatter `name` is the spec-mandated identifier (`default`), while the index.json `name` is a display label for discovery (`1NCE API`).

**Example:**
```markdown
---
name: default
description: Work with 1NCE IoT connectivity APIs. Covers authentication, SIM management, order management, and device operations. Use when integrating with 1NCE platform APIs.
---

# 1NCE API Integration

## Authentication
...
```

### Pattern 2: S3 Content-Type Override for .md Files
**What:** Separate `aws s3 sync` command with `--content-type text/markdown` for `.md` files
**When to use:** Required for S3 to serve `.md` files with correct MIME type
**Why:** S3 auto-detects `.md` as `application/octet-stream`, causing browsers to download instead of display

The deploy workflow currently has two sync commands (hashed assets with long cache, remaining files with short cache). The `.md` content-type fix requires either:
1. A separate sync pass with `--exclude` and `--include` flags for `.md` files, OR
2. Post-sync `aws s3 cp` commands to re-upload `.md` files with correct content-type

**Recommended approach:** Add a dedicated step after the main syncs that copies `.md` files back with the correct content-type:

```yaml
- name: Fix content-type for Markdown files
  run: |
    aws s3 cp s3://1nce-developer-hub-prod/ s3://1nce-developer-hub-prod/ \
      --recursive \
      --exclude "*" \
      --include "*.md" \
      --content-type "text/markdown; charset=utf-8" \
      --metadata-directive REPLACE \
      --cache-control "public, max-age=600, must-revalidate"
```

This is cleaner than modifying the existing sync commands because:
- It does not interfere with the `--delete` flag on the main sync
- It is idempotent and self-contained
- It handles `.md` files anywhere in the bucket (future-proof)

### Pattern 3: index.json Discovery Format
**What:** Minimal JSON listing available skills
**When to use:** Served at `/.well-known/skills/index.json`

```json
{
  "skills": [
    {
      "name": "1NCE API",
      "path": "default/skill.md"
    }
  ]
}
```

Note: This is a project-specific convention (D-07), not part of the Agent Skills specification. The `npx skills add` CLI supports URL-based installation, so an agent can discover skills by fetching this index and constructing the full URL.

### Anti-Patterns to Avoid
- **Build-time generation for skill.md:** Unlike llms.txt (Phase 11), skill.md content is hand-curated domain knowledge, not auto-generated links. Do not create a Docusaurus plugin for this.
- **Serving skill.md without frontmatter:** The Agent Skills spec requires YAML frontmatter. Omitting it makes the file non-compliant.
- **Using uppercase in SKILL.md name field:** The spec requires lowercase alphanumeric + hyphens only. Use `default` not `Default` or `1nce-api`.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Content-type headers on S3 | Custom Lambda@Edge function | `aws s3 cp --content-type` post-sync | S3 metadata override is simpler and cheaper than edge compute |
| Skill discovery protocol | Custom discovery API | Static `index.json` + `npx skills add` URL support | Decision D-05 explicitly chose static files over dynamic generation |

## API Spec Analysis (for Skill Content)

Key findings from analyzing the 6 OpenAPI spec files in `specs/`:

### Authentication (authorization.json)
- **Base URL:** `https://api.1nce.com/management-api`
- **Auth method:** Basic Authentication (username + password) to obtain Bearer token
- **Endpoint:** `POST /oauth/token` with `{"grant_type": "client_credentials"}`
- **Token lifetime:** 3600 seconds (1 hour)
- **Token type:** Bearer
- **Security scheme:** HTTP Basic -> Bearer exchange pattern
- **Error codes:** `BadCredentials`, `AuthValidationError`, `BodyValidationError`, `UnsupportedContentTypeError`

### SIM Management (sim-management.json)
- 18 endpoints covering SIM lifecycle: list, get, status, transfer, connectivity info, reset, events, usage, quota, SMS, top-up, limits, extension
- Key operations: status management, data/SMS quota, connectivity info, bulk top-up

### Order Management (order-management.json)
- 2 endpoints: `GET /v1/orders` (list), `GET /v1/orders/{order_number}` (detail)
- Simple CRUD, read-only

### 1NCE OS (1nce-os.json)
- 50+ endpoints covering device management, actions (LWM2M/CoAP/UDP), PSK management, cloud integrations (AWS, webhooks), device inspection/telemetry, geofencing, optimization templates, partner plugins
- Most complex spec by endpoint count

### Product Information (product-information.json)
- 1 endpoint: `GET /v1/products`

### Support Management (support-management.json)
- 1 endpoint: `GET /v1/support`

### Recommended Workflows for skill.md (Claude's Discretion)
Based on API surface area and common IoT use cases:
1. **Authentication flow** (required by D-01) -- Basic Auth -> Bearer token -> use in subsequent calls
2. **SIM lifecycle management** -- List SIMs -> check status -> activate/deactivate -> monitor usage
3. **Device onboarding with 1NCE OS** -- Register device -> configure PSK -> set up cloud integration
4. **Connectivity monitoring** -- Get SIM connectivity info -> check usage/quota -> handle top-up

## Common Pitfalls

### Pitfall 1: S3 Content-Type for .md Files
**What goes wrong:** S3 serves `.md` files as `application/octet-stream`, causing browsers and HTTP clients to download the file instead of displaying it as text
**Why it happens:** S3 auto-detection does not recognize `.md` as `text/markdown`
**How to avoid:** Add explicit `--content-type "text/markdown; charset=utf-8"` in the deploy workflow
**Warning signs:** Visiting `/.well-known/skills/default/skill.md` triggers a file download instead of rendering text

### Pitfall 2: SKILL.md Name Field vs Display Name
**What goes wrong:** Using a human-friendly name like `1nce-api` in the SKILL.md frontmatter `name` field when the parent directory is `default`
**Why it happens:** The Agent Skills spec requires `name` to match the parent directory name
**How to avoid:** Use `name: default` in the SKILL.md frontmatter. Use the human-friendly name only in index.json
**Warning signs:** `skills-ref validate` fails on name mismatch

### Pitfall 3: Skill Content Too Long
**What goes wrong:** skill.md body exceeds the recommended 5000 tokens / 500 lines, causing context bloat when agents load it
**Why it happens:** Trying to document every endpoint instead of focusing on workflows and patterns
**How to avoid:** Keep skill.md focused on auth flows, common patterns, and gotchas. Reference the full API docs URL for endpoint details. The Agent Skills spec recommends keeping SKILL.md under 500 lines and splitting detailed reference into separate files.
**Warning signs:** Word count exceeds ~3000 words

### Pitfall 4: Missing charset in Content-Type
**What goes wrong:** UTF-8 characters in skill.md render incorrectly
**Why it happens:** Setting `content-type: text/markdown` without `charset=utf-8`
**How to avoid:** Always use `text/markdown; charset=utf-8`

### Pitfall 5: Deploy Workflow Ordering
**What goes wrong:** The content-type fix step runs before the main S3 sync, which then overwrites the metadata
**Why it happens:** Incorrect step ordering in GitHub Actions workflow
**How to avoid:** The content-type fix MUST run AFTER both S3 sync steps (hashed assets + remaining files)

## Code Examples

### skill.md Structure (Verified Against Agent Skills Spec)
```markdown
---
name: default
description: Work with 1NCE IoT connectivity APIs. Covers authentication, SIM management, order management, and device operations. Use when integrating with 1NCE platform APIs.
---

# 1NCE API Integration

## Authentication

You need a 1NCE Management Portal account with API access.

Base URL for all API calls: `https://api.1nce.com/management-api`

### Obtain a Bearer Token

Send your Management Portal credentials via HTTP Basic Auth:

\`\`\`bash
curl -X POST https://api.1nce.com/management-api/oauth/token \
  -u "your-username:your-password" \
  -H "Content-Type: application/json" \
  -d '{"grant_type": "client_credentials"}'
\`\`\`

Response:
\`\`\`json
{
  "access_token": "eyJpZHRva2V...",
  "token_type": "bearer",
  "expires_in": 3600
}
\`\`\`

The token expires in 3600 seconds (1 hour). Request a new token before expiry.
Use the token in all subsequent requests:

\`\`\`
Authorization: Bearer eyJpZHRva2V...
\`\`\`

## Common Workflows

### 1. SIM Lifecycle Management
...

## Gotchas and Best Practices
...
```

### index.json
```json
{
  "skills": [
    {
      "name": "1NCE API",
      "path": "default/skill.md"
    }
  ]
}
```

### Deploy Workflow Content-Type Fix
```yaml
- name: Fix content-type for Markdown files
  run: |
    aws s3 cp s3://1nce-developer-hub-prod/ s3://1nce-developer-hub-prod/ \
      --recursive \
      --exclude "*" \
      --include "*.md" \
      --content-type "text/markdown; charset=utf-8" \
      --metadata-directive REPLACE \
      --cache-control "public, max-age=600, must-revalidate"
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Custom API docs for agents | Agent Skills specification (SKILL.md) | 2025-2026 | Standard format supported by Claude Code, Cursor, GitHub Copilot, VS Code, and 30+ agent products |
| llms.txt only | llms.txt + Agent Skills | 2025-2026 | llms.txt for content discovery, Agent Skills for procedural knowledge |

**Key context:** The Agent Skills specification was originally developed by Anthropic, released as open standard, and adopted by major AI coding tools (Claude Code, Cursor, GitHub Copilot, VS Code, Gemini CLI, OpenAI Codex, and many others). It is the emerging standard for giving AI agents domain-specific procedural knowledge.

## Open Questions

1. **SKILL.md name field compliance**
   - What we know: The Agent Skills spec requires `name` to match the parent directory name. Parent directory is `default`.
   - What's unclear: Whether strict compliance matters for a web-hosted skill (vs. filesystem-installed skill). The `npx skills add` URL flow may or may not validate this.
   - Recommendation: Use `name: default` for spec compliance. The display name `1NCE API` goes in index.json per D-07.

2. **Preview environment deploy**
   - What we know: The deploy workflow has a separate `deploy-preview` job that syncs to a preview S3 bucket.
   - What's unclear: Whether the content-type fix should also apply to preview deploys.
   - Recommendation: Apply the fix to both production and preview deploy jobs for consistency.

## Sources

### Primary (HIGH confidence)
- Agent Skills Specification: https://agentskills.io/specification -- full SKILL.md format, frontmatter fields, directory conventions
- Agent Skills Client Implementation Guide: https://agentskills.io/client-implementation/adding-skills-support -- discovery, activation, progressive disclosure
- `specs/authorization.json` -- 1NCE auth flow details (Basic Auth -> Bearer, 3600s expiry, error codes)
- `specs/sim-management.json`, `specs/order-management.json`, `specs/1nce-os.json`, `specs/product-information.json`, `specs/support-management.json` -- API surface for workflow documentation
- `infra/cf-function.js` -- verified `.well-known/*` passthrough exists
- `.github/workflows/deploy.yml` -- current deploy workflow structure

### Secondary (MEDIUM confidence)
- `npx skills --help` output -- confirms URL-based skill installation support
- Agent Skills homepage (agentskills.io) -- lists 30+ compatible agent products

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - no new libraries, static files only
- Architecture: HIGH - verified file paths, CloudFront passthrough, deploy workflow structure
- Pitfalls: HIGH - S3 content-type issue is well-documented and was already identified in Phase 10 context
- Skill content: MEDIUM - API spec analysis is accurate, but workflow selection involves judgment calls (Claude's discretion)

**Research date:** 2026-04-04
**Valid until:** 2026-05-04 (stable -- static file serving patterns do not change frequently)
