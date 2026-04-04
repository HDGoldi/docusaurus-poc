---
phase: quick-260404-ncu
plan: 01
type: execute
wave: 1
depends_on: []
autonomous: true
requirements: [content-fidelity]

files_modified:
  # Task 1 — /index suffix removal (25 files)
  - docs/documentation/1nce-os/1nce-os-admin-logs/admin-logs-info-category.md
  - docs/documentation/1nce-os/1nce-os-cloud-integrator/cloud-integrator-aws-configuration.md
  - docs/documentation/1nce-os/1nce-os-cloud-integrator/cloud-integrator-failure-event.md
  - docs/documentation/1nce-os/1nce-os-cloud-integrator/cloud-integrator-webhook-configuration.md
  - docs/documentation/1nce-os/1nce-os-cloud-integrator/index.md
  - docs/documentation/1nce-os/1nce-os-device-authenticator/index.md
  - docs/documentation/1nce-os/1nce-os-device-inspector/device-inspector-features-limitations.md
  - docs/documentation/1nce-os/1nce-os-device-integrator/device-integrator-test-endpoints.md
  - docs/documentation/1nce-os/1nce-os-device-integrator/index.md
  - docs/documentation/1nce-os/1nce-os-device-locator/device-locator-features-limitations.md
  - docs/documentation/1nce-os/1nce-os-device-locator/device-locator-geofencing-guide.md
  - docs/documentation/1nce-os/1nce-os-device-locator/index.md
  - docs/documentation/1nce-os/1nce-os-energy-saver/energy-saver-device-locator-integration.md
  - docs/documentation/1nce-os/1nce-os-energy-saver/energy-saver-template-tester.md
  - docs/documentation/1nce-os/1nce-os-lwm2m/lwm2m-data-handling.md
  - docs/documentation/1nce-os/1nce-os-lwm2m/lwm2m-device-locator-integration.md
  - docs/documentation/1nce-os/1nce-os-lwm2m/lwm2m-features-limitations.md
  - docs/documentation/1nce-os/1nce-os-plugins/1nce-os-plugins-features-limitations.md
  - docs/documentation/1nce-os/1nce-os-services-overview/index.md
  - docs/documentation/1nce-portal/portal-configuration.md
  - docs/documentation/1nce-portal/portal-sims-sms.md
  - docs/documentation/connectivity-services/connectivity-services-data-services/data-services-data-monitoring.md
  - docs/documentation/connectivity-services/connectivity-services-data-services/data-services-features-limitations.md
  - docs/documentation/connectivity-services/connectivity-services-sms-services/sms-services-features-limitations.md
  - docs/documentation/connectivity-services/connectivity-services-sms-services/sms-services-mt-sms.md
  - docs/documentation/connectivity-services/connectivity-services-sms-services/sms-services-sms-monitoring.md
  # Task 2 — wrong paths + relative link (1 file)
  - docs/documentation/1nce-os/1nce-os-sdk-blueprints/sdk-blueprints-zephyr.md
  # Task 3 — broken anchors (various files)
  - docs/documentation/1nce-os/1nce-os-cloud-integrator/cloud-integrator-aws-configuration.md
  - docs/documentation/1nce-os/1nce-os-device-integrator/device-integrator-coap.md
  - docs/documentation/platform-services/platform-services-data-streamer/data-streamer-event-records.md
  - docs/documentation/platform-services/platform-services-data-streamer/data-streamer-usage-records.md
  - docs/documentation/connectivity-services/connectivity-services-data-services/data-services-data-volume.md
  - docs/documentation/connectivity-services/connectivity-services-sms-services/sms-services-mo-sms.md
  - docs/documentation/connectivity-services/connectivity-services-sms-services/sms-services-mt-sms.md
  - docs/documentation/network-services/network-services-internet-breakout.md
  - docs/documentation/1nce-portal/portal-sims-sms.md

must_haves:
  truths:
    - "npm run build produces zero broken link warnings"
    - "npm run build produces zero broken anchor warnings"
    - "All internal documentation cross-references resolve correctly"
  artifacts:
    - path: "docs/documentation/"
      provides: "All markdown source files with corrected links"
  key_links:
    - from: "docs/documentation/**/*.md"
      to: "/docs/{section}/{subsection}/"
      via: "Markdown links without /index suffix"
      pattern: "\\(/docs/.*\\)"
