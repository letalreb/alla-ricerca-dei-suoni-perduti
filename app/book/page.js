/* eslint-disable react/prop-types */
import Image from 'next/image';
import Link from 'next/link';
import styles from './book.module.css';

// Structured data for the book's table of contents
const bookData = {
  title: "Alla Ricerca dei suoni perduti",
  englishTitle: "In search of lost sounds",
  cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=359&h=454&fit=crop&crop=center",
  sections: [
    {
      title: "Autore / The Author",
      pageNumber: 4,
      link: "/book/author"
    },
    {
      title: "Ringraziamenti / Acknowledgements", 
      pageNumber: 5,
      link: "/book/acknowledgements"
    },
    {
      title: "Alla ricerca dei suoni perduti / In search of lost sounds",
      pageNumber: 7,
      link: "/book/introduction"
    }
  ],
  chapters: [
    {
      author: "JOHN HENRY VAN DER MEER",
      sections: [
        {
          title: "Prefazione / Preface",
          pageNumber: 10,
          link: "/book/preface"
        },
        {
          title: "NASCITA E SVILUPPO DEL PIANOFORTE / BIRTH AND DEVELOPMENT OF THE PIANO",
          pageNumber: 16,
          link: "/book/piano-development"
        },
        {
          title: "L'invenzione della tastiera / The invention of the keyboard",
          pageNumber: 18,
          link: "/book/keyboard-invention"
        },
        {
          title: "Introduzione agli strumenti storici a tastiera / Introduction to the early keyboard instruments",
          pageNumber: 22,
          link: "/book/keyboard-instruments"
        },
        {
          title: "Schede degli strumenti storici a tastiera dal N. 1 al N. 32 / Schedules of the early keyboard instruments from no. 1 to no. 32",
          pageNumber: 96,
          link: "/book/keyboard-schedules"
        }
      ]
    },
    {
      author: "GRANT O'BRIEN",
      sections: [
        {
          title: "Introduzione al catalogo dei pianoforti posteriori al 1850 nella Collezione Giulini / An introduction to the catalogue of the post-1850 pianos in the Giulini Collection",
          pageNumber: 282,
          link: "/book/piano-catalogue"
        },
        {
          title: "Schede dei pianoforti moderni dal N. 33 al N. 38 / Schedules of the modern pianos from no. 33 to no. 38",
          pageNumber: 312,
          link: "/book/modern-pianos"
        }
      ]
    },
    {
      author: "OSCAR MISCHIATI",
      sections: [
        {
          title: "Schede degli organi storici dal N. 39 al N. 41 / Schedules of the historical organs from no. 39 to no. 41",
          pageNumber: 368,
          link: "/book/historical-organs"
        }
      ]
    },
    {
      author: "JOHN HENRY VAN DER MEER",
      sections: [
        {
          title: "NASCITA E SVILUPPO DELL'ARPA / BIRTH AND DEVELOPMENT OF THE HARP",
          pageNumber: 386,
          link: "/book/harp-development"
        },
        {
          title: "Introduzione alle arpe storiche / Introduction to the historical harps",
          pageNumber: 388,
          link: "/book/historical-harps"
        }
      ]
    },
    {
      author: "DAGMAR DROYSEN-REBER",
      sections: [
        {
          title: "Introduzione alle schede delle arpe dal N. 42 al N. 52 / Introduction to the schedules of the harps from no. 42 to no. 52",
          pageNumber: 410,
          link: "/book/harp-schedules-intro"
        },
        {
          title: "Prefazione / Preface",
          pageNumber: 412,
          link: "/book/harp-preface"
        },
        {
          title: "Notizie storiche sulle arpe dell'Europa occidentale / A survey of Western European harps",
          pageNumber: 414,
          link: "/book/western-european-harps"
        },
        {
          title: "Schede delle arpe dal N. 42 al N. 52 / Schedules of the harps from no. 42 to no. 52",
          pageNumber: 432,
          link: "/book/harp-schedules"
        }
      ]
    },
    {
      author: "JOHN HENRY VAN DER MEER",
      sections: [
        {
          title: "NASCITA E SVILUPPO DEL SALTERIO / BIRTH AND DEVELOPMENT OF THE PSALTERY",
          pageNumber: 502,
          link: "/book/psaltery-development"
        },
        {
          title: "Introduzione / Introduction",
          pageNumber: 504,
          link: "/book/psaltery-introduction"
        },
        {
          title: "Schede dei salteri dal N. 53 al N. 57 / Schedules of the psalteries from no. 53 to no. 57",
          pageNumber: 512,
          link: "/book/psaltery-schedules"
        }
      ]
    },
    {
      author: "TIZIANO RIZZI",
      sections: [
        {
          title: "NASCITA E SVILUPPO DEGLI STRUMENTI A PIZZICO / BIRTH AND DEVELOPMENT OF THE PLUCKED INSTRUMENTS",
          pageNumber: 536,
          link: "/book/plucked-instruments"
        },
        {
          title: "Introduzione mandolini e chitarra / Introduction mandolins and guitar",
          pageNumber: 538,
          link: "/book/mandolins-guitar"
        },
        {
          title: "Schede dei mandolini e della chitarra dal N. 58 al N. 60 / Schedules of the mandolins and of the guitar from no. 58 to no. 60",
          pageNumber: 546,
          link: "/book/mandolins-schedules"
        }
      ]
    }
  ],
  essays: {
    title: "SAGGI SU ARTE E MUSICOLOGIA / Essays on art and musicology",
    sections: [
      {
        author: "CARLO BERTELLI",
        title: "Le immagini della musica / The imagery of music",
        pageNumber: 564,
        link: "/book/music-imagery"
      },
      {
        author: "DANIELA DI CASTRO",
        title: "Fortepiani, oggetti d'arredo / Fortepianos as objects of furniture",
        pageNumber: 582,
        link: "/book/fortepianos-furniture"
      },
      {
        author: "ANDREINA BAZZI",
        title: "Nota introduttiva di araldica / A note on heraldry",
        pageNumber: 594,
        link: "/book/heraldry"
      },
      {
        author: "RENATO MEUCCI",
        title: "Fondamenti di Organologia Musicale / The foundation of Musical Organology",
        pageNumber: 598,
        link: "/book/musical-organology"
      },
      {
        author: "MICHAEL LATCHAM",
        title: "Johann Ferdinand Schönfeld: conversazioni su Streicher e Schanz / In conversations about Streicher and Schanz",
        pageNumber: 618,
        link: "/book/schonfeld-conversations"
      },
      {
        author: "LAURENCE LIBIN",
        title: "Riflessioni sulla storia dei primi strumenti a tastiera / Reflections on the history of early keyboards",
        pageNumber: 626,
        link: "/book/keyboard-history"
      },
      {
        author: "PIER FAUSTO BAGATTI VALSECCHI",
        title: "Musica e architettura / Music and architecture",
        pageNumber: 632,
        link: "/book/music-architecture"
      },
      {
        author: "GUGLIELMO MOZZONI",
        title: "Brevissima storia degli strumenti musicali",
        pageNumber: 638,
        link: "/book/brief-instrument-history"
      }
    ]
  },
  appendices: [
    {
      authors: "ANDREA GATTI E VALENTINA RICETTI",
      title: "Calchi delle cornici dal N. 1 al N. 9 / Moulding castings from no.1 to no. 9",
      pageNumber: 654,
      link: "/book/moulding-castings"
    },
    {
      author: "AUGUSTO BONZA",
      sections: [
        {
          title: "Terminologia dei legni / Wood terminology",
          pageNumber: 668,
          link: "/book/wood-terminology"
        },
        {
          title: "Glossario dei termini tecnici nei cordofoni a tastiera / Glossary of keyboard instruments technical terms",
          pageNumber: 670,
          link: "/book/keyboard-glossary"
        }
      ]
    },
    {
      author: "DAGMAR DROYSEN-REBER",
      title: "Glossario dei termini specifici per l'arpa / Glossary of special terms used for the harp",
      pageNumber: 686,
      link: "/book/harp-glossary"
    },
    {
      author: "TIZIANO RIZZI",
      title: "Glossario degli strumenti a pizzico / Glossary for plucked instruments",
      pageNumber: 692,
      link: "/book/plucked-glossary"
    }
  ],
  finalSections: [
    {
      title: "Curricula degli scrittori / Curricula of the authors",
      pageNumber: 694,
      link: "/book/authors"
    },
    {
      title: "Confronto tra le notazioni italiane e Helmholtz / Comparison between Italian and Helmholtz notations",
      pageNumber: 699,
      link: "/book/notations"
    },
    {
      title: "Bibliografie / Bibliographies",
      pageNumber: 700,
      link: "/book/bibliography"
    },
    {
      title: "Indice dei nomi / Index of names",
      pageNumber: 709,
      link: "/book/name-index"
    },
    {
      title: "Indice generale / General index",
      pageNumber: 713,
      link: "/book/general-index"
    }
  ]
};

