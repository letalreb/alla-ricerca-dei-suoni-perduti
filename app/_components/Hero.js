import styles from './Hero.module.css';

export default function Hero() {
  return (
    <div className={styles.hero}>
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <h1>Alla Ricerca dei Suoni Perduti</h1>
        <p>Un viaggio attraverso la storia degli strumenti musicali antichi</p>
      </div>
    </div>
  );
}