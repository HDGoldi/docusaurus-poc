---
status: testing
phase: 01-content-conversion
source: 01-01-SUMMARY.md, 01-02-SUMMARY.md, 01-03-SUMMARY.md, 01-04-SUMMARY.md, 01-05-SUMMARY.md
started: 2026-03-21T18:00:00Z
updated: 2026-03-21T18:00:00Z
---

## Current Test
<!-- OVERWRITE each test - shows where we are -->

number: 1
name: Cold Start Smoke Test
expected: |
  Kill any running dev server. Run `npm start` from the project root. The Docusaurus dev server boots without errors and localhost:3000 responds with a page (not a crash or blank screen).
awaiting: user response

## Tests

### 1. Cold Start Smoke Test
expected: Kill any running dev server. Run `npm start` from the project root. The Docusaurus dev server boots without errors and localhost:3000 responds with a page (not a crash or blank screen).
result: [pending]

### 2. Welcome Page at Root URL
expected: Navigating to localhost:3000/ shows the 1NCE Developer Hub welcome/landing page (introduction-welcome content), not a "Page Not Found" error.
result: [pending]

### 3. Sidebar Navigation with 12 Categories
expected: The left sidebar shows 12 top-level categories generated from _order.yaml files. Categories are expandable and contain nested documentation pages.
result: [pending]

### 4. Documentation Page Content Renders
expected: Clicking into any documentation page (e.g., under Getting Started or any category) shows the converted markdown content with proper headings, paragraphs, and formatting.
result: [pending]

### 5. Images Display from Local Paths
expected: Documentation pages that contain images (e.g., hardware guides, SIM chip pages) show images loading from /img/ local paths. No broken image icons. No references to files.readme.io or base64 data URIs in the rendered page.
result: [pending]

### 6. Admonitions Render as Callout Boxes
expected: Pages that had warning/note callouts show them as styled Docusaurus admonition boxes (colored banners with icons), not plain blockquotes with emoji.
result: [pending]

### 7. Internal Doc Links Navigate Correctly
expected: Clicking internal documentation links (previously doc:slug format) navigates to the correct documentation page within the site. No 404 errors on linked pages.
result: [pending]

### 8. NavigationGrid Component on Welcome Page
expected: The welcome/overview pages display a responsive grid of navigation cards (NavigationGrid component), not raw JSX or broken markup.
result: [pending]

### 9. Tables Render as Formatted Tables
expected: Pages with data tables (previously Table JSX from ReadMe) render as properly formatted HTML/Markdown tables with headers, rows, and alignment.
result: [pending]

### 10. Full Pipeline Re-runnable
expected: Running `npx tsx scripts/run-pipeline.ts` completes all 12 conversion steps without errors and a subsequent `npm run build` passes with zero errors.
result: [pending]

## Summary

total: 10
passed: 0
issues: 0
pending: 10
skipped: 0
blocked: 0

## Gaps

[none yet]
