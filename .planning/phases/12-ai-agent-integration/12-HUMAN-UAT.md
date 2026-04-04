---
status: partial
phase: 12-ai-agent-integration
source: [12-VERIFICATION.md]
started: 2026-04-04T13:10:00Z
updated: 2026-04-04T13:10:00Z
---

## Current Test

[awaiting human testing]

## Tests

### 1. Live URL Response Headers
expected: After deploy, `curl -I https://help.1nce.com/.well-known/skills/default/skill.md` returns `Content-Type: text/markdown; charset=utf-8`
result: [pending]

### 2. npx skills add Discovery
expected: Running `npx skills add https://help.1nce.com/.well-known/skills/` discovers and installs the "1NCE API" skill from index.json
result: [pending]

### 3. CloudFront .well-known Passthrough
expected: Visiting `https://help.1nce.com/.well-known/skills/index.json` returns JSON index (not 403, 404, or HTML redirect)
result: [pending]

## Summary

total: 3
passed: 0
issues: 0
pending: 3
skipped: 0
blocked: 0

## Gaps
