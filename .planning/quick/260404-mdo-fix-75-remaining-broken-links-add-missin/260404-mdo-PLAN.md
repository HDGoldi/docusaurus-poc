---
phase: quick-260404-mdo
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - docusaurus.config.ts
  - docs/documentation/blueprints-examples/examples-overview.md
  - docs/documentation/network-services/network-services-vpn-service/vpn-service-openvpn-files.md
  - docs/documentation/1nce-os/1nce-os-device-integrator/device-integrator-udp.md
  - docs/documentation/1nce-portal/portal-sims-sms.md
  - docs/documentation/blueprints-examples/examples-data-streamer/examples-data-streamer-http.md
  - docs/documentation/platform-services/platform-services-sms-forwarder/sms-forwarder-error-states.md
  - docs/documentation/connectivity-services/connectivity-services-sms-services/sms-services-features-limitations.md
autonomous: true
requirements: []
must_haves:
  truths:
    - "All 41 old URL paths in Group A redirect to correct current pages"
    - "All 34 broken links in Group B source markdown files resolve correctly"
    - "Site builds without broken link warnings for these 75 URLs"
  artifacts:
    - path: "docusaurus.config.ts"
      provides: "Redirect rules for all 41 Group A URLs"
      contains: "createRedirects"
  key_links:
    - from: "old /1nce-os/.../index/ paths"
      to: "/docs/1nce-os/.../"
      via: "createRedirects in docusaurus.config.ts"
    - from: "old /blueprints-examples/<slug>/ leaf paths"
      to: "/docs/blueprints-examples/<parent-page>/"
      via: "createRedirects in docusaurus.config.ts"
---

<objective>
Fix 75 remaining broken links across the 1NCE Developer Hub: 41 missing redirects (Group A) and ~10 source content fixes (Group B). Many Group B items were already fixed in the previous quick task (260404-luu); this plan addresses the remaining ones.

Purpose: Eliminate all broken link warnings so external bookmarks, search engine indexes, and cross-page references all resolve correctly.
Output: Updated docusaurus.config.ts with redirect rules + fixed markdown source files.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@docusaurus.config.ts
@docs/documentation/blueprints-examples/examples-overview.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add 41 missing redirect rules in docusaurus.config.ts</name>
  <files>docusaurus.config.ts</files>
  <action>
Add redirect rules to the `@docusaurus/plugin-client-redirects` config in docusaurus.config.ts. There are two places to add rules:

**A. Static `redirects` array -- add these explicit entries:**

