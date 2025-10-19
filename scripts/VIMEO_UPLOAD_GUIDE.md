# 🎬 Guida Upload Video su Vimeo

Questa guida ti spiega come caricare automaticamente tutti i 65 video della collezione su Vimeo.

## 📋 Prerequisiti

1. **Account Vimeo**
   - Registrati su [vimeo.com](https://vimeo.com)
   - Piano consigliato: **Vimeo Plus** (~7€/mese) per 250GB di storage

2. **Node.js** (già installato)

## 🚀 Setup (solo la prima volta)

### 1. Installa le dipendenze

```bash
npm install vimeo dotenv
```

### 2. Crea un'app Vimeo

1. Vai su https://developer.vimeo.com/apps
2. Clicca **"Create App"**
3. Compila il form:
   - **App Name**: Villa Medici Giulini Uploader
   - **App Description**: Script per caricare video collezione strumenti
   - **App URL**: https://www.villamedici-giulini.it (o il tuo sito)
4. Accetta i termini e crea l'app

### 3. Genera il token di accesso

1. Apri l'app appena creata
2. Vai alla tab **"Authentication"**
3. Scorri fino a **"Generate an Access Token"**
4. Seleziona questi scopes:
   - ✅ **Upload** - Per caricare video
   - ✅ **Edit** - Per modificare metadata
   - ✅ **Video Files** - Per gestire i file
5. Clicca **"Generate"**
6. **IMPORTANTE**: Copia subito il token, non lo vedrai più!

### 4. Configura il file .env

```bash
# Copia il file di esempio
cp .env.example .env

# Apri .env e incolla il tuo token
# VIMEO_ACCESS_TOKEN=il_tuo_token_qui
```

## 📤 Caricamento Video

### Esegui lo script di upload

```bash
node scripts/upload-to-vimeo.js
```

Lo script:
- ✅ Carica tutti i 65 video su Vimeo
- ✅ Imposta il colore burgundy (#8b1538) nel player
- ✅ Aggiunge descrizione e link a Villa Medici Giulini
- ✅ Mostra progresso per ogni video
- ✅ Salva i Vimeo IDs in `vimeo-mappings.json`

**Tempo stimato**: ~2-3 ore per 65 video (dipende dalla velocità internet)

### Output

```
📤 Caricamento: 01 Cembalo cosiddetto "Ottoboni".mp4 (45.2 MB)
   Progresso: 100% (45.2MB / 45.2MB)
✅ Completato: 01 Cembalo cosiddetto "Ottoboni".mp4 -> Vimeo ID: 987654321
⏱️  Pausa 2 secondi...

📤 Caricamento: 02 Arpicordo Baptista Carenonus.mp4 (52.8 MB)
...
```

## 🔄 Aggiorna il Codice

Dopo il caricamento, aggiorna `instruments.js`:

```bash
node scripts/update-instruments-with-vimeo.js
```

Questo script:
- ✅ Legge `vimeo-mappings.json`
- ✅ Aggiunge il campo `vimeoId` a ogni strumento
- ✅ Crea un backup automatico di `instruments.js`

## 🎨 Modifica il Componente

Lo script ha già aggiornato i componenti per usare Vimeo! 

Il player Vimeo:
- 🎨 Usa il colore burgundy (#8b1538)
- ▶️ Autoplay quando apri uno strumento
- 📱 Responsive e ottimizzato
- 🚫 Nessuna pubblicità

## 📊 Vantaggi Vimeo

- ✅ **Qualità**: Streaming HD adattivo
- ✅ **Privacy**: Nessuna pubblicità
- ✅ **Eleganza**: Player pulito e professionale
- ✅ **Performance**: CDN globale veloce
- ✅ **Controllo**: Statistiche dettagliate

## 🔍 Verificare i Video

Dopo l'upload, ogni video sarà disponibile su:
```
https://vimeo.com/YOUR_VIDEO_ID
```

Puoi anche gestirli dal tuo [pannello Vimeo](https://vimeo.com/manage/videos).

## 💡 Tips

- **Upload fallito?** Lo script riprova automaticamente
- **Modificare metadata?** Usa il pannello Vimeo o modifica lo script
- **Cambiare privacy?** Modifica `privacy.view` nello script:
  - `anybody` = Pubblico
  - `unlisted` = Solo con link
  - `password` = Con password

## ⚠️ Troubleshooting

### "VIMEO_ACCESS_TOKEN non trovato"
Controlla che il file `.env` esista nella root e contenga il token.

### "Rate limit exceeded"
Vimeo limita gli upload. Lo script fa pause di 2 secondi tra i video.

### "File non trovato"
Verifica che i video siano in `public/audio/` con i nomi corretti.

## 📞 Supporto

- Documentazione Vimeo: https://developer.vimeo.com/api/start
- Issues GitHub: Apri un issue nel repository

---

**Buon caricamento! 🎬**
