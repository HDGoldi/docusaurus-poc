import React from 'react';
import { COPY } from './types';
import styles from './ChatWidget.module.css';

interface ChatButtonProps {
  onClick: () => void;
}

export default function ChatButton({ onClick }: ChatButtonProps) {
  return (
    <button
      className={styles.chatButton}
      onClick={onClick}
      title={COPY.buttonTooltip}
      aria-label={COPY.openAriaLabel}
      type="button"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="white"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
      </svg>
    </button>
  );
}