---

<objective>
Fix all remaining broken links and broken anchors in documentation source files.

The Docusaurus build reports 75 broken link/anchor references across 45 unique targets. These fall into four categories:

1. **`/index` suffix on category page links** (~50 instances across 25 files) — Docusaurus category pages (index.md) are served without `/index` in the URL. All links using `/docs/.../index` or `/docs/.../index#anchor` must drop the `/index` segment.

2. **Wrong plugin paths** (2 links in sdk-blueprints-zephyr.md) — Links to `/docs/1nce-os/1nce-os-plugins-fota-management-mender` and `/docs/1nce-os/1nce-os-plugins-device-observability-memfault` are missing the `/1nce-os-plugins/` parent segment.

3. **Relative link to non-existent local path** (1 link in sdk-blueprints-zephyr.md) — `./plugin_system/nce_debug_memfault_demo` resolves as a local Docusaurus page, but it is a GitHub repo directory. Must be changed to the full GitHub URL.

4. **Broken anchors** (~25 instances) — Links reference heading IDs (`#anchor`) that do not exist on the target page. Each must be investigated and either corrected to the actual heading ID or removed.

Purpose: Eliminate all build warnings so the site builds cleanly.
Output: Clean `npm run build` with zero broken link/anchor warnings.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@.planning/quick/260404-mdo-fix-75-remaining-broken-links-add-missin/260404-mdo-SUMMARY.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Remove /index suffix from all category page links and fix wrong plugin paths</name>
  <files>
    docs/documentation/1nce-os/1nce-os-admin-logs/admin-logs-info-category.md
    docs/documentation/1nce-os/1nce-os-cloud-integrator/cloud-integrator-aws-configuration.md
    docs/documentation/1nce-os/1nce-os-cloud-integrator/cloud-integrator-failure-event.md
    docs/documentation/1nce-os/1nce-os-cloud-integrator/cloud-integrator-webhook-configuration.md
    docs/documentation/1nce-os/1nce-os-cloud-integrator/index.md
    docs/documentation/1nce-os/1nce-os-device-authenticator/index.md
    docs/documentation/1nce-os/1nce-os-device-inspector/device-inspector-features-limitations.md
    docs/documentation/1nce-os/1nce-os-device-integrator/device-integrator-test-endpoints.md
    docs/documentation/1nce-os/1nce-os-device-integrator/index.md
    docs/documentation/1nce-os/1nce-os-device-locator/device-locator-features-limitations.md
    docs/documentation/1nce-os/1nce-os-device-locator/device-locator-geofencing-guide.md
    docs/documentation/1nce-os/1nce-os-device-locator/index.md
    docs/documentation/1nce-os/1nce-os-energy-saver/energy-saver-device-locator-integration.md
    docs/documentation/1nce-os/1nce-os-energy-saver/energy-saver-template-tester.md
    docs/documentation/1nce-os/1nce-os-lwm2m/lwm2m-data-handling.md
    docs/documentation/1nce-os/1nce-os-lwm2m/lwm2m-device-locator-integration.md
    docs/documentation/1nce-os/1nce-os-lwm2m/lwm2m-features-limitations.md
    docs/documentation/1nce-os/1nce-os-plugins/1nce-os-plugins-features-limitations.md
    docs/documentation/1nce-os/1nce-os-services-overview/index.md
    docs/documentation/1nce-portal/portal-configuration.md
    docs/documentation/1nce-portal/portal-sims-sms.md
    docs/documentation/connectivity-services/connectivity-services-data-services/data-services-data-monitoring.md
    docs/documentation/connectivity-services/connectivity-services-data-services/data-services-features-limitations.md
    docs/documentation/connectivity-services/connectivity-services-sms-services/sms-services-features-limitations.md
    docs/documentation/connectivity-services/connectivity-services-sms-services/sms-services-mt-sms.md
    docs/documentation/connectivity-services/connectivity-services-sms-services/sms-services-sms-monitoring.md
    docs/documentation/1nce-os/1nce-os-sdk-blueprints/sdk-blueprints-zephyr.md
  </files>
  <action>
    Fix all broken link paths in markdown source files. Three sub-patterns:

    **A. Remove `/index` suffix from category page links (~50 instances across 26 files):**

    In every file listed above (except sdk-blueprints-zephyr.md), find all markdown links matching the pattern `(/docs/.../index)` or `(/docs/.../index#anchor)` and remove the `/index` segment. Examples:

    - `(/docs/1nce-os/1nce-os-energy-saver/index)` becomes `(/docs/1nce-os/1nce-os-energy-saver/)`
    - `(/docs/1nce-os/1nce-os-cloud-integrator/index#event-types)` becomes `(/docs/1nce-os/1nce-os-cloud-integrator/#event-types)`
    - `(/docs/1nce-os/1nce-os-device-locator/index#geofence-credits)` becomes `(/docs/1nce-os/1nce-os-device-locator/#geofence-credits)`
    - `(/docs/platform-services/platform-services-data-streamer/index)` becomes `(/docs/platform-services/platform-services-data-streamer/)`
    - `(/docs/platform-services/platform-services-sms-forwarder/index)` becomes `(/docs/platform-services/platform-services-sms-forwarder/)`
    - `(/docs/network-services/network-services-vpn-service/index)` becomes `(/docs/network-services/network-services-vpn-service/)`

    Use a sed command to do this in bulk: for each file, replace `/index)` with `/)` and `/index#` with `/#`.

    **B. Fix wrong plugin paths in sdk-blueprints-zephyr.md (line 677 and 876):**

    - Line 677: Change `(/docs/1nce-os/1nce-os-plugins-fota-management-mender)` to `(/docs/1nce-os/1nce-os-plugins/1nce-os-plugins-fota-management-mender/)`
    - Line 876: Change `(/docs/1nce-os/1nce-os-plugins-device-observability-memfault)` to `(/docs/1nce-os/1nce-os-plugins/1nce-os-plugins-device-observability-memfault/)`

    **C. Fix relative link to GitHub repo in sdk-blueprints-zephyr.md (line 148):**

    - Change `(./plugin_system/nce_debug_memfault_demo)` to `(https://github.com/1NCE-GmbH/blueprint-zephyr/tree/main/plugin_system/nce_debug_memfault_demo)`

    This matches the same GitHub URL pattern already used on lines 142 and 145 of the same file.
  </action>
  <verify>
    <automated>npm run build 2>&1 | grep "Docusaurus found broken links" | wc -l</automated>
    Expected output: 0 (no broken links warning). If any broken links remain, investigate and fix.
  </verify>
  <done>Zero broken link warnings from `npm run build`. All `/index` suffixes removed, plugin paths corrected, relative GitHub link fixed.</done>
