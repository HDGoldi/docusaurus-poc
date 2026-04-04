---
phase: 12-ai-agent-integration
plan: 01
subsystem: infra
tags: [agent-skills, well-known, s3, content-type, ai-agent, skill-md]

# Dependency graph
requires:
  - phase: 10-crawler-foundation
    provides: CloudFront .well-known passthrough and robots.txt
provides:
  - "AI agent skill file at /.well-known/skills/default/skill.md"
  - "Skill discovery index at /.well-known/skills/index.json"
  - "Content-type fix for .md files in S3 deploy pipeline"
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Agent Skills specification for AI coding agent discovery"
    - "S3 in-place copy with --metadata-directive REPLACE for content-type overrides"

key-files:
  created:
    - "static/.well-known/skills/default/skill.md"
    - "static/.well-known/skills/index.json"
  modified:
    - ".github/workflows/deploy.yml"

key-decisions:
  - "Used name: default in frontmatter per Agent Skills spec (must match parent directory name)"
  - "Three workflows: SIM lifecycle, device onboarding, connectivity monitoring"
  - "Content-type fix runs after both S3 sync steps to avoid being overwritten"

patterns-established:
  - "Static .well-known files go in static/ directory for Docusaurus to copy to build output"
  - "S3 content-type overrides use aws s3 cp --recursive --metadata-directive REPLACE after sync"

requirements-completed: [AGENT-01, AGENT-02, AGENT-03, AGENT-04]

# Metrics
duration: 2min
completed: 2026-04-04
---

# Phase 12 Plan 01: AI Agent Skill File Summary

**Agent Skills spec-compliant skill.md with auth walkthrough, 3 multi-step API workflows, and gotchas plus S3 content-type fix for .md files**

## Performance

- **Duration:** 2 min
- **Started:** 2026-04-04T12:53:41Z
- **Completed:** 2026-04-04T12:55:57Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Created skill.md with full auth flow (Basic Auth to Bearer token), 3 multi-step workflows (SIM lifecycle, device onboarding, connectivity monitoring), and comprehensive gotchas section
- Created index.json discovery file pointing to skill.md
- Added content-type fix for .md files in both production and preview deploy jobs

## Task Commits

Each task was committed atomically:

1. **Task 1: Create skill.md and index.json static files** - `a79a3e5` (feat)
2. **Task 2: Add content-type fix for .md files in deploy workflow** - `f0b321f` (chore)

## Files Created/Modified
- `static/.well-known/skills/default/skill.md` - AI agent skill file with auth, workflows, gotchas (179 lines)
- `static/.well-known/skills/index.json` - Skill discovery index with single entry
- `.github/workflows/deploy.yml` - Added content-type fix steps in both deploy jobs

## Decisions Made
- Used `name: default` in frontmatter per Agent Skills spec requirement (must match parent directory name)
- Chose 3 workflows: SIM lifecycle management, device onboarding with 1NCE OS, connectivity monitoring -- these cover the most common developer use cases
- Content-type fix uses `aws s3 cp` with `--metadata-directive REPLACE` to override S3 default content-type for .md files

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- skill.md and index.json are served as static files, no build-time processing needed
- Content-type fix ensures .md files are served as text/markdown instead of application/octet-stream
- CloudFront .well-known passthrough (from Phase 10) ensures these paths are not rewritten to index.html

---
*Phase: 12-ai-agent-integration*
*Completed: 2026-04-04*

## Self-Check: PASSED
