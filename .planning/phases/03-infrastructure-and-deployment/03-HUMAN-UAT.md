---
status: partial
phase: 03-infrastructure-and-deployment
source: [03-VERIFICATION.md]
started: 2026-03-21T00:00:00Z
updated: 2026-03-21T01:00:00Z
---

## Current Test

[testing paused — 4 items outstanding]

## Tests

### 1. Deploy CloudFormation stack and confirm https://help.1nce.com loads
expected: Stack deploys successfully, site loads with valid SSL certificate at help.1nce.com
result: skipped

### 2. Merge to main and observe the production approval gate
expected: Push to main triggers validate job, then deploy-production waits for manual approval via GitHub environment protection rule
result: skipped

### 3. Open a PR and verify preview comment + cleanup on close
expected: PR triggers preview deploy to S3, bot comments with preview URL; closing PR triggers cleanup-preview workflow that deletes preview files
result: skipped

### 4. Access a deep-link URL directly (e.g. help.1nce.com/docs/1nce-os/1nce-os-overview)
expected: CloudFront Function rewrites the URI and serves the correct page (SPA routing works against live distribution)
result: blocked
blocked_by: server
reason: "Infrastructure not yet deployed"

## Summary

total: 4
passed: 0
issues: 0
pending: 0
skipped: 3
blocked: 1

## Gaps
