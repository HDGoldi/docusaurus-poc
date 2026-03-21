---
status: diagnosed
trigger: "CORS error when using Try It panel - requests to api.1nce.com blocked"
created: 2026-03-21T00:00:00Z
updated: 2026-03-21T00:00:00Z
---

## Current Focus

hypothesis: CONFIRMED - Browser CORS blocks cross-origin fetch from localhost/help.1nce.com to api.1nce.com. Plugin has built-in proxy support via `proxy` config option.
test: Verified plugin source code for proxy plumbing
expecting: N/A - investigation complete
next_action: Report findings

## Symptoms

expected: Try It panel sends API requests and receives responses
actual: Requests to https://api.1nce.com/management-api/oauth/token blocked by CORS (no Access-Control-Allow-Origin header)
errors: CORS policy error - no Access-Control-Allow-Origin header
reproduction: Use Try It panel on localhost:3000 to call any API endpoint
started: Always (inherent browser security limitation)

## Eliminated

## Evidence

- timestamp: 2026-03-21T00:01:00Z
  checked: docusaurus.config.ts
  found: No proxy config exists in current OpenAPI plugin config or themeConfig
  implication: Try It panel sends requests directly to api.1nce.com, which triggers CORS

- timestamp: 2026-03-21T00:02:00Z
  checked: docusaurus-plugin-openapi-docs/src/types.d.ts (APIOptions interface)
  found: `proxy?: string` option exists on line 51 in APIOptions
  implication: Plugin has built-in per-spec proxy support at config level

- timestamp: 2026-03-21T00:03:00Z
  checked: docusaurus-plugin-openapi-docs/src/options.ts (Joi schema)
  found: `proxy: Joi.string()` validated on line 39
  implication: Proxy is a validated, documented plugin config option

- timestamp: 2026-03-21T00:04:00Z
  checked: docusaurus-plugin-openapi-docs/src/openapi/openapi.ts
  found: `...(options?.proxy && { proxy: options.proxy })` writes proxy into generated MDX frontmatter
  implication: Proxy value flows from plugin config -> MDX frontmatter -> theme component

- timestamp: 2026-03-21T00:05:00Z
  checked: docusaurus-theme-openapi-docs/lib/theme/ApiExplorer/Request/index.js (lines 101-107)
  found: Two proxy sources with priority: `frontMatterProxy ?? themeConfig.api?.proxy`
  implication: Proxy can be set per-spec (via plugin config -> frontmatter) OR site-wide (via themeConfig.api.proxy)

- timestamp: 2026-03-21T00:06:00Z
  checked: docusaurus-theme-openapi-docs/lib/theme/ApiExplorer/Request/makeRequest.js (lines 226-229)
  found: When proxy is set, request URL becomes `{proxy}/{originalUrl}` - a simple URL prefix prepend
  implication: Plugin expects an external CORS proxy service, not a built-in dev server proxy

- timestamp: 2026-03-21T00:07:00Z
  checked: @docusaurus/core/lib (all files)
  found: No 'proxy' references anywhere in Docusaurus core
  implication: Docusaurus dev server does NOT have built-in proxy support (unlike Create React App)

- timestamp: 2026-03-21T00:08:00Z
  checked: OpenAPI specs (authorization.json)
  found: Server URL is `https://api.1nce.com/management-api`
  implication: All API requests go to api.1nce.com; CORS depends on whether that API returns Access-Control-Allow-Origin headers

## Resolution

root_cause: The 1NCE API at api.1nce.com does not return Access-Control-Allow-Origin headers permitting browser requests from localhost:3000 (or likely from help.1nce.com either). The docusaurus-openapi-docs plugin has built-in proxy support but it is not configured.
fix: N/A (investigation only)
verification: N/A
files_changed: []
