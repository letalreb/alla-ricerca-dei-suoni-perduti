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
const { execSync, spawnSync } = require('child_process');

// Configurazione
const VIDEO_DIR = path.join(__dirname, '../public/bck');
const OUTPUT_FILE = path.join(__dirname, '../archive-mappings.json');
const INSTRUMENTS_FILE = path.join(__dirname, '../app/data/instruments.js');
const COLLECTION = 'opensource_movies'; // Collezione pubblica per video culturali

// Email e password da .env
const EMAIL = process.env.ARCHIVE_EMAIL;
const PASSWORD = process.env.ARCHIVE_PASSWORD;

// Leggi instruments.js e estrai gli strumenti con audioFile
function loadInstrumentsWithAudio() {
  try {
    // Leggi il file instruments.js
    const instrumentsContent = fs.readFileSync(INSTRUMENTS_FILE, 'utf8');
    
    // Estrai l'array degli strumenti usando regex
    const arrayMatch = instrumentsContent.match(/export const instruments = \[([\s\S]*?)\];/);
    if (!arrayMatch) {
      throw new Error('Impossibile trovare l\'array instruments nel file');
    }
    
    // Usa eval per parsare l'array (sicuro perché è il nostro file)
    const instruments = eval(`[${arrayMatch[1]}]`);
    
    // Filtra solo gli strumenti con audioFile
    return instruments
      .filter(inst => inst.audioFile)
      .map(inst => ({
        id: inst.id,
        file: inst.audioFile
      }));
  } catch (error) {
    console.error('❌ Errore nel caricamento di instruments.js:', error.message);
    console.log('\nVerifica che il file app/data/instruments.js esista e sia valido.');
    process.exit(1);
  }
}

// Carica gli strumenti con file audio
const instrumentFiles = loadInstrumentsWithAudio();
console.log(`📚 Caricati ${instrumentFiles.length} strumenti con file audio da instruments.js\n`);

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
    .replace(/^-+|-+$/g, ''); // Rimuovi - all'inizio e fine
  
  const prefix = `vmg-${String(id).padStart(2, '0')}`;
  const maxNameLength = 80 - prefix.length - 1; // -1 per il trattino
  const truncatedName = name.substring(0, maxNameLength);
  
  return `${prefix}-${truncatedName}`;
}

// Funzione per verificare se un video è già stato caricato su Archive
function checkIfExists(identifier) {
  try {
    execSync(`ia list "${identifier}"`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

// Funzione per caricare un singolo video usando ia CLI con retry
async function uploadVideo(instrument, maxRetries = 3) {
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

  // Controlla se esiste già
  if (checkIfExists(identifier)) {
    console.log(`✅ Già presente su Archive.org: ${identifier}`);
    return {
      instrumentId: instrument.id,
      archiveId: identifier,
      archiveUrl: `https://archive.org/details/${identifier}`,
      embedUrl: `https://archive.org/embed/${identifier}`,
      fileName: instrument.file
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
    `--metadata=collection:${COLLECTION}`,
    '--metadata=language:ita',
    '--metadata=licenseurl:https://creativecommons.org/licenses/by-nc-sa/4.0/',
    '--retries',
    '5',
    '--no-derive'
  ];
  
  // Prova con retry
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`   Caricamento in corso... (tentativo ${attempt}/${maxRetries})`);
      
      // Usa timeout più lungo per file grandi
      const timeoutMinutes = Math.ceil(fileSize / (1024 * 1024 * 2)); // 1 minuto ogni 2MB
      const timeoutSeconds = Math.max(600, timeoutMinutes * 60); // Minimo 10 minuti
      
      const result = spawnSync('ia', args, { 
        stdio: 'inherit',
        timeout: timeoutSeconds * 1000,
        env: { ...process.env, IA_TIMEOUT: '300' } // Timeout IA in secondi
      });

      if (result.status !== 0 && result.status !== null) {
        throw new Error(`Upload failed with exit code ${result.status}`);
      }

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
      // Se il video è al 100% ma timeout alla fine, controlla se esiste
      if (error.message.includes('timeout') || error.message.includes('ReadTimeout')) {
        console.log(`⏱️  Timeout durante finalizzazione, verifico se caricamento completato...`);
        
        // Aspetta 30 secondi che Archive.org processi
        await new Promise(resolve => setTimeout(resolve, 30000));
        
        // Controlla se il video è ora disponibile
        if (checkIfExists(identifier)) {
          console.log(`✅ Video verificato su Archive.org: ${identifier}`);
          console.log(`   URL: https://archive.org/details/${identifier}`);
          
          return {
            instrumentId: instrument.id,
            archiveId: identifier,
            archiveUrl: `https://archive.org/details/${identifier}`,
            embedUrl: `https://archive.org/embed/${identifier}`,
            fileName: instrument.file
          };
        }
      }
      
      if (attempt < maxRetries) {
        const waitTime = attempt * 15; // 15s, 30s, 45s
        console.log(`⚠️  Errore, riprovo tra ${waitTime} secondi...`);
        await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
      } else {
        console.error(`❌ Errore finale dopo ${maxRetries} tentativi: ${instrument.file}`);
        console.log(`   Il file potrebbe essere stato caricato, verifica manualmente:`);
        console.log(`   https://archive.org/details/${identifier}`);
        return null;
      }
    }
  }

  return null;
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

  // Carica risultati precedenti se esistono (per resume)
  let results = [];
  let errors = [];
  
  if (fs.existsSync(OUTPUT_FILE)) {
    try {
      const previousData = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
      results = previousData.mappings || [];
      errors = previousData.errors || [];
      console.log(`📂 Trovato file precedente con ${results.length} video già caricati`);
      console.log(`   Riprendo da dove interrotto...\n`);
    } catch (error) {
      console.log('⚠️  File precedente non valido, ricomincio da capo\n');
    }
  }

  // IDs già caricati con successo
  const uploadedIds = new Set(results.map(r => r.instrumentId));

  // Carica i video uno alla volta
  for (const instrument of instrumentFiles) {
    // Salta se già caricato
    if (uploadedIds.has(instrument.id)) {
      console.log(`⏭️  Saltato ${instrument.id}: ${instrument.file} (già caricato)`);
      continue;
    }

    const result = await uploadVideo(instrument);
    
    if (result) {
      results.push(result);
      // Salva progressi dopo ogni upload riuscito
      const progressOutput = {
        uploadDate: new Date().toISOString(),
        totalVideos: instrumentFiles.length,
        successfulUploads: results.length,
        failedUploads: errors.length,
        mappings: results,
        errors: errors
      };
      fs.writeFileSync(OUTPUT_FILE, JSON.stringify(progressOutput, null, 2));
    } else {
      errors.push({
        instrumentId: instrument.id,
        fileName: instrument.file
      });
    }
    
    // Pausa di 5 secondi tra un upload e l'altro per evitare rate limiting
    if (instrument !== instrumentFiles[instrumentFiles.length - 1]) {
      console.log('⏱️  Pausa 5 secondi...');
      await new Promise(resolve => setTimeout(resolve, 5000));
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
