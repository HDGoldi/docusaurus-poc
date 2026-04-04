---
phase: 10-crawler-foundation
plan: 01
subsystem: infra
tags: [robots.txt, cloudfront, seo, ai-crawlers, well-known]

# Dependency graph
requires: []
provides:
  - robots.txt with sitemap reference and AI crawler allow-list at site root
  - CloudFront Function .well-known/ passthrough for future skill.md and llms.txt serving
affects: [12-llms-txt, 11-skills-md]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "CloudFront Function early-return pattern for path-specific bypass"

key-files:
  created:
    - static/robots.txt
  modified:
    - infra/cf-function.js
    - infra/template.yaml

key-decisions:
  - "Named AI crawler allow-list (6 bots) rather than blanket Allow for all"
  - "well-known passthrough as first check before SPA rewrite logic"
  - "Kept cf-function.js and template.yaml FunctionCode in sync manually"

patterns-established:
  - "CloudFront Function passthrough: early return before rewrite for special paths"
  - "Static file placement: static/ directory for files served at site root"

requirements-completed: [CRAWL-01, CRAWL-02, CRAWL-03]

# Metrics
duration: 2min
completed: 2026-04-03
---

# Phase 10 Plan 01: Crawler Foundation Summary

**robots.txt with 6 AI crawler allow-list, sitemap directive, and CloudFront .well-known/ passthrough**

## Performance

- **Duration:** 2 min
- **Started:** 2026-04-03T12:56:30Z
- **Completed:** 2026-04-03T12:58:18Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Created robots.txt with wildcard Allow, /search and /tags Disallow, and 6 named AI crawler directives (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, Bytespider)
- Added .well-known/ path passthrough to CloudFront Function in both cf-function.js and template.yaml, enabling future Phase 12 llms.txt and Phase 11 skill.md serving
- Preserved all existing SPA rewrite behavior for non-.well-known paths

## Task Commits

Each task was committed atomically:

1. **Task 1: Create robots.txt with AI crawler directives** - `01f947f` (feat)
2. **Task 2: Add .well-known passthrough to CloudFront Function** - `edb6f08` (feat)

## Files Created/Modified
- `static/robots.txt` - robots.txt with sitemap reference, wildcard rules, and 6 AI crawler allow directives
- `infra/cf-function.js` - CloudFront Function with .well-known/ early return passthrough
- `infra/template.yaml` - CloudFormation template with matching inline CF function code

## Decisions Made
None - followed plan as specified

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- Pre-existing build failure in src/theme/Root.tsx (useDocusaurusContext not defined) prevents `npm run build` verification. This is unrelated to plan changes (caused by chat widget code from Phase 6). The robots.txt static file copy mechanism is standard Docusaurus behavior and will work once the pre-existing issue is resolved.

## User Setup Required

None - no external service configuration required. CloudFront Function deployment happens through existing infra workflow.

## Next Phase Readiness
- .well-known/ path passthrough is ready for Phase 11 (skill.md) and Phase 12 (llms.txt)
- robots.txt will be served at build root once deployed
- CloudFormation template update requires stack deployment to take effect in production

## Self-Check: PASSED

All files exist. All commits verified.

---
*Phase: 10-crawler-foundation*
*Completed: 2026-04-03*
