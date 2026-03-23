import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from '@docusaurus/router';
import type { Message, Source } from './types';
import { CHAT_ENDPOINT, COPY } from './types';
import { useChatStream } from './useChatStream';
import ChatButton from './ChatButton';
import ChatDrawer from './ChatDrawer';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import SuggestionChips from './SuggestionChips';
import styles from './ChatWidget.module.css';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const { pathname } = useLocation();
  const prevPathnameRef = useRef(pathname);

  // Route change detection: clear messages and close drawer (per D-06)
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      setMessages([]);
      setIsOpen(false);
    }
  }, [pathname]);

  // Auto-scroll to bottom on new content
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleText = useCallback((content: string) => {
    setMessages((prev) => {
      const updated = [...prev];
      const last = updated[updated.length - 1];
      if (last && last.role === 'assistant') {
        updated[updated.length - 1] = {
          ...last,
          content: last.content + content,
        };
      }
      return updated;
    });
  }, []);

  const handleSources = useCallback((sources: Source[]) => {
    setMessages((prev) => {
      const updated = [...prev];
      const last = updated[updated.length - 1];
      if (last && last.role === 'assistant') {
        updated[updated.length - 1] = { ...last, sources };
      }
      return updated;
    });
  }, []);

  const handleError = useCallback((errorMessage: string) => {
    setMessages((prev) => {
      // Remove streaming assistant message if it has no content
      const updated = [...prev];
      const last = updated[updated.length - 1];
      if (last && last.role === 'assistant' && last.content === '') {
        updated.pop();
      } else if (last && last.role === 'assistant') {
        // Stop streaming on existing message
        updated[updated.length - 1] = { ...last, isStreaming: false };
      }
      // Add error message
      updated.push({
        id: Date.now().toString(),
        role: 'error',
        content: errorMessage,
      });
      return updated;
    });
  }, []);

  const handleDone = useCallback(() => {
    setMessages((prev) => {
      const updated = [...prev];
      const last = updated[updated.length - 1];
      if (last && last.role === 'assistant') {
        updated[updated.length - 1] = { ...last, isStreaming: false };
      }
      return updated;
    });
  }, []);

  const { sendMessage: streamSend, abort, state } = useChatStream({
    endpoint: CHAT_ENDPOINT,
    onText: handleText,
    onSources: handleSources,
    onError: handleError,
    onDone: handleDone,
  });

  const handleSend = useCallback(
    (text: string) => {
      if (!CHAT_ENDPOINT) {
        handleError(COPY.errorGeneric);
        return;
      }

      // Add user message
      const userMsg: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: text,
      };

      // Add placeholder assistant message
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        isStreaming: true,
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      streamSend(text);
    },
    [streamSend, handleError],
  );

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    // Return focus to button
    buttonRef.current?.focus();
  };

  const isStreaming = state === 'streaming';
  const showLoading =
    messages.length > 0 &&
    messages[messages.length - 1].role === 'assistant' &&
    messages[messages.length - 1].isStreaming &&
    messages[messages.length - 1].content === '';

  return (
    <>
      {!isOpen && (
        <ChatButton onClick={handleOpen} />
      )}
      <ChatDrawer isOpen={isOpen} onClose={handleClose}>
        <div className={styles.messageArea} aria-live="polite">
          {messages.length === 0 && (
            <div>
              <p className={styles.welcomeMessage}>{COPY.welcomeMessage}</p>
              <SuggestionChips onSelect={handleSend} />
            </div>
          )}
          {messages.map((msg) =>
            showLoading &&
            msg.id === messages[messages.length - 1].id ? (
              <div key={msg.id} className={styles.loadingDots}>
                <div className={styles.dot} />
                <div className={styles.dot} />
                <div className={styles.dot} />
              </div>
            ) : (
              <ChatMessage key={msg.id} message={msg} />
            ),
          )}
          <div ref={bottomRef} />
        </div>
        <ChatInput
          onSend={handleSend}
          onStop={abort}
          isStreaming={isStreaming}
          disabled={false}
        />
      </ChatDrawer>
    </>
  );
}
