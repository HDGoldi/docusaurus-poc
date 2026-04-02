---
phase: 06-chat-ui
verified: 2026-03-23T18:00:00Z
status: human_needed
score: 10/10 truths verified
re_verification: false
human_verification:
  - test: "Open site, click chat button, observe drawer animation and dark mode"
    expected: "Teal button visible bottom-right; drawer slides in from right with 200ms ease-out; header shows '1NCE Docs Assistant'; dark mode toggle adapts button and drawer colors"
    why_human: "Visual animation quality, color correctness, and dark mode appearance cannot be verified programmatically"
  - test: "Click a suggestion chip, observe streaming response"
    expected: "Chip sends question; loading dots appear while empty; tokens appear token-by-token; streaming cursor blinks; Stop button available to abort"
    why_human: "Requires live Lambda endpoint; real-time streaming behavior is not verifiable statically"
  - test: "Observe AI response with sources, click a citation link"
    expected: "Sources section appears below AI response with numbered links; clicking a link navigates to the referenced doc page"
    why_human: "Requires live backend returning sources; link navigation behavior is a user interaction"
  - test: "Resize browser to <=768px, open chat"
    expected: "Drawer takes full screen width (100vw); no left border or shadow; body scroll locks"
    why_human: "Responsive layout requires visual inspection at mobile breakpoint"
  - test: "Navigate to a different page while chat is open"
    expected: "Conversation clears and drawer closes on route change"
    why_human: "Requires running Docusaurus app with client-side routing active"
---

# Phase 6: Chat UI Verification Report

**Phase Goal:** Developers can ask questions about the documentation from any page and receive AI-generated answers with links to source pages
**Verified:** 2026-03-23T18:00:00Z
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

All five ROADMAP success criteria are substantively implemented. Automated checks pass on all artifacts and key links. Human verification is required for visual/interactive/runtime behaviors that cannot be confirmed statically.

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | A floating teal chat button is visible in the bottom-right corner on every page | VERIFIED | `ChatButton` rendered by `ChatWidget`; `Root.tsx` wraps entire site; `.chatButton` CSS uses `position: fixed`, `bottom: 32px`, `right: 32px`, `background: var(--ifm-color-primary)` |
| 2 | Clicking the button opens a slide-out drawer from the right edge | VERIFIED | `handleOpen` sets `isOpen=true`; `ChatDrawer` applies `.drawerOpen` class (`transform: translateX(0)`); transition `200ms ease-out` defined in CSS |
| 3 | Pressing Escape or clicking the X button closes the drawer | VERIFIED | `ChatDrawer.handleKeyDown` calls `onClose()` on `e.key === 'Escape'`; close button has `onClick={onClose}` with `aria-label="Close chat"` |
| 4 | User can type a question and press Enter to send it | VERIFIED | `ChatInput.handleKeyDown` fires `handleSend()` on Enter (not Shift+Enter); input clears after send |
| 5 | Tokens stream into the drawer in real-time from the Lambda SSE endpoint | VERIFIED | `useChatStream` uses `fetch` with `method: 'POST'`, reads `response.body.getReader()`, splits buffer on `\n\n`, dispatches `onText` for each `type: 'text'` SSE event; `handleText` appends to last assistant message |
| 6 | User can click Stop to abort an in-progress stream | VERIFIED | `ChatInput` shows stop icon (square SVG) with `aria-label="Stop generating"` when `isStreaming=true`; click calls `onStop` → `abort()`; `AbortController.abort()` in `useChatStream` sets state to `idle` without error |
| 7 | Navigating to a different page resets the conversation | VERIFIED | `ChatWidget` uses `useLocation()` from `@docusaurus/router`; `useEffect` on `pathname` compares to `prevPathnameRef`; calls `setMessages([])` and `setIsOpen(false)` on change |
| 8 | Each AI response includes a Sources section with clickable links to documentation pages | VERIFIED | `useChatStream` dispatches `onSources` for `type: 'sources'` events; `handleSources` sets `sources` on last assistant message; `ChatMessage` renders `<CitationList>` when `message.sources.length > 0`; each source renders as `<a href={source.url}>[N] title</a>` |
| 9 | Empty state shows 4 clickable suggestion chips that send a question when clicked | VERIFIED | `ChatWidget` renders `<SuggestionChips onSelect={handleSend} />` when `messages.length === 0`; `SuggestionChips` maps `STARTER_QUESTIONS` (4 items) to `<button>` elements; `onClick` calls `onSelect(q.label)` which calls `handleSend` |
| 10 | Chat widget adapts to dark mode automatically via Infima CSS variables | VERIFIED | All color values use `var(--ifm-color-primary)`, `var(--ifm-background-color)`, `var(--ifm-font-color-base)`, `var(--ifm-toc-border-color)`; explicit `[data-theme='dark']` overrides for `.aiMessage`, `.inputArea`, `.sendButtonDisabled`, `.aiMessage code` |

