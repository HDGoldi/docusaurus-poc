# Phase 6: Chat UI - Research

**Researched:** 2026-03-23
**Domain:** React chat widget within Docusaurus, SSE streaming, Markdown rendering
**Confidence:** HIGH

## Summary

This phase builds a frontend-only chat widget (floating button + slide-out drawer) that connects to the Phase 5 Lambda SSE endpoint. The backend contract is well-defined: POST a `{ question: string }` body, receive `text/event-stream` with typed JSON events (`text`, `sources`, `error`) terminated by `[DONE]`. No new dependencies are strictly required -- React 19 (already installed), the browser-native `fetch` API with streaming, and CSS modules are sufficient. The only optional addition is `react-markdown` for rendering bold/code/lists in AI responses.

The primary integration pattern is Docusaurus Root component swizzling (`src/theme/Root.tsx`), which wraps the entire site and never unmounts across navigations. This is the official, documented approach for global persistent UI. Dark mode support uses the `useColorMode` hook from `@docusaurus/theme-common` combined with CSS custom properties already defined in `custom.css`.

**Primary recommendation:** Build the chat widget as a pure React component tree injected via `src/theme/Root.tsx`. Use the browser-native `fetch` + `ReadableStream` API for SSE consumption (not EventSource, which does not support POST). Use CSS modules for component styles with Infima CSS variables for theme integration. Add `react-markdown` (v10) only if rich formatting is desired in AI responses.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Floating chat button in bottom-right corner
- **D-02:** Slide-out drawer from right edge, overlays content without navigation
- **D-03:** Full-screen takeover on mobile (small viewports)
- **D-04:** Chat button visible on all builds (GitHub Pages + production)
- **D-05:** Chat bubbles -- user right-aligned, AI left-aligned with distinct backgrounds
- **D-06:** Conversation persists until page navigation -- closing/reopening drawer on same page restores messages. Navigating away resets. No storage layer.
- **D-07:** Token-by-token streaming with blinking cursor
- **D-08:** Input disabled during streaming with Stop button
- **D-09:** Superscript link markers [1][2] in 1NCE teal, clickable
- **D-10:** Same-tab navigation on citation click -- closes drawer, navigates to cited doc page
- **D-11:** Sources section below each response
- **D-12:** Page-level links only (no section anchors)
- **D-13:** Welcome message + suggestion chips ("Ask me about 1NCE documentation") with 3-4 clickable chips
- **D-14:** Hardcoded starter questions
- **D-15:** Generic identity -- "1NCE Docs Assistant", no custom avatar
- **D-16:** Icon-only floating button with "Ask AI" tooltip

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

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CHAT-01 | Floating chat drawer UI accessible from all pages via global widget | Root component swizzling pattern; z-index layering research; mobile breakpoint strategy |
| CHAT-02 | Streaming responses render tokens as they arrive | fetch + ReadableStream pattern for POST-based SSE; Lambda SSE contract documented |
| CHAT-03 | Source citations displayed as clickable links to relevant documentation pages | Lambda `sources` event format with index/url/title; superscript rendering pattern |
| CHAT-04 | Suggested questions shown to help users get started | Hardcoded array of starter questions; suggestion chip UI pattern |
| CHAT-05 | Dark mode support matching existing site theme | useColorMode hook; Infima CSS variables; data-theme attribute selectors |
</phase_requirements>

## Standard Stack

### Core (already installed -- no new packages required)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 19.2.4 | UI framework | Bundled with Docusaurus 3.9.2. Already installed. |
| @docusaurus/theme-common | 3.9.2 | useColorMode hook for dark mode | Already installed. Provides isDarkTheme boolean. |
| CSS Modules | (bundled) | Component-scoped styles | Docusaurus supports `*.module.css` natively. Established project pattern. |

### Supporting (optional addition)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| react-markdown | 10.1.0 | Render Markdown in AI responses | If AI responses contain bold, code blocks, lists. Lightweight (36KB). Pure ESM. |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| react-markdown | dangerouslySetInnerHTML + marked | Security risk with raw HTML. react-markdown sanitizes by default. |
| react-markdown | Plain text only | Simpler but loses formatting. AI responses likely contain code snippets and lists. |
| fetch + ReadableStream | EventSource API | EventSource only supports GET requests. Lambda expects POST with JSON body. Not viable. |
| CSS Modules | Tailwind | Conflicts with Infima (per project CLAUDE.md). Not an option. |

**Installation (if react-markdown is used):**
```bash
npm install react-markdown
```

## Architecture Patterns

