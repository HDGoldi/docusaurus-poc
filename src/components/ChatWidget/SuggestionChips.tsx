import React from 'react';
import { STARTER_QUESTIONS } from './types';
import styles from './ChatWidget.module.css';

interface SuggestionChipsProps {
  onSelect: (question: string) => void;
}

export default function SuggestionChips({ onSelect }: SuggestionChipsProps) {
  return (
    <div className={styles.chipsContainer}>
      {STARTER_QUESTIONS.map((q) => (
        <button
          key={q.label}
          className={styles.chip}
          onClick={() => onSelect(q.label)}
          type="button"
        >
          {q.label}
        </button>
      ))}
    </div>
  );
}
