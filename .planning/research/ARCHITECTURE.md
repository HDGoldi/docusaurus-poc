# Architecture Patterns

**Domain:** ReadMe.com to Docusaurus migration with interactive API docs on AWS
**Researched:** 2026-03-20

## Recommended Architecture

The system is a static documentation site built at CI time from three content sources (converted Markdown, OpenAPI specs, custom pages), deployed as flat files to AWS S3 behind CloudFront. There is no runtime server -- all interactivity (API "Try It" console) runs client-side in the browser, making requests directly to the 1NCE Management API.

```
                         +---------------------------+
                         |   GitHub Repository       |
                         |                           |
  Source Content         |  /docs/           (MDX)   |
  (build-time only)      |  /openapi/        (JSON)  |
                         |  /src/            (React)  |
                         |  /static/         (images) |
                         +----------+----------------+
                                    |
                         GitHub Actions (CI/CD)
                                    |
                         npm run build
                                    |
                         +----------v----------------+
                         |  /build/  (static HTML,   |
                         |   CSS, JS bundle)         |
                         +----------+----------------+
                                    |
                         aws s3 sync + CF invalidate
                                    |
              +---------------------v----------------------+
              |              CloudFront CDN                 |
              |  (SSL via ACM, CloudFront Function for     |
              |   SPA routing /path -> /path/index.html)   |
              +---------------------+----------------------+
                                    |
                          help.1nce.com
                                    |
              +---------------------v----------------------+
              |              User's Browser                 |
              |                                            |
              |  Docs pages:  static HTML + client JS      |
              |  API Explorer: "Try It" panel sends        |
              |    requests to api.1nce.com directly       |
              +--------------------------------------------+
```

### Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| **Content Conversion Pipeline** | One-time scripts that transform ReadMe.com exports into Docusaurus-compatible MDX. Handles magic block conversion, image path rewriting, frontmatter injection. | Reads exported Markdown from `/dev-hub-v2.6-*/docs/`, writes to Docusaurus `/docs/` |
| **Docusaurus Core** | Static site generator. Owns `docusaurus.config.ts`, theming, navbar, routing. | Consumes `/docs/`, `/openapi/`, `/src/`, `/static/` at build time |
| **Multi-Sidebar System** | Maps the five navbar tabs to independent sidebar trees. Each tab has its own `sidebarsXxx.ts` configuration. | Configured in `docusaurus.config.ts` via docs plugin instances |
| **OpenAPI Plugin** (`docusaurus-openapi-docs`) | Parses 6 OpenAPI JSON specs and generates MDX pages with interactive "Try It" panels. Runs at build time via `gen-api-docs`. | Reads `/openapi/*.json`, writes generated MDX to a designated output directory |
| **Theme Layer** | Custom CSS overrides on Infima framework. 1NCE branding (dark navy/teal), dark mode support. | Extends `@docusaurus/preset-classic` and `docusaurus-theme-openapi-docs` |
| **Static Assets** | Images, logos, fonts. Served from `/static/img/`. | Referenced by MDX content via absolute paths (`/img/...`) |
| **CI/CD Pipeline** (GitHub Actions) | Builds site, syncs to S3, invalidates CloudFront. Uses OIDC -- no static AWS keys. | Talks to GitHub (checkout), npm (build), AWS S3 + CloudFront (deploy) |
| **AWS Infrastructure** | S3 bucket (origin), CloudFront distribution (CDN + SSL + SPA routing), ACM cert, Route 53 DNS. | CloudFront serves to browsers; S3 is origin-only via OAC |

### Data Flow

**Build-time flow (where the real work happens):**

1. Developer merges PR to `main`
2. GitHub Actions triggers workflow
3. `npm run build` invokes Docusaurus, which:
   - Reads all MDX files from `/docs/` (5 doc plugin instances, one per tab)
   - Reads generated API MDX from OpenAPI plugin output
   - Applies theme (custom CSS + OpenAPI theme)
   - Produces `/build/` directory with static HTML, CSS, JS
4. `aws s3 sync ./build s3://help-1nce-com-bucket --delete`
5. `aws cloudfront create-invalidation --distribution-id $ID --paths "/*"`

**Runtime flow (lightweight):**

