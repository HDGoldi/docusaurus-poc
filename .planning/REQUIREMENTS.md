# Requirements: 1NCE Developer Hub — AI & Search Readiness

**Defined:** 2026-04-03
**Core Value:** Developers can browse all existing documentation and interactively test API endpoints exactly as they can on the current ReadMe.com-hosted site.

## v1.3 Requirements

Requirements for AI & Search Readiness milestone. Each maps to roadmap phases.

### Crawler Foundation

- [ ] **CRAWL-01**: Site serves robots.txt at root with Sitemap reference to sitemap.xml
- [ ] **CRAWL-02**: robots.txt explicitly allows AI crawler user agents (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc.)
- [ ] **CRAWL-03**: CloudFront Function passes through requests for .txt, .md, .json files and .well-known/* paths without SPA rewrite

### LLM Discoverability

- [ ] **LLM-01**: Site serves llms.txt at root following llmstxt.org specification (H1, blockquote summary, H2 sections)
- [ ] **LLM-02**: llms.txt uses product-first organization with sections for 1NCE Connect, 1NCE OS, and API Reference
- [ ] **LLM-03**: llms.txt link sections are auto-generated at build time from existing docs and OpenAPI specs
- [ ] **LLM-04**: llms.txt preamble and section structure are hand-curated in a template file

### AI Agent Integration

- [ ] **AGENT-01**: Site serves skill.md describing how to work with 1NCE APIs — auth flows, common patterns, best practices, gotchas
- [ ] **AGENT-02**: skill.md is served at /.well-known/skills/default/skill.md with proper discovery path
- [ ] **AGENT-03**: Site serves index.json at /.well-known/skills/ listing available skills for npx skills add discovery
- [ ] **AGENT-04**: skill.md includes general best practices for working with 1NCE platform (not just API endpoints)

## Future Requirements

Deferred to future release. Tracked but not in current roadmap.

### Extended LLM Support

- **LLM-F01**: llms-full.txt concatenating all documentation into single markdown file
- **LLM-F02**: Individual pages accessible with .md appended to URLs
- **LLM-F03**: AI traffic analytics (separate tracking for bot vs human traffic)

## Out of Scope

| Feature | Reason |
|---------|--------|
| llms-full.txt | Deferred — llms.txt sufficient for initial launch |
| MCP server for live queries | Complexity too high for this milestone; revisit after llms.txt adoption |
| AI traffic analytics | Requires separate tracking infrastructure; defer to post-launch |
| .md URL variants for pages | Docusaurus doesn't natively support this; would require custom plugin |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| CRAWL-01 | — | Pending |
| CRAWL-02 | — | Pending |
| CRAWL-03 | — | Pending |
| LLM-01 | — | Pending |
| LLM-02 | — | Pending |
| LLM-03 | — | Pending |
| LLM-04 | — | Pending |
| AGENT-01 | — | Pending |
| AGENT-02 | — | Pending |
| AGENT-03 | — | Pending |
| AGENT-04 | — | Pending |

**Coverage:**
- v1.3 requirements: 11 total
- Mapped to phases: 0
- Unmapped: 11

---
*Requirements defined: 2026-04-03*
*Last updated: 2026-04-03 after initial definition*
