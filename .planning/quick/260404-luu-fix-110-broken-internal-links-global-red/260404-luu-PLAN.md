---
phase: quick
plan: 260404-luu
type: execute
wave: 1
depends_on: []
files_modified:
  - docs/documentation/1nce-os/1nce-os-energy-saver/energy-saver-binary-conversion-language.md
  - docs/documentation/1nce-os/1nce-os-lwm2m/lwm2m-features-limitations.md
  - docs/documentation/1nce-os/1nce-os-device-locator/index.md
  - docs/documentation/1nce-portal/portal-configuration.md
  - docs/documentation/connectivity-services/connectivity-services-sms-services/sms-services-features-limitations.md
  - docs/documentation/sim-cards/sim-euicc-knowledge.md
  - docs/documentation/blueprints-examples/examples-sms/examples-mo-sms.md
  - docs/documentation/blueprints-examples/examples-sms/examples-mt-sms.md
  - docs/documentation/blueprints-examples/examples-sms/index.md
  - docs/documentation/platform-services/platform-services-sms-forwarder/sms-forwarder-features-limitations.md
  - docs/documentation/platform-services/platform-services-sms-forwarder/sms-forwarder-error-states.md
  - docs/documentation/connectivity-services/connectivity-services-sms-services/sms-services-mo-sms.md
  - docs/documentation/blueprints-examples/examples-data-streamer/examples-data-streamer-http.md
  - docs/documentation/blueprints-examples/examples-overview.md
  - docs/api/index.md
  - scripts/fix-missing-docs-prefix.ts
  - docusaurus.config.ts
autonomous: true
requirements: []
must_haves:
  truths:
    - "All 110 broken internal links return 200 instead of 404"
    - "No new broken links introduced by the fixes"
    - "Build completes with no errors"
  artifacts:
    - path: "scripts/fix-missing-docs-prefix.ts"
      provides: "Automated fixer script for missing /docs/ prefix in 48 markdown files"
    - path: "docusaurus.config.ts"
      provides: "createRedirects catch-all for legacy paths missing /docs/ prefix"
  key_links:
    - from: "markdown source files"
      to: "/docs/{section}/..."
      via: "corrected internal links"
      pattern: "/docs/(1nce-os|network-services|platform-services|1nce-portal|blueprints-examples|sim-cards|connectivity-services)"
---

<objective>
Fix all 110 broken internal links found by full-site crawl of help.1nce.com.

Purpose: Eliminate all internal 404s to improve user experience and SEO.
Output: Fixed markdown source files, a bulk-fix script, and redirect safety net in docusaurus.config.ts.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@docusaurus.config.ts
@infra/cf-function.js
@.planning/quick/260404-lhk-add-redirects-for-5-broken-help-1nce-com/260404-lhk-SUMMARY.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Fix all broken links in markdown source files</name>
  <files>
    scripts/fix-missing-docs-prefix.ts
    Plus ~48 markdown files in docs/documentation/ (see action for details)
  </files>
  <action>
Create and run a Node.js script (`scripts/fix-missing-docs-prefix.ts`) that performs all markdown fixes in one pass. The script should:

**A) Fix Category 2 — Missing `/docs/` prefix (56 links, ~48 files):**

Search all `.md` files under `docs/documentation/` for markdown links `](/1nce-os/`, `](/network-services/`, `](/platform-services/`, `](/1nce-portal/`, `](/blueprints-examples/`, `](/sim-cards/`, `](/connectivity-services/` and HTML href attributes with the same patterns. Replace with `/docs/` prefix:
- `](/1nce-os/...` -> `](/docs/1nce-os/...`
- `href="/1nce-os/...` -> `href="/docs/1nce-os/...`
- Same for: `network-services`, `platform-services`, `1nce-portal`, `blueprints-examples`, `sim-cards`, `connectivity-services`

Also fix root-level paths that need mapping:
- `](/examples-data-streamer` -> `](/docs/blueprints-examples/examples-data-streamer`
- `](/examples-sms` -> `](/docs/blueprints-examples/examples-sms`  (but NOT `examples-sms-forwarder`)
- `](/examples-sms-forwarder` -> `](/docs/blueprints-examples/examples-sms-forwarder`
- `](/examples-vpn` -> `](/docs/blueprints-examples/examples-vpn`
- `](/recipes` -> `](/docs/blueprints-examples/recipes`

**B) Fix Category 1 — Unresolved `doc:` references (5 links + 2 inline `doc:` hrefs):**

These are hardcoded in specific files. Fix each manually in the script:

1. `docs/documentation/1nce-os/1nce-os-energy-saver/energy-saver-binary-conversion-language.md` line 29:
   - `/unresolved/doc:data-broker-udp` -> `/docs/1nce-os/1nce-os-device-integrator/device-integrator-udp/`

2. `docs/documentation/1nce-os/1nce-os-lwm2m/lwm2m-features-limitations.md` line 48:
   - `/unresolved/doc:device-integrator-activate-endpoints` -> `/docs/1nce-os/1nce-os-device-integrator/` (no activate-endpoints page exists; link to the integrator index)

