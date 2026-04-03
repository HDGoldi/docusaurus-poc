import React, { useEffect } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import '@n8n/chat/style.css';

const DEFAULT_N8N_CHAT_USERNAME = 'master';
const N8N_CHAT_WEBHOOK_URL =
  'https://n8n.dev.1nce.ai/webhook/cd4f96e9-4577-428e-bc50-27efee023e1f/chat';

const sanitizeCredential = (value: string) => value.replace(/[\r\n]/g, '');

const toBase64Utf8 = (value: string) => {
  if (typeof window === 'undefined' || typeof window.btoa !== 'function') {
    return undefined;
  }

  const utf8Bytes = new TextEncoder().encode(value);
  let binary = '';

  utf8Bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return window.btoa(binary);
};

const buildBasicAuthHeader = (username: string, password: string) => {
  const sanitizedUsername = sanitizeCredential(username);
  const sanitizedPassword = sanitizeCredential(password);

  if (!sanitizedUsername || !sanitizedPassword) {
    return undefined;
  }

  const encoded = toBase64Utf8(`${sanitizedUsername}:${sanitizedPassword}`);
  if (!encoded) {
    return undefined;
  }

  return `Basic ${encoded}`;
};

export default function Root({ children }: { children: React.ReactNode }) {
  const { siteConfig } = useDocusaurusContext();
  const username =
    (siteConfig.customFields?.n8nChatUsername as string) || DEFAULT_N8N_CHAT_USERNAME;
  const password = (siteConfig.customFields?.n8nChatPassword as string) || '';

  useEffect(() => {
    const authorization = buildBasicAuthHeader(username, password);
    if (!authorization) {
      console.error(
        'n8n chat Authorization header is not set. Ensure N8N_CHAT_USERNAME and N8N_CHAT_PASSWORD are present at build time.',
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

export { buildBasicAuthHeader, DEFAULT_N8N_CHAT_USERNAME, sanitizeCredential, toBase64Utf8 };
