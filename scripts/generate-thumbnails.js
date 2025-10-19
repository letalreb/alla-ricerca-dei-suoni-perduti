/**
 * Script per generare anteprime (thumbnails) dai video
 * Estrae un frame dal video e lo salva come immagine
 * 
 * PREREQUISITI:
 * 1. Installa ffmpeg: brew install ffmpeg
 * 2. Esegui: node scripts/generate-thumbnails.js
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

// Configurazione
const VIDEO_DIR = path.join(__dirname, '../public/bck');
const THUMBNAILS_DIR = path.join(__dirname, '../public/images/thumbnails');
const INSTRUMENTS_FILE = path.join(__dirname, '../app/data/instruments.js');

// Opzioni per l'estrazione del frame
const THUMBNAIL_OPTIONS = {
  timePosition: '00:00:03', // Estrai frame al secondo 3
  width: 800,               // Larghezza thumbnail
  quality: 2,               // Qualità (1-31, più basso = migliore)
};

// Crea la directory per le thumbnails se non esiste
if (!fs.existsSync(THUMBNAILS_DIR)) {
  fs.mkdirSync(THUMBNAILS_DIR, { recursive: true });
  console.log(`📁 Creata directory: ${THUMBNAILS_DIR}\n`);
}

// Verifica che ffmpeg sia installato
function checkFfmpeg() {
  try {
    spawnSync('ffmpeg', ['-version'], { stdio: 'ignore' });
    return true;
  } catch (error) {
    console.error('❌ ffmpeg non trovato!');
    console.log('\n📥 Installa ffmpeg con:');
    console.log('   macOS: brew install ffmpeg');
    console.log('   Ubuntu: sudo apt-get install ffmpeg');
    console.log('   Windows: scoop install ffmpeg\n');
    return false;
  }
}

// Leggi instruments.js e estrai gli strumenti con audioFile
function loadInstrumentsWithAudio() {
  try {
    const instrumentsContent = fs.readFileSync(INSTRUMENTS_FILE, 'utf8');
    const arrayMatch = instrumentsContent.match(/export const instruments = \[([\s\S]*?)\];/);
    
    if (!arrayMatch) {
      throw new Error('Impossibile trovare l\'array instruments nel file');
    }
    
    const instruments = eval(`[${arrayMatch[1]}]`);
    
    return instruments
      .filter(inst => inst.audioFile && (inst.audioFile.endsWith('.mp4') || inst.audioFile.endsWith('.mpg')))
      .map(inst => ({
        id: inst.id,
        file: inst.audioFile
      }));
  } catch (error) {
    console.error('❌ Errore nel caricamento di instruments.js:', error.message);
    process.exit(1);
  }
}

// Genera thumbnail per un video
function generateThumbnail(instrument) {
  const videoPath = path.join(VIDEO_DIR, instrument.file);
  
  // Verifica che il file video esista
  if (!fs.existsSync(videoPath)) {
    console.log(`⚠️  File non trovato: ${instrument.file}`);
    return null;
  }

  // Nome file thumbnail (stesso nome ma .jpg)
  const thumbnailName = instrument.file.replace(/\.(mp4|mpg)$/i, '.jpg');
  const thumbnailPath = path.join(THUMBNAILS_DIR, thumbnailName);

  // Se la thumbnail esiste già, salta
  if (fs.existsSync(thumbnailPath)) {
    console.log(`⏭️  Thumbnail già esistente: ${thumbnailName}`);
    return thumbnailName;
  }

  console.log(`\n🎬 Generazione thumbnail: ${instrument.file}`);
  console.log(`   ID: ${instrument.id}`);

  try {
    // Comando ffmpeg per estrarre un frame usando spawnSync
    // Argomenti separati per evitare problemi di escaping
    const args = [
      '-ss', THUMBNAIL_OPTIONS.timePosition,
      '-i', videoPath,
      '-vframes', '1',
      '-vf', `scale=${THUMBNAIL_OPTIONS.width}:-1`,
      '-q:v', THUMBNAIL_OPTIONS.quality.toString(),
      thumbnailPath,
      '-y'
    ];
    
    const result = spawnSync('ffmpeg', args, { stdio: 'ignore' });
    
    if (result.status !== 0) {
      throw new Error(`ffmpeg exited with code ${result.status}`);
    }
    
    console.log(`✅ Creata: ${thumbnailName}`);
    
    // Ottieni dimensioni del file
    const stats = fs.statSync(thumbnailPath);
    console.log(`   Dimensione: ${(stats.size / 1024).toFixed(2)} KB`);
    
    return thumbnailName;
  } catch (error) {
    console.error(`❌ Errore: ${error.message}`);
    return null;
  }
}

// Funzione principale
async function main() {
  console.log('🖼️  Generazione thumbnails dai video\n');
  console.log('=' .repeat(50));
  
  // Verifica ffmpeg
  if (!checkFfmpeg()) {
    process.exit(1);
  }

  // Carica gli strumenti
  const instruments = loadInstrumentsWithAudio();
  console.log(`\n📋 Trovati ${instruments.length} video da processare\n`);

  let generated = 0;
  let skipped = 0;
  let errors = 0;

  // Genera thumbnail per ogni video
  for (const instrument of instruments) {
    const result = generateThumbnail(instrument);
    
    if (result === null) {
      errors++;
    } else if (fs.existsSync(path.join(THUMBNAILS_DIR, result))) {
      const stats = fs.statSync(path.join(THUMBNAILS_DIR, result));
      if (stats.size === 0) {
        errors++;
      } else {
        skipped++;
      }
    } else {
      generated++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('✅ Completato!\n');
  console.log(`   ✨ Nuove thumbnail: ${generated}`);
  console.log(`   ⏭️  Già esistenti: ${skipped}`);
  console.log(`   ❌ Errori: ${errors}`);
  console.log(`\n📁 Directory thumbnails: ${THUMBNAILS_DIR}`);
}

// Esegui
main().catch(error => {
  console.error('❌ Errore fatale:', error);
  process.exit(1);
});
