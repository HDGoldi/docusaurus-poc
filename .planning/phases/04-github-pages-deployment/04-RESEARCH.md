# Phase 4: GitHub Pages Deployment - Research

**Researched:** 2026-03-21
**Domain:** Docusaurus GitHub Pages deployment, GitHub Actions, environment-aware config
**Confidence:** HIGH

## Summary

Phase 4 adds a GitHub Pages deployment as a lightweight preview environment. The existing Docusaurus site already builds and deploys to AWS (S3 + CloudFront) via `deploy.yml`. This phase adds a separate `gh-pages.yml` workflow that builds the same codebase with different `url`/`baseUrl` values and deploys using GitHub's native Pages actions. The config changes are minimal: environment-variable-driven switching in `docusaurus.config.ts` and conditional analytics inclusion.

The modern GitHub Pages deployment uses `actions/upload-pages-artifact@v3` + `actions/deploy-pages@v4` (no `gh-pages` branch needed). This is the approach recommended by Docusaurus official docs. The key technical challenge is ensuring all internal links, static assets, and API Explorer pages work correctly under the `/docusaurus-poc/` base path.

**Primary recommendation:** Use `DEPLOY_TARGET` env var to switch config at build time. Keep the workflow simple -- build + upload artifact + deploy. Conditionally omit analytics tags for GitHub Pages builds.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** GitHub Pages deploys on every push to main, alongside the existing AWS deploy. Both stay in sync automatically.
- **D-02:** Analytics (GTM, PostHog, SimpleAnalytics) are disabled on GitHub Pages builds. Only production (help.1nce.com) tracks analytics. This keeps production data clean.
- **D-03:** GitHub Pages deploy uses a separate workflow file (e.g., `gh-pages.yml`), not added to the existing `deploy.yml`. Keeps concerns isolated and satisfies CICD-02 (existing AWS workflow unchanged).
- **D-04:** Environment-aware `docusaurus.config.ts` uses a `DEPLOY_TARGET` env var (or similar) to switch between production (`url: 'https://help.1nce.com'`, `baseUrl: '/'`) and GitHub Pages (`url: 'https://hdgoldi.github.io'`, `baseUrl: '/docusaurus-poc/'`).

### Claude's Discretion
- Exact env var naming and config structure
- Whether to conditionally include analytics scripts or use a separate config section
- `.nojekyll` already exists in `static/` -- no action needed
- `trailingSlash` setting for GitHub Pages compatibility

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| DEPLOY-01 | Site builds with environment-aware config (GitHub Pages baseUrl vs AWS root) | Environment-variable config pattern in docusaurus.config.ts; `DEPLOY_TARGET` env var switching `url`/`baseUrl`/analytics |
| DEPLOY-02 | GitHub Actions workflow deploys to GitHub Pages on push to main | Separate `gh-pages.yml` workflow using `actions/upload-pages-artifact@v3` + `actions/deploy-pages@v4`; requires `pages: write` and `id-token: write` permissions |
| DEPLOY-03 | All existing pages and API docs render correctly on GitHub Pages | `trailingSlash: true` recommended for GitHub Pages; all internal links respect `baseUrl` via Docusaurus routing; API Explorer pages use relative paths |
</phase_requirements>

## Standard Stack

### Core (already installed -- no new dependencies)

