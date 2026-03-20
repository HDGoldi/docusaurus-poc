# Phase 3: Infrastructure and Deployment - Research

**Researched:** 2026-03-20
**Domain:** AWS infrastructure (S3, CloudFront, ACM, Route 53), GitHub Actions CI/CD, CloudFormation IaC
**Confidence:** HIGH

## Summary

This phase provisions AWS infrastructure via CloudFormation and builds a GitHub Actions CI/CD pipeline to deploy a Docusaurus static site to S3 + CloudFront. The existing codebase (Docusaurus 3.9.2, `npm run build` producing a `build/` directory) is the input; the output is a live site at `https://help.1nce.com` with automated deployments on merge to main.

The technical domain is well-understood: S3 static hosting behind CloudFront with OAC is a documented AWS reference architecture. GitHub Actions OIDC with AWS is a mature pattern (aws-actions/configure-aws-credentials v6). CloudFront Functions handle SPA routing with a simple viewer-request rewrite. CloudFormation manages all resources declaratively. No exotic or bleeding-edge technology is involved.

**Primary recommendation:** Use a single CloudFormation template (`infra/template.yaml`) for all AWS resources (two S3 buckets, two CloudFront distributions, OAC, CloudFront Function, ACM certificate, Route 53 record, IAM OIDC provider + role). GitHub Actions workflow handles build, deploy, and validation with manual approval gate for production.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Merge to main triggers build but requires manual approval (GitHub environment protection rule) before deploying to production S3/CloudFront
- **D-02:** PR preview deployments enabled -- PRs deploy to `s3://1nce-developer-hub-preview/pr-{number}/` with a separate CloudFront distribution for preview access (path prefix, not subdomain)
- **D-03:** All branches run CI build validation (`npm run build`), broken link checker, and Lighthouse CI on every push/PR
- **D-04:** Full OIDC setup from scratch -- IAM OIDC identity provider for GitHub Actions, IAM role with trust policy scoped to this repo, S3 + CloudFront permissions
- **D-05:** Pipeline validation includes: `npm run build`, broken link checker, and Lighthouse CI for performance/accessibility scores
- **D-06:** CloudFront Function (viewer-request) rewrites paths without file extensions to append `/index.html` -- handles Docusaurus trailing-slash SPA routing
- **D-07:** Trailing slash default kept (`trailingSlash: undefined` in Docusaurus config) -- generates `/page/index.html` structure, CF Function rewrites accordingly
- **D-08:** Aggressive cache TTL (1 day+) on all assets. CI/CD pipeline creates a CloudFront invalidation (`/*`) on every production deploy
- **D-09:** CloudFront Origin Access Control (OAC) -- S3 bucket is not public, only accessible via CloudFront
- **D-10:** Big bang DNS flip -- when ready, update Route 53 alias record to point help.1nce.com to CloudFront distribution. ReadMe retired immediately
- **D-11:** No formal rollback plan -- validate thoroughly before flipping. ReadMe can be reactivated manually if critical issues arise
- **D-12:** Automated pre-launch smoke test script -- hits key URLs on the CloudFront domain (before DNS flip), checks 200 status codes, verifies page content renders. Run as CI step
- **D-13:** DNS is already managed in Route 53 -- just need to add/update the alias record for help.1nce.com
- **D-14:** CloudFormation template for all AWS resources -- checked into this repo under `infra/` directory
- **D-15:** Production bucket: `1nce-developer-hub-prod`. Preview bucket: `1nce-developer-hub-preview`
- **D-16:** Preview deploys use path prefix: `s3://1nce-developer-hub-preview/pr-{number}/`. Separate CloudFront distribution for preview access (no DNS/cert changes needed)
- **D-17:** SSL certificate via ACM in us-east-1 for help.1nce.com (required for CloudFront)

