/**
 * Script per caricare automaticamente i video su Bunny.net
 * 
 * SETUP:
 * 1. Crea un account su https://bunny.net
 * 2. Crea una Storage Zone da https://dash.bunny.net/storage
 * 3. Crea una Pull Zone (CDN) da https://dash.bunny.net/zones
 * 4. Opzionale: Crea una Video Library da https://dash.bunny.net/stream
 * 5. Configura le credenziali nel file .env:
 *    
 *    # Per Storage API (file hosting)
 *    BUNNY_STORAGE_ZONE_NAME=your-storage-zone-name
 *    BUNNY_STORAGE_API_KEY=your-storage-api-key
 *    BUNNY_STORAGE_REGION=de (or: uk, ny, la, sg, syd - default is de)
 *    BUNNY_PULL_ZONE_URL=https://your-pullzone.b-cdn.net
 *    
 *    # Oppure per Stream API (video streaming ottimizzato con player integrato)
 *    BUNNY_STREAM_LIBRARY_ID=your-library-id
 *    BUNNY_STREAM_API_KEY=your-stream-api-key
 * 
 * 6. Installa le dipendenze: npm install axios form-data
 * 7. Esegui: node scripts/upload-to-bunny.js
 * 
 * METODI DI UPLOAD:
 * - 'storage': Carica file su Storage Zone (hosting file standard)
 * - 'stream': Carica su Stream Library (video streaming ottimizzato)
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

// Configurazione
const VIDEO_DIR = path.join(__dirname, '../public/bck');
const INSTRUMENTS_FILE = path.join(__dirname, '../app/data/instruments.js');
const OUTPUT_FILE = path.join(__dirname, '../bunny-mappings.json');

// Scegli il metodo: 'storage' o 'stream'
const UPLOAD_METHOD = process.env.BUNNY_UPLOAD_METHOD || 'storage';

// Configurazione Storage
const STORAGE_ZONE_NAME = process.env.BUNNY_STORAGE_ZONE_NAME;
const STORAGE_API_KEY = process.env.BUNNY_STORAGE_API_KEY;
const STORAGE_REGION = process.env.BUNNY_STORAGE_REGION || 'de';
const PULL_ZONE_URL = process.env.BUNNY_PULL_ZONE_URL;

// Configurazione Stream
const STREAM_LIBRARY_ID = process.env.BUNNY_STREAM_LIBRARY_ID;
const STREAM_API_KEY = process.env.BUNNY_STREAM_API_KEY;

// Mapping delle regioni Storage
const STORAGE_ENDPOINTS = {
  'de': 'storage.bunnycdn.com',      // Falkenstein (default)
  'uk': 'uk.storage.bunnycdn.com',   // London
  'ny': 'ny.storage.bunnycdn.com',   // New York
  'la': 'la.storage.bunnycdn.com',   // Los Angeles
  'sg': 'sg.storage.bunnycdn.com',   // Singapore
  'syd': 'syd.storage.bunnycdn.com'  // Sydney
};

// Verifica configurazione
function validateConfig() {
  if (UPLOAD_METHOD === 'storage') {
    if (!STORAGE_ZONE_NAME || !STORAGE_API_KEY) {
      console.error('❌ Errore: Configura BUNNY_STORAGE_ZONE_NAME e BUNNY_STORAGE_API_KEY nel file .env');
      process.exit(1);
    }
    if (!PULL_ZONE_URL) {
      console.warn('⚠️  BUNNY_PULL_ZONE_URL non configurato. I video saranno accessibili ma senza CDN ottimizzato.');
    }
  } else if (UPLOAD_METHOD === 'stream') {
    if (!STREAM_LIBRARY_ID || !STREAM_API_KEY) {
      console.error('❌ Errore: Configura BUNNY_STREAM_LIBRARY_ID e BUNNY_STREAM_API_KEY nel file .env');
      process.exit(1);
    }
  } else {
    console.error('❌ Errore: BUNNY_UPLOAD_METHOD deve essere "storage" o "stream"');
    process.exit(1);
  }
}

validateConfig();

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
      .filter(inst => inst.audioFile)
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

// Carica i mappings esistenti
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

// Salva i mappings
function saveMappings(mappings) {
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(mappings, null, 2));
  console.log(`\n✅ Mappings salvati in ${OUTPUT_FILE}`);
}

// Crea un nome file pulito
function sanitizeFilename(filename) {
  return filename
    .replace(/^\d+\s/, '') // Rimuovi numero iniziale
    .replace(/[^\w\s.-]/g, '') // Rimuovi caratteri speciali
    .replace(/\s+/g, '-') // Sostituisci spazi con trattini
    .toLowerCase();
}

// Upload su Storage Zone
async function uploadToStorage(instrument) {
  const filePath = path.join(VIDEO_DIR, instrument.file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File non trovato: ${instrument.file}`);
    return null;
  }

  const fileStats = fs.statSync(filePath);
  const fileSizeMB = (fileStats.size / (1024 * 1024)).toFixed(2);
  
  const sanitizedFilename = sanitizeFilename(instrument.file);
  const remotePath = `/videos/${sanitizedFilename}`;
  const endpoint = STORAGE_ENDPOINTS[STORAGE_REGION];
  const url = `https://${endpoint}/${STORAGE_ZONE_NAME}${remotePath}`;

  console.log(`\n📤 Uploading ${instrument.file} (${fileSizeMB} MB) to Storage...`);

  try {
    const fileStream = fs.createReadStream(filePath);
    
    const response = await axios.put(url, fileStream, {
      headers: {
        'AccessKey': STORAGE_API_KEY,
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

    // Costruisci gli URL
    const cdnUrl = PULL_ZONE_URL 
      ? `${PULL_ZONE_URL}${remotePath}`
      : `https://${STORAGE_ZONE_NAME}.b-cdn.net${remotePath}`;

    return {
      id: instrument.id,
      originalFile: instrument.file,
      bunnyUrl: cdnUrl,
      storagePath: remotePath,
      method: 'storage',
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

// Upload su Stream Library
async function uploadToStream(instrument) {
  const filePath = path.join(VIDEO_DIR, instrument.file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File non trovato: ${instrument.file}`);
    return null;
  }

  const fileStats = fs.statSync(filePath);
  const fileSizeMB = (fileStats.size / (1024 * 1024)).toFixed(2);

  console.log(`\n📤 Uploading ${instrument.file} (${fileSizeMB} MB) to Stream...`);

  try {
    // Step 1: Crea un video nella library
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

    console.log(`\n✅ Upload completato! Il video verrà processato da Bunny.net...`);

    // Costruisci gli URL
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

// Main upload function
async function uploadVideo(instrument, existingMappings) {
  // Controlla se già caricato
  if (existingMappings[instrument.id]) {
    console.log(`\n⏭️  ID ${instrument.id} già caricato, skip...`);
    return existingMappings[instrument.id];
  }

  if (UPLOAD_METHOD === 'storage') {
    return await uploadToStorage(instrument);
  } else {
    return await uploadToStream(instrument);
  }
}

// Main function
async function main() {
  console.log('\n🎬 Bunny.net Video Upload Script');
  console.log(`📦 Metodo: ${UPLOAD_METHOD.toUpperCase()}\n`);

  const instruments = loadInstrumentsWithAudio();
  console.log(`📚 Trovati ${instruments.length} strumenti con file audio/video\n`);

  const existingMappings = loadExistingMappings();
  const mappings = { ...existingMappings };

  let uploaded = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < instruments.length; i++) {
    const instrument = instruments[i];
    console.log(`\n[${i + 1}/${instruments.length}] Processing ID ${instrument.id}: ${instrument.name}`);

    const result = await uploadVideo(instrument, existingMappings);
    
    if (result) {
      if (result === existingMappings[instrument.id]) {
        skipped++;
      } else {
        mappings[instrument.id] = result;
        uploaded++;
      }
    } else {
      failed++;
    }

    // Salva periodicamente i mappings
    if ((i + 1) % 5 === 0 || i === instruments.length - 1) {
      saveMappings(mappings);
    }
  }

  console.log('\n\n📊 Riepilogo:');
  console.log(`✅ Caricati: ${uploaded}`);
  console.log(`⏭️  Saltati (già presenti): ${skipped}`);
  console.log(`❌ Falliti: ${failed}`);
  console.log(`📁 Total: ${instruments.length}`);
  
  console.log('\n\n📝 Prossimi passi:');
  console.log('1. Esegui: node scripts/update-instruments-with-bunny.js');
  console.log('   Per aggiornare instruments.js con i nuovi URL Bunny.net');
  console.log('2. Aggiorna i componenti video player per usare Bunny.net');
}

// Run
main().catch(error => {
  console.error('\n❌ Errore fatale:', error);
  process.exit(1);
});
