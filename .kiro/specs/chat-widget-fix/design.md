# Chat Widget Fix — Bugfix Design

## Overview

The "Ask AI" chat widget on the 1NCE Developer Hub has three bugs that render it non-functional: (1) the backend endpoint is never connected because the RAG stack is not deployed and the CloudFront URL is never injected into the frontend build, (2) the chat drawer has no click-outside-to-close behavior or backdrop overlay so it blocks page content with no intuitive dismiss mechanism, and (3) the close button has low contrast, a small hit target, and no visual affordance in its default state. The fix strategy addresses each bug independently: CI/CD pipeline changes for endpoint injection, a backdrop overlay with click-outside handling for the drawer, and improved close button styling.

## Glossary

- **Bug_Condition (C)**: The union of three conditions — empty `CHAT_ENDPOINT`, missing backdrop/click-outside on the drawer, and low-visibility close button
- **Property (P)**: The desired behavior — a valid endpoint enabling backend communication, a dismissible drawer with backdrop, and a clearly visible close button
- **Preservation**: Existing behaviors that must remain unchanged — Escape key closing, route-change closing, mobile full-width drawer, body scroll lock, suggestion chips, streaming abort, error messages, reduced-motion support
- **CHAT_ENDPOINT**: The constant in `src/components/ChatWidget/types.ts` that resolves the chat API URL from `window.__CHAT_ENDPOINT__`, `process.env.CHAT_ENDPOINT`, or falls back to `''`
- **ChatDrawer**: The React component in `src/components/ChatWidget/ChatDrawer.tsx` that renders the slide-in panel with focus trap and Escape key handling
- **RAG stack**: The CloudFormation template at `infra/rag-stack.yaml` defining the Bedrock Knowledge Base, Lambda function, CloudFront distribution, and WAF
- **deploy.yml**: The GitHub Actions workflow at `.github/workflows/deploy.yml` that builds and deploys the site but currently does not deploy the RAG stack

## Bug Details

### Bug Condition

The bugs manifest across three independent conditions: (1) when the site is built and deployed, `CHAT_ENDPOINT` resolves to an empty string because the RAG stack is never deployed and the CloudFront distribution URL is never passed to the build; (2) when the chat drawer is open and the user clicks outside it, nothing happens because there is no backdrop element or click-outside listener; (3) when the drawer is open, the close button is hard to see due to `color: var(--ifm-font-color-base)` with no background, a 20×20 SVG, and only 4px padding.

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type UserInteraction
  OUTPUT: boolean

  // Bug 1: Backend not connected
  LET endpointEmpty = (CHAT_ENDPOINT === '')
  LET userSendsMessage = (input.type === 'send_message')
  LET bug1 = endpointEmpty AND userSendsMessage

  // Bug 2: Drawer doesn't auto-hide & overlaps content
  LET drawerIsOpen = (input.drawerState === 'open')
  LET clickOutside = (input.type === 'click' AND input.target NOT IN drawerElement)
  LET bug2 = drawerIsOpen AND clickOutside AND NOT drawerCloses()

  // Bug 3: Close button hard to see
  LET closeButtonVisible = hasMinContrast(closeButton, 4.5)
                           AND hitTargetSize(closeButton) >= 32
                           AND hasVisualAffordance(closeButton, 'default')
  LET bug3 = drawerIsOpen AND NOT closeButtonVisible

  RETURN bug1 OR bug2 OR bug3
