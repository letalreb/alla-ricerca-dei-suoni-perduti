'use client';

import { useEffect, useState } from 'react';
import InstrumentCard from './InstrumentCard';
import ScrollRestore from './ScrollRestore';
import { instruments } from '../data/instruments';
import { getDictionary } from '../data/dictionaries';
import styles from './HomeContent.module.css';

const VIEW_STORAGE_KEY = 'catalogViewMode';

export default function HomeContent({ locale = 'it' }) {
  const dict = getDictionary(locale);
  const [isModern, setIsModern] = useState(false);

  useEffect(() => {
    try {
      setIsModern(window.localStorage.getItem(VIEW_STORAGE_KEY) === 'modern');
    } catch {
      // localStorage non disponibile, resta sulla vista classica
    }
  }, []);

  const toggleView = () => {
    setIsModern((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(VIEW_STORAGE_KEY, next ? 'modern' : 'classic');
      } catch {
        // ignora se localStorage non è disponibile
      }
      return next;
    });
  };

  return (
    <div className={styles.container}>
      <ScrollRestore locale={locale} />
      <div className={styles.header}>
        <h1 className={styles.title}>{dict.homeTitle}</h1>
        <p className={styles.subtitle}>{dict.homeSubtitle}</p>
        <p className={styles.count}>{dict.homeCount(instruments.length)}</p>
      </div>

      <div className={`${styles.grid} ${isModern ? styles.gridModern : ''}`}>
        {instruments.map((instrument) => (
          <InstrumentCard
            key={instrument.id}
            instrument={instrument}
            locale={locale}
            variant={isModern ? 'modern' : 'classic'}
          />
        ))}
      </div>

      <div className={styles.viewToggleWrapper}>
        <button
          type="button"
          className={styles.viewToggle}
          onClick={toggleView}
          aria-pressed={isModern}
        >
          <span className={`${styles.viewToggleOption} ${!isModern ? styles.viewToggleOptionActive : ''}`}>
            {dict.viewToggleClassic}
          </span>
          <span className={styles.viewToggleTrack}>
            <span className={`${styles.viewToggleThumb} ${isModern ? styles.viewToggleThumbOn : ''}`} />
          </span>
          <span className={`${styles.viewToggleOption} ${isModern ? styles.viewToggleOptionActive : ''}`}>
            {dict.viewToggleModern}
          </span>
        </button>
      </div>
    </div>
  );
}
