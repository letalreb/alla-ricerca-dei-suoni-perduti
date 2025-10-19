/**
 * Script per sincronizzare i nomi dei file in instruments.js con i file reali
 */

const fs = require('fs');
const path = require('path');

const VIDEO_DIR = path.join(__dirname, '../public/bck');
const INSTRUMENTS_FILE = path.join(__dirname, '../app/data/instruments.js');

// Leggi tutti i file reali nella directory
const realFiles = fs.readdirSync(VIDEO_DIR);

// Crea un mapping ID -> nome file reale
const fileMapping = {};
realFiles.forEach(file => {
  // Estrai l'ID dal nome del file (primi 2 numeri)
  const match = file.match(/^(\d{1,2})\s/);
  if (match) {
    const id = parseInt(match[1]);
    fileMapping[id] = file;
  }
});

// Leggi instruments.js
let instrumentsContent = fs.readFileSync(INSTRUMENTS_FILE, 'utf8');

// Backup
const backupFile = INSTRUMENTS_FILE + '.backup-' + Date.now();
fs.writeFileSync(backupFile, instrumentsContent);
console.log(`📋 Backup creato: ${path.basename(backupFile)}\n`);

let updated = 0;

// Per ogni strumento, aggiorna il nome del file se diverso
Object.keys(fileMapping).forEach(id => {
  const realFile = fileMapping[id];
  const idNum = parseInt(id);
  
  // Cerca la riga con questo ID
  const regex = new RegExp(`(id: ${idNum},.*?audioFile:\\s*")(.*?)("\\s*})`, 's');
  const match = instrumentsContent.match(regex);
  
  if (match) {
    const currentFile = match[2];
    // Escape delle virgolette nel nome del file
    const escapedRealFile = realFile.replace(/"/g, '\\"');
    if (currentFile !== escapedRealFile) {
      console.log(`📝 ID ${id}:`);
      console.log(`   Era: ${currentFile}`);
      console.log(`   Ora: ${escapedRealFile}`);
      
      instrumentsContent = instrumentsContent.replace(
        regex,
        `$1${escapedRealFile}$3`
      );
      updated++;
    }
  }
});

// Salva il file aggiornato
fs.writeFileSync(INSTRUMENTS_FILE, instrumentsContent);

console.log(`\n✅ Aggiornamento completato!`);
console.log(`   File aggiornati: ${updated}`);
console.log(`   Backup salvato in: ${backupFile}`);
