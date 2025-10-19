/**
 * Script per normalizzare i nomi dei file video
 * Rimuove le smart quotes e altri caratteri speciali
 */

const fs = require('fs');
const path = require('path');

const VIDEO_DIR = path.join(__dirname, '../public/bck');

// Funzione per normalizzare il nome del file
function normalizeFilename(filename) {
  return filename
    // Sostituisci smart quotes con virgolette normali
    .replace(/[\u201C\u201D]/g, '"')  // " e " -> "
    .replace(/[\u2018\u2019]/g, "'")  // ' e ' -> '
    // Normalizza caratteri accentati
    .normalize('NFD')                 // Decomponi caratteri accentati
    .replace(/[\u0300-\u036f]/g, '')  // Rimuovi diacritici
    .replace(/é/g, 'e')
    .replace(/á/g, 'a')
    .replace(/í/g, 'i')
    .replace(/ó/g, 'o')
    .replace(/ú/g, 'u');
}

// Leggi tutti i file nella directory
const files = fs.readdirSync(VIDEO_DIR);

console.log('🔄 Normalizzazione nomi file...\n');

let renamed = 0;
let skipped = 0;

files.forEach(file => {
  const oldPath = path.join(VIDEO_DIR, file);
  const normalized = normalizeFilename(file);
  const newPath = path.join(VIDEO_DIR, normalized);

  if (file !== normalized) {
    console.log(`📝 Rinomino:`);
    console.log(`   Da: ${file}`);
    console.log(`   A:  ${normalized}`);
    
    try {
      fs.renameSync(oldPath, newPath);
      renamed++;
      console.log(`   ✅ OK\n`);
    } catch (error) {
      console.log(`   ❌ Errore: ${error.message}\n`);
    }
  } else {
    skipped++;
  }
});

console.log(`\n✅ Completato!`);
console.log(`   Rinominati: ${renamed}`);
console.log(`   Non modificati: ${skipped}`);
