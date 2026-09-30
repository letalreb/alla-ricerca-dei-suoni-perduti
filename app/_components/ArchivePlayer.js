'use client';

import { useState, useEffect } from 'react';
import { getDictionary } from '../data/dictionaries';
import styles from './ArchivePlayer.module.css';

export default function ArchivePlayer({ archiveId, embedUrl, title, locale = 'it' }) {
  const dict = getDictionary(locale);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
  }, [archiveId]);

  if (!archiveId || !embedUrl) {
    return (
      <div className={styles.placeholder}>
        <p>{dict.videoUnavailable}</p>
      </div>
    );
  }

  return (
    <div className={styles.playerContainer}>
      {isLoading && (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>{dict.loadingVideo}</p>
        </div>
      )}
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        frameBorder="0"
        allow="fullscreen"
        allowFullScreen
        title={title || dict.videoUnavailable}
        onLoad={() => setIsLoading(false)}
        className={styles.iframe}
      />
    </div>
  );
}
