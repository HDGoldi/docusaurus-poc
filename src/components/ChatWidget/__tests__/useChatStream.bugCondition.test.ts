/**
 * Bug Condition Exploration Test — 403 AccessDeniedException Shows Misleading Rate-Limit Message
 *
 * This test encodes the EXPECTED (correct) behavior:
 *   - 403 + AccessDeniedException → should NOT show COPY.errorRateLimit
 *   - 403 without AccessDeniedException (WAF) → should show COPY.errorRateLimit
 *
 * On UNFIXED code, the first case FAILS because useChatStream maps ALL 403 → COPY.errorRateLimit.
 *
 * **Validates: Requirements 1.3, 2.3**
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import * as fc from 'fast-check';
import { useChatStream } from '../useChatStream';
import { COPY } from '../types';

const TEST_ENDPOINT = 'https://chat-api.example.com';

// Helper: create a mock Response for a 403 with AccessDeniedException (Lambda auth failure)
function makeAccessDeniedResponse(): Response {
  return new Response(JSON.stringify({ Message: 'Forbidden' }), {
    status: 403,
    statusText: 'Forbidden',
    headers: {
      'Content-Type': 'application/json',
      'x-amzn-errortype': 'AccessDeniedException',
    },
  });
}

// Helper: create a mock Response for a 403 from WAF (rate-limit block, no AccessDeniedException)
function makeWafRateLimitResponse(): Response {
  return new Response('<html><body>403 Forbidden</body></html>', {
    status: 403,
    statusText: 'Forbidden',
    headers: {
      'Content-Type': 'text/html',
    },
  });
}

describe('Bug Condition — 403 AccessDeniedException Shows Misleading Rate-Limit Message', () => {
  let originalFetch: typeof globalThis.fetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  /**
   * **Validates: Requirements 1.3, 2.3**
   *
   * When the Lambda authorization layer returns 403 with AccessDeniedException,
   * the error message should NOT be the rate-limit message.
   *
   * EXPECTED TO FAIL on unfixed code: current code maps ALL 403 → COPY.errorRateLimit.
   */
  it('403 + AccessDeniedException should NOT show rate-limit message', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(makeAccessDeniedResponse());

    const onError = vi.fn();
    const { result } = renderHook(() =>
      useChatStream({
        endpoint: TEST_ENDPOINT,
        onText: vi.fn(),
        onSources: vi.fn(),
        onError,
        onDone: vi.fn(),
      }),
    );

    await act(async () => {
      result.current.sendMessage('test');
    });

    expect(onError).toHaveBeenCalledTimes(1);
    // The error message should NOT be the rate-limit message for auth failures
    expect(onError.mock.calls[0][0]).not.toBe(COPY.errorRateLimit);
  });

  /**
   * **Validates: Requirements 2.3, 3.2**
   *
   * When WAF blocks a request with 403 (no AccessDeniedException),
   * the rate-limit message IS correct and should be preserved.
   */
  it('403 from WAF (no AccessDeniedException) should show rate-limit message', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(makeWafRateLimitResponse());

    const onError = vi.fn();
    const { result } = renderHook(() =>
      useChatStream({
        endpoint: TEST_ENDPOINT,
        onText: vi.fn(),
        onSources: vi.fn(),
        onError,
        onDone: vi.fn(),
      }),
    );

    await act(async () => {
      result.current.sendMessage('test');
    });

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0][0]).toBe(COPY.errorRateLimit);
  });

  /**
   * **Validates: Requirements 1.3, 2.3**
   *
   * Property: For any 403 response where the body contains AccessDeniedException,
   * the displayed error message should NOT be the rate-limit message.
   *
   * Uses a sequential approach to avoid overlapping act() calls inside fc.assert.
   *
   * EXPECTED TO FAIL on unfixed code.
   */
  it('property: 403 + AccessDeniedException never produces rate-limit message', async () => {
    const questions = fc.sample(fc.string({ minLength: 1, maxLength: 100 }), 10);

    for (const question of questions) {
      globalThis.fetch = vi.fn().mockResolvedValue(makeAccessDeniedResponse());

      const onError = vi.fn();
      const { result, unmount } = renderHook(() =>
        useChatStream({
          endpoint: TEST_ENDPOINT,
          onText: vi.fn(),
          onSources: vi.fn(),
          onError,
          onDone: vi.fn(),
        }),
      );

      await act(async () => {
        result.current.sendMessage(question);
      });

      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError.mock.calls[0][0]).not.toBe(COPY.errorRateLimit);

      unmount();
    }
  });
});