### Claude's Discretion
- CloudFront custom error page configuration (404 handling approach)
- Exact CloudFront Function JavaScript implementation
- CloudFormation template structure and parameter design
- IAM role permission boundaries and least-privilege scoping
- Lighthouse CI thresholds and broken link checker configuration
- Preview CloudFront distribution configuration details
- Smoke test script implementation and URL selection
- Cache-Control header configuration for hashed vs unhashed assets

### Deferred Ideas (OUT OF SCOPE)
- Active URL redirects from old ReadMe paths -- v2 scope (REDIR-01/02). Phase 2 generates the redirect map file; a future CloudFront Function can use it
- Cookie consent banner -- noted in Phase 2 deferred ideas, no infra impact
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| INFRA-01 | S3 bucket configured for static website hosting | CloudFormation `AWS::S3::Bucket` with OAC bucket policy (not website endpoint mode -- use REST endpoint with CF Function for routing) |
| INFRA-02 | CloudFront distribution with Origin Access Control (OAC) | `AWS::CloudFront::OriginAccessControl` with `SigningBehavior: always`, `SigningProtocol: sigv4`, bucket policy with `cloudfront.amazonaws.com` principal |
| INFRA-03 | SSL certificate via ACM in us-east-1 for help.1nce.com | `AWS::CertificateManager::Certificate` with `DomainValidationOptions` -- requires DNS validation record in Route 53 |
| INFRA-04 | Route 53 DNS alias records pointing to CloudFront | `AWS::Route53::RecordSet` with `AliasTarget` pointing to CloudFront distribution domain -- can be added last during cutover |
| INFRA-05 | CloudFront Function for SPA routing (index.html rewrite) | `AWS::CloudFront::Function` with `Runtime: cloudfront-js-2.0`, viewer-request event, URI rewrite logic |
| INFRA-06 | GitHub Actions CI/CD pipeline with OIDC auth to AWS | `aws-actions/configure-aws-credentials@v6` with `role-to-assume`, IAM OIDC provider + role in CloudFormation |
| INFRA-07 | Automated build + S3 sync + CloudFront cache invalidation on merge to main | `aws s3 sync build/ s3://bucket --delete` + `aws cloudfront create-invalidation --paths "/*"` in workflow |
</phase_requirements>

## Standard Stack

### Core AWS Resources (via CloudFormation)
| Resource | CF Type | Purpose | Why Standard |
|----------|---------|---------|--------------|
| S3 Bucket (prod) | `AWS::S3::Bucket` | Host `build/` output | Standard static hosting. NOT website endpoint mode -- use REST endpoint so OAC works |
| S3 Bucket (preview) | `AWS::S3::Bucket` | Host PR preview builds | Path-prefix isolation per PR |
| CloudFront Distribution (prod) | `AWS::CloudFront::Distribution` | CDN + HTTPS for help.1nce.com | Required for custom domain SSL, caching, OAC |
| CloudFront Distribution (preview) | `AWS::CloudFront::Distribution` | CDN for PR previews | Separate distribution, no custom domain needed |
| Origin Access Control | `AWS::CloudFront::OriginAccessControl` | Restrict S3 to CloudFront only | OAC is the current standard (OAI is legacy) |
| CloudFront Function | `AWS::CloudFront::Function` | SPA routing rewrites | Viewer-request rewrite for `/path` to `/path/index.html` |
| ACM Certificate | `AWS::CertificateManager::Certificate` | SSL for help.1nce.com | Must be in us-east-1 for CloudFront |
| Route 53 Record | `AWS::Route53::RecordSet` | DNS alias to CloudFront | Points help.1nce.com to CF distribution |
| IAM OIDC Provider | `AWS::IAM::OIDCProvider` | GitHub Actions auth | Keyless OIDC -- no stored AWS secrets |
| IAM Role | `AWS::IAM::Role` | CI/CD permissions | Scoped to this repo via trust policy condition |

