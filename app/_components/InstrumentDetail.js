import Link from 'next/link';
import { instruments } from '../data/instruments';
import { getDictionary } from '../data/dictionaries';
import UniversalPlayer from './UniversalPlayer';
import styles from './InstrumentDetail.module.css';

export default function InstrumentDetail({ id, locale = 'it' }) {
  const dict = getDictionary(locale);
  const basePath = locale === 'en' ? '/en/strumenti' : '/strumenti';
  const homePath = locale === 'en' ? '/en' : '/';
  const instrument = instruments.find(i => i.id === Number.parseInt(id));

  if (!instrument) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>
          <h1>{dict.notFoundTitle}</h1>
          <Link href={homePath} className={styles.backLink}>
            {dict.backToCollection}
          </Link>
        </div>
      </div>
    );
  }

  const displayName = locale === 'en' ? (instrument.nameEn || instrument.name) : instrument.name;

  // Costruisce il percorso del file video
  // Usa il campo audioFile se disponibile, altrimenti usa un fallback
  const videoPath = instrument.audioFile
    ? `/audio/${instrument.audioFile}`
    : null;

  const collectionNumbers = [...instrument.name.matchAll(/N\.\s*(\d+)\s*della collezione/g)].map(match => match[1]);
  let badgeNumbers = [String(instrument.id)];
  if (collectionNumbers.length > 0) {
    badgeNumbers = collectionNumbers;
  } else if (instrument.pairedWith) {
    badgeNumbers = [String(instrument.id), String(instrument.pairedWith)];
  }
  const isDoubleInstrument = badgeNumbers.length > 1;

  return (
    <div className={styles.container}>
      <Link href={homePath} className={styles.backLink}>
        {dict.backToCollection}
      </Link>

      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.numberBadges}>
            {badgeNumbers.map(num => (
              <div key={num} className={styles.number}>N. {num}</div>
            ))}
          </div>
          <h1 className={styles.title}>{displayName}</h1>
        </div>

        <div className={styles.details}>
          {instrument.author && (
            <div className={styles.detailRow}>
              <span className={styles.label}>{dict.author}:</span>
              <span className={styles.value}>{instrument.author}</span>
            </div>
          )}
          {instrument.location && (
            <div className={styles.detailRow}>
              <span className={styles.label}>{dict.location}:</span>
              <span className={styles.value}>{instrument.location}</span>
            </div>
          )}
          {instrument.year && (
            <div className={styles.detailRow}>
              <span className={styles.label}>{dict.year}:</span>
              <span className={styles.value}>{instrument.year}</span>
            </div>
          )}
        </div>

        <div className={styles.videoSection}>
          <h2 className={styles.videoTitle}>
            {isDoubleInstrument ? dict.listenMany : dict.listenOne}
          </h2>
          {instrument.audioFile || instrument.bunnyMethod || instrument.archiveId ? (
            <UniversalPlayer instrument={instrument} locale={locale} />
          ) : videoPath ? (
            <div className={styles.videoWrapper}>
              <video
                className={styles.video}
                controls
                autoPlay
                preload="metadata"
                aria-label={`${videoPath.endsWith('.mp3') ? dict.audioLabel : dict.videoLabel} ${dict.of} ${displayName}`}
              >
                <source
                  src={videoPath}
                  type={videoPath.endsWith('.mp3') ? 'audio/mpeg' : 'video/mp4'}
                />
                <track
                  kind="captions"
                  src="/media/captions.vtt"
                  srcLang={locale}
                  label={locale === 'en' ? 'English subtitles' : 'Sottotitoli italiani'}
                />
                {dict.videoNotSupported} {videoPath.endsWith('.mp3') ? dict.audioLabel : dict.videoLabel}.
              </video>
            </div>
          ) : (
            <div className={styles.noMedia}>
              <p>{dict.noMedia}</p>
            </div>
          )}
        </div>

        <div className={styles.navigation}>
          {instrument.id > 1 && (
            <Link
              href={`${basePath}/${instrument.id - 1}`}
              className={styles.navButton}
            >
              {dict.previous}
            </Link>
          )}
          {instrument.id < 92 && (
            <Link
              href={`${basePath}/${instrument.id + 1}`}
              className={styles.navButton}
            >
              {dict.next}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
