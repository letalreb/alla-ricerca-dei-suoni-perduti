/* eslint-disable react/prop-types */
import Link from 'next/link';
import styles from './chapter.module.css';

export default function ChapterPage() {
  return (
    <div className={styles.container}>
      <nav className={styles.breadcrumb}>
        <Link href="/book" className={styles.breadcrumbLink}>← Back to Book Index</Link>
      </nav>
      
      <article className={styles.chapter}>
        <header className={styles.chapterHeader}>
          <h1 className={styles.chapterTitle}>
            Alla ricerca dei suoni perduti
          </h1>
          <h2 className={styles.chapterSubtitle}>
            In search of lost sounds
          </h2>
          <div className={styles.pageInfo}>
            Page 7
          </div>
        </header>
        
        <div className={styles.chapterContent}>
          <p className={styles.introduction}>
            This is a demonstration page showing how the original static HTML book 
            has been converted to a modern Next.js application. The original book 
            "Alla Ricerca dei suoni perduti" (In search of lost sounds) documents 
            the historical musical instruments in the Giulini Collection.
          </p>
          
          <h3>Modern Features Added:</h3>
          <ul className={styles.featureList}>
            <li>✅ <strong>React Components:</strong> Modular, reusable components</li>
            <li>✅ <strong>Modern CSS:</strong> CSS Modules with responsive design</li>
            <li>✅ <strong>Next.js Routing:</strong> File-based routing system</li>
            <li>✅ <strong>TypeScript Ready:</strong> Easy to convert to TypeScript</li>
            <li>✅ <strong>SEO Optimized:</strong> Meta tags and semantic HTML</li>
            <li>✅ <strong>Mobile Responsive:</strong> Works on all device sizes</li>
            <li>✅ <strong>Performance:</strong> Image optimization and lazy loading</li>
            <li>✅ <strong>Accessibility:</strong> ARIA labels and semantic markup</li>
          </ul>
          
          <h3>Original vs Modern:</h3>
          <div className={styles.comparison}>
            <div className={styles.comparisonItem}>
              <h4>Original (HTML 4.01)</h4>
              <ul>
                <li>Static HTML files</li>
                <li>Inline styles and font tags</li>
                <li>No mobile responsiveness</li>
                <li>Manual navigation</li>
                <li>Limited interactivity</li>
              </ul>
            </div>
            <div className={styles.comparisonItem}>
              <h4>Modern (Next.js)</h4>
              <ul>
                <li>React components</li>
                <li>CSS Modules</li>
                <li>Fully responsive</li>
                <li>Dynamic routing</li>
                <li>Interactive features</li>
              </ul>
            </div>
          </div>
          
          <div className={styles.note}>
            <h4>📚 About the Original Book</h4>
            <p>
              The original book catalogs historical musical instruments including 
              pianos, harps, psalteries, and plucked instruments from various periods. 
              It features contributions from renowned musicologists and organologists, 
              providing detailed technical documentation and historical context for 
              each instrument in the collection.
            </p>
          </div>
        </div>
        
        <nav className={styles.chapterNavigation}>
          <Link href="/book/acknowledgements" className={styles.navButton}>
            ← Previous: Acknowledgements
          </Link>
          <Link href="/book/preface" className={styles.navButton}>
            Next: Preface →
          </Link>
        </nav>
      </article>
    </div>
  );
}