# Phase 14: Search UI Branding & Polish - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-05
**Phase:** 14-search-ui-branding-polish
**Areas discussed:** Overlay styling, Result highlighting, Context tab filtering, Index optimization

---

## Overlay Styling

| Option | Description | Selected |
|--------|-------------|----------|
| Navy header + white body | Modal header in 1NCE navy (#194a7d) with white text, white body, teal hover accents. Matches navbar/footer. | ✓ |
| All-white minimal | White modal throughout with subtle gray borders. Navy/teal only for highlights. | |
| Teal accent bar | Thin teal top border instead of full navy header. Lighter branding touch. | |

**User's choice:** Navy header + white body
**Notes:** None — selected recommended option.

| Option | Description | Selected |
|--------|-------------|----------|
| Medium dim | rgba(0,0,0,0.5) — standard modal pattern | ✓ |
| Light dim | rgba(0,0,0,0.3) — subtle overlay | |
| Heavy dim | rgba(0,0,0,0.7) — strong focus on modal | |

**User's choice:** Medium dim
**Notes:** None — selected recommended option.

---

## Result Highlighting

| Option | Description | Selected |
|--------|-------------|----------|
| Teal background highlight | rgba(41,171,226,0.15) with bold text. Consistent with 1NCE teal accent. | ✓ |
| Bold only | Bold text, no background color. Minimal but less distinct. | |
| Yellow marker style | rgba(255,215,0,0.3) traditional highlighter. High visibility, doesn't match palette. | |

**User's choice:** Teal background highlight
**Notes:** None — selected recommended option.

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, highlight on target page | Enable highlightSearchTermsOnTargetPage. Same teal highlight on navigated page. | ✓ |
| No, just in results | Only highlight in search results list. | |

**User's choice:** Yes, highlight on target page
**Notes:** None — selected recommended option.

---

## Context Tab Filtering

| Option | Description | Selected |
|--------|-------------|----------|
| Tabs above results | Two tabs: "All" / "Docs" / "API". Uses searchContextByPaths config. | ✓ |
| No filtering — combined only | Keep Phase 13 behavior: all results mixed. | |
| Badge labels only | No toggle, but [DOCS]/[API] badges on each result. | |

**User's choice:** Tabs above results
**Notes:** None — selected recommended option.

| Option | Description | Selected |
|--------|-------------|----------|
| All / Docs / API | Shorter labels, saves horizontal space | ✓ |
| All / Documentation / API | Matches navbar tab names exactly | |
| All / Guides / Endpoints | More descriptive of content type | |

**User's choice:** All / Docs / API
**Notes:** None — preferred shorter labels.

---

## Index Optimization

| Option | Description | Selected |
|--------|-------------|----------|
| Optimize only if > 5MB compressed | Measurement-driven per Phase 13 D-08 threshold | ✓ |
| Always trim API code samples | Proactively exclude code samples regardless of size | |
| You decide | Claude evaluates actual index size and decides | |

**User's choice:** Optimize only if > 5MB compressed
**Notes:** None — selected recommended option.

| Option | Description | Selected |
|--------|-------------|----------|
| Boost titles over body | Title matches rank higher than body matches | ✓ |
| Plugin defaults | Use plugin's out-of-box ranking | |
| Defer to future | Skip ranking tuning for Phase 14 | |

**User's choice:** Boost titles over body
**Notes:** None — selected recommended option.

---

## Claude's Discretion

- Exact CSS selectors for plugin modal override
- Teal highlight fade timing on target page
- searchContextByPaths path configuration mapping
- Whether title boosting is achievable via plugin config or requires custom scoring

## Deferred Ideas

- Stop-word removal tuning for IoT/telecom domain terms (future SRCH-05)
- PostHog search analytics (future SRCH-06)
