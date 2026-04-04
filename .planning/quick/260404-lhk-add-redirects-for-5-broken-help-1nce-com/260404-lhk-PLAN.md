---
phase: quick
plan: 260404-lhk
type: execute
wave: 1
depends_on: []
files_modified:
  - docusaurus.config.ts
autonomous: true
---

<objective>
Add 4 static redirects to docusaurus.config.ts for broken help.1nce.com URLs found in the link check report (5th URL is auto-resolved by query-param stripping once the base redirect exists).

Purpose: Eliminate 5 broken inbound links, the most critical being `/dev-hub/docs` which is linked from 100+ pages across 1nce.com.
Output: Updated docusaurus.config.ts with new redirect entries.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@docusaurus.config.ts (lines 155-218 — plugin-client-redirects config)

The redirect plugin has two mechanisms:
1. **Static `redirects` array** (lines 156-171) — explicit `{ from, to }` pairs
2. **`createRedirects` function** (lines 173-217) — dynamic pattern-based redirects

Current dynamic rules already handle `/dev-hub/docs/{slug}` for pages whose slug matches the last segment of their current path. But these 5 URLs fall through because:
- `/dev-hub/docs` has no slug (it is the bare index)
- `introduction-1nce-sim-card` was the old ReadMe slug; the new page is `sim-cards-knowledge`
- `modems` was the old slug; the new page is `blueprints-examples/examples-hardware-guides`
- `/starting-guide/docs/apn-overview` uses a completely different path prefix (`starting-guide` vs `dev-hub`)

Redirect mapping:
| Broken URL | Target |
|---|---|
| `/dev-hub/docs` | `/docs/` |
| `/dev-hub/docs?_gl=...` | `/docs/` (resolved by above — query params stripped by client router) |
| `/dev-hub/docs/introduction-1nce-sim-card` | `/docs/sim-cards/sim-cards-knowledge/` |
| `/dev-hub/docs/modems` | `/docs/blueprints-examples/examples-hardware-guides/` |
| `/starting-guide/docs/apn-overview` | `/docs/connectivity-services/connectivity-services-data-services/data-services-apn/` |
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add static redirects for 4 broken URLs</name>
  <files>docusaurus.config.ts</files>
  <action>
In the `redirects` array inside the `@docusaurus/plugin-client-redirects` plugin config (around line 156), add these 4 entries after the existing `{ from: '/dev-hub', to: '/docs/' }` line (line 160):

```typescript
// Old ReadMe dev-hub/docs index (HIGH — linked from 100+ pages on 1nce.com)
{ from: '/dev-hub/docs', to: '/docs/' },
// Old ReadMe slug renamed pages
{ from: '/dev-hub/docs/introduction-1nce-sim-card', to: '/docs/sim-cards/sim-cards-knowledge/' },
{ from: '/dev-hub/docs/modems', to: '/docs/blueprints-examples/examples-hardware-guides/' },
// Old starting-guide path prefix
{ from: '/starting-guide/docs/apn-overview', to: '/docs/connectivity-services/connectivity-services-data-services/data-services-apn/' },
```

Do NOT modify the `createRedirects` function. These are one-off slug remaps that do not follow a pattern generalizable enough for programmatic generation.
  </action>
  <verify>
    <automated>cd /Users/Jan.Sulaiman/_Projects/docusaurus_poc && npx docusaurus build 2>&1 | tail -5</automated>
  </verify>
  <done>
- Build succeeds with no errors
- All 4 new entries present in the redirects array
- `/dev-hub/docs` redirects to `/docs/`
- `/dev-hub/docs/introduction-1nce-sim-card` redirects to `/docs/sim-cards/sim-cards-knowledge/`
- `/dev-hub/docs/modems` redirects to `/docs/blueprints-examples/examples-hardware-guides/`
- `/starting-guide/docs/apn-overview` redirects to `/docs/connectivity-services/connectivity-services-data-services/data-services-apn/`
  </done>
</task>

</tasks>

<verification>
Build completes without errors. Spot-check by inspecting the build output for redirect HTML files:
```bash
ls build/dev-hub/docs/index.html build/dev-hub/docs/introduction-1nce-sim-card/index.html build/dev-hub/docs/modems/index.html build/starting-guide/docs/apn-overview/index.html
```
Each should contain a meta refresh tag pointing to the correct target.
</verification>

<success_criteria>
- `npx docusaurus build` passes
- 4 redirect HTML files exist in build output at the expected paths
- Each redirect file contains a meta refresh to the correct destination
</success_criteria>

<output>
After completion, create `.planning/quick/260404-lhk-add-redirects-for-5-broken-help-1nce-com/260404-lhk-SUMMARY.md`
</output>
