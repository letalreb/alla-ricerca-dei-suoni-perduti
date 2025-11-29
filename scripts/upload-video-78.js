/**
 * Script per caricare video 78 su Internet Archive
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');

// Configurazione
const VIDEO_DIR = path.join(__dirname, '../public/bck');
const OUTPUT_FILE = path.join(__dirname, '../archive-mapping-78.json');

// Video da caricare
const VIDEO = { id: 78, file: '78_Pleyel Forte.mp4' };

// Email e password da .env
const EMAIL = process.env.ARCHIVE_EMAIL;
const PASSWORD = process.env.ARCHIVE_PASSWORD;

// Funzione per creare uno slug valido per Internet Archive
function createIdentifier(id, filename) {
  return `villa-medici-giulini-78-pianoforte-a-coda-pleyel-n-173871-parigi-ca-1923`;
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

// Funzione per caricare il video
async function uploadVideo(video) {
  const filePath = path.join(VIDEO_DIR, video.file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File non trovato: ${video.file}`);
    return null;
  }

  const fileSize = fs.statSync(filePath).size;
  const identifier = createIdentifier(video.id, video.file);
  const title = 'Pianoforte a coda Pleyel, n.173871, Parigi, ca. 1923';

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
    '--metadata=description:Pianoforte a coda Pleyel, n.173871, Parigi, ca. 1923. Strumento musicale storico della collezione Villa Medici Giulini, Briosco (MB), Italia. Parte del progetto \'Alla ricerca dei suoni perduti\'.',
    '--metadata=subject:musical instruments',
    '--metadata=subject:historical instruments',
    '--metadata=subject:piano',
    '--metadata=subject:pleyel',
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
  console.log('🏛️  Upload Video 78 su Internet Archive\n');

  // Verifica ia CLI
  if (!checkIaCli()) {
    console.error('❌ Internet Archive CLI non installato');
    console.log('\n📖 Installalo con:');
    console.log('pip3 install internetarchive');
    process.exit(1);
  }

  // Configura credenziali
  configureIaCli();

  const result = await uploadVideo(VIDEO);

  if (result) {
    // Salva risultati
    const output = {
      uploadDate: new Date().toISOString(),
      mapping: result
    };

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));

    console.log('\n' + '='.repeat(60));
    console.log('📊 RIEPILOGO');
    console.log('='.repeat(60));
    console.log(`✅ Video caricato con successo`);
    console.log(`📄 Mapping salvato in: ${OUTPUT_FILE}`);
    console.log('='.repeat(60) + '\n');
    
    console.log('📝 Archive ID:');
    console.log(`   ${result.archiveId}`);
    console.log('\n🔗 URL:');
    console.log(`   ${result.archiveUrl}`);
  } else {
    console.log('\n❌ Caricamento fallito');
    process.exit(1);
  }
}

main().catch(console.error);