### CI/CD Stack
| Tool | Version | Purpose | Why Standard |
|------|---------|---------|--------------|
| aws-actions/configure-aws-credentials | v6 | OIDC authentication | Official AWS action, keyless auth, latest stable |
| actions/checkout | v4 | Repo checkout | Standard |
| actions/setup-node | v4 | Node.js setup | Standard, use Node 20 |
| treosh/lighthouse-ci-action | v12 | Performance/accessibility CI checks | Most popular LHCI GitHub Action |
| aws CLI (bundled) | v2 | S3 sync, CF invalidation | Pre-installed on ubuntu-latest runners |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CloudFormation | AWS CDK | CDK adds build step + dependencies. CF template is simpler for ~10 resources and is already decided (D-14) |
| CloudFront Function | Lambda@Edge | Lambda@Edge has 5s execution time but 10x more expensive. CF Function is sub-millisecond, free tier covers millions of invocations. SPA rewrite is trivial -- CF Function is correct choice |
| `aws s3 sync` | `s3-deploy` action | Third-party action adds dependency. `aws s3 sync --delete` is well-understood, one command |

## Architecture Patterns

### Recommended Project Structure
```
infra/
  template.yaml           # CloudFormation template (all resources)
  cf-function.js          # CloudFront Function source (referenced inline in template)
.github/
  workflows/
    deploy.yml            # Main CI/CD workflow
    cleanup-preview.yml   # PR close -- delete preview from S3
scripts/
  smoke-test.sh           # Pre-launch URL checks
lighthouserc.json         # Lighthouse CI config (project root)
```

### Pattern 1: CloudFormation Template Design
**What:** Single template with parameters for environment flexibility
**When to use:** Always -- this is the only IaC approach (D-14)

Key parameters:
- `DomainName` (default: `help.1nce.com`)
- `HostedZoneId` (Route 53 hosted zone ID)
- `CertificateArn` (ACM cert ARN -- can be created separately or in same stack with DNS validation)

Key design decision: ACM certificates with DNS validation in CloudFormation require the hosted zone to be in the same account. Since DNS is already in Route 53 (D-13), `AWS::CertificateManager::Certificate` with `DomainValidationOptions` works. However, CloudFormation will wait for validation to complete -- the stack creation will pause until the DNS validation record propagates (typically 5-30 minutes).

```yaml
# Source: AWS official docs
Resources:
  Certificate:
    Type: AWS::CertificateManager::Certificate
    Properties:
      DomainName: !Ref DomainName
      ValidationMethod: DNS
      DomainValidationOptions:
        - DomainName: !Ref DomainName
          HostedZoneId: !Ref HostedZoneId

  OriginAccessControl:
    Type: AWS::CloudFront::OriginAccessControl
    Properties:
      OriginAccessControlConfig:
        Name: !Sub "${AWS::StackName}-oac"
        OriginAccessControlOriginType: s3
        SigningBehavior: always
        SigningProtocol: sigv4

  ProdDistribution:
    Type: AWS::CloudFront::Distribution
    Properties:
      DistributionConfig:
        Enabled: true
        Aliases:
          - !Ref DomainName
        Origins:
          - Id: S3Origin
            DomainName: !GetAtt ProdBucket.RegionalDomainName
            S3OriginConfig:
              OriginAccessIdentity: ""
            OriginAccessControlId: !GetAtt OriginAccessControl.Id
        DefaultCacheBehavior:
          TargetOriginId: S3Origin
          ViewerProtocolPolicy: redirect-to-https
          CachePolicyId: 658327ea-f89d-4fab-a63d-7e88639e58f6  # CachingOptimized
          Compress: true
          FunctionAssociations:
            - EventType: viewer-request
              FunctionARN: !GetAtt SpaRewriteFunction.FunctionMetadata.FunctionARN
        ViewerCertificate:
          AcmCertificateArn: !Ref Certificate
          SslSupportMethod: sni-only
          MinimumProtocolVersion: TLSv1.2_2021
        DefaultRootObject: index.html
        CustomErrorResponses:
          - ErrorCode: 403
            ResponseCode: 404
            ResponsePagePath: /404.html
            ErrorCachingMinTTL: 300
          - ErrorCode: 404
            ResponseCode: 404
            ResponsePagePath: /404.html
            ErrorCachingMinTTL: 300
```

