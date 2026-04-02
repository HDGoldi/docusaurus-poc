---
phase: 06-chat-ui
plan: 01
subsystem: ui
tags: [react, sse, streaming, chat, css-modules, infima, docusaurus-theme]

# Dependency graph
requires:
  - phase: 05-ai-backend
    provides: Lambda Function URL SSE endpoint and SSEEvent/Source type contracts
provides:
  - Floating chat button visible on every page via Root.tsx wrapper
  - Slide-out drawer with header, close, escape key, focus trap
  - POST-based SSE streaming hook with AbortController
  - Message rendering with react-markdown and streaming cursor
  - Citation list and superscript citation links
  - Suggestion chips with 4 starter questions
  - Full dark mode support via Infima CSS variables
  - Mobile-responsive layout (full-screen at <=768px)
affects: [07-cicd]

# Tech tracking
tech-stack:
  added: [react-markdown]
  patterns: [CSS Modules with Infima variables, Root.tsx global wrapper, POST-based SSE with ReadableStream]

key-files:
  created:
    - src/components/ChatWidget/types.ts
    - src/components/ChatWidget/useChatStream.ts
    - src/components/ChatWidget/ChatButton.tsx
    - src/components/ChatWidget/ChatInput.tsx
    - src/components/ChatWidget/ChatDrawer.tsx
    - src/components/ChatWidget/ChatMessage.tsx
    - src/components/ChatWidget/CitationList.tsx
    - src/components/ChatWidget/SuggestionChips.tsx
    - src/components/ChatWidget/ChatWidget.tsx
    - src/components/ChatWidget/ChatWidget.module.css
    - src/theme/Root.tsx
  modified:
    - package.json

key-decisions:
  - "react-markdown for AI response rendering (lightweight, handles code blocks and lists)"
  - "CSS Modules over styled-components to stay idiomatic with Docusaurus/Infima"
  - "Root.tsx swizzle pattern to inject chat widget globally without modifying docusaurus.config.ts"
  - "POST-based SSE with ReadableStream rather than EventSource (EventSource only supports GET)"
  - "AbortController for stop-generation feature with partial content preservation"

patterns-established:
  - "Root.tsx wrapper: inject global UI components via src/theme/Root.tsx"
  - "Infima CSS variables: use --ifm-* tokens for automatic light/dark mode support"
  - "SSE buffer parsing: split on double newline, keep last fragment as incomplete buffer"
  - "Route-change reset: useLocation + useRef to detect navigation and clear state"

requirements-completed: [CHAT-01, CHAT-02, CHAT-03, CHAT-04, CHAT-05]

# Metrics
duration: ~25min
completed: 2026-03-23
---

# Phase 6 Plan 1: Chat Widget Foundation Summary

**Floating chat widget with SSE streaming hook, 9 React components, CSS module with Infima dark mode, and Root.tsx global wrapper**

## Performance

- **Duration:** ~25 min
- **Started:** 2026-03-23T16:30:00Z
- **Completed:** 2026-03-23T16:58:02Z
- **Tasks:** 3 (2 auto + 1 human-verify checkpoint)
- **Files created:** 11
- **Files modified:** 2 (package.json, package-lock.json)

## Accomplishments

- Complete chat widget shell: floating button, slide-out drawer, message input, streaming display, citations, suggestion chips
- POST-based SSE streaming hook with AbortController abort, error mapping (429/503/network), and buffer parsing
- Full light/dark mode support using Infima CSS custom properties -- zero hardcoded colors outside spec
- Mobile-responsive drawer (full-screen at <=768px) with reduced-motion media query support
- Accessibility: role="dialog", aria-labels, focus trap, aria-live="polite" for screen readers

## Task Commits

Each task was committed atomically:

1. **Task 1: Install react-markdown and create type definitions + SSE streaming hook** - `418fa62` (feat)
2. **Task 2: Build all structural components, CSS module, and Root.tsx wrapper** - `5c2f854` (feat)
3. **Task 3: Verify chat widget on running site** - checkpoint approved by user (no commit)

## Files Created/Modified

- `src/components/ChatWidget/types.ts` - Shared interfaces (Message, Source, SSEEvent, ChatState), constants (STARTER_QUESTIONS, COPY, CHAT_ENDPOINT)
- `src/components/ChatWidget/useChatStream.ts` - Custom hook for POST-based SSE streaming with AbortController and error mapping
- `src/components/ChatWidget/ChatButton.tsx` - Fixed-position teal circle button with chat bubble SVG icon
- `src/components/ChatWidget/ChatInput.tsx` - Text input with send/stop toggle button, Enter key submit
- `src/components/ChatWidget/ChatDrawer.tsx` - Slide-out drawer with header, close button, escape key, focus trap
- `src/components/ChatWidget/ChatMessage.tsx` - User/AI/error message bubbles with react-markdown rendering and streaming cursor
- `src/components/ChatWidget/CitationList.tsx` - Sources section with numbered citation links
- `src/components/ChatWidget/SuggestionChips.tsx` - Clickable starter question pills
- `src/components/ChatWidget/ChatWidget.tsx` - Main orchestrator: state management, SSE hook integration, route-change reset, auto-scroll
- `src/components/ChatWidget/ChatWidget.module.css` - All styles using Infima CSS variables for light/dark mode
- `src/theme/Root.tsx` - Global wrapper injecting ChatWidget on every page
- `package.json` - Added react-markdown dependency

## Decisions Made

- **react-markdown for AI responses**: Lightweight library that handles markdown in streamed content without heavy dependencies
- **CSS Modules over styled-components**: Stays idiomatic with Docusaurus/Infima ecosystem, no runtime CSS-in-JS overhead
- **Root.tsx swizzle pattern**: Standard Docusaurus approach to inject global components without config changes
- **POST-based SSE with ReadableStream**: Required because the Lambda endpoint uses POST (EventSource API only supports GET)
- **AbortController for stop button**: Preserves partial content on abort rather than discarding

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required. The chat widget will show an error state when the Lambda endpoint is not configured (expected for local development).

## Next Phase Readiness

- Chat widget foundation is complete and visually verified
- Ready for Phase 7 (CI/CD Integration) which wires the Lambda endpoint and content sync into the deploy workflow
- Lambda Function URL must be configured via CHAT_ENDPOINT env var or window.__CHAT_ENDPOINT__ for production use

## Self-Check: PASSED

- All 11 created files verified on disk
- Both task commits (418fa62, 5c2f854) verified in git log

---
*Phase: 06-chat-ui*
*Completed: 2026-03-23*
