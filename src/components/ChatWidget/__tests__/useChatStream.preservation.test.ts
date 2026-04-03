/**
 * Preservation Property Tests — Non-403 Error Handling & SSE Streaming
 *
 * These tests capture the EXISTING behavior of useChatStream on UNFIXED code.
 * They must PASS on unfixed code, confirming the baseline we need to preserve.
 *
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6**
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import * as fc from 'fast-check';
import { useChatStream } from '../useChatStream';
import { COPY } from '../types';

const TEST_ENDPOINT = 'https://chat-api.example.com';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Create a Response with a given HTTP status and empty body. */
function makeErrorResponse(status: number): Response {
  return new Response('', { status, statusText: `Status ${status}` });
}

/** Create a 200 Response whose body is an SSE stream built from raw text. */
function makeSSEResponse(sseText: string): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(sseText));
      controller.close();
    },
  });
  return new Response(stream, {
    status: 200,
    headers: { 'Content-Type': 'text/event-stream' },
  });
}

/** Render the hook with spied callbacks and return everything needed. */
function renderChatHook() {
  const onText = vi.fn();
  const onSources = vi.fn();
  const onError = vi.fn();
  const onDone = vi.fn();
  const hookResult = renderHook(() =>
    useChatStream({
      endpoint: TEST_ENDPOINT,
      onText,
      onSources,
      onError,
      onDone,
    }),
  );
  return { ...hookResult, onText, onSources, onError, onDone };
}

// ---------------------------------------------------------------------------
// Test suite
// ---------------------------------------------------------------------------