```ts
// Old /blueprints-examples/ leaf pages -> parent module pages
{ from: '/blueprints-examples/bg95-m3-1nce-os-udp', to: '/docs/blueprints-examples/quectel-bg95-m3/' },
{ from: '/blueprints-examples/bg95-m3-icmp-ping', to: '/docs/blueprints-examples/quectel-bg95-m3/' },
{ from: '/blueprints-examples/bg95-m3-network-registration', to: '/docs/blueprints-examples/quectel-bg95-m3/' },
{ from: '/blueprints-examples/bg95bg77-tcp-client-connection', to: '/docs/blueprints-examples/quectel-bg95-m3/' },
{ from: '/blueprints-examples/ec25-ec21-1nce-os-udp', to: '/docs/blueprints-examples/quectel-ec25-ec21/' },
{ from: '/blueprints-examples/ec25-icmp-ping', to: '/docs/blueprints-examples/quectel-ec25-ec21/' },
{ from: '/blueprints-examples/ec25-mo-sms', to: '/docs/blueprints-examples/quectel-ec25-ec21/' },
{ from: '/blueprints-examples/ec25-mt-sms', to: '/docs/blueprints-examples/quectel-ec25-ec21/' },
{ from: '/blueprints-examples/ec25-network-registration', to: '/docs/blueprints-examples/quectel-ec25-ec21/' },
{ from: '/blueprints-examples/ec25-rat-configuration', to: '/docs/blueprints-examples/quectel-ec25-ec21/' },
{ from: '/blueprints-examples/ec25-tcp-client-connection', to: '/docs/blueprints-examples/quectel-ec25-ec21/' },
{ from: '/blueprints-examples/sara-r4-get-http', to: '/docs/blueprints-examples/sara-r410m/' },
{ from: '/blueprints-examples/sara-r410m-1nce-os-udp', to: '/docs/blueprints-examples/sara-r410m/' },
{ from: '/blueprints-examples/sara-r410m-network-registration', to: '/docs/blueprints-examples/sara-r410m/' },
{ from: '/blueprints-examples/sim7000g-1nce-os-coap', to: '/docs/blueprints-examples/simcom-7020g-simcom800l/' },
{ from: '/blueprints-examples/sim7000g-icmp-ping', to: '/docs/blueprints-examples/sim7000g/' },
{ from: '/blueprints-examples/sim7000g-mo-sms', to: '/docs/blueprints-examples/sim7000g/' },
{ from: '/blueprints-examples/sim7000g-mt-sms', to: '/docs/blueprints-examples/sim7000g/' },
{ from: '/blueprints-examples/sim7000g-network-registration', to: '/docs/blueprints-examples/sim7000g/' },
{ from: '/blueprints-examples/sim7000g-rat-configuration', to: '/docs/blueprints-examples/sim7000g/' },
{ from: '/blueprints-examples/sim7000g-tcp-client-connection', to: '/docs/blueprints-examples/sim7000g/' },
{ from: '/blueprints-examples/sim7000g-udp-client-connection', to: '/docs/blueprints-examples/sim7000g/' },
{ from: '/blueprints-examples/sim7020e-1nce-os-coap-1', to: '/docs/blueprints-examples/sim7000g/' },
{ from: '/blueprints-examples/sim800l-http-get', to: '/docs/blueprints-examples/simcom-7020g-simcom800l/' },
{ from: '/blueprints-examples/sim800l-http-post', to: '/docs/blueprints-examples/simcom-7020g-simcom800l/' },
{ from: '/blueprints-examples/sim800l-icmp-ping', to: '/docs/blueprints-examples/simcom-7020g-simcom800l/' },
{ from: '/blueprints-examples/sim800l-mo-sms', to: '/docs/blueprints-examples/simcom-7020g-simcom800l/' },
{ from: '/blueprints-examples/sim800l-mt-sms', to: '/docs/blueprints-examples/simcom-7020g-simcom800l/' },
{ from: '/blueprints-examples/sim800l-network-registration', to: '/docs/blueprints-examples/simcom-7020g-simcom800l/' },
{ from: '/blueprints-examples/sim800l-tcp-client-connection', to: '/docs/blueprints-examples/simcom-7020g-simcom800l/' },
{ from: '/blueprints-examples/sim800l-udp-client-connection', to: '/docs/blueprints-examples/simcom-7020g-simcom800l/' },
{ from: '/blueprints-examples/1nce-vpn-linux-client', to: '/docs/blueprints-examples/recipes/' },
{ from: '/blueprints-examples/wvdial-tutorial', to: '/docs/blueprints-examples/recipes/' },
// Wrong /docs/1nce-os/ plugin paths (missing /1nce-os-plugins/ segment)
{ from: '/docs/1nce-os/1nce-os-plugins-device-observability-memfault', to: '/docs/1nce-os/1nce-os-plugins/1nce-os-plugins-device-observability-memfault/' },
{ from: '/docs/1nce-os/1nce-os-plugins-fota-management-mender', to: '/docs/1nce-os/1nce-os-plugins/1nce-os-plugins-fota-management-mender/' },
// Deep SDK blueprints path
{ from: '/docs/1nce-os/1nce-os-sdk-blueprints/sdk-blueprints-zephyr/plugin_system/nce_debug_memfault_demo', to: '/docs/1nce-os/1nce-os-sdk-blueprints/sdk-blueprints-zephyr/' },
// Old /blueprints-examples/examples-sms/ sub-paths
{ from: '/blueprints-examples/examples-sms/examples-mo-sms', to: '/docs/blueprints-examples/examples-sms/examples-mo-sms/' },
{ from: '/blueprints-examples/examples-sms/examples-mt-sms', to: '/docs/blueprints-examples/examples-sms/examples-mt-sms/' },
// Old /blueprints-examples/examples-sms-forwarder/index/
{ from: '/blueprints-examples/examples-sms-forwarder/index', to: '/docs/blueprints-examples/examples-sms-forwarder/' },
// Root shortcut paths
{ from: '/examples-data-streamer', to: '/docs/blueprints-examples/examples-data-streamer/' },
{ from: '/examples-sms', to: '/docs/blueprints-examples/examples-sms/' },
{ from: '/examples-sms-forwarder', to: '/docs/blueprints-examples/examples-sms-forwarder/' },
{ from: '/examples-vpn', to: '/docs/blueprints-examples/examples-vpn/' },
{ from: '/recipes', to: '/docs/blueprints-examples/recipes/' },
```

**B. `createRedirects` function -- add /index/ suffix handling:**

Inside the `createRedirects(existingPath)` function, add a new block that generates `/section/.../index/` redirects. For any doc page under the main doc sections, also register a redirect from the path with `/index/` appended (stripping the trailing slash and adding `/index/`). This covers the 13 old `/1nce-os/.../index/`, `/network-services/.../index/`, `/platform-services/.../index/` URLs:

```ts
// Old ReadMe /index/ suffix: /{section}/.../index/ -> /docs/{section}/.../
const indexSections = ['1nce-os', 'network-services', 'platform-services', 'blueprints-examples'];
for (const section of indexSections) {
  if (existingPath.startsWith(`/docs/${section}/`)) {
    // /1nce-os/foo/index/ -> /docs/1nce-os/foo/
    const withoutDocs = existingPath.replace('/docs/', '/');
    const withoutTrailing = withoutDocs.replace(/\/$/, '');
    redirects.push(`${withoutTrailing}/index/`);
    redirects.push(`${withoutTrailing}/index`);
  }
}
```

This goes inside the createRedirects function, BEFORE the `return` statement. This single block covers all 13 `/index/` suffix redirects from the report.

