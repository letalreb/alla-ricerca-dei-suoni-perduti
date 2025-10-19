import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.titleContainer}>
          <Link href="/" className={styles.logo}>
            Alla Ricerca dei Suoni Perduti
          </Link>
          <p className={styles.subtitle}>La collezione di strumenti musicali</p>
        </div>
      </div>
    </header>
  );
}