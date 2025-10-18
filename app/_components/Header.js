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
          <a 
            href="https://www.villamedici-giulini.it/" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.navLink}
          >
            Villa Medici Giulini
          </a>
          <a 
            href="https://www.enteville.it" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.navLink}
          >
            Ente Ville Versiliesi
          </a>
        </nav>
      </div>
    </header>
  );
}