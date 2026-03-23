# Phase 6: Chat UI - Context

**Gathered:** 2026-03-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Developers can ask questions about the documentation from any page and receive AI-generated answers with links to source pages. This phase builds the frontend chat widget that connects to the Phase 5 Lambda SSE endpoint. It does NOT modify the backend, content pipeline, or CI/CD.

</domain>

<decisions>
## Implementation Decisions

### Widget Placement & Layout
- **D-01:** Floating chat button in bottom-right corner — standard chat widget position, won't conflict with Docusaurus footer/sidebar
- **D-02:** Slide-out drawer from right edge — overlays content without navigation, satisfies CHAT-01 requirement
- **D-03:** Full-screen takeover on mobile — drawer becomes full-screen on small viewports for keyboard + message space
- **D-04:** Chat button visible on all builds (GitHub Pages + production) — enables testing on preview deployments. Lambda CORS already supports GH Pages origin (Phase 5 D-03).

### Conversation UX
- **D-05:** Chat bubbles — user messages right-aligned, AI responses left-aligned with distinct background colors
- **D-06:** Conversation persists until page navigation — closing/reopening drawer on same page restores messages. Navigating away resets. No storage layer needed.
- **D-07:** Token-by-token streaming with blinking cursor — tokens append as they arrive from SSE (Phase 5 D-08). ChatGPT-like experience.
- **D-08:** Input disabled during streaming with Stop button — prevents parallel streams, user can cancel in-progress response

### Citations & Source Links
- **D-09:** Superscript link markers — [1][2] render as small superscript numbers in 1NCE teal, clickable
- **D-10:** Same-tab navigation on citation click — closes drawer, navigates to cited documentation page
- **D-11:** Sources section below each response — "Sources" list with page titles and links, grouped per AI response
- **D-12:** Page-level links only — link to doc page URL from Phase 5 chunk metadata, no section anchors

### Starter Experience
- **D-13:** Welcome message + suggestion chips — brief greeting ("Ask me about 1NCE documentation") with 3-4 clickable question chips
- **D-14:** Hardcoded starter questions — curated popular topics (e.g., "How do I activate a SIM?", "What authentication methods are available?"). Easy to maintain.
- **D-15:** Generic identity — labeled "1NCE Docs Assistant", no custom avatar. Professional, matches ReadMe "Ask AI" style.
- **D-16:** Icon-only floating button — chat bubble icon, "Ask AI" tooltip on hover. Minimal screen footprint.

### Claude's Discretion
- Drawer width and animation timing
- Exact chat bubble styling (border-radius, padding, colors within 1NCE palette)
- Markdown rendering in AI responses (bold, code blocks, lists)
- Error state UI (network failure, rate limiting, backend unavailable)
- Loading/typing indicator design
- Z-index layering relative to Docusaurus elements
- Lambda endpoint URL configuration approach (env var, config, or hardcoded)
- Keyboard shortcuts (Escape to close drawer)
- Input field features (placeholder text, multiline support, submit on Enter)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` — CHAT-01 through CHAT-05 acceptance criteria

### Backend Contract (Phase 5)
- `.planning/phases/05-ai-backend-and-content-pipeline/05-CONTEXT.md` — SSE streaming format (D-08), citation format (D-09), fallback behavior (D-10)
- `infrastructure/template.yaml` — Lambda Function URL endpoint, CORS configuration, WAF rate limits

### Existing Site
- `docusaurus.config.ts` — Site config, theme setup, `isGitHubPages` pattern for conditional config
- `src/css/custom.css` — 1NCE brand tokens (navy #194a7d, teal #29abe2, Barlow font), light/dark mode variables

### Prior Phase Context
- `.planning/phases/04-github-pages-deployment/04-CONTEXT.md` — DEPLOY_TARGET env var pattern

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- No existing chat/widget components — this is fully greenfield
- `src/css/custom.css` — Infima CSS custom properties for 1NCE theming (light + dark mode)
- `src/clientModules/routeTracking.ts` — Pattern for global client-side modules

### Established Patterns
- Docusaurus theming via Infima CSS custom properties (`--ifm-*` tokens)
- `colorMode.respectPrefersColorScheme: true` — dark mode is system-preference-driven
- TypeScript for all configuration (`docusaurus.config.ts`, sidebar files)
- `isGitHubPages` conditional pattern for build-time feature toggling
- React 18 bundled with Docusaurus 3.x

### Integration Points
- `docusaurus.config.ts` — Add chat component as client module or swizzled Root wrapper
- `src/css/custom.css` — Chat widget CSS variables for consistent theming
- `src/theme/` — Currently empty, available for Root component swizzling to inject global chat widget
- Lambda Function URL — SSE endpoint from Phase 5 infrastructure

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches within the decisions above.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 06-chat-ui*
*Context gathered: 2026-03-23*
