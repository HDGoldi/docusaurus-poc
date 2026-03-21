---
phase: 03-infrastructure-and-deployment
verified: 2026-03-21T19:00:00Z
status: human_needed
score: 9/9 must-haves verified
re_verification: false
human_verification:
  - test: "Deploy CloudFormation stack and confirm site loads at https://help.1nce.com"
    expected: "Browser loads the 1NCE Developer Hub homepage with valid SSL certificate (padlock shown, no certificate warning)"
    why_human: "Stack deployment requires AWS account credentials, HostedZoneId, and actual DNS propagation. Cannot verify live URL programmatically from this environment."
  - test: "Merge a test PR to main and observe the GitHub Actions pipeline"
    expected: "deploy-production job requires manual approval via the 'production' environment protection rule before proceeding, then syncs to S3 and invalidates CloudFront cache"
    why_human: "Requires a live GitHub repository with environment protection rules configured. Cannot simulate the GitHub environment gate programmatically."
  - test: "Open a PR and check PR comments"
    expected: "A comment appears on the PR with a preview URL of the form https://{PREVIEW_CF_DISTRIBUTION_DOMAIN}/pr-{N}/"
    why_human: "Requires a live GitHub repository and deployed preview environment. Cannot simulate github-script comment posting locally."
  - test: "Access a deep-link URL directly (e.g. https://help.1nce.com/docs/1nce-os/1nce-os-overview/)"
    expected: "Page loads correctly without a 403 or 404 error — the CloudFront Function rewrites the URI to the correct S3 object"
    why_human: "Requires live CloudFront distribution and deployed S3 content. SPA routing can only be verified against a deployed stack."
---

# Phase 3: Infrastructure and Deployment Verification Report

**Phase Goal:** The site is live at help.1nce.com with automated deployments on merge to main
**Verified:** 2026-03-21T19:00:00Z
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | CloudFormation template defines all AWS resources needed for production and preview hosting | VERIFIED | `infra/template.yaml` contains exactly 13 resource declarations covering all required types |
| 2 | S3 buckets are private, accessible only via CloudFront OAC | VERIFIED | Both ProdBucket and PreviewBucket have all four `PublicAccessBlockConfiguration` flags true; bucket policies grant access only to `cloudfront.amazonaws.com` principal with `AWS:SourceArn` condition scoped to the correct distribution |
| 3 | CloudFront Function rewrites SPA paths to index.html | VERIFIED | `infra/cf-function.js` contains `uri.endsWith('/')` and `!uri.includes('.')` cases; identical logic inlined into `SpaRewriteFunction` in `template.yaml`; both distributions reference the function via `FunctionAssociations` |
| 4 | ACM certificate is provisioned in us-east-1 with DNS validation | VERIFIED | `Certificate` resource uses `ValidationMethod: DNS` and `DomainValidationOptions` with `HostedZoneId: !Ref HostedZoneId`; template deployed in us-east-1 by design |
| 5 | Route 53 alias record points help.1nce.com to CloudFront | VERIFIED | `DnsRecord` (Type A) and `DnsRecordIPv6` (Type AAAA) both use `AliasTarget` with CloudFront's fixed hosted zone `Z2FDTNDATAQYW2` pointing to `ProdDistribution.DomainName` |
| 6 | Push to main triggers build validation, then production deploy with manual approval gate | VERIFIED | `deploy.yml` has `deploy-production` job with `if: github.ref == 'refs/heads/main' && github.event_name == 'push'`, `needs: validate`, and `environment: production` (GitHub environment protection rule provides the approval gate) |
| 7 | Pull requests trigger build validation and preview deployment to S3 preview bucket | VERIFIED | `deploy-preview` job has `if: github.event_name == 'pull_request'`, `needs: validate`; syncs to `s3://1nce-developer-hub-preview/pr-${{ github.event.number }}/`; posts comment with preview URL |
| 8 | PR close triggers cleanup of preview deployment from S3 | VERIFIED | `.github/workflows/cleanup-preview.yml` triggers on `pull_request: types: [closed]`; runs `aws s3 rm s3://1nce-developer-hub-preview/pr-${{ github.event.number }}/ --recursive` |
| 9 | Pipeline authenticates to AWS via OIDC with no stored secrets | VERIFIED | Both workflows use `aws-actions/configure-aws-credentials@v6` with `role-to-assume: ${{ vars.AWS_ROLE_ARN }}`; `id-token: write` permission declared at workflow level; IAM OIDC provider and role defined in `template.yaml` with `StringLike` sub-claim trust policy |

