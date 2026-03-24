import React, { useRef, useState } from 'react';
import { COPY } from './types';
import styles from './ChatWidget.module.css';

interface ChatInputProps {
  onSend: (text: string) => void;
  onStop: () => void;
  isStreaming: boolean;
  disabled: boolean;
}

export default function ChatInput({
  onSend,
  onStop,
  isStreaming,
  disabled,
}: ChatInputProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const canSend = value.trim().length > 0 && !isStreaming && !disabled;

  const handleSend = () => {
    const text = value.trim();
    if (!text || isStreaming || disabled) return;
    onSend(text);
    setValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleButtonClick = () => {
    if (isStreaming) {
      onStop();
    } else {
      handleSend();
    }
  };

  const buttonDisabled = !isStreaming && !canSend;
  const buttonClassName = buttonDisabled
    ? `${styles.sendButton} ${styles.sendButtonDisabled}`
    : styles.sendButton;

  return (
    <div className={styles.inputArea}>
      <div className={styles.inputWrapper}>
        <input
          ref={inputRef}
          className={styles.input}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={COPY.inputPlaceholder}
          disabled={isStreaming || disabled}
          aria-label={COPY.inputPlaceholder}
        />
        <button
          className={buttonClassName}
          onClick={handleButtonClick}
          disabled={buttonDisabled}
          aria-label={isStreaming ? COPY.stopAriaLabel : COPY.sendAriaLabel}
          type="button"
        >
          {isStreaming ? (
            // Stop icon (square)
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="white"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="12" height="12" rx="1" />
            </svg>
          ) : (
            // Send icon (arrow-up)
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="white"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8 2L3 9h3.5v5h3V9H13L8 2z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