END FUNCTION
```

### Examples

- **Bug 1**: User types "How do I activate a SIM?" and clicks Send → widget immediately shows "Something went wrong. Please try again." because `CHAT_ENDPOINT` is `''` and `handleSend` short-circuits before calling `streamSend`
- **Bug 2**: User opens the drawer, then clicks on the documentation content behind it → drawer stays open, content is obscured by the 400px panel with no visual separation
- **Bug 2**: User opens the drawer on mobile → drawer covers full viewport but there is no backdrop indicating it's a modal overlay
- **Bug 3**: User opens the drawer in light mode → the X button blends into the header because it has no background, border, or contrast enhancement; the 20×20 SVG with 4px padding creates a ~28×28 target below the 32×32 minimum
- **Bug 3**: User opens the drawer in dark mode → the close button is slightly more visible due to light text on dark background, but still lacks affordance in default state

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Escape key closes the drawer (existing `handleKeyDown` in `ChatDrawer.tsx`)
- Route navigation closes the drawer and clears message history (existing `useEffect` in `ChatWidget.tsx`)
- Mobile drawer renders at full viewport width with body scroll lock
- Floating "Ask AI" button opens the drawer
- Stop button aborts streaming and preserves partial content
- Suggestion chips send questions and display streamed responses
- 429/503 responses show specific error messages (rate limit / backend unavailable)
- `prefers-reduced-motion` disables drawer transition animations and blinking cursors
- Focus trap cycles through focusable elements within the drawer

**Scope:**
All inputs that do NOT involve (a) sending a message when `CHAT_ENDPOINT` is empty, (b) clicking outside an open drawer, or (c) interacting with the close button should be completely unaffected by this fix. This includes:
- All existing keyboard interactions (Escape, Tab focus trap)
- Mouse clicks on elements inside the drawer (messages, input, send button, chips)
- Streaming behavior and SSE event parsing
- Error handling for network failures, rate limits, and backend unavailability

## Hypothesized Root Cause

Based on the bug description and code analysis, the root causes are:

1. **Missing RAG Stack Deployment in CI/CD**: The `deploy.yml` workflow has no step to deploy `infra/rag-stack.yaml`. The `validate` job runs `npm run build` without setting `CHAT_ENDPOINT`. The `deploy-production` job syncs to S3 and invalidates CloudFront but never deploys the RAG stack or retrieves its outputs. The `ChatApiDistributionDomain` output from the RAG stack is never captured or injected.

2. **No Endpoint Injection into Build**: `docusaurus.config.ts` has no `customFields` entry for the chat endpoint. The `types.ts` fallback chain (`window.__CHAT_ENDPOINT__` → `process.env.CHAT_ENDPOINT` → `''`) always resolves to empty because neither source is populated during build or at runtime.

3. **No Backdrop or Click-Outside Handler**: `ChatDrawer.tsx` renders only the drawer `<div>` with no sibling backdrop element. There is no `mousedown`/`click` event listener on the document or a backdrop element to detect clicks outside the drawer. The only close triggers are the X button `onClick` and the Escape key in `handleKeyDown`.

4. **Insufficient Close Button Styling**: The `.closeButton` class in `ChatWidget.module.css` uses `background: none; border: none; padding: 4px` with a 20×20 SVG. The color is `var(--ifm-font-color-base)` which provides minimal contrast against the header background. The hover state changes color but the default state has no visual affordance (no background, border, or shadow).

## Correctness Properties

Property 1: Bug Condition — Backend Endpoint Connected

_For any_ deployment where the RAG stack has been deployed and the CI/CD pipeline has completed, the `CHAT_ENDPOINT` constant SHALL resolve to the full HTTPS URL of the ChatApiDistribution CloudFront domain, enabling the widget to make successful fetch requests to the backend.

**Validates: Requirements 2.1, 2.2, 2.3**

Property 2: Bug Condition — Drawer Dismisses on Outside Click

_For any_ state where the chat drawer is open and the user clicks on the backdrop overlay (outside the drawer panel), the drawer SHALL close automatically and the backdrop SHALL be removed.

**Validates: Requirements 2.4, 2.5**

Property 3: Bug Condition — Close Button Visibility

_For any_ state where the chat drawer is open, the close button SHALL have a minimum interactive area of 32×32px and a visible background or border treatment in its default (non-hover) state, in both light and dark modes.

**Validates: Requirements 2.6, 2.7**

Property 4: Preservation — Existing Close Mechanisms

_For any_ input that triggers an existing close mechanism (Escape key, route navigation, X button click), the drawer SHALL continue to close exactly as before, preserving focus return, message clearing on route change, and all existing behavior.

**Validates: Requirements 3.1, 3.2, 3.4**

Property 5: Preservation — Mobile and Accessibility Behavior

_For any_ viewport ≤ 768px or with `prefers-reduced-motion` enabled, the drawer SHALL continue to render at full width with body scroll lock, and animations SHALL continue to be disabled respectively.

**Validates: Requirements 3.3, 3.8**

Property 6: Preservation — Streaming and Error Handling

_For any_ interaction involving streaming responses, abort, suggestion chips, or error responses (429, 503), the widget SHALL continue to behave identically to the unfixed code.

**Validates: Requirements 3.5, 3.6, 3.7**

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct:

**File**: `.github/workflows/deploy.yml`

**Specific Changes**:
1. **Add RAG stack deployment step** to the `deploy-production` job: deploy `infra/rag-stack.yaml` via `aws cloudformation deploy` before the site build, or as a prerequisite job
2. **Capture CloudFront domain output**: after RAG stack deployment, retrieve the `ChatApiDistributionDomain` output using `aws cloudformation describe-stacks`
3. **Inject endpoint into build**: set `CHAT_ENDPOINT` as an environment variable when running `npm run build` so Docusaurus can embed it via `process.env.CHAT_ENDPOINT`

**File**: `docusaurus.config.ts`

**Specific Changes**:
4. **Add customFields** with `chatEndpoint: process.env.CHAT_ENDPOINT || ''` so the value is available at build time and can be referenced by the widget

**File**: `src/components/ChatWidget/types.ts`

**Specific Changes**:
5. **Update CHAT_ENDPOINT resolution** to read from Docusaurus `customFields` via `useDocusaurusContext` or the global `siteConfig`, falling back to the existing chain. Alternatively, keep the `process.env.CHAT_ENDPOINT` approach if the build injects it correctly.

**File**: `src/components/ChatWidget/ChatDrawer.tsx`

**Specific Changes**:
6. **Add backdrop element**: render a sibling `<div>` with a semi-transparent background behind the drawer when `isOpen` is true
7. **Add click handler on backdrop**: clicking the backdrop calls `onClose()`
8. **Ensure backdrop is below drawer in z-index** but above page content

**File**: `src/components/ChatWidget/ChatWidget.module.css`

**Specific Changes**:
9. **Add `.backdrop` class**: `position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index` one level below the drawer
10. **Update `.closeButton`**: increase padding to at least 6px (giving 32×32 minimum with the 20×20 SVG), add `border-radius: 6px`, add a subtle background (`rgba(0,0,0,0.06)` light / `rgba(255,255,255,0.1)` dark), ensure sufficient contrast
11. **Update `.closeButton:hover`**: add background color change for clear hover feedback
12. **Add reduced-motion support for backdrop** if it has a fade transition

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bugs on unfixed code, then verify the fixes work correctly and preserve existing behavior.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bugs BEFORE implementing the fix. Confirm or refute the root cause analysis. If we refute, we will need to re-hypothesize.

**Test Plan**: Write tests that verify endpoint resolution, backdrop rendering, click-outside behavior, and close button styling. Run these tests on the UNFIXED code to observe failures and understand the root causes.

**Test Cases**:
1. **Endpoint Resolution Test**: Assert that `CHAT_ENDPOINT` resolves to a non-empty HTTPS URL (will fail on unfixed code — resolves to `''`)
2. **Backdrop Rendering Test**: Assert that when the drawer is open, a backdrop element with `position: fixed` and semi-transparent background exists in the DOM (will fail on unfixed code — no backdrop element)
3. **Click-Outside Close Test**: Simulate a click on the backdrop/outside area and assert the drawer closes (will fail on unfixed code — no handler)
4. **Close Button Hit Target Test**: Assert that the close button's computed interactive area is ≥ 32×32px (will fail on unfixed code — ~28×28px)
5. **Close Button Affordance Test**: Assert that the close button has a visible background or border in its default state (will fail on unfixed code — `background: none; border: none`)

**Expected Counterexamples**:
- `CHAT_ENDPOINT` evaluates to `''`, causing immediate error on send
- No backdrop DOM element found when drawer is open
- Click outside drawer does not trigger `onClose`
- Close button computed size is below 32×32px threshold

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed function produces the expected behavior.

**Pseudocode:**
```
FOR ALL input WHERE isBugCondition(input) DO
  IF input.type === 'send_message' AND endpointWasEmpty THEN
    ASSERT CHAT_ENDPOINT matches /^https:\/\/.+/
    result := handleSend(input.text)
    ASSERT fetch was called with CHAT_ENDPOINT
  END IF

  IF input.type === 'click_outside' AND drawerIsOpen THEN
    result := clickBackdrop()
    ASSERT drawerIsOpen === false
    ASSERT backdropElement NOT IN DOM
  END IF

  IF drawerIsOpen THEN
    ASSERT closeButton.computedWidth >= 32
    ASSERT closeButton.computedHeight >= 32
    ASSERT closeButton.hasVisibleBackground === true
  END IF
