# Phase 3: Infrastructure and Deployment - Context

**Gathered:** 2026-03-20
**Status:** Ready for planning

<domain>
## Phase Boundary

AWS hosting, CI/CD pipeline, SSL, DNS, and production go-live for help.1nce.com. This phase takes the locally-runnable Docusaurus site from Phase 2 and deploys it to S3 + CloudFront with automated deployments via GitHub Actions. The output is a live production site at https://help.1nce.com with automated CI/CD on merge to main and PR preview environments.

</domain>

<decisions>
## Implementation Decisions

### CI/CD Pipeline Design
- **D-01:** Merge to main triggers build but requires manual approval (GitHub environment protection rule) before deploying to production S3/CloudFront
- **D-02:** PR preview deployments enabled — PRs deploy to `s3://1nce-developer-hub-preview/pr-{number}/` with a separate CloudFront distribution for preview access (path prefix, not subdomain)
- **D-03:** All branches run CI build validation (`npm run build`), broken link checker, and Lighthouse CI on every push/PR
- **D-04:** Full OIDC setup from scratch — IAM OIDC identity provider for GitHub Actions, IAM role with trust policy scoped to this repo, S3 + CloudFront permissions
- **D-05:** Pipeline validation includes: `npm run build`, broken link checker, and Lighthouse CI for performance/accessibility scores

### CloudFront Routing & Caching
- **D-06:** CloudFront Function (viewer-request) rewrites paths without file extensions to append `/index.html` — handles Docusaurus trailing-slash SPA routing
- **D-07:** Trailing slash default kept (`trailingSlash: undefined` in Docusaurus config) — generates `/page/index.html` structure, CF Function rewrites accordingly
- **D-08:** Aggressive cache TTL (1 day+) on all assets. CI/CD pipeline creates a CloudFront invalidation (`/*`) on every production deploy
- **D-09:** CloudFront Origin Access Control (OAC) — S3 bucket is not public, only accessible via CloudFront

### Cutover Strategy
- **D-10:** Big bang DNS flip — when ready, update Route 53 alias record to point help.1nce.com to CloudFront distribution. ReadMe retired immediately
- **D-11:** No formal rollback plan — validate thoroughly before flipping. ReadMe can be reactivated manually if critical issues arise
- **D-12:** Automated pre-launch smoke test script — hits key URLs on the CloudFront domain (before DNS flip), checks 200 status codes, verifies page content renders. Run as CI step
- **D-13:** DNS is already managed in Route 53 — just need to add/update the alias record for help.1nce.com

### S3 & Resource Provisioning
- **D-14:** CloudFormation template for all AWS resources — checked into this repo under `infra/` directory
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

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Infrastructure requirements
- `.planning/REQUIREMENTS.md` §Infrastructure & Deployment — INFRA-01 through INFRA-07

### Upstream phase decisions
- `.planning/phases/02-site-assembly/02-CONTEXT.md` — D-01 (5 docs plugin instances with URL paths), D-05 (static redirect map file for future CF Function use)
- `.planning/phases/01-content-conversion/01-CONTEXT.md` — D-08 (folder naming conventions)

### Project constraints
- `.planning/PROJECT.md` — AWS S3 + CloudFront deployment requirement, help.1nce.com domain requirement

### Technology stack
- `CLAUDE.md` §Technology Stack > Deployment & Infrastructure — S3, CloudFront, ACM, Route 53, CloudFront Function
- `CLAUDE.md` §Technology Stack > CI/CD — GitHub Actions, OIDC auth, S3 sync

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `package.json` — existing npm scripts for build (`npm run build`), serve (`npm run serve`)
- `docusaurus.config.ts` — site configuration, will need `trailingSlash` and `url` settings verified for production
- Phase 2 will generate a static redirect map file (D-05) that could inform future CloudFront Function routing

### Established Patterns
- Docusaurus 3.9.2 with Rspack bundler (`@docusaurus/faster`) — build performance already optimized
- 5 docs plugin instances with distinct URL paths: `/docs/`, `/api/`, `/platform/`, `/blueprints/`, `/terms/`
- All content in `docs/` directory, static assets in `static/img/`

### Integration Points
- `npm run build` produces `build/` directory — this is what gets synced to S3
- `docusaurus.config.ts` `url` field must be set to `https://help.1nce.com` for production
- GitHub Actions workflow file at `.github/workflows/` — new file to create
- CloudFormation template at `infra/` — new directory to create
- CloudFront Function source at `infra/cf-function.js` or similar — new file to create

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches. Infrastructure should be straightforward AWS best practices with CloudFormation for reproducibility.

</specifics>

<deferred>
## Deferred Ideas

- Active URL redirects from old ReadMe paths — v2 scope (REDIR-01/02). Phase 2 generates the redirect map file; a future CloudFront Function can use it
- Cookie consent banner — noted in Phase 2 deferred ideas, no infra impact

</deferred>

---

*Phase: 03-infrastructure-and-deployment*
*Context gathered: 2026-03-20*
