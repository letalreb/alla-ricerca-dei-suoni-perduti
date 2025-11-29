'use client';

import { useState, useEffect } from 'react';
import styles from './ArchivePlayer.module.css';

export default function ArchivePlayer({ archiveId, embedUrl, title }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
  }, [archiveId]);

  if (!archiveId || !embedUrl) {
    return (
      <div className={styles.placeholder}>
        <p>Video non disponibile</p>
      </div>
    );
  }

  return (
    <div className={styles.playerContainer}>
      {isLoading && (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Caricamento video...</p>
        </div>
      )}
      <iframe
        src={`${embedUrl}?showInfo=0`}
        width="100%"
        height="100%"
        frameBorder="0"
        allow="fullscreen"
        allowFullScreen
        title={title || 'Video strumento musicale'}
        onLoad={() => setIsLoading(false)}
        className={styles.iframe}
      />
    </div>
  );
}
