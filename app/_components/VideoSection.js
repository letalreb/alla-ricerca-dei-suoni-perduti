import styles from './VideoSection.module.css';

export default function VideoSection() {
  return (
    <section className={styles.videoSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>Villa Medici Giulini</h2>
        <p className={styles.description}>
          Un viaggio attraverso la storia degli strumenti musicali antichi, 
          dove secoli di patrimonio musicale prendono vita attraverso 
          un'architettura mozzafiato ed eleganza senza tempo.
        </p>
        <div className={styles.videoWrapper}>
          <video 
            className={styles.video}
            controls 
            preload="metadata"
            aria-label="Villa Medici Giulini presentation video"
          >
            <source 
              src="/media/Villa-Medici-Giulini_Media_dGwCXi6Zbgg_001_1080p.mp4" 
              type="video/mp4" 
            />
            <track
              kind="captions"
              src="/media/captions.vtt"
              srcLang="it"
              label="Sottotitoli italiani"
              default
            />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </section>
  );
}