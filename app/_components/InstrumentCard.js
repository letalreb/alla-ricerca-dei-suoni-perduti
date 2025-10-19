/* eslint-disable react/prop-types */
import Link from 'next/link';
import Image from 'next/image';
import styles from './InstrumentCard.module.css';

export default function InstrumentCard({ instrument }) {
  // Calcola il path della thumbnail
  const getThumbnailPath = () => {
    if (!instrument.audioFile) return null;
    
    // Sostituisci estensione video con .jpg
    const thumbnailName = instrument.audioFile.replace(/\.(mp4|mpg|mp3)$/i, '.jpg');
    return `/images/thumbnails/${thumbnailName}`;
  };

  const thumbnailPath = getThumbnailPath();
  const videoPath = instrument.audioFile ? `/audio/${instrument.audioFile}` : null;
  const isAudio = videoPath?.endsWith('.mp3');

  return (
    <Link href={`/strumenti/${instrument.id}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        {thumbnailPath && !isAudio ? (
          <Image 
            src={thumbnailPath}
            alt={instrument.name}
            width={800}
            height={600}
            className={styles.thumbnail}
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
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
