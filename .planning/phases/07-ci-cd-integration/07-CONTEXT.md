# Phase 7: CI/CD Integration - Context

**Gathered:** 2026-03-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Wire the existing RAG content preprocessing (`prepare-rag-content.ts`) and S3 sync (`sync-rag-to-s3.ts`) scripts into an automated GitHub Actions workflow so that documentation updates on main automatically flow through to the Bedrock Knowledge Base. The existing AWS production deploy workflow (`deploy.yml`) must remain untouched.

</domain>

<decisions>
## Implementation Decisions

### Workflow Placement
- **D-01:** Separate workflow file (e.g., `rag-sync.yml`) — fully isolated from `deploy.yml` and `gh-pages.yml`. Satisfies CICD-02 (existing deploy unchanged).
- **D-02:** Runs concurrently with `deploy.yml` on push to main — RAG sync reads source files from the repo, not build output, so no dependency on site deploy.
- **D-03:** Concurrency group with cancel-in-progress — if a new push arrives while RAG sync is running, cancel the old run. Same pattern as `gh-pages.yml`.

### Trigger Scope
- **D-04:** Content-filtered paths trigger — only run when `docs/**`, `specs/**`, or `scripts/prepare-rag-content/**` change. Skips sync for CSS/config/infra-only changes.
- **D-05:** Manual trigger via `workflow_dispatch` — adds "Run workflow" button in GitHub Actions UI for initial setup, debugging, or forcing re-ingestion without a code push.

### Failure Handling
- **D-06:** Workflow fails normally on error — since it's a separate workflow, failures don't affect `deploy.yml`. Team gets standard GitHub Actions failure notification.
- **D-07:** Fire-and-forget for Bedrock ingestion — start the ingestion job and finish. No polling for completion. Bedrock ingestion runs asynchronously.

### Secret & Config Management
- **D-08:** Stored AWS credentials (AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY) as repository-level GitHub secrets for eu-central-1 access. Not OIDC.
- **D-09:** RAG_CONTENT_BUCKET, KB_ID, DATA_SOURCE_ID stored as GitHub repository variables (vars context) — these are resource identifiers, not sensitive.

### CloudFormation Resource Tagging
- **D-10:** All AWS resources created via CloudFormation must have two tags: `environment: dev` and `component: ai`. This applies to existing `infrastructure/template.yaml` resources as well.

### Claude's Discretion
- Workflow job structure (single job vs multi-job)
- Node.js setup and caching strategy in the workflow
- Whether to upload manifest as workflow artifact for debugging
- Exact paths filter list (beyond docs/specs/scripts)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Existing Workflows
- `.github/workflows/deploy.yml` — Production CI/CD pipeline. Must NOT be modified (CICD-02).
- `.github/workflows/gh-pages.yml` — GitHub Pages workflow. Reference for concurrency group pattern.

### RAG Scripts (Phase 5)
- `scripts/prepare-rag-content.ts` — Preprocessing script that outputs to `.rag-content/chunks/`
- `scripts/sync-rag-to-s3.ts` — S3 upload + optional `--start-ingestion` flag for Bedrock KB
- `scripts/prepare-rag-content/` — Module directory (strip-mdx, chunk-by-headings, extract-openapi, generate-metadata)

### Infrastructure
- `infrastructure/template.yaml` — CloudFormation template with Lambda, WAF, S3 bucket, Bedrock KB resources. Needs `environment: dev` and `component: ai` tags on all resources.

### Requirements
- `.planning/REQUIREMENTS.md` — CICD-01, CICD-02 acceptance criteria

### Prior Phase Context
- `.planning/phases/05-ai-backend-and-content-pipeline/05-CONTEXT.md` — RAG content design decisions (D-04 through D-07), eu-central-1 region choice

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `scripts/prepare-rag-content.ts` — Already built, outputs `.rag-content/chunks/` with manifest
- `scripts/sync-rag-to-s3.ts` — Already built, accepts env vars for bucket/region/KB IDs, supports `--start-ingestion`
- `gh-pages.yml` — Reference for concurrency group and cancel-in-progress pattern

### Established Patterns
- `deploy.yml` uses OIDC auth via `aws-actions/configure-aws-credentials@v6` (but RAG sync will use stored credentials per D-08)
- `deploy.yml` uses `actions/setup-node@v4` with Node 20 and npm cache
- `gh-pages.yml` uses concurrency group with `cancel-in-progress: true`
- Scripts run via `npx tsx scripts/<name>.ts`

### Integration Points
- New `rag-sync.yml` workflow file in `.github/workflows/`
- GitHub repository variables: `RAG_CONTENT_BUCKET`, `KB_ID`, `DATA_SOURCE_ID`
- GitHub repository secrets: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` (eu-central-1 scoped)
- `infrastructure/template.yaml` — needs tag additions on all resources

</code_context>

<specifics>
## Specific Ideas

- CloudFormation tags are a deployment prerequisite — `environment: dev` and `component: ai` must be present on all resources or deployment may be blocked by organizational policies.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 07-ci-cd-integration*
*Context gathered: 2026-03-23*
