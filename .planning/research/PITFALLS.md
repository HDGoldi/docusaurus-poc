# Domain Pitfalls

**Domain:** ReadMe.com to Docusaurus migration (1NCE Developer Hub)
**Researched:** 2026-03-20
**Confidence:** HIGH (based on direct inspection of exported content)

## Critical Pitfalls

Mistakes that cause rewrites, broken builds, or major content loss.

### Pitfall 1: Incomplete ReadMe Proprietary Syntax Conversion

**What goes wrong:** The exported ReadMe content uses at least four distinct proprietary syntax patterns that will break a Docusaurus build if not converted: `<HTMLBlock>` JSX wrappers (42 files), `(doc:slug)` cross-reference links (112 occurrences in 44 files), `<Table>` JSX components with complex alignment props, and `> :warning:` blockquote-style admonitions. A conversion script that handles only one or two of these patterns leaves dozens of pages broken.

**Why it happens:** Teams discover one pattern (e.g., `HTMLBlock`), write a converter for it, and assume the export is "mostly standard Markdown." In reality, the ReadMe exporter produces a mix of standard Markdown, JSX components, and ReadMe-specific link syntax. Each pattern requires its own regex or AST transformation pass.

**Consequences:** Docusaurus MDX parser fails hard on unrecognized JSX. A single unconverted `<HTMLBlock>` or `<Table>` component in one file can crash the entire build, not just that page. The build error messages from MDX are often cryptic and do not clearly identify which syntax element is the problem.

**Prevention:**
1. Before writing any conversion code, catalog every non-standard syntax pattern across all 122 files. The patterns found in this codebase are:
   - `<HTMLBlock>{...}</HTMLBlock>` -- 42 files, contains raw HTML wrapped in JSX template literals
   - `(doc:slug-name)` and `(doc:slug-name#anchor)` -- 112 occurrences, ReadMe internal cross-references
   - `<Table align={[...]}>` with `<thead>/<tbody>` JSX -- used in at least LwM2M and other technical pages
   - `> :warning:` / `> :info:` blockquote admonitions -- need conversion to `:::warning` / `:::info`
   - `<Image>` components -- found in multiple files
   - `<a href="..." target="_blank">` raw HTML links -- scattered throughout
2. Write a test suite that validates every converted page against `docusaurus build` before declaring conversion complete.
3. Run conversion iteratively: convert one pattern at a time and verify the build after each pass.

**Detection:** Run `docusaurus build` after conversion. Any unconverted patterns will cause MDX compilation failures. Also grep for known patterns: `HTMLBlock`, `<Table`, `(doc:`, `> :warning:`, `<Image`.

**Phase mapping:** Must be fully addressed in the content conversion phase (Phase 1/2). This is THE critical path item for the entire migration.

---

### Pitfall 2: Base64-Encoded Images Left Inline

**What goes wrong:** 31 files contain 40 images encoded as base64 data URIs inside `<HTMLBlock>` components. These are typically large diagram images (some are tens of KB of base64 text). If left inline, they bloat the MDX files massively, slow down builds, make the content uneditable, and cause git diffs to be unreadable. Some may also exceed MDX parser limits.

**Why it happens:** ReadMe.com stores images as base64 when they were originally uploaded as embedded images or diagrams (draw.io exports, screenshots). The ReadMe exporter faithfully preserves this encoding rather than extracting to separate image files.

**Consequences:** Build times increase dramatically. Git repository size balloons. Pages with large base64 images may fail MDX parsing or cause memory issues during SSR. Content authors cannot update or replace images without re-encoding.

**Prevention:**
1. Write a pre-processing script that extracts all base64 data URIs from `<HTMLBlock>` and `<img>` tags.
2. Decode each base64 string and save as a proper image file (PNG/JPEG) in a `static/img/` or per-page `assets/` directory.
3. Replace the inline base64 with a standard Markdown image reference: `![alt text](/img/extracted-image-name.png)`.
4. Verify image quality after extraction -- base64 encoding is lossless, but ensure the decode step preserves the original format.

**Detection:** Grep for `data:image/png;base64` and `data:image/jpeg;base64` in the converted content. Any remaining hits are unconverted.

**Phase mapping:** Must be handled during content conversion, ideally as the first transformation pass before other syntax conversions.

---

### Pitfall 3: Broken Internal Link Graph After Migration

**What goes wrong:** ReadMe.com uses a flat slug-based linking system (`doc:slug-name`) where page slugs are globally unique and independent of filesystem hierarchy. Docusaurus uses filesystem-path-based document IDs. The mapping between ReadMe slugs and Docusaurus document paths is non-trivial, especially with the 5-tab, deeply nested sidebar structure of the 1NCE Developer Hub.