### Recommended Project Structure
```
src/
  theme/
    Root.tsx                    # Swizzled Root -- injects ChatWidget globally
  components/
    ChatWidget/
      ChatWidget.tsx            # Main orchestrator (state, SSE connection)
      ChatWidget.module.css     # All chat widget styles
      ChatButton.tsx            # Floating button (bottom-right)
      ChatDrawer.tsx            # Slide-out drawer container
      ChatMessage.tsx           # Individual message bubble (user or AI)
      ChatInput.tsx             # Text input + send/stop button
      CitationList.tsx          # Sources section below AI response
      SuggestionChips.tsx       # Starter question chips
      useChatStream.ts          # Custom hook: fetch + SSE parsing
      types.ts                  # Shared TypeScript interfaces
```

### Pattern 1: Root Component Swizzle for Global Widget
**What:** Create `src/theme/Root.tsx` to wrap the entire Docusaurus site with the chat widget. The Root component never unmounts across page navigations.
**When to use:** Always -- this is the only way to inject a persistent global component in Docusaurus.
**Example:**
```typescript
// src/theme/Root.tsx
// Source: https://docusaurus.io/docs/swizzling#wrapper
import React from 'react';
import ChatWidget from '@site/src/components/ChatWidget/ChatWidget';

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ChatWidget />
    </>
  );
}
```

### Pattern 2: POST-based SSE Streaming with fetch + ReadableStream
**What:** Use the browser `fetch` API with `ReadableStream` to consume SSE from a POST endpoint. The standard `EventSource` API only supports GET requests, so it cannot be used with the Lambda endpoint which expects `POST { question: string }`.
**When to use:** For CHAT-02 streaming requirement.
**Example:**
```typescript
// Source: Lambda handler contract (lambda/chat-handler/types.ts)
async function streamChat(
  endpoint: string,
  question: string,
  onText: (content: string) => void,
  onSources: (sources: Source[]) => void,
  onError: (error: string) => void,
  signal?: AbortSignal,
): Promise<void> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
    signal,
  });

  if (!response.ok || !response.body) {
    onError(`Request failed: ${response.status}`);
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line === 'data: [DONE]') return;
      if (!line.startsWith('data: ')) continue;

      const event = JSON.parse(line.slice(6)) as SSEEvent;
      switch (event.type) {
        case 'text':
          if (event.content) onText(event.content);
          break;
        case 'sources':
          if (event.sources) onSources(event.sources);
          break;
        case 'error':
          onError(event.error || 'Unknown error');
          break;
      }
    }
  }
}
```

### Pattern 3: Dark Mode via CSS Custom Properties + data-theme
**What:** Use the `[data-theme='dark']` attribute selector on `<html>` combined with Infima CSS variables. Docusaurus sets this attribute automatically. The `useColorMode` hook provides `isDarkTheme` for any conditional React logic.
**When to use:** CHAT-05 dark mode requirement.
**Example:**
```css
/* ChatWidget.module.css */
.drawer {
  background-color: var(--ifm-background-color);
  color: var(--ifm-font-color-base);
  border-left: 1px solid var(--ifm-toc-border-color);
}

.userBubble {
  background-color: var(--ifm-color-primary);
  color: #ffffff;
}

.aiBubble {
  background-color: var(--ifm-background-surface-color, #f5f5f5);
}

[data-theme='dark'] .aiBubble {
  background-color: #2a2a2d;
}
```

### Pattern 4: Conversation State Reset on Navigation
**What:** Use Docusaurus route change detection to reset conversation. Since Root never unmounts, state persists across navigations by default. Track pathname and reset when it changes.
**When to use:** D-06 -- conversation persists on same page, resets on navigation.
**Example:**
```typescript
import { useLocation } from '@docusaurus/router';
import { useEffect, useRef } from 'react';

function useChatReset() {
  const { pathname } = useLocation();
  const prevPathname = useRef(pathname);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (prevPathname.current !== pathname) {
      setMessages([]);
      prevPathname.current = pathname;
    }
  }, [pathname]);

  return { messages, setMessages };
}
```

### Anti-Patterns to Avoid
- **Using EventSource for POST endpoints:** EventSource API only supports GET. The Lambda endpoint requires POST with a JSON body. Use `fetch` + `ReadableStream` instead.
- **Using localStorage for conversation persistence:** D-06 explicitly states no storage layer. State resets on navigation. Keep it in React state only.
- **Adding a separate state management library (Redux, Zustand):** Overkill for a single widget with local state. React useState + useReducer is sufficient.
- **Injecting chat via clientModules:** Client modules are imperative and cannot use React hooks or contexts. Use Root component swizzle instead.
- **Fighting Infima z-index with arbitrary large values:** Use Infima's CSS variable `--ifm-z-index-overlay` (400) as the baseline, not magic numbers.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Markdown rendering | Custom parser | react-markdown (v10) | Edge cases with nested formatting, code blocks, XSS prevention |
| SSE line parsing | Custom EventSource polyfill | fetch + ReadableStream with simple line parser | The SSE format from Lambda is simple (data-only, no event types in the SSE protocol sense). A ~20-line parser suffices. No library needed. |
| Abort/cancel streaming | Manual XHR with abort | AbortController + signal on fetch | Native browser API, works with ReadableStream. |
| Scroll-to-bottom in chat | Manual scroll calculations | `scrollIntoView({ behavior: 'smooth' })` on a sentinel div | Browser handles smooth scrolling natively. |

