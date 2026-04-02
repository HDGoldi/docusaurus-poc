import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChatState, SSEEvent, Source } from './types';
import { COPY } from './types';

interface UseChatStreamOptions {
  endpoint: string;
  onText: (content: string) => void;
  onSources: (sources: Source[]) => void;
  onError: (errorMessage: string) => void;
  onDone: () => void;
}

interface UseChatStreamReturn {
  sendMessage: (question: string) => void;
  abort: () => void;
  state: ChatState;
}

export function useChatStream({
  endpoint,
  onText,
  onSources,
  onError,
  onDone,
}: UseChatStreamOptions): UseChatStreamReturn {
  const [state, setState] = useState<ChatState>('idle');
  const abortControllerRef = useRef<AbortController | null>(null);

  // Store callbacks in refs to avoid stale closures
  const onTextRef = useRef(onText);
  const onSourcesRef = useRef(onSources);
  const onErrorRef = useRef(onError);
  const onDoneRef = useRef(onDone);

  onTextRef.current = onText;
  onSourcesRef.current = onSources;
  onErrorRef.current = onError;
  onDoneRef.current = onDone;

  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setState('idle');
  }, []);

  // Cleanup on unmount to prevent memory leaks (Pitfall 5)
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const sendMessage = useCallback(
    async (question: string) => {
      // Abort any existing stream
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;
      setState('streaming');

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question }),
          signal: controller.signal,
        });

        if (!response.ok) {
          if (response.status === 429) {
            onErrorRef.current(COPY.errorRateLimit);
          } else if (response.status === 503) {
            onErrorRef.current(COPY.errorBackend);
          } else {
            onErrorRef.current(COPY.errorGeneric);
          }
          setState('error');
          return;
        }

        if (!response.body) {
          onErrorRef.current(COPY.errorGeneric);
          setState('error');
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const events = buffer.split('\n\n');
          buffer = events.pop() || ''; // last element is incomplete

          for (const event of events) {
            const trimmed = event.trim();
            if (trimmed === 'data: [DONE]') {
              onDoneRef.current();
              setState('idle');
              return;
            }
            if (!trimmed.startsWith('data: ')) continue;

            try {
              const parsed = JSON.parse(trimmed.slice(6)) as SSEEvent;

              switch (parsed.type) {
                case 'text':
                  if (parsed.content) {
                    onTextRef.current(parsed.content);
                  }
                  break;
                case 'sources':
                  if (parsed.sources) {
                    onSourcesRef.current(parsed.sources);
                  }
                  break;
                case 'error':
                  onErrorRef.current(parsed.error || COPY.errorGeneric);
                  setState('error');
                  return;
                case 'done':
                  onDoneRef.current();
                  setState('idle');
                  return;
              }
            } catch {
              // Skip malformed JSON events
            }
          }
        }

        // Stream ended without explicit done event
        onDoneRef.current();
        setState('idle');
      } catch (err: unknown) {
        // AbortController.abort() triggers AbortError — not an error state
        if (err instanceof DOMException && err.name === 'AbortError') {
          // Keep partial content, state already set to idle by abort()
          return;
        }

        // Network errors (TypeError from fetch)
        if (err instanceof TypeError) {
          onErrorRef.current(COPY.errorNetwork);
        } else {
          onErrorRef.current(COPY.errorGeneric);
        }
        setState('error');
      }
    },
    [endpoint],
  );

  return { sendMessage, abort, state };
}