**Why it happens:** A naive conversion simply strips the `doc:` prefix and hopes the slug matches a filename. But Docusaurus document IDs include the directory path (e.g., `1nce-os/1nce-os-device-controller/device-controller-features-limitations`), not just the filename. Additionally, anchor links (`doc:slug#section`) need separate handling.

**Consequences:** All 112 internal cross-references break silently -- links render but point to 404 pages. Users clicking between related documentation pages get dead ends. This is especially damaging for the deeply interlinked 1NCE OS documentation where features reference other features extensively.

**Prevention:**
1. Build a slug-to-path mapping table from the exported content before conversion. Parse every file's slug (from frontmatter or filename) and record its target Docusaurus path.
2. Write the link converter to use this lookup table, not string manipulation.
3. After conversion, run a link checker (e.g., `docusaurus build` with `onBrokenLinks: 'throw'` in `docusaurus.config.js`) to catch any broken references.
4. Handle external ReadMe links separately -- some files link to `https://help.1nce.com/dev-hub/reference/...` (the API Explorer). These need to be converted to the new Docusaurus API docs paths.

**Detection:** Docusaurus config `onBrokenLinks: 'throw'` will fail the build on any broken internal link. Also manually audit links from high-traffic pages (welcome, services overview).

**Phase mapping:** Content conversion phase, but requires the sidebar/navigation structure to be defined first so that document paths are known.

---

### Pitfall 4: Multiple OpenAPI Specs with Conflicting Configuration

**What goes wrong:** The 1NCE API is split across 6 separate OpenAPI spec files (sim-management.json, authorization.json, order-management.json, product-information.json, support-management.json, 1nce-os.json). The `docusaurus-openapi-docs` plugin needs to be configured to handle all of them, generating separate doc sections with proper categorization. Teams often configure only one spec, or configure multiple specs that conflict on route paths.

**Why it happens:** The `docusaurus-openapi-docs` plugin documentation primarily shows single-spec examples. Configuring multiple specs requires careful use of the `specPath` and `outputDir` options for each spec, along with separate sidebar configurations. The plugin generates pages at build time, and if output directories overlap, pages from one spec overwrite pages from another.

**Consequences:** Missing API endpoints (only one spec gets rendered), conflicting page routes, or build failures. The "Try It" interactive functionality may not work correctly if the server URL configuration differs between specs (which it does -- some specs point to different base URLs).

**Prevention:**
1. Configure each OpenAPI spec as a separate plugin instance with its own `outputDir` and `sidebarPath`.
2. Ensure each spec's `id` is unique in the Docusaurus plugin configuration.
3. Test the "Try It" functionality for each spec independently -- verify the server URLs match the spec's `servers` configuration.
4. The 1NCE specs all point to `https://api.1nce.com/management-api` as the base, but verify each spec's server URL is correctly propagated.

**Detection:** After build, verify each API category (SIM Management, Authorization, etc.) has its complete set of endpoints rendered. Compare endpoint counts against the source OpenAPI specs.

**Phase mapping:** API Explorer integration phase. Should be tackled after basic content migration is working.

---

## Moderate Pitfalls

### Pitfall 5: ReadMe Frontmatter Incompatibility

**What goes wrong:** ReadMe exports include frontmatter fields that Docusaurus does not recognize: `excerpt`, `deprecated`, `hidden`, `metadata` (with nested `robots` field), and `next`. Docusaurus will either ignore or error on these unknown fields depending on configuration.

**Prevention:**
1. Strip or transform ReadMe-specific frontmatter during conversion.
2. Map `title` directly (compatible).
3. Convert `hidden: true` to `draft: true` or exclude the page.
4. Convert `metadata.description` to `description` at the top level.
5. Convert `excerpt` to `description` if no `metadata.description` exists.
6. Drop `deprecated`, `next`, and `metadata.robots` fields (handle SEO separately via Docusaurus head tags if needed).

**Detection:** Build warnings about unknown frontmatter fields. Review a sample of converted pages to verify frontmatter is clean.

**Phase mapping:** Content conversion phase, part of the automated conversion script.

---

### Pitfall 6: Five-Tab Navbar with Multiple Sidebars Misconfiguration

**What goes wrong:** The current help.1nce.com has 5 navigation tabs (Documentation, API Explorer, 1NCE Platform, Blueprints & Examples, Terms & Abbreviations). Docusaurus supports multiple sidebars, but configuring 5 separate doc plugin instances or sidebar sections is error-prone. The sidebar ordering (specified in `_order.yaml` from the ReadMe export) needs manual mapping to Docusaurus sidebar configuration.