describe('Preservation — Non-403 Error Handling & SSE Streaming', () => {
  let originalFetch: typeof globalThis.fetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  // =========================================================================
  // Property-based tests — HTTP error status mapping (non-403)
  // =========================================================================

  describe('Property: non-403 HTTP status → correct error message', () => {
    /**
     * **Validates: Requirements 3.3, 3.5**
     *
     * _For any_ HTTP status code that is NOT 403 and is not 2xx (i.e. an error),
     * the error message mapping must be:
     *   429 → COPY.errorRateLimit
     *   503 → COPY.errorBackend
     *   other → COPY.errorGeneric
     */
    it('property: non-403 error status codes map to the correct error message', async () => {
      // Generate non-403 HTTP error status codes (4xx and 5xx, excluding 403)
      const statusArb = fc.integer({ min: 400, max: 599 }).filter((s) => s !== 403);

      const samples = fc.sample(statusArb, 30);

      for (const status of samples) {
        globalThis.fetch = vi.fn().mockResolvedValue(makeErrorResponse(status));

        const { result, onError, unmount } = renderChatHook();

        await act(async () => {
          result.current.sendMessage('test question');
        });

        expect(onError).toHaveBeenCalledTimes(1);

        if (status === 429) {
          expect(onError.mock.calls[0][0]).toBe(COPY.errorRateLimit);
        } else if (status === 503) {
          expect(onError.mock.calls[0][0]).toBe(COPY.errorBackend);
        } else {
          expect(onError.mock.calls[0][0]).toBe(COPY.errorGeneric);
        }

        expect(result.current.state).toBe('error');
        unmount();
      }
    });
  });

  // =========================================================================
  // Property-based tests — Network errors (TypeError)
  // =========================================================================

  describe('Property: network errors → errorNetwork', () => {
    /**
     * **Validates: Requirements 3.3**
     *
     * _For any_ network error (TypeError thrown by fetch), the error message
     * must be COPY.errorNetwork and state must become 'error'.
     */
    it('property: TypeError from fetch always produces errorNetwork', async () => {
      const messageArb = fc.string({ minLength: 0, maxLength: 100 });
      const samples = fc.sample(messageArb, 15);

      for (const errorMsg of samples) {
        globalThis.fetch = vi.fn().mockRejectedValue(new TypeError(errorMsg));

        const { result, onError, unmount } = renderChatHook();

        await act(async () => {
          result.current.sendMessage('test question');
        });

        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError.mock.calls[0][0]).toBe(COPY.errorNetwork);
        expect(result.current.state).toBe('error');
        unmount();
      }
    });
  });

  // =========================================================================
  // Unit tests — Specific HTTP error status codes
  // =========================================================================

  describe('Unit: specific HTTP error status codes', () => {
    /**
     * **Validates: Requirements 3.3**
     */
    it('429 → onError with errorRateLimit, state error', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue(makeErrorResponse(429));
      const { result, onError } = renderChatHook();

      await act(async () => {
        result.current.sendMessage('test');
      });

      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError.mock.calls[0][0]).toBe(COPY.errorRateLimit);
      expect(result.current.state).toBe('error');
    });

    /**
     * **Validates: Requirements 3.3**
     */
    it('503 → onError with errorBackend, state error', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue(makeErrorResponse(503));
      const { result, onError } = renderChatHook();

      await act(async () => {
        result.current.sendMessage('test');
      });

      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError.mock.calls[0][0]).toBe(COPY.errorBackend);
      expect(result.current.state).toBe('error');
    });

    /**
     * **Validates: Requirements 3.3**
     */
    it('500 → onError with errorGeneric, state error', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue(makeErrorResponse(500));
      const { result, onError } = renderChatHook();

      await act(async () => {
        result.current.sendMessage('test');
      });

      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError.mock.calls[0][0]).toBe(COPY.errorGeneric);
      expect(result.current.state).toBe('error');
    });

    /**
     * **Validates: Requirements 3.5**
     */
    it('400 → onError with errorGeneric, state error', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue(makeErrorResponse(400));
      const { result, onError } = renderChatHook();

      await act(async () => {
        result.current.sendMessage('test');
      });

      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError.mock.calls[0][0]).toBe(COPY.errorGeneric);
      expect(result.current.state).toBe('error');
    });
  });

  // =========================================================================
  // Unit tests — Network errors
  // =========================================================================

  describe('Unit: network and abort errors', () => {
    /**
     * **Validates: Requirements 3.3**
     */
    it('TypeError from fetch → onError with errorNetwork, state error', async () => {
      globalThis.fetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));
      const { result, onError } = renderChatHook();

      await act(async () => {
        result.current.sendMessage('test');
      });

      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError.mock.calls[0][0]).toBe(COPY.errorNetwork);
      expect(result.current.state).toBe('error');
    });

    /**
     * **Validates: Requirements 3.6**
     *
     * AbortError (from abort()) should NOT trigger onError.
     * When abort() is called, it sets state to 'idle' before the AbortError
     * propagates through the catch block.
     */
    it('DOMException AbortError → onError NOT called', async () => {
      globalThis.fetch = vi.fn().mockRejectedValue(new DOMException('The operation was aborted.', 'AbortError'));
      const { result, onError } = renderChatHook();

      await act(async () => {
        result.current.sendMessage('test');
      });

      expect(onError).not.toHaveBeenCalled();
    });
  });

  // =========================================================================
  // Unit tests — SSE stream parsing
  // =========================================================================

  describe('Unit: SSE stream parsing', () => {
    /**
     * **Validates: Requirements 3.4**
     *
     * A 200 response with SSE text event + [DONE] → onText called, onDone called, state idle.
     */
    it('SSE text event + DONE → onText and onDone called, state idle', async () => {
      const ssePayload = 'data: {"type":"text","content":"hello"}\n\ndata: [DONE]\n\n';
      globalThis.fetch = vi.fn().mockResolvedValue(makeSSEResponse(ssePayload));
      const { result, onText, onDone, onError } = renderChatHook();

      await act(async () => {
        result.current.sendMessage('test');
      });

      expect(onText).toHaveBeenCalledWith('hello');
      expect(onDone).toHaveBeenCalled();
      expect(onError).not.toHaveBeenCalled();
      expect(result.current.state).toBe('idle');
    });

    /**
     * **Validates: Requirements 3.4**
     *
     * A 200 response with SSE sources event → onSources called correctly.
     */
    it('SSE sources event → onSources called with sources array', async () => {
      const sources = [
        { index: 0, url: 'https://example.com/doc1', title: 'Doc 1', relevance: 0.95 },
        { index: 1, url: 'https://example.com/doc2', title: 'Doc 2', relevance: 0.8 },
      ];
      const ssePayload =
        `data: ${JSON.stringify({ type: 'sources', sources })}\n\n` +
        'data: [DONE]\n\n';
      globalThis.fetch = vi.fn().mockResolvedValue(makeSSEResponse(ssePayload));
      const { result, onSources, onDone, onError } = renderChatHook();

      await act(async () => {
        result.current.sendMessage('test');
      });

      expect(onSources).toHaveBeenCalledWith(sources);
      expect(onDone).toHaveBeenCalled();
      expect(onError).not.toHaveBeenCalled();
      expect(result.current.state).toBe('idle');
    });

    /**
     * **Validates: Requirements 3.5**
     *
     * A 200 response with SSE error event → onError called with the error string, state error.
     */
    it('SSE error event → onError called with error message, state error', async () => {
      const ssePayload = 'data: {"type":"error","error":"bad input"}\n\n';
      globalThis.fetch = vi.fn().mockResolvedValue(makeSSEResponse(ssePayload));
      const { result, onError, onDone } = renderChatHook();

      await act(async () => {
        result.current.sendMessage('test');
      });

      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError.mock.calls[0][0]).toBe('bad input');
      expect(onDone).not.toHaveBeenCalled();
      expect(result.current.state).toBe('error');
    });

    /**
     * **Validates: Requirements 3.4**
     *
     * Multiple text chunks streamed before DONE.
     */
    it('SSE multiple text chunks → onText called for each chunk', async () => {
      const ssePayload =
        'data: {"type":"text","content":"Hello "}\n\n' +
        'data: {"type":"text","content":"world!"}\n\n' +
        'data: [DONE]\n\n';
      globalThis.fetch = vi.fn().mockResolvedValue(makeSSEResponse(ssePayload));
      const { result, onText, onDone } = renderChatHook();

      await act(async () => {
        result.current.sendMessage('test');
      });

      expect(onText).toHaveBeenCalledTimes(2);
      expect(onText.mock.calls[0][0]).toBe('Hello ');
      expect(onText.mock.calls[1][0]).toBe('world!');
      expect(onDone).toHaveBeenCalled();
      expect(result.current.state).toBe('idle');
    });
  });
});
