# 🖼️ Sistema di Anteprime Video

Sistema completo per generare e visualizzare anteprime (thumbnails) dai video degli strumenti musicali.

## ✅ Setup Completato

### 1. ffmpeg installato
- ✅ Installato via Homebrew: `ffmpeg 8.0_1`
- Usato per estrarre frame dai video

### 2. Script di generazione
- 📄 `scripts/generate-thumbnails.js` - Script automatico
- 📁 Output: `public/images/thumbnails/`
- 🎨 Configurazione: Frame al secondo 3, larghezza 800px, alta qualità

### 3. Integrazione componenti
- 🔄 `InstrumentCard.js` aggiornato per usare thumbnails
- 🖼️ Usa `next/image` con ottimizzazione automatica
- ⚡ Lazy loading e blur placeholder

### 4. Thumbnails generate
- ✅ **59 thumbnails** create con successo
- 📊 Dimensione media: ~50-60KB per immagine
- 💾 Totale: ~3MB (facile da committare su Git)

## 🚀 Come Usare

### Generare le thumbnails

```bash
node scripts/generate-thumbnails.js
```

### Rigenerare tutte le thumbnails

```bash
rm -rf public/images/thumbnails/*
node scripts/generate-thumbnails.js
```

### Personalizzare l'estrazione

Modifica le opzioni in `scripts/generate-thumbnails.js`:

```javascript
const THUMBNAIL_OPTIONS = {
  timePosition: '00:00:03', // Secondo da cui estrarre
  width: 800,               // Larghezza thumbnail
  quality: 2,               // Qualità JPEG (1-31, più basso = migliore)
};
```

## 📁 Struttura File

```
public/
├── bck/                    # Video originali (12GB, ignorati da Git)
└── images/
    └── thumbnails/         # Thumbnails generate (3MB)
        ├── 01 Cembalo G.N. BOCCALARI, Napoli, 1679.jpg
        ├── 02 Cembalo Ottoboni.jpg
        └── ...

scripts/
├── generate-thumbnails.js  # Script generazione
└── THUMBNAILS_GUIDE.md     # Guida completa

app/
└── _components/
    └── InstrumentCard.js   # Usa le thumbnails
```

## 🎨 Funzionalità

### Component InstrumentCard

```jsx
// Carica automaticamente la thumbnail
<Image 
  src={`/images/thumbnails/${fileName}.jpg`}
  alt={instrument.name}
  width={800}
  height={600}
  loading="lazy"
  placeholder="blur"
/>
```

### Vantaggi

1. **Performance** 🚀
   - Non serve caricare i video per le anteprime
   - Immagini ottimizzate da Next.js (WebP/AVIF)
   - Lazy loading automatico

2. **UX** ✨
   - Caricamento istantaneo della griglia
   - Blur placeholder durante il load
   - Effetto zoom on hover

3. **SEO** 📈
   - Immagini indicizzabili
   - Alt text descrittivo
   - Dimensioni ottimizzate

## 📊 Statistiche

| Tipo | Quantità | Dimensione |
|------|----------|------------|
| Video originali | 62 | ~12GB |
| Thumbnails generate | 59 | ~3MB |
| File audio (MP3) | 3 | - |

## 🔄 Workflow Consigliato

1. **Dopo aver aggiunto nuovi video:**
   ```bash
   # Normalizza i nomi file
   node scripts/normalize-filenames.js
   
   # Sincronizza con instruments.js
   node scripts/sync-instruments-filenames.js
   
   # Genera thumbnails
   node scripts/generate-thumbnails.js
   ```

2. **Commit delle modifiche:**
   ```bash
   git add public/images/thumbnails/
   git add app/data/instruments.js
   git commit -m "feat: aggiunte thumbnails per nuovi strumenti"
   ```

## 🎯 Next Steps

### Opzionale: Escludere thumbnails da Git

Se preferisci non committare le thumbnails (ad esempio perché le generi in produzione), aggiungi al `.gitignore`:

```gitignore
# Thumbnails (generate on build)
public/images/thumbnails/*
!public/images/thumbnails/.gitkeep
```

Poi crea `.gitkeep`:
```bash
mkdir -p public/images/thumbnails
touch public/images/thumbnails/.gitkeep
```

E aggiungi al build script in `package.json`:
```json
"scripts": {
  "build": "node scripts/generate-thumbnails.js && next build"
}
```

### Opzionale: Generazione on-the-fly

Per un approccio più avanzato, potresti generare le thumbnails on-demand usando:
- Next.js API Routes
- Sharp library (più veloce di ffmpeg)
- Caching con CDN

## 📚 Risorse

- [ffmpeg Documentation](https://ffmpeg.org/documentation.html)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [THUMBNAILS_GUIDE.md](./THUMBNAILS_GUIDE.md) - Guida dettagliata

## ✅ Checklist Completamento

- [x] ffmpeg installato
- [x] Script generate-thumbnails.js creato
- [x] InstrumentCard.js aggiornato
- [x] Next.js config ottimizzato
- [x] 59 thumbnails generate
- [x] Documentazione completa
- [ ] (Opzionale) Thumbnails committate su Git
- [ ] (Opzionale) Build script automatico
