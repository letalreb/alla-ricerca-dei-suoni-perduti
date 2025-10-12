import styles from './VideoSection.module.css';

export default function VideoSection() {
  return (
    <section className={styles.videoSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>Villa Medici Giulini</h2>
        <p className={styles.description}>
          Discover the enchanting beauty and rich history of Villa Medici Giulini, 
          where centuries of musical heritage come alive through stunning architecture 
          and timeless elegance.
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
              srcLang="en"
              label="English captions"
              default
            />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </section>
  );
}