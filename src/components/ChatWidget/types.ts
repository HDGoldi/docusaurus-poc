// Mirror of lambda/chat-handler/types.ts SSEEvent
export interface SSEEvent {
  type: 'text' | 'sources' | 'error' | 'done';
  content?: string;
  sources?: Source[];
  error?: string;
}

// Mirror of lambda/chat-handler/types.ts Source
export interface Source {
  index: number;
  url: string;
  title: string;
  relevance: number;
}

// UI message model
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'error';
  content: string;
  sources?: Source[];
  isStreaming?: boolean;
}

// Chat widget state
export type ChatState = 'idle' | 'streaming' | 'error';

// Starter question for suggestion chips (per D-14)
export interface StarterQuestion {
  label: string;
}

// Hardcoded starter questions (per D-14, UI-SPEC copywriting contract)
export const STARTER_QUESTIONS: StarterQuestion[] = [
  { label: 'How do I activate a SIM?' },
  { label: 'What authentication methods are available?' },
  { label: 'How does the MQTT integration work?' },
  { label: 'What are the data plan options?' },
];

// Chat endpoint configuration
// The Lambda Function URL is dynamically assigned by AWS.
// Resolution order:
//   1. window.__CHAT_ENDPOINT__ — manual override for local dev / testing
//   2. process.env.CHAT_ENDPOINT — build-time env var (webpack DefinePlugin)
//   3. Docusaurus customFields.chatEndpoint — set in docusaurus.config.ts
//   4. '' — fallback (triggers error state in the widget)
function resolveEndpoint(): string {
  if (typeof window !== 'undefined' && (window as any).__CHAT_ENDPOINT__) {
    return (window as any).__CHAT_ENDPOINT__ as string;
  }
  if (process.env.CHAT_ENDPOINT) {
    return process.env.CHAT_ENDPOINT;
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, global-require
    const siteConfig = require('@generated/docusaurus.config').default;
    if (siteConfig?.customFields?.chatEndpoint) {
      return siteConfig.customFields.chatEndpoint as string;
    }
  } catch {
    // Outside Docusaurus context (e.g. unit tests) — fall through
  }
  return '';
}

export const CHAT_ENDPOINT = resolveEndpoint();

// Copywriting constants (per UI-SPEC copywriting contract)
export const COPY = {
  drawerTitle: '1NCE Docs Assistant',
  welcomeMessage: 'Ask me anything about 1NCE documentation.',
  inputPlaceholder: 'Ask a question...',
  sourcesHeading: 'Sources',
  errorNetwork: 'Unable to reach the assistant. Check your connection and try again.',
  errorAuth: 'Unable to reach the assistant. Please try again later.',
  errorRateLimit: 'Too many requests. Please wait a moment before asking again.',
  errorBackend: 'The assistant is temporarily unavailable. Try again later.',
  errorGeneric: 'Something went wrong. Please try again.',
  buttonTooltip: 'Ask AI',
  sendAriaLabel: 'Send message',
  stopAriaLabel: 'Stop generating',
  closeAriaLabel: 'Close chat',
  openAriaLabel: 'Open AI chat assistant',
  drawerAriaLabel: 'Chat with 1NCE Docs Assistant',
} as const;
