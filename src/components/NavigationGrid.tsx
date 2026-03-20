import React from 'react';
import styles from './NavigationGrid.module.css';

interface NavItem {
  title: string;
  description: string;
  link: string;
  icon?: string;
}

interface Props {
  items: NavItem[];
}

export default function NavigationGrid({ items }: Props): JSX.Element {
  return (
    <div className={styles.grid}>
      {items.map((item, i) => (
        <a key={i} href={item.link} className={styles.card}>
          {item.icon && <span className={styles.icon}>{item.icon}</span>}
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </a>
      ))}
    </div>
  );
}
