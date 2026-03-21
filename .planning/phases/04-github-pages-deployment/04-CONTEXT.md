# Phase 4: GitHub Pages Deployment - Context

**Gathered:** 2026-03-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Enable GitHub Pages as a lightweight test/preview deployment for the Docusaurus site. The existing AWS S3 + CloudFront production deployment must remain untouched. Environment-aware config switches `url` and `baseUrl` at build time.

</domain>

<decisions>
## Implementation Decisions

### Deploy Trigger
- **D-01:** GitHub Pages deploys on every push to main, alongside the existing AWS deploy. Both stay in sync automatically.

### Analytics
- **D-02:** Analytics (GTM, PostHog, SimpleAnalytics) are disabled on GitHub Pages builds. Only production (help.1nce.com) tracks analytics. This keeps production data clean.

### Workflow Structure
- **D-03:** GitHub Pages deploy uses a separate workflow file (e.g., `gh-pages.yml`), not added to the existing `deploy.yml`. Keeps concerns isolated and satisfies CICD-02 (existing AWS workflow unchanged).

### Config Strategy
- **D-04:** Environment-aware `docusaurus.config.ts` uses a `DEPLOY_TARGET` env var (or similar) to switch between production (`url: 'https://help.1nce.com'`, `baseUrl: '/'`) and GitHub Pages (`url: 'https://hdgoldi.github.io'`, `baseUrl: '/docusaurus-poc/'`).

### Claude's Discretion
- Exact env var naming and config structure
- Whether to conditionally include analytics scripts or use a separate config section
- `.nojekyll` already exists in `static/` — no action needed
- `trailingSlash` setting for GitHub Pages compatibility

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Existing Config
- `docusaurus.config.ts` — Current hardcoded `url`/`baseUrl`, analytics scripts in `headTags` and `scripts`, all plugin/preset config
- `.github/workflows/deploy.yml` — Current CI/CD pipeline (validate → preview → production). Must not be modified.
- `package.json` — Build scripts, dependencies, engine requirements

### Research
- `.planning/research/STACK.md` — GitHub Pages config recommendations
- `.planning/research/PITFALLS.md` — baseUrl conflict pitfalls (Pitfall 1-5)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `.nojekyll` already exists in `static/` — GitHub Pages will not process through Jekyll
- `deploy.yml` pattern for build + upload artifact can be referenced for the new workflow

### Established Patterns
- Config uses TypeScript (`docusaurus.config.ts`) with `satisfies` type assertions
- Analytics injected via `headTags` (GTM, PostHog) and `scripts` (SimpleAnalytics)
- `clientModules` used for SPA route tracking (`routeTracking.ts`)

### Integration Points
- `docusaurus.config.ts` lines 15-16: `url` and `baseUrl` — must become dynamic
- `headTags` (lines 55-72): GTM + PostHog scripts — must be conditional
- `scripts` (lines 74-80): SimpleAnalytics — must be conditional
- `clientModules` (line 82): route tracking — may need to be conditional
- GitHub repo: `HDGoldi/docusaurus-poc` → GH Pages URL: `https://hdgoldi.github.io/docusaurus-poc/`

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 04-github-pages-deployment*
*Context gathered: 2026-03-21*
