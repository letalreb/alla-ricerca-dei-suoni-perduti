/* eslint-disable react/prop-types */
'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import styles from './InstrumentCard.module.css';

export default function InstrumentCard({ instrument }) {
  const videoRef = useRef(null);
  const [thumbnail, setThumbnail] = useState(null);

  useEffect(() => {
    if (!instrument.audioFile) return;

    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      // Vai a 1 secondo nel video per ottenere un frame migliore
      video.currentTime = 1;
    };

    const handleSeeked = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setThumbnail(dataUrl);
      } catch (error) {
        console.error('Errore nel creare thumbnail:', error);
      }
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('seeked', handleSeeked);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('seeked', handleSeeked);
    };
  }, [instrument.audioFile]);

  const videoPath = instrument.audioFile ? `/audio/${instrument.audioFile}` : null;
  const isAudio = videoPath?.endsWith('.mp3');

  return (
    <Link href={`/strumenti/${instrument.id}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        {videoPath && !isAudio && (
          <video
            ref={videoRef}
            src={videoPath}
            className={styles.hiddenVideo}
            muted
            playsInline
            preload="metadata"
          />
        )}
        {thumbnail ? (
          <img src={thumbnail} alt={instrument.name} className={styles.thumbnail} />
        ) : (
          <div className={styles.placeholder}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
          </div>
        )}
        <div className={styles.playIcon}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
      </div>
      <div className={styles.number}>{instrument.id}</div>
      <div className={styles.content}>
        <h3 className={styles.name}>{instrument.name}</h3>
        <div className={styles.details}>
          {instrument.author && <p className={styles.author}>{instrument.author}</p>}
          {instrument.location && <p className={styles.location}>{instrument.location}</p>}
          {instrument.year && <p className={styles.year}>{instrument.year}</p>}
        </div>
      </div>
    </Link>
  );
}
