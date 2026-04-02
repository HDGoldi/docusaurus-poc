# Product Overview

The 1NCE Developer Hub is the public-facing documentation site for 1NCE, an IoT cellular connectivity provider. It serves as the primary developer resource at `help.1nce.com`.

## What it covers

- Product documentation for 1NCE connectivity services (data, SMS, VPN, SIM cards)
- 1NCE OS platform services (device authenticator, controller, integrator, inspector, locator, energy saver, LWM2M, cloud integrator, plugins)
- 1NCE Portal guides (dashboard, SIM management, configuration, accounts)
- API Explorer with interactive OpenAPI-generated reference docs
- Hardware blueprints and examples for IoT modules (Quectel, SIMCom, u-blox)
- Terms and abbreviations glossary
- An AI chat widget for developer Q&A (backed by AWS Bedrock + RAG)

## Origin

This site was migrated from ReadMe.com to a self-hosted Docusaurus setup. Legacy content conversion scripts exist in `scripts/` and the original export lives in `old_devhub/`. These are historical artifacts — new content is authored directly in `docs/`.

## Deployment target

Production: AWS S3 + CloudFront at `help.1nce.com`
Preview: per-PR deployments to a separate S3 bucket/CloudFront distribution
