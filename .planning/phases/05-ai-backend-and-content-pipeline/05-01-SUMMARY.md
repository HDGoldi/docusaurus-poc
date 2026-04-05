---
phase: 05-ai-backend-and-content-pipeline
plan: 01
subsystem: content-pipeline
tags: [rag, mdx-stripping, openapi, chunking, bedrock, unified, remark]

# Dependency graph
requires:
  - phase: 02-content-migration
    provides: 293 MDX docs in docs/ and 6 OpenAPI specs in specs/
provides:
  - Build-time script converting MDX docs + OpenAPI specs to pre-chunked plain text with metadata sidecars
  - .rag-content/chunks/ output directory with Bedrock-compatible format
affects: [05-02-infra-bedrock-kb, 05-03-lambda-chat-handler]

# Tech tracking
tech-stack:
  added: [unified, remark-parse, remark-mdx, remark-stringify, unist-util-visit]
  patterns: [remark AST pipeline for MDX stripping, regex fallback for non-standard MDX, Bedrock metadata sidecar format]

key-files:
  created:
    - scripts/prepare-rag-content.ts
    - scripts/prepare-rag-content/types.ts
    - scripts/prepare-rag-content/strip-mdx.ts
    - scripts/prepare-rag-content/chunk-by-headings.ts
    - scripts/prepare-rag-content/extract-openapi.ts
    - scripts/prepare-rag-content/generate-metadata.ts
  modified:
    - .gitignore

key-decisions:
  - "Regex fallback for MDX stripping when remark-mdx parser fails on HTML comments"
  - "Skip docs/api/ directory (126 generated MDX files) -- extract API content from specs/*.json directly"
  - "Flat chunk directory (.rag-content/chunks/) with ID-based naming rather than nested subdirectories"

patterns-established:
  - "Bedrock metadata sidecar: {filename}.txt.metadata.json with metadataAttributes object"
  - "Chunk ID format: docs-{path-segments}-{NNN} for docs, api-{specName}-{operationId} for endpoints"
  - "Content type derivation: api-reference for /api/ paths, glossary for /terms/ paths, guide for everything else"

requirements-completed: [CONTENT-01, CONTENT-02]

# Metrics
duration: 3min
completed: 2026-03-23
---

# Phase 5 Plan 1: RAG Content Pipeline Summary

**Build-time TypeScript pipeline converting 167 MDX docs and 6 OpenAPI specs into 727 pre-chunked plain text files with Bedrock-compatible metadata sidecars**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-23T08:01:46Z
- **Completed:** 2026-03-23T08:04:31Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments
- MDX/JSX stripping via unified/remark AST pipeline with regex fallback for non-standard files
- h2/h3 boundary chunking producing 625 doc chunks from 167 processed docs
- OpenAPI endpoint extraction producing 102 API chunks from 6 specs
- Bedrock-compatible metadata sidecars with url, title, breadcrumb, content_type, category, section_heading

## Task Commits

Each task was committed atomically:

1. **Task 1: Create type definitions and module scaffolding** - `d7602f8` (feat)
2. **Task 2: Build main orchestrator script and run end-to-end** - `1477186` (feat)

## Files Created/Modified
- `scripts/prepare-rag-content.ts` - Main orchestrator: discovers docs/specs, processes, writes chunks + manifest
- `scripts/prepare-rag-content/types.ts` - Chunk, ChunkMetadata, EndpointChunk interfaces
- `scripts/prepare-rag-content/strip-mdx.ts` - MDX/JSX stripping via remark AST with regex fallback
- `scripts/prepare-rag-content/chunk-by-headings.ts` - h2/h3 boundary splitting
- `scripts/prepare-rag-content/extract-openapi.ts` - OpenAPI spec endpoint extraction
- `scripts/prepare-rag-content/generate-metadata.ts` - Metadata sidecar generation with breadcrumb/URL derivation
- `.gitignore` - Added .rag-content/ to prevent committing generated output

## Decisions Made
- Used regex fallback stripping when remark-mdx parser rejects files with HTML comments containing `!` characters (38 blueprint files)
- Skipped 126 generated API MDX files in docs/api/ since they are mostly JSX/base64 -- API content extracted directly from OpenAPI spec JSON instead
- Flat .rag-content/chunks/ directory with ID-based naming for simplicity (Bedrock KB scans all files in data source prefix)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Added regex fallback for MDX files with HTML comments**
- **Found during:** Task 2 (end-to-end run)
- **Issue:** 38 blueprint MDX files contain HTML comments with `!` characters that remark-mdx parser rejects as invalid MDX syntax
- **Fix:** Added fallbackStrip() function using regex to remove JSX, imports, exports, and HTML comments when AST parsing fails
- **Files modified:** scripts/prepare-rag-content/strip-mdx.ts
- **Verification:** Re-run produced 167/167 docs processed with 0 warnings
- **Committed in:** 1477186 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Essential for processing all docs. No scope creep.

## Issues Encountered
None beyond the auto-fixed MDX parsing issue.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- .rag-content/chunks/ directory is ready for S3 upload and Bedrock Knowledge Base ingestion
- manifest.json provides chunk inventory for validation
- Pipeline can be re-run anytime with `npx tsx scripts/prepare-rag-content.ts`

## Self-Check: PASSED

- All 6 created files verified present on disk
- Commit d7602f8 verified in git log
- Commit 1477186 verified in git log
- .gitignore contains .rag-content/

---
*Phase: 05-ai-backend-and-content-pipeline*
*Completed: 2026-03-23*