**Key insight:** This phase is lightweight on external dependencies. The browser platform (fetch, ReadableStream, AbortController, CSS variables) and React 19 provide everything needed. The only justified addition is react-markdown for AI response formatting.

## Common Pitfalls

### Pitfall 1: EventSource Does Not Support POST
**What goes wrong:** Developer reaches for `new EventSource(url)` and discovers it only supports GET with URL parameters.
**Why it happens:** SSE tutorials typically show EventSource which is GET-only.
**How to avoid:** Use `fetch()` with `response.body.getReader()` to read the stream manually. The Lambda endpoint requires `POST` with `{ question: string }`.
**Warning signs:** Getting 405 Method Not Allowed or trying to encode questions in URL params.

### Pitfall 2: SSE Buffer Splitting
**What goes wrong:** SSE events arrive split across multiple `read()` chunks. Parsing `data: {...}\n\n` without buffering produces invalid JSON.
**Why it happens:** TCP chunking does not align with SSE event boundaries.
**How to avoid:** Accumulate a buffer string. Split on `\n\n`. Keep the last incomplete segment in the buffer for the next read.
**Warning signs:** Intermittent JSON parse errors during streaming, especially on slow connections.

### Pitfall 3: Z-Index Wars with Docusaurus Navbar
**What goes wrong:** Chat drawer appears behind the navbar (z-index 200) or the mobile sidebar overlay (z-index 400).
**Why it happens:** Docusaurus/Infima uses defined z-index layers. Arbitrary values collide.
**How to avoid:** Use `z-index: calc(var(--ifm-z-index-overlay) + 1)` (401) for the drawer and button. This sits above all Docusaurus overlays.
**Warning signs:** Chat button disappearing behind navbar on scroll, drawer partially hidden.

### Pitfall 4: Drawer Blocks Docusaurus Mobile Sidebar
**What goes wrong:** On mobile, the chat drawer conflicts with Docusaurus's own slide-out sidebar (hamburger menu).
**Why it happens:** Both occupy the same screen space on small viewports.
**How to avoid:** When drawer is open in mobile full-screen mode, prevent body scroll with `overflow: hidden` on body. Close drawer when Docusaurus sidebar opens (or vice versa). Test both interactions.
**Warning signs:** Two overlapping panels, inability to close one of them.

### Pitfall 5: Memory Leak from Uncancelled Streams
**What goes wrong:** User navigates away mid-stream. The fetch stream continues reading in the background, updating unmounted component state.
**Why it happens:** ReadableStream reads are not automatically cancelled when components unmount.
**How to avoid:** Use `AbortController` and call `abort()` in the `useEffect` cleanup. Also abort on the Stop button (D-08).
**Warning signs:** React warnings about state updates on unmounted components.

### Pitfall 6: react-markdown ESM Import in Docusaurus
**What goes wrong:** `react-markdown` v10 is pure ESM. Some build configurations fail with "require is not defined" or similar CommonJS/ESM conflicts.
**Why it happens:** Docusaurus 3.x supports ESM, but the Rspack/Webpack bundler sometimes has edge cases.
**How to avoid:** Import normally (`import ReactMarkdown from 'react-markdown'`). Docusaurus 3.9 with `experimental_faster: true` (Rspack) handles ESM fine. If issues arise, dynamic import as fallback.
**Warning signs:** Build errors mentioning "require" or "module" for react-markdown.

## Code Examples

### Backend Contract (from Lambda handler -- verified in codebase)

**Request:**
```
POST /chat
Content-Type: application/json
{ "question": "How do I activate a SIM?" }
```

**Response (SSE stream):**
```
data: {"type":"text","content":"To activate a SIM card with 1NCE"}
data: {"type":"text","content":", you need to..."}
data: {"type":"sources","sources":[{"index":1,"url":"/docs/sim-activation/","title":"SIM Activation Guide","relevance":0.95}]}
data: [DONE]
```

**TypeScript types (from `lambda/chat-handler/types.ts`):**
```typescript
interface SSEEvent {
  type: 'text' | 'sources' | 'error' | 'done';
  content?: string;
  sources?: Source[];
  error?: string;
}

interface Source {
  index: number;     // [1], [2], etc.
  url: string;       // Page URL from metadata
  title: string;     // Page title from metadata
  relevance: number; // Score from Bedrock
}
```