| Technology | Version | Purpose | Why Standard |
|------------|---------|---------|--------------|
| Docusaurus | 3.9.2 | Static site generator | Already installed. Config supports env-var-driven values natively (it's a TypeScript file). |
| actions/upload-pages-artifact | v3 | Upload build output for Pages | Official GitHub action for Pages artifact upload. Pairs with deploy-pages. |
| actions/deploy-pages | v4 | Deploy to GitHub Pages | Official GitHub action. Uses OIDC (id-token), no PAT or deploy key needed. Latest: v4.0.5. |
| actions/checkout | v4 | Checkout repo | Already used in deploy.yml. |
| actions/setup-node | v4 | Setup Node.js | Already used in deploy.yml. |

### No New Dependencies

This phase requires zero new npm packages. All changes are in config and workflow files.

## Architecture Patterns

### Config Strategy: Environment-Variable Switching

The `docusaurus.config.ts` file is TypeScript executed at build time. Use `process.env.DEPLOY_TARGET` to switch values.

**Recommended env var:** `DEPLOY_TARGET` with values `'gh-pages'` or unset (defaults to production).

```typescript
// At top of docusaurus.config.ts
const isGitHubPages = process.env.DEPLOY_TARGET === 'gh-pages';

const config: Config = {
  // ...
  url: isGitHubPages ? 'https://hdgoldi.github.io' : 'https://help.1nce.com',
  baseUrl: isGitHubPages ? '/docusaurus-poc/' : '/',
  trailingSlash: true, // Important for GitHub Pages compatibility
  // ...
};
```

### Analytics Conditional Pattern

Analytics tags (headTags, scripts, clientModules) should be conditionally included based on the deploy target.

```typescript
const isGitHubPages = process.env.DEPLOY_TARGET === 'gh-pages';

const config: Config = {
  // ...
  headTags: isGitHubPages ? [] : [
    // GTM script tag...
    // PostHog script tag...
  ],
  scripts: isGitHubPages ? [] : [
    // SimpleAnalytics...
  ],
  clientModules: isGitHubPages ? [] : ['./src/clientModules/routeTracking.ts'],
  // ...
};
```

This is cleaner than conditional logic inside each tag object. The `routeTracking.ts` client module pushes to GTM dataLayer, so it should also be excluded when analytics are disabled.

### GitHub Pages Workflow Structure

```yaml
# .github/workflows/gh-pages.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - name: Build for GitHub Pages
        env:
          DEPLOY_TARGET: gh-pages
        run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: build

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

### Key Details

1. **Permissions:** `pages: write` and `id-token: write` at job level (deploy job). `contents: read` at workflow level.
2. **Concurrency:** `cancel-in-progress: true` prevents stale deployments from queuing.
3. **Environment:** The `github-pages` environment is auto-created by GitHub when Pages is enabled.
4. **No gh-pages branch:** The modern approach uses artifacts, not a deployment branch. No `gh-pages` branch needed.

### Repository Settings Required

GitHub Pages must be configured in the repository settings:
- Settings > Pages > Source: "GitHub Actions" (not "Deploy from a branch")
- This is a one-time manual step.

### Anti-Patterns to Avoid
- **Do not modify `deploy.yml`:** Decision D-03 requires a separate workflow. The existing AWS pipeline must remain untouched.
- **Do not use `docusaurus deploy` command:** This is the old GH Pages deployment method using `gh-pages` branch. Use the actions-based approach instead.
- **Do not create a `gh-pages` branch:** The modern artifacts-based deployment does not need it.
- **Do not use separate config files:** A single `docusaurus.config.ts` with env-var switching is cleaner than maintaining two config files.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| GitHub Pages deployment | Custom git push to gh-pages branch | `actions/upload-pages-artifact` + `actions/deploy-pages` | Official actions handle OIDC auth, artifact management, and deployment status automatically |
| Base URL rewriting | Post-build sed/replace on HTML files | Docusaurus `baseUrl` config | Docusaurus handles all asset paths, link generation, and routing based on `baseUrl` at build time |
| Conditional config | Separate docusaurus.config.gh-pages.ts | `process.env` in single config file | TypeScript config runs at build time; env vars are the idiomatic way to parameterize |

## Common Pitfalls

### Pitfall 1: Base URL Mismatch in Assets
**What goes wrong:** Static assets (images, CSS, JS) return 404 on GitHub Pages because paths are absolute (`/assets/...`) instead of relative to baseUrl (`/docusaurus-poc/assets/...`).
**Why it happens:** Hardcoded absolute paths in custom CSS, MDX files, or components bypass Docusaurus `baseUrl` handling.
**How to avoid:** Use `useBaseUrl()` hook or `@site` imports in components. Use relative paths in Markdown. Never hardcode `src="/img/..."` -- use `src="img/..."` (relative) or the Docusaurus `require()` pattern.
**Warning signs:** Build succeeds but images/assets are broken on GH Pages while working on production.

### Pitfall 2: trailingSlash Misconfiguration
**What goes wrong:** GitHub Pages serves `/docs/page` as a 404 because the server expects `/docs/page/` (with trailing slash) to serve `index.html`.
**Why it happens:** GitHub Pages (and S3 static hosting) serve directories by looking for `index.html` inside them. Without trailing slashes, the server may not find the file.
**How to avoid:** Set `trailingSlash: true` in Docusaurus config. This applies globally to both deployment targets, which is fine -- AWS CloudFront Function already handles SPA routing. Setting this globally avoids link discrepancies between environments.
**Warning signs:** Pages work on localhost (`docusaurus serve`) but 404 on GitHub Pages.

### Pitfall 3: GitHub Pages Source Not Set to Actions
**What goes wrong:** Workflow runs successfully but no deployment happens. GitHub Pages shows a blank or default page.
**Why it happens:** Repository Settings > Pages > Source is set to "Deploy from a branch" (default) instead of "GitHub Actions".
**How to avoid:** Document the manual setup step: Settings > Pages > Source > GitHub Actions. This is a one-time configuration.
**Warning signs:** Workflow shows green but the Pages URL returns 404.

### Pitfall 4: API Explorer baseUrl Issues
**What goes wrong:** API Explorer "Try It" panel sends requests correctly, but navigation links within API docs are broken.
**Why it happens:** The `docusaurus-plugin-openapi-docs` generates MDX files with internal links. If these links don't account for `baseUrl`, navigation breaks.
**How to avoid:** The OpenAPI plugin respects Docusaurus routing, so `baseUrl` should propagate correctly. Verify by clicking through API endpoint pages on the GH Pages build. The plugin generates links using Docusaurus Link component which handles baseUrl automatically.
**Warning signs:** API page links work on production but break on GH Pages.

### Pitfall 5: Repo Name Casing in baseUrl
**What goes wrong:** Pages deploy but all links 404 because the baseUrl casing does not match the actual GitHub Pages path.
**Why it happens:** GitHub Pages paths are case-sensitive. The repo is `docusaurus-poc` (hyphen, lowercase), so the baseUrl MUST be `/docusaurus-poc/` exactly.
**How to avoid:** Match the repo name exactly. The repo remote is `HDGoldi/docusaurus-poc`, so: `baseUrl: '/docusaurus-poc/'` and `url: 'https://hdgoldi.github.io'` (GitHub lowercases the org name in the Pages URL).
**Warning signs:** Build works but all pages return 404. Check casing first.

## Code Examples

### Environment-Aware Config (Full Pattern)

```typescript
// docusaurus.config.ts
import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const isGitHubPages = process.env.DEPLOY_TARGET === 'gh-pages';

const config: Config = {
  title: '1NCE Developer Hub',
  tagline: 'Documentation for 1NCE IoT connectivity services',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
    experimental_faster: true,
  },

  url: isGitHubPages ? 'https://hdgoldi.github.io' : 'https://help.1nce.com',
  baseUrl: isGitHubPages ? '/docusaurus-poc/' : '/',
  trailingSlash: true,

  // ... rest of config

  headTags: isGitHubPages ? [] : [
    // GTM tag
    // PostHog tag
  ],

  scripts: isGitHubPages ? [] : [
    // SimpleAnalytics
  ],

  clientModules: isGitHubPages ? [] : ['./src/clientModules/routeTracking.ts'],

  // plugins, themes, themeConfig remain unchanged -- no env-specific differences
};

