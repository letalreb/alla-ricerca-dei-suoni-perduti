import { getDictionary } from '../data/dictionaries';
import styles from './Footer.module.css';

export default function Footer({ locale }) {
  const dict = getDictionary(locale);

  return (
    <footer className={styles.footer}>
      <p className={styles.copyright}>{dict.footerCopyright}</p>
      <p className={styles.notice}>
        <a
          href="http://villamedici-giulini.it/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          {dict.footerVilla}
        </a>
      </p>
      <p className={styles.notice}>{dict.footerPrivacy}</p>
      <p className={styles.notice}>{dict.footerRights}</p>
    </footer>
  );
}
