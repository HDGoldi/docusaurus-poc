# Implementation Plan: n8n Chat Widget

## Overview

Replace the custom-built chat widget with the `@n8n/chat` embedded widget. The implementation follows four incremental steps: install the dependency, integrate the widget in Root.tsx, add brand styling, and remove the old code. Each step builds on the previous one so the site remains functional throughout.

## Tasks

- [x] 1. Install `@n8n/chat` dependency
  - Add `@n8n/chat` as a production dependency in `package.json`
  - Run `pnpm install` to resolve and install the package
  - _Requirements: 1.1, 1.2_

- [x] 2. Integrate n8n Chat widget in Root.tsx and add brand styling
  - [x] 2.1 Replace ChatWidget import with `createChat()` initialization in `src/theme/Root.tsx`
    - Remove the `ChatWidget` import from `@site/src/components/ChatWidget/ChatWidget`
    - Add static import for `@n8n/chat/style.css`
    - Add `useEffect` hook with dynamic `import('@n8n/chat')` calling `createChat()`
    - Configure `webhookUrl` to `https://n8n.dev.1nce.ai/webhook/cd4f96e9-4577-428e-bc50-27efee023e1f/chat`
    - Configure `webhookConfig.headers` with Basic Auth (`'Basic ' + btoa('master:[PLACEHOLDER_PASSWORD]')`)
    - Set `mode: 'window'`, `showWelcomeScreen: false`
    - Set `initialMessages` with greeting text
    - Set `i18n.en` with title, subtitle, inputPlaceholder, getStarted, closeButtonTooltip
    - Remove the `<ChatWidget />` JSX element, return only `<>{children}</>`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9_

  - [x] 2.2 Add n8n Chat CSS variable overrides in `src/css/custom.css`
    - Add `--chat--color-primary: #29abe2` and shade variables in `:root`
    - Add `--chat--color-secondary: #194a7d` and shade variables in `:root`
    - Add `--chat--window--width`, `--chat--window--height`, `--chat--header-height`
    - Add `--chat--window--z-index: 10000` to float above navbar and overlays
    - Add dark mode overrides in `[data-theme='dark']` block
    - _Requirements: 4.1, 4.2, 4.3_

  - [x] 2.3 Write unit tests for Root.tsx `createChat()` integration
    - Create `src/theme/__tests__/Root.test.tsx`
    - Mock `@n8n/chat` module and verify `createChat()` is called with correct config
    - Assert `webhookUrl`, `mode: 'window'`, `showWelcomeScreen: false`
    - Assert `initialMessages` array is provided
    - Assert `i18n.en` contains title, subtitle, inputPlaceholder keys
    - Assert `webhookConfig.headers.Authorization` starts with `'Basic '`
    - _Requirements: 2.1, 2.3, 2.5, 2.6, 2.7, 2.8, 2.9_

  - [x] 2.4 Write property test for Basic Auth encoding round trip
    - Create `src/theme/__tests__/Root.property.test.ts`
    - **Property 1: Basic Auth Header Encoding Round Trip**
    - For any username (no colon) and password, `base64decode(base64encode(username + ':' + password))` yields the original string
    - Use `fast-check` with minimum 100 iterations
    - Tag: `Feature: n8n-chat-widget, Property 1: Basic Auth Header Encoding Round Trip`
    - **Validates: Requirements 2.6**

- [x] 3. Checkpoint — Verify n8n chat widget works
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Remove old custom chat widget
  - [x] 4.1 Delete the entire `src/components/ChatWidget/` directory
    - Remove `ChatButton.tsx`, `ChatDrawer.tsx`, `ChatInput.tsx`, `ChatMessage.tsx`
    - Remove `CitationList.tsx`, `SuggestionChips.tsx`
    - Remove `ChatWidget.tsx`, `ChatWidget.module.css`
    - Remove `types.ts`, `useChatStream.ts`
    - Remove `ChatWidget.bugcondition.test.tsx`, `ChatWidget.preservation.test.tsx`
    - Remove `__tests__/useChatStream.bugCondition.test.ts`, `__tests__/useChatStream.preservation.test.ts`
    - _Requirements: 3.1, 3.2_

  - [x] 4.2 Verify no remaining imports reference old ChatWidget
    - Confirm `src/theme/Root.tsx` does not import from `src/components/ChatWidget/`
    - Confirm no other files reference the deleted directory
    - _Requirements: 3.2_

- [x] 5. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Requirement 5 (preserve existing infrastructure) requires no code changes — `lambda/chat-handler/`, `infra/rag-stack.yaml`, and `infra/template.yaml` must remain untouched
- Each task references specific requirements for traceability
- Property tests validate the Basic Auth encoding correctness property from the design document
- The `[PLACEHOLDER_PASSWORD]` in the Basic Auth config should be replaced with the actual deployment password during implementation
