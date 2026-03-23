import React, { useCallback, useEffect, useRef } from 'react';
import { COPY } from './types';
import styles from './ChatWidget.module.css';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function ChatDrawer({
  isOpen,
  onClose,
  children,
}: ChatDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Lock body scroll on mobile when drawer is open
  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isOpen && isMobile) {
      document.documentElement.style.overflow = 'hidden';
    }
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  // Focus trap and keyboard handling
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab' && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    },
    [onClose],
  );

  const drawerClassName = isOpen
    ? `${styles.drawer} ${styles.drawerOpen}`
    : styles.drawer;

  return (
    <div
      ref={drawerRef}
      className={drawerClassName}
      role="dialog"
      aria-label={COPY.drawerAriaLabel}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.drawerHeader}>
        <h2 className={styles.drawerTitle}>{COPY.drawerTitle}</h2>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label={COPY.closeAriaLabel}
          type="button"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M15.8 4.2a.75.75 0 00-1.06 0L10 8.94 5.26 4.2a.75.75 0 00-1.06 1.06L8.94 10 4.2 14.74a.75.75 0 101.06 1.06L10 11.06l4.74 4.74a.75.75 0 101.06-1.06L11.06 10l4.74-4.74a.75.75 0 000-1.06z" />
          </svg>
        </button>
      </div>
      {children}
    </div>
  );
}
