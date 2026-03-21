---
phase: 03-infrastructure-and-deployment
plan: 01
subsystem: infra
tags: [cloudformation, s3, cloudfront, acm, route53, iam, oidc, spa-routing]

requires:
  - phase: 02-site-assembly
    provides: Docusaurus site with build output for S3 hosting
provides:
  - CloudFormation template defining all AWS infrastructure
  - CloudFront Function for SPA routing
  - IAM OIDC provider and role for GitHub Actions CI/CD
affects: [03-02, deployment, ci-cd]

tech-stack:
  added: [CloudFormation, CloudFront Functions cloudfront-js-2.0]
  patterns: [Single CF template for all resources, OAC not OAI, separate bucket policies to avoid circular deps]

key-files:
  created:
    - infra/template.yaml
    - infra/cf-function.js
  modified: []

key-decisions:
  - "Deploy entire stack in us-east-1 for ACM cert compatibility with CloudFront"
  - "S3 buckets use REST endpoint (not website endpoint) with OAC for security"
  - "Bucket policies are separate AWS::S3::BucketPolicy resources to avoid circular dependencies"
  - "GitHub OIDC trust policy uses StringLike on sub claim scoped to specific repo"

patterns-established:
  - "CloudFormation parameters for environment-specific values (no hardcoded account IDs)"
  - "CloudFront Function for SPA routing instead of Lambda@Edge"
  - "OAC with sigv4 signing for S3 origin access"

requirements-completed: [INFRA-01, INFRA-02, INFRA-03, INFRA-04, INFRA-05]

duration: 2min
completed: 2026-03-21
---

# Phase 3 Plan 1: AWS Infrastructure Summary

**CloudFormation template with 13 AWS resources (S3, CloudFront with OAC, ACM, Route 53, IAM OIDC) and CloudFront Function for Docusaurus SPA routing**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-21T17:46:38Z
- **Completed:** 2026-03-21T17:48:04Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- CloudFront Function handling trailing-slash and extensionless URI rewriting for Docusaurus
- Complete CloudFormation template with all 13 resources: 2 S3 buckets, 2 CloudFront distributions, 1 OAC, 1 CF Function, 1 ACM certificate, 2 Route 53 records, 2 bucket policies, 1 OIDC provider, 1 IAM role
- Production distribution with custom domain, ACM cert, and HTTP/2+3 support
- Preview distribution on default cloudfront.net domain with 30-day object lifecycle

## Task Commits

Each task was committed atomically:

1. **Task 1: Create CloudFront Function for SPA routing** - `e706431` (feat)
2. **Task 2: Create CloudFormation template with all AWS resources** - `dd21436` (feat)

## Files Created/Modified
- `infra/cf-function.js` - CloudFront Function source for SPA URI rewriting (viewer-request handler)
- `infra/template.yaml` - CloudFormation template with all AWS resources for hosting help.1nce.com

## Decisions Made
- Deployed entire stack in us-east-1 for ACM certificate compatibility with CloudFront (S3 region does not affect CF performance)
- Used separate AWS::S3::BucketPolicy resources instead of inline policies to avoid circular dependency between buckets and distributions
- GitHub OIDC trust policy scoped with StringLike on sub claim for repo-level access control
- Preview distribution has no Aliases (uses default cloudfront.net domain per D-16)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required. Stack deployment requires AWS account access and parameter values (HostedZoneId, GitHubOrg, GitHubRepo).

## Next Phase Readiness
- Infrastructure template ready for deployment via `aws cloudformation deploy`
- Plan 03-02 (CI/CD pipeline) can reference outputs from this stack (distribution IDs, role ARN, bucket names)
- CloudFront Function is inlined in the template and also exists as standalone source for reference

## Self-Check: PASSED

All files created, all commits verified.

---
*Phase: 03-infrastructure-and-deployment*
*Completed: 2026-03-21*