**Score:** 9/9 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `infra/template.yaml` | CloudFormation template with all AWS resources | VERIFIED | Present, 320 lines, 13 resource declarations, all required sections (Parameters, Resources, Outputs) present |
| `infra/cf-function.js` | CloudFront Function source for SPA routing | VERIFIED | Present, 23 lines, contains `async function handler`, both URI rewrite cases, runtime comment |
| `.github/workflows/deploy.yml` | Main CI/CD pipeline | VERIFIED | Present, 97 lines, three jobs (validate, deploy-preview, deploy-production), OIDC auth, CloudFront invalidation, smoke test |
| `.github/workflows/cleanup-preview.yml` | PR preview cleanup workflow | VERIFIED | Present, 23 lines, triggers on PR close, deletes preview S3 prefix recursively |
| `lighthouserc.json` | Lighthouse CI configuration | VERIFIED | Present, 24 lines, `staticDistDir: ./build`, performance warn 0.8, accessibility error 0.9, SEO/best-practices warn 0.9 |
| `scripts/smoke-test.sh` | Pre-launch URL smoke test | VERIFIED | Present, 39 lines, executable (`chmod +x` confirmed), `set -euo pipefail`, 6 URLs, exits 1 on failure |

### Key Link Verification

| From | To | Via | Status | Details |
|------|-----|-----|--------|---------|
| `infra/template.yaml` | `infra/cf-function.js` | FunctionCode inline | VERIFIED | CF function body is inlined verbatim in `SpaRewriteFunction.FunctionCode`; logic matches standalone file. Template does not contain the filename string "cf-function" — the link is satisfied by inlining, which is what the plan specified. |
| `infra/template.yaml ProdBucketPolicy` | `infra/template.yaml ProdDistribution` | `GetAtt.*ProdDistribution` in bucket policy condition | VERIFIED | `AWS:SourceArn: !Sub "arn:aws:cloudfront::${AWS::AccountId}:distribution/${ProdDistribution}"` at line 196; separate resource avoids circular dependency |
| `.github/workflows/deploy.yml` | `infra/template.yaml` | `AWS_ROLE_ARN` variable references stack outputs | VERIFIED | `role-to-assume: ${{ vars.AWS_ROLE_ARN }}` in both AWS credential steps; `CF_DISTRIBUTION_ID` for invalidation; all map to CloudFormation Outputs (`GitHubActionsRoleArn`, `ProdDistributionId`) |
| `.github/workflows/deploy.yml` | `lighthouserc.json` | `treosh/lighthouse-ci-action` reads config | VERIFIED | `configPath: ./lighthouserc.json` at line 38 |
| `.github/workflows/deploy.yml` | `scripts/smoke-test.sh` | smoke test step runs script | VERIFIED | `bash scripts/smoke-test.sh https://${{ vars.PROD_CF_DISTRIBUTION_DOMAIN }}` at line 96 |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| INFRA-01 | 03-01-PLAN.md | S3 bucket configured for static website hosting | SATISFIED | `ProdBucket` (1nce-developer-hub-prod) and `PreviewBucket` (1nce-developer-hub-preview) in template.yaml; no website endpoint — uses REST endpoint with OAC (correct per security requirements) |
| INFRA-02 | 03-01-PLAN.md | CloudFront distribution with Origin Access Control (OAC) | SATISFIED | `OriginAccessControl` resource with `SigningBehavior: always`, `SigningProtocol: sigv4`; both distributions reference OAC via `OriginAccessControlId` |
| INFRA-03 | 03-01-PLAN.md | SSL certificate via ACM in us-east-1 for help.1nce.com | SATISFIED | `Certificate` resource with `DomainName: !Ref DomainName` (default: help.1nce.com), `ValidationMethod: DNS`, stack deploys to us-east-1 |
| INFRA-04 | 03-01-PLAN.md | Route 53 DNS alias records pointing to CloudFront | SATISFIED | `DnsRecord` (A) and `DnsRecordIPv6` (AAAA) alias to `ProdDistribution.DomainName` with CloudFront hosted zone ID Z2FDTNDATAQYW2 |
| INFRA-05 | 03-01-PLAN.md | CloudFront Function for SPA routing (index.html rewrite) | SATISFIED | `SpaRewriteFunction` with `AutoPublish: true`, `Runtime: cloudfront-js-2.0`; attached as viewer-request to both distributions |
| INFRA-06 | 03-02-PLAN.md | GitHub Actions CI/CD pipeline with OIDC auth to AWS | SATISFIED | `deploy.yml` uses `aws-actions/configure-aws-credentials@v6` with `role-to-assume`; `id-token: write` permission; IAM OIDC provider and role in template.yaml |
| INFRA-07 | 03-02-PLAN.md | Automated build + S3 sync + CloudFront cache invalidation on merge to main | SATISFIED | `deploy-production` job runs `npm run build` (via validate job), `aws s3 sync` (two-tier cache), `aws cloudfront create-invalidation --paths "/*"` |

