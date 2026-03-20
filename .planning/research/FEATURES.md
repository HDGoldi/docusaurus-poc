# Feature Landscape

**Domain:** Developer documentation portal (ReadMe.com to Docusaurus migration)
**Researched:** 2026-03-20

## Table Stakes

Features users expect. Missing = product feels incomplete or migration is considered failed.

### Content Parity

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| All ~298 Markdown pages migrated | Users rely on existing docs daily; missing pages = broken bookmarks, lost trust | High | 298 .md files across docs, reference, custom_pages, and recipes directories. Bulk of the work is automated conversion. |
| Frontmatter conversion | ReadMe frontmatter (excerpt, deprecated, hidden, metadata) must map to Docusaurus equivalents | Med | ~185 frontmatter occurrences. Script needed to transform `hidden`, `excerpt`, `deprecated` fields to Docusaurus `draft`, `description`, `sidebar_label` etc. |
| Image migration and path rewriting | Broken images = unusable docs | Med | Only ~7 inline markdown images found; most images are embedded via HTML `<img>` tags or hosted externally on ReadMe CDN. Need to download remote images and rewrite paths to `/static/img/`. |
| HTML content preservation | Many pages use raw HTML tables, styled divs, and inline CSS | High | 132+ HTML block occurrences across 20+ files. Docusaurus MDX is strict about HTML — self-closing tags, className vs class, etc. Each must be validated. |
| ReadMe `HTMLBlock` conversion | Proprietary ReadMe component used in 37+ files | High | `HTMLBlock` wraps raw HTML/CSS. Must be converted to either MDX components or raw HTML that passes MDX parsing. The welcome page alone has extensive inline CSS grid layouts. |
| ReadMe `<Recipe>` component conversion | Custom component used in hardware recipe pages | Med | Used in custom_pages/recipes.md and hardware guide pages. Need a custom Docusaurus MDX component or convert to standard links/cards. |
| Admonition/callout conversion | Callouts are a standard doc pattern; 26 occurrences found in Zephyr SDK and SMS docs | Low | Some already use `:::note` syntax. Others may use ReadMe's `[block:callout]` format (not found in export — may have been pre-converted by exporter). |
| Code block preservation | Developers copy-paste AT commands and code snippets | Low | ~10 files with fenced code blocks, primarily in recipes. Standard markdown, should transfer cleanly. |

### Navigation and Information Architecture

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Five-tab navbar | Users navigate by top-level tabs: Documentation, API Explorer, 1NCE Platform, Blueprints & Examples, Terms & Abbreviations | Med | Docusaurus supports multiple docs plugin instances and navbar items. Must map each tab to a separate docs instance or use `docsPluginId`. |
| Deeply nested sidebar navigation | Current site has 3-4 levels of nesting (e.g., 1NCE OS > Device Controller > Web Interface) | High | 10+ doc categories, each with `_order.yaml` files defining sort order. Must generate `sidebars.js` programmatically from `_order.yaml` files. |
| Multiple sidebars | Each navbar tab has its own independent sidebar tree | Med | Docusaurus supports this natively via multiple docs plugin instances. Each instance gets its own sidebar config. |
| Breadcrumb navigation | Standard in documentation portals; helps users orient themselves in deep hierarchies | Low | Built into Docusaurus theme by default. No custom work needed. |
| Previous/Next page navigation | Readers expect sequential flow through related docs | Low | Built into Docusaurus. Automatic based on sidebar ordering. |

### API Explorer

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Interactive "Try It" API console | Core feature of ReadMe.com that developers actively use; removing it = major regression | High | 6 OpenAPI JSON specs (authorization, sim-management, order-management, product-information, support-management, 1nce-os). `docusaurus-openapi-docs` plugin handles this. |
| Multi-spec API documentation | APIs are split across 6 separate OpenAPI specs | Med | Plugin supports multiple specs via `config` entries. Each spec generates its own set of endpoint pages. |
| Auto-generated code snippets | Developers expect curl, Python, Node.js examples for each endpoint | Low | `docusaurus-openapi-docs` generates these automatically from OpenAPI specs. |
| Bearer token authentication in Try It | API requires OAuth token; must be enterable in the console | Low | Plugin supports authentication schemes defined in OpenAPI specs. Authorization spec already defines the auth flow. |
| Request/response schema display | Developers need to see expected payloads and responses | Low | Automatic from OpenAPI spec rendering by the plugin. |
| API endpoint sidebar navigation | Endpoints grouped by tag/category with methods (GET, POST, etc.) labeled | Low | Plugin generates sidebar automatically from OpenAPI spec structure. |

