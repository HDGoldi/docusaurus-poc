# Domain Pitfalls: Adding llms.txt, skill.md, and robots.txt to Docusaurus on S3/CloudFront

**Domain:** AI & Search Readiness for existing Docusaurus 3.9.2 site on AWS S3 + CloudFront
**Researched:** 2026-04-03
**Overall confidence:** HIGH (based on direct codebase inspection of cf-function.js, deploy.yml, template.yaml, docusaurus.config.ts)

---

## Critical Pitfalls

Mistakes that cause broken URLs, blocked crawlers, or invisible files.

### Pitfall 1: CloudFront Function Rewrites /.well-known/ Paths to index.html

**What goes wrong:** The existing CloudFront Function (`infra/cf-function.js` and inlined at lines 94-104 of `infra/template.yaml`) rewrites URIs without file extensions by appending `/index.html`. When an AI agent requests `/.well-known/skills` (no trailing slash, no extension), the function rewrites it to `/.well-known/skills/index.html`. But the discovery file is `index.json`, not `index.html`. The request returns 404 or the CloudFront custom error page.

**Why it happens:** The CF function logic is:
```javascript
if (uri.endsWith('/')) request.uri += 'index.html';
else if (!uri.includes('.')) request.uri += '/index.html';
```
`/.well-known/skills` has no extension, so it matches the second branch and becomes `/.well-known/skills/index.html`.

**Consequences:** The `/.well-known/skills/` discovery endpoint is unreachable when accessed without trailing slash (which is the common behavior for AI agents and crawlers). The entire skills discovery mechanism fails silently.

**Prevention:**
- Option A (recommended): Update the CloudFront Function to handle `/.well-known/` paths. For requests under `/.well-known/`, if the URI has no extension and does not end with `/`, append `/index.json` instead of `/index.html`. Both `infra/cf-function.js` and the inline version in `infra/template.yaml` must be updated in sync.
- Option B: Serve the discovery document as `index.html` with appropriate Content-Type set via S3 metadata or a CloudFront response headers policy. Hacky and confusing.
- Option C: Always link to the explicit filename (`/.well-known/skills/index.json`) and accept that the directory path won't work. Fragile -- depends on every consumer using the exact URL.

**Detection:** After deploy, test both `curl https://help.1nce.com/.well-known/skills` and `curl https://help.1nce.com/.well-known/skills/` and verify both return valid JSON.

**Phase to address:** Infrastructure phase -- must be resolved before deploying skill.md files.

---

### Pitfall 2: S3 Serves .md Files as application/octet-stream

**What goes wrong:** When `aws s3 sync` uploads files, it infers Content-Type from file extensions. For `.md` files, many AWS CLI versions map to `application/octet-stream` instead of `text/markdown`. When an AI agent or browser requests `skill.md`, it receives a binary content type and either downloads the file or skips it entirely.

**Why it happens:** The deploy workflow (`deploy.yml` lines 371-374) uses:
```bash
aws s3 sync build/ s3://1nce-developer-hub-prod/ --exclude "assets/*" --cache-control "public, max-age=600, must-revalidate" --delete
```
No `--content-type` override is specified. S3's MIME type detection for `.md` is inconsistent across CLI versions.

**Consequences:** `skill.md` becomes unreadable to AI agents that check Content-Type headers. Some crawlers skip `application/octet-stream` entirely. The file exists but is functionally invisible.

**Prevention:** Add explicit content-type overrides in the deploy workflow after the main sync:
```bash
aws s3 cp s3://bucket/.well-known/skills/skill.md s3://bucket/.well-known/skills/skill.md \
  --content-type "text/markdown; charset=utf-8" --metadata-directive REPLACE
aws s3 cp s3://bucket/llms.txt s3://bucket/llms.txt \
  --content-type "text/plain; charset=utf-8" --metadata-directive REPLACE
```

**Detection:** After deploy, run `curl -I https://help.1nce.com/.well-known/skills/skill.md` and verify `Content-Type: text/markdown`.

**Phase to address:** Deploy pipeline updates -- add to the production deploy job.

---

### Pitfall 3: Accidentally Blocking LLM Crawlers in robots.txt

**What goes wrong:** A robots.txt that is too restrictive blocks GPTBot, ClaudeBot, PerplexityBot, and other AI crawlers from indexing the documentation. This directly contradicts the goal of v1.3 (making the site discoverable by LLMs).

