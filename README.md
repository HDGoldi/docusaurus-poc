1NCE Developer Hub (Docusaurus PoC)
===================================
Project overview
This repository contains the migration of the 1NCE Developer Hub from ReadMe.com to a self-hosted Docusaurus site.
The goal is to preserve the existing developer experience on `help.1nce.com` while reducing SaaS dependency and keeping all docs and API references in source control.
What this project includes
- Multi-section docs site built with Docusaurus 3 and TypeScript.
- OpenAPI-powered API Explorer pages generated from multiple specs.
- Documentation content split into product docs, platform guides, blueprints/examples, terms, and API reference.
- Frontend chat widget components and AWS Lambda chat handler scaffolding.
- Migration and content-processing scripts for converting and organizing docs.
- AWS deployment artifacts for S3 + CloudFront hosting.
Repository structure
- `docs/`: Documentation source content organized by section.
- `specs/`: OpenAPI source files used to generate API docs.
- `sidebars/`: Sidebar configuration for each docs section.
- `src/`: Docusaurus pages/components, styles, and chat widget UI.
- `lambda/chat-handler/`: Lambda code for chat backend integration.
- `scripts/`: Content conversion, reorganization, and utility scripts.
- `infra/`: Infrastructure templates and CloudFront function artifacts.
- `docusaurus.config.ts`: Main site and plugin configuration.
Local development
Prerequisites:
- Node.js 20+
- npm
Install dependencies:
```bash
npm ci
```
Start the local docs site:
```bash
npm start
```
Create a production build:
```bash
npm run build
npm run serve
```
Key npm scripts
- `npm start`: Run local development server.
- `npm run build`: Build static site output.
- `npm run typecheck`: Run TypeScript checks.
- `npm run convert:pipeline`: Run the full docs conversion pipeline.
- `npm run convert:redirects`: Generate redirect map for migrated URLs.
Deployment intent
The target runtime architecture is AWS S3 + CloudFront, serving the Developer Hub at `help.1nce.com`.
A smoke test helper is available at `scripts/smoke-test.sh` to validate key routes after deployment.