### Branding and Theming

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| 1NCE brand colors (dark navy/teal) | Must look like a 1NCE product, not a generic Docusaurus site | Med | Override Infima CSS variables in `custom.css`. Requires extracting exact hex values from current site. |
| Dark mode with brand consistency | Current site has dark mode; removing it = regression | Med | Docusaurus supports dark mode natively. Must ensure custom CSS covers both `[data-theme='light']` and `[data-theme='dark']`. |
| 1NCE logo in navbar and favicon | Brand recognition | Low | Drop-in replacement in `docusaurus.config.js`. |
| Custom fonts matching current site | Visual consistency with 1NCE brand | Low | Add font imports to `custom.css` or via `headTags` config. |

### Infrastructure and Deployment

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| AWS S3 + CloudFront hosting | Required constraint — must be on AWS | Med | Standard static site hosting pattern. S3 bucket + CloudFront distribution + OAC. |
| SSL certificate for help.1nce.com | HTTPS is non-negotiable for a developer portal | Low | ACM certificate in us-east-1 + Route 53 alias record. |
| CloudFront SPA routing function | Without this, direct URL access returns 403 errors | Med | CloudFront Function to rewrite `/path` to `/path/index.html`. Critical for Docusaurus client-side routing. |
| CI/CD automated deploy | Team must be able to merge and deploy without manual steps | Med | GitHub Actions workflow with OIDC auth to AWS. Build, S3 sync, CloudFront invalidation. |
| URL redirects from old paths | Existing bookmarks and external links must not break | High | ReadMe.com URL structure differs from Docusaurus. Need redirect map (CloudFront Function or `@docusaurus/plugin-client-redirects`). This is often overlooked but critical for SEO and user experience. |

## Differentiators

Features that would make the Docusaurus site better than the ReadMe.com version. Not expected, but high value.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Full-text search (Algolia DocSearch) | ReadMe had search; restoring it with Algolia provides better search quality | Med | Deferred per PROJECT.md but should be Phase 2. Algolia DocSearch is free for open-source/developer docs. Alternative: `docusaurus-search-local` for no-dependency search. |
| Glossary/Terms as structured data | Current terms page is a monolithic HTML table; could become a searchable, filterable glossary component | Med | Custom MDX component or React page. Transform the raw HTML glossary into structured data (JSON) rendered by a React component with filtering. |
| Hardware recipe cards with filtering | Current recipes are links on a page; could become a card grid with modem/protocol filtering | Med | Custom React component. Group by manufacturer (Quectel, SIMCOM, u-blox). Better discovery than current flat list. |
| OpenAPI spec version management | As APIs evolve, show which spec version is live | Low | Plugin supports versioned specs. Add when API changes are tracked. |
| Markdown linting in CI | Catch broken links, invalid MDX, missing images before deploy | Low | Add `docusaurus build` (already catches broken links) + optional `remark-lint` for style consistency. |
| Edit this page links | Let internal team quickly jump to source for corrections | Low | Built into Docusaurus. Configure `editUrl` pointing to GitHub repo. |
| Page metadata / SEO tags | Custom meta descriptions, Open Graph tags for shared links | Low | Docusaurus supports this via frontmatter. Many pages already have `metadata.title` and `metadata.description` from ReadMe export. |
| Announcement bar | Communicate migration, new features, or status updates to users | Low | Built-in Docusaurus feature. Single line of config. |
| Offline documentation (PWA) | IoT developers often work in connectivity-limited environments | Med | `@docusaurus/plugin-pwa` exists but adds complexity. Consider for post-launch. |

## Anti-Features

Features to explicitly NOT build. These add complexity without proportional value for this migration.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Doc versioning (V1.0 dropdown) | Only one version exists. Versioning adds build complexity, doubles content surface, and confuses the sidebar. The current ReadMe "V1.0" label is cosmetic, not functional. | Ship as unversioned. Add versioning only when a V2 API or major restructure actually happens. |
| AI assistant / "Ask AI" | The ReadMe AI assistant is a ReadMe SaaS feature. Building an equivalent requires RAG infrastructure, embedding pipelines, and ongoing LLM costs. Massive scope for marginal value. | Defer entirely. If needed later, evaluate Inkeep or Mendable as drop-in solutions. |
| User authentication / gated content | ReadMe supports login-gated docs. 1NCE docs appear fully public. Adding auth adds infrastructure and breaks the static site model. | Keep all docs public. If gating is ever needed, use CloudFront signed URLs or Lambda@Edge — but do not build this speculatively. |
| Custom analytics dashboard | Tempting to track page views, popular endpoints, etc. But this is infrastructure overhead with no migration value. | Use CloudFront access logs + a lightweight analytics tool (Plausible, Fathom) if needed. Do not build custom dashboards. |
| Content management UI / CMS | ReadMe provides a web editor. Replicating this in Docusaurus is a massive anti-pattern. | Use GitHub as the CMS. Markdown files in a repo with PR-based review is the Docusaurus way. |
| Internationalization (i18n) | Current site is English only. i18n adds significant complexity to the build and content pipeline. | Do not configure i18n unless there is an explicit multi-language requirement. |
| Comment system on docs pages | Some doc platforms allow comments. This requires a backend, moderation, and spam handling. | Use GitHub Issues or a feedback form link if user feedback is needed. |
| Real-time API status / uptime widget | Nice-to-have but requires integration with monitoring infrastructure. Out of scope for a docs migration. | Link to a separate status page (e.g., status.1nce.com) if one exists. |