**Why it happens:** Three common mistakes:
1. Copying the old ReadMe.com robots.txt (which blocked `/*/api-next`, `/edit/`, `/cdn-cgi/` -- paths that don't exist in the new site) creates a false sense of completeness without actually addressing LLM crawlers.
2. Adding a blanket `Disallow: /api/` to block API "try it" pages also blocks LLM crawlers from the 125 API documentation pages.
3. Using overly broad User-agent blocks intended for spam bots that accidentally match legitimate AI crawlers.

**Consequences:** Documentation disappears from AI-powered search (ChatGPT, Claude, Perplexity). Defeats the entire purpose of v1.3.

**Prevention:**
- Start permissive: `User-agent: * / Allow: /`. The site is public documentation -- there is nothing to hide.
- Only block paths that generate no useful content (redirect stub pages, if any).
- Always include `Sitemap: https://help.1nce.com/sitemap.xml` (the sitemap already exists -- `preset-classic` bundles the sitemap plugin and `build/sitemap.xml` is confirmed present).
- Validate with Google's robots.txt tester. Verify GPTBot, ClaudeBot, and Googlebot can access `/docs/`, `/api/`, `/llms.txt`.
- Do NOT copy the old ReadMe.com robots.txt.

**Detection:** Use an online robots.txt validator against each target user-agent.

**Phase to address:** First phase -- simplest deliverable, highest SEO impact.

---

### Pitfall 4: Content Staleness -- Docs Change but llms.txt Doesn't Update

**What goes wrong:** If `llms.txt` is a purely static file in `static/`, it never updates when documentation pages are added, removed, or reorganized. The PROJECT.md specifies "hand-curated structure with build-time generated link sections" -- but if the link generation isn't actually wired into the build, the file drifts from reality within weeks.

**Why it happens:** The curated product structure (1NCE Connect, 1NCE OS) is intentionally static. But the link sections that should list actual doc pages will drift as content changes. New API specs get added, docs get reorganized, and `llms.txt` still lists the old structure.

**Consequences:** LLMs consuming `llms.txt` get outdated information. Links point to moved/deleted pages (404s). The file becomes a liability rather than an asset -- worse than having no `llms.txt` at all, because it actively misinforms.

**Prevention:**
- Build `llms.txt` link sections at build time using a Docusaurus plugin or pre-build script that reads sidebar configuration and/or sitemap data.
- Keep the curated "product structure" header as a static template, auto-generate the URL list.
- Add a CI check: all URLs listed in `llms.txt` must exist in the build output or return 200. Extend the smoke test.

**Detection:** Diff URLs in `llms.txt` against `sitemap.xml` periodically. Any URL in `llms.txt` not in the sitemap indicates staleness.

**Phase to address:** llms.txt creation phase -- build-time generation must be part of the initial implementation, not a later enhancement.

---

## Moderate Pitfalls

### Pitfall 5: .well-known Directory Excluded from Build or S3 Upload

**What goes wrong:** Directories starting with `.` (dot-directories) can be excluded by various tools in the pipeline. While Docusaurus's `static/` directory correctly copies `.well-known/` to `build/.well-known/`, other factors can prevent it from reaching S3:
- A `.gitignore` rule matching dot-directories
- A CI cleanup step that removes hidden files
- The `aws s3 sync --delete` flag removing it if a previous sync didn't include it

**Prevention:**
- Verify `build/.well-known/` exists after `npm run build` in CI (add an `ls -la build/.well-known/` check step).
- Ensure no `.gitignore` rule matches `.well-known/`. Currently the project `.gitignore` does not exclude it, but verify before committing.
- After deploy, smoke test `/.well-known/skills/skill.md` specifically.

**Phase to address:** skill.md implementation phase -- verify the full path from static/ to S3.

---

### Pitfall 6: Dual CloudFront Function Sources Diverge

**What goes wrong:** The CloudFront Function exists in TWO places: `infra/cf-function.js` (standalone file, used for documentation/reference) and inlined in `infra/template.yaml` (lines 94-104, used by CloudFormation). When updating the function for `.well-known` path handling, a developer updates one copy but not the other. The CloudFormation template deploys the old logic.

**Why it happens:** The standalone `cf-function.js` has a header comment saying it's "Attached as viewer-request to both prod and preview distributions" but the actual deployed function comes from the CloudFormation template's inline `FunctionCode`. The standalone file serves as reference/documentation only.

**Consequences:** The fix for Pitfall 1 is applied to the wrong file, deployed, and the `.well-known` paths still break. Debugging is confusing because the standalone file looks correct.

**Prevention:**
- Update BOTH files in the same commit.
- Add a CI step or comment that explicitly states which file is the source of truth (the CloudFormation inline version).
- Consider extracting the function code to the standalone file and using `!Sub` or `Fn::Join` to include it in the template, but this adds complexity -- simpler to just keep them in sync manually with a clear comment.

**Phase to address:** Infrastructure phase -- same commit as Pitfall 1 fix.

---

### Pitfall 7: robots.txt Silently Overwritten by Docusaurus Plugin

**What goes wrong:** Placing `robots.txt` in Docusaurus's `static/` directory works correctly today. But if a future Docusaurus version or a community plugin auto-generates a `robots.txt`, the generated file may overwrite the static one. Docusaurus build pipeline: plugins generate files, then static files are copied (static wins). However, post-build plugins that write to the output directory can overwrite static files.

**Prevention:**
- Use `static/robots.txt` (the simple approach).
- Add a CI verification step: `grep "Sitemap:" build/robots.txt` to ensure the expected content survives the build.
- Do NOT install any community robots.txt plugins -- the static file approach is sufficient and predictable.

**Phase to address:** robots.txt creation phase -- add CI verification from day one.

---

### Pitfall 8: trailingSlash: true Causes Confusion for Static File URLs

**What goes wrong:** The Docusaurus config has `trailingSlash: true` (line 25 of `docusaurus.config.ts`). This only affects Docusaurus-generated pages, NOT files in `static/`. However, some consumers may request `/llms.txt/` (with trailing slash) because the site's link convention uses trailing slashes. With the CloudFront function, `/llms.txt/` becomes `/llms.txt/index.html` which is a 404.

**Consequences:** Minor -- most crawlers request exact URLs from links. But it can cause confusion during manual testing ("I typed the URL with a slash and it 404'd").

**Prevention:**
- Document canonical URLs without trailing slashes: `https://help.1nce.com/llms.txt`, `https://help.1nce.com/robots.txt`.
- Internal links to these files should never include trailing slashes.
- This is a known Docusaurus behavior, not a bug -- static files are not subject to `trailingSlash` processing.

**Phase to address:** Documentation/reference only -- not worth a code change.

---

## Minor Pitfalls

### Pitfall 9: llms.txt Format Violations

**What goes wrong:** The llms.txt specification (llmstxt.org) has a specific plain text format. Common mistakes include adding HTML, using wrong heading levels, including relative URLs instead of absolute URLs, or adding complex Markdown features (tables, images) that aren't part of the spec.

**Prevention:** Follow the spec exactly: `#` headings, `- [title](url)` links with absolute URLs, plain text descriptions. No HTML, no images, no tables.

**Phase to address:** llms.txt creation phase -- template review.

---

### Pitfall 10: skill.md Path Convention Uncertainty

**What goes wrong:** The skills/agent specification is an emerging standard. The exact path convention may be `/.well-known/skills/` (plural, as stated in PROJECT.md) or something else. Using the wrong path means AI agents can't discover the file.

**Prevention:** Verify the current specification before implementation. The PROJECT.md states `/.well-known/skills/` with discovery `index.json`, which should be treated as the target unless research finds a different standard.

**Confidence:** LOW -- emerging standard, verify before building.

**Phase to address:** skill.md implementation phase -- research the spec first.

---

### Pitfall 11: Smoke Test Doesn't Cover New Files

**What goes wrong:** The existing smoke test (`scripts/smoke-test.sh`) checks only 6 URLs. None of the v1.3 deliverables are tested. If llms.txt, robots.txt, sitemap.xml, or the skills endpoint break after deployment, nobody knows until an external consumer reports it.

**Prevention:** Extend the smoke test with:
```bash
URLS=(
  # ... existing URLs ...
  "/robots.txt"
  "/sitemap.xml"
  "/llms.txt"
  "/.well-known/skills/skill.md"
  "/.well-known/skills/index.json"
)
```
Also add content verification (not just 200 status):
```bash
# Verify robots.txt contains sitemap reference
curl -s "${BASE_URL}/robots.txt" | grep -q "Sitemap:" || echo "FAIL: robots.txt missing Sitemap directive"
```

**Phase to address:** Final verification phase -- but plan for it from the start.

---

### Pitfall 12: CloudFront Cache Delays During Debugging

**What goes wrong:** The deploy workflow invalidates `/*` (line 377 of `deploy.yml`), which is correct. But the `--cache-control "public, max-age=600, must-revalidate"` for non-asset files means edge caches hold old content for up to 10 minutes. During initial development and debugging, this delay causes confusion.

**Prevention:** The existing invalidation is sufficient for production. For debugging:
- Use `curl -H "Cache-Control: no-cache"` to bypass edge cache.
- Or hit the S3 website endpoint directly (if accessible) to verify file content before CloudFront serves it.
- The 10-minute TTL is acceptable for robots.txt and llms.txt in production.

**Phase to address:** No code change needed -- awareness only.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation | Priority |
|-------------|---------------|------------|----------|
| robots.txt creation | P3: Over-blocking crawlers, P7: Silent overwrite | Permissive rules + CI content verification | Do first -- simplest, highest SEO impact |
| llms.txt creation | P4: Content staleness, P9: Format violations | Build-time link generation + spec compliance | Do second -- needs build pipeline integration |
| skill.md + .well-known | P1: CF function rewrite, P2: Content-type, P5: Path exclusion, P10: Path convention | CF function update + content-type override + smoke test | Do third -- most infrastructure touchpoints |
| Deploy pipeline updates | P2: Content-type, P6: Dual CF function sources, P11: Smoke test gaps | Explicit content-type overrides + keep both CF files in sync + extend smoke test | Integrate across all phases |
| Verification & monitoring | P4: Staleness, P11: Missing monitoring | URL validation in CI + staleness check | Final phase -- validation layer |

## Codebase-Specific Notes

Grounded in actual codebase state as of 2026-04-03:

1. **CloudFront Function** exists in TWO places: `infra/cf-function.js` (reference) and inline in `infra/template.yaml` (lines 94-104, deployed). Both must be updated for `.well-known` handling.

2. **Deploy workflow** (`deploy.yml` lines 371-377): Two-step S3 sync works correctly for new static files but needs explicit content-type overrides for `.md` files.

3. **Sitemap already exists:** `build/sitemap.xml` is generated by `@docusaurus/preset-classic` (confirmed present in build output). No additional plugin needed -- just reference it in robots.txt as `Sitemap: https://help.1nce.com/sitemap.xml`.

4. **No existing robots.txt:** The `static/` directory has no robots.txt (confirmed: only `.nojekyll`, `img/`, and `redirect-map.json`). Clean slate -- no conflict risk.

5. **No .well-known directory:** Does not exist yet in `static/` or `build/`. Must be created.

6. **Smoke test is minimal:** Only 6 URLs tested. Must be extended for v1.3.

7. **Custom error responses:** CloudFront returns `/404.html` for 403 and 404 errors (template.yaml lines 158-166). If `.well-known` files are missing from S3, users see the custom 404 page, not an S3 XML error -- which makes debugging harder (check S3 directly, not through CloudFront).

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| P1: CF function breaks .well-known | LOW | Update CF function in template.yaml, deploy CloudFormation stack, invalidate cache. 5-minute fix. |
| P2: Wrong content-type on .md | LOW | Run `aws s3 cp` with `--content-type` override and `--metadata-directive REPLACE`. Instant fix. |
| P3: robots.txt blocks LLM crawlers | MEDIUM | Fix robots.txt, redeploy, invalidate cache. But search engine re-crawling takes days/weeks. |
| P4: Stale llms.txt | LOW | Regenerate and redeploy. But any LLM that cached the stale version may serve wrong info for a while. |
| P5: .well-known missing from S3 | LOW | Verify static/ directory, rebuild, redeploy. |
| P6: CF function copies diverge | LOW | Sync the files, redeploy. |

## Sources

- Direct codebase inspection: `infra/cf-function.js`, `infra/template.yaml` (lines 94-104, 158-166), `deploy.yml` (lines 371-377), `docusaurus.config.ts` (line 25: trailingSlash), `scripts/smoke-test.sh`, `static/` directory listing -- HIGH confidence
- Docusaurus static file serving behavior (static/ -> build root copy) -- HIGH confidence
- AWS S3 MIME type detection for .md files -- HIGH confidence (known behavior, well-documented)
- CloudFront Function URI rewrite behavior -- HIGH confidence (verified by reading actual function code)
- llms.txt specification format -- MEDIUM confidence (training data, verify against llmstxt.org before implementation)
- .well-known/skills path convention -- LOW confidence (emerging standard, verify current spec before building)

---
*Pitfalls research for: v1.3 AI & Search Readiness (llms.txt, skill.md, robots.txt)*
*Researched: 2026-04-03*
