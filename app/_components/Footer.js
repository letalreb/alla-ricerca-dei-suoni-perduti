import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.links}>
        <a 
          href="https://www.villamedici-giulini.it/" 
          target="_blank" 
          rel="noopener noreferrer"
          className={styles.link}
        >
          Villa Medici Giulini
        </a>
        <span className={styles.separator}>•</span>
        <a 
          href="https://www.enteville.it" 
          target="_blank" 
          rel="noopener noreferrer"
          className={styles.link}
        >
          Ente Ville Versiliesi
        </a>
      </div>
      <p className={styles.copyright}>&copy; 2025 Alla Ricerca dei Suoni Perduti. Tutti i diritti riservati.</p>
    </footer>
  );
}