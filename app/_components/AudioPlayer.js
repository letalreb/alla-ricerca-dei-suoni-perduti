'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './AudioPlayer.module.css';

export default function AudioPlayer({ src, instrumentName }) {
  const audioRef = useRef(null);
  const [artwork, setArtwork] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Tenta di estrarre l'artwork usando MediaMetadata API
    if ('mediaSession' in navigator) {
      audio.addEventListener('loadedmetadata', async () => {
        try {
          // Prova a ottenere i metadati
          const response = await fetch(src);
          const blob = await response.blob();
          
          // Crea un URL temporaneo per l'immagine
          // Nota: l'estrazione dell'artwork da MP3 richiede una libreria
          // Per ora usiamo un placeholder che mostrerà l'artwork se il browser lo supporta
        } catch (error) {
          console.error('Errore nel caricamento artwork:', error);
        }
      });
    }

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('play', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('play', () => setIsPlaying(true));
      audio.removeEventListener('pause', () => setIsPlaying(false));
    };
  }, [src]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    audio.currentTime = percentage * duration;
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.audioPlayer}>
      <div className={styles.artworkContainer}>
        {artwork ? (
          <img src={artwork} alt={`Artwork di ${instrumentName}`} className={styles.artwork} />
        ) : (
          <div className={styles.placeholderArtwork}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
          </div>
        )}
      </div>
      
      <audio ref={audioRef} src={src} preload="metadata" />
      
      <div className={styles.controls}>
        <button 
          className={styles.playButton} 
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pausa' : 'Riproduci'}
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>

        <div className={styles.timelineContainer}>
          <span className={styles.time}>{formatTime(currentTime)}</span>
          <div className={styles.timeline} onClick={handleSeek}>
            <div 
              className={styles.progress} 
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
          <span className={styles.time}>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}
