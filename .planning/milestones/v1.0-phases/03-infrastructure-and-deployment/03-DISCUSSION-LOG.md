# Phase 3: Infrastructure and Deployment - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-20
**Phase:** 03-infrastructure-and-deployment
**Areas discussed:** CI/CD pipeline design, CloudFront routing & caching, Cutover strategy, S3 & resource naming

---

## CI/CD Pipeline Design

| Option | Description | Selected |
|--------|-------------|----------|
| Merge to main only | Every merge to main auto-deploys. Simple, standard for docs sites. No manual approval step. | |
| Merge to main + manual approval | Merge to main builds, but requires a manual 'deploy' step (GitHub environment protection rule) before S3 sync. | ✓ |
| Push to any branch builds, main deploys | All branches get CI build validation, but only main triggers actual deployment to S3/CloudFront. | |

**User's choice:** Merge to main + manual approval
**Notes:** Wants a gate before production deployment.

| Option | Description | Selected |
|--------|-------------|----------|
| No previews | Keep it simple for v1. Run `npm run build` in CI to validate, but don't deploy preview URLs. | |
| Preview to separate S3 path | Deploy PR builds to s3://bucket/pr-123/ with a temporary CloudFront behavior. | ✓ |

**User's choice:** Preview to separate S3 path
**Notes:** Wants reviewable preview URLs for PRs.

| Option | Description | Selected |
|--------|-------------|----------|
| Create from scratch | Plan includes full OIDC provider setup: IAM identity provider, IAM role with trust policy, S3/CloudFront permissions. | ✓ |
| OIDC provider exists | An IAM OIDC provider for GitHub Actions already exists. Plan only needs the IAM role + permissions. | |

**User's choice:** Create from scratch
**Notes:** No existing OIDC provider for GitHub Actions in AWS account.

| Option | Description | Selected |
|--------|-------------|----------|
| Build only | Just `npm run build` — if it succeeds, the site is deployable. | |
| Build + broken link check | Run a broken link checker after build to catch dead links before deploy. | |
| Build + link check + Lighthouse | Full validation: build, link check, and Lighthouse CI for performance/accessibility scores. | ✓ |

**User's choice:** Build + link check + Lighthouse
**Notes:** Wants comprehensive CI validation.

---

## CloudFront Routing & Caching

| Option | Description | Selected |
|--------|-------------|----------|
| CloudFront Function rewrite | Viewer-request function appends /index.html to paths without file extensions. Cheapest option. | ✓ |
| Custom error page fallback | Configure CloudFront to return /index.html on 403/404. Simpler but less correct. | |
| S3 website hosting mode | Enable S3 static website hosting with error document. Requires public bucket or no OAC. | |

**User's choice:** CloudFront Function rewrite
**Notes:** Standard approach, compatible with OAC.

| Option | Description | Selected |
|--------|-------------|----------|
| Aggressive + invalidation | Long TTL (1 day+) for all assets. CI/CD creates CloudFront invalidation on every deploy. | ✓ |
| Hashed assets long, HTML short | Docusaurus bundles have content hashes (cache forever). HTML/JSON get short TTL (5 min). | |
| Short TTL everywhere | Low TTL (5 min) on all files. No invalidation step. | |

**User's choice:** Aggressive + invalidation
**Notes:** Fast for users, always fresh after deploy.

| Option | Description | Selected |
|--------|-------------|----------|
| Default Docusaurus 404 | Configure CloudFront to return /404.html on 404 responses from S3. | |
| You decide | Claude picks the best approach for error handling. | ✓ |

**User's choice:** You decide
**Notes:** Claude's discretion on 404 handling.

| Option | Description | Selected |
|--------|-------------|----------|
| Keep trailing slash default | Docusaurus generates /page/index.html. CF Function rewrites accordingly. | ✓ |
| No trailing slashes | Set `trailingSlash: false`. Generates /page.html instead. | |

**User's choice:** Keep trailing slash default
**Notes:** Standard Docusaurus behavior, predictable.

---

## Cutover Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Big bang DNS flip | Update Route 53 to point help.1nce.com to CloudFront. ReadMe retired immediately. | ✓ |
| Weighted DNS split | Route 53 weighted routing sends 10% traffic to new site initially, ramping up. | |
| Parallel with path-based routing | Run both sites simultaneously, route specific paths to new site via CloudFront behaviors. | |

**User's choice:** Big bang DNS flip
**Notes:** Clean, simple cutover.

| Option | Description | Selected |
|--------|-------------|----------|
| DNS revert to ReadMe | Keep ReadMe active for 2 weeks post-cutover as rollback option. | |
| No formal rollback | Commit fully. Validate thoroughly before flipping. | ✓ |
| You decide | Claude determines appropriate rollback approach. | |

**User's choice:** No formal rollback
**Notes:** Confidence in pre-launch validation.

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, automated smoke test | Script hits key URLs on CloudFront domain, checks 200 status, verifies content. Run in CI. | ✓ |
| Manual checklist only | Document a manual checklist. Human checks each item before flipping DNS. | |
| You decide | Claude determines the right validation approach. | |

**User's choice:** Yes, automated smoke test
**Notes:** Automated pre-launch validation.

| Option | Description | Selected |
|--------|-------------|----------|
| Route 53 already | DNS zone for 1nce.com is already in Route 53. Just need alias record. | ✓ |
| DNS hosted elsewhere | DNS is at a registrar or other provider. | |
| Not sure | Will need to verify during implementation. | |

**User's choice:** Route 53 already
**Notes:** No DNS migration needed.

---

## S3 & Resource Naming

| Option | Description | Selected |
|--------|-------------|----------|
| Manual via Console/CLI | Create resources manually. Document the steps. Only 5-6 resources. | |
| CloudFormation template | Define all resources in a CF template checked into the repo. | ✓ |
| Terraform | Use Terraform with S3 backend for state. | |

**User's choice:** CloudFormation template
**Notes:** Infrastructure as Code for reproducibility.

| Option | Description | Selected |
|--------|-------------|----------|
| 1nce-developer-hub-prod | Descriptive name matching the project. Preview bucket: 1nce-developer-hub-preview. | ✓ |
| help.1nce.com | Match the domain name. Classic S3 convention. | |
| You decide | Claude picks sensible naming convention. | |

**User's choice:** 1nce-developer-hub-prod
**Notes:** Descriptive naming with prod/preview distinction.

| Option | Description | Selected |
|--------|-------------|----------|
| This repo | Keep infra/ directory in the docs repo. Everything in one place. | ✓ |
| Separate infra repo | Dedicated infra repository. Cleaner separation. | |

**User's choice:** This repo
**Notes:** Single repo for docs + infra.

| Option | Description | Selected |
|--------|-------------|----------|
| Path prefix on preview bucket | Deploy to s3://1nce-developer-hub-preview/pr-{number}/. Separate CloudFront distribution URL. | ✓ |
| Subdomain per PR | Each PR gets pr-123.preview.help.1nce.com. Requires wildcard cert + DNS. | |

**User's choice:** Path prefix on preview bucket
**Notes:** Simple preview setup, no additional DNS/cert complexity.

---

## Claude's Discretion

- CloudFront custom error page / 404 handling approach
- CloudFront Function implementation details
- CloudFormation template structure
- IAM permission scoping
- Lighthouse CI thresholds
- Smoke test URL selection and implementation

## Deferred Ideas

- Active URL redirects from old ReadMe paths (v2 scope)
- Cookie consent banner (noted in Phase 2)
