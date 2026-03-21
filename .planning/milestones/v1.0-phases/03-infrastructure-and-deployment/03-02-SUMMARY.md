---
phase: 03-infrastructure-and-deployment
plan: 02
subsystem: infra
tags: [github-actions, cicd, oidc, lighthouse, s3-sync, cloudfront-invalidation, smoke-test]

requires:
  - phase: 03-01
    provides: CloudFormation template and CloudFront Function for AWS infrastructure
provides:
  - GitHub Actions deploy workflow with validate/preview/production jobs
  - GitHub Actions cleanup workflow for PR preview S3 cleanup
  - Lighthouse CI configuration with performance/accessibility thresholds
  - Smoke test script for pre-launch URL verification
affects: [production-deployment, pr-review-workflow]

tech-stack:
  added: [treosh/lighthouse-ci-action@v12, aws-actions/configure-aws-credentials@v6, actions/github-script@v7]
  patterns: [OIDC auth for AWS, GitHub environment protection rules, two-tier cache strategy for hashed vs HTML assets]

key-files:
  created:
    - .github/workflows/deploy.yml
    - .github/workflows/cleanup-preview.yml
    - lighthouserc.json
    - scripts/smoke-test.sh
  modified: []

key-decisions:
  - "Accessibility threshold set to error (blocking) at 0.9; other Lighthouse categories set to warn"
  - "Two-tier S3 sync: hashed assets get 1-year immutable cache, HTML gets 10-min must-revalidate cache"
  - "Smoke test covers 6 URLs: homepage + 5 content section entry points"

patterns-established:
  - "OIDC auth: all AWS interactions use role-to-assume via vars.AWS_ROLE_ARN, no stored credentials"
  - "Preview isolation: PR previews deploy to path-prefixed S3 location pr-{number}/"
  - "Manual approval gate: production deploy uses GitHub environment: production with required reviewers"

requirements-completed: [INFRA-06, INFRA-07]

duration: 3min
completed: 2026-03-21
---

# Phase 03 Plan 02: CI/CD Pipeline Summary

**GitHub Actions CI/CD with OIDC auth, PR preview deploys, manual production approval gate, Lighthouse CI, and smoke test script**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-21T17:46:38Z
- **Completed:** 2026-03-21T17:49:38Z
- **Tasks:** 3 of 3 (including human-verify checkpoint, approved)
- **Files created:** 4

## Accomplishments
- Deploy workflow with three-job pipeline: validate (all pushes), deploy-preview (PRs), deploy-production (main + manual approval)
- OIDC authentication for all AWS operations with no stored credentials
- Lighthouse CI with accessibility as blocking error threshold at 0.9
- Smoke test script verifying all 6 key site URLs return 200

## Task Commits

Each task was committed atomically:

1. **Task 1: Create GitHub Actions deploy workflow and preview cleanup workflow** - `d9aca3d` (feat)
2. **Task 2: Create Lighthouse CI config and smoke test script** - `873f757` (feat)

3. **Task 3: Review infrastructure and pipeline configuration** - checkpoint approved by user

## Files Created/Modified
- `.github/workflows/deploy.yml` - Main CI/CD pipeline with validate/preview/production jobs
- `.github/workflows/cleanup-preview.yml` - Deletes S3 preview files on PR close
- `lighthouserc.json` - Lighthouse CI thresholds for performance, accessibility, best-practices, SEO
- `scripts/smoke-test.sh` - Pre-launch URL smoke test (6 URLs, exit 1 on failure)

## Decisions Made
- Accessibility threshold is error-level (blocking) at 0.9 -- docs sites must be accessible
- Performance, best-practices, SEO are warn-level (non-blocking) to avoid false positives from images
- Two-tier cache strategy: hashed assets (JS/CSS) get 1-year immutable cache, HTML gets 10-minute cache with must-revalidate
- Smoke test checks 6 URLs covering homepage and all 5 content sections

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

None - all files are fully implemented.

## User Setup Required

**External services require manual configuration after human-verify checkpoint approval.** See plan frontmatter `user_setup` section for:
- GitHub: Create production (with required reviewers) and preview environments
- GitHub: Add AWS_ROLE_ARN, CF_DISTRIBUTION_ID, PREVIEW_CF_DISTRIBUTION_DOMAIN, PROD_CF_DISTRIBUTION_DOMAIN variables
- AWS: Deploy infra/template.yaml CloudFormation stack

## Issues Encountered
None

## Next Phase Readiness
- All CI/CD artifacts created and committed
- Human review (Task 3 checkpoint) approved -- plan complete
- Next steps: configure GitHub environments and deploy CloudFormation stack (see User Setup Required above)

---
*Phase: 03-infrastructure-and-deployment*
*Completed: 2026-03-21*
