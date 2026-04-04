# Phase 10: Crawler Foundation - Research

**Researched:** 2026-04-03
**Domain:** robots.txt, CloudFront Function routing, search/AI crawler configuration
**Confidence:** HIGH

## Summary

Phase 10 is a small, well-scoped infrastructure phase with three deliverables: (1) create a `static/robots.txt` file with sitemap reference and AI crawler allow-directives, (2) modify the CloudFront Function in `infra/cf-function.js` to skip SPA rewrites for `.well-known/` paths, and (3) ensure static file extensions (.txt, .md, .json) pass through the CF function correctly (they already do).

The Docusaurus sitemap plugin (`@docusaurus/plugin-sitemap`) is already installed via `preset-classic` and generates `sitemap.xml` automatically at build time. No additional sitemap configuration is needed. The `static/` directory is the correct placement for `robots.txt` -- Docusaurus copies its contents to the build root.

**Primary recommendation:** This is a two-file change (create `static/robots.txt`, modify `infra/cf-function.js`) plus updating the inline CF function code in `infra/template.yaml`. All decisions are locked by CONTEXT.md -- execute directly.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Allow all general web crawlers (`User-agent: * / Allow: /`) -- public docs site, maximum discoverability
- **D-02:** Include `Sitemap: https://help.1nce.com/sitemap.xml` directive -- standard practice, Docusaurus sitemap plugin already generates sitemap.xml
- **D-03:** Disallow `/search` and `/tags` paths -- low-value listing pages that dilute SEO
- **D-04:** Use named allow-list approach -- explicit `User-agent` + `Allow` blocks for each known AI crawler, not blanket allow-all
- **D-05:** Include core four + extras: GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot (Common Crawl), Bytespider (ByteDance)
- **D-06:** Add `.well-known/` path allowlist to `infra/cf-function.js` -- if URI starts with `/.well-known/`, skip the index.html rewrite entirely
- **D-07:** Code change only -- no deployment instructions needed; deployment happens through existing infra workflow
- **D-08:** robots.txt lives at `static/robots.txt` -- Docusaurus copies static/ contents to build root automatically
- **D-09:** Content-type fix for .md/.txt files deferred to Phase 12 -- that's where .md serving (skill.md) is testable end-to-end

### Claude's Discretion
No areas deferred to Claude's discretion -- all decisions captured above.

