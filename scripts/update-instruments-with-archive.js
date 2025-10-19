/**
 * Script per aggiornare instruments.js con gli Internet Archive IDs
 * 
 * Legge il file archive-mappings.json generato da upload-to-archive.js
 * e aggiorna instruments.js aggiungendo archiveId e embedUrl
 * 
 * UTILIZZO:
 * node scripts/update-instruments-with-archive.js
 */

const fs = require('fs');
const path = require('path');

const MAPPINGS_FILE = path.join(__dirname, '../archive-mappings.json');
const INSTRUMENTS_FILE = path.join(__dirname, '../app/data/instruments.js');

function main() {
  console.log('🔄 Aggiornamento instruments.js con Archive IDs\n');

  // Leggi i mappings
  if (!fs.existsSync(MAPPINGS_FILE)) {
    console.error(`❌ File ${MAPPINGS_FILE} non trovato!`);
    console.log('Esegui prima: node scripts/upload-to-archive.js');
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

  // Per ogni mapping, aggiungi archiveId
  let updatedCount = 0;
  
  for (const mapping of mappings) {
    const { instrumentId, archiveId, embedUrl, fileName } = mapping;
    
    // Pattern per trovare l'oggetto strumento
    // Cerca la chiusura dell'oggetto con id corrispondente
    const regex = new RegExp(
      `(\\{[^}]*id:\\s*${instrumentId},[^}]*)(\\})`,
      'gs'
    );

    const match = instrumentsContent.match(regex);
    if (match) {
      // Aggiungi archiveId e embedUrl prima della chiusura
      instrumentsContent = instrumentsContent.replace(
        regex,
        `$1, archiveId: "${archiveId}", embedUrl: "${embedUrl}"$2`
      );
      console.log(`✅ ID ${instrumentId}: ${archiveId}`);
      updatedCount++;
    } else {
      console.log(`⚠️  ID ${instrumentId}: Non trovato in instruments.js`);
    }
  }

  // Salva il file aggiornato
  fs.writeFileSync(INSTRUMENTS_FILE, instrumentsContent);

  console.log('\n' + '='.repeat(60));
  console.log(`✅ Aggiornati ${updatedCount} strumenti su ${mappings.length}`);
  console.log(`📄 File salvato: ${INSTRUMENTS_FILE}`);
  console.log(`💾 Backup disponibile: ${backupFile}`);
  console.log('='.repeat(60) + '\n');

  console.log('🎉 Fatto! Ora puoi usare i componenti per embeddare i video.\n');
}

main();
