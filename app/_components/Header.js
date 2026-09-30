'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getDictionary } from '../data/dictionaries';
import styles from './Header.module.css';

export default function Header({ locale }) {
  const dict = getDictionary(locale);
  const pathname = usePathname();

  const isEnglish = pathname === '/en' || pathname.startsWith('/en/');
  const otherLocale = isEnglish ? 'it' : 'en';
  const otherLocaleLabel = isEnglish ? 'IT' : 'EN';
  const otherPath = isEnglish
    ? pathname.replace(/^\/en/, '') || '/'
    : `/en${pathname === '/' ? '' : pathname}`;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.titleContainer}>
          <Link href={locale === 'en' ? '/en' : '/'} className={styles.logo}>
            Alla Ricerca dei Suoni Perduti
          </Link>
          <p className={styles.subtitle}>{dict.headerSubtitle}</p>
        </div>
        <Link href={otherPath} className={styles.langSwitch} lang={otherLocale}>
          {otherLocaleLabel}
        </Link>
      </div>
    </header>
  );
}
