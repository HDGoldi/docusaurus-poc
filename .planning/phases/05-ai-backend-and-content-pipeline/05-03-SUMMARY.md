---
plan: "05-03"
phase: "05-ai-backend-and-content-pipeline"
status: complete
started: "2026-03-23"
completed: "2026-03-23"
duration: "~5 min"
---

# Plan 05-03: Deployment Scripts

## What Was Built

Deployment scripts that bridge local build artifacts (Plan 01) with AWS infrastructure (Plan 02), completing the content pipeline.

## Key Files

### Created
- `scripts/sync-rag-to-s3.ts` — Uploads .rag-content/chunks/ to S3 with batched PutObjectCommand (20 concurrent), optional `--start-ingestion` flag to trigger Bedrock KB re-indexing
- `scripts/deploy-chat-lambda.sh` — Builds Lambda handler with esbuild, zips, deploys via `aws lambda update-function-code`

### Modified
- `package.json` — Added `@aws-sdk/client-s3` and `@aws-sdk/client-bedrock-agent` as devDependencies

## Decisions

- AWS SDK packages installed as devDependencies (build/deploy-time only, not Lambda runtime)
- S3 keys use `chunks/` prefix matching Bedrock data source InclusionPrefixes config
- Ingestion trigger is opt-in via `--start-ingestion` flag (requires KB_ID + DATA_SOURCE_ID)

## Deviations

None.

## Self-Check: PASSED

- [x] `scripts/sync-rag-to-s3.ts` contains PutObjectCommand and StartIngestionJobCommand
- [x] `scripts/deploy-chat-lambda.sh` contains `aws lambda update-function-code`
- [x] Deploy script is executable (`chmod +x`)
- [x] Bash syntax check passes (`bash -n`)
- [x] S3 SDK import resolves (`npx tsx -e "import { PutObjectCommand } from '@aws-sdk/client-s3'"`)