3. `docs/documentation/1nce-os/1nce-os-device-locator/index.md` line 121:
   - `/unresolved/doc:evice-locator-geofencing-guide` -> `/docs/1nce-os/1nce-os-device-locator/device-locator-geofencing-guide/`

4. `docs/documentation/1nce-portal/portal-configuration.md` line 141:
   - `/unresolved/doc:streamer-setup` -> `/docs/platform-services/platform-services-data-streamer/data-streamer-setup-guides/`

5. `docs/documentation/1nce-portal/portal-configuration.md` line 159:
   - `/unresolved/doc:sms-services-sms-forwarding-service` -> `/docs/platform-services/platform-services-sms-forwarder/`

6. `docs/documentation/connectivity-services/connectivity-services-sms-services/sms-services-features-limitations.md` line 28:
   - `href="doc:portal-sims-sms"` -> `href="/docs/1nce-portal/portal-sims-sms/"`

7. `docs/documentation/connectivity-services/connectivity-services-sms-services/sms-services-features-limitations.md` line 32:
   - `href="doc:platform-services-sms-forwarder"` -> `href="/docs/platform-services/platform-services-sms-forwarder/"`

**C) Fix Category 3 — Hardcoded cross-page relative links (7 links):**

These are relative `href` attributes that resolve to wrong paths. Fix each:

1. `docs/documentation/blueprints-examples/examples-sms/examples-mo-sms.md` line 162:
   - `href="examples-hardware-guides"` -> `href="/docs/blueprints-examples/examples-hardware-guides/"`

2. `docs/documentation/blueprints-examples/examples-sms/examples-mt-sms.md` line 401:
   - `href="examples-hardware-guides"` -> `href="/docs/blueprints-examples/examples-hardware-guides/"`

3. `docs/documentation/blueprints-examples/examples-sms/index.md` line 19:
   - `href="examples-sms-forwarder"` -> `href="/docs/blueprints-examples/examples-sms-forwarder/"`

4. `docs/documentation/connectivity-services/connectivity-services-sms-services/sms-services-features-limitations.md` line 14:
   - `href="portal-sims-sms"` -> `href="/docs/1nce-portal/portal-sims-sms/"` (relative href resolves to wrong path)

5. `docs/documentation/platform-services/platform-services-sms-forwarder/sms-forwarder-features-limitations.md` line 36:
   - `href="examples-sms-forwarder"` -> `href="/docs/blueprints-examples/examples-sms-forwarder/"`

6. `docs/documentation/platform-services/platform-services-sms-forwarder/sms-forwarder-error-states.md` line 10:
   - `href="examples-sms-forwarder-testing"` -> `href="/docs/blueprints-examples/examples-sms-forwarder/examples-sms-forwarder-testing/"`

7. `docs/documentation/connectivity-services/connectivity-services-sms-services/sms-services-mo-sms.md` line 28:
   - `(/platform-services/platform-services-sms-forwarder/index)` -> `(/docs/platform-services/platform-services-sms-forwarder/)`
   - `(/blueprints-examples/examples-sms-forwarder/index)` -> `(/docs/blueprints-examples/examples-sms-forwarder/)`

**D) Fix Category 4 — Malformed URLs (3 links):**

1. `docs/documentation/sim-cards/sim-euicc-knowledge.md` line 32:
   - `href="<https://www.1nce.com/en-eu/support/contact>"` -> `href="https://www.1nce.com/en-eu/support/contact"`
   (Remove the wrapping `<` and `>` angle brackets)

2. `docs/documentation/blueprints-examples/examples-data-streamer/examples-data-streamer-http.md` lines 40-41:
   - The markdown link syntax uses backtick-wrapped URLs. Fix from:
     ```[<<`````https://"server-ip":"port"/"endpoint"/`````>>](`````https://"server-ip":"port"/"endpoint"/`````)```
   - To plain inline code: `` `https://"server-ip":"port"/"endpoint"/` `` (not a link, just code)
   - Same for the server-domain variant on line 41.

**E) Fix Category 5 misc — `/dev-hub/openapi` link:**

1. `docs/api/index.md` line 10:
   - `https://help.1nce.com/dev-hub/openapi` -> `/api/` (the API explorer is the replacement)

2. `docs/documentation/blueprints-examples/examples-overview.md` line 13:
   - `link: "/examples-sms-forwarder"` -> `link: "/docs/blueprints-examples/examples-sms-forwarder/"`

**Script approach:** Use `glob` to find all md files, `fs.readFileSync`/`writeFileSync` for I/O. Apply Category A regex replacements globally, then apply specific file fixes for Categories B-E. Print a summary of changes (files modified, replacements count). Run with `npx tsx scripts/fix-missing-docs-prefix.ts`.

