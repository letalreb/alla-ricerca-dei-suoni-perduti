import InstrumentCard from './_components/InstrumentCard';
import instruments from './data/instruments';
import styles from './page.module.css';

export default function HomePage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Collezione Strumenti Musicali</h1>
        <p className={styles.subtitle}>
          Elenco degli strumenti della collezione che è possibile ascoltare
        </p>
        <p className={styles.count}>{instruments.length} strumenti disponibili</p>
      </div>

      <div className={styles.grid}>
        {instruments.map((instrument) => (
          <InstrumentCard key={instrument.id} instrument={instrument} />
        ))}
      </div>
    </div>
  );
}