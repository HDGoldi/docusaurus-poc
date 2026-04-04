---
phase: 11-llm-discoverability
plan: "01"
subsystem: build-pipeline
tags: [llms-txt, seo, ai-discoverability, docusaurus-plugin]
dependency_graph:
  requires: []
  provides: [llms-txt-generation, llms-txt-template]
  affects: [docusaurus.config.ts, build-output]
tech_stack:
  added: []
  patterns: [postBuild-plugin, template-injection, frontmatter-scanning]
key_files:
  created:
    - static/llms-template.txt
    - plugins/llms-txt-plugin.ts
  modified:
    - docusaurus.config.ts
decisions:
  - Used HTML comment markers (<!-- LINKS:section-name -->) for template placeholder syntax
  - API spec links hardcoded to 6 landing page routes (not dynamically discovered)
  - gray-matter used for frontmatter parsing (already a project dependency)
metrics:
  duration: 198s
  completed: "2026-04-04"
  tasks_completed: 3
  tasks_total: 3
---

# Phase 11 Plan 01: llms.txt Generation Summary

Build-time llms.txt generation via custom Docusaurus postBuild plugin with product-first organization, hand-curated template, and auto-generated link sections from doc frontmatter.

## What Was Built

A two-part system for generating `llms.txt` following the llmstxt.org specification:

1. **Template file** (`static/llms-template.txt`): Hand-curated llmstxt.org-compliant structure with H1 title, detailed blockquote preamble covering both 1NCE Connect and 1NCE OS product lines, three H2 sections (1NCE Connect, 1NCE OS, API Reference), H3 sub-headings per D-03 section mapping, and 11 placeholder markers for link injection.

2. **Build plugin** (`plugins/llms-txt-plugin.ts`): Custom Docusaurus plugin implementing `postBuild` lifecycle hook that reads the template, scans all 166 doc source files for frontmatter metadata using gray-matter, generates sorted markdown link lists organized by product section, generates 6 API spec landing page links, replaces all placeholder markers, and writes the final `build/llms.txt`.

3. **Plugin registration**: Added to `docusaurus.config.ts` plugins array. Build produces `llms.txt` with 172 total links (166 doc + 6 API).

## Task Completion

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create llms-template.txt | 7e75319 | static/llms-template.txt |
| 2 | Create llms-txt-plugin.ts | 085f65e | plugins/llms-txt-plugin.ts |
| 3 | Register plugin and verify build | ed96852 | docusaurus.config.ts |

## Decisions Made

1. **Placeholder syntax**: Used `<!-- LINKS:section-name -->` HTML comment markers in the template, replaced by the plugin at build time. Clean, invisible in rendered contexts, easy to parse with regex.

2. **API links hardcoded**: The 6 API spec landing page routes are defined as constants in the plugin rather than dynamically discovered from the API docs directory. This is intentional per D-05/D-11 since only spec landing pages are included, not individual endpoints.

3. **Filesystem scanning over route metadata**: The plugin scans `docs/documentation/` source files directly rather than using Docusaurus route metadata from postBuild. This gives access to frontmatter fields (title, slug, sidebar_position) needed for link generation and sorting.

## Verification Results

- `npm run build` completes successfully
- `build/llms.txt` starts with `# 1NCE Developer Hub`
- Contains all three H2 sections: 1NCE Connect, 1NCE OS, API Reference
- Zero `<!-- LINKS:` markers remain in output (all 11 replaced)
- 172 links total (166 doc + 6 API)
- Welcome page with `slug: /` correctly maps to `https://help.1nce.com/docs/`
- API links point to spec landing pages (e.g., `https://help.1nce.com/api/authorization/authorization/`)
- All links use absolute URLs with trailing slashes
- Links sorted by sidebar_position within each section

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

None - all functionality is fully wired.
