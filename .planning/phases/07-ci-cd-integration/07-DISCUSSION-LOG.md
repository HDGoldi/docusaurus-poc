# Phase 7: CI/CD Integration - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-23
**Phase:** 07-ci-cd-integration
**Areas discussed:** Workflow placement, Trigger scope, Failure handling, Secret management

---

## Workflow Placement

| Option | Description | Selected |
|--------|-------------|----------|
| New job in deploy.yml | Add sync-knowledge-base job after deploy-production. Needs second AWS credentials step for eu-central-1. | |
| Separate workflow file | New rag-sync.yml triggered on push to main. Fully isolated from deploy.yml. | ✓ |
| Extend gh-pages.yml | Add RAG sync to GitHub Pages workflow. Couples KB updates to GH Pages deploys. | |

**User's choice:** Separate workflow file
**Notes:** None

### Follow-up: Timing

| Option | Description | Selected |
|--------|-------------|----------|
| Concurrent | Both trigger on push to main independently. RAG sync reads source files, not build output. | ✓ |
| After deploy succeeds | Use workflow_run trigger. Adds ~2-3 min latency. | |

**User's choice:** Concurrent

### Follow-up: Concurrency

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, cancel-in-progress | Like gh-pages.yml — cancel old run on new push. | ✓ |
| No, let all runs complete | Every push completes its full sync. | |

**User's choice:** Yes, cancel-in-progress

---

## Trigger Scope

| Option | Description | Selected |
|--------|-------------|----------|
| Content-filtered | Only trigger when docs/**, specs/**, or scripts/prepare-rag-content/** change. | ✓ |
| Every push to main | Always run RAG sync on any push to main. Simpler but wasteful. | |

**User's choice:** Content-filtered

### Follow-up: Manual trigger

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, add workflow_dispatch | Adds "Run workflow" button for ad-hoc re-syncs. | ✓ |
| No, push-only | Only triggers on push to main. | |

**User's choice:** Yes, add workflow_dispatch

---

## Failure Handling

| Option | Description | Selected |
|--------|-------------|----------|
| Fail the workflow | Standard behavior — shows as failed. Doesn't affect deploy.yml since separate workflow. | ✓ |
| Continue on error | Mark steps as continue-on-error. Hides failures. | |

**User's choice:** Fail the workflow

### Follow-up: Ingestion verification

| Option | Description | Selected |
|--------|-------------|----------|
| Fire and forget | Start ingestion job and finish. No polling. | ✓ |
| Poll until complete | Wait for Bedrock ingestion to finish. Adds 1-5 min. | |
| Log job ID only | Start ingestion, log job ID. Manual check via Console. | |

**User's choice:** Fire and forget

---

## Secret Management

### AWS Credentials

| Option | Description | Selected |
|--------|-------------|----------|
| OIDC role | Same pattern as deploy.yml. No stored secrets. | |
| Stored AWS credentials | AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY as GitHub secrets. | ✓ |

**User's choice:** Stored AWS credentials

### Resource identifiers

| Option | Description | Selected |
|--------|-------------|----------|
| GitHub vars (non-secret) | Repository variables. Easy to view and update. | ✓ |
| GitHub secrets | Encrypted secrets. Overkill for resource IDs. | |
| Hardcoded in workflow | Values directly in YAML. Requires commit to change. | |

**User's choice:** GitHub vars (non-secret)

### Credential scope

| Option | Description | Selected |
|--------|-------------|----------|
| Repository-level secrets | Simple, available to all workflow jobs. | ✓ |
| Environment-scoped | Create 'rag-sync' environment. More setup. | |

**User's choice:** Repository-level secrets

---

## Additional User Input

**CloudFormation tags:** User specified that all AWS resources in CloudFormation must have two tags:
- `environment: dev`
- `component: ai`

This is an organizational requirement that may block deployment if missing. Applies to existing `infrastructure/template.yaml` resources.

## Claude's Discretion

- Workflow job structure (single vs multi-job)
- Node.js setup and caching strategy
- Whether to upload manifest as workflow artifact
- Exact paths filter list

## Deferred Ideas

None.
