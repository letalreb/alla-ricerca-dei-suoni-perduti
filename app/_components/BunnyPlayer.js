'use client';

import { useState, useEffect } from 'react';
import styles from './BunnyPlayer.module.css';

export default function BunnyPlayer({ 
  bunnyMethod, 
  bunnyUrl, 
  bunnyEmbedUrl, 
  bunnyVideoGuid,
  title 
}) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
  }, [bunnyUrl, bunnyEmbedUrl]);

  // Se non ci sono dati Bunny.net, mostra placeholder
  if (!bunnyMethod || (!bunnyUrl && !bunnyEmbedUrl)) {
    return (
      <div className={styles.placeholder}>
        <p>Video non disponibile su Bunny.net</p>
      </div>
    );
  }

  // Player per Bunny Stream (video streaming ottimizzato)
  if (bunnyMethod === 'stream' && bunnyEmbedUrl) {
    return (
      <div className={styles.playerContainer}>
        {isLoading && (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Caricamento video...</p>
          </div>
        )}
        <iframe
          src={bunnyEmbedUrl}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          title={title || 'Video strumento musicale'}
          onLoad={() => setIsLoading(false)}
          className={styles.iframe}
        />
      </div>
    );
  }

  // Player per Bunny Storage (video HTML5 standard)
  if (bunnyMethod === 'storage' && bunnyUrl) {
    return (
      <div className={styles.playerContainer}>
        {isLoading && (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Caricamento video...</p>
          </div>
        )}
        <video
          controls
          className={styles.video}
          onLoadedData={() => setIsLoading(false)}
          preload="metadata"
        >
          <source src={bunnyUrl} type="video/mp4" />
          Il tuo browser non supporta il tag video.
        </video>
      </div>
    );
  }

  return (
    <div className={styles.placeholder}>
      <p>Configurazione video non valida</p>
    </div>
  );
}
