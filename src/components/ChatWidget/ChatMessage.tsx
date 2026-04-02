import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { Message } from './types';
import CitationList from './CitationList';
import styles from './ChatWidget.module.css';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  if (message.role === 'error') {
    return (
      <div className={`${styles.message} ${styles.errorMessage}`}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="#e3342f"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M8 1L1 14h14L8 1zm0 4.5v4a.75.75 0 01-1.5 0v-4a.75.75 0 011.5 0zM7.25 12a.75.75 0 111.5 0 .75.75 0 01-1.5 0z" />
        </svg>
        <span>{message.content}</span>
      </div>
    );
  }

  if (message.role === 'user') {
    return (
      <div className={`${styles.message} ${styles.userMessage}`}>
        {message.content}
      </div>
    );
  }

  // Assistant message
  return (
    <div className={`${styles.message} ${styles.aiMessage}`}>
      <ReactMarkdown>{message.content}</ReactMarkdown>
      {message.isStreaming && (
        <span className={styles.streamingCursor}>|</span>
      )}
      {message.sources && message.sources.length > 0 && (
        <CitationList sources={message.sources} />
      )}
    </div>
  );
}