END FOR
```

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed function produces the same result as the original function.

**Pseudocode:**
```
FOR ALL input WHERE NOT isBugCondition(input) DO
  ASSERT ChatWidget_original(input) = ChatWidget_fixed(input)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across the input domain
- It catches edge cases that manual unit tests might miss
- It provides strong guarantees that behavior is unchanged for all non-buggy inputs

**Test Plan**: Observe behavior on UNFIXED code first for Escape key, route changes, mobile rendering, streaming, and error handling, then write property-based tests capturing that behavior.

**Test Cases**:
1. **Escape Key Preservation**: Verify pressing Escape with drawer open continues to close the drawer after the fix
2. **Route Change Preservation**: Verify navigating to a new route closes the drawer and clears messages after the fix
3. **Mobile Layout Preservation**: Verify drawer renders at 100vw with body scroll lock on viewports ≤ 768px after the fix
4. **Focus Trap Preservation**: Verify Tab cycling through focusable elements within the drawer continues to work after the fix
5. **Streaming Abort Preservation**: Verify clicking Stop during streaming aborts the request and preserves partial content after the fix
6. **Suggestion Chip Preservation**: Verify clicking a suggestion chip sends the question and displays the response after the fix
7. **Error Message Preservation**: Verify 429 and 503 responses continue to show specific error messages after the fix
8. **Reduced Motion Preservation**: Verify `prefers-reduced-motion` continues to disable animations after the fix

