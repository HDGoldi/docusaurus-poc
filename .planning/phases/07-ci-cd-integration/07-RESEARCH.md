# Phase 7: CI/CD Integration - Research

**Researched:** 2026-03-23
**Domain:** GitHub Actions workflow automation, AWS credential management, CloudFormation tagging
**Confidence:** HIGH

## Summary

Phase 7 wires two existing scripts -- `scripts/prepare-rag-content.ts` (content preprocessing) and `scripts/sync-rag-to-s3.ts` (S3 upload + Bedrock ingestion trigger) -- into a new GitHub Actions workflow (`rag-sync.yml`). The workflow runs on push to main when doc/spec/script content changes, and is fully isolated from the existing `deploy.yml` production pipeline. Additionally, all CloudFormation resources in `infra/rag-stack.yaml` and `infra/template.yaml` need `environment: dev` and `component: ai` tags per D-10.

This is a straightforward integration phase. Both scripts already exist and work locally. The workflow needs to: check out the repo, install dependencies, run prepare-rag-content, run sync-rag-to-s3 with `--start-ingestion`, and use stored AWS credentials (not OIDC). The concurrency group pattern from `gh-pages.yml` provides the exact model to follow.

**Primary recommendation:** Create a single-job workflow in `.github/workflows/rag-sync.yml` that mirrors the `gh-pages.yml` structure (concurrency group, cancel-in-progress), adds path filters per D-04, uses stored AWS secrets per D-08, and fires-and-forgets the Bedrock ingestion per D-07.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Separate workflow file (`rag-sync.yml`) -- fully isolated from `deploy.yml` and `gh-pages.yml`. Satisfies CICD-02.
- **D-02:** Runs concurrently with `deploy.yml` on push to main -- RAG sync reads source files from repo, not build output.
- **D-03:** Concurrency group with cancel-in-progress -- same pattern as `gh-pages.yml`.
- **D-04:** Content-filtered paths trigger -- only run when `docs/**`, `specs/**`, or `scripts/prepare-rag-content/**` change.
- **D-05:** Manual trigger via `workflow_dispatch`.
- **D-06:** Workflow fails normally on error -- separate workflow means failures don't affect `deploy.yml`.
- **D-07:** Fire-and-forget for Bedrock ingestion -- start the job and finish. No polling.
- **D-08:** Stored AWS credentials (AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY) as repository-level GitHub secrets for eu-central-1.
- **D-09:** RAG_CONTENT_BUCKET, KB_ID, DATA_SOURCE_ID stored as GitHub repository variables (vars context).
- **D-10:** All AWS resources created via CloudFormation must have tags: `environment: dev` and `component: ai`. Applies to both `infra/rag-stack.yaml` and `infra/template.yaml`.

### Claude's Discretion
- Workflow job structure (single job vs multi-job)
- Node.js setup and caching strategy in the workflow
- Whether to upload manifest as workflow artifact for debugging
- Exact paths filter list (beyond docs/specs/scripts)

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CICD-01 | Knowledge Base content sync integrated into deploy workflow | New `rag-sync.yml` workflow runs prepare-rag-content.ts then sync-rag-to-s3.ts with --start-ingestion on push to main |
| CICD-02 | Existing AWS production deploy workflow unchanged | Separate workflow file (D-01), `deploy.yml` is never modified |
</phase_requirements>

## Standard Stack

### Core
| Technology | Version | Purpose | Why Standard |
|------------|---------|---------|--------------|
| GitHub Actions | v2 workflow syntax | CI/CD automation | Already used by deploy.yml and gh-pages.yml in this project |
| actions/checkout | v4 | Repository checkout | Standard, already used in deploy.yml and gh-pages.yml |
| actions/setup-node | v4 | Node.js 20 setup with npm cache | Standard, already used in deploy.yml and gh-pages.yml |
| aws-actions/configure-aws-credentials | v6 | AWS credential configuration | Already used in deploy.yml (OIDC mode); RAG sync uses static keys per D-08 |

