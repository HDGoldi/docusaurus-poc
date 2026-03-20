# Phase 1: Content Conversion - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-20
**Phase:** 1-content-conversion
**Areas discussed:** Conversion strategy, Image handling, Docusaurus scaffolding, Content fidelity

---

## Conversion Strategy

### Script Language

| Option | Description | Selected |
|--------|-------------|----------|
| Node.js (Recommended) | Same ecosystem as Docusaurus, can use gray-matter for frontmatter | ✓ |
| Python | Strong regex/text processing, but adds a separate runtime dependency | |
| You decide | Claude picks the best tool | |

**User's choice:** Node.js
**Notes:** Natural choice given Docusaurus is Node.js-based

### Pipeline Approach

| Option | Description | Selected |
|--------|-------------|----------|
| Single script | One command converts everything — simpler to run | |
| Multi-step pipeline | Separate scripts for each pattern — easier to debug/re-run | ✓ |
| You decide | Claude picks based on complexity | |

**User's choice:** Multi-step pipeline
**Notes:** Allows debugging individual conversion steps independently

### Source/Target Folders

| Option | Description | Selected |
|--------|-------------|----------|
| Copy to new folder (Recommended) | Read from export, write to docs/ — preserves original | ✓ |
| Convert in-place | Transform files directly in the export folder | |

**User's choice:** Copy to new folder

### Re-runnability

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, idempotent (Recommended) | Can re-run on new exports without breaking anything | ✓ |
| One-time migration | Run once, then manually maintain | |

**User's choice:** Idempotent

---

## Image Handling

### Remote Images

| Option | Description | Selected |
|--------|-------------|----------|
| Download locally (Recommended) | Script downloads all to /static/img/ | ✓ |
| Keep remote URLs | Faster but depends on ReadMe servers | |

**User's choice:** Download locally

### Image Folder Structure

| Option | Description | Selected |
|--------|-------------|----------|
| Mirror doc structure (Recommended) | /static/img/1nce-os/device-controller/image.png | ✓ |
| Flat folder | /static/img/image-hash.png | |
| You decide | Claude picks | |

**User's choice:** Mirror doc structure

### Base64 Images

| Option | Description | Selected |
|--------|-------------|----------|
| Extract to files (Recommended) | Decode to .png, replace with standard reference | ✓ |
| You decide | Claude handles | |

**User's choice:** Extract to files

---

## Docusaurus Scaffolding

### Folder Mapping

| Option | Description | Selected |
|--------|-------------|----------|
| Mirror exactly (Recommended) | Keep same folder names and hierarchy | |
| Clean up names | Normalize (lowercase, hyphens) but keep hierarchy | ✓ |
| Reorganize | Restructure for Docusaurus conventions | |

**User's choice:** Clean up names — normalize folder names but preserve hierarchy

### Sidebar Generation

| Option | Description | Selected |
|--------|-------------|----------|
| Part of conversion script | Pipeline reads _order.yaml and generates sidebars.js | |
| Separate tool | Standalone script for sidebar generation | ✓ |
| You decide | Claude picks | |

**User's choice:** Separate tool

### Recipes Placement

| Option | Description | Selected |
|--------|-------------|----------|
| Under Blueprints & Examples | Merge — similar content | ✓ |
| Separate docs instance | Own navbar tab | |
| You decide | Claude decides based on content | |

**User's choice:** Under Blueprints & Examples

---

## Content Fidelity

### AI Support Agent HTML Pages

| Option | Description | Selected |
|--------|-------------|----------|
| Skip them | ReadMe-specific integrations, not standard docs | ✓ |
| Convert to MDX | Try to convert HTML to MDX | |
| Keep as raw HTML | Include as static pages | |

**User's choice:** Skip them

### HTMLBlock Visual Fidelity

| Option | Description | Selected |
|--------|-------------|----------|
| Content over style | Extract content, use standard Docusaurus styling | |
| Match closely | Recreate layouts as custom MDX components | ✓ |
| You decide | Claude judges case-by-case | |

**User's choice:** Match closely — recreate the original CSS layouts

---

## Claude's Discretion

- Exact Docusaurus version selection
- Frontmatter field mapping details
- Script file organization and naming
- Error handling and logging
- HTMLBlock edge case handling

## Deferred Ideas

None — discussion stayed within phase scope.