**Why it happens:** Docusaurus supports multiple docs plugin instances (for truly separate doc sections with separate URLs) or a single docs instance with multiple sidebars. Teams pick the wrong approach or mix them incorrectly. The navbar `items` configuration for linking to different sidebar sections is also non-obvious.

**Prevention:**
1. Use multiple docs plugin instances only if the sections have fundamentally different content types (e.g., API reference vs. guides). For this project, the API Explorer is generated by `docusaurus-openapi-docs` and is inherently separate.
2. For the remaining 4 tabs, evaluate whether multiple sidebars within a single docs instance (using `sidebarPath` per category) or separate docs plugin instances are more appropriate.
3. Map the `_order.yaml` from the ReadMe export to generate `sidebars.js` configuration programmatically rather than hand-crafting it for 120+ pages.

**Detection:** Navigate the built site and verify all 5 tabs work, each shows the correct sidebar, and sidebar ordering matches the original site.

**Phase mapping:** Site structure/scaffolding phase, before content migration begins.

---

### Pitfall 7: SPA Routing Breaks on CloudFront

**What goes wrong:** Docusaurus generates a client-side routed SPA. Direct URL access (e.g., bookmarking `help.1nce.com/docs/some-page`) returns a 403 or 404 from CloudFront/S3 because the file `docs/some-page` does not exist as a literal S3 object -- only `docs/some-page/index.html` does.

**Why it happens:** S3 static hosting and CloudFront do not natively understand SPA routing. Without a CloudFront Function or Lambda@Edge to rewrite requests, any direct navigation or page refresh on a non-root URL fails.

**Consequences:** Every bookmarked link, every link shared in Slack/email, and every search engine result leads to a 403/404 error. This is the most common post-deployment complaint for Docusaurus-on-AWS.

**Prevention:**
1. Implement a CloudFront Function (not Lambda@Edge -- cheaper and faster) that rewrites URIs:
   - If the URI does not have a file extension and does not end with `/`, append `/index.html`.
   - If the URI ends with `/`, append `index.html`.
2. Set `trailingSlash: true` in `docusaurus.config.js` to ensure consistent URL patterns.
3. Configure S3 website hosting error document as `index.html` as a fallback (but rely on the CloudFront Function as the primary solution).
4. Test direct URL access, page refresh, and deep linking after deployment.

**Detection:** After deployment, test at least 5 deep links by pasting URLs directly into a browser. Any 403/404 means the routing function is misconfigured.

**Phase mapping:** AWS infrastructure/deployment phase. Must be tested end-to-end before go-live.

---

### Pitfall 8: Custom HTML/CSS Components Without Docusaurus Equivalents

**What goes wrong:** The welcome page and several other pages contain custom HTML with CSS classes (e.g., `navigationTable`, `navigationTableCell`) that create grid layouts, styled cards, and other visual components. These are wrapped in `<HTMLBlock>` and will not render correctly after simple extraction because Docusaurus uses a different CSS framework (Infima) and the custom CSS classes do not exist.

**Why it happens:** ReadMe.com allows arbitrary HTML injection via its custom blocks. Teams convert the JSX wrapper but leave the inner HTML intact, assuming it will "just work." The inner HTML depends on CSS that was either built into ReadMe's theme or defined inline in `<style>` tags within the `HTMLBlock`.

