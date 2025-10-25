/**
 * Script per caricare video specifici (16, 17, 20) su Internet Archive
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');

// Configurazione
const VIDEO_DIR = path.join(__dirname, '../public/bck');
const OUTPUT_FILE = path.join(__dirname, '../archive-mappings-partial.json');

// Video da caricare
const VIDEOS_TO_UPLOAD = [
  { id: 16, file: '16 Fortepiano C. GRAF, Vienna, c. 1834.mp4' },
  { id: 17, file: '17 Fortepiano C. GRAF, Vienna, c. 1834.mp4' },
  { id: 20, file: '20 Fortepiano M. SCHOTT.mp4' }
];

// Email e password da .env
const EMAIL = process.env.ARCHIVE_EMAIL;
const PASSWORD = process.env.ARCHIVE_PASSWORD;

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
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  return `villa-medici-giulini-${String(id).padStart(2, '0')}-${name}`;
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

// Funzione per verificare se un video è già stato caricato
function checkIfExists(identifier) {
  try {
    execSync(`ia list "${identifier}"`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

// Funzione per configurare ia CLI
function configureIaCli() {
  if (!EMAIL || !PASSWORD) {
    console.error('❌ ARCHIVE_EMAIL e ARCHIVE_PASSWORD non trovati nel file .env');
    console.log('\n📖 Crea un file .env nella root del progetto:');
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

// Funzione per caricare un singolo video
async function uploadVideo(video) {
  const filePath = path.join(VIDEO_DIR, video.file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File non trovato: ${video.file}`);
    return null;
  }

  const fileSize = fs.statSync(filePath).size;
  const identifier = createIdentifier(video.id, video.file);
  const title = video.file.replace(/^\d+\s/, '').replace(/\.(mp4|mpg|mp3)$/i, '');

  console.log(`\n📤 Caricamento: ${video.file}`);
  console.log(`   Dimensione: ${(fileSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   Identifier: ${identifier}`);

  // Controlla se esiste già
  if (checkIfExists(identifier)) {
    console.log(`✅ Già presente su Archive.org: ${identifier}`);
    return {
      instrumentId: video.id,
      archiveId: identifier,
      archiveUrl: `https://archive.org/details/${identifier}`,
      embedUrl: `https://archive.org/embed/${identifier}`,
      fileName: video.file
    };
  }

  // Costruisci gli argomenti per ia upload
  const args = [
    'upload',
    identifier,
    filePath,
    `--metadata=title:${title}`,
    '--metadata=creator:Villa Medici Giulini',
    '--metadata=description:Strumento musicale storico della collezione Villa Medici Giulini, Briosco (MB), Italia. Parte del progetto \'Alla ricerca dei suoni perduti\'.',
    '--metadata=subject:musical instruments',
    '--metadata=subject:historical instruments',
    '--metadata=subject:italian heritage',
    '--metadata=subject:villa medici giulini',
    '--metadata=mediatype:movies',
    '--metadata=collection:opensource_movies',
    '--metadata=language:ita',
    '--metadata=licenseurl:https://creativecommons.org/licenses/by-nc-sa/4.0/',
    '--retries=5',
    '--no-derive'
  ];
  
  try {
    console.log(`   Caricamento in corso...`);
    
    const result = spawnSync('ia', args, { 
      stdio: 'inherit',
      timeout: 1800000 // 30 minuti timeout
    });

    if (result.status !== 0 && result.status !== null) {
      throw new Error(`Upload failed with exit code ${result.status}`);
    }

    console.log(`✅ Completato: ${identifier}`);
    console.log(`   URL: https://archive.org/details/${identifier}`);

    return {
      instrumentId: video.id,
      archiveId: identifier,
      archiveUrl: `https://archive.org/details/${identifier}`,
      embedUrl: `https://archive.org/embed/${identifier}`,
      fileName: video.file
    };
  } catch (error) {
    console.error(`❌ Errore durante l'upload: ${error.message}`);
    return null;
  }
}

// Funzione principale
async function main() {
  console.log('🏛️  Upload Video su Internet Archive');
  console.log('📹 Video da caricare: 16, 17, 20\n');

  // Verifica ia CLI
  if (!checkIaCli()) {
    console.error('❌ Internet Archive CLI non installato');
    console.log('\n📖 Installalo con:');
    console.log('pip3 install internetarchive');
    process.exit(1);
  }

  // Configura credenziali
  configureIaCli();

  const results = [];
  const errors = [];

  // Carica i video
  for (const video of VIDEOS_TO_UPLOAD) {
    const result = await uploadVideo(video);
    
    if (result) {
      results.push(result);
    } else {
      errors.push({
        instrumentId: video.id,
        fileName: video.file
      });
    }
    
    // Pausa tra upload
    if (video !== VIDEOS_TO_UPLOAD[VIDEOS_TO_UPLOAD.length - 1]) {
      console.log('⏱️  Pausa 5 secondi...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  // Salva risultati
  const output = {
    uploadDate: new Date().toISOString(),
    totalVideos: VIDEOS_TO_UPLOAD.length,
    successfulUploads: results.length,
    failedUploads: errors.length,
    mappings: results,
    errors: errors
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));

  // Riepilogo
  console.log('\n' + '='.repeat(60));
  console.log('📊 RIEPILOGO');
  console.log('='.repeat(60));
  console.log(`✅ Video caricati: ${results.length}`);
  console.log(`❌ Errori: ${errors.length}`);
  console.log(`📄 Mappings salvati in: ${OUTPUT_FILE}`);
  console.log('='.repeat(60) + '\n');

  if (results.length > 0) {
    console.log('🎯 Prossimi passi:');
    console.log('1. Verifica i video su archive.org');
    console.log('2. Copia gli identifier da archive-mappings-partial.json');
    console.log('3. Aggiorna instruments.js con archiveId e embedUrl\n');
    
    console.log('📝 Archive IDs generati:');
    results.forEach(r => {
      console.log(`   ${r.instrumentId}: ${r.archiveId}`);
    });
  }
}

main().catch(console.error);