1. Browser requests `help.1nce.com/docs/introduction/getting-started`
2. CloudFront Function rewrites to `.../getting-started/index.html`
3. CloudFront serves from cache (or fetches from S3 origin)
4. Browser receives static HTML + hydration JS bundle
5. Client-side React handles navigation (SPA after initial load)
6. On API Explorer pages: user clicks "Try It", browser sends XHR directly to `api.1nce.com` with user-provided Bearer token

**Content update flow:**

1. Edit MDX file in `/docs/` or update OpenAPI spec in `/openapi/`
2. If OpenAPI spec changed: run `npx docusaurus gen-api-docs all` to regenerate API MDX
3. Commit, push, merge -- CI/CD handles the rest

## Docusaurus Project Structure

```
help-1nce-docs/
+-- docusaurus.config.ts          # Central config: site metadata, navbar, plugin instances
+-- sidebars-docs.ts              # Sidebar for "Documentation" tab
+-- sidebars-platform.ts          # Sidebar for "1NCE Platform" tab
+-- sidebars-blueprints.ts        # Sidebar for "Blueprints & Examples" tab
+-- sidebars-api.ts               # Sidebar for "API Explorer" tab (auto-generated)
+-- package.json
+-- tsconfig.json
|
+-- docs/                          # Main documentation content
|   +-- introduction/              # Tab: Documentation
|   +-- sim-cards/
|   +-- connectivity-services/
|   +-- network-services/
|   +-- mcp-server/
|   +-- troubleshooting/
|   +-- platform/                  # Tab: 1NCE Platform
|   |   +-- portal/
|   |   +-- platform-services/
|   |   +-- 1nce-os/
|   +-- blueprints/                # Tab: Blueprints & Examples
|   +-- terms/                     # Tab: Terms & Abbreviations
|
+-- openapi/                       # OpenAPI JSON specs (6 files)
|   +-- sim-management.json
|   +-- order-management.json
|   +-- authorization.json
|   +-- product-information.json
|   +-- support-management.json
|   +-- 1nce-os.json
|
+-- src/
|   +-- css/
|   |   +-- custom.css             # 1NCE brand overrides (colors, fonts, dark mode)
|   +-- pages/
|   |   +-- index.tsx              # Landing page (optional, could redirect to /docs)
|   +-- components/                # Any custom React components
|
+-- static/
|   +-- img/                       # All migrated images
|   +-- fonts/                     # Custom brand fonts (if any)
|
+-- scripts/
|   +-- convert-readme-blocks.ts   # Magic block -> admonition converter
|   +-- fix-image-paths.ts         # Image path rewriter
|   +-- generate-sidebars.ts       # Auto-generate sidebar from _order.yaml files
|
+-- .github/
    +-- workflows/
        +-- deploy.yml             # Build + S3 sync + CF invalidate
```

## Patterns to Follow

### Pattern 1: Multiple Docs Plugin Instances for Tab Navigation

**What:** Docusaurus supports multiple instances of the `@docusaurus/plugin-content-docs` plugin. Each instance gets its own content directory, sidebar, and URL prefix. This is how you create the five-tab navigation where each tab has an independent sidebar.

**When:** Always -- this is the core architectural pattern for this project.

**Example:**
```typescript
// docusaurus.config.ts
const config: Config = {
  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'platform',
        path: 'docs/platform',
        routeBasePath: 'platform',
        sidebarPath: './sidebars-platform.ts',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'blueprints',
        path: 'docs/blueprints',
        routeBasePath: 'blueprints',
        sidebarPath: './sidebars-blueprints.ts',
      },
    ],
  ],
  presets: [
    [
      'classic',
      {
        docs: {
          // Default instance handles main "Documentation" tab
          sidebarPath: './sidebars-docs.ts',
          routeBasePath: 'docs',
        },
      },
    ],
  ],
};
```

### Pattern 2: OpenAPI Plugin as Separate Docs Instance

**What:** The `docusaurus-openapi-docs` plugin acts as another docs plugin instance, generating its own MDX pages and sidebar from OpenAPI specs. Configure it to handle all 6 specs under the "API Explorer" tab.

**When:** For the API Explorer tab.

