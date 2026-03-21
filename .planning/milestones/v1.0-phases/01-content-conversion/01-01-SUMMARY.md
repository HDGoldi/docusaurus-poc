---
phase: 01-content-conversion
plan: 01
subsystem: infra
tags: [docusaurus, typescript, node, gray-matter, glob, migration-pipeline]

requires: []
provides:
  - Buildable Docusaurus 3.9.2 project with @docusaurus/faster
  - 298 markdown files copied to docs/ with normalized folder names
  - ReadMe frontmatter converted to Docusaurus-compatible format
  - Shared utility modules (logger, file-utils, slug-map) for pipeline scripts
affects: [01-02, 01-03, 01-04]

tech-stack:
  added: ["@docusaurus/core@3.9.2", "@docusaurus/faster@3.9.2", "gray-matter@4.0.3", "glob@13.0.6", "js-yaml@4.1.1", "tsx"]
  patterns: ["Multi-step pipeline with numbered scripts", "Shared utils under scripts/utils/"]

key-files:
  created:
    - docusaurus.config.ts
    - sidebars.ts
    - scripts/utils/logger.ts
    - scripts/utils/file-utils.ts
    - scripts/utils/slug-map.ts
    - scripts/01-copy-and-normalize.ts
    - scripts/02-convert-frontmatter.ts
  modified:
    - package.json

key-decisions:
  - "Docusaurus 3.9.2 with experimental_faster (Rspack) for fast builds"
  - "Docs served at root (routeBasePath: '/') with no blog plugin"
  - "Custom pages (hardware guides) from custom_pages/ copied to docs root alongside terms-abbreviations.md"
  - "Reference markdown files copied to docs/reference/ (JSON specs excluded for Phase 2)"

patterns-established:
  - "Pipeline script naming: NN-verb-noun.ts (01-copy-and-normalize.ts, 02-convert-frontmatter.ts)"
  - "Shared utilities at scripts/utils/ with named exports"
  - "npm run convert:* scripts for pipeline steps"

requirements-completed: [CONV-01, CONV-09, CONV-10]

duration: 6min
completed: 2026-03-20
---

# Phase 01 Plan 01: Scaffold and Content Foundation Summary

**Docusaurus 3.9.2 project with Rspack, 298 ReadMe files copied with normalized paths, and frontmatter converted to Docusaurus format**

## Performance

- **Duration:** 6 min
- **Started:** 2026-03-20T21:31:47Z
- **Completed:** 2026-03-20T21:38:35Z
- **Tasks:** 2
- **Files modified:** 387

## Accomplishments
- Docusaurus 3.9.2 scaffolded with @docusaurus/faster (Rspack) and builds cleanly
- 298 markdown files from ReadMe export copied to docs/ with all folder names normalized (lowercase, hyphens)
- ReadMe frontmatter converted: title preserved, excerpt/metadata.description promoted to description, hidden mapped to draft, metadata block removed
- Shared utility modules created: logger.ts, file-utils.ts, slug-map.ts
- Recipes merged under blueprints-examples, terms-abbreviations.md included, AI agent HTML skipped

## Task Commits

Each task was committed atomically:

1. **Task 1: Scaffold Docusaurus project and create shared utility modules** - `403dbf1` (feat)
2. **Task 2: Copy/normalize export content and convert frontmatter** - `f136720` (feat)

## Files Created/Modified
- `docusaurus.config.ts` - 1NCE Developer Hub config with Rspack, docs at root, strict link validation
- `sidebars.ts` - Auto-generated sidebar from docs/ directory
- `package.json` - Dependencies and convert:* npm scripts
- `scripts/utils/logger.ts` - Colored console logging for pipeline scripts
- `scripts/utils/file-utils.ts` - readMarkdownFiles, readFile, writeFile, ensureDir, copyDir
- `scripts/utils/slug-map.ts` - buildSlugMap for ReadMe slug to Docusaurus path mapping
- `scripts/01-copy-and-normalize.ts` - Copies export to docs/ with folder normalization
- `scripts/02-convert-frontmatter.ts` - Converts ReadMe frontmatter to Docusaurus format
- `docs/` - 298 markdown files with normalized paths and converted frontmatter

## Decisions Made
- Used Docusaurus 3.9.2 (latest stable) with experimental_faster for Rspack builds
- Set routeBasePath to '/' so docs are served at site root (no /docs/ prefix)
- Disabled blog plugin (not needed for developer hub)
- Moved onBrokenMarkdownLinks to markdown.hooks to avoid deprecation warning
- Copied custom_pages markdown files (hardware guides) to docs root for inclusion in the site

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Removed default pages to avoid routing conflict**
- **Found during:** Task 1 (Docusaurus scaffold)
- **Issue:** Default src/pages/index.tsx conflicts with docs routeBasePath '/' setting
- **Fix:** Removed src/pages/ directory entirely
- **Files modified:** src/pages/ (deleted)
- **Verification:** Build succeeds without routing conflict
- **Committed in:** 403dbf1 (Task 1 commit)

**2. [Rule 1 - Bug] Fixed onBrokenMarkdownLinks deprecation**
- **Found during:** Task 1 (Build verification)
- **Issue:** onBrokenMarkdownLinks at top level is deprecated in Docusaurus 3.9.2
- **Fix:** Moved to markdown.hooks.onBrokenMarkdownLinks
- **Files modified:** docusaurus.config.ts
- **Verification:** Build produces no deprecation warning for this setting
- **Committed in:** 403dbf1 (Task 1 commit)

**3. [Rule 2 - Missing Critical] Copied custom_pages markdown files**
- **Found during:** Task 2 (Copy and normalize)
- **Issue:** Plan mentioned terms-abbreviations.md but custom_pages also contains hardware guide markdown files (quectel-bg95-m3.md, etc.) that should be part of the docs
- **Fix:** Added logic to copy all .md files from custom_pages/ to docs root
- **Files modified:** scripts/01-copy-and-normalize.ts
- **Verification:** Hardware guide files present in docs/
- **Committed in:** f136720 (Task 2 commit)

---

**Total deviations:** 3 auto-fixed (1 bug, 1 blocking, 1 missing critical)
**Impact on plan:** All auto-fixes necessary for correct build and complete content. No scope creep.

## Issues Encountered
None - both scripts ran successfully on first execution.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Docusaurus project builds cleanly with placeholder content
- All 298 files in docs/ ready for syntax conversion (HTMLBlock, Image, links, tables, admonitions)
- Shared utilities ready for use by subsequent pipeline scripts
- Note: Full build with all 298 files will have MDX parse errors due to unconverted ReadMe syntax - this is expected and will be resolved by plans 01-02 through 01-04

## Known Stubs
None - all files contain real migrated content from the ReadMe export.

## Self-Check: PASSED

All key files verified present. Both task commits (403dbf1, f136720) confirmed in git log.

---
*Phase: 01-content-conversion*
*Completed: 2026-03-20*
