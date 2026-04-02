import React from 'react';
import Link from '@docusaurus/Link';
import {useLocation} from '@docusaurus/router';
import styles from './SecondaryNavbar.module.css';

const NAV_ITEMS = [
  {label: 'Documentation', to: '/docs/'},
  {label: 'API Explorer', to: '/api/'},
  {label: 'Terms & Abbreviations', to: '/terms-abbreviations/'},
];

export default function SecondaryNavbar(): React.ReactNode {
  const {pathname} = useLocation();

  return (
    <div className={styles.secondaryNavbar}>
      <div className={styles.container}>
        {NAV_ITEMS.map(({label, to}) => (
          <Link
            key={to}
            to={to}
            className={`${styles.link} ${pathname.startsWith(to) ? styles.linkActive : ''}`}
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