### Unit Tests

- Test `CHAT_ENDPOINT` resolution with `process.env.CHAT_ENDPOINT` set to a valid URL
- Test `CHAT_ENDPOINT` resolution with `process.env.CHAT_ENDPOINT` unset (should still fall back gracefully)
- Test backdrop renders when `isOpen={true}` and does not render when `isOpen={false}`
- Test clicking backdrop calls `onClose`
- Test clicking inside the drawer does NOT call `onClose`
- Test close button has computed dimensions ≥ 32×32px
- Test close button has visible background in default state (not `background: none`)
- Test Escape key still closes the drawer (regression)
- Test focus trap still works with backdrop in the DOM (regression)

### Property-Based Tests

- Generate random sequences of open/close/click-outside actions and verify the drawer state is always consistent (open after open, closed after close/click-outside/escape)
- Generate random viewport widths and verify the drawer renders at correct width (400px for >768px, 100vw for ≤768px) regardless of backdrop presence
- Generate random message sequences and verify streaming, abort, and error handling are unaffected by the backdrop and close button style changes

### Integration Tests

- Test full flow: open drawer → type question → receive streamed response → click outside to close → verify drawer closes and response is preserved on reopen
- Test deploy pipeline: verify RAG stack deployment step produces a `ChatApiDistributionDomain` output and it is injected into the build
- Test mobile flow: open drawer on mobile viewport → verify backdrop + full-width drawer → click backdrop → verify drawer closes and body scroll unlocks
- Test accessibility: verify focus moves to drawer on open, focus trap works with backdrop, focus returns to button on close via backdrop click
