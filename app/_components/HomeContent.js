import InstrumentCard from './InstrumentCard';
import ScrollRestore from './ScrollRestore';
import { instruments } from '../data/instruments';
import { getDictionary } from '../data/dictionaries';
import styles from './HomeContent.module.css';

export default function HomeContent({ locale = 'it' }) {
  const dict = getDictionary(locale);

  return (
    <div className={styles.container}>
      <ScrollRestore locale={locale} />
      <div className={styles.header}>
        <h1 className={styles.title}>{dict.homeTitle}</h1>
        <p className={styles.subtitle}>{dict.homeSubtitle}</p>
        <p className={styles.count}>{dict.homeCount(instruments.length)}</p>
      </div>

      <div className={styles.grid}>
        {instruments.map((instrument) => (
          <InstrumentCard key={instrument.id} instrument={instrument} locale={locale} />
        ))}
      </div>
    </div>
  );
}