After the script runs, commit the script AND the modified markdown files.
  </action>
  <verify>
    <automated>cd /Users/Jan.Sulaiman/_Projects/docusaurus_poc && npx tsx scripts/fix-missing-docs-prefix.ts && echo "Script ran successfully"</automated>
    Then verify no `/unresolved/doc:` patterns remain: `grep -r "unresolved/doc:" docs/` should return 0 results.
    Then verify count of bare section links dropped significantly: `grep -rcE '\]\(/(1nce-os|network-services|platform-services|1nce-portal|blueprints-examples)/' docs/documentation/` should return 0 results.
  </verify>
  <done>All broken links fixed at source in markdown files. Script is idempotent (safe to re-run). Zero instances of `/unresolved/doc:`, bare section paths, or malformed URLs remain in markdown source.</done>
</task>

<task type="auto">
  <name>Task 2: Add createRedirects safety net for legacy URL patterns</name>
  <files>docusaurus.config.ts</files>
  <action>
Add additional `createRedirects` rules in `docusaurus.config.ts` to catch any **external** links or bookmarks pointing to old paths missing `/docs/` prefix. This is a safety net — the markdown source fixes in Task 1 handle internal links, but external sites/bookmarks may still use old URLs.

In the existing `createRedirects` function (line 180), add a new block BEFORE the existing rules:

```typescript
// Safety net: /{section}/... -> /docs/{section}/... for any doc page
// Catches external links/bookmarks using old paths without /docs/ prefix
const docSections = ['1nce-os', 'network-services', 'platform-services', '1nce-portal', 'connectivity-services', 'sim-cards'];
for (const section of docSections) {
  if (existingPath.startsWith(`/docs/${section}/`) || existingPath === `/docs/${section}`) {
    redirects.push(existingPath.replace('/docs/', '/'));
  }
}
```

Note: `blueprints-examples` is already handled by the existing `blueprints` redirect rules (lines 188-196). Do NOT duplicate it.

Also add a static redirect for `/dev-hub/openapi`:
```typescript
{ from: '/dev-hub/openapi', to: '/api/' },
```
Add this to the `redirects` array alongside the other static redirects.

Do NOT modify the CloudFront function — Docusaurus client-redirects are the correct layer for URL-to-URL mapping. The CF function only handles SPA routing (appending index.html).
  </action>
  <verify>
    <automated>cd /Users/Jan.Sulaiman/_Projects/docusaurus_poc && npm run build 2>&1 | tail -20</automated>
    Build must succeed. Check redirect HTML files exist: `ls build/1nce-os/ | head -5` should show index.html (redirect page).
  </verify>
  <done>Build succeeds. Redirect HTML pages generated for legacy `/{section}/...` paths. External links and bookmarks using old URL patterns will redirect to correct `/docs/{section}/...` paths.</done>
</task>

<task type="auto">
  <name>Task 3: Verify all 110 broken links are resolved</name>
  <files>None (verification only)</files>
  <action>
Run a build and then use a link checker to verify the fixes. Steps:

1. Run `npm run build` to produce the static site.
2. Use `npx serve build -l 3456` in background, then run a targeted check against the 110 previously-broken URLs.
3. Create a quick verification script that curls the specific broken URL patterns from the report and confirms they return 200 or 301 (redirect).

Key URLs to verify (sample from each category):
- Category 1: `/docs/1nce-os/1nce-os-energy-saver/energy-saver-binary-conversion-language/` should not contain "unresolved"
- Category 2: `/1nce-os/1nce-os-admin-logs/index/` should redirect (301) to `/docs/1nce-os/1nce-os-admin-logs/`
- Category 3: Check that the source pages no longer have broken relative hrefs by grepping build output
- Category 4: `/docs/sim-cards/sim-euicc-knowledge/` should not contain malformed href
- Category 5: `/dev-hub/openapi` should redirect to `/api/`

If any links still broken, fix them before completing.
  </action>
  <verify>
    <automated>cd /Users/Jan.Sulaiman/_Projects/docusaurus_poc && npm run build 2>&1 | grep -c "broken" || echo "0 broken link warnings"</automated>
  </verify>
  <done>Build succeeds. All 110 previously-broken internal links now resolve correctly (either fixed at source or redirected). No regressions — no new broken links introduced.</done>
</task>

</tasks>

<verification>
- `npm run build` completes without errors
- `grep -r "unresolved/doc:" docs/` returns 0 matches
- `grep -rcE '\]\(/(1nce-os|network-services|platform-services|1nce-portal|blueprints-examples)/' docs/documentation/` returns 0 matches
- Sample broken URLs from the crawl report now return 200 or 301
</verification>

<success_criteria>
All 110 broken internal links from the crawl report are fixed:
- 5 unresolved doc: references replaced with correct paths
- 56 missing-/docs/-prefix links fixed in markdown source + redirect safety net added
- 7 hardcoded cross-page links corrected
- 3 malformed URLs cleaned up
- ~40 misc broken paths covered by source fixes + redirect rules
- Build succeeds, no new broken links
</success_criteria>

<output>
After completion, create `.planning/quick/260404-luu-fix-110-broken-internal-links-global-red/260404-luu-SUMMARY.md`
</output>
