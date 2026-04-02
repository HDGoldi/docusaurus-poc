# Implementation Plan

- [x] 1. Write bug condition exploration tests
  - **Property 1: Bug Condition** - Chat Widget Triple Bug (Endpoint Empty, No Backdrop, Close Button Invisible)
  - **CRITICAL**: This test MUST FAIL on unfixed code — failure confirms the bugs exist
  - **DO NOT attempt to fix the tests or the code when they fail**
  - **NOTE**: These tests encode the expected behavior — they will validate the fixes when they pass after implementation
  - **GOAL**: Surface counterexamples that demonstrate all three bugs exist
  - **Scoped PBT Approach**: Scope properties to concrete failing cases for each bug
  - Bug 1 — Endpoint Resolution: Assert that `CHAT_ENDPOINT` (from `src/components/ChatWidget/types.ts`) resolves to a non-empty string matching `/^https:\/\/.+/`. On unfixed code, `CHAT_ENDPOINT` is `''` because neither `window.__CHAT_ENDPOINT__` nor `process.env.CHAT_ENDPOINT` are set.
  - Bug 2 — Backdrop & Click-Outside: Render `<ChatDrawer isOpen={true} onClose={mockFn}>` and assert a backdrop element with `position: fixed` and semi-transparent background exists in the DOM. Simulate click on backdrop and assert `onClose` is called. On unfixed code, no backdrop element exists and clicking outside does nothing.
  - Bug 3 — Close Button Visibility: Render `<ChatDrawer isOpen={true} onClose={mockFn}>` and assert the close button has computed interactive area ≥ 32×32px and has a visible background or border in default state (not `background: none; border: none`). On unfixed code, the button is ~28×28px with no background.
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests FAIL (this is correct — it proves the bugs exist)
  - Document counterexamples found:
    - `CHAT_ENDPOINT` evaluates to `''`, causing immediate error on send
    - No backdrop DOM element found when drawer is open
    - Click outside drawer does not trigger `onClose`
    - Close button computed size is below 32×32px threshold
    - Close button has no visible background in default state
  - Mark task complete when tests are written, run, and failures are documented
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_

- [x] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Existing Chat Widget Behavior Unchanged
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for non-buggy inputs, then write property-based tests capturing observed behavior:
  - Escape Key: Render `<ChatDrawer isOpen={true} onClose={mockFn}>`, simulate Escape keydown, observe `onClose` is called on unfixed code. Write property test asserting this holds.
  - Route Change: Render `<ChatWidget>`, simulate route change, observe drawer closes and messages clear on unfixed code. Write property test asserting this holds.
  - Mobile Layout: Render `<ChatDrawer>` at viewport ≤ 768px, observe drawer renders at `width: 100vw` with `border-left: none` on unfixed code. Write property test asserting this holds.
  - Focus Trap: Render `<ChatDrawer isOpen={true}>` with multiple focusable elements, simulate Tab from last element, observe focus wraps to first element on unfixed code. Write property test asserting this holds.
  - Streaming & Abort: Observe that `useChatStream` abort cancels the AbortController and sets state to `idle` on unfixed code. Write property test asserting this holds.
  - Suggestion Chips: Observe that clicking a chip calls `onSelect` with the chip label on unfixed code. Write property test asserting this holds.
  - Error Messages: Observe that 429 responses trigger `COPY.errorRateLimit` and 503 responses trigger `COPY.errorBackend` on unfixed code. Write property test asserting this holds.
  - Reduced Motion: Observe that `prefers-reduced-motion` media query sets `transition-duration: 0ms` on drawer and `animation: none` on dots/cursor on unfixed code. Write property test asserting this holds.
  - Verify all preservation tests PASS on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

- [ ] 3. Fix Bug 1 — Backend Not Connected (Endpoint Injection)

  - [-] 3.1 Add RAG stack deployment step to `deploy-production` job in `.github/workflows/deploy.yml`
    - Add a step before the site build that deploys `infra/rag-stack.yaml` via `aws cloudformation deploy`
    - Use the existing OIDC credentials from `configure-aws-credentials`
    - Pass required parameters (`LambdaCodeBucketName`, `LambdaCodeKey`) from GitHub environment variables
    - _Bug_Condition: isBugCondition(input) where CHAT_ENDPOINT === '' AND input.type === 'send_message'_
    - _Expected_Behavior: RAG stack is deployed and ChatApiDistributionDomain output is available_
    - _Preservation: Existing deploy-production steps (S3 sync, CloudFront invalidation, smoke test) remain unchanged_
    - _Requirements: 2.1_

  - [~] 3.2 Capture CloudFront domain output and inject `CHAT_ENDPOINT` into the build
    - After RAG stack deployment, retrieve `ChatApiDistributionDomain` output using `aws cloudformation describe-stacks`
    - Set `CHAT_ENDPOINT` as an environment variable when running `npm run build` in the `validate` job
    - Format as `https://<ChatApiDistributionDomain>` so the endpoint is a full HTTPS URL
    - _Bug_Condition: isBugCondition(input) where process.env.CHAT_ENDPOINT is undefined at build time_
    - _Expected_Behavior: CHAT_ENDPOINT resolves to full HTTPS URL of ChatApiDistribution CloudFront domain_
    - _Preservation: Build output structure and all other environment variables remain unchanged_
    - _Requirements: 2.1, 2.2_

  - [~] 3.3 Add `customFields` to `docusaurus.config.ts`
    - Add `customFields: { chatEndpoint: process.env.CHAT_ENDPOINT || '' }` to the config object
    - This makes the endpoint available at build time for Docusaurus to embed
    - _Bug_Condition: isBugCondition(input) where docusaurus.config.ts has no customFields for chat endpoint_
    - _Expected_Behavior: chatEndpoint is available via siteConfig.customFields at runtime_
    - _Preservation: All existing config (plugins, themes, navbar, footer) remains unchanged_
    - _Requirements: 2.1, 2.2_

  - [~] 3.4 Update `CHAT_ENDPOINT` resolution in `src/components/ChatWidget/types.ts`
    - Update the fallback chain to also read from `siteConfig.customFields.chatEndpoint` if available
    - Keep existing `window.__CHAT_ENDPOINT__` and `process.env.CHAT_ENDPOINT` fallbacks for local dev
    - _Bug_Condition: isBugCondition(input) where CHAT_ENDPOINT always resolves to '' in production_
    - _Expected_Behavior: CHAT_ENDPOINT resolves to the injected CloudFront domain URL_
    - _Preservation: Local dev fallback to '' still works, existing window override still works_
    - _Requirements: 2.2, 2.3_

