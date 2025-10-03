import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          Giulini Family Estates
        </Link>
        <nav>
          {/* Add more navigation links if needed */}
        </nav>
      </div>
    </header>
  );
}