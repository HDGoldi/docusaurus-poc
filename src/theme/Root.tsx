import React, { useEffect } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import '@n8n/chat/style.css';

const DEFAULT_N8N_CHAT_USERNAME = 'master';
const N8N_CHAT_WEBHOOK_URL =
  'https://n8n.dev.1nce.ai/webhook/cd4f96e9-4577-428e-bc50-27efee023e1f/chat';

const buildBasicAuthHeader = (username: string, password: string) => {
  if (!username || !password) {
    return undefined;
  }

  const credentials = `${username}:${password}`;

  if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
    return `Basic ${window.btoa(credentials)}`;
  }

  return undefined;
};

export default function Root({ children }: { children: React.ReactNode }) {
  const { siteConfig } = useDocusaurusContext();
  const username =
    (siteConfig.customFields?.n8nChatUsername as string) || DEFAULT_N8N_CHAT_USERNAME;
  const password = (siteConfig.customFields?.n8nChatPassword as string) || '';

  useEffect(() => {
    const authorization = buildBasicAuthHeader(username, password);
    if (!authorization) {
      console.warn(
        'n8n chat Authorization header is not set because username/password is missing.',
      );
    }

    import('@n8n/chat').then(({ createChat }) => {
      createChat({
        webhookUrl: N8N_CHAT_WEBHOOK_URL,
        webhookConfig: {
          method: 'POST',
          headers: authorization
            ? {
                Authorization: authorization,
              }
            : undefined,
        },
        mode: 'window',
        showWelcomeScreen: false,
        initialMessages: [
          "Hello! 👋 I'm the 1NCE Developer Hub assistant.",
          'Ask me anything about 1NCE IoT connectivity, APIs, or platform services.',
        ],
        i18n: {
          en: {
            title: '1NCE Dev Hub Assistant',
            subtitle: 'Ask me anything about 1NCE services',
            footer: '',
            inputPlaceholder: 'Type your question...',
            getStarted: 'New Conversation',
            closeButtonTooltip: 'Close chat',
          },
        },
      });
    });
  }, [username, password]);

  return <>{children}</>;
}

export { buildBasicAuthHeader, DEFAULT_N8N_CHAT_USERNAME };
