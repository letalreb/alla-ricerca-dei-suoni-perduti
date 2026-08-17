import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.copyright}>&copy; 2025 Alla Ricerca dei Suoni Perduti per Villa Medici Giulini srl. Tutti i diritti riservati.</p>
      <p className={styles.notice}>
        <a
          href="http://villamedici-giulini.it/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          Villa Medici Giulini
        </a>
      </p>
      <p className={styles.notice}>Privacy e Cookie Policy: questo sito non utilizza cookie di profilazione o tracciamento.</p>
      <p className={styles.notice}>È vietata la riproduzione, copia o diffusione, con qualsiasi mezzo, del materiale fotografico e audio relativo agli strumenti musicali, di proprietà di Villa Medici Giulini srl, senza autorizzazione scritta.</p>
    </footer>
  );
}