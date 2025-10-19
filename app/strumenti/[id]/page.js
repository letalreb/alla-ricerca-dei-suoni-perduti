/* eslint-disable react/prop-types */
import Link from 'next/link';
import instruments from '../../data/instruments';
import ArchivePlayer from '../../_components/ArchivePlayer';
import styles from './page.module.css';

export default async function InstrumentPage({ params }) {
  const { id } = await params;
  const instrument = instruments.find(i => i.id === Number.parseInt(id));

  if (!instrument) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>
          <h1>Strumento non trovato</h1>
          <Link href="/" className={styles.backLink}>
            ← Torna alla collezione
          </Link>
        </div>
      </div>
    );
  }

  // Costruisce il percorso del file video
  // Usa il campo audioFile se disponibile, altrimenti usa un fallback
  const videoPath = instrument.audioFile 
    ? `/audio/${instrument.audioFile}`
    : null;

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.backLink}>
        ← Torna alla collezione
      </Link>

      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.number}>N. {instrument.id}</div>
          <h1 className={styles.title}>{instrument.name}</h1>
        </div>

        <div className={styles.details}>
          {instrument.author && (
            <div className={styles.detailRow}>
              <span className={styles.label}>Autore:</span>
              <span className={styles.value}>{instrument.author}</span>
            </div>
          )}
          {instrument.location && (
            <div className={styles.detailRow}>
              <span className={styles.label}>Luogo:</span>
              <span className={styles.value}>{instrument.location}</span>
            </div>
          )}
          {instrument.year && (
            <div className={styles.detailRow}>
              <span className={styles.label}>Anno:</span>
              <span className={styles.value}>{instrument.year}</span>
            </div>
          )}
        </div>

        <div className={styles.videoSection}>
          <h2 className={styles.videoTitle}>Ascolta lo strumento</h2>
          {instrument.archiveId ? (
            <ArchivePlayer 
              archiveId={instrument.archiveId}
              embedUrl={instrument.embedUrl}
              title={instrument.name}
            />
          ) : videoPath ? (
            <div className={styles.videoWrapper}>
              <video 
                className={styles.video}
                controls 
                autoPlay
                preload="metadata"
                aria-label={`${videoPath.endsWith('.mp3') ? 'Audio' : 'Video'} di ${instrument.name}`}
              >
                <source 
                  src={videoPath}
                  type={videoPath.endsWith('.mp3') ? 'audio/mpeg' : 'video/mp4'}
                />
                <track
                  kind="captions"
                  src="/media/captions.vtt"
                  srcLang="it"
                  label="Sottotitoli italiani"
                />
                Il tuo browser non supporta la riproduzione {videoPath.endsWith('.mp3') ? 'audio' : 'video'}.
              </video>
            </div>
          ) : (
            <div className={styles.noMedia}>
              <p>File audio non ancora disponibile per questo strumento.</p>
            </div>
          )}
        </div>

        <div className={styles.navigation}>
          {instrument.id > 1 && (
            <Link 
              href={`/strumenti/${instrument.id - 1}`} 
              className={styles.navButton}
            >
              ← Precedente
            </Link>
          )}
          {instrument.id < 92 && (
            <Link 
              href={`/strumenti/${instrument.id + 1}`} 
              className={styles.navButton}
            >
              Successivo →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}