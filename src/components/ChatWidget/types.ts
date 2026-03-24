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
// Use customFields in docusaurus.config.ts or an env var at build time.
// Fallback for local dev: empty string triggers error state.
export const CHAT_ENDPOINT =
  (typeof window !== 'undefined' && (window as any).__CHAT_ENDPOINT__) ||
  process.env.CHAT_ENDPOINT ||
  '';

// Copywriting constants (per UI-SPEC copywriting contract)
export const COPY = {
  drawerTitle: '1NCE Docs Assistant',
  welcomeMessage: 'Ask me anything about 1NCE documentation.',
  inputPlaceholder: 'Ask a question...',
  sourcesHeading: 'Sources',
  errorNetwork: 'Unable to reach the assistant. Check your connection and try again.',
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
