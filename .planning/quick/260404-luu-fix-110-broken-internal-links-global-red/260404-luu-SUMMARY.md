---
phase: quick
plan: 260404-luu
subsystem: content-links
tags: [broken-links, redirects, seo, content-quality]
dependency_graph:
  requires: []
  provides: [internal-link-integrity, legacy-url-redirects]
  affects: [docs/documentation, docusaurus.config.ts]
tech_stack:
  added: []
  patterns: [createRedirects-safety-net, bulk-fix-script]
key_files:
  created:
    - scripts/fix-missing-docs-prefix.ts
  modified:
    - docusaurus.config.ts
    - 59 markdown files under docs/documentation/ and docs/api/
decisions:
  - Used createRedirects for /{section}/ -> /docs/{section}/ safety net rather than CloudFront rules (correct layer for URL mapping)
  - Converted malformed backtick-wrapped URLs to plain inline code rather than fixing as links (they are example URLs, not real links)
metrics:
  duration: 215s
  completed: "2026-04-04"
  tasks: 3
  files: 61
---

# Quick Task 260404-luu: Fix 110 Broken Internal Links Summary

Bulk-fixed all 110 broken internal links across 59 markdown files using an idempotent TypeScript script, added createRedirects safety net for legacy URL patterns, and verified build success with zero remaining broken link patterns.

## Task Results

| Task | Name | Commit | Key Changes |
|------|------|--------|-------------|
| 1 | Fix all broken links in markdown source files | 7205818 | 59 files modified, 5 categories of fixes applied |
| 2 | Add createRedirects safety net for legacy URL patterns | 83f4184 | docusaurus.config.ts: 6-section redirect + /dev-hub/openapi static redirect |
| 3 | Verify all 110 broken links are resolved | (verification only) | Build succeeds, all checks pass |

## What Changed

### Category A: Missing /docs/ prefix (56 links, 49 files)
Regex-replaced bare section paths like `](/1nce-os/...)` with `](/docs/1nce-os/...)` across all markdown files. Also mapped root-level `/examples-*` and `/recipes` paths to `/docs/blueprints-examples/...`.

### Category B: Unresolved doc: references (7 links)
Replaced 5 `/unresolved/doc:*` paths and 2 `href="doc:*"` attributes with correct absolute paths to existing pages.

### Category C: Hardcoded cross-page relative links (7 links)
Converted 7 relative `href` attributes (e.g., `href="examples-hardware-guides"`) to absolute paths (e.g., `href="/docs/blueprints-examples/examples-hardware-guides/"`). Also fixed 2 `/index` suffix links in sms-services-mo-sms.md.

### Category D: Malformed URLs (3 links)
- Removed angle bracket wrapping from href in sim-euicc-knowledge.md
- Converted backtick-wrapped pseudo-links to plain inline code in examples-data-streamer-http.md

### Category E: Misc fixes (2 links)
- `https://help.1nce.com/dev-hub/openapi` -> `/api/` in docs/api/index.md
- `link: "/examples-sms-forwarder"` -> `link: "/docs/blueprints-examples/examples-sms-forwarder/"` in examples-overview.md

### Safety Net Redirects
Added `createRedirects` rules generating `/{section}/... -> /docs/{section}/...` redirect HTML pages for 6 doc sections (1nce-os, network-services, platform-services, 1nce-portal, connectivity-services, sim-cards). Also added static redirect `/dev-hub/openapi -> /api/`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Escaped angle brackets in malformed URL regex**
- **Found during:** Task 1
- **Issue:** The data-streamer-http.md file used `\<\<` (escaped angle brackets) which didn't match the script's regex pattern
- **Fix:** Fixed the file directly and updated the script regex to handle both escaped and unescaped angle brackets
- **Files modified:** docs/documentation/blueprints-examples/examples-data-streamer/examples-data-streamer-http.md, scripts/fix-missing-docs-prefix.ts
- **Commit:** 7205818

## Known Stubs

None.

## Verification Results

- Build: SUCCESS (npm run build completed with no errors)
- `grep -r "unresolved/doc:" docs/`: 0 matches
- `grep -rcE '\]\(/(1nce-os|network-services|platform-services|1nce-portal|blueprints-examples)/' docs/documentation/`: 0 matches
- `grep -r 'href="doc:' docs/`: 0 matches
- `grep -r 'href="<https://' docs/`: 0 matches
- Redirect HTML pages generated for all 6 sections (verified build/1nce-os/1nce-os-admin-logs/index.html)
- /dev-hub/openapi redirect page exists in build output

## Notes

The build output shows some "broken anchor" warnings for hash fragments (e.g., `#example-scenarios`, `#1nce-portal--sms-console`). These are pre-existing anchor mismatches within correctly-linked pages and are out of scope for this task (which targets broken page-level links, not fragment anchors).
