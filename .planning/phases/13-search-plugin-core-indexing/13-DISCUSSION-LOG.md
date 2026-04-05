# Phase 13: Search Plugin & Core Indexing - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-05
**Phase:** 13-search-plugin-core-indexing
**Areas discussed:** Rspack fallback strategy, Search context filtering, Index exclusions, Search result behavior

---

## Rspack Fallback Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Disable Rspack immediately | Turn off experimental_faster, confirm search works, re-enable later. Builds go from seconds to ~30-60s but search ships without delay. | ✓ |
| Investigate before disabling | Spend up to 1-2 hours debugging Rspack interaction. Only disable if investigation fails. | |
| Keep Rspack, defer search | Don't ship search until Rspack support confirmed upstream. Build speed is priority. | |

**User's choice:** Disable Rspack immediately (Recommended)
**Notes:** User prioritizes shipping search over build speed. Zero community precedent for Rspack + search plugin makes investigation low-ROI.

---

## Search Context Filtering

| Option | Description | Selected |
|--------|-------------|----------|
| Combined results only | Ship all results in one list. Add filtering in Phase 14 after seeing real behavior. | ✓ |
| Context filtering from day one | Configure searchContextByPaths in Phase 13. Users toggle between Documentation and API results. | |
| Claude's discretion | Let Claude decide based on plugin config during implementation. | |

**User's choice:** Combined results only (Recommended)
**Notes:** SRCH-04 partially deferred to Phase 14. Combined results sufficient for initial launch.

---

## Index Exclusions

| Option | Description | Selected |
|--------|-------------|----------|
| Exclude redirects now, measure rest | Add ignoreFiles for 80+ redirect stubs. Index API code samples, measure size, optimize in Phase 14. | ✓ |
| Index everything, optimize later | No exclusions in Phase 13. Measure and optimize in Phase 14. | |
| Aggressive exclusions upfront | Exclude redirect stubs AND API code samples. Smaller index but may miss useful hits. | |

**User's choice:** Exclude redirects now, measure rest (Recommended)
**Notes:** Redirect stubs have zero search value. API code samples kept for now — measurement-driven optimization.

---

## Search Result Behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Plugin defaults | Modal overlay, type-ahead, dimmed backdrop, context snippets, click-to-navigate. No customization. | ✓ |
| Navigate + highlight | Click navigates AND highlights matching terms on target page. | |
| Navigate + highlight + scroll | Full experience: navigate, scroll to match, highlight. Best UX but more config. | |

**User's choice:** Plugin defaults (Recommended)
**Notes:** Ship with zero customization in Phase 13. Highlighting and scroll-to-match deferred to Phase 14 UI polish.

---

## Claude's Discretion

- Exact ignoreFiles glob pattern for redirect stubs
- docsDir array configuration
- Additional plugin options (language, hashed, indexBlog)
- Implementation order of operations

## Deferred Ideas

- Search context filtering (searchContextByPaths) — Phase 14
- Result highlighting on target page — Phase 14
- Scroll-to-match — Phase 14
- Index size optimization — Phase 14
- Stop word filter removal — Future
- PostHog search analytics — Future
