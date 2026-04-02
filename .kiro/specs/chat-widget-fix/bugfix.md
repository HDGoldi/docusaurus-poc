# Bugfix Requirements Document

## Introduction

The "Ask AI" chat widget on the 1NCE Developer Hub has three interrelated bugs that render it largely non-functional and frustrating to use. The backend chat endpoint is never connected to the frontend, the drawer panel has no click-outside-to-close behavior and overlaps page content with no backdrop, and the close button has poor visibility due to low contrast and small hit target. Together these issues mean the feature is broken end-to-end: it cannot answer questions, it blocks the page when opened, and users struggle to dismiss it.

## Bug Analysis

### Current Behavior (Defect)

**Bug 1 — Backend Not Connected**

1.1 WHEN the site is built and deployed via the CI/CD pipeline (`.github/workflows/deploy.yml`) THEN the RAG backend stack (`infra/rag-stack.yaml`) is never deployed, and the CloudFront distribution URL for the chat API is never injected into the frontend build

1.2 WHEN `CHAT_ENDPOINT` is resolved at runtime in `src/components/ChatWidget/types.ts` THEN it falls back to an empty string `''` because neither `window.__CHAT_ENDPOINT__` nor `process.env.CHAT_ENDPOINT` are ever set during the build or at runtime

1.3 WHEN a user sends a message and `CHAT_ENDPOINT` is empty THEN the widget immediately shows a generic error message ("Something went wrong. Please try again.") without ever making a network request to a backend

**Bug 2 — Drawer Doesn't Auto-Hide & Overlaps Content**

1.4 WHEN the chat drawer is open and the user clicks outside the drawer on the page content THEN nothing happens — the drawer remains open and continues to overlay the page

1.5 WHEN the chat drawer is open on desktop THEN it covers 400px of page content with no backdrop or visual separation, and the only way to close it is the X button or navigating to a different route

**Bug 3 — Close Button Hard to See**

1.6 WHEN the chat drawer is open in light mode THEN the close button (X) is difficult to see because it uses `color: var(--ifm-font-color-base)` with no background, border, or contrast enhancement, and has a small 20x20 SVG in a container with only 4px padding

1.7 WHEN the user hovers over the close button THEN it changes to `var(--ifm-color-primary)` but there is no visible affordance in the default (non-hover) state to indicate it is an interactive element

### Expected Behavior (Correct)

**Bug 1 — Backend Not Connected**

2.1 WHEN the site is built for deployment THEN the build process SHALL receive the chat API endpoint URL (the CloudFront distribution domain from the RAG stack) and inject it as an environment variable so `CHAT_ENDPOINT` resolves to a valid URL

2.2 WHEN `CHAT_ENDPOINT` is resolved at runtime THEN it SHALL contain the full HTTPS URL of the deployed chat API CloudFront distribution, enabling the widget to make successful fetch requests to the backend

2.3 WHEN a user sends a message and `CHAT_ENDPOINT` is properly configured THEN the widget SHALL stream a response from the Bedrock RAG backend and display the answer with any relevant source citations

**Bug 2 — Drawer Doesn't Auto-Hide & Overlaps Content**

2.4 WHEN the chat drawer is open and the user clicks outside the drawer on the page content THEN the drawer SHALL close automatically

2.5 WHEN the chat drawer is open THEN a semi-transparent backdrop/overlay SHALL be displayed behind the drawer to visually separate it from the page content and signal that clicking outside will dismiss it

**Bug 3 — Close Button Hard to See**

2.6 WHEN the chat drawer is open THEN the close button SHALL have sufficient visual contrast and a larger hit target (minimum 32x32px interactive area) so it is clearly visible and easy to activate in both light and dark modes

2.7 WHEN the close button is in its default (non-hover) state THEN it SHALL have a visible background or border treatment that clearly identifies it as an interactive element

### Unchanged Behavior (Regression Prevention)

3.1 WHEN the chat drawer is open and the user presses the Escape key THEN the system SHALL CONTINUE TO close the drawer

3.2 WHEN the user navigates to a different route while the drawer is open THEN the system SHALL CONTINUE TO close the drawer and clear the message history

3.3 WHEN the chat drawer is open on mobile (viewport ≤ 768px) THEN the system SHALL CONTINUE TO display the drawer at full viewport width and lock body scroll

3.4 WHEN the user clicks the floating "Ask AI" button THEN the system SHALL CONTINUE TO open the chat drawer

3.5 WHEN the user is streaming a response and clicks the stop button THEN the system SHALL CONTINUE TO abort the stream and preserve any partial content

3.6 WHEN the user selects a suggestion chip THEN the system SHALL CONTINUE TO send that question and display the streamed response

3.7 WHEN the system encounters a 429 (rate limit) or 503 (backend unavailable) response THEN the system SHALL CONTINUE TO display the appropriate specific error message rather than a generic one

3.8 WHEN `prefers-reduced-motion` is enabled THEN the system SHALL CONTINUE TO disable drawer transition animations and blinking cursors
