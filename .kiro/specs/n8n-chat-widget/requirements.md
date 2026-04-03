# Requirements Document

## Introduction

Replace the existing custom-built chat widget frontend (located in `src/components/ChatWidget/`) with the `@n8n/chat` embedded chat widget. The current custom React implementation connects to an AWS Lambda RAG backend that is not functioning. This change swaps only the frontend chat UI to use the n8n chat webhook endpoint while leaving all existing infrastructure (Lambda, CloudFormation, RAG pipeline) untouched for potential future use.

## Glossary

- **Chat_Widget**: The embedded chat UI component rendered globally on every page of the Developer Hub, providing conversational AI assistance to users.
- **Root_Wrapper**: The Docusaurus theme root component (`src/theme/Root.tsx`) that wraps all page content and mounts global components like the Chat_Widget.
- **n8n_Chat**: The `@n8n/chat` npm package that provides a pre-built, embeddable chat widget with configurable webhook integration.
- **Webhook_Endpoint**: The n8n chat webhook URL (`https://n8n.dev.1nce.ai/webhook/cd4f96e9-4577-428e-bc50-27efee023e1f/chat`) that receives and responds to chat messages.
- **Basic_Auth**: HTTP Basic Authentication using a base64-encoded `username:password` string sent in the `Authorization` header.
- **Old_ChatWidget**: The existing custom React chat implementation in `src/components/ChatWidget/` consisting of ChatButton, ChatDrawer, ChatInput, ChatMessage, CitationList, SuggestionChips, types, useChatStream, and associated CSS modules.

## Requirements

### Requirement 1: Install n8n Chat Dependency

**User Story:** As a developer, I want the `@n8n/chat` package added to the project dependencies, so that the embedded chat widget is available for use.

#### Acceptance Criteria

1. THE Build_System SHALL include `@n8n/chat` as a production dependency in `package.json`.
2. WHEN `pnpm install` is executed, THE Build_System SHALL resolve and install the `@n8n/chat` package without dependency conflicts.

### Requirement 2: Integrate n8n Chat Widget in Root Wrapper

**User Story:** As a site visitor, I want a chat widget available on every page, so that I can ask questions from anywhere on the Developer Hub.

#### Acceptance Criteria

1. THE Root_Wrapper SHALL initialize the n8n_Chat widget using the `createChat` function from `@n8n/chat`.
2. THE Root_Wrapper SHALL import the `@n8n/chat/style.css` stylesheet to apply default widget styling.
3. THE Chat_Widget SHALL use `mode: 'window'` to render as a floating chat window overlay.
4. WHEN the page loads, THE Chat_Widget SHALL display a toggle button for opening the chat window.
5. THE Chat_Widget SHALL configure the Webhook_Endpoint as the target URL for all chat messages.
6. THE Chat_Widget SHALL send an HTTP `Authorization` header with Basic_Auth credentials (username `master`, password from configuration) on every webhook request.
7. THE Chat_Widget SHALL set `showWelcomeScreen` to `false` to skip the welcome screen and go directly to the chat interface.
8. THE Chat_Widget SHALL display initial greeting messages to orient the user when the chat window is first opened.
9. THE Chat_Widget SHALL provide localized UI text including a title, subtitle, and input placeholder via the `i18n` configuration.

### Requirement 3: Remove Old Custom Chat Widget

**User Story:** As a developer, I want the old custom chat widget code removed, so that the codebase has no dead code and maintenance burden is reduced.

#### Acceptance Criteria

1. WHEN the n8n_Chat integration is complete, THE Developer SHALL remove all files in the `src/components/ChatWidget/` directory including ChatButton.tsx, ChatDrawer.tsx, ChatInput.tsx, ChatMessage.tsx, CitationList.tsx, SuggestionChips.tsx, ChatWidget.tsx, ChatWidget.module.css, types.ts, useChatStream.ts, and all test files.
2. THE Root_Wrapper SHALL no longer import any component from the `src/components/ChatWidget/` directory.

### Requirement 4: Style the Chat Widget to Match 1NCE Brand

**User Story:** As a site visitor, I want the chat widget to visually match the Developer Hub brand, so that the experience feels cohesive.

#### Acceptance Criteria

1. THE Chat_Widget SHALL use CSS variable overrides to align the primary color with the 1NCE brand color (`#29abe2`).
2. THE Chat_Widget SHALL be visually consistent in both light mode and dark mode themes.
3. THE Chat_Widget SHALL render above all other page content using appropriate z-index values so it is not obscured by the navbar, footer, or other elements.

### Requirement 5: Preserve Existing Infrastructure

**User Story:** As a developer, I want the Lambda backend and infrastructure code left untouched, so that the RAG-based chat can be restored in the future.

#### Acceptance Criteria

1. THE Developer SHALL leave the `lambda/chat-handler/` directory and its contents unchanged.
2. THE Developer SHALL leave the `infra/rag-stack.yaml` CloudFormation template unchanged.
3. THE Developer SHALL leave the `infra/template.yaml` CloudFormation template unchanged.
