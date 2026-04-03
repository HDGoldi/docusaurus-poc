# Phase 11: LLM Discoverability - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-03
**Phase:** 11-llm-discoverability
**Areas discussed:** Template structure, Link generation, Build integration, Content scope

---

## Template Structure

### Section Organization

| Option | Description | Selected |
|--------|-------------|----------|
| Mirror docs sidebar | Use the same 10 section names from the docs sidebar as H2 headings | |
| Product-first (two groups) | Group under 1NCE Connect and 1NCE OS umbrellas, plus API Reference | ✓ |
| Flat (all docs + APIs) | Single Documentation section with all pages, plus API Reference | |

**User's choice:** Product-first (two groups)
**Notes:** Matches PROJECT.md milestone description for v1.3.

### Preamble Style

| Option | Description | Selected |
|--------|-------------|----------|
| Brief tagline | 1-2 sentences: what 1NCE is, what this docs site covers | |
| Detailed overview | 3-5 sentences covering product lines, target audience, and task types | ✓ |

**User's choice:** Detailed overview
**Notes:** Gives LLMs more context to assess relevance.

### Section Mapping

| Option | Description | Selected |
|--------|-------------|----------|
| Proposed mapping | 1NCE Connect: Introduction, Connectivity Services, Network Services, SIM Cards, Platform Services, Blueprints/Examples, 1NCE Portal, MCP Server, Troubleshooting. 1NCE OS: 1NCE OS section. API Reference: all 6 specs. | ✓ |
| Specify differently | User defines custom mapping | |

**User's choice:** Proposed mapping (confirmed)
**Notes:** None.

---

## Link Generation

### Link Labels

| Option | Description | Selected |
|--------|-------------|----------|
| Page titles | Use frontmatter title or first H1 as link text | ✓ |
| Section > Page format | Prefix with parent section name | |
| You decide | Claude picks based on llmstxt.org conventions | |

**User's choice:** Page titles
**Notes:** Most natural for LLMs to parse.

### API Reference Links

| Option | Description | Selected |
|--------|-------------|----------|
| Group by spec | One link per API spec landing page (6 links total) | ✓ |
| List every endpoint | All ~125 API endpoints listed individually | |
| Spec + top tags | One entry per spec plus sub-entries for each tag | |

**User's choice:** Group by spec
**Notes:** Keeps llms.txt concise; LLMs can follow to individual endpoints.

### Link Depth

| Option | Description | Selected |
|--------|-------------|----------|
| Sub-section groups | H3 sub-headings within each product section | ✓ |
| Flat list per product | All pages listed directly under each product H2 | |

**User's choice:** Sub-section groups
**Notes:** Preserves hierarchy while remaining scannable.

---

## Build Integration

### Build Hook

| Option | Description | Selected |
|--------|-------------|----------|
| Docusaurus plugin | Custom plugin using postBuild lifecycle hook | ✓ |
| Standalone Node script | Separate script running after docusaurus build | |
| You decide | Claude picks best approach | |

**User's choice:** Docusaurus plugin
**Notes:** Idiomatic, has access to route metadata and content.

### Template Location

| Option | Description | Selected |
|--------|-------------|----------|
| static/llms-template.txt | In static/ next to robots.txt | ✓ |
| src/data/llms-template.txt | In src/data/ alongside other data files | |
| You decide | Claude picks most idiomatic location | |

**User's choice:** static/llms-template.txt
**Notes:** Consistent pattern with robots.txt.

---

## Content Scope

### Doc Page Inclusion

| Option | Description | Selected |
|--------|-------------|----------|
| All pages | Include every doc page (~298) in auto-generated links | ✓ |
| Curated subset | Only include top-level/landing pages per section | |
| Category pages only | Only section landing pages | |

**User's choice:** All pages
**Notes:** llms.txt is a manifest for discoverability, not a curated summary.

### URL Format

| Option | Description | Selected |
|--------|-------------|----------|
| Absolute URLs | Full URLs with domain (https://help.1nce.com/...) | ✓ |
| Relative paths | Paths like /docs/introduction/getting-started | |

**User's choice:** Absolute URLs
**Notes:** llmstxt.org spec examples use absolute URLs; LLMs may not know the base domain.

---

## Claude's Discretion

- Plugin implementation details (file structure, helper functions, error handling)
- Exact preamble wording (within the "detailed overview" style)
- Template file format/syntax for marking auto-generated sections

## Deferred Ideas

None — discussion stayed within phase scope.
