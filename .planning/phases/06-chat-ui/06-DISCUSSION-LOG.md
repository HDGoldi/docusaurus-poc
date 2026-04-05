# Phase 6: Chat UI - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-23
**Phase:** 06-chat-ui
**Areas discussed:** Widget placement & layout, Conversation UX, Citations & source links, Starter experience

---

## Widget Placement & Layout

| Option | Description | Selected |
|--------|-------------|----------|
| Bottom-right corner | Standard position for chat widgets (Intercom, Zendesk, ReadMe). Users expect it here. | ✓ |
| Bottom-left corner | Less conventional. Could conflict with sidebar toggle on mobile. | |
| Navbar integration | Chat icon in the top navbar instead of a floating button. | |

**User's choice:** Bottom-right corner
**Notes:** None

---

| Option | Description | Selected |
|--------|-------------|----------|
| Slide-out drawer from right | Overlays content without navigating away. Matches CHAT-01. | ✓ |
| Full-screen modal | Takes over viewport. Hides documentation context. | |
| Inline expanding panel | Expands upward from button. Limited conversation space. | |

**User's choice:** Slide-out drawer from right
**Notes:** None

---

| Option | Description | Selected |
|--------|-------------|----------|
| Full-screen takeover | Drawer becomes full-screen on small viewports. Standard mobile chat pattern. | ✓ |
| Bottom sheet (half screen) | Slides up covering ~60% of screen. Cramped with keyboard. | |
| Same as desktop | Same drawer width/position. May be too narrow on small screens. | |

**User's choice:** Full-screen takeover
**Notes:** None

---

| Option | Description | Selected |
|--------|-------------|----------|
| Show on all builds | Useful for testing. Lambda CORS supports GH Pages origin. | ✓ |
| Production only | Hide on GitHub Pages using DEPLOY_TARGET. | |

**User's choice:** Yes, show on all builds
**Notes:** None

---

## Conversation UX

| Option | Description | Selected |
|--------|-------------|----------|
| Chat bubbles | User right-aligned, AI left-aligned with different backgrounds. Familiar pattern. | ✓ |
| Plain text thread | Flat list with labels. Cleaner, documentation-like. | |
| Card-based | Each AI response in a card with sections. Structured but heavy. | |

**User's choice:** Chat bubbles
**Notes:** None

---

| Option | Description | Selected |
|--------|-------------|----------|
| Persist until page navigation | Closing/reopening on same page shows previous messages. Navigation resets. | ✓ |
| Persist across pages (session) | Messages survive page navigation. Requires sessionStorage. | |
| Always reset on close | Every open starts fresh. Simplest but frustrating. | |

**User's choice:** Persist until page navigation
**Notes:** None

---

| Option | Description | Selected |
|--------|-------------|----------|
| Append character by character | Tokens appear as they arrive from SSE with blinking cursor. | ✓ |
| Word-by-word with fade | Each word fades in. Smoother but complex. | |
| Chunk-based update | Buffer and update in chunks. Less smooth. | |

**User's choice:** Append character by character
**Notes:** None

---

| Option | Description | Selected |
|--------|-------------|----------|
| Disable input during streaming | Input disabled with Stop button. Prevents parallel streams. | ✓ |
| Allow queuing | User can type next question while streaming. Queued. | |

**User's choice:** No — disable input during streaming
**Notes:** None

---

## Citations & Source Links

| Option | Description | Selected |
|--------|-------------|----------|
| Superscript links | Small superscript numbers like footnotes, styled in 1NCE teal. | ✓ |
| Inline badges | Pill/badge elements with background color. | |
| Tooltip on hover | Plain text numbers, hover reveals source. | |

**User's choice:** Superscript links
**Notes:** None

---

| Option | Description | Selected |
|--------|-------------|----------|
| Navigate in same tab | Closes drawer, navigates to cited page. | ✓ |
| Open in new tab | Opens in new tab, user stays in chat. | |
| Preview in drawer | Show snippet of cited page in drawer. | |

**User's choice:** Navigate in same tab
**Notes:** None

---

| Option | Description | Selected |
|--------|-------------|----------|
| Below the response | "Sources" list with titles and links after each response. | ✓ |
| Expandable accordion | Collapsed "Sources (3)" that expands on click. | |
| Side panel | Sources in separate drawer section/tab. | |

**User's choice:** Below the response
**Notes:** None

---

| Option | Description | Selected |
|--------|-------------|----------|
| Page-level links | Link to doc page URL. Simple and reliable. | ✓ |
| Section-level if available | Use section anchors when available, fall back to page. | |

**User's choice:** Page-level links
**Notes:** None

---

## Starter Experience

| Option | Description | Selected |
|--------|-------------|----------|
| Welcome message + suggestion chips | Brief greeting with 3-4 clickable question chips. | ✓ |
| Illustration + suggestions | Icon/illustration above greeting and chips. | |
| Just an input prompt | Empty drawer with only input field. | |

**User's choice:** Welcome message + suggestion chips
**Notes:** None

---

| Option | Description | Selected |
|--------|-------------|----------|
| Hardcoded popular topics | 3-4 curated questions. Easy to maintain. | ✓ |
| Context-aware per page | Different suggestions based on current page. Complex. | |
| Dynamic from KB | Fetch popular questions from backend. Needs new endpoint. | |

**User's choice:** Hardcoded popular topics
**Notes:** None

---

| Option | Description | Selected |
|--------|-------------|----------|
| Generic — '1NCE Docs Assistant' | Simple label, no avatar. Professional. | ✓ |
| Branded persona | Named with custom avatar. More personality. | |
| No identity | No name or label. Most minimal. | |

**User's choice:** Generic — '1NCE Docs Assistant'
**Notes:** None

---

| Option | Description | Selected |
|--------|-------------|----------|
| Icon only | Chat bubble icon, tooltip on hover. Minimal footprint. | ✓ |
| Icon + label | Icon with 'Ask AI' text always visible. | |
| Animated/pulsing | Icon with pulse animation on first visit. | |

**User's choice:** Icon only
**Notes:** None

---

## Claude's Discretion

- Drawer width and animation timing
- Chat bubble styling details
- Markdown rendering in AI responses
- Error state UI
- Loading/typing indicator design
- Z-index layering
- Lambda endpoint URL configuration
- Keyboard shortcuts
- Input field features

## Deferred Ideas

None — discussion stayed within phase scope.
