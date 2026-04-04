---
phase: quick-260404-mdo
plan: 01
subsystem: redirects
tags: [docusaurus, client-redirects, broken-links, seo]

requires:
  - phase: quick-260404-luu
    provides: "Initial 110 broken link fixes and createRedirects safety net"
provides:
  - "40 static redirect rules for old blueprint and section URLs"
  - "Dynamic /index/ suffix redirect handling for 4 doc sections"
  - "Fixed broken source links in 4 markdown files"
affects: [seo, external-bookmarks, search-engine-indexes]

tech-stack:
  added: []
  patterns: ["Static redirects for old leaf pages -> parent module pages", "/index/ suffix handling via createRedirects"]

key-files:
  created: []
  modified:
    - docusaurus.config.ts
    - docs/documentation/network-services/network-services-vpn-service/vpn-service-openvpn-files.md
    - docs/documentation/1nce-os/1nce-os-device-integrator/device-integrator-udp.md
    - docs/documentation/1nce-portal/portal-sims-sms.md
    - docs/documentation/blueprints-examples/examples-overview.md

key-decisions:
  - "Used single /index (no trailing slash) in createRedirects to avoid EEXIST collision with trailingSlash:true"
  - "Removed static examples-sms-forwarder/index redirect since createRedirects /index/ handler covers it dynamically"
  - "examples-data-streamer-http.md lines 40-41 confirmed as false positives (already in backticks)"

patterns-established: []

requirements-completed: []

duration: 4min
completed: 2026-04-04
---

# Quick Task 260404-mdo: Fix 75 Remaining Broken Links Summary

**40 static redirects for old blueprint leaf pages plus dynamic /index/ suffix handling and 4 markdown source link fixes**

## Performance

- **Duration:** 4 min
- **Started:** 2026-04-04T14:11:14Z
- **Completed:** 2026-04-04T14:16:00Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Added 40 static redirect rules covering old /blueprints-examples/ leaf pages, wrong plugin paths, deep SDK paths, and root shortcut URLs
- Added dynamic /index/ suffix redirect generation in createRedirects for 4 doc sections (1nce-os, network-services, platform-services, blueprints-examples)
- Fixed broken source links in 4 markdown files: vpn-service-openvpn-files, device-integrator-udp, portal-sims-sms, examples-overview

## Task Commits

Each task was committed atomically:

1. **Task 1: Add 40 missing redirect rules in docusaurus.config.ts** - `dc2b4aa` (feat)
2. **Task 2: Fix remaining broken links in markdown source files** - `508355f` (fix)

## Files Created/Modified
- `docusaurus.config.ts` - Added 40 static redirect entries and /index/ suffix createRedirects block
- `docs/documentation/network-services/network-services-vpn-service/vpn-service-openvpn-files.md` - Fixed relative examples-vpn link to absolute /docs/ path
- `docs/documentation/1nce-os/1nce-os-device-integrator/device-integrator-udp.md` - Fixed historian link to correct /device-inspector/ directory
- `docs/documentation/1nce-portal/portal-sims-sms.md` - Added missing /sim-cards/ segment to 2 IMEI reference links
- `docs/documentation/blueprints-examples/examples-overview.md` - Fixed 4 root shortcut links to full /docs/blueprints-examples/ paths

## Decisions Made
- Used single `/index` (without trailing slash) variant in createRedirects to avoid EEXIST file collision when `trailingSlash: true` causes both `/index` and `/index/` to resolve to the same filesystem path
- Removed the static `examples-sms-forwarder/index` redirect entry since the dynamic createRedirects /index/ handler already covers it, preventing a duplicate redirect warning
- Confirmed examples-data-streamer-http.md lines 40-41 are false positives (URL patterns already inside backticks, not rendered as links)
- Confirmed sms-services-features-limitations.md portal-sims-sms link is already correct

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed /index/ redirect EEXIST build collision**
- **Found during:** Task 1 (adding redirect rules)
- **Issue:** Plan specified generating both `/index/` and `/index` variants in createRedirects, but with `trailingSlash: true` both resolve to the same `index/index.html` file, causing EEXIST error on build
- **Fix:** Removed the trailing-slash `/index/` variant, keeping only `/index` which Docusaurus normalizes to `/index/` internally
- **Files modified:** docusaurus.config.ts
- **Verification:** `npm run build` succeeds without EEXIST errors
- **Committed in:** dc2b4aa (Task 1 commit)

**2. [Rule 3 - Blocking] Removed duplicate static redirect for examples-sms-forwarder/index**
- **Found during:** Task 1 (adding redirect rules)
- **Issue:** Static redirect for `/blueprints-examples/examples-sms-forwarder/index` conflicted with the dynamically generated one from createRedirects /index/ handler, causing "multiple redirects with same from pathname" warning
- **Fix:** Removed the static entry since the createRedirects handler covers it
- **Files modified:** docusaurus.config.ts
- **Verification:** Build warning for duplicate examples-sms-forwarder/index redirect eliminated
- **Committed in:** dc2b4aa (Task 1 commit)

---

**Total deviations:** 2 auto-fixed (2 blocking)
**Impact on plan:** Both fixes necessary for build to succeed. Final redirect count is 40 (plan said 41; one was deduplicated). No scope creep.

## Issues Encountered
None beyond the deviations documented above.

## User Setup Required
None - no external service configuration required.

## Known Stubs
None.

## Next Phase Readiness
- All redirect rules in place for old bookmark and search engine URLs
- Pre-existing broken anchor warnings remain (anchor fragments within pages, not path-level issues) -- separate concern from this task

---
*Quick task: 260404-mdo*
*Completed: 2026-04-04*
