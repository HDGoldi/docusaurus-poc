import fc from 'fast-check';
import { describe, it, expect } from 'vitest';

/**
 * Feature: n8n-chat-widget, Property 1: Basic Auth Header Encoding Round Trip
 * Validates: Requirements 2.6
 */
describe('Basic Auth Header Encoding Round Trip', () => {
  it('base64 decoding a base64-encoded username:password yields the original string', () => {
    fc.assert(
      fc.property(
        fc.string().filter((s) => !s.includes(':')),
        fc.string(),
        (username, password) => {
          const credentials = username + ':' + password;
          const header = 'Basic ' + btoa(credentials);

          const base64Part = header.slice('Basic '.length);
          const decoded = atob(base64Part);

          expect(decoded).toBe(credentials);
        },
      ),
      { numRuns: 100 },
    );
  });
});
