import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { setMockSiteConfig } from './mocks/docusaurusContext';

const mockCreateChat = vi.fn();

vi.mock('@n8n/chat', () => ({
  createChat: mockCreateChat,
}));

vi.mock('@n8n/chat/style.css', () => ({}));

import Root from '../Root';

const chatEndpoint =
  'https://n8n.dev.1nce.ai/webhook/cd4f96e9-4577-428e-bc50-27efee023e1f/chat';

describe('Root.tsx createChat() integration', () => {
  beforeEach(() => {
    mockCreateChat.mockClear();
    setMockSiteConfig({
      n8nChatUsername: 'master',
      n8nChatPassword: 's3cr3t',
    });
  });

  it('calls createChat with the fixed webhookUrl', async () => {
    render(
      <Root>
        <div>test</div>
      </Root>,
    );

    await waitFor(() => {
      expect(mockCreateChat).toHaveBeenCalledTimes(1);
    });

    const config = mockCreateChat.mock.calls[0][0];
    expect(config.webhookUrl).toBe(chatEndpoint);
  });

  it('sets Authorization header using base64 basic auth', async () => {
    render(
      <Root>
        <div>test</div>
      </Root>,
    );

    await waitFor(() => {
      expect(mockCreateChat).toHaveBeenCalled();
    });

    const config = mockCreateChat.mock.calls[0][0];
    const authHeader = config.webhookConfig?.headers?.Authorization;

    expect(authHeader).toBe(`Basic ${btoa('master:s3cr3t')}`);
  });
});