export default config;
```

### GitHub Actions Workflow (Complete)

```yaml
# .github/workflows/gh-pages.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci

      - name: Build for GitHub Pages
        env:
          DEPLOY_TARGET: gh-pages
        run: npm run build

      - uses: actions/upload-pages-artifact@v3
        with:
          path: build

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

## Open Questions

1. **trailingSlash global change**
   - What we know: Setting `trailingSlash: true` globally affects both production and GH Pages builds. Currently it is unset (defaults to `undefined`).
   - What's unclear: Whether the existing AWS CloudFront Function handles trailing slash redirects already, or if changing this could affect existing production URLs.
   - Recommendation: Set `trailingSlash: true` globally. CloudFront Functions typically handle this fine. If production links break, this is easily reverted. Test by building locally with `npm run build && npm run serve` before deploying.

2. **Existing hardcoded absolute paths**
   - What we know: Docusaurus handles most paths via its routing. The OpenAPI plugin generates pages using Docusaurus primitives.
   - What's unclear: Whether any custom components, MDX files, or static references use hardcoded absolute paths like `/img/...`.
   - Recommendation: After first GH Pages build, visually spot-check key pages (homepage, API Explorer, docs pages). Fix any broken assets found.

## Sources

### Primary (HIGH confidence)
- Docusaurus official deployment docs (docusaurus.io/docs/deployment) -- GitHub Pages workflow pattern, config parameters
- GitHub actions/deploy-pages repository -- v4.0.5 latest, required permissions (pages:write, id-token:write)
- Existing codebase (`docusaurus.config.ts`, `deploy.yml`, `package.json`) -- current state, established patterns

### Secondary (MEDIUM confidence)
- GitHub actions/upload-pages-artifact -- v3 current, pairs with deploy-pages v4

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- using official GitHub Actions and existing Docusaurus config capabilities
- Architecture: HIGH -- env-var switching in TypeScript config is well-documented and idiomatic
- Pitfalls: HIGH -- based on direct inspection of the codebase and known GitHub Pages behavior

**Research date:** 2026-03-21
**Valid until:** 2026-04-21 (stable technologies, low churn)
