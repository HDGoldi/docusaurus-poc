import React, { useEffect } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import '@n8n/chat/style.css';

export default function Root({ children }: { children: React.ReactNode }) {
  const { siteConfig } = useDocusaurusContext();
  const password = (siteConfig.customFields?.n8nChatPassword as string) || '';

  useEffect(() => {
    import('@n8n/chat').then(({ createChat }) => {
      createChat({
        webhookUrl: 'https://n8n.dev.1nce.ai/webhook/cd4f96e9-4577-428e-bc50-27efee023e1f/chat',
        webhookConfig: {
          method: 'POST',
          headers: {
            Authorization: 'Basic ' + btoa('master:' + password),
          },
        },
        mode: 'window',
        showWelcomeScreen: false,
        initialMessages: [
          'Hello! 👋 I\'m the 1NCE Developer Hub assistant.',
          'Ask me anything about 1NCE IoT connectivity, APIs, or platform services.',
        ],
        i18n: {
          en: {
            title: '1NCE Dev Hub Assistant',
            subtitle: 'Ask me anything about 1NCE services',
            inputPlaceholder: 'Type your question...',
            footer: '',
            getStarted: 'New Conversation',
            closeButtonTooltip: 'Close chat',
          },
        },
      });
    });
  }, []);

  return <>{children}</>;
}