**Example:**
```typescript
// docusaurus.config.ts
plugins: [
  [
    'docusaurus-plugin-openapi-docs',
    {
      id: 'api',
      docsPluginId: 'api',
      config: {
        simManagement: {
          specPath: 'openapi/sim-management.json',
          outputDir: 'docs/api/sim-management',
          sidebarOptions: { groupPathsBy: 'tag' },
        },
        orderManagement: {
          specPath: 'openapi/order-management.json',
          outputDir: 'docs/api/order-management',
          sidebarOptions: { groupPathsBy: 'tag' },
        },
        // ... remaining 4 specs
      },
    },
  ],
],
themes: ['docusaurus-theme-openapi-docs'],
```

### Pattern 3: Automated Sidebar Generation from _order.yaml

**What:** The ReadMe.com export includes `_order.yaml` files at every directory level that define the intended navigation order. Write a one-time script that reads these YAML files and generates Docusaurus sidebar configuration objects, preserving the original hierarchy.

**When:** During content conversion phase. Run once, then maintain sidebars manually.

**Why:** 122 pages across deeply nested categories makes manual sidebar construction error-prone. The `_order.yaml` files are the source of truth for original ordering.

### Pattern 4: CloudFront Function for SPA Routing

**What:** Docusaurus generates directories like `/docs/introduction/index.html`. When a user navigates to `/docs/introduction`, S3 returns a 403 because there is no object at that exact key. A CloudFront Function on viewer-request appends `/index.html` to paths that lack a file extension.

**When:** Always required for Docusaurus on CloudFront/S3.

**Example:**
```javascript
function handler(event) {
  var request = event.request;
  var uri = request.uri;
  if (uri.endsWith('/')) {
    request.uri += 'index.html';
  } else if (!uri.includes('.')) {
    request.uri += '/index.html';
  }
  return request;
}
```

## Anti-Patterns to Avoid

### Anti-Pattern 1: Single Sidebar for All Tabs

**What:** Putting all 120+ pages into one giant sidebar and using category nesting to simulate tabs.
**Why bad:** Docusaurus sidebar becomes unwieldy. Navigation feels wrong -- clicking a different navbar tab should give a completely fresh sidebar, not scroll to a different section of the same sidebar. Multiple docs instances is the correct Docusaurus pattern for this.
**Instead:** Use multiple plugin instances (Pattern 1 above).

### Anti-Pattern 2: Manually Crafting All Sidebar Entries

**What:** Hand-writing 122 sidebar entries by inspecting each file.
**Why bad:** Tedious, error-prone, will drift from source content. The `_order.yaml` files already encode the correct hierarchy.
**Instead:** Script the initial sidebar generation from `_order.yaml` files (Pattern 3).

### Anti-Pattern 3: Storing Generated API Docs in Git

**What:** Committing the MDX files generated by `docusaurus gen-api-docs` to the repository.
**Why bad:** They are derived artifacts from the OpenAPI specs. Committing them creates merge conflicts and stale content when specs update.
**Instead:** Run `gen-api-docs` as a CI build step (before `npm run build`). Keep only the OpenAPI JSON specs in git. Add the generated output directory to `.gitignore`.

**CAVEAT:** The docusaurus-openapi-docs plugin documentation actually recommends committing generated files for simpler setups. For a team project with CI/CD, generating in CI is cleaner. Evaluate based on team preference -- either approach works. The key is consistency.

### Anti-Pattern 4: Using S3 Website Hosting Endpoint

**What:** Enabling S3 static website hosting and pointing CloudFront to the website endpoint.
**Why bad:** The website endpoint does not support HTTPS between CloudFront and S3, and requires the bucket to be public. Origin Access Control (OAC) is more secure and only works with the S3 REST API endpoint.
**Instead:** Use S3 REST API endpoint as CloudFront origin with OAC. Handle routing via CloudFront Function.

## Key Architectural Decisions

### Decision 1: How Many Docs Plugin Instances?

The current site has 5 navbar tabs. The mapping to Docusaurus instances:

| Navbar Tab | Docusaurus Mechanism |
|------------|---------------------|
| Documentation | Default docs instance (from `preset-classic`) |
| API Explorer | `docusaurus-plugin-openapi-docs` + dedicated docs instance |
| 1NCE Platform | Additional `plugin-content-docs` instance |
| Blueprints & Examples | Additional `plugin-content-docs` instance |
| Terms & Abbreviations | Single page -- could be a standalone page or minimal docs instance |

**Recommendation:** 3 docs instances + 1 OpenAPI plugin instance + 1 standalone page. The "Terms & Abbreviations" content in the export is a single custom page (`terms-abbreviations.md`) -- it does not need its own docs instance. Render it as a standalone page or fold it into the main docs instance.

