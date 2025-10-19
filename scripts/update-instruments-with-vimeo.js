/**
 * Script per aggiornare instruments.js con i Vimeo IDs
 * 
 * Legge il file vimeo-mappings.json generato da upload-to-vimeo.js
 * e aggiorna instruments.js sostituendo audioFile con vimeoId
 * 
 * UTILIZZO:
 * node scripts/update-instruments-with-vimeo.js
 */

const fs = require('fs');
const path = require('path');

const MAPPINGS_FILE = path.join(__dirname, '../vimeo-mappings.json');
const INSTRUMENTS_FILE = path.join(__dirname, '../app/data/instruments.js');

function main() {
  console.log('🔄 Aggiornamento instruments.js con Vimeo IDs\n');

  // Leggi i mappings
  if (!fs.existsSync(MAPPINGS_FILE)) {
    console.error(`❌ File ${MAPPINGS_FILE} non trovato!`);
    console.log('Esegui prima: node scripts/upload-to-vimeo.js');
    process.exit(1);
  }

  const mappingsData = JSON.parse(fs.readFileSync(MAPPINGS_FILE, 'utf8'));
  const mappings = mappingsData.mappings;

  console.log(`📄 Trovati ${mappings.length} video mappings`);

  // Leggi instruments.js
  let instrumentsContent = fs.readFileSync(INSTRUMENTS_FILE, 'utf8');

  // Crea un backup
  const backupFile = INSTRUMENTS_FILE + '.backup';
  fs.writeFileSync(backupFile, instrumentsContent);
  console.log(`💾 Backup creato: ${backupFile}\n`);

  // Per ogni mapping, sostituisci audioFile con vimeoId
  let updatedCount = 0;
  
  mappings.forEach(mapping => {
    const { instrumentId, vimeoId, fileName } = mapping;
    
    // Pattern per trovare l'oggetto strumento
    // Cerca: { id: X, ..., audioFile: "..." }
    const regex = new RegExp(
      `(\\{\\s*id:\\s*${instrumentId},\\s*name:[^}]*?audioFile:\\s*["'])([^"']*)(["']\\s*\\})`,
      'gs'
    );

    const before = instrumentsContent;
    instrumentsContent = instrumentsContent.replace(regex, `$1${fileName}$3`);
    
    // Ora aggiungi il campo vimeoId dopo audioFile
    const vimeoRegex = new RegExp(
      `(\\{\\s*id:\\s*${instrumentId},\\s*[^}]*?audioFile:\\s*["'][^"']*["'])(\\s*\\})`,
      'gs'
    );

    instrumentsContent = instrumentsContent.replace(
      vimeoRegex,
      `$1, vimeoId: "${vimeoId}"$2`
    );

    if (before !== instrumentsContent) {
      console.log(`✅ ID ${instrumentId}: ${vimeoId} (${fileName})`);
      updatedCount++;
    } else {
      console.log(`⚠️  ID ${instrumentId}: Non trovato in instruments.js`);
    }
  });

  // Salva il file aggiornato
  fs.writeFileSync(INSTRUMENTS_FILE, instrumentsContent);

  console.log('\n' + '='.repeat(60));
  console.log(`✅ Aggiornati ${updatedCount} strumenti su ${mappings.length}`);
  console.log(`📄 File salvato: ${INSTRUMENTS_FILE}`);
  console.log(`💾 Backup disponibile: ${backupFile}`);
  console.log('='.repeat(60) + '\n');

  console.log('🎉 Prossimi passi:');
  console.log('1. Verifica instruments.js');
  console.log('2. Aggiorna il componente per usare Vimeo player');
  console.log('3. Testa il sito con: npm run dev\n');
}

main();
