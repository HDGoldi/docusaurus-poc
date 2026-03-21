---
status: complete
phase: 02-site-assembly
source: [02-01-SUMMARY.md, 02-02-SUMMARY.md, 02-03-SUMMARY.md, 02-04-SUMMARY.md]
started: 2026-03-21T21:00:00Z
updated: 2026-03-21T21:15:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Cold Start Smoke Test
expected: Kill any running dev server. Run `npm run build` or `npm start` from scratch. The site builds without errors and the dev server loads the homepage without issues.
result: pass

### 2. Five-Tab Navbar
expected: The top navbar shows five tabs: Documentation, API Explorer, 1NCE Platform, Blueprints, Terms. Each tab is clickable and navigates to its respective section.
result: pass

### 3. Root Redirect
expected: Navigating to the site root (/) redirects to /docs, landing on the Documentation section.
result: pass

### 4. Sidebar Ordering
expected: Within each tab, the sidebar categories and pages appear in a logical order matching the original ReadMe.com site structure (not alphabetical).
result: pass

### 5. 1NCE Brand Theme
expected: The site uses 1NCE navy/teal brand colors — navy navbar, teal accent links/buttons. The default Docusaurus green theme is not visible anywhere.
result: pass

### 6. Barlow Font
expected: Body text and headings use the Barlow font (visible in browser DevTools or by visual comparison — not the default system/sans-serif font).
result: pass

### 7. Dark Mode
expected: Toggling dark mode (sun/moon icon in navbar) switches to a dark theme with brand-appropriate darker navy tones, not just inverted colors.
result: pass

### 8. 1NCE Logo in Navbar
expected: The navbar displays the real 1NCE brand logo (not a text placeholder). It should be a proper SVG logo.
result: pass

### 9. Footer
expected: The page footer shows copyright text, external links, and uses navy styling that matches the navbar color scheme.
result: pass

### 10. API Explorer Landing Page
expected: Clicking the "API Explorer" navbar tab loads a landing/introduction page for the API docs, not a raw endpoint page.
result: issue
reported: "Right now it then shows the following page http://localhost:3000/api/1nce-os/1-nce-os not the landing/intro page for API docs"
severity: major

### 11. API Explorer Categories
expected: The API Explorer sidebar shows categories for Authorization, SIM Management, Order Management, Product Information, Support Management, and 1NCE OS.
result: issue
reported: "Its not ordered correctly. Right now its 1nce-os then authorization then API Explorer then order-management then product-information then sim-management and then last is support-management"
severity: minor

### 12. Interactive Try It Panel
expected: Opening any API endpoint page (e.g., under SIM Management) shows an interactive "Try It" panel where you can fill in parameters and see request/response examples with code snippets.
result: issue
reported: "Not fully working. CORS error when trying to execute API calls from Try It panel. Browser blocks fetch to https://api.1nce.com/management-api/oauth/token from localhost:3000 - No Access-Control-Allow-Origin header. The panel renders but actual requests fail."
severity: major

### 13. Redirect Map Generated
expected: The file `static/redirect-map.json` exists and contains URL mappings (verify by opening the file — should have ~292 entries mapping old ReadMe paths to new Docusaurus paths).
result: issue
reported: "File exists but does not contain URL mappings. Instead contains Docusaurus HTML shell page (the SPA fallback). The JSON file was overwritten by the build output or is being served as the index.html fallback instead of the actual JSON content."
severity: major

## Summary

total: 13
passed: 9
issues: 4
pending: 0
skipped: 0
blocked: 0

## Gaps

- truth: "Clicking API Explorer navbar tab loads landing/introduction page for API docs"
  status: failed
  reason: "User reported: Right now it then shows the following page http://localhost:3000/api/1nce-os/1-nce-os not the landing/intro page for API docs"
  severity: major
  test: 10
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""
- truth: "API Explorer sidebar shows categories in correct order: Authorization, SIM Management, Order Management, Product Information, Support Management, 1NCE OS"
  status: failed
  reason: "User reported: Its not ordered correctly. Right now its 1nce-os then authorization then API Explorer then order-management then product-information then sim-management and then last is support-management"
  severity: minor
  test: 11
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""
- truth: "Try It panel can execute API requests and show responses"
  status: failed
  reason: "User reported: CORS error when trying to execute API calls. Browser blocks fetch to https://api.1nce.com/management-api/oauth/token from localhost:3000 - No Access-Control-Allow-Origin header. Panel renders but requests fail."
  severity: major
  test: 12
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""
- truth: "static/redirect-map.json contains ~292 old-to-new URL mappings as valid JSON"
  status: failed
  reason: "User reported: File exists but contains Docusaurus HTML shell page instead of JSON URL mappings. The JSON was overwritten by build output or is being served as SPA fallback."
  severity: major
  test: 13
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""