// Component for rendering a table of contents section
function TOCSection({ title, pageNumber, link, isMainTitle = false }) {
  return (
    <div className={isMainTitle ? styles.mainSection : styles.section}>
      <Link href={link} className={styles.sectionLink}>
        <span className={styles.pageNumber}>pag. {pageNumber}</span>
        <span className={styles.sectionTitle}>{title}</span>
      </Link>
    </div>
  );
}

// Component for rendering author sections
function AuthorSection({ author, sections }) {
  return (
    <div className={styles.authorSection}>
      <h3 className={styles.authorName}>{author}</h3>
      {sections.map((section) => (
        <TOCSection
          key={section.link}
          title={section.title}
          pageNumber={section.pageNumber}
          link={section.link}
        />
      ))}
    </div>
  );
}

export default function BookIndex() {
  return (
    <div className={styles.container}>
      {/* Book Cover */}
      <div className={styles.coverSection}>
        <Image
          src={bookData.cover}
          alt={bookData.title}
          width={359}
          height={454}
          className={styles.coverImage}
          priority
        />
      </div>

      {/* Initial Sections */}
      <div className={styles.initialSections}>
        {bookData.sections.map((section) => (
          <TOCSection
            key={section.link}
            title={section.title}
            pageNumber={section.pageNumber}
            link={section.link}
            isMainTitle={section.pageNumber === 7}
          />
        ))}
      </div>

      {/* Table of Contents Header */}
      <div className={styles.tocHeader}>
        <h2>Sommario / Summary</h2>
      </div>

      {/* Main Chapters */}
      <div className={styles.chaptersSection}>
        {bookData.chapters.map((chapter) => (
          <AuthorSection
            key={`${chapter.author}-${chapter.sections[0]?.link}`}
            author={chapter.author}
            sections={chapter.sections}
          />
        ))}
      </div>

      {/* Essays Section */}
      <div className={styles.essaysSection}>
        <h2 className={styles.sectionHeader}>{bookData.essays.title}</h2>
        {bookData.essays.sections.map((essay) => (
          <div key={essay.link} className={styles.essayItem}>
            <Link href={essay.link} className={styles.sectionLink}>
              <span className={styles.pageNumber}>pag. {essay.pageNumber}</span>
              <span className={styles.authorName}>{essay.author}</span>
              <span className={styles.sectionTitle}>{essay.title}</span>
            </Link>
          </div>
        ))}
      </div>

      {/* Appendices */}
      <div className={styles.appendicesSection}>
        {bookData.appendices.map((appendix) => (
          <div key={appendix.link || `${appendix.author}-appendix`} className={styles.appendixItem}>
            {appendix.sections ? (
              <AuthorSection
                author={appendix.author}
                sections={appendix.sections}
              />
            ) : (
              <div className={styles.singleAppendix}>
                <h3 className={styles.authorName}>
                  {appendix.author || appendix.authors}
                </h3>
                <TOCSection
                  title={appendix.title}
                  pageNumber={appendix.pageNumber}
                  link={appendix.link}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Final Sections */}
      <div className={styles.finalSections}>
        {bookData.finalSections.map((section) => (
          <TOCSection
            key={section.link}
            title={section.title}
            pageNumber={section.pageNumber}
            link={section.link}
          />
        ))}
      </div>
    </div>
  );
}