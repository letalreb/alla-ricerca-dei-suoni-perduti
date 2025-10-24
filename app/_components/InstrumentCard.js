/* eslint-disable react/prop-types */
import Link from 'next/link';
import Image from 'next/image';
import styles from './InstrumentCard.module.css';

export default function InstrumentCard({ instrument }) {
  // IDs degli strumenti non in grado di suonare
  const notPlayableIds = [27, 31, 73, 89];
  const isNotPlayable = notPlayableIds.includes(instrument.id);
  
  // Mappatura dei nomi file per le thumbnail degli strumenti senza audio
  const thumbnailMapping = {
    27: '27 Fortepiano a tavolo Johann Christoph Zumpe, Londra, 1780.jpg',
    31: '31 Fortepiano a tavolo Italia, seconda metà del secolo XVIII.jpg',
    51: '51 Arpa Sébastien Erard, Londra, 1821.jpg',
    59: '59 Mandolino, Napoli, XX secolo.jpg',
    66: '66 Arpa a pedali a movimento semplice Érard, Parigi, 1808, numero di serie N 123 BERNASCONI.jpg',
    67: '67 Arpa a pedali a doppio movimento Érard, Parigi, ottobre 1919, numero di serie N 4114 DALL\'ARA.jpg',
    68: '68 Arpa a pedali a doppio movimento Érard _Bassi_, Parigi, 1902, numero di serie N 4584.jpg',
    69: '69 Salterio Antonio Berti, Firenze, secondo quarto del secolo XVIII - dipinto con grottesche.jpg',
    70: '70 Salterio italiano con scatola, Venezia, 1725-1740.jpg',
    71: '71 Salterio Antonio Berti, Firenze, prima metà del secolo XVIII.jpg',
    72: '72 Mandolino Nicola e Raffaele Calace, Napoli,1892, con scatola.jpg',
    73: '73 Mandolino napoletano anonimo, fine del XIX secolo - inizio del XX.jpg',
    74: '74 Fortepiano a coda _Prearo_ Johannes Michael Schoelly, Roma, 1793.jpg',
    75: '75 Pianoforte a coda _Bigatti_ Ernest Kaps, n.10188, Dresden, ca. 1885.jpg',
    76: '76 Pianoforte mezza coda aliquot Julius Blüthner, n.137200, Leipzig.jpg',
    77: '77  Pianoforte Burger & Jacobi, Madretsch, Bienne, 1931, n.28543.jpg',
    78: '78 Pianoforte  a coda Pleyel  n.173871, Parigi, ca. 1923.jpg',
    79: '79 Pianoforte a coda _Ravasio_ Augusto Tallone, n.2136c.XXXI91, Milano,  08-03-1960.jpg',
    80: '80  Pianoforte mezza coda Modello O-180, Steinway & Sons, n. 238617, Amburgo, 1899.jpg',
    81: '81 Pianoforte quarto di coda Steinway & Sons, Modello S-155 n.299308, New York-Hamburg, 1926.jpg',
    82: '82 Pianoforte mezza coda Modello A-188 Steinway & Sons n.484418 .jpg',
    83: '83 Pianoforte mezza coda Yamaha G1 RE 4700115, Hamamatsu, 1989 - vicino organo.jpg',
    84: '84 Pianoforte mezza coda Yamaha G1 RE 4800351 Hamamatsu, 1989 - vicino allo Steinway .jpg',
    85: '85 Pianoforte mezza coda Yamaha G2 E 1853242, 1974 - MIlano.jpg',
    86: '86 Harmonium Kaslier, Parigi, 1930 ca..jpg',
    87: '87 Le Guide Chant Kaslier, Parigi, 1930 ca..jpg',
    88: '88 Violino Giuseppe Pedrazzini (1879-1957), Milano, 1920.jpg',
    89: '89 Violino da bambino, metà del XX secolo -  Bréton fronte \'800.jpg',
    90: '90 Violino Maidstone, inizio del XX secolo  John Murdoch, London, The Maid Stone, \'800.jpg',
    91: '91 Violino Stefano Caponnetto, Catania, primo quarto del XX secolo.jpg',
    92: '92 Viola Wenzl Fuchsl, 1960, n.105, Fuchs in Eltersdorf.jpg'
  };
  
  // Calcola il path della thumbnail
  const getThumbnailPath = () => {
    // Prima controlla se c'è una mappatura specifica
    if (thumbnailMapping[instrument.id]) {
      return `/images/thumbnails/${thumbnailMapping[instrument.id]}`;
    }
    // Altrimenti usa il nome del file audio
    if (instrument.audioFile) {
      const thumbnailName = instrument.audioFile.replace(/\.(mp4|mpg|mp3)$/i, '.jpg');
      return `/images/thumbnails/${thumbnailName}`;
    }
    return null;
  };

  const thumbnailPath = getThumbnailPath();
  const hasAudio = !!instrument.audioFile;
  const isAudio = hasAudio && instrument.audioFile.endsWith('.mp3');

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
        {!hasAudio && (
          <div className={isNotPlayable ? styles.notPlayable : styles.comingSoon}>
            {isNotPlayable ? 'Non in grado di suonare' : 'Coming Soon'}
          </div>
        )}
        {hasAudio && (
          <div className={styles.playIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        )}
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
