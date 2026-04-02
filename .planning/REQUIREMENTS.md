# Requirements: 1NCE Developer Hub v1.2

**Defined:** 2026-04-02
**Core Value:** Developers can browse all existing documentation and interactively test API endpoints exactly as they can on the current ReadMe.com-hosted site.

## v1.2 Requirements

Requirements for milestone v1.2 — Overall Enhancements & Fixing.

### Branding

- [x] **BRAND-01**: Site uses official 1NCE 120x120 PNG favicon
- [x] **BRAND-02**: Navbar displays official 1NCE SVG logo from 1nce.com
- [x] **BRAND-03**: Dark mode is fully removed — no toggle, light-only, all dark CSS cleaned up

### Navigation

- [x] **NAV-01**: Navbar includes external links for 1NCE Home, 1NCE Shop, 1NCE Portal (matching original hub header)
- [x] **NAV-02**: Documentation sidebar contains all sections in original order: Introduction, 1NCE Portal, SIM Cards, MCP Server, Connectivity Services, Platform Services, Network Services, 1NCE OS, Troubleshooting, Blueprints & Examples, Terms & Abbreviations
- [x] **NAV-03**: Platform, Blueprints, and Terms plugin instances removed; content merged into main docs instance
- [ ] **NAV-04**: Old `/platform/*`, `/blueprints/*`, and `/terms/*` URLs redirect to new locations via @docusaurus/plugin-client-redirects

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Search

- **SEARCH-01**: Algolia DocSearch integration for full-text search
- **SEARCH-02**: Search results include API endpoint pages

### Advanced AI

- **AI-01**: Multi-turn conversation with session memory
- **AI-02**: AI-powered search integration (hybrid search + AI answers)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Algolia DocSearch / search | Deferred, requires approval process |
| Doc versioning (V1.0/V2.0 dropdown) | Single version sufficient; original version dropdown rarely used |
| Content rewriting or restructuring | Migrated as-is from ReadMe.com |
| Two-tier header layout | Docusaurus single navbar sufficient with external links on right |
| Mobile app or native integrations | Not applicable |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| BRAND-01 | Phase 8 | Complete |
| BRAND-02 | Phase 8 | Complete |
| BRAND-03 | Phase 8 | Complete |
| NAV-01 | Phase 8 | Complete |
| NAV-02 | Phase 9 | Complete |
| NAV-03 | Phase 9 | Complete |
| NAV-04 | Phase 9 | Pending |

**Coverage:**
- v1.2 requirements: 7 total
- Mapped to phases: 7
- Unmapped: 0

---
*Requirements defined: 2026-04-02*
*Last updated: 2026-04-02 after roadmap creation*