**Prevention:**
1. Identify all `<HTMLBlock>` instances that contain `<style>` tags -- these define custom CSS that must be migrated.
2. For simple layouts (like the welcome page's navigation grid), replace with Docusaurus-native components: use MDX with React components, or Docusaurus's built-in `<CardLayout>` or custom CSS modules.
3. For inline styles that are purely cosmetic, consider whether the default Docusaurus/Infima styling is acceptable instead of porting the custom CSS.
4. Some `HTMLBlock` content is just centering an image -- these can be replaced with standard Markdown images.

**Detection:** Visual comparison of each converted page against the original site. Automated screenshot comparison tools (e.g., Percy, BackstopJS) can catch regressions.

**Phase mapping:** Content conversion phase (extraction) and theming/branding phase (visual parity).

---

## Minor Pitfalls

### Pitfall 9: Docusaurus OpenAPI Plugin Version Compatibility

**What goes wrong:** The `docusaurus-openapi-docs` plugin from PaloAltoNetworks has specific version requirements that must match the Docusaurus core version. Installing the wrong combination causes cryptic build failures.

**Prevention:** Pin the exact compatible versions. Check the plugin's GitHub releases page for the version matrix. Use the same major version as your Docusaurus installation. As of 2026, ensure you are using Docusaurus 3.x with the corresponding `docusaurus-openapi-docs` 4.x release.

**Detection:** Build failure with errors about incompatible React versions, missing theme components, or plugin API mismatches.

**Phase mapping:** Initial project scaffolding phase.

---

### Pitfall 10: DNS Cutover Downtime

**What goes wrong:** Changing the `help.1nce.com` DNS from ReadMe.com to CloudFront causes a period where some users see the old site and others see the new site (DNS propagation), or worse, where the new site is not ready and users see errors.

**Prevention:**
1. Deploy and fully test the new site on a staging domain (e.g., `help-staging.1nce.com`) first.
2. Reduce the TTL on the `help.1nce.com` DNS record days before the cutover.
3. Coordinate the DNS change during a low-traffic window.
4. Keep the ReadMe.com subscription active for a grace period after cutover as a rollback option.
5. Set up redirect rules from old ReadMe URL patterns (e.g., `/dev-hub/docs/...` and `/dev-hub/reference/...`) to new Docusaurus paths.

**Detection:** Monitor 4xx/5xx error rates on CloudFront immediately after DNS cutover. Check from multiple geographic locations.

**Phase mapping:** Go-live/deployment phase, the final step.

---

### Pitfall 11: Missing `<Image>` Component Handling

**What goes wrong:** Some exported pages use an `<Image>` JSX component (not standard Markdown `![]()`). This component does not exist in Docusaurus and will cause MDX compilation failures.

**Prevention:** Convert all `<Image>` components to standard Markdown image syntax or Docusaurus's `<img>` tag. Extract the `src`, `alt`, and any sizing attributes.

**Detection:** Grep for `<Image` in converted content. Build will fail on any unconverted instances.

**Phase mapping:** Content conversion phase.

---

### Pitfall 12: URL Structure Mismatch Breaks SEO and External Links

**What goes wrong:** The current ReadMe site uses URL patterns like `/dev-hub/docs/slug-name` and `/dev-hub/reference/endpoint-name`. The new Docusaurus site will use different URL patterns (e.g., `/docs/category/page-name` or `/api/endpoint-name`). Every external link to the current documentation (from blog posts, Stack Overflow answers, partner integrations, customer bookmarks) will break.

**Prevention:**
1. Document all current URL patterns from the ReadMe site.
2. Configure CloudFront Functions or S3 redirect rules to map old URL patterns to new ones.
3. Generate a comprehensive redirect map: old ReadMe slug to new Docusaurus path.
4. Set `slug` in Docusaurus frontmatter to preserve original URLs where possible.
5. Submit an updated sitemap to search engines after migration.

**Detection:** Crawl the old site's sitemap before migration. After migration, test each old URL to verify it redirects correctly.

**Phase mapping:** Deployment and post-launch phase. The redirect map should be built during content conversion when the slug-to-path mapping is created.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Content Conversion | Incomplete syntax conversion (Pitfall 1) | Catalog all patterns before coding; test build after each conversion pass |
| Content Conversion | Base64 images left inline (Pitfall 2) | Extract images as first conversion step |
| Content Conversion | Broken cross-references (Pitfall 3) | Build slug-to-path lookup table before link conversion |
| Content Conversion | Frontmatter incompatibility (Pitfall 5) | Strip/transform ReadMe fields in conversion script |
| Content Conversion | Custom HTML without CSS (Pitfall 8) | Replace with Docusaurus-native components |
| Content Conversion | `<Image>` components (Pitfall 11) | Convert to standard Markdown images |
| Site Structure | Multi-sidebar misconfiguration (Pitfall 6) | Map `_order.yaml` to `sidebars.js` programmatically |
| API Integration | Multiple OpenAPI spec conflicts (Pitfall 4) | Unique plugin instance IDs and separate output dirs |
| Project Setup | Plugin version mismatch (Pitfall 9) | Pin exact compatible versions from day one |
| AWS Deployment | SPA routing on CloudFront (Pitfall 7) | CloudFront Function for URI rewriting; test deep links |
| Go-Live | DNS cutover downtime (Pitfall 10) | Staging domain, reduced TTL, rollback plan |
| Go-Live | SEO/external link breakage (Pitfall 12) | Comprehensive redirect map from old to new URLs |

## Sources

- Direct inspection of exported ReadMe content at `dev-hub-v2.6-2026-03-20T20-39-14_8a4df1b/`
- Analysis of 122 markdown files, 6 OpenAPI JSON specs, and `_order.yaml`
- Pattern counts from grep analysis of actual content (HIGH confidence -- primary source is the codebase itself)
- Docusaurus documentation for MDX parsing, multiple sidebars, and plugin configuration
- AWS CloudFront documentation for SPA static hosting patterns