### Pattern 2: GitHub Actions Workflow with OIDC + Manual Approval
**What:** Three-stage pipeline: validate (all pushes) -> build (all pushes) -> deploy (main only, manual approval)
**When to use:** Production deployments

```yaml
# Source: GitHub docs + aws-actions docs
name: Deploy
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

permissions:
  id-token: write
  contents: read
  pull-requests: write

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      # Broken link check -- Docusaurus build with onBrokenLinks: 'throw' already covers this
      # Lighthouse CI on built output
      - uses: treosh/lighthouse-ci-action@v12
        with:
          uploadArtifacts: true
          configPath: ./lighthouserc.json

  deploy-preview:
    if: github.event_name == 'pull_request'
    needs: validate
    runs-on: ubuntu-latest
    environment: preview
    steps:
      - uses: aws-actions/configure-aws-credentials@v6
        with:
          role-to-assume: ${{ vars.AWS_ROLE_ARN }}
          aws-region: eu-central-1
      - run: aws s3 sync build/ s3://1nce-developer-hub-preview/pr-${{ github.event.number }}/ --delete

  deploy-production:
    if: github.ref == 'refs/heads/main'
    needs: validate
    runs-on: ubuntu-latest
    environment: production  # GitHub environment protection rule = manual approval
    steps:
      - uses: aws-actions/configure-aws-credentials@v6
        with:
          role-to-assume: ${{ vars.AWS_ROLE_ARN }}
          aws-region: eu-central-1
      - run: aws s3 sync build/ s3://1nce-developer-hub-prod/ --delete
      - run: aws cloudfront create-invalidation --distribution-id ${{ vars.CF_DISTRIBUTION_ID }} --paths "/*"
```

### Pattern 3: CloudFront Function for SPA Routing
**What:** Viewer-request function that rewrites URIs to append `/index.html`
**When to use:** Always attached to both prod and preview distributions

```javascript
// Source: AWS CloudFront Functions docs - url-rewrite-single-page-apps
// Runtime: cloudfront-js-2.0
async function handler(event) {
    var request = event.request;
    var uri = request.uri;

    // URI ends with slash: append index.html
    if (uri.endsWith('/')) {
        request.uri += 'index.html';
    }
    // URI has no file extension: append /index.html
    else if (!uri.includes('.')) {
        request.uri += '/index.html';
    }

    return request;
}
```

