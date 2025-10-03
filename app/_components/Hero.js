import styles from './Hero.module.css';

export default function Hero() {
  return (
    <div className={styles.hero}>
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <h1>The Family Estates</h1>
        <p>Each property with its own historical and cultural identity</p>
      </div>
    </div>
  );
}