</task>

<task type="auto">
  <name>Task 2: Fix broken anchor references across documentation files</name>
  <files>
    docs/documentation/1nce-os/1nce-os-cloud-integrator/index.md
    docs/documentation/1nce-os/1nce-os-cloud-integrator/cloud-integrator-aws-configuration.md
    docs/documentation/1nce-os/1nce-os-device-integrator/device-integrator-coap.md
    docs/documentation/1nce-portal/portal-sims-sms.md
    docs/documentation/1nce-portal/portal-configuration.md
    docs/documentation/connectivity-services/connectivity-services-data-services/data-services-data-volume.md
    docs/documentation/connectivity-services/connectivity-services-sms-services/sms-services-mo-sms.md
    docs/documentation/connectivity-services/connectivity-services-sms-services/sms-services-mt-sms.md
    docs/documentation/network-services/network-services-internet-breakout.md
    docs/documentation/platform-services/platform-services-data-streamer/data-streamer-event-records.md
    docs/documentation/platform-services/platform-services-data-streamer/data-streamer-usage-records.md
    docs/documentation/blueprints-examples/examples-sms/examples-mo-sms.md
    docs/documentation/blueprints-examples/examples-sms/examples-mt-sms.md
    docs/documentation/1nce-os/1nce-os-admin-logs/admin-logs-info-category.md
  </files>
  <action>
    Fix all broken anchor references reported by the Docusaurus build. For each broken anchor, open the TARGET page to find the actual heading ID, then update the SOURCE page link.

    The broken anchors from the build output are:

    1. **admin-logs-info-category.md -> #lifecycle**: Check if `admin-logs-info-category.md` has a "Lifecycle" heading. If the heading exists with a different slug, update the link. If no matching heading exists, link to the page without the anchor.

    2. **cloud-integrator-aws-configuration.md -> #cfn-stack-description**: Self-referencing anchor. Check if heading "CFN Stack Description" exists on that page. Fix slug or remove anchor.

    3. **device-integrator-coap.md -> #2**: Bare `#2` anchor — likely a leftover from ReadMe numbered heading. Find the intended heading on the same page and replace with correct slug, or remove the anchor.

    4. **portal-sims-sms.md -> portal-configuration/#auto-top-up and #global-imei-lock**: Check portal-configuration.md for the actual heading IDs for "Auto Top-Up" and "Global IMEI Lock" sections. Update anchors to match actual heading slugs.

    5. **data-services-data-volume.md -> #example-scenarios**: Self-referencing anchor. Check if "Example Scenarios" heading exists on that page. Fix slug or remove anchor.

    6. **sms-services-mo-sms.md -> examples-mo-sms/#1nce-portal--sms-console and #1nce-sms-api**: Check examples-mo-sms.md for actual heading IDs. The double-dash `--` in `#1nce-portal--sms-console` suggests the heading has special characters. Find actual slug.

    7. **sms-services-mt-sms.md -> examples-mt-sms/#1nce-portal--sms-console and #1nce-sms-api**: Same pattern as above for MT-SMS page.

    8. **network-services-internet-breakout.md -> portal-configuration/#openvpn-configuration**: Check portal-configuration.md for actual heading ID for "OpenVPN Configuration" section. Update anchor.

    9. **data-streamer-event-records.md -> #generic-properties, #additional-properties, #detail-properties, #pdp-context-properties**: Self-referencing anchors. Check actual heading IDs on the page. These may be heading-less sections (e.g., bold text or table headers that don't generate anchors).

    10. **data-streamer-usage-records.md -> #currency-object, #volume-object, #organization-object, #operator-object, #sim-object, #tariff-object, #traffic-type-object, #endpoint-object, #country-object, #ratezone-object**: Self-referencing anchors. Same pattern — check if these exist as actual headings.

    For each broken anchor:
    - Open the TARGET page and search for the heading text
    - If the heading exists with a different slug (e.g., `auto-top-up` vs `auto-topup`), update the link to use the correct slug
    - If the heading does not exist at all (content was lost in migration), either add the heading ID as an HTML anchor (`<a id="anchor-name"></a>`) before the relevant content, or remove the anchor from the link
    - If it is a self-referencing page anchor and the content is a bold paragraph or table header (not an actual heading), add an HTML `id` attribute to create the anchor target
  </action>
  <verify>
    <automated>npm run build 2>&1 | grep "Docusaurus found broken anchors" | wc -l</automated>
    Expected output: 0 (no broken anchors warning).
  </verify>
  <done>Zero broken anchor warnings from `npm run build`. All anchor references either corrected to actual heading IDs or supplemented with explicit anchor targets.</done>
</task>

</tasks>

<verification>
Run full build and confirm zero warnings:
```bash
npm run build 2>&1 | grep -E "broken (links|anchors)"
```
Expected: No output (no broken links or anchors warnings).

Also verify the duplicate redirect warning is the only remaining warning:
```bash
npm run build 2>&1 | grep "\[WARNING\]"
```
Expected: Only the pre-existing SSG warnings and the duplicate redirect warning for `/dev-hub/reference/api-authorization`.
</verification>

<success_criteria>
- `npm run build` completes with zero "broken links" warnings
- `npm run build` completes with zero "broken anchors" warnings
- All internal documentation cross-references resolve to valid pages
- No content changes — only link paths and anchor references are modified
</success_criteria>

<output>
After completion, create `.planning/quick/260404-ncu-fix-18-remaining-broken-links-in-documen/260404-ncu-SUMMARY.md`
</output>