- [ ] 4. Fix Bug 2 — Drawer Doesn't Auto-Hide (Backdrop & Click-Outside)

  - [~] 4.1 Add backdrop element and click handler to `src/components/ChatWidget/ChatDrawer.tsx`
    - Render a sibling `<div>` with the `.backdrop` class when `isOpen` is true
    - Add `onClick={onClose}` on the backdrop element
    - Ensure backdrop is rendered before the drawer in the DOM so it sits behind it in z-index
    - Backdrop should not render when drawer is closed
    - _Bug_Condition: isBugCondition(input) where drawerIsOpen AND clickOutside AND NOT drawerCloses()_
    - _Expected_Behavior: Clicking backdrop calls onClose(), drawer closes, backdrop is removed_
    - _Preservation: Escape key, focus trap, route-change close all continue to work unchanged_
    - _Requirements: 2.4, 2.5_

  - [~] 4.2 Add `.backdrop` CSS class to `src/components/ChatWidget/ChatWidget.module.css`
    - `position: fixed; inset: 0; background: rgba(0,0,0,0.3)`
    - z-index one level below the drawer (use `var(--ifm-z-index-overlay)`)
    - Add `prefers-reduced-motion` support: disable fade transition if backdrop has one
    - _Bug_Condition: isBugCondition(input) where no visual separation exists between drawer and page_
    - _Expected_Behavior: Semi-transparent backdrop visually separates drawer from page content_
    - _Preservation: Mobile full-width drawer, body scroll lock, all existing styles unchanged_
    - _Requirements: 2.5_

- [ ] 5. Fix Bug 3 — Close Button Hard to See (Styling)

  - [~] 5.1 Update `.closeButton` CSS in `src/components/ChatWidget/ChatWidget.module.css`
    - Increase padding to at least 6px (giving 32×32 minimum with the 20×20 SVG)
    - Add `border-radius: 6px`
    - Add subtle background: `rgba(0,0,0,0.06)` for light mode
    - Add dark mode background: `rgba(255,255,255,0.1)` via `[data-theme='dark']` selector
    - Ensure minimum 32×32px interactive area
    - _Bug_Condition: isBugCondition(input) where closeButton hit target < 32px AND no visual affordance_
    - _Expected_Behavior: closeButton has ≥ 32×32px hit target and visible background in default state_
    - _Preservation: Close button onClick behavior, aria-label, SVG icon all unchanged_
    - _Requirements: 2.6, 2.7_

  - [~] 5.2 Update `.closeButton:hover` CSS for clear hover feedback
    - Add background color change on hover (e.g., `rgba(0,0,0,0.1)` light, `rgba(255,255,255,0.15)` dark)
    - Keep existing `color: var(--ifm-color-primary)` on hover
    - _Bug_Condition: isBugCondition(input) where hover state only changes color with no background change_
    - _Expected_Behavior: Hover state has both color change and background change for clear feedback_
    - _Preservation: Existing hover color behavior preserved_
    - _Requirements: 2.7_

- [ ] 6. Verify fixes

  - [~] 6.1 Verify bug condition exploration tests now pass
    - **Property 1: Expected Behavior** - Chat Widget Triple Bug Fixed
    - **IMPORTANT**: Re-run the SAME tests from task 1 — do NOT write new tests
    - The tests from task 1 encode the expected behavior
    - When these tests pass, it confirms the expected behavior is satisfied for all three bugs
    - Run bug condition exploration tests from step 1
    - **EXPECTED OUTCOME**: Tests PASS (confirms all three bugs are fixed)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

  - [~] 6.2 Verify preservation tests still pass
    - **Property 2: Preservation** - Existing Chat Widget Behavior Unchanged
    - **IMPORTANT**: Re-run the SAME tests from task 2 — do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm Escape key, route change, mobile layout, focus trap, streaming, chips, errors, and reduced motion all still work after fixes

- [~] 7. Checkpoint - Ensure all tests pass
  - Run full test suite to confirm all bug condition and preservation tests pass
  - Verify no regressions in existing functionality
  - Ensure all tests pass, ask the user if questions arise
