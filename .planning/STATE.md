---
gsd_state_version: 1.0
milestone: v1.1
milestone_name: AI Assistant + GitHub Pages Preview
status: Phase complete — ready for verification
stopped_at: Completed 07-01-PLAN.md
last_updated: "2026-03-23T17:42:36.530Z"
progress:
  total_phases: 4
  completed_phases: 4
  total_plans: 6
  completed_plans: 6
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-21)

**Core value:** Developers can browse all existing documentation and interactively test API endpoints exactly as they can on the current ReadMe.com-hosted site.
**Current focus:** Phase 07 — ci-cd-integration

## Current Position

Phase: 07 (ci-cd-integration) — EXECUTING
Plan: 1 of 1

## Performance Metrics

**Velocity:**

- Total plans completed: 0 (v1.1)
- Average duration: —
- Total execution time: —

## Accumulated Context

### Decisions

- S3 Vectors chosen over OpenSearch Serverless (cost: ~$350/mo too expensive for docs assistant)
- Lambda Function URL over API Gateway (single endpoint, no auth, free)
- GitHub Pages as preview deployment (independent of AWS production)
- [Phase 04]: DEPLOY_TARGET env var controls build config (gh-pages vs production)
- [Phase 04]: Separate workflow file (gh-pages.yml) keeps GitHub Pages deploy independent of AWS pipeline
- [Phase 05]: Regex fallback for MDX stripping when remark-mdx parser fails on HTML comments
- [Phase 05]: Skip docs/api/ directory (126 generated MDX) -- extract API content from specs/*.json directly
- [Phase 05]: Two-region CloudFormation: eu-central-1 for Bedrock+Lambda, us-east-1 for CloudFront+WAF
- [Phase 05]: Claude 3 Haiku default model (4.5 not yet available in eu-central-1), configurable via ModelArn parameter
- [Phase 05]: WAF rate limit: 10 req/60s per IP using EvaluateWindowSec for precise 1-minute windows
- [Phase 06]: Root.tsx swizzle pattern for global chat widget injection
- [Phase 06]: POST-based SSE with ReadableStream (EventSource only supports GET)
- [Phase 06]: CSS Modules with Infima variables for dark mode (no styled-components)
- [Phase 07]: List-style CloudFormation Tags for Bedrock KnowledgeBase (consistent format across all resources)

### Pending Todos

None.

### Blockers/Concerns

- Bedrock model access (Claude Sonnet 4 + Titan Embeddings V2) must be enabled in target region before Phase 5
- S3 Vectors is newer AWS service — verify API compatibility with Bedrock KB during Phase 5 planning

## Session Continuity

Last session: 2026-03-23T17:42:36.528Z
Stopped at: Completed 07-01-PLAN.md
Resume file: None