### Decision 2: Content Directory Organization

Two valid approaches:

**Option A -- Flat (recommended):** Keep content directories at project root level, matching Docusaurus convention.
```
docs/          -> main Documentation tab
docs-platform/ -> 1NCE Platform tab
docs-blueprints/ -> Blueprints tab
```

**Option B -- Nested:** All content under a single `docs/` with subdirectories.
```
docs/main/
docs/platform/
docs/blueprints/
```

Option A is simpler to configure and matches what most multi-instance Docusaurus projects use.

### Decision 3: Recipes (Custom Pages with Hardware Guides)

The export contains a `/recipes/` directory with 38 hardware-specific AT command tutorials (SIM7000G, EC25, SARA-R410M, etc.) and a `/custom_pages/` directory with device landing pages. These map to the existing "Blueprints & Examples" tab combined with device-specific sub-navigation.

**Recommendation:** Merge recipes into the Blueprints & Examples docs instance. The device landing pages from `custom_pages/` become category index pages.

### Decision 4: Custom Pages (HTML files)

The export includes two HTML custom pages (`ai-support-agent.html`, `ai-support-agent-brazil.html`). These are out of scope per PROJECT.md (AI Assistant deferred). Skip these during migration.

## Scalability Considerations

| Concern | Current State (122 pages) | At 500 pages | At 2000+ pages |
|---------|---------------------------|--------------|----------------|
| Build time | ~30-60s | ~2-3 min | Consider build caching, incremental builds |
| S3 sync | Fast (~seconds) | Still fast | Use `--size-only` flag for faster sync |
| CloudFront invalidation | Wildcard `/*` is fine | Still fine | Path-specific invalidations if cost matters |
| Bundle size | Small | Monitor | Code-split with Docusaurus lazy loading (default) |
| Sidebar nav | Manageable | Need collapsible categories | Auto-collapse, search becomes essential |

Build time is not a concern at 122 pages. Docusaurus handles thousands of pages (the React docs site, for example). The OpenAPI generation step adds ~10-30s per spec depending on endpoint count.

## Suggested Build Order

Components have clear dependencies. Build in this order:

```
Phase 1: Foundation
  +-- Docusaurus project scaffold (npm init, config skeleton)
  +-- Content conversion scripts (magic blocks, images, frontmatter)
  +-- Run conversion on exported content
  |
Phase 2: Navigation & Structure  [depends on Phase 1]
  +-- Multi-sidebar configuration
  +-- Navbar with 5 tabs
  +-- Sidebar generation from _order.yaml
  +-- Verify all 122 pages render and navigate correctly
  |
Phase 3: API Explorer  [depends on Phase 1, parallel with late Phase 2]
  +-- OpenAPI plugin installation and configuration
  +-- Generate API docs from 6 specs
  +-- Verify "Try It" functionality against api.1nce.com
  |
Phase 4: Theming & Polish  [depends on Phases 2-3]
  +-- 1NCE brand CSS (colors, dark mode, fonts, logos)
  +-- Landing page
  +-- Final content QA pass
  |
Phase 5: AWS Deployment  [can start in parallel with Phase 3]
  +-- S3 bucket + CloudFront + ACM + Route 53
  +-- CloudFront Function for SPA routing
  +-- GitHub Actions CI/CD pipeline
  +-- DNS cutover
```

**Critical path:** Phase 1 -> Phase 2 -> Phase 4. The API Explorer (Phase 3) and AWS infra (Phase 5) can be developed in parallel once Phase 1 is complete.

**Riskiest component:** Content conversion scripts (Phase 1). The quality of magic block conversion determines how much manual cleanup is needed. Invest in thorough regex patterns and test against a representative sample of pages before bulk conversion.

## Sources

- Docusaurus documentation: Docs Multi-instance pattern (docs.docusaurus.io)
- Docusaurus documentation: Multiple Sidebars (docs.docusaurus.io)
- PaloAltoNetworks/docusaurus-openapi-docs GitHub repository
- AWS CloudFront + S3 static hosting architecture (AWS docs)
- Exported content analysis from `/dev-hub-v2.6-2026-03-20T20-39-14_8a4df1b/`
- Migration guide prepared by Manus AI (included in project root)
