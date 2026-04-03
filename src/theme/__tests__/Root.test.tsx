import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import React from 'react';

// Mock createChat so we can inspect the config it receives
const mockCreateChat = vi.fn();

vi.mock('@n8n/chat', () => ({
  createChat: mockCreateChat,
}));

vi.mock('@n8n/chat/style.css', () => ({}));

// Import Root after mocks are set up
import Root from '../Root';

describe('Root.tsx createChat() integration', () => {
  beforeEach(() => {
    mockCreateChat.mockClear();
  });

  it('calls createChat with the correct webhookUrl', async () => {
    render(<Root><div>test</div></Root>);

    await waitFor(() => {
      expect(mockCreateChat).toHaveBeenCalledTimes(1);
    });

    const config = mockCreateChat.mock.calls[0][0];
    expect(config.webhookUrl).toBe(
      'https://n8n.dev.1nce.ai/webhook/cd4f96e9-4577-428e-bc50-27efee023e1f/chat',
    );
  });

  /** Validates: Requirements 2.3 */
  it('sets mode to "window"', async () => {
    render(<Root><div>test</div></Root>);

    await waitFor(() => {
      expect(mockCreateChat).toHaveBeenCalled();
    });

    const config = mockCreateChat.mock.calls[0][0];
    expect(config.mode).toBe('window');
  });

  /** Validates: Requirements 2.7 */
  it('sets showWelcomeScreen to false', async () => {
    render(<Root><div>test</div></Root>);

    await waitFor(() => {
      expect(mockCreateChat).toHaveBeenCalled();
    });

    const config = mockCreateChat.mock.calls[0][0];
    expect(config.showWelcomeScreen).toBe(false);
  });

  /** Validates: Requirements 2.8 */
  it('provides an initialMessages array with at least one message', async () => {
    render(<Root><div>test</div></Root>);

    await waitFor(() => {
      expect(mockCreateChat).toHaveBeenCalled();
    });

    const config = mockCreateChat.mock.calls[0][0];
    expect(Array.isArray(config.initialMessages)).toBe(true);
    expect(config.initialMessages.length).toBeGreaterThanOrEqual(1);
  });

  /** Validates: Requirements 2.9 */
  it('provides i18n.en with title, subtitle, and inputPlaceholder', async () => {
    render(<Root><div>test</div></Root>);

    await waitFor(() => {
      expect(mockCreateChat).toHaveBeenCalled();
    });

    const config = mockCreateChat.mock.calls[0][0];
    const en = config.i18n?.en;
    expect(en).toBeDefined();
    expect(en.title).toEqual(expect.any(String));
    expect(en.subtitle).toEqual(expect.any(String));
    expect(en.inputPlaceholder).toEqual(expect.any(String));
  });

  /** Validates: Requirements 2.6 */
  it('sets Authorization header starting with "Basic "', async () => {
    render(<Root><div>test</div></Root>);

    await waitFor(() => {
      expect(mockCreateChat).toHaveBeenCalled();
    });

    const config = mockCreateChat.mock.calls[0][0];
    const authHeader = config.webhookConfig?.headers?.Authorization;
    expect(authHeader).toBeDefined();
    expect(authHeader).toMatch(/^Basic /);
  });

  it('renders children correctly', async () => {
    const { getByText } = render(<Root><div>child content</div></Root>);
    expect(getByText('child content')).toBeInTheDocument();
  });
});
