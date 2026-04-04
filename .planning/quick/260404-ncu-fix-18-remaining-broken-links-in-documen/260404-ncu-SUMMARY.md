---
phase: quick-260404-ncu
plan: 01
subsystem: content
tags: [docusaurus, broken-links, broken-anchors, markdown, heading-ids]

requires:
  - phase: quick-260404-mdo
    provides: "Prior broken link fixes (75 links)"
provides:
  - "Zero broken link warnings in npm run build"
  - "Zero broken anchor warnings in npm run build"
affects: [content-fidelity, build-quality]

tech-stack:
  added: []
  patterns:
    - "Docusaurus h1 heading ID limitation: h1 in doc pages get no anchor IDs; use h2+ for linkable headings"
    - "Use {#custom-id} syntax on h2+ headings for non-default slug mapping"

key-files:
  created: []
  modified:
    - docs/documentation/**/*.md (37 files total across both tasks)

key-decisions:
  - "Demoted h1 headings to h2 in 9 files to fix anchor generation (Docusaurus strips IDs from h1 in doc pages)"
  - "Used {#custom-id} syntax for British/American spelling mismatch (organisation vs organization)"
  - "Removed broken footnote link [2](#2) rather than creating footnote target"

patterns-established:
  - "h1 anchor fix: Docusaurus doc pages use frontmatter title as page title; content headings should start at h2 for proper anchor ID generation"

requirements-completed: [content-fidelity]

duration: 12min
completed: 2026-04-04
---

# Quick Task 260404-ncu: Fix Broken Links and Anchors Summary

**Eliminated all broken link and anchor warnings from Docusaurus build by removing /index suffixes, fixing plugin paths, and demoting h1 headings to h2 for proper anchor ID generation**

## Performance

- **Duration:** 12 min
- **Started:** 2026-04-04T14:54:39Z
- **Completed:** 2026-04-04T15:06:24Z
- **Tasks:** 2
- **Files modified:** 37

## Accomplishments
- Removed /index suffix from ~50 category page links across 26 markdown files
- Fixed 3 wrong paths in sdk-blueprints-zephyr.md (2 plugin paths + 1 relative GitHub link)
- Fixed all 27 broken anchor references across 10 files by demoting h1 headings to h2 and correcting mismatched slugs
- Build now produces zero broken link and zero broken anchor warnings

## Task Commits

Each task was committed atomically:

1. **Task 1: Remove /index suffix and fix plugin paths** - `2cd204d` (fix)
2. **Task 2: Fix broken anchor references** - `2714554` (fix)

## Files Created/Modified

**Task 1 (27 files):** Bulk sed replacement of `/index)` with `/)` and `/index#` with `/#` across 26 files, plus 3 path fixes in sdk-blueprints-zephyr.md.

**Task 2 (10 files):**
- `docs/documentation/1nce-os/1nce-os-admin-logs/admin-logs-info-category.md` - Demoted h1 to h2
- `docs/documentation/1nce-os/1nce-os-cloud-integrator/cloud-integrator-aws-configuration.md` - Demoted h1 to h2
- `docs/documentation/1nce-os/1nce-os-cloud-integrator/index.md` - Demoted h1 to h2
- `docs/documentation/1nce-os/1nce-os-device-integrator/device-integrator-coap.md` - Removed broken footnote link
- `docs/documentation/1nce-portal/portal-configuration.md` - Demoted h1 to h2
- `docs/documentation/blueprints-examples/examples-sms/examples-mo-sms.md` - Demoted h1 to h2
- `docs/documentation/blueprints-examples/examples-sms/examples-mt-sms.md` - Demoted h1 to h2
- `docs/documentation/connectivity-services/connectivity-services-data-services/data-services-data-volume.md` - Demoted h1 to h2
- `docs/documentation/platform-services/platform-services-data-streamer/data-streamer-event-records.md` - Demoted h1 to h2, fixed #pdp-context-properties -> #pdp-context-object
- `docs/documentation/platform-services/platform-services-data-streamer/data-streamer-usage-records.md` - Demoted h1 to h2, fixed #currency-object -> #cost-object, added {#organization-object} custom ID

## Decisions Made
- **h1 to h2 demotion:** Docusaurus doc pages treat h1 as the page title (rendered without an ID attribute). Since all affected files have frontmatter `title:`, the content h1 headings were redundant as page titles. Demoting to h2 gives them proper anchor IDs while maintaining correct heading hierarchy.
- **Custom ID for Organisation/Organization mismatch:** Used `{#organization-object}` on `## Organisation Object` heading to match the American-spelled anchor `#organization-object` used in the table of contents link.
- **Removed broken footnote:** `[\[2\]](#2)` in device-integrator-coap.md had no footnote target -- replaced with plain `[2]` text.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Docusaurus h1 heading ID limitation required heading demotion**
- **Found during:** Task 2 (broken anchor fixes)
- **Issue:** Plan suggested adding `{#custom-id}` attributes or HTML `<a id="">` anchors to h1 headings. Neither approach works because Docusaurus strips all ID attributes from h1 headings in doc pages.
- **Fix:** Demoted all h1 headings to h2 (and h2 to h3, etc.) in the 9 affected files. H2+ headings get proper anchor IDs from Docusaurus.
- **Files modified:** 9 documentation markdown files
- **Verification:** `npm run build` produces zero broken anchor warnings
- **Committed in:** 2714554

**2. [Rule 1 - Bug] New broken anchors revealed after Task 1 link fixes**
- **Found during:** Task 2 verification
- **Issue:** Two additional broken anchors (`cloud-integrator-webhook-configuration -> #event-types` and `1nce-os-plugins-features-limitations -> #event-types`) were previously masked by the broken link error on `/index` paths. Once the link paths were fixed in Task 1, these anchor issues became visible.
- **Fix:** Addressed as part of the h1-to-h2 heading demotion in cloud-integrator/index.md
- **Committed in:** 2714554

---

**Total deviations:** 2 auto-fixed (2 bugs)
**Impact on plan:** Both auto-fixes were necessary to achieve the plan's goal. The h1 ID limitation was a Docusaurus behavior not anticipated in the plan. No scope creep.

## Issues Encountered
None beyond the deviations documented above.

## User Setup Required
None - no external service configuration required.

## Known Stubs
None.

## Self-Check: PASSED

- Commit 2cd204d: FOUND
- Commit 2714554: FOUND
- SUMMARY.md: FOUND
- Build: CLEAN (zero broken links, zero broken anchors)
