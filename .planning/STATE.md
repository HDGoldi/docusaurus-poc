---
gsd_state_version: 1.0
milestone: v1.1
milestone_name: AI Assistant + GitHub Pages Preview
status: unknown
stopped_at: Completed 05-01-PLAN.md
last_updated: "2026-03-23T08:05:40.445Z"
progress:
  total_phases: 4
  completed_phases: 1
  total_plans: 4
  completed_plans: 2
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-21)

**Core value:** Developers can browse all existing documentation and interactively test API endpoints exactly as they can on the current ReadMe.com-hosted site.
**Current focus:** Phase 05 — ai-backend-and-content-pipeline

## Current Position

Phase: 05 (ai-backend-and-content-pipeline) — EXECUTING
Plan: 2 of 3

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

### Pending Todos

None.

### Blockers/Concerns

- Bedrock model access (Claude Sonnet 4 + Titan Embeddings V2) must be enabled in target region before Phase 5
- S3 Vectors is newer AWS service — verify API compatibility with Bedrock KB during Phase 5 planning

## Session Continuity

Last session: 2026-03-23T08:05:40.443Z
Stopped at: Completed 05-01-PLAN.md
Resume file: None
