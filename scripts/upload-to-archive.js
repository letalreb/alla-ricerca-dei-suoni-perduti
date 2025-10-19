/**
 * Script per caricare automaticamente i video su Internet Archive
 * 
 * SETUP:
 * 1. Crea un account gratuito su https://archive.org/account/signup
 * 2. Configura le credenziali nel file .env:
 *    ARCHIVE_EMAIL=your_email@example.com
 *    ARCHIVE_PASSWORD=your_password
 * 3. Installa le dipendenze: npm install @internetarchive/ia-js dotenv
 * 4. Esegui: node scripts/upload-to-archive.js
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configurazione
const VIDEO_DIR = path.join(__dirname, '../public/bck');
const OUTPUT_FILE = path.join(__dirname, '../archive-mappings.json');
const COLLECTION = 'opensource_movies'; // Collezione pubblica per video culturali

// Email e password da .env
const EMAIL = process.env.ARCHIVE_EMAIL;
const PASSWORD = process.env.ARCHIVE_PASSWORD;

// Mapping strumento ID -> nome file
const instrumentFiles = [
  { id: 1, file: '01 Cembalo cosiddetto "Ottoboni".mp4' },
  { id: 2, file: '02 Arpicordo Baptista Carenonus.mp4' },
  { id: 3, file: '03 Fortepiano Anton Walter, Vienna 1790 ca.mp4' },
  { id: 4, file: '04 Fortepiano Anton Walter, Vienna, 1800 ca.mp4' },
  { id: 5, file: '05 Fortepiano Conrad Graf, Vienna, 1826.mp4' },
  { id: 6, file: '06 Fortepiano - Hieronimus Bassi, Augsburg,1785.mp4' },
  { id: 7, file: '07 Fortepiano Sebastian Erard, Parigi, 1801.mp4' },
  { id: 8, file: '08 Fortepiano John Broadwood & Son, Londra, 1806.mp4' },
  { id: 9, file: '09 Fortepiano Ignace-Joseph Pleyel, Parigi, 1807.mp4' },
  { id: 10, file: '10 Fortepiano Conrad Graf.mp4' },
  { id: 11, file: '11 Fortepiano Conrad Graf, Vienna, 1835.mp4' },
  { id: 13, file: '13 Pianoforte verticale Carl Diehl, Kassel, 1838-1840.mp4' },
  { id: 14, file: '14 Pianoforte Johann Baptist Streicher, Vienna, 1846.mp4' },
  { id: 15, file: '15 Pianoforte verticale a giraffa Johann Evangelist Schmid, Salisburgo, 1825.mp4' },
  { id: 16, file: '16 Pianoforte verticale a piramide Christian Ernst Friderici, Gera, 1745.mp4' },
  { id: 17, file: '17 Claviciterio Michele Todini, Roma, 1675.mp4' },
  { id: 18, file: '18 Clavicordo Italia meridionale, 1700.mp4' },
  { id: 19, file: '19 Pianoforte verticale John Broadwood & Sons, Londra, 1815.mp4' },
  { id: 20, file: '20 Clavicembalo Carlo Grimaldi, Messina, 1697.mp4' },
  { id: 21, file: '21 Spinettone anonimo, Italia, 1600 ca.mp4' },
  { id: 22, file: '22 Clavicembalo Giovanni Antonio Baffo, Venezia, 1581.mp4' },
  { id: 23, file: '23 Clavicembalo Johann Daniel Dulcken, Anversa, 1745.mp4' },
  { id: 24, file: '24 Clavicembalo Pascal Taskin, Parigi, 1786.mp4' },
  { id: 25, file: '25 Clavicembalo Jakob e Abraham Kirckman, Londra, 1789.mp4' },
  { id: 26, file: '26 Fortepiano da boudoir (con scatola da cucito).mp4' },
  { id: 28, file: '28 Pianoforte "Giulini" Erard, Parigi, 1842.mp4' },
  { id: 29, file: '29 Pianoforte Steinway & Sons, New York, 1875.mp4' },
  { id: 30, file: '30 Pianoforte a coda Steinway & Sons, New York, 1888.mp4' },
  { id: 32, file: '32 Pianoforte Bechstein, Berlino, 1879.mp4' },
  { id: 33, file: '33 Pianoforte E. BÉTSY (padre).mp4' },
  { id: 34, file: '34 Pianoforte a coda Boisselot & Fils.mp4' },
  { id: 35, file: '35 Pianoforte verticale (Pianino) Pleyel Paris, 1854.mp4' },
  { id: 36, file: '36 Fortepiano o Pianoforte verticale a tavolo Ignace Pleyel, Parigi, 1815 ca.mp4' },
  { id: 37, file: '37 Fortepiano o Pianoforte verticale a tavolo G. F. Wachtl & Bleyer, Vienna, 1815 ca.mp4' },
  { id: 38, file: '38 Pianoforte Pape con corde oblique, Parigi, 1834.mp4' },
  { id: 39, file: '39 Pianoforte verticale Jean Henri Pape, Parigi, 1840.mp4' },
  { id: 40, file: '40 Pianoforte verticale (pianino) Pleyel, Parigi, 1870.mp4' },
  { id: 41, file: '41 Arpa doppio movimento Sébastien Erard, Parigi, 1811.mp4' },
  { id: 42, file: '42 Arpa doppio movimento Sébastien Erard, Londra, 1819.mp4' },
  { id: 45, file: '45 Arpa doppio movimento Sébastien Erard, Parigi, 1836.mp4' },
  { id: 46, file: '46 Arpa doppio movimento Sébastien Erard, Londra, 1838.mp4' },
  { id: 47, file: '47 Arpa doppio movimento Sébastien Erard, Londra, 1838 - II.mp4' },
  { id: 48, file: '48 Arpa doppio movimento Sébastien Erard, Parigi, 1840.mp4' },
  { id: 49, file: '49 Arpa doppio movimento Sébastien Erard, Parigi, 1849.mp4' },
  { id: 50, file: '50 Arpa doppio movimento Sébastien Erard, Londra, 1851.mp4' },
  { id: 53, file: '53 Arpa doppio movimento Sébastien Erard, Londra, 1827.mp4' },
  { id: 56, file: '56 Mandolino Lombardia 1800.mp4' },
  { id: 57, file: '57 Mandolino milanese Famiglia Monzino, Milano, seconda metà del secolo XIX.mp4' },
  { id: 61, file: '61 Chitarra Gio. Batta Fabricatore, Napoli, 1805.mp4' },
  { id: 62, file: '62 Chitarra Luigi Mozzani, Cento (Ferrara), 1916.mp4' },
  { id: 63, file: '63 Organetto da slitta o da processione - Barrel organ.mp4' },
  { id: 64, file: '64 Organo domestico Giuseppe Colombo.mp4' },
  { id: 65, file: '65 Armonium Jacob Alexandre, Parigi, 1860 ca.mp4' },
];

// Funzione per creare uno slug valido per Internet Archive
function createIdentifier(id, filename) {
  const name = filename
    .replace(/^\d+\s/, '') // Rimuovi numero iniziale
    .replace(/\.(mp4|mpg|mp3)$/i, '') // Rimuovi estensione
    .toLowerCase()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[^a-z0-9]+/g, '-') // Sostituisci caratteri speciali con -
    .replace(/^-+|-+$/g, '') // Rimuovi - all'inizio e fine
    .substring(0, 80); // Limita lunghezza
  
  return `villa-medici-giulini-${String(id).padStart(2, '0')}-${name}`;
}

// Funzione per caricare un singolo video usando ia CLI
function uploadVideo(instrument) {
  const filePath = path.join(VIDEO_DIR, instrument.file);
  
  // Verifica che il file esista
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File non trovato: ${instrument.file}`);
    return null;
  }

  const fileSize = fs.statSync(filePath).size;
  const identifier = createIdentifier(instrument.id, instrument.file);
  const title = instrument.file.replace(/^\d+\s/, '').replace(/\.(mp4|mpg|mp3)$/i, '');

  console.log(`\n📤 Caricamento: ${instrument.file}`);
  console.log(`   Dimensione: ${(fileSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   Identifier: ${identifier}`);

  try {
    // Costruisci il comando ia upload
    const metadata = [
      `--metadata="title:${title}"`,
      `--metadata="creator:Villa Medici Giulini"`,
      `--metadata="description:Strumento musicale storico della collezione Villa Medici Giulini, Briosco (MB), Italia. Parte del progetto 'Alla ricerca dei suoni perduti'."`,
      `--metadata="subject:musical instruments"`,
      `--metadata="subject:historical instruments"`,
      `--metadata="subject:italian heritage"`,
      `--metadata="subject:villa medici giulini"`,
      `--metadata="mediatype:movies"`,
      `--metadata="collection:${COLLECTION}"`,
      `--metadata="language:ita"`,
      `--metadata="licenseurl:https://creativecommons.org/licenses/by-nc-sa/4.0/"`,
    ].join(' ');

    const command = `ia upload "${identifier}" "${filePath}" ${metadata}`;
    
    console.log('   Caricamento in corso...');
    execSync(command, { stdio: 'inherit' });

    console.log(`✅ Completato: ${identifier}`);
    console.log(`   URL: https://archive.org/details/${identifier}`);

    return {
      instrumentId: instrument.id,
      archiveId: identifier,
      archiveUrl: `https://archive.org/details/${identifier}`,
      embedUrl: `https://archive.org/embed/${identifier}`,
      fileName: instrument.file
    };
  } catch (error) {
    console.error(`❌ Errore durante il caricamento di ${instrument.file}:`, error.message);
    return null;
  }
}

// Funzione per verificare se ia CLI è installato
function checkIaCli() {
  try {
    execSync('ia --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

// Funzione per configurare ia CLI
function configureIaCli() {
  if (!EMAIL || !PASSWORD) {
    console.error('❌ ARCHIVE_EMAIL e ARCHIVE_PASSWORD non trovati nel file .env');
    console.log('\n📖 Aggiungi al file .env:');
    console.log('ARCHIVE_EMAIL=your_email@example.com');
    console.log('ARCHIVE_PASSWORD=your_password');
    process.exit(1);
  }

  console.log('🔐 Configurazione credenziali Internet Archive...');
  try {
    execSync(`ia configure --username="${EMAIL}" --password="${PASSWORD}"`, { stdio: 'inherit' });
    console.log('✅ Credenziali configurate\n');
  } catch (error) {
    console.error('❌ Errore nella configurazione:', error.message);
    process.exit(1);
  }
}

// Funzione principale
async function main() {
  console.log('🏛️  Upload video su Internet Archive\n');
  console.log('📁 Directory video:', VIDEO_DIR);
  console.log('📝 File di output:', OUTPUT_FILE, '\n');

  // Verifica che ia CLI sia installato
  if (!checkIaCli()) {
    console.error('❌ Internet Archive CLI non installato');
    console.log('\n📖 Installalo con:');
    console.log('pip install internetarchive');
    console.log('\nOppure:');
    console.log('pip3 install internetarchive');
    process.exit(1);
  }

  // Configura credenziali
  configureIaCli();

  const results = [];
  const errors = [];

  // Carica i video uno alla volta
  for (const instrument of instrumentFiles) {
    const result = uploadVideo(instrument);
    
    if (result) {
      results.push(result);
    } else {
      errors.push({
        instrumentId: instrument.id,
        fileName: instrument.file
      });
    }
    
    // Pausa di 3 secondi tra un upload e l'altro per evitare rate limiting
    if (instrument !== instrumentFiles[instrumentFiles.length - 1]) {
      console.log('⏱️  Pausa 3 secondi...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  // Salva i risultati
  const output = {
    uploadDate: new Date().toISOString(),
    totalVideos: instrumentFiles.length,
    successfulUploads: results.length,
    failedUploads: errors.length,
    mappings: results,
    errors: errors
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));

  // Riepilogo finale
  console.log('\n' + '='.repeat(60));
  console.log('📊 RIEPILOGO CARICAMENTO');
  console.log('='.repeat(60));
  console.log(`✅ Video caricati: ${results.length}`);
  console.log(`❌ Errori: ${errors.length}`);
  console.log(`📄 Mappings salvati in: ${OUTPUT_FILE}`);
  console.log('='.repeat(60) + '\n');

  if (results.length > 0) {
    console.log('🎉 Prossimi passi:');
    console.log('1. Verifica i video su https://archive.org/details/@your_username');
    console.log('2. Esegui: node scripts/update-instruments-with-archive.js');
    console.log('3. Questo aggiornerà instruments.js con gli Archive IDs\n');
  }
}

// Esegui
main().catch(console.error);
