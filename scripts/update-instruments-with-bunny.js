/**
 * Script per aggiornare instruments.js con gli URL di Bunny.net
 * 
 * SETUP:
 * 1. Prima esegui upload-to-bunny.js per caricare i video
 * 2. Questo script leggerà bunny-mappings.json e aggiornerà instruments.js
 * 3. Esegui: node scripts/update-instruments-with-bunny.js
 */

const fs = require('fs');
const path = require('path');

// Configurazione
const MAPPINGS_FILE = path.join(__dirname, '../bunny-mappings.json');
const INSTRUMENTS_FILE = path.join(__dirname, '../app/data/instruments.js');
const BACKUP_FILE = path.join(__dirname, '../app/data/instruments.js.backup-bunny-' + Date.now());

// Carica i mappings di Bunny.net
function loadBunnyMappings() {
  if (!fs.existsSync(MAPPINGS_FILE)) {
    console.error('❌ File bunny-mappings.json non trovato!');
    console.log('Esegui prima: node scripts/upload-to-bunny.js');
    process.exit(1);
  }
  
  try {
    return JSON.parse(fs.readFileSync(MAPPINGS_FILE, 'utf8'));
  } catch (error) {
    console.error('❌ Errore nella lettura di bunny-mappings.json:', error.message);
    process.exit(1);
  }
}

// Leggi instruments.js
function loadInstrumentsFile() {
  try {
    return fs.readFileSync(INSTRUMENTS_FILE, 'utf8');
  } catch (error) {
    console.error('❌ Errore nella lettura di instruments.js:', error.message);
    process.exit(1);
  }
}

// Parse instruments array
function parseInstruments(content) {
  try {
    const arrayMatch = content.match(/export const instruments = \[([\s\S]*?)\];/);
    if (!arrayMatch) {
      throw new Error('Impossibile trovare l\'array instruments nel file');
    }
    return eval(`[${arrayMatch[1]}]`);
  } catch (error) {
    console.error('❌ Errore nel parsing di instruments.js:', error.message);
    process.exit(1);
  }
}

// Aggiorna un singolo strumento con i dati Bunny.net
function updateInstrumentWithBunny(instrument, bunnyData) {
  const updated = { ...instrument };
  
  if (bunnyData.method === 'storage') {
    // Per Storage: usa un player video standard
    updated.bunnyUrl = bunnyData.bunnyUrl;
    updated.bunnyMethod = 'storage';
  } else if (bunnyData.method === 'stream') {
    // Per Stream: usa il player embed di Bunny.net
    updated.bunnyVideoGuid = bunnyData.videoGuid;
    updated.bunnyEmbedUrl = bunnyData.embedUrl;
    updated.bunnyDirectUrl = bunnyData.directUrl;
    updated.bunnyMethod = 'stream';
  }
  
  return updated;
}

// Genera il contenuto aggiornato del file
function generateUpdatedContent(instruments) {
  let content = '// Database completo dei 92 strumenti musicali della collezione\n';
  content += '// "Alla Ricerca dei Suoni Perduti"\n\n';
  content += 'export const instruments = [\n';
  
  instruments.forEach((inst, index) => {
    content += '  {\n';
    
    // Ordina le proprietà in modo logico
    const orderedKeys = [
      'id', 'name', 'year', 'audioFile', 
      'archiveId', 'embedUrl',
      'bunnyMethod', 'bunnyUrl', 'bunnyVideoGuid', 'bunnyEmbedUrl', 'bunnyDirectUrl'
    ];
    
    const otherKeys = Object.keys(inst).filter(k => !orderedKeys.includes(k));
    const allKeys = [...orderedKeys, ...otherKeys].filter(k => inst[k] !== undefined);
    
    allKeys.forEach((key, i) => {
      const value = inst[key];
      let formattedValue;
      
      if (typeof value === 'string') {
        // Escape delle virgolette e newline
        formattedValue = `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, ' ').replace(/\r/g, '')}"`;
      } else if (typeof value === 'number') {
        formattedValue = value;
      } else {
        formattedValue = JSON.stringify(value);
      }
      
      const comma = i < allKeys.length - 1 ? ',' : '';
      content += `    ${key}: ${formattedValue}${comma}\n`;
    });
    
    const comma = index < instruments.length - 1 ? ',' : '';
    content += `  }${comma}\n`;
  });
  
  content += '];\n';
  return content;
}

// Main function
function main() {
  console.log('\n🔄 Aggiornamento instruments.js con dati Bunny.net\n');

  // Carica i dati
  const bunnyMappings = loadBunnyMappings();
  const instrumentsContent = loadInstrumentsFile();
  const instruments = parseInstruments(instrumentsContent);

  console.log(`📚 Trovati ${instruments.length} strumenti in instruments.js`);
  console.log(`📦 Trovati ${Object.keys(bunnyMappings).length} mappings Bunny.net\n`);

  // Crea backup
  fs.writeFileSync(BACKUP_FILE, instrumentsContent);
  console.log(`💾 Backup creato: ${path.basename(BACKUP_FILE)}\n`);

  // Aggiorna gli strumenti
  let updated = 0;
  const updatedInstruments = instruments.map(inst => {
    const bunnyData = bunnyMappings[inst.id];
    if (bunnyData) {
      updated++;
      console.log(`✅ Aggiornato ID ${inst.id}: ${inst.name}`);
      return updateInstrumentWithBunny(inst, bunnyData);
    }
    return inst;
  });

  // Genera il nuovo contenuto
  const newContent = generateUpdatedContent(updatedInstruments);

  // Salva il file aggiornato
  fs.writeFileSync(INSTRUMENTS_FILE, newContent);

  console.log(`\n\n📊 Riepilogo:`);
  console.log(`✅ Strumenti aggiornati: ${updated}`);
  console.log(`📁 File salvato: ${INSTRUMENTS_FILE}`);
  console.log(`💾 Backup: ${BACKUP_FILE}\n`);

  console.log('📝 Prossimi passi:');
  console.log('1. Aggiorna i componenti video player per supportare Bunny.net');
  console.log('2. Testa i video sul sito per verificare che funzionino correttamente');
}

// Run
main();