### Supporting
| Technology | Purpose | When to Use |
|------------|---------|-------------|
| actions/upload-artifact | v4 | Upload manifest.json as workflow artifact for debugging (Claude's discretion) |
| npx tsx | Run TypeScript scripts directly | Already established pattern for prepare-rag-content.ts and sync-rag-to-s3.ts |

**No new packages needed.** All dependencies already exist in the project (`tsx`, `@aws-sdk/client-s3`, `@aws-sdk/client-bedrock-agent`, `glob`).

## Architecture Patterns

### Workflow File Structure
```yaml
# .github/workflows/rag-sync.yml
name: RAG Content Sync

on:
  push:
    branches: [main]
    paths:
      - 'docs/**'
      - 'specs/**'
      - 'scripts/prepare-rag-content/**'
      - 'scripts/prepare-rag-content.ts'
      - 'scripts/sync-rag-to-s3.ts'
  workflow_dispatch:  # Manual trigger per D-05

permissions:
  contents: read

concurrency:
  group: rag-sync
  cancel-in-progress: true  # Per D-03, same pattern as gh-pages.yml
```

### Pattern 1: Single Job (Recommended)
**What:** One job with sequential steps: checkout, setup-node, npm ci, run prepare, run sync.
**When to use:** When all steps share the same runner environment and there's no parallelism opportunity.
**Why single job:** prepare-rag-content outputs to `.rag-content/` which sync-rag-to-s3 reads. Multi-job would require artifact passing between jobs, adding complexity for zero benefit. Both scripts run in under 60 seconds total.

### Pattern 2: AWS Credentials via Static Keys
**What:** Use `aws-actions/configure-aws-credentials@v6` with `aws-access-key-id` and `aws-secret-access-key` parameters instead of `role-to-assume` (OIDC).
**Why:** Per D-08, stored credentials for eu-central-1. The existing deploy.yml uses OIDC for us-east-1, but Bedrock/S3 resources are in eu-central-1 with a different auth path.

```yaml
- uses: aws-actions/configure-aws-credentials@v6
  with:
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    aws-region: eu-central-1
```

### Pattern 3: Environment Variables from GitHub Vars
**What:** Pass resource identifiers via `vars` context per D-09.
```yaml
env:
  RAG_CONTENT_BUCKET: ${{ vars.RAG_CONTENT_BUCKET }}
  KB_ID: ${{ vars.KB_ID }}
  DATA_SOURCE_ID: ${{ vars.DATA_SOURCE_ID }}
```

### Pattern 4: CloudFormation Tag Addition
**What:** Add `Tags` property to all resources in both `infra/rag-stack.yaml` and `infra/template.yaml`.
**How:** CloudFormation supports `Tags` on most resource types. For resources that support tags directly (S3 buckets, Lambda functions, IAM roles, CloudFront distributions), add:
```yaml
Tags:
  - Key: environment
    Value: dev
  - Key: component
    Value: ai
```

**Important exceptions:**
- `AWS::Lambda::Url` does NOT support Tags.
- `AWS::Lambda::Permission` does NOT support Tags.
- `AWS::CloudFront::Function` does NOT support Tags directly (use `Tags` at stack level or skip).
- `AWS::CloudFront::OriginAccessControl` does NOT support Tags.
- `AWS::CloudFront::ResponseHeadersPolicy` does NOT support Tags.
- `AWS::IAM::OIDCProvider` supports Tags.
- `AWS::Route53::RecordSet` does NOT support Tags.
- `AWS::CertificateManager::Certificate` supports Tags.
- `AWS::S3::BucketPolicy` does NOT support Tags (it's a policy, not a resource).
- `AWS::WAFv2::WebACL` supports Tags.
- `AWS::Bedrock::KnowledgeBase` supports Tags.
- `AWS::Bedrock::DataSource` does NOT support Tags directly (tags go on the KB).

**Confidence:** MEDIUM -- CloudFormation tag support varies by resource type. The planner should verify against the current CloudFormation resource reference for each type being tagged.

### Anti-Patterns to Avoid
- **Modifying deploy.yml:** Violates CICD-02. All RAG sync logic goes in the new workflow.
- **Polling Bedrock ingestion status:** Per D-07, fire-and-forget. StartIngestionJob returns immediately; ingestion runs asynchronously.
- **Using `npm install` instead of `npm ci`:** CI should use `npm ci` for deterministic installs from lockfile.
- **Installing devDependencies separately:** `@aws-sdk/client-s3` and `@aws-sdk/client-bedrock-agent` are already in the project's devDependencies. `npm ci` installs them.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| AWS credential management in workflow | Manual env var export | `aws-actions/configure-aws-credentials@v6` | Handles credential cleanup, session expiry, and region configuration |
| Node.js caching in CI | Manual `~/.npm` cache logic | `actions/setup-node@v4` with `cache: npm` | Built-in npm cache support, already proven in deploy.yml |

## Common Pitfalls

### Pitfall 1: Path Filters Don't Trigger on workflow_dispatch
**What goes wrong:** `paths` filter only applies to `push` events. `workflow_dispatch` always triggers regardless of paths.
**Why it happens:** GitHub Actions path filters are event-specific.
**How to avoid:** This is actually desired behavior -- D-05 wants manual trigger to work unconditionally for debugging and forced re-ingestion.
**Warning signs:** None -- this is correct behavior.

### Pitfall 2: npm ci Needs package-lock.json
**What goes wrong:** `npm ci` fails if `package-lock.json` is missing or out of sync with `package.json`.
**Why it happens:** `npm ci` is strict by design.
**How to avoid:** The project already has a `package-lock.json` committed. Ensure it stays committed.
**Warning signs:** CI failure with "npm ERR! `npm ci` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync."

### Pitfall 3: devDependencies Not Installed in CI
**What goes wrong:** `@aws-sdk/client-s3` and `@aws-sdk/client-bedrock-agent` are devDependencies. If `npm ci --omit=dev` is used, they won't be available.
**Why it happens:** Some CI templates use `--omit=dev` or `--production` for optimization.
**How to avoid:** Use plain `npm ci` (no flags). The scripts need devDependencies.
**Warning signs:** Module not found errors for `@aws-sdk/*` packages.

### Pitfall 4: Tags on Unsupported CloudFormation Resources
**What goes wrong:** CloudFormation deployment fails if you add `Tags` to a resource type that doesn't support them.
**Why it happens:** Not all AWS resources support tagging via CloudFormation.
**How to avoid:** Only add Tags to resource types that support the `Tags` property. See the list in Architecture Patterns > Pattern 4 above.
**Warning signs:** CloudFormation error: "Encountered unsupported property Tags."

### Pitfall 5: Concurrent Push Overwriting RAG Content
**What goes wrong:** Two rapid pushes to main could cause overlapping S3 uploads.
**Why it happens:** Without concurrency control, both workflows run in parallel.
**How to avoid:** D-03 mandates `cancel-in-progress: true` in the concurrency group. The older run is cancelled when a new push arrives.
**Warning signs:** None if concurrency group is correctly configured.

## Code Examples

### Complete Workflow Structure
```yaml
# Source: project patterns from gh-pages.yml + deploy.yml
name: RAG Content Sync

on:
  push:
    branches: [main]
    paths:
      - 'docs/**'
      - 'specs/**'
      - 'scripts/prepare-rag-content/**'
      - 'scripts/prepare-rag-content.ts'
      - 'scripts/sync-rag-to-s3.ts'
  workflow_dispatch:

permissions:
  contents: read

concurrency:
  group: rag-sync
  cancel-in-progress: true

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci

      - name: Preprocess RAG content
        run: npx tsx scripts/prepare-rag-content.ts

      - uses: aws-actions/configure-aws-credentials@v6
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: eu-central-1

      - name: Sync to S3 and start ingestion
        env:
          RAG_CONTENT_BUCKET: ${{ vars.RAG_CONTENT_BUCKET }}
          KB_ID: ${{ vars.KB_ID }}
          DATA_SOURCE_ID: ${{ vars.DATA_SOURCE_ID }}
        run: npx tsx scripts/sync-rag-to-s3.ts --start-ingestion
```

### CloudFormation Tag Addition Pattern
```yaml
# For S3 Bucket
RagContentBucket:
  Type: AWS::S3::Bucket
  Properties:
    BucketName: !Ref RagContentBucketName
    Tags:
      - Key: environment
        Value: dev
      - Key: component
        Value: ai
    # ... rest of properties

# For Lambda Function
ChatFunction:
  Type: AWS::Lambda::Function
  Properties:
    Tags:
      - Key: environment
        Value: dev
      - Key: component
        Value: ai
    # ... rest of properties
```

## Existing Code Inventory

### Files to CREATE
| File | Purpose |
|------|---------|
| `.github/workflows/rag-sync.yml` | New RAG sync workflow (CICD-01) |

### Files to MODIFY
| File | Change | Purpose |
|------|--------|---------|
| `infra/rag-stack.yaml` | Add `environment: dev` and `component: ai` tags to all supported resources | D-10 compliance |
| `infra/template.yaml` | Add `environment: dev` and `component: ai` tags to all supported resources | D-10 compliance |

### Files NOT to MODIFY
| File | Reason |
|------|--------|
| `.github/workflows/deploy.yml` | CICD-02 -- must remain unchanged |
| `.github/workflows/gh-pages.yml` | Out of scope |
| `scripts/prepare-rag-content.ts` | Already works as-is |
| `scripts/sync-rag-to-s3.ts` | Already works as-is, accepts env vars and --start-ingestion flag |

### Resources in rag-stack.yaml That Support Tags
| Resource | Logical ID | Supports Tags |
|----------|------------|---------------|
| AWS::S3::Bucket | RagContentBucket | YES |
| AWS::IAM::Role | BedrockKBRole | YES |
| AWS::Bedrock::KnowledgeBase | KnowledgeBase | YES |
| AWS::Bedrock::DataSource | KnowledgeBaseDataSource | NO |
| AWS::IAM::Role | ChatFunctionRole | YES |
| AWS::Lambda::Function | ChatFunction | YES |
| AWS::Lambda::Url | ChatFunctionUrl | NO |
| AWS::Lambda::Permission | ChatFunctionUrlPermission | NO |
| AWS::CloudFront::ResponseHeadersPolicy | ChatApiResponseHeadersPolicy | NO |
| AWS::CloudFront::Distribution | ChatApiDistribution | YES |
| AWS::WAFv2::WebACL | ChatWafWebAcl | YES |

### Resources in template.yaml That Support Tags
| Resource | Logical ID | Supports Tags |
|----------|------------|---------------|
| AWS::S3::Bucket | ProdBucket | YES |
| AWS::S3::Bucket | PreviewBucket | YES |
| AWS::CloudFront::OriginAccessControl | OriginAccessControl | NO |
| AWS::CloudFront::Function | SpaRewriteFunction | NO |
| AWS::CertificateManager::Certificate | Certificate | YES |
| AWS::CloudFront::Distribution | ProdDistribution | YES |
| AWS::CloudFront::Distribution | PreviewDistribution | YES |
| AWS::S3::BucketPolicy | ProdBucketPolicy | NO |
| AWS::S3::BucketPolicy | PreviewBucketPolicy | NO |
| AWS::Route53::RecordSet | DnsRecord | NO |
| AWS::Route53::RecordSet | DnsRecordIPv6 | NO |
| AWS::IAM::OIDCProvider | GitHubOidcProvider | YES |
| AWS::IAM::Role | GitHubActionsRole | YES |

## Open Questions

1. **CloudFormation tag support accuracy**
   - What we know: Most major resource types support Tags, but some do not (Lambda URL, Permissions, BucketPolicy, RecordSet).
   - What's unclear: The exact tag support for `AWS::CloudFront::ResponseHeadersPolicy` and `AWS::Bedrock::DataSource` -- these are newer resource types where CloudFormation documentation may have evolved.
   - Recommendation: Add tags to resources where we're confident they're supported. If a deployment fails on a specific resource's Tags, remove them. LOW risk since tag addition is additive.

## Sources

### Primary (HIGH confidence)
- `.github/workflows/deploy.yml` -- existing workflow patterns, action versions
- `.github/workflows/gh-pages.yml` -- concurrency group pattern, Node.js setup
- `scripts/prepare-rag-content.ts` -- script interface, output directory
- `scripts/sync-rag-to-s3.ts` -- env vars (RAG_CONTENT_BUCKET, KB_ID, DATA_SOURCE_ID), --start-ingestion flag
- `infra/rag-stack.yaml` -- existing CloudFormation resources to tag
- `infra/template.yaml` -- existing CloudFormation resources to tag
- `package.json` -- confirms @aws-sdk packages in devDependencies

### Secondary (MEDIUM confidence)
- GitHub Actions workflow syntax documentation -- path filters, concurrency groups, permissions
- CloudFormation resource reference -- tag support per resource type

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all components already exist in the project, no new dependencies
- Architecture: HIGH -- workflow pattern directly mirrors existing gh-pages.yml
- Pitfalls: HIGH -- based on direct inspection of existing scripts and workflow files
- CloudFormation tags: MEDIUM -- tag support varies by resource type, some newer types may differ

**Research date:** 2026-03-23
**Valid until:** 2026-04-23 (stable -- GitHub Actions and CloudFormation are mature)