### Pattern 4: S3 Bucket Policy for OAC
**What:** Bucket policy that allows only CloudFront (via OAC) to read objects
**When to use:** Both prod and preview buckets

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontServicePrincipalReadOnly",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::BUCKET_NAME/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::ACCOUNT_ID:distribution/DISTRIBUTION_ID"
        }
      }
    }
  ]
}
```

### Anti-Patterns to Avoid
- **S3 Website Endpoint with CloudFront:** Do NOT enable S3 static website hosting. OAC does not work with the website endpoint (`bucket.s3-website.region.amazonaws.com`). Use the REST endpoint (`bucket.s3.region.amazonaws.com`) and let the CloudFront Function handle routing.
- **OAI instead of OAC:** Origin Access Identity is legacy. Always use Origin Access Control for new distributions.
- **Wildcard IAM permissions:** The CI/CD role should have least-privilege: `s3:PutObject`, `s3:DeleteObject`, `s3:ListBucket` on the specific buckets, `cloudfront:CreateInvalidation` on the specific distribution.
- **Storing AWS credentials as GitHub secrets:** Use OIDC. No long-lived keys.
- **Separate CloudFormation stacks per resource:** One stack with all related resources is simpler for a docs site with ~10 resources.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| SPA URL routing | Custom Lambda@Edge | CloudFront Function (viewer-request) | Sub-ms execution, free tier, built for this exact use case |
| OIDC auth | Manual STS calls | `aws-actions/configure-aws-credentials@v6` | Handles token exchange, session management, error handling |
| Broken link detection | Custom crawl script | Docusaurus `onBrokenLinks: 'throw'` (already configured) | Built into the build process, fails build on broken links |
| Performance audit | Manual Lighthouse runs | `treosh/lighthouse-ci-action@v12` | Automated, stores artifacts, supports budgets |
| SSL certificate | Manual cert + upload | ACM with DNS validation in CloudFormation | Auto-renews, free, integrates with CloudFront natively |
| Infrastructure | Console clicks | CloudFormation template | Reproducible, version-controlled, reviewable |

**Key insight:** Every component here has an AWS-managed or community-standard solution. The only custom code needed is the CloudFront Function (~10 lines) and the smoke test script.

## Common Pitfalls

### Pitfall 1: ACM Certificate Region
**What goes wrong:** ACM certificate created in wrong region; CloudFront rejects it
**Why it happens:** CloudFormation deploys to the default region, but CloudFront requires certs in us-east-1
**How to avoid:** Either (a) deploy entire stack to us-east-1, or (b) create the certificate in a separate us-east-1 stack and pass the ARN as a parameter. Option (a) is simpler for this use case -- the S3 bucket region does not matter for CloudFront (it uses the regional endpoint).
**Warning signs:** CloudFormation error "The certificate must be in us-east-1"

### Pitfall 2: S3 Website Endpoint vs REST Endpoint
**What goes wrong:** OAC fails because S3 is configured as a website endpoint
**Why it happens:** Confusion between S3 website hosting and S3 as a CloudFront origin. They are different configurations.
**How to avoid:** Use `BucketRegionalDomainName` (REST endpoint), NOT the website endpoint. Do NOT enable `WebsiteConfiguration` on the bucket. Let CloudFront Function handle all routing.
**Warning signs:** 403 errors from S3 despite correct bucket policy

### Pitfall 3: CloudFormation Circular Dependencies
**What goes wrong:** Bucket policy references distribution ID, but distribution references bucket -- circular dependency
**Why it happens:** S3 bucket policy needs the CloudFront distribution ARN for the `Condition`, but the distribution needs the bucket as its origin
**How to avoid:** Use `AWS::CloudFront::OriginAccessControl` as an intermediate resource. Set the bucket policy using `!GetAtt Distribution.Arn` -- CloudFormation resolves this because the bucket policy is a separate resource (`AWS::S3::BucketPolicy`), not inline in the bucket definition. The dependency chain is: Bucket -> Distribution (references bucket) -> BucketPolicy (references distribution).
**Warning signs:** CloudFormation stack creation fails with circular dependency error

### Pitfall 4: CloudFront Function Publish State
**What goes wrong:** Function exists but is not associated because it was not published to LIVE stage
**Why it happens:** CloudFront Functions have DEVELOPMENT and LIVE stages. FunctionAssociations require LIVE stage.
**How to avoid:** Set `AutoPublish: true` on `AWS::CloudFront::Function` in CloudFormation
**Warning signs:** 503 errors or no routing happening despite function existing

### Pitfall 5: GitHub OIDC Trust Policy Too Broad
**What goes wrong:** Any repo or branch can assume the deployment role
**Why it happens:** Trust policy `sub` condition uses wildcard or is missing
**How to avoid:** Scope trust policy to specific repo: `"token.actions.githubusercontent.com:sub": "repo:ORG/REPO:*"`. For production deploy job, further scope to `"repo:ORG/REPO:environment:production"` or `"repo:ORG/REPO:ref:refs/heads/main"`.
**Warning signs:** Security audit flags overly permissive IAM role

### Pitfall 6: Preview Cleanup Not Automated
**What goes wrong:** S3 preview bucket accumulates stale PR deployments, costs increase
**Why it happens:** PR close/merge does not trigger cleanup
**How to avoid:** Add a separate workflow triggered on `pull_request: types: [closed]` that deletes `s3://1nce-developer-hub-preview/pr-{number}/`
**Warning signs:** Growing S3 storage costs, hundreds of stale preview folders

