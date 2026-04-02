# Tech Stack

## Core framework

- Docusaurus 3.9.x (static site generator)
- React 19, TypeScript ~5.6
- Node.js 20+ required
- Package manager: pnpm (declared via `packageManager` field in package.json), though npm scripts are also available

## Key dependencies

- `docusaurus-plugin-openapi-docs` + `docusaurus-theme-openapi-docs` — generates API reference pages from OpenAPI specs in `specs/`
- `docusaurus-plugin-sass` + `sass` — SCSS styling support
- `prism-react-renderer` — code syntax highlighting
- `react-markdown`, `remark-*`, `unified` — markdown processing (used in conversion scripts and chat widget)
- `@mdx-js/react` — MDX support for docs content

## Chat widget backend

- AWS Lambda (`lambda/chat-handler/`) using `@aws-sdk/client-bedrock-agent` for RAG-based chat
- Separate `package.json` and `tsconfig.json` in `lambda/chat-handler/`

## Infrastructure

- AWS CloudFormation (`infra/template.yaml`) — S3, CloudFront, ACM, Route 53, GitHub OIDC
- CloudFront Function for SPA routing (`infra/cf-function.js`)
- RAG content pipeline syncs to S3 for Bedrock knowledge base (`infra/rag-stack.yaml`)

## CI/CD

- GitHub Actions (`.github/workflows/deploy.yml`)
- PR pushes: build → Lighthouse CI → deploy to preview S3 bucket
- Main pushes: build → deploy to prod S3 → CloudFront invalidation → smoke test
- OIDC-based AWS auth (no static credentials)

## Common commands

```bash
# Install dependencies
npm ci

# Local dev server
npm start

# Production build
npm run build

# Serve production build locally
npm run serve

# TypeScript type checking
npm run typecheck

# Run full content conversion pipeline (legacy migration)
npm run convert:pipeline

# Generate redirect map
npm run convert:redirects
```

## Configuration files

- `docusaurus.config.ts` — main site config, plugins, theme, navbar, footer
- `sidebars.ts` — legacy combined sidebar (being replaced by per-section files)
- `sidebars/*.ts` — per-section sidebar configs (api, blueprints, documentation, platform, terms)
- `tsconfig.json` — extends `@docusaurus/tsconfig`, editor-only (not used in compilation)
- `lighthouserc.json` — Lighthouse CI thresholds
