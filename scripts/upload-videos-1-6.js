/**
 * Script per caricare video 1-6 su Bunny.net Stream
 * Versione modificata per caricare solo i primi 6 video
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Configurazione
const VIDEO_DIR = path.join(__dirname, '../public/bck');
const INSTRUMENTS_FILE = path.join(__dirname, '../app/data/instruments.js');
const OUTPUT_FILE = path.join(__dirname, '../bunny-mappings.json');

const STREAM_LIBRARY_ID = process.env.BUNNY_STREAM_LIBRARY_ID;
const STREAM_API_KEY = process.env.BUNNY_STREAM_API_KEY;

// IDs da caricare
const IDS_TO_UPLOAD = [1, 2, 3, 4, 5, 6];

// Verifica configurazione
if (!STREAM_LIBRARY_ID || !STREAM_API_KEY) {
  console.error('❌ Errore: Configura BUNNY_STREAM_LIBRARY_ID e BUNNY_STREAM_API_KEY nel file .env');
  process.exit(1);
}

// Leggi instruments.js
function loadInstruments() {
  try {
    const instrumentsContent = fs.readFileSync(INSTRUMENTS_FILE, 'utf8');
    const arrayMatch = instrumentsContent.match(/export const instruments = \[([\s\S]*?)\];/);
    if (!arrayMatch) {
      throw new Error('Impossibile trovare l\'array instruments nel file');
    }
    const instruments = eval(`[${arrayMatch[1]}]`);
    return instruments
      .filter(inst => IDS_TO_UPLOAD.includes(inst.id) && inst.audioFile)
      .map(inst => ({
        id: inst.id,
        name: inst.name,
        file: inst.audioFile
      }));
  } catch (error) {
    console.error('❌ Errore nel caricamento di instruments.js:', error.message);
    process.exit(1);
  }
}

// Carica mappings esistenti
function loadExistingMappings() {
  if (fs.existsSync(OUTPUT_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
    } catch (error) {
      console.warn('⚠️  Impossibile leggere bunny-mappings.json, verrà creato un nuovo file');
    }
  }
  return {};
}

// Salva mappings
function saveMappings(mappings) {
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(mappings, null, 2));
  console.log(`✅ Mappings salvati in ${OUTPUT_FILE}`);
}

// Upload su Stream
async function uploadToStream(instrument) {
  const filePath = path.join(VIDEO_DIR, instrument.file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File non trovato: ${instrument.file}`);
    return null;
  }

  const fileStats = fs.statSync(filePath);
  const fileSizeMB = (fileStats.size / (1024 * 1024)).toFixed(2);

  console.log(`\n📤 Uploading ${instrument.file} (${fileSizeMB} MB)...`);

  try {
    // Step 1: Crea video nella library
    const createResponse = await axios.post(
      `https://video.bunnycdn.com/library/${STREAM_LIBRARY_ID}/videos`,
      {
        title: `${instrument.id} ${instrument.name || instrument.file}`
      },
      {
        headers: {
          'AccessKey': STREAM_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    const videoGuid = createResponse.data.guid;
    console.log(`✅ Video creato con GUID: ${videoGuid}`);

    // Step 2: Upload del file
    const fileStream = fs.createReadStream(filePath);
    const uploadUrl = `https://video.bunnycdn.com/library/${STREAM_LIBRARY_ID}/videos/${videoGuid}`;
    
    await axios.put(uploadUrl, fileStream, {
      headers: {
        'AccessKey': STREAM_API_KEY,
        'Content-Type': 'application/octet-stream'
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        process.stdout.write(`\rProgress: ${percentCompleted}%`);
      }
    });

    console.log(`\n✅ Upload completato!`);

    const embedUrl = `https://iframe.mediadelivery.net/embed/${STREAM_LIBRARY_ID}/${videoGuid}`;
    const directUrl = `https://iframe.mediadelivery.net/play/${STREAM_LIBRARY_ID}/${videoGuid}`;

    return {
      id: instrument.id,
      originalFile: instrument.file,
      videoGuid: videoGuid,
      embedUrl: embedUrl,
      directUrl: directUrl,
      method: 'stream',
      uploadedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error(`\n❌ Errore durante l'upload: ${error.message}`);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Data:`, error.response.data);
    }
    return null;
  }
}

// Main
async function main() {
  console.log('\n🎬 Bunny.net Upload - Video 1-6');
  console.log('════════════════════════════════\n');

  const instruments = loadInstruments();
  console.log(`📚 Video da caricare: ${instruments.length}\n`);

  instruments.forEach(inst => {
    console.log(`  ${inst.id}. ${inst.name}`);
  });

  const existingMappings = loadExistingMappings();
  const mappings = { ...existingMappings };

  let uploaded = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < instruments.length; i++) {
    const instrument = instruments[i];
    console.log(`\n\n[${i + 1}/${instruments.length}] Processing ID ${instrument.id}`);

    // Controlla se già caricato
    if (existingMappings[instrument.id]) {
      console.log(`⏭️  Già caricato, skip...`);
      skipped++;
      continue;
    }

    const result = await uploadToStream(instrument);
    
    if (result) {
      mappings[instrument.id] = result;
      uploaded++;
      saveMappings(mappings);
    } else {
      failed++;
    }

    // Pausa tra upload per non sovraccaricare
    if (i < instruments.length - 1) {
      console.log('\n⏳ Pausa 2 secondi...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log('\n\n📊 Riepilogo:');
  console.log('════════════════════════════════');
  console.log(`✅ Caricati: ${uploaded}`);
  console.log(`⏭️  Saltati (già presenti): ${skipped}`);
  console.log(`❌ Falliti: ${failed}`);
  console.log(`📁 Totale: ${instruments.length}`);
  
  if (uploaded > 0) {
    console.log('\n\n📝 Prossimi passi:');
    console.log('1. Attendi qualche minuto per il processing dei video');
    console.log('2. Esegui: node scripts/update-instruments-with-bunny.js');
    console.log('3. Testa il sito con: npm run dev');
  }
  
  console.log('\n');
}

main().catch(error => {
  console.error('\n❌ Errore fatale:', error);
  process.exit(1);
});