### Pitfall 7: CloudFront Cache After Deploy
**What goes wrong:** Users see stale content after deployment
**Why it happens:** CloudFront caches aggressively and invalidation is async
**How to avoid:** Always run `aws cloudfront create-invalidation --paths "/*"` after S3 sync. Docusaurus hashes static assets (JS/CSS) so they get new URLs on rebuild -- the main concern is HTML files.
**Warning signs:** Deployment succeeds but site shows old content

## Code Examples

### Complete CloudFront Function (SPA Routing)
```javascript
// Source: AWS CloudFront Functions docs - url-rewrite-single-page-apps
// Attach as viewer-request to both prod and preview distributions
async function handler(event) {
    var request = event.request;
    var uri = request.uri;

    if (uri.endsWith('/')) {
        request.uri += 'index.html';
    } else if (!uri.includes('.')) {
        request.uri += '/index.html';
    }

    return request;
}
```

### IAM Role Trust Policy for GitHub OIDC
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:ORG/REPO_NAME:*"
        }
      }
    }
  ]
}
```

### IAM Role Permissions Policy (Least Privilege)
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "S3Deploy",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket",
        "s3:GetObject"
      ],
      "Resource": [
        "arn:aws:s3:::1nce-developer-hub-prod",
        "arn:aws:s3:::1nce-developer-hub-prod/*",
        "arn:aws:s3:::1nce-developer-hub-preview",
        "arn:aws:s3:::1nce-developer-hub-preview/*"
      ]
    },
    {
      "Sid": "CloudFrontInvalidation",
      "Effect": "Allow",
      "Action": "cloudfront:CreateInvalidation",
      "Resource": "arn:aws:cloudfront::ACCOUNT_ID:distribution/*"
    }
  ]
}
```

### Lighthouse CI Configuration (lighthouserc.json)
```json
{
  "ci": {
    "collect": {
      "staticDistDir": "./build",
      "url": [
        "http://localhost/",
        "http://localhost/docs/1nce-os/1nce-os-overview/"
      ],
      "numberOfRuns": 1
    },
    "assert": {
      "assertions": {
        "categories:performance": ["warn", { "minScore": 0.8 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "categories:best-practices": ["warn", { "minScore": 0.9 }],
        "categories:seo": ["warn", { "minScore": 0.9 }]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

### Smoke Test Script (scripts/smoke-test.sh)
```bash
#!/usr/bin/env bash
# Pre-launch smoke test: verify key URLs return 200 on CloudFront domain
set -euo pipefail

BASE_URL="${1:?Usage: smoke-test.sh <base-url>}"

URLS=(
  "/"
  "/docs/1nce-os/1nce-os-overview/"
  "/api/"
  "/platform/"
  "/blueprints/"
  "/terms/"
)

FAILED=0
for path in "${URLS[@]}"; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}${path}")
  if [ "$STATUS" -ne 200 ]; then
    echo "FAIL: ${BASE_URL}${path} returned $STATUS"
    FAILED=1
  else
    echo "OK: ${BASE_URL}${path}"
  fi
done

