# Guida Setup Bunny.net

Questa guida ti aiuterà a configurare Bunny.net per l'hosting e lo streaming dei tuoi video.

## Indice
1. [Cosa è Bunny.net](#cosa-è-bunnynet)
2. [Setup Account](#setup-account)
3. [Metodo 1: Storage + Pull Zone (File Hosting)](#metodo-1-storage--pull-zone)
4. [Metodo 2: Stream (Video Streaming)](#metodo-2-stream)
5. [Configurazione Script](#configurazione-script)
6. [Upload dei Video](#upload-dei-video)
7. [Aggiornamento del Sito](#aggiornamento-del-sito)

## Cosa è Bunny.net

Bunny.net è un CDN (Content Delivery Network) e una piattaforma di video streaming con:
- **Costi molto competitivi**: €0.01/GB per storage, €0.01-0.03/GB per bandwidth
- **Performance eccellenti**: 84 edge locations in tutto il mondo
- **Video Streaming ottimizzato**: transcoding automatico, adaptive bitrate
- **Facilità d'uso**: API semplici e dashboard intuitiva

### Confronto con Internet Archive
| Feature | Bunny.net | Internet Archive |
|---------|-----------|------------------|
| Costo | €0.01-0.03/GB | Gratuito |
| Performance | Eccellente (CDN globale) | Media |
| Affidabilità | 99.9% SLA | Buona ma variabile |
| Video Player | Moderno con adaptive streaming | Basic embed |
| Upload Speed | Veloce | Lento |
| Customizzazione | Alta | Limitata |

## Setup Account

1. **Registrati su Bunny.net**
   - Vai su https://bunny.net
   - Crea un account (carta di credito richiesta ma €5 di credito gratuito)

2. **Dashboard**
   - Login su https://dash.bunny.net

## Metodo 1: Storage + Pull Zone

Questo metodo è ideale per **hosting file semplice** con CDN.

### Step 1: Crea Storage Zone

1. Dashboard > Storage > "Add Storage Zone"
2. Configura:
   - **Name**: `villa-medici-videos` (o qualsiasi nome)
   - **Region**: Scegli vicino al tuo pubblico
     - 🇩🇪 `de` - Germania (Falkenstein) - default, buono per Europa
     - 🇬🇧 `uk` - Regno Unito (London)
     - 🇺🇸 `ny` - USA East (New York)
     - 🇺🇸 `la` - USA West (Los Angeles)
     - 🇸🇬 `sg` - Singapore (Asia)
     - 🇦🇺 `syd` - Australia (Sydney)
   - **Replication**: Lascia disabilitato (costa extra)
3. Clicca "Add Storage Zone"

### Step 2: Ottieni API Key

1. Nella Storage Zone appena creata, clicca su "Manage"
2. Sezione "FTP & API Access"
3. Copia il **Password/API Key** (inizia con qualcosa tipo `a1b2c3d4-...`)

### Step 3: Crea Pull Zone (CDN)

1. Dashboard > CDN > "Add Pull Zone"
2. Configura:
   - **Name**: `villa-medici-cdn` (o qualsiasi nome)
   - **Origin Type**: Seleziona "Bunny Storage Zone"
   - **Storage Zone**: Seleziona la tua storage zone
3. Clicca "Add Pull Zone"
4. Annota l'URL, sarà tipo: `https://villa-medici-cdn.b-cdn.net`

### Step 4: Configura .env

Crea/modifica il file `.env` nella root del progetto:

```bash
# Bunny.net Storage Configuration
BUNNY_UPLOAD_METHOD=storage
BUNNY_STORAGE_ZONE_NAME=villa-medici-videos
BUNNY_STORAGE_API_KEY=a1b2c3d4-xxxx-xxxx-xxxx-xxxxxxxxxxxx
BUNNY_STORAGE_REGION=de
BUNNY_PULL_ZONE_URL=https://villa-medici-cdn.b-cdn.net
```

## Metodo 2: Stream

Questo metodo è ideale per **video streaming professionale** con transcoding automatico.

### Step 1: Crea Stream Library

1. Dashboard > Stream > "Add Library"
2. Configura:
   - **Name**: `Villa Medici Videos`
   - **Replication Regions**: Scegli le regioni per il tuo pubblico
3. Clicca "Add Library"
4. Annota il **Library ID** (numero tipo `12345`)

### Step 2: Ottieni API Key

1. Nella library appena creata, vai su "API"
2. Copia l'**API Key**

### Step 3: Configura .env

```bash
# Bunny.net Stream Configuration
BUNNY_UPLOAD_METHOD=stream
BUNNY_STREAM_LIBRARY_ID=12345
BUNNY_STREAM_API_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

## Configurazione Script

### Installa Dipendenze

```bash
npm install axios form-data
```

### File .env Completo

Esempio con entrambi i metodi (usa quello che preferisci):

```bash
# Metodo Storage (file hosting semplice)
BUNNY_UPLOAD_METHOD=storage
BUNNY_STORAGE_ZONE_NAME=villa-medici-videos
BUNNY_STORAGE_API_KEY=your-storage-api-key-here
BUNNY_STORAGE_REGION=de
BUNNY_PULL_ZONE_URL=https://villa-medici-cdn.b-cdn.net

# Metodo Stream (video streaming ottimizzato)
# BUNNY_UPLOAD_METHOD=stream
# BUNNY_STREAM_LIBRARY_ID=12345
# BUNNY_STREAM_API_KEY=your-stream-api-key-here
```

## Upload dei Video

### Upload Singolo Video (Test)

```bash
# Modifica lo script per uploadare solo un video specifico
node scripts/upload-to-bunny.js
```

### Upload Tutti i Video

```bash
node scripts/upload-to-bunny.js
```

Lo script:
- ✅ Carica automaticamente tutti i video da `public/bck/`
- ✅ Mostra progress in tempo reale
- ✅ Salta video già caricati
- ✅ Salva i mappings in `bunny-mappings.json`
- ✅ Crea backup automatici

### Monitoraggio Upload

Durante l'upload vedrai:
```
📤 Uploading 01 Cembalo G.N. BOCCALARI, Napoli, 1679.mp4 (45.23 MB) to Storage...
Progress: 65%
✅ Upload completato!
```

## Aggiornamento del Sito

### Step 1: Aggiorna instruments.js

```bash
node scripts/update-instruments-with-bunny.js
```

Questo script:
- ✅ Legge i mappings da `bunny-mappings.json`
- ✅ Aggiorna `app/data/instruments.js` con i nuovi URL
- ✅ Crea un backup automatico

### Step 2: Aggiorna i Video Player

Nel file della pagina strumento, usa il nuovo `UniversalPlayer`:

```javascript
import UniversalPlayer from '@/app/_components/UniversalPlayer';

// Nel componente
<UniversalPlayer instrument={instrument} />
```

Il `UniversalPlayer`:
- ✅ Usa automaticamente Bunny.net se disponibile
- ✅ Fallback su Internet Archive se Bunny.net non è disponibile
- ✅ Supporta entrambi i metodi (Storage e Stream)

### Step 3: Test

```bash
npm run dev
```

Visita http://localhost:3000 e testa:
1. ✅ I video si caricano correttamente
2. ✅ Il player funziona bene
3. ✅ La qualità video è buona
4. ✅ Il loading è veloce

## Confronto Metodi

### Storage + Pull Zone
**Pro:**
- ✅ Più semplice da configurare
- ✅ Più economico (solo storage + bandwidth)
- ✅ Controllo totale sul player HTML5
- ✅ Buono per video già ottimizzati

**Contro:**
- ❌ Nessun transcoding automatico
- ❌ Player HTML5 standard (meno feature)
- ❌ Devi ottimizzare i video manualmente

### Stream
**Pro:**
- ✅ Transcoding automatico (multiple resolutions)
- ✅ Adaptive bitrate streaming
- ✅ Player moderno con molte feature
- ✅ Analytics integrate
- ✅ Thumbnails automatici

**Contro:**
- ❌ Più costoso (encoding + storage + bandwidth)
- ❌ Processing time dopo l'upload
- ❌ Meno controllo sul player

## Costi Stimati

### Scenario Realistico: 90 video, 40MB media, poche visite al giorno

**Con 5-10 visite/giorno (150-300 visite/mese, ~450 video views):**

**Storage Method:**
- Storage: 3.6GB × €0.01 = €0.036/mese
- Bandwidth: 18GB × €0.01 = €0.18/mese
- **Totale: ~€0.22/mese** 🎉

**Stream Method:**
- Storage: 3.6GB × €0.005 = €0.018/mese
- Encoding: 3.6GB × €0.02 = €0.072 (one-time)
- Bandwidth: 18GB × €0.01 = €0.18/mese
- **Totale: ~€0.20/mese + €0.072 setup** 🎉

💰 **Con il credito gratuito di €5:**
- €5 ÷ €0.22/mese = **~23 mesi di hosting gratuito!**
- Il credito copre ~500GB di bandwidth
- Praticamente **GRATIS per quasi 2 anni**

### Esempio High-Traffic: 1000 views/mese
*(solo per riferimento, non il tuo caso)*
- Storage: €0.036/mese
- Bandwidth: 40GB × 1000 views × €0.01 = €40/mese
- **Totale: ~€40/mese**

💡 **Conclusione per il tuo sito:** Con poche visite al giorno, Bunny.net è essenzialmente **GRATUITO**!

## Troubleshooting

### Upload Fallisce
```
❌ Error: 401 Unauthorized
```
- Verifica che l'API key sia corretta
- Verifica che il nome della Storage Zone sia corretto

### Video Non Si Carica
```
Video non disponibile su Bunny.net
```
- Verifica che il mapping sia stato creato
- Verifica che `bunny-mappings.json` contenga l'ID dello strumento
- Ri-esegui `update-instruments-with-bunny.js`

### Player Non Funziona
- Verifica che il componente `UniversalPlayer` sia importato correttamente
- Controlla la console del browser per errori
- Verifica che l'URL del video sia accessibile

## Best Practices

1. **Testa prima con pochi video**
   ```bash
   # Modifica lo script per limitare l'upload
   node scripts/upload-to-bunny.js
   ```

2. **Ottimizza i video prima dell'upload** (se usi Storage)
   - Risoluzione: 1080p max
   - Codec: H.264
   - Bitrate: 2-5 Mbps

3. **Monitora i costi**
   - Dashboard > Billing
   - Imposta notifiche di billing

4. **Usa entrambi durante la transizione**
   - Il `UniversalPlayer` gestisce automaticamente il fallback
   - Puoi migrare gradualmente da Archive a Bunny

## Support

- 📚 Docs: https://docs.bunny.net
- 💬 Discord: https://bunny.net/discord
- 📧 Support: support@bunny.net

## Next Steps

Dopo aver completato il setup:

1. ✅ Testa i video su staging
2. ✅ Monitora performance e costi per una settimana
3. ✅ Decidi se continuare con Bunny.net o tornare ad Archive
4. ✅ Se tutto ok, considera di cancellare i video da Archive
