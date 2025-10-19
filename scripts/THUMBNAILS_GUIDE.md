# Guida: Generazione Thumbnails Video

Questo documento spiega come generare automaticamente le anteprime (thumbnails) dai video degli strumenti.

## 📋 Prerequisiti

### 1. Installa ffmpeg

**macOS:**
```bash
brew install ffmpeg
```

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install ffmpeg
```

**Windows:**
```bash
scoop install ffmpeg
```

Verifica l'installazione:
```bash
ffmpeg -version
```

## 🎬 Generazione Thumbnails

### Esegui lo script

```bash
node scripts/generate-thumbnails.js
```

### Cosa fa lo script

1. **Legge i video** da `public/bck/`
2. **Estrae un frame** al secondo 3 di ogni video
3. **Salva le thumbnails** in `public/images/thumbnails/`
4. **Ottimizza le immagini** a larghezza 800px mantenendo l'aspect ratio
5. **Salta i file già processati** per velocizzare riesecuzioni

### Output

```
🖼️  Generazione thumbnails dai video

==================================================
📁 Creata directory: /path/to/public/images/thumbnails

📋 Trovati 62 video da processare

🎬 Generazione thumbnail: 01 Cembalo G.N. BOCCALARI, Napoli, 1679.mp4
   ID: 1
✅ Creata: 01 Cembalo G.N. BOCCALARI, Napoli, 1679.jpg
   Dimensione: 45.23 KB

...

==================================================
✅ Completato!

   ✨ Nuove thumbnail: 62
   ⏭️  Già esistenti: 0
   ❌ Errori: 0

📁 Directory thumbnails: /path/to/public/images/thumbnails
```

## 🎨 Personalizzazione

Puoi modificare le opzioni di estrazione nel file `scripts/generate-thumbnails.js`:

```javascript
const THUMBNAIL_OPTIONS = {
  timePosition: '00:00:03', // Cambia il secondo da cui estrarre
  width: 800,               // Cambia la larghezza
  quality: 2,               // Cambia la qualità (1-31, più basso = migliore)
};
```

### Esempi di posizioni temporali

- `'00:00:01'` - Primo secondo
- `'00:00:05'` - Quinto secondo
- `'00:00:10'` - Decimo secondo
- `'00:01:00'` - Un minuto

## 🖼️ Utilizzo nel Sito

Le thumbnails vengono automaticamente utilizzate dal componente `InstrumentCard`:

```javascript
// Il componente cerca automaticamente la thumbnail corrispondente
const thumbnailPath = `/images/thumbnails/${instrument.audioFile.replace(/\.(mp4|mpg|mp3)$/i, '.jpg')}`;
```

### Vantaggi

1. **Performance migliorata** - Non serve caricare i video per mostrare le anteprime
2. **SEO** - Le immagini vengono indicizzate meglio dai motori di ricerca
3. **User Experience** - Caricamento più veloce della griglia strumenti
4. **Ottimizzazione Next.js** - Usa `next/image` con lazy loading e blur placeholder

## 🔄 Rigenerazione

Per rigenerare le thumbnails:

1. **Elimina le thumbnails esistenti:**
   ```bash
   rm -rf public/images/thumbnails/*.jpg
   ```

2. **Rigenera:**
   ```bash
   node scripts/generate-thumbnails.js
   ```

## 📊 Dimensioni

- **Video originali:** ~12GB totali
- **Thumbnails:** ~50KB ciascuna
- **Totale thumbnails:** ~3MB per 62 immagini

## ⚠️ Troubleshooting

### ffmpeg non trovato

```
❌ ffmpeg non trovato!
```

**Soluzione:** Installa ffmpeg seguendo i prerequisiti sopra.

### File non trovato

```
⚠️  File non trovato: 08 Cembalo...
```

**Soluzione:** Verifica che i file video siano in `public/bck/` e che i nomi in `instruments.js` corrispondano.

### Thumbnails nere

Se le thumbnails sono nere, prova a cambiare `timePosition`:

```javascript
timePosition: '00:00:05', // Prova più avanti nel video
```

## 🎯 Next Steps

Dopo aver generato le thumbnails:

1. ✅ Verifica che le immagini siano in `public/images/thumbnails/`
2. ✅ Riavvia il server Next.js: `npm run dev`
3. ✅ Controlla che le anteprime si vedano nella homepage
4. ✅ (Opzionale) Commit delle thumbnails su Git se vuoi includerle nel repository

## 📝 Note

- Le thumbnails sono file `.jpg` con lo stesso nome del video
- Per file `.mp3` (audio) non viene generata thumbnail
- Il componente mostra un placeholder musicale per i file audio
- Le thumbnails usano `object-fit: cover` per riempire l'area
