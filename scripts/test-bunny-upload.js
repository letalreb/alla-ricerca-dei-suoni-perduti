/**
 * Script di test per caricare un singolo video su Bunny.net
 * Utile per testare la configurazione prima di caricare tutti i video
 * 
 * Usage: node scripts/test-bunny-upload.js [instrument-id]
 * Example: node scripts/test-bunny-upload.js 1
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Configurazione
const VIDEO_DIR = path.join(__dirname, '../public/bck');
const INSTRUMENTS_FILE = path.join(__dirname, '../app/data/instruments.js');

// Leggi l'ID dello strumento da testare
const testInstrumentId = process.argv[2] ? parseInt(process.argv[2]) : 1;

const UPLOAD_METHOD = process.env.BUNNY_UPLOAD_METHOD || 'storage';
const STORAGE_ZONE_NAME = process.env.BUNNY_STORAGE_ZONE_NAME;
const STORAGE_API_KEY = process.env.BUNNY_STORAGE_API_KEY;
const STORAGE_REGION = process.env.BUNNY_STORAGE_REGION || 'de';
const PULL_ZONE_URL = process.env.BUNNY_PULL_ZONE_URL;
const STREAM_LIBRARY_ID = process.env.BUNNY_STREAM_LIBRARY_ID;
const STREAM_API_KEY = process.env.BUNNY_STREAM_API_KEY;

const STORAGE_ENDPOINTS = {
  'de': 'storage.bunnycdn.com',
  'uk': 'uk.storage.bunnycdn.com',
  'ny': 'ny.storage.bunnycdn.com',
  'la': 'la.storage.bunnycdn.com',
  'sg': 'sg.storage.bunnycdn.com',
  'syd': 'syd.storage.bunnycdn.com'
};

// Verifica configurazione
function validateConfig() {
  console.log('\n🔍 Verifica configurazione...\n');
  
  console.log(`Metodo: ${UPLOAD_METHOD}`);
  
  if (UPLOAD_METHOD === 'storage') {
    console.log(`Storage Zone: ${STORAGE_ZONE_NAME || '❌ NON CONFIGURATO'}`);
    console.log(`API Key: ${STORAGE_API_KEY ? '✅ Configurato' : '❌ NON CONFIGURATO'}`);
    console.log(`Regione: ${STORAGE_REGION}`);
    console.log(`Pull Zone URL: ${PULL_ZONE_URL || '⚠️  Non configurato (opzionale)'}`);
    
    if (!STORAGE_ZONE_NAME || !STORAGE_API_KEY) {
      console.error('\n❌ Configurazione incompleta per Storage method');
      console.log('Configura nel .env:');
      console.log('  BUNNY_STORAGE_ZONE_NAME=your-zone');
      console.log('  BUNNY_STORAGE_API_KEY=your-key');
      process.exit(1);
    }
  } else if (UPLOAD_METHOD === 'stream') {
    console.log(`Library ID: ${STREAM_LIBRARY_ID || '❌ NON CONFIGURATO'}`);
    console.log(`API Key: ${STREAM_API_KEY ? '✅ Configurato' : '❌ NON CONFIGURATO'}`);
    
    if (!STREAM_LIBRARY_ID || !STREAM_API_KEY) {
      console.error('\n❌ Configurazione incompleta per Stream method');
      console.log('Configura nel .env:');
      console.log('  BUNNY_STREAM_LIBRARY_ID=12345');
      console.log('  BUNNY_STREAM_API_KEY=your-key');
      process.exit(1);
    }
  }
  
  console.log('\n✅ Configurazione valida!\n');
}

// Carica lo strumento di test
function loadTestInstrument() {
  try {
    const instrumentsContent = fs.readFileSync(INSTRUMENTS_FILE, 'utf8');
    const arrayMatch = instrumentsContent.match(/export const instruments = \[([\s\S]*?)\];/);
    if (!arrayMatch) {
      throw new Error('Impossibile trovare l\'array instruments nel file');
    }
    const instruments = eval(`[${arrayMatch[1]}]`);
    const instrument = instruments.find(i => i.id === testInstrumentId);
    
    if (!instrument) {
      console.error(`❌ Strumento con ID ${testInstrumentId} non trovato`);
      process.exit(1);
    }
    
    if (!instrument.audioFile) {
      console.error(`❌ Strumento ${testInstrumentId} non ha un file audio/video`);
      process.exit(1);
    }
    
    return {
      id: instrument.id,
      name: instrument.name,
      file: instrument.audioFile
    };
  } catch (error) {
    console.error('❌ Errore nel caricamento di instruments.js:', error.message);
    process.exit(1);
  }
}

// Test upload Storage
async function testStorageUpload(instrument) {
  const filePath = path.join(VIDEO_DIR, instrument.file);
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File non trovato: ${filePath}`);
    process.exit(1);
  }

  const fileStats = fs.statSync(filePath);
  const fileSizeMB = (fileStats.size / (1024 * 1024)).toFixed(2);
  
  console.log(`📁 File: ${instrument.file}`);
  console.log(`📏 Dimensione: ${fileSizeMB} MB`);
  console.log(`🎵 Strumento: ${instrument.name}\n`);
  
  const sanitizedFilename = instrument.file
    .replace(/^\d+\s/, '')
    .replace(/[^\w\s.-]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase();
  
  const remotePath = `/videos/${sanitizedFilename}`;
  const endpoint = STORAGE_ENDPOINTS[STORAGE_REGION];
  const url = `https://${endpoint}/${STORAGE_ZONE_NAME}${remotePath}`;

  console.log(`📤 Uploading to: ${url}\n`);

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
        process.stdout.write(`\r⏳ Progress: ${percentCompleted}%`);
      }
    });

    const cdnUrl = PULL_ZONE_URL 
      ? `${PULL_ZONE_URL}${remotePath}`
      : `https://${STORAGE_ZONE_NAME}.b-cdn.net${remotePath}`;

    console.log(`\n\n✅ Upload completato con successo!`);
    console.log(`\n📺 URL video:`);
    console.log(`   ${cdnUrl}`);
    console.log(`\n💡 Testa l'URL nel browser o aggiungi al player:`);
    console.log(`   <video src="${cdnUrl}" controls />`);
    
    return true;
  } catch (error) {
    console.error(`\n\n❌ Upload fallito: ${error.message}`);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Data:`, error.response.data);
    }
    return false;
  }
}

// Test upload Stream
async function testStreamUpload(instrument) {
  const filePath = path.join(VIDEO_DIR, instrument.file);
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File non trovato: ${filePath}`);
    process.exit(1);
  }

  const fileStats = fs.statSync(filePath);
  const fileSizeMB = (fileStats.size / (1024 * 1024)).toFixed(2);
  
  console.log(`📁 File: ${instrument.file}`);
  console.log(`📏 Dimensione: ${fileSizeMB} MB`);
  console.log(`🎵 Strumento: ${instrument.name}\n`);

  try {
    // Step 1: Crea video nella library
    console.log(`📝 Creazione video nella library...`);
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
    console.log(`✅ Video creato con GUID: ${videoGuid}\n`);

    // Step 2: Upload del file
    console.log(`📤 Uploading video...`);
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
        process.stdout.write(`\r⏳ Progress: ${percentCompleted}%`);
      }
    });

    const embedUrl = `https://iframe.mediadelivery.net/embed/${STREAM_LIBRARY_ID}/${videoGuid}`;
    const directUrl = `https://iframe.mediadelivery.net/play/${STREAM_LIBRARY_ID}/${videoGuid}`;

    console.log(`\n\n✅ Upload completato con successo!`);
    console.log(`\n📺 URLs:`);
    console.log(`   Embed: ${embedUrl}`);
    console.log(`   Direct: ${directUrl}`);
    console.log(`\n⏳ Il video sarà disponibile dopo il processing (pochi minuti)`);
    console.log(`\n💡 Testa l'embed nel browser o aggiungi al player:`);
    console.log(`   <iframe src="${embedUrl}" />`);
    
    return true;
  } catch (error) {
    console.error(`\n\n❌ Upload fallito: ${error.message}`);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Data:`, error.response.data);
    }
    return false;
  }
}

// Main
async function main() {
  console.log('\n🧪 Bunny.net Upload Test\n');
  console.log('═══════════════════════════════════════\n');
  
  validateConfig();
  
  const instrument = loadTestInstrument();
  
  console.log(`🎯 Test instrument ID: ${instrument.id}`);
  console.log(`📝 Nome: ${instrument.name}\n`);
  console.log('═══════════════════════════════════════\n');
  
  let success = false;
  
  if (UPLOAD_METHOD === 'storage') {
    success = await testStorageUpload(instrument);
  } else {
    success = await testStreamUpload(instrument);
  }
  
  console.log('\n═══════════════════════════════════════');
  
  if (success) {
    console.log('\n✅ Test completato con successo!');
    console.log('\n📝 Prossimi passi:');
    console.log('   1. Testa l\'URL del video nel browser');
    console.log('   2. Se funziona, esegui: node scripts/upload-to-bunny.js');
    console.log('   3. Per uploadare tutti i video');
  } else {
    console.log('\n❌ Test fallito');
    console.log('\n📝 Verifica:');
    console.log('   1. Le credenziali nel file .env');
    console.log('   2. Il nome della Storage Zone / Library ID');
    console.log('   3. La connessione internet');
  }
  
  console.log('\n');
}

main().catch(error => {
  console.error('\n❌ Errore fatale:', error);
  process.exit(1);
});