### Endpoint URL Configuration Pattern
```typescript
// Follow the isGitHubPages pattern from docusaurus.config.ts
// The Lambda Function URL is environment-specific
const CHAT_ENDPOINT = process.env.CHAT_ENDPOINT
  || 'https://<lambda-function-url>.lambda-url.eu-central-1.on.aws/';

// Or: detect from site URL at runtime
// Production: help.1nce.com -> production Lambda
// GH Pages: hdgoldi.github.io -> same Lambda (CORS already configured)
```

### Infima Z-Index Reference (verified from node_modules)
```css
/* Infima z-index layers -- from infima/dist/css */
--ifm-z-index-dropdown: 100;  /* Dropdown menus */
--ifm-z-index-fixed: 200;     /* Navbar */
--ifm-z-index-overlay: 400;   /* Modal overlays */

/* Docusaurus uses: */
/* nprogress bar: 1031 */
/* Back-to-top button: calc(var(--ifm-z-index-fixed) - 1) = 199 */
/* Skip-to-content: calc(var(--ifm-z-index-fixed) + 1) = 201 */

/* Chat widget recommendation: */
/* Button: calc(var(--ifm-z-index-fixed) - 1) = 199 (same as back-to-top) */
/* Drawer: calc(var(--ifm-z-index-overlay) + 1) = 401 (above all overlays) */
```

### useColorMode Hook Usage
```typescript
// Source: @docusaurus/theme-common (verified types)
import { useColorMode } from '@docusaurus/theme-common';

function ChatDrawer() {
  const { isDarkTheme } = useColorMode();
  // Use for conditional rendering if CSS variables are insufficient
  // Prefer CSS [data-theme='dark'] selectors for styling
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| EventSource API for SSE | fetch + ReadableStream | Always (for POST) | EventSource never supported POST. fetch streaming is well-supported in all modern browsers. |
| react-markdown v8 (CommonJS) | react-markdown v10 (pure ESM) | 2024 | Must use ESM imports. No require(). |
| Class components for complex state | React hooks (useState, useReducer, useEffect) | React 16.8+ | All new code uses hooks. |
| Docusaurus v2 Root wrapper | Docusaurus v3 Root.tsx (same pattern) | 2024 | Identical API, TypeScript support improved. |

**Deprecated/outdated:**
- `EventSource` polyfills for POST: Unnecessary -- `fetch` + `ReadableStream` is cleaner and standard.
- `socket.io` or WebSocket for chat: Overkill for unidirectional streaming. SSE via fetch is simpler.

## Open Questions

1. **Lambda Function URL value**
   - What we know: Function name is `1nce-devhub-chat` in `eu-central-1`. Deploy script retrieves the URL after deployment.
   - What's unclear: The actual Function URL string. It is dynamically assigned by AWS.
   - Recommendation: Make the endpoint URL configurable. Use an environment variable injected at build time (`CHAT_ENDPOINT`) or a runtime config object. For development/testing, support a fallback or mock.

2. **Citation URL format (relative vs absolute)**
   - What we know: Lambda returns `url` from chunk metadata. The RAG content script sets URLs relative to site root (e.g., `/docs/sim-activation/`).
   - What's unclear: Whether URLs will include the `baseUrl` prefix for GitHub Pages (`/docusaurus-poc/docs/...`) or always be root-relative.
   - Recommendation: Treat citation URLs as root-relative paths. If the site runs with a non-root `baseUrl` (GitHub Pages), prepend `siteConfig.baseUrl` using `useDocusaurusContext()`.

## Sources

### Primary (HIGH confidence)
- Docusaurus official docs (swizzling, client modules, styling) -- verified patterns
- Lambda handler source code (`lambda/chat-handler/`) -- verified SSE contract and types
- Infima CSS source (`node_modules/infima/dist/`) -- verified z-index variables
- `@docusaurus/theme-common` type declarations -- verified useColorMode API
- Project `package.json` -- verified React 19.2.4, Docusaurus 3.9.2

### Secondary (MEDIUM confidence)
- react-markdown v10.1.0 version from npm registry -- verified current

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all libraries already installed except optional react-markdown; React 19 + Docusaurus 3.9 verified in package.json
- Architecture: HIGH -- Root component swizzle is the documented official pattern; SSE contract verified from actual Lambda code
- Pitfalls: HIGH -- z-index values verified from Infima source; EventSource limitation is well-documented browser behavior

**Research date:** 2026-03-23
**Valid until:** 2026-04-23 (stable -- Docusaurus 3.x API unlikely to change)
