# 🎬 Hosting Video - Guida Completa

Hai 62 video (12GB totali) della collezione Villa Medici Giulini. Questa guida confronta le due opzioni disponibili per l'hosting.

## 📊 Confronto Rapido

| Caratteristica | Internet Archive ✅ | Vimeo |
|----------------|-------------------|-------|
| **Costo** | ✅ GRATIS per sempre | 💰 ~7€/mese (Vimeo Plus) |
| **Storage** | ✅ Illimitato | 250 GB |
| **Bandwidth** | ✅ Illimitato | Illimitato |
| **Pubblicità** | ✅ Nessuna | ✅ Nessuna |
| **Player** | ✅ Professionale | ✅ Molto elegante |
| **Missione** | ✅ Preservazione culturale | Business |
| **Upload** | Script automatico | Script automatico |
| **SEO** | ✅ Ottimo | Buono |

## 🏆 Raccomandazione: Internet Archive

**Per contenuti culturali come Villa Medici Giulini, Internet Archive è perfetto perché:**

1. ✅ **Completamente gratuito** - nessun costo mensile
2. ✅ **Missione culturale** - preservare la storia per le future generazioni
3. ✅ **Storage illimitato** - carica quanti video vuoi
4. ✅ **Permanente** - i tuoi video saranno online per sempre
5. ✅ **Riconoscimento** - parte dell'archivio culturale mondiale

## 🚀 Guide Dettagliate

### Opzione 1: Internet Archive (Consigliata) 🏛️

📖 **Leggi la guida completa**: [ARCHIVE_UPLOAD_GUIDE.md](./ARCHIVE_UPLOAD_GUIDE.md)

**Quick Start:**
```bash
# 1. Installa Internet Archive CLI
pip3 install internetarchive

# 2. Configura credenziali in .env
cp .env.example .env
# Modifica .env con email e password di archive.org

# 3. Carica i video
node scripts/upload-to-archive.js

# 4. Aggiorna il codice
node scripts/update-instruments-with-archive.js
```

### Opzione 2: Vimeo 🎥

📖 **Leggi la guida completa**: [VIMEO_UPLOAD_GUIDE.md](./VIMEO_UPLOAD_GUIDE.md)

**Quick Start:**
```bash
# 1. Installa dipendenze
npm install vimeo dotenv

# 2. Configura token in .env
cp .env.example .env
# Modifica .env con il token di Vimeo

# 3. Carica i video
node scripts/upload-to-vimeo.js

# 4. Aggiorna il codice
node scripts/update-instruments-with-vimeo.js
```

## 📁 Struttura File

```
scripts/
├── upload-to-archive.js          # Script upload Internet Archive
├── upload-to-vimeo.js             # Script upload Vimeo
├── update-instruments-with-archive.js
├── update-instruments-with-vimeo.js
├── ARCHIVE_UPLOAD_GUIDE.md        # Guida Internet Archive
├── VIMEO_UPLOAD_GUIDE.md          # Guida Vimeo
└── VIDEO_HOSTING_GUIDE.md         # Questo file

app/_components/
├── ArchivePlayer.js               # Player per Internet Archive
├── ArchivePlayer.module.css
└── (il componente funziona anche per Vimeo)
```

## 🎨 Componenti

Entrambe le soluzioni usano componenti React che si integrano perfettamente con il design burgundy del sito.

### Internet Archive
```jsx
<ArchivePlayer 
  archiveId="villa-medici-giulini-01-cembalo"
  embedUrl="https://archive.org/embed/..."
  title="Cembalo Ottoboni"
/>
```

### Vimeo
```jsx
<ArchivePlayer 
  vimeoId="987654321"
  embedUrl="https://player.vimeo.com/video/987654321"
  title="Cembalo Ottoboni"
/>
```

## 💰 Analisi Costi

### Internet Archive
- **Setup**: GRATIS
- **Mensile**: GRATIS
- **Annuale**: GRATIS
- **Totale 5 anni**: **€0**

### Vimeo Plus
- **Setup**: GRATIS
- **Mensile**: ~€7
- **Annuale**: ~€84
- **Totale 5 anni**: **€420**

## 🎯 Quando Scegliere Cosa

### Scegli Internet Archive se:
- ✅ Vuoi costo zero
- ✅ Hai contenuti culturali/educativi
- ✅ Vuoi preservazione permanente
- ✅ Non hai budget mensile
- ✅ Vuoi contribuire alla cultura

### Scegli Vimeo se:
- ✅ Budget disponibile (~7€/mese)
- ✅ Vuoi analytics molto dettagliati
- ✅ Preferisci interfaccia più "corporate"
- ✅ Hai bisogno di funzionalità avanzate (password, privacy granulare)

## 📞 Supporto

### Internet Archive
- Forum: https://archive.org/about/faqs.php
- Email: info@archive.org

### Vimeo
- Help Center: https://vimeo.com/help
- Developer Docs: https://developer.vimeo.com/api/start

## ✅ Checklist Setup

- [ ] Leggi la guida della soluzione scelta
- [ ] Crea account (Archive.org o Vimeo)
- [ ] Installa dipendenze necessarie
- [ ] Configura file `.env`
- [ ] Esegui script di upload
- [ ] Verifica che i video siano online
- [ ] Esegui script di aggiornamento codice
- [ ] Testa il sito con `npm run dev`
- [ ] Commit e push delle modifiche

## 🎉 Risultato Finale

Dopo il setup, il tuo sito:
- ✅ Mostrerà i video embedded nelle pagine strumenti
- ✅ Avrà autoplay quando apri uno strumento
- ✅ Sarà responsive e veloce
- ✅ Non avrà file pesanti nel repository Git
- ✅ Avrà costi zero (con Internet Archive)

---

**Hai dubbi? Scegli Internet Archive - è perfetto per te! 🏛️**