## Feature Dependencies

```
Content Conversion ──→ Sidebar Generation ──→ Navbar Configuration
                  │                       │
                  └──→ Image Migration     │
                                           │
OpenAPI Spec Integration ──→ API Explorer Pages ──→ API Sidebar
                                                │
Branding / CSS ────────────────────────────────→ Dark Mode
                                                │
S3 + CloudFront Setup ──→ SSL / DNS ──→ CloudFront Function (SPA routing)
                                     │
GitHub Actions CI/CD ────────────────→ Automated Deploy
                                     │
URL Redirect Map ────────────────────→ CloudFront Function (redirects)
                                     │
Content Conversion ──→ Frontmatter Mapping ──→ SEO Metadata
                  │
HTMLBlock Conversion ──→ MDX Validation ──→ Build succeeds
                  │
Recipe Component ──→ Custom MDX Component (or link conversion)
```

Key dependency chains:
- **Content must convert before anything else** — sidebar generation, image paths, and MDX validation all depend on clean content.
- **HTMLBlock and Recipe components are blockers** — the build will fail if any MDX file contains invalid JSX. These proprietary ReadMe components must be handled early.
- **API Explorer is independent of docs content** — can be developed in parallel since it generates from OpenAPI specs, not from markdown.
- **Infrastructure can be set up in parallel** — S3/CloudFront/CI setup does not depend on content work.
- **URL redirects depend on both old and new URL structures being known** — can only be finalized after sidebar/navbar structure is set.

## MVP Recommendation

**Prioritize (Phase 1 - must ship):**

1. **Automated content conversion script** — Handles frontmatter, HTMLBlock, Recipe components, HTML cleanup for MDX compatibility. This is the highest-risk, highest-effort item. Without it, nothing renders.
2. **Five-tab navbar + multi-sidebar navigation** — Programmatically generate from `_order.yaml` files. Users navigate by structure; if the IA is wrong, the site is unusable.
3. **Interactive API Explorer** — 6 OpenAPI specs integrated via `docusaurus-openapi-docs`. This is the #1 feature that makes a developer hub valuable vs. a plain docs site.
4. **1NCE branding** — Colors, logo, dark mode. Without branding it looks like an abandoned prototype, not a production site.
5. **AWS deployment with CI/CD** — S3 + CloudFront + GitHub Actions. The site must be reachable at help.1nce.com.
6. **URL redirect map** — Preserve existing bookmarks and inbound links. SEO and user trust depend on this.

**Defer (Phase 2 - ship within weeks of launch):**

- **Full-text search (Algolia or local)** — Important but not launch-blocking. Users can use browser find initially.
- **Glossary component refactor** — The raw HTML table will render; it just will not be elegant.
- **Recipe card grid** — Links work fine; cards are a UX improvement, not a necessity.
- **Edit this page links** — Nice for the team, not user-facing.

**Defer (Phase 3 - if ever):**

- **AI assistant** — Only if there is budget and demand.
- **PWA / offline docs** — Only if IoT developer feedback requests it.
- **Doc versioning** — Only when V2 actually exists.

## Sources

- Project export analysis: 298 markdown files, 6 OpenAPI JSON specs, 377 total files in export
- ReadMe.com export structure: `_order.yaml` for sidebar ordering, frontmatter with `hidden`/`deprecated`/`excerpt` fields
- Proprietary components found: `HTMLBlock` (37+ files), `<Recipe>` (7 files), inline HTML/CSS (132+ occurrences in 20+ docs)
- Docusaurus documentation (training data, HIGH confidence for core features)
- `docusaurus-openapi-docs` plugin capabilities (training data, HIGH confidence)
- Migration guide prepared by Manus AI (2026-03-18) in project root
