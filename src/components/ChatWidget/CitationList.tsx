import React from 'react';
import type { Source } from './types';
import { COPY } from './types';
import styles from './ChatWidget.module.css';

interface CitationListProps {
  sources: Source[];
}

export default function CitationList({ sources }: CitationListProps) {
  if (!sources || sources.length === 0) return null;

  return (
    <div>
      <div className={styles.citationSeparator} />
      <p className={styles.citationHeading}>{COPY.sourcesHeading}</p>
      {sources.map((source) => (
        <a
          key={source.index}
          className={styles.citationLink}
          href={source.url}
        >
          [{source.index}] {source.title}
        </a>
      ))}
    </div>
  );
}
