---
gsd_state_version: 1.0
milestone: v1.2
milestone_name: Overall Enhancements & Fixing
status: "Defining requirements"
stopped_at: null
last_updated: "2026-04-02"
progress:
  total_phases: 0
  completed_phases: 0
  total_plans: 0
  completed_plans: 0
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-02)

**Core value:** Developers can browse all existing documentation and interactively test API endpoints exactly as they can on the current ReadMe.com-hosted site.
**Current focus:** Defining requirements for v1.2

## Current Position

Phase: Not started (defining requirements)
Plan: —
Status: Defining requirements
Last activity: 2026-04-02 — Milestone v1.2 started

## Performance Metrics

**Velocity:**

- Total plans completed: 0 (v1.2)
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

None.

## Session Continuity

Last session: 2026-04-02
Stopped at: Milestone v1.2 initialization
Resume file: None