exit $FAILED
```

### Cache-Control Headers Recommendation
Docusaurus generates hashed filenames for JS/CSS (`assets/js/abc123.js`). Set different cache policies:

- **Hashed assets** (`/assets/*`): Long cache (1 year). Files are immutable -- new builds produce new hashes.
- **HTML files**: Short cache (10 minutes) or no-cache with `must-revalidate`. Updated on every deploy.
- **Images/static**: Medium cache (1 day). Rarely change.

This can be achieved with a CloudFront cache behavior per path pattern, or by setting `Cache-Control` headers during S3 sync:
```bash
# Sync hashed assets with long cache
aws s3 sync build/assets/ s3://bucket/assets/ --cache-control "public, max-age=31536000, immutable"
# Sync HTML with short cache
aws s3 sync build/ s3://bucket/ --exclude "assets/*" --cache-control "public, max-age=600, must-revalidate"
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Origin Access Identity (OAI) | Origin Access Control (OAC) | 2022 | OAC supports all regions, SSE-KMS, PUT/DELETE. Always use OAC for new distributions |
| Stored AWS keys in GitHub Secrets | OIDC with `aws-actions/configure-aws-credentials@v6` | 2022+ | No long-lived credentials. Uses short-lived STS tokens |
| Lambda@Edge for URL rewrites | CloudFront Functions | 2021 | Sub-ms execution, cheaper, simpler for request-level transforms |
| `aws-actions/configure-aws-credentials@v1-v4` | v6 | 2024 | v6 is current stable with improved OIDC handling |

**Deprecated/outdated:**
- **OAI (Origin Access Identity):** Legacy. Use OAC instead.
- **`aws-actions/configure-aws-credentials` < v4:** Use v6.
- **CloudFront `DefaultRootObject` for SPA routing:** Only works for the root path `/`. Does NOT handle deep links like `/docs/page`. CloudFront Function is required.

## Open Questions

1. **GitHub repository organization/name**
   - What we know: Trust policy needs `repo:ORG/REPO_NAME:*` format
   - What's unclear: The exact GitHub org and repo name for this project
   - Recommendation: Use CloudFormation parameters so the template is portable. The workflow file references `vars.AWS_ROLE_ARN` from GitHub environment variables.

2. **AWS Account ID and Hosted Zone ID**
   - What we know: Needed for CloudFormation template
   - What's unclear: Exact values
   - Recommendation: Use CloudFormation parameters. Document required values in a deployment README or as stack parameter descriptions.

3. **Preview CloudFront distribution access**
   - What we know: Separate distribution, path-prefix per PR (D-16)
   - What's unclear: Whether the preview CF distribution needs any auth or is publicly accessible via its `*.cloudfront.net` domain
   - Recommendation: Keep it simple -- preview distribution is publicly accessible via its CloudFront domain. No custom domain or cert needed. Post the preview URL as a PR comment.

4. **CloudFormation stack deployment region**
   - What we know: ACM cert must be in us-east-1 for CloudFront
   - What's unclear: Whether the team prefers all resources in us-east-1 or cross-region
   - Recommendation: Deploy entire stack in us-east-1 for simplicity. S3 bucket region does not affect CloudFront performance (CF caches at edge).

## Sources

### Primary (HIGH confidence)
- AWS CloudFront OAC docs - S3 bucket policy format, OAC vs OAI differences, CloudFormation resource types
- GitHub Actions OIDC with AWS docs - Trust policy format, workflow YAML, audience/subject claims
- AWS CloudFront Functions docs - SPA rewrite example, runtime cloudfront-js-2.0, viewer-request event type
- AWS CloudFormation resource reference - `AWS::CloudFront::Distribution`, `AWS::CloudFront::Function`, `AWS::CloudFront::OriginAccessControl`
- `aws-actions/configure-aws-credentials` GitHub repo - v6 is current stable, OIDC inputs
- `treosh/lighthouse-ci-action` GitHub repo - v12, staticDistDir for built sites

### Secondary (MEDIUM confidence)
- CloudFormation circular dependency resolution pattern (bucket -> distribution -> bucket policy chain) - based on established AWS patterns
- Cache-Control header strategy for Docusaurus hashed assets - based on Docusaurus build output structure

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All AWS services and GitHub Actions are well-documented, versions verified against official docs
- Architecture: HIGH - S3 + CloudFront + OAC is a reference architecture. GitHub OIDC is mature. No novel combinations
- Pitfalls: HIGH - All pitfalls sourced from official AWS docs and common deployment patterns
- CI/CD pipeline design: MEDIUM - Exact Lighthouse thresholds and broken link checker approach may need tuning based on site content

**Research date:** 2026-03-20
**Valid until:** 2026-04-20 (stable -- AWS services and GitHub Actions change slowly)