**Coverage:** 7/7 INFRA requirements covered. All IDs claimed across plans 03-01 (INFRA-01 through INFRA-05) and 03-02 (INFRA-06, INFRA-07). No orphaned requirements for Phase 3.

### Anti-Patterns Found

None. Scan of all 6 phase artifacts found no TODO/FIXME/placeholder comments, no empty stub implementations, no hardcoded return values where real logic is expected.

Notable notes (informational, not blockers):

| File | Note | Severity |
|------|------|----------|
| `infra/template.yaml` | The `cf-function.js` filename does not appear as a string reference in the template — the function body is fully inlined. This is by design (CloudFormation requires inline FunctionCode or S3 reference; S3 reference was not used). Standalone `cf-function.js` serves as readable source-of-truth. | Info |
| `lighthouserc.json` | Only 2 URLs configured for Lighthouse CI (`/` and `/docs/1nce-os/1nce-os-overview/`). Smoke test checks 6 URLs but Lighthouse checks fewer. This is acceptable — Lighthouse tests are performance-intensive and 2 representative pages is standard practice. | Info |

### Human Verification Required

#### 1. Site Live at https://help.1nce.com

**Test:** Deploy the CloudFormation stack (`aws cloudformation deploy --template-file infra/template.yaml --stack-name 1nce-developer-hub --parameter-overrides HostedZoneId=XXXXX GitHubOrg=XXXXX GitHubRepo=XXXXX --capabilities CAPABILITY_IAM --region us-east-1`), then navigate to https://help.1nce.com in a browser.
**Expected:** Developer Hub homepage loads with a valid SSL certificate, 1NCE branding visible, no certificate warning.
**Why human:** Requires AWS account access, real Route 53 hosted zone ID, DNS propagation time, and a browser to verify SSL trust.

#### 2. Production Deployment with Manual Approval Gate

**Test:** Merge a commit to `main` on the GitHub repository (after configuring the `production` environment with required reviewers in GitHub Settings).
**Expected:** The `validate` job runs automatically; `deploy-production` job is queued and paused awaiting manual approval; after approval, S3 sync and CloudFront invalidation complete successfully.
**Why human:** Requires a live GitHub repository with environment protection rules configured. The gate behavior cannot be simulated locally.

#### 3. PR Preview Deployment and Cleanup

**Test:** Open a pull request targeting `main`.
**Expected:** A comment appears on the PR with URL `https://{PREVIEW_CF_DISTRIBUTION_DOMAIN}/pr-{N}/`. When the PR is closed/merged, the preview prefix is deleted from S3.
**Why human:** Requires a deployed GitHub repository and live AWS environment with the preview environment variable set.

#### 4. Deep-Link SPA Routing

**Test:** After deploying, access a deep URL directly (e.g., `https://help.1nce.com/docs/1nce-os/1nce-os-overview/`) without navigating from the homepage.
**Expected:** Page loads correctly — CloudFront Function rewrites `/docs/1nce-os/1nce-os-overview/` to `/docs/1nce-os/1nce-os-overview/index.html` and S3 returns the correct file.
**Why human:** SPA routing behavior can only be verified against a live CloudFront distribution serving real S3 content.

### Summary

All 9 observable truths are verified programmatically. All 6 required artifacts exist, are substantive (not stubs), and are correctly wired to each other. All 7 INFRA requirements (INFRA-01 through INFRA-07) are covered by the two plans with no orphaned IDs. No anti-patterns detected.

The phase goal — "The site is live at help.1nce.com with automated deployments on merge to main" — is partially achieved:

- **Infrastructure code: complete.** Every AWS resource needed to serve the site is defined in version-controlled IaC. The CI/CD pipeline is fully implemented with OIDC auth, preview deploys, approval gates, cache invalidation, and smoke testing.
- **Go-live: requires human execution.** The CloudFormation stack must be deployed to an AWS account and GitHub environments must be configured. This is the expected model for an IaC phase — the code is done, the deployment is a human operational step.

The four human verification items cover the go-live steps and cannot be automated from this environment.

---

_Verified: 2026-03-21T19:00:00Z_
_Verifier: Claude (gsd-verifier)_
