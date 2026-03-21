---
phase: 02-site-assembly
plan: 05
status: complete
started: "2026-03-21T21:30:00Z"
completed: "2026-03-21T21:45:00Z"
gap_closure: true
---

# Summary: Fix API Explorer Navbar Landing Page and Sidebar Ordering

## What was built

Closed UAT gaps 1, 2, and 3 from phase 02 user acceptance testing:

1. **Gap 1 — Navbar landing page**: Changed API Explorer navbar item from `type: 'docSidebar'` to `type: 'doc'` with `docId: 'index'`, so clicking the tab lands on the API introduction page instead of the alphabetically first doc (1nce-os).

2. **Gap 2 — Sidebar ordering**: Created `_category_.json` files in all 6 API subdirectories with explicit position values: Authorization (1), SIM Management (2), Order Management (3), Product Information (4), Support Management (5), 1NCE OS (6).

3. **Gap 3 — CORS limitation**: Added a visible warning to `docs/api/index.md` explaining that the Try It panel encounters CORS errors because `api.1nce.com` doesn't return CORS headers, with guidance to copy curl/code snippets for local execution.

4. **Gap 4 — redirect-map.json**: Confirmed as false positive (file is valid JSON; dev server SPA fallback intercepted the request during testing). No action needed.

## Self-Check: PASSED

- [x] API Explorer navbar tab navigates to /api (intro page)
- [x] API sidebar categories appear in logical order (not alphabetical)
- [x] CORS limitation documented in API index page
- [x] Build completes without errors
- [x] Human verification approved

## Key Files

### key-files.created
- docs/api/authorization/_category_.json
- docs/api/sim-management/_category_.json
- docs/api/order-management/_category_.json
- docs/api/product-information/_category_.json
- docs/api/support-management/_category_.json
- docs/api/1nce-os/_category_.json

### key-files.modified
- docusaurus.config.ts
- docs/api/index.md

## Deviations

None. All changes matched the plan exactly.
