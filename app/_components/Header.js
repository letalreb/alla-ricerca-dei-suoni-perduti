import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          Alla Ricerca dei Suoni Perduti
        </Link>
        <nav className={styles.navigation}>
          <Link href="/" className={styles.navLink}>Home</Link>
          <Link href="/properties" className={styles.navLink}>Properties</Link>
          <Link href="/book" className={styles.navLink}>Book</Link>
        </nav>
      </div>
    </header>
  );
}