IMPORTANT: Keep all existing redirect rules intact. Only add new entries.
  </action>
  <verify>
    <automated>cd /Users/Jan.Sulaiman/_Projects/docusaurus_poc && npx tsc --noEmit docusaurus.config.ts 2>&1 | head -20; npm run build 2>&1 | tail -30</automated>
  </verify>
  <done>All 41 Group A redirect rules are present in docusaurus.config.ts. TypeScript compiles. Build succeeds.</done>
</task>

<task type="auto">
  <name>Task 2: Fix remaining broken links in markdown source files</name>
  <files>
    docs/documentation/network-services/network-services-vpn-service/vpn-service-openvpn-files.md
    docs/documentation/1nce-os/1nce-os-device-integrator/device-integrator-udp.md
    docs/documentation/1nce-portal/portal-sims-sms.md
    docs/documentation/blueprints-examples/examples-overview.md
    docs/documentation/blueprints-examples/examples-data-streamer/examples-data-streamer-http.md
    docs/documentation/connectivity-services/connectivity-services-sms-services/sms-services-features-limitations.md
  </files>
  <action>
Fix the remaining broken source links. Each fix is small and surgical:

**1. vpn-service-openvpn-files.md (line 10):**
Change `<a href="examples-vpn">VPN Setup Guide</a>` to `<a href="/docs/blueprints-examples/examples-vpn/">VPN Setup Guide</a>` (relative link resolves wrong -- needs absolute path).

**2. device-integrator-udp.md (line 18):**
Change `[historian web interface](device-inspector-historian-web-interface)` to `[historian web interface](/docs/1nce-os/1nce-os-device-inspector/device-inspector-historian-web-interface/)` (relative link resolves within device-integrator dir but page is in device-inspector dir).

**3. portal-sims-sms.md (lines 44-45):**
Change both `href="/docs/sim-cards-knowledge` references to `href="/docs/sim-cards/sim-cards-knowledge/` (missing `/sim-cards/` directory segment). Two occurrences:
- Line 44: IMEI Reference link
- Line 45: IMEI Lock Reference link

**4. examples-overview.md:**
Fix root shortcut links that are missing `/docs/blueprints-examples/` prefix:
- Line 11: `link: "/recipes"` -> `link: "/docs/blueprints-examples/recipes/"`
- Line 12: `link: "/examples-sms"` -> `link: "/docs/blueprints-examples/examples-sms/"`
- Line 14: `link: "/examples-data-streamer"` -> `link: "/docs/blueprints-examples/examples-data-streamer/"`
- Line 15: `link: "/examples-vpn"` -> `link: "/docs/blueprints-examples/examples-vpn/"`

**5. examples-data-streamer-http.md (lines 40-41):**
The lines with `"server-ip"` and `"server-domain"` in quotes are NOT actual links -- they are descriptive text using literal double-quotes instead of angle brackets. These are false positives from the link checker interpreting quoted URL patterns as links. Verify these are just inline text and leave them as-is if they are not actual anchor/markdown links. If they ARE rendered as clickable links by MDX, wrap them in backticks to make them code: Change `https://"server-ip":"port"/"endpoint"/` to `` `https://<server-ip>:<port>/<endpoint>/` `` (matching the style on line 18 which already uses angle brackets correctly).

**6. sms-services-features-limitations.md (line 14):**
The `portal-sims-sms` link on line 14 uses full path `/docs/1nce-portal/portal-sims-sms/` which is correct -- no fix needed. Verify and skip.

NOTE: The 5 `doc:` references listed in Group B were already fixed in the previous quick task (260404-luu). Verify they are gone (grep for `doc:` in source) and skip.
  </action>
  <verify>
    <automated>cd /Users/Jan.Sulaiman/_Projects/docusaurus_poc && grep -rn 'href="examples-vpn"' docs/ && echo "FAIL: relative vpn link" || echo "OK: vpn link fixed"; grep -rn 'device-inspector-historian-web-interface)' docs/documentation/1nce-os/1nce-os-device-integrator/ && echo "FAIL: relative historian link" || echo "OK: historian link fixed"; grep -rn 'sim-cards-knowledge#' docs/documentation/1nce-portal/portal-sims-sms.md | grep -v '/sim-cards/' && echo "FAIL: wrong sim-cards path" || echo "OK: sim-cards path fixed"</automated>
  </verify>
  <done>All broken markdown source links are fixed: vpn-service-openvpn-files uses absolute path, device-integrator-udp points to correct device-inspector dir, portal-sims-sms has correct /sim-cards/ segment, examples-overview uses full doc paths.</done>
</task>

</tasks>

<verification>
1. `npm run build` completes without broken link warnings for any of the 75 URLs
2. Grep for known broken patterns returns no matches
3. All redirect rules compile without TypeScript errors
</verification>

<success_criteria>
- All 41 Group A redirect rules present and functional in docusaurus.config.ts
- All Group B source link fixes applied to markdown files
- Site builds cleanly
</success_criteria>

<output>
After completion, create `.planning/quick/260404-mdo-fix-75-remaining-broken-links-add-missin/260404-mdo-SUMMARY.md`
</output>