**Score:** 10/10 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/components/ChatWidget/types.ts` | Shared TypeScript interfaces | VERIFIED | Exports `SSEEvent`, `Source`, `Message`, `ChatState`, `StarterQuestion`, `STARTER_QUESTIONS` (4 items), `CHAT_ENDPOINT`, `COPY` (all 13 keys) |
| `src/components/ChatWidget/useChatStream.ts` | POST-based SSE hook with AbortController | VERIFIED | `fetch` POST, `getReader()`, `split('\n\n')`, `AbortController`, error mapping for 429/503/TypeError/AbortError, cleanup `useEffect` on unmount |
| `src/components/ChatWidget/ChatButton.tsx` | Floating action button | VERIFIED | `title={COPY.buttonTooltip}` ("Ask AI"), `aria-label={COPY.openAriaLabel}`, chat bubble SVG (Material Design path), imports `.chatButton` CSS class |
| `src/components/ChatWidget/ChatInput.tsx` | Input with send/stop toggle | VERIFIED | Enter key submit, send/stop icon toggle, `aria-label` from `COPY`, `disabled` when streaming |
| `src/components/ChatWidget/ChatDrawer.tsx` | Slide-out drawer container | VERIFIED | `role="dialog"`, `aria-label={COPY.drawerAriaLabel}`, Escape key, focus trap (Tab cycle), mobile scroll lock, `.drawerOpen` class toggle |
| `src/components/ChatWidget/ChatMessage.tsx` | Message bubbles with markdown | VERIFIED | `ReactMarkdown` for assistant messages, streaming cursor `<span>` with `.streamingCursor` animation, `CitationList` rendered when sources present, error message with warning SVG |
| `src/components/ChatWidget/CitationList.tsx` | Source citations list | VERIFIED | Renders `<a href={source.url}>` for each source; "Sources" heading from `COPY.sourcesHeading`; returns null when empty |
| `src/components/ChatWidget/SuggestionChips.tsx` | Starter question chips | VERIFIED | Maps `STARTER_QUESTIONS` to `<button>` elements; `onClick` calls `onSelect(q.label)` |
| `src/components/ChatWidget/ChatWidget.tsx` | Main orchestrator | VERIFIED | `useLocation` for route reset, `useChatStream` integrated, `handleText`/`handleSources`/`handleError`/`handleDone` callbacks, loading dots, auto-scroll via `bottomRef`, `aria-live="polite"` |
| `src/components/ChatWidget/ChatWidget.module.css` | Infima-based styles | VERIFIED | All `--ifm-*` variables, `.chatButton`, `.drawer`, `.drawerOpen`, `@media (max-width: 768px)`, `@media (prefers-reduced-motion: reduce)`, `[data-theme='dark']` overrides |
| `src/theme/Root.tsx` | Global Root wrapper | VERIFIED | Imports `ChatWidget from '@site/src/components/ChatWidget/ChatWidget'`; renders `{children}` + `<ChatWidget />` in fragment |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `src/theme/Root.tsx` | `src/components/ChatWidget/ChatWidget.tsx` | `import ChatWidget` and `<ChatWidget />` render | WIRED | Line 2: import; line 8: `<ChatWidget />` rendered as sibling of `{children}` |
| `src/components/ChatWidget/useChatStream.ts` | Lambda Function URL | `fetch` with `method: 'POST'` | WIRED | Line 70: `method: 'POST'`; `CHAT_ENDPOINT` passed from `ChatWidget`; empty string guarded in `handleSend` |
| `src/components/ChatWidget/ChatWidget.tsx` | `@docusaurus/router` | `useLocation` for route-change detection | WIRED | Line 2: `import { useLocation } from '@docusaurus/router'`; line 18: `const { pathname } = useLocation()`; line 22-28: `useEffect` triggers reset on pathname change |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| CHAT-01 | 06-01-PLAN.md | Floating chat drawer UI accessible from all pages via global widget | SATISFIED | `Root.tsx` injects `ChatWidget` globally; button fixed bottom-right; drawer opens without page navigation |
| CHAT-02 | 06-01-PLAN.md | Streaming responses render tokens as they arrive | SATISFIED | `useChatStream` SSE with `getReader()` + buffer parsing; `handleText` appends tokens to message state in real time |
| CHAT-03 | 06-01-PLAN.md | Source citations displayed as clickable links to relevant documentation pages | SATISFIED | `CitationList` renders `<a href={source.url}>` links with index and title; `ChatMessage` renders it when sources present |
| CHAT-04 | 06-01-PLAN.md | Suggested questions shown to help users get started | SATISFIED | `SuggestionChips` with 4 `STARTER_QUESTIONS` rendered in empty state; clicking sends the question |
| CHAT-05 | 06-01-PLAN.md | Dark mode support matching existing site theme | SATISFIED | All colors via `--ifm-*` variables; `[data-theme='dark']` overrides for AI message bubble, input area, disabled button |

No orphaned requirements found. All 5 CHAT-xx requirements for Phase 6 are claimed by 06-01-PLAN.md and have implementing code.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `CitationList.tsx` | 18-25 | Citation links are plain `<a href>` with no `onClick` to close drawer | Info | PLAN specified drawer-close on citation click; ROADMAP success criterion only requires "clickable links that navigate" — satisfied. Drawer-close is a UX enhancement, not a goal-blocking gap. |
| `ChatMessage.tsx` / `CitationList.tsx` | — | Superscript `[N]` markers in streamed text are not replaced with `<sup>` elements | Info | `.superscript` CSS class defined but unused. PLAN specified inline superscript markers; ROADMAP success criterion only requires "clickable citation links" in the response — the source list satisfies this. Not blocking. |
| `CitationList.tsx` | 21-22 | Citation links do not prepend `siteConfig.baseUrl` for non-root deployments | Warning | On GitHub Pages (`/docusaurus_poc/` base), relative URLs from Bedrock KB may not resolve correctly. No `useDocusaurusContext` or `baseUrl` handling present. Relevant when GitHub Pages preview is used. |

### Human Verification Required

#### 1. Visual appearance and dark mode

**Test:** Run `npm start`, open http://localhost:3000, verify teal chat button in bottom-right corner. Toggle dark mode with the sun/moon icon.
**Expected:** Button is teal circle with chat bubble SVG; drawer slides in from right with header "1NCE Docs Assistant"; all colors adapt to dark theme (dark background, light text, teal accents).
**Why human:** Visual quality of colors, animation smoothness, and dark mode transitions cannot be verified without rendering.

#### 2. Streaming interaction (requires Lambda)

**Test:** With `CHAT_ENDPOINT` configured, click a suggestion chip and observe the response.
**Expected:** Loading dots appear first; tokens stream in token-by-token; streaming cursor blinks; Stop button aborts with partial content preserved.
**Why human:** Requires live Lambda SSE endpoint; real-time streaming behavior not statically verifiable.

#### 3. Citation link navigation

**Test:** With a response containing sources, click a citation link.
**Expected:** Browser navigates to the referenced documentation page. Note: on GitHub Pages deployment, verify the URL resolves correctly given the `/docusaurus_poc/` base path.
**Why human:** Requires live backend returning source URLs; link navigation is a runtime behavior.

#### 4. Mobile responsive layout

**Test:** Open browser DevTools, set viewport to 375px wide, open chat.
**Expected:** Drawer fills full screen width (100vw); no left border or drop shadow; body scroll is locked while drawer is open.
**Why human:** Responsive CSS behavior requires visual inspection at the mobile breakpoint.

#### 5. Route change conversation reset

**Test:** Open chat, send a message (or click a chip), then click a navigation link to go to a different doc page.
**Expected:** Chat drawer closes and conversation is cleared. Reopening chat shows empty state with suggestion chips.
**Why human:** Requires running Docusaurus with client-side routing active (not testable from static file read).

### Gaps Summary

No goal-blocking gaps. All 10 observable truths are verified with substantive, wired implementations. The two "info" anti-patterns (missing inline superscripts and missing drawer-close on citation click) are plan implementation details not required by the ROADMAP success criteria.

The one "warning" anti-pattern is the missing `baseUrl` prepend in `CitationList.tsx`. This will surface as broken citation links when the site is deployed to GitHub Pages (base path `/docusaurus_poc/`) and the Lambda returns relative doc URLs. This is worth fixing before Phase 7 CI/CD wiring, but does not block the Phase 6 goal as stated.

---

_Verified: 2026-03-23T18:00:00Z_
_Verifier: Claude (gsd-verifier)_
