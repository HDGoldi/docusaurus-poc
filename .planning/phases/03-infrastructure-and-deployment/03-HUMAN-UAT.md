---
status: partial
phase: 03-infrastructure-and-deployment
source: [03-VERIFICATION.md]
started: 2026-03-21T00:00:00Z
updated: 2026-03-21T00:00:00Z
---

## Current Test

[awaiting human testing]

## Tests

### 1. Deploy CloudFormation stack and confirm https://help.1nce.com loads
expected: Stack deploys successfully, site loads with valid SSL certificate at help.1nce.com
result: [pending]

### 2. Merge to main and observe the production approval gate
expected: Push to main triggers validate job, then deploy-production waits for manual approval via GitHub environment protection rule
result: [pending]

### 3. Open a PR and verify preview comment + cleanup on close
expected: PR triggers preview deploy to S3, bot comments with preview URL; closing PR triggers cleanup-preview workflow that deletes preview files
result: [pending]

### 4. Access a deep-link URL directly (e.g. help.1nce.com/docs/1nce-os/1nce-os-overview)
expected: CloudFront Function rewrites the URI and serves the correct page (SPA routing works against live distribution)
result: [pending]

## Summary

total: 4
passed: 0
issues: 0
pending: 4
skipped: 0
blocked: 0

## Gaps