### Deferred Ideas (OUT OF SCOPE)
- Content-type header fix for .md/.txt files in S3 deploy pipeline -- deferred to Phase 12
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CRAWL-01 | Site serves robots.txt at root with Sitemap reference to sitemap.xml | Create `static/robots.txt` with Sitemap directive per D-01/D-02/D-03. Docusaurus copies `static/` to build root. Sitemap plugin already generates sitemap.xml. |
| CRAWL-02 | robots.txt explicitly allows AI crawler user agents (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc.) | Add per-agent `User-agent` + `Allow` blocks per D-04/D-05. Six agents: GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, Bytespider. |
| CRAWL-03 | CloudFront Function passes through requests for .txt, .md, .json files and .well-known/* paths without SPA rewrite | Modify `infra/cf-function.js` to skip rewrite when URI starts with `/.well-known/`. Static file extensions (.txt, .md, .json) already pass through because the current function only rewrites URIs without a `.` character. Must also update inline code in `infra/template.yaml`. |
</phase_requirements>

## Architecture Patterns

### Current CloudFront Function Logic (infra/cf-function.js)

```javascript
// Current behavior:
// 1. URI ends with '/' -> append 'index.html'        (e.g., /docs/ -> /docs/index.html)
// 2. URI has no '.'    -> append '/index.html'        (e.g., /docs  -> /docs/index.html)
// 3. URI has '.'       -> pass through unchanged      (e.g., /robots.txt -> /robots.txt)
```

**Critical insight:** Files with extensions (.txt, .md, .json) already pass through unchanged because the `else if (!uri.includes('.'))` check skips them. The only fix needed is for `.well-known/` directory paths (which end in `/` and would get `index.html` appended).

### Required CF Function Modification

```javascript
// Add at the top of handler, before any rewrite logic:
// If URI starts with /.well-known/, pass through without rewrite
if (uri.startsWith('/.well-known/')) {
    return request;
}
```

This early return ensures `.well-known/` paths are never rewritten. This is important for:
- `/.well-known/skills/` (Phase 12: AGENT-03 index.json)
- `/.well-known/skills/default/skill.md` (Phase 12: AGENT-02)
- Any future `.well-known/` resources

### Dual Update Requirement

The CloudFront Function code exists in TWO places that must stay in sync:
1. **`infra/cf-function.js`** -- standalone file (used for local reference/testing)
2. **`infra/template.yaml`** lines 94-104 -- inline `FunctionCode` in CloudFormation

Both must be updated with identical logic. The CloudFormation template is what actually gets deployed.

### robots.txt Structure

```
# robots.txt for help.1nce.com
User-agent: *
Allow: /
Disallow: /search
Disallow: /tags

# AI Crawlers - explicitly allowed
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: CCBot
Allow: /

User-agent: Bytespider
Allow: /

Sitemap: https://help.1nce.com/sitemap.xml
```

**Key points:**
- `Sitemap` directive goes at the bottom (convention, not requirement)
- Each AI crawler gets its own `User-agent` + `Allow` block (per D-04 named allow-list approach)
- `Disallow: /search` and `Disallow: /tags` apply to the wildcard `*` agent only
- The AI crawler-specific blocks with `Allow: /` override any inherited disallows for those agents

### Docusaurus Static File Handling

Files in `static/` are copied verbatim to the build output root:
- `static/robots.txt` -> `build/robots.txt` -> served at `help.1nce.com/robots.txt`
- `static/img/` -> `build/img/` (already exists, confirms the pattern)
- `static/.nojekyll` -> `build/.nojekyll` (already exists, confirms the pattern)

No Docusaurus config changes needed. The `@docusaurus/plugin-sitemap` (bundled in preset-classic) automatically generates `sitemap.xml` in the build output.

### Anti-Patterns to Avoid
- **Editing only cf-function.js but not template.yaml:** The CloudFormation inline code is what gets deployed. Both files must match.
- **Using Crawl-delay directive:** Non-standard, not universally supported, and unnecessary for a static site behind CDN.
- **Adding robots.txt via Docusaurus plugin:** Unnecessary complexity. `static/robots.txt` is the standard Docusaurus approach.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Sitemap generation | Custom sitemap script | `@docusaurus/plugin-sitemap` (already installed) | Already generates sitemap.xml automatically in build output |
| robots.txt templating | Build-time generator | Static file in `static/robots.txt` | Content is static, no dynamic values needed except the hardcoded domain |

## Common Pitfalls

### Pitfall 1: Forgetting template.yaml Update
**What goes wrong:** CF function file is updated but CloudFormation template still has old inline code. Deployment uses template.yaml, so the fix never reaches production.
**Why it happens:** The function code exists in two places.
**How to avoid:** Always update both `infra/cf-function.js` AND the `FunctionCode` block in `infra/template.yaml`.
**Warning signs:** Local testing passes but deployed site still rewrites .well-known paths.

### Pitfall 2: robots.txt Disallow Inheritance
**What goes wrong:** AI crawler blocks inherit Disallow from the wildcard block, blocking `/search` and `/tags` for AI crawlers too.
**Why it happens:** In robots.txt, each User-agent block is independent. A specific agent block does NOT inherit from `*`.
**How to avoid:** Each AI crawler block only needs `Allow: /`. The `Disallow: /search` in the `*` block does not affect named agents that have their own block. This is correct behavior per the robots.txt specification.
**Warning signs:** None -- this is actually how it's supposed to work. Named agent blocks are self-contained.

### Pitfall 3: trailingSlash Interaction with .well-known
**What goes wrong:** Docusaurus with `trailingSlash: true` might try to add trailing slashes to `.well-known` paths in internal links.
**Why it happens:** Docusaurus config has `trailingSlash: true`.
**How to avoid:** Not an issue for Phase 10 since robots.txt and the CF function don't go through Docusaurus routing. Will matter in Phase 12 when linking to `.well-known` paths from within the site (if needed). The CF function fix handles the server-side routing correctly regardless.

## Code Examples

### CloudFront Function - Updated Version

```javascript
// CloudFront Function: SPA routing for Docusaurus
// Runtime: cloudfront-js-2.0
// Attached as viewer-request to both prod and preview distributions
//
// Handles Docusaurus trailing-slash behavior (trailingSlash: true)
// which generates /page/index.html structure. This function rewrites URIs so
// CloudFront can serve the correct S3 object.
//
// Exceptions:
// - /.well-known/* paths are passed through without rewrite
async function handler(event) {
    var request = event.request;
    var uri = request.uri;

    // .well-known paths: pass through without rewrite
    if (uri.startsWith('/.well-known/')) {
        return request;
    }

    // URI ends with slash: append index.html
    if (uri.endsWith('/')) {
        request.uri += 'index.html';
    }
    // URI has no file extension: append /index.html
    else if (!uri.includes('.')) {
        request.uri += '/index.html';
    }

    return request;
}
```

### CloudFormation Inline Version (template.yaml)

The `FunctionCode` property must contain the exact same logic, indented appropriately for YAML.

## Verification Approach

After implementation, these conditions must be verifiable:

1. **robots.txt exists in build output:** `npm run build && cat build/robots.txt`
2. **sitemap.xml exists in build output:** `ls build/sitemap.xml`
3. **CF function passes .well-known paths:** Read the updated function code and verify the early return
4. **CF function passes .txt/.md/.json:** Already works (URIs with `.` are not rewritten) -- verify by reading function logic
5. **Both cf-function.js and template.yaml match:** Diff the function bodies

## Open Questions

None. All decisions are locked, the implementation path is clear, and the scope is minimal.

## Sources

### Primary (HIGH confidence)
- `infra/cf-function.js` -- current CloudFront Function code (read directly)
- `infra/template.yaml` -- CloudFormation template with inline function code (read directly)
- `docusaurus.config.ts` -- confirms preset-classic (sitemap plugin), trailingSlash: true
- `static/` directory listing -- confirms pattern (img/, .nojekyll, redirect-map.json already present)
- `package.json` / `package-lock.json` -- confirms @docusaurus/plugin-sitemap installed via preset-classic

### Secondary (MEDIUM confidence)
- robots.txt specification (robotstxt.org) -- standard format, well-established
- AI crawler user-agent strings -- GPTBot, ClaudeBot, PerplexityBot, Google-Extended are well-documented by their respective companies

## Metadata

**Confidence breakdown:**
- robots.txt content: HIGH -- standard format, all decisions locked
- CF function modification: HIGH -- code read directly, change is minimal and well-understood
- Static file serving: HIGH -- pattern already established in project (static/img, static/.nojekyll)
- AI crawler user-agents: HIGH -- official documentation from OpenAI, Anthropic, Google, Perplexity

**Research date:** 2026-04-03
**Valid until:** 2026-05-03 (stable -- robots.txt and CloudFront Functions are mature, slow-moving technologies)
