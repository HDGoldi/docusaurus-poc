<!-- GSD:project-start source:PROJECT.md -->
## Project

**1NCE Developer Hub Migration (ReadMe.com to Docusaurus)**

A migration of the 1NCE Developer Hub (help.1nce.com) from ReadMe.com to a self-hosted Docusaurus site deployed on AWS (S3 + CloudFront). The site contains ~120-150 documentation pages across five navigation tabs and ~40-50 interactive API endpoints spread across multiple OpenAPI specs. The goal is to replicate the existing experience — including the interactive API Explorer — while eliminating SaaS licensing costs.

**Core Value:** Developers can browse all existing documentation and interactively test API endpoints exactly as they can on the current ReadMe.com-hosted site.

### Constraints

- **Deployment**: Must be AWS S3 + CloudFront — no Vercel/Netlify/GitHub Pages
- **Domain**: Must serve from help.1nce.com
- **Content fidelity**: All existing pages and API endpoints must be present and functional
- **Tech stack**: Docusaurus (latest stable), Node.js, MDX
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

## Recommended Stack
### Core Framework
| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Docusaurus | ^3.7 | Static site generator | Industry standard for developer docs. Built-in MDX, multi-sidebar, dark mode, i18n. Actively maintained by Meta. The only serious contender for this use case. | HIGH |
| React | ^18.x (bundled) | UI framework | Ships with Docusaurus 3.x. No choice needed -- use what Docusaurus bundles. | HIGH |
| Node.js | >=18.0 | Runtime | Docusaurus 3.x requires Node 18+. Use Node 20 LTS for CI/CD stability. | HIGH |
| TypeScript | ^5.x | Type safety for config | Docusaurus supports `docusaurus.config.ts` natively. Use it for config and any custom plugins. | HIGH |
### Interactive API Documentation
| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| docusaurus-plugin-openapi-docs | ^4.x | OpenAPI spec ingestion + MDX page generation | PaloAltoNetworks plugin. The only mature Docusaurus plugin for interactive API docs with "Try It" panels. Reads OpenAPI 3.0/3.1 specs, generates MDX pages with request/response examples and code snippets. Actively maintained. | MEDIUM |
| docusaurus-theme-openapi-docs | ^4.x | API theme components (Try It panel, schemas) | Companion theme for the plugin above. Renders the interactive "Try It" console, schema viewers, and code samples. Must be same major version as the plugin. | MEDIUM |
### Content & Markdown
| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| MDX | v3 (bundled) | Enhanced Markdown | Ships with Docusaurus 3.x. Supports JSX in Markdown for custom components. | HIGH |
| @docusaurus/preset-classic | ^3.7 | Docs + blog + pages preset | Standard preset. Includes docs plugin, blog plugin, theme-classic, sitemap. Use this -- no reason to go custom. | HIGH |
| remark-gfm | (bundled) | GitHub Flavored Markdown | Tables, strikethrough, task lists. Bundled with Docusaurus. | HIGH |
### Content Migration Tooling (Build-time only)
| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Node.js script (custom) | -- | ReadMe magic block conversion | No existing tool handles ReadMe's proprietary `[block:callout]`, `[block:code]`, `[block:image]` syntax to Docusaurus admonitions/MDX. Write a custom Node script using regex/AST transforms. | HIGH |
| gray-matter | ^4.0 | Frontmatter parsing | Parse and transform YAML frontmatter in exported Markdown files. Battle-tested, zero-dependency. | HIGH |
| glob | ^10.x | File discovery | Find all `.md` files in the export directory for batch processing. | HIGH |
### Build & Development
| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| npm | >=9 | Package manager | Ships with Node. Use npm over yarn -- Docusaurus docs default to npm, fewer lockfile issues in CI. | MEDIUM |
| @docusaurus/faster | ^3.7 | Rspack-based bundler | Drop-in replacement for default Webpack bundler. 2-5x faster builds. Docusaurus officially supports it as of 3.6+. Worth using given ~150 pages + API spec generation. | MEDIUM |
### Deployment & Infrastructure
| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| AWS S3 | -- | Static file hosting | Project requirement. Host the `build/` output as a static website. | HIGH |
| AWS CloudFront | -- | CDN + HTTPS termination | Project requirement. Use Origin Access Control (OAC) to restrict S3 access. | HIGH |
| AWS Certificate Manager (ACM) | -- | SSL certificate | Free SSL for help.1nce.com. Must be in us-east-1 for CloudFront. | HIGH |
| AWS Route 53 | -- | DNS management | Point help.1nce.com to CloudFront distribution. | HIGH |
| CloudFront Function | -- | SPA routing | Rewrite requests to `/index.html` for client-side routing. Cheaper than Lambda@Edge for simple rewrites. | HIGH |
### CI/CD
| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| GitHub Actions | -- | CI/CD pipeline | Project requirement (implied by GitHub). Build on push to main, deploy to S3, invalidate CloudFront. | HIGH |
| aws-actions/configure-aws-credentials | v4 | OIDC auth for AWS | Keyless authentication. No stored AWS secrets -- uses GitHub OIDC provider + IAM role. Industry best practice. | HIGH |
| aws-actions/amazon-s3-deploy or aws CLI | -- | S3 sync | `aws s3 sync build/ s3://bucket --delete` in the workflow. Simple and reliable. | HIGH |
### Theming & Customization
| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| @docusaurus/theme-classic | ^3.7 (bundled) | Base theme | Included in preset-classic. Swizzle specific components for 1NCE branding. | HIGH |
| CSS custom properties | -- | Brand theming | Docusaurus uses CSS custom properties (`--ifm-*` tokens) for theming. Override in `custom.css` for 1NCE navy/teal palette. No CSS-in-JS library needed. | HIGH |
| Infima | (bundled) | CSS framework | Docusaurus's built-in CSS framework. Theme via CSS variables, do not fight it with Tailwind or similar. | HIGH |
## Alternatives Considered
| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| SSG Framework | Docusaurus 3.x | Starlight (Astro) | Starlight is excellent but lacks a mature interactive API docs plugin equivalent to docusaurus-openapi-docs. The "Try It" panel is a hard requirement. |
| SSG Framework | Docusaurus 3.x | MkDocs (Material) | Python ecosystem. No native interactive API explorer comparable to docusaurus-openapi-docs. |
| SSG Framework | Docusaurus 3.x | Mintlify | SaaS -- defeats the purpose of migrating off ReadMe.com SaaS. |
| API Docs Plugin | docusaurus-openapi-docs | Redocly/Redoc | Redoc is read-only (no "Try It" panel in the free tier). Redocly Pro is paid SaaS. |
| API Docs Plugin | docusaurus-openapi-docs | Swagger UI embed | Clunky iframe-based integration. Poor theming. Not native Docusaurus pages. |
| API Docs Plugin | docusaurus-openapi-docs | Stoplight Elements | React component but not a Docusaurus plugin. Would require significant custom integration for multi-spec, sidebar generation, MDX pages. |
| Package Manager | npm | yarn/pnpm | npm is the Docusaurus default. Lower friction for contributors. pnpm is faster but adds complexity for no meaningful gain on a docs site. |
| CSS Framework | Infima (built-in) | Tailwind CSS | Fighting Infima with Tailwind creates maintenance burden. Docusaurus theming via CSS custom properties is sufficient and idiomatic. |
| Hosting | S3 + CloudFront | Vercel/Netlify | Project constraint -- must be AWS. |
| Build Bundler | @docusaurus/faster (Rspack) | Default Webpack | With ~150 pages + generated API pages, build times matter. Rspack is 2-5x faster and officially supported. |
| Migration Tool | Custom Node script | readme-to-docusaurus | No mature, maintained tool exists for ReadMe magic block conversion. The holistics/readme-exporter handles export but not format conversion. |
## What NOT to Use
| Technology | Why Not |
|------------|---------|
| Tailwind CSS | Conflicts with Infima. Docusaurus theming is done via CSS custom properties -- adding Tailwind creates two competing styling systems. |
| Storybook | Overkill for a docs site. No custom component library that needs isolated development. |
| Next.js | Not a docs framework. Docusaurus provides docs-specific features (sidebars, versioning, search) out of the box. |
| Docker | Unnecessary for a static site. S3 + CloudFront is simpler, cheaper, and faster. |
| Terraform/CDK for v1 | Over-engineering for initial deployment. Use AWS CLI/console for the 5-6 resources needed. Can add IaC later if needed. |
| Algolia DocSearch | Explicitly out of scope for v1. Requires application approval process. Defer to post-launch. |
| any CMS (Contentful, Sanity) | Content lives in Git as MDX files. Adding a CMS adds complexity with no benefit for a developer docs site. |
| Docusaurus v2 | End of life. v3 is the current stable line. |
## Installation
# Scaffold Docusaurus project
# Core dependencies (installed by scaffold)
# @docusaurus/core, @docusaurus/preset-classic, react, react-dom
# Interactive API docs
# Faster builds (optional but recommended)
# Migration tooling (dev dependencies)
## Key Configuration Decisions
### Multiple Sidebars
### Multiple OpenAPI Specs
### CloudFront Function for SPA Routing
## Version Verification Checklist
| Package | Expected | Verify With |
|---------|----------|-------------|
| @docusaurus/core | ^3.7.x | `npm view @docusaurus/core version` |
| docusaurus-plugin-openapi-docs | ^4.x | `npm view docusaurus-plugin-openapi-docs version` |
| docusaurus-theme-openapi-docs | ^4.x | `npm view docusaurus-theme-openapi-docs version` |
| @docusaurus/faster | ^3.7.x | `npm view @docusaurus/faster version` |
| Node.js | 20 LTS | `node --version` |
## Sources
- Docusaurus official documentation (docusaurus.io) -- HIGH confidence
- PaloAltoNetworks/docusaurus-openapi-docs GitHub repository -- MEDIUM confidence (version numbers may have advanced)
- AWS documentation for S3, CloudFront, ACM, Route 53 -- HIGH confidence
- GitHub Actions aws-actions documentation -- HIGH confidence
- Training data knowledge (May 2025 cutoff) -- used as basis, flagged where verification needed
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->

## Skill routing

When the user's request matches an available skill, ALWAYS invoke it using the Skill
tool as your FIRST action. Do NOT answer directly, do NOT use other tools first.
The skill has specialized workflows that produce better results than ad-hoc answers.

Key routing rules:
- Product ideas, "is this worth building", brainstorming → invoke office-hours
- Bugs, errors, "why is this broken", 500 errors → invoke investigate
- Ship, deploy, push, create PR → invoke ship
- QA, test the site, find bugs → invoke qa
- Code review, check my diff → invoke review
- Update docs after shipping → invoke document-release
- Weekly retro → invoke retro
- Design system, brand → invoke design-consultation
- Visual audit, design polish → invoke design-review
- Architecture review → invoke plan-eng-review
