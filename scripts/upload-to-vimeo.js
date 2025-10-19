/**
 * Script per caricare automaticamente i video su Vimeo
 * 
 * SETUP:
 * 1. Crea un'app Vimeo su: https://developer.vimeo.com/apps
 * 2. Genera un Access Token con scopes: "upload", "edit", "video_files"
 * 3. Crea un file .env nella root del progetto con:
 *    VIMEO_ACCESS_TOKEN=your_token_here
 * 4. Installa le dipendenze: npm install vimeo dotenv
 * 5. Esegui: node scripts/upload-to-vimeo.js
 */

require('dotenv').config();
const { Vimeo } = require('vimeo');
const fs = require('fs');
const path = require('path');

// Configurazione Vimeo
const client = new Vimeo(
  null, // client_id non necessario per personal access token
  null, // client_secret non necessario
  process.env.VIMEO_ACCESS_TOKEN
);

// Directory con i video
const VIDEO_DIR = path.join(__dirname, '../public/audio');
const OUTPUT_FILE = path.join(__dirname, '../vimeo-mappings.json');

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

// Colori e descrizioni per ogni video
const getVideoMetadata = (instrument) => {
  return {
    name: `${instrument.id}. ${instrument.file.replace(/^\d+\s/, '').replace(/\.(mp4|mpg|mp3)$/, '')}`,
    description: `Strumento musicale della collezione Villa Medici Giulini\n\nParte della collezione "Alla ricerca dei suoni perduti"\nVilla Medici Giulini - Briosco (MB)\n\nhttps://www.villamedici-giulini.it/`,
    privacy: {
      view: 'anybody', // 'anybody', 'nobody', 'password', 'unlisted'
      embed: 'public'
    },
    embed: {
      color: '8b1538', // Burgundy color
      buttons: {
        like: false,
        watchlater: false,
        share: true,
        embed: false
      }
    }
  };
};

// Funzione per caricare un singolo video
async function uploadVideo(instrument) {
  const filePath = path.join(VIDEO_DIR, instrument.file);
  
  // Verifica che il file esista
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File non trovato: ${instrument.file}`);
    return null;
  }

  const fileSize = fs.statSync(filePath).size;
  const metadata = getVideoMetadata(instrument);

  console.log(`📤 Caricamento: ${instrument.file} (${(fileSize / 1024 / 1024).toFixed(2)} MB)`);

  return new Promise((resolve, reject) => {
    client.upload(
      filePath,
      metadata,
      function (uri) {
        // Estrai l'ID video dall'URI (/videos/123456789)
        const vimeoId = uri.split('/').pop();
        console.log(`✅ Completato: ${instrument.file} -> Vimeo ID: ${vimeoId}`);
        
        resolve({
          instrumentId: instrument.id,
          vimeoId: vimeoId,
          vimeoUri: uri,
          fileName: instrument.file
        });
      },
      function (bytesUploaded, bytesTotal) {
        const percent = ((bytesUploaded / bytesTotal) * 100).toFixed(1);
        process.stdout.write(`\r   Progresso: ${percent}% (${(bytesUploaded / 1024 / 1024).toFixed(2)}MB / ${(bytesTotal / 1024 / 1024).toFixed(2)}MB)`);
      },
      function (error) {
        console.error(`\n❌ Errore durante il caricamento di ${instrument.file}:`, error);
        reject(error);
      }
    );
  });
}

// Funzione principale
async function main() {
  console.log('🎬 Inizio caricamento video su Vimeo\n');
  console.log(`📁 Directory video: ${VIDEO_DIR}`);
  console.log(`📝 File di output: ${OUTPUT_FILE}\n`);

  // Verifica token
  if (!process.env.VIMEO_ACCESS_TOKEN) {
    console.error('❌ VIMEO_ACCESS_TOKEN non trovato nel file .env');
    console.log('\n📖 Istruzioni:');
    console.log('1. Vai su https://developer.vimeo.com/apps');
    console.log('2. Crea una nuova app o usa una esistente');
    console.log('3. Genera un Personal Access Token con scopes: upload, edit, video_files');
    console.log('4. Aggiungi al file .env: VIMEO_ACCESS_TOKEN=your_token_here');
    process.exit(1);
  }

  const results = [];
  const errors = [];

  // Carica i video uno alla volta (per evitare rate limiting)
  for (const instrument of instrumentFiles) {
    try {
      const result = await uploadVideo(instrument);
      if (result) {
        results.push(result);
        console.log('\n'); // Nuova riga dopo ogni video
      }
      
      // Pausa di 2 secondi tra un upload e l'altro
      if (instrument !== instrumentFiles[instrumentFiles.length - 1]) {
        console.log('⏱️  Pausa 2 secondi...\n');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      errors.push({
        instrumentId: instrument.id,
        fileName: instrument.file,
        error: error.message
      });
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
  console.log(`✅ Video caricati con successo: ${results.length}`);
  console.log(`❌ Errori: ${errors.length}`);
  console.log(`📄 Mappings salvati in: ${OUTPUT_FILE}`);
  console.log('='.repeat(60) + '\n');

  if (results.length > 0) {
    console.log('🎉 Prossimi passi:');
    console.log('1. Esegui: node scripts/update-instruments-with-vimeo.js');
    console.log('2. Questo aggiornerà automaticamente instruments.js con i Vimeo IDs\n');
  }
}

// Esegui lo script
main().catch(console.error);
