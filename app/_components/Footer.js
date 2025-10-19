import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.copyright}>&copy; 2025 Alla Ricerca dei Suoni Perduti per Villa Medici Giulini srl. Tutti i diritti riservati.</p>
    </footer>
  );
}