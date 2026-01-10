'use client';

import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import styles from './Header.module.css';

export default function Header() {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.titleContainer}>
          <Link href="/" className={styles.logo}>
            {t('siteTitle')}
          </Link>
          <p className={styles.subtitle}>{t('siteSubtitle')}</p>
        </div>
        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>
            {t('navCollection')}
          </Link>
          <Link href="/acquista" className={styles.navLink}>
            {t('navPurchase')}
          </Link>
          <button onClick={toggleLanguage} className={styles.langButton}>
            {language === 'it' ? 'EN' : 'IT'}
          </button>
        </nav>
      </div>
    </header>
  );
}