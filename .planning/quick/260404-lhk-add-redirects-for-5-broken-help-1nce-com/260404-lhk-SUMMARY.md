---
phase: quick
plan: 260404-lhk
subsystem: redirects
tags: [redirects, seo, broken-links]
dependency_graph:
  requires: []
  provides: [redirect-dev-hub-docs, redirect-sim-card, redirect-modems, redirect-apn-overview]
  affects: [docusaurus.config.ts]
tech_stack:
  added: []
  patterns: [static-redirects]
key_files:
  modified:
    - docusaurus.config.ts
decisions:
  - Used static redirects array (not createRedirects function) since these are one-off slug remaps
metrics:
  duration: 62s
  completed: "2026-04-04T13:33:02Z"
  tasks_completed: 1
  tasks_total: 1
---

# Quick Task 260404-lhk: Add Redirects for 5 Broken help.1nce.com URLs Summary

4 static redirects added to docusaurus.config.ts for broken inbound links, covering 5 URLs (the 5th is auto-resolved by query-param stripping).

## What Changed

Added 4 entries to the `redirects` array in the `@docusaurus/plugin-client-redirects` config:

| From | To | Priority |
|---|---|---|
| `/dev-hub/docs` | `/docs/` | HIGH (100+ inbound links from 1nce.com) |
| `/dev-hub/docs/introduction-1nce-sim-card` | `/docs/sim-cards/sim-cards-knowledge/` | Normal |
| `/dev-hub/docs/modems` | `/docs/blueprints-examples/examples-hardware-guides/` | Normal |
| `/starting-guide/docs/apn-overview` | `/docs/connectivity-services/connectivity-services-data-services/data-services-apn/` | Normal |

The 5th broken URL (`/dev-hub/docs?_gl=...`) is automatically handled by the `/dev-hub/docs` redirect since client-side routing strips query parameters.

## Verification

- Build succeeded with no errors
- All 4 redirect HTML files confirmed in build output
- Each contains correct meta refresh tag pointing to target URL

## Deviations from Plan

None -- plan executed exactly as written.

## Commits

| Task | Commit | Description |
|---|---|---|
| 1 | cbcb457 | Add 4 static redirects for broken help.1nce.com URLs |

## Self-Check: PASSED
