# Phase 10: Crawler Foundation - Context

**Gathered:** 2026-04-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Enable search engines and AI crawlers to discover and index all site content by serving a properly configured robots.txt with sitemap reference, explicit AI crawler directives, and fixing the CloudFront Function to pass through static file paths and .well-known routes.

</domain>

<decisions>
## Implementation Decisions

### robots.txt Content
- **D-01:** Allow all general web crawlers (`User-agent: * / Allow: /`) — public docs site, maximum discoverability
- **D-02:** Include `Sitemap: https://help.1nce.com/sitemap.xml` directive — standard practice, Docusaurus sitemap plugin already generates sitemap.xml
- **D-03:** Disallow `/search` and `/tags` paths — low-value listing pages that dilute SEO

### AI Crawler Policy
- **D-04:** Use named allow-list approach — explicit `User-agent` + `Allow` blocks for each known AI crawler, not blanket allow-all
- **D-05:** Include core four + extras: GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot (Common Crawl), Bytespider (ByteDance)

### CloudFront Function Rewrite Logic
- **D-06:** Add `.well-known/` path allowlist to `infra/cf-function.js` — if URI starts with `/.well-known/`, skip the index.html rewrite entirely
- **D-07:** Code change only — no deployment instructions needed; deployment happens through existing infra workflow

### Static File Serving
- **D-08:** robots.txt lives at `static/robots.txt` — Docusaurus copies static/ contents to build root automatically
- **D-09:** Content-type fix for .md/.txt files deferred to Phase 12 — that's where .md serving (skill.md) is testable end-to-end

### Claude's Discretion
- No areas deferred to Claude's discretion — all decisions captured above.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Infrastructure
- `infra/cf-function.js` — Current CloudFront Function that needs .well-known allowlist fix
- `infra/template.yaml` — CloudFormation template (CF Function is defined/referenced here)

### Site Configuration
- `docusaurus.config.ts` — Main Docusaurus config; sitemap plugin is part of preset-classic
- `static/` — Directory where robots.txt will be placed

### Requirements
- `.planning/REQUIREMENTS.md` — CRAWL-01, CRAWL-02, CRAWL-03 requirements for this phase
- `.planning/ROADMAP.md` §Phase 10 — Success criteria (4 conditions that must be TRUE)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `@docusaurus/plugin-sitemap` (bundled in preset-classic) — already generates sitemap.xml in build output, no additional config needed
- `infra/cf-function.js` — CloudFront Function already handles extension-based routing; just needs .well-known path exception

### Established Patterns
- Static files go in `static/` directory — Docusaurus copies them to build root (see existing `static/img/`, `static/redirect-map.json`)
- CloudFront Function uses `cloudfront-js-2.0` runtime, attached as viewer-request

### Integration Points
- `static/robots.txt` → copied to `build/robots.txt` → served at help.1nce.com/robots.txt via S3+CloudFront
- `infra/cf-function.js` → deployed via CloudFormation template → attached to both prod and preview distributions

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches.

</specifics>

<deferred>
## Deferred Ideas

- Content-type header fix for .md/.txt files in S3 deploy pipeline — deferred to Phase 12 where skill.md makes it testable

</deferred>

---

*Phase: 10-crawler-foundation*
*Context gathered: 2026-04-03*
