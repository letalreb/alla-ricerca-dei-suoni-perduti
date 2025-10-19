# 🏛️ Guida Upload Video su Internet Archive

Questa guida ti spiega come caricare **gratuitamente e per sempre** tutti i tuoi 62 video (12GB) su Internet Archive.

## 🌟 Perché Internet Archive?

- ✅ **Completamente GRATUITO**
- ✅ **Storage illimitato**
- ✅ **Bandwidth illimitato**
- ✅ **Perfetto per contenuti culturali**
- ✅ **Preservazione permanente**
- ✅ **Nessuna pubblicità**
- ✅ **Player embed professionale**

## 📋 Prerequisiti

1. **Account Internet Archive**
   - Registrati su [archive.org/account/signup](https://archive.org/account/signup)
   - È GRATIS!

2. **Python** (per installare il CLI tool)
   - Su macOS: già installato

## 🚀 Setup (solo la prima volta)

### 1. Installa Internet Archive CLI

```bash
pip3 install internetarchive
```

Verifica l'installazione:
```bash
ia --version
```

### 2. Crea un account su Internet Archive

1. Vai su https://archive.org/account/signup
2. Compila:
   - **Screen name**: Il tuo nome utente (es: "VillaMediciGiulini")
   - **Email**: La tua email
   - **Password**: Scegli una password sicura
3. Conferma l'email

### 3. Configura le credenziali

Crea il file `.env` nella root del progetto:

```bash
cp .env.example .env
```

Modifica `.env` e aggiungi:
```
ARCHIVE_EMAIL=your_email@example.com
ARCHIVE_PASSWORD=your_password
```

## 📤 Caricamento Video

### Esegui lo script di upload

```bash
node scripts/upload-to-archive.js
```

Lo script:
- ✅ Configura automaticamente le credenziali
- ✅ Carica tutti i 62 video uno alla volta
- ✅ Crea un identifier unico per ogni video
- ✅ Aggiunge metadata ricchi (titolo, descrizione, tags)
- ✅ Imposta licenza Creative Commons
- ✅ Salva i mapping in `archive-mappings.json`

**Tempo stimato**: 
- Dipende dalla tua velocità internet
- Internet Archive non ha limiti di upload
- Per 12GB: ~2-4 ore con connessione media

### Output durante l'upload

```
📤 Caricamento: 01 Cembalo cosiddetto "Ottoboni".mp4
   Dimensione: 45.2 MB
   Identifier: villa-medici-giulini-01-cembalo-cosiddetto-ottoboni
   Caricamento in corso...
✅ Completato: villa-medici-giulini-01-cembalo-cosiddetto-ottoboni
   URL: https://archive.org/details/villa-medici-giulini-01-cembalo-cosiddetto-ottoboni
⏱️  Pausa 3 secondi...

📤 Caricamento: 02 Arpicordo Baptista Carenonus.mp4
...
```

## 🔄 Aggiorna il Codice

Dopo il caricamento completo, aggiorna `instruments.js`:

```bash
node scripts/update-instruments-with-archive.js
```

Questo script:
- ✅ Legge `archive-mappings.json`
- ✅ Aggiunge `archiveId` e `embedUrl` a ogni strumento
- ✅ Crea backup automatico di `instruments.js`

## 🎨 Come Funziona il Componente

Il nuovo componente `ArchivePlayer` embeded automaticamente:

```jsx
<ArchivePlayer 
  archiveId="villa-medici-giulini-01-cembalo"
  embedUrl="https://archive.org/embed/villa-medici-giulini-01-cembalo"
  title="Cembalo Ottoboni"
/>
```

Caratteristiche:
- 🎨 Design burgundy coerente con il sito
- ▶️ Autoplay quando apri lo strumento
- 📱 Completamente responsive
- 🔗 Link a Internet Archive al hover
- ⏳ Loading spinner durante il caricamento

## 📊 Metadata Automatici

Lo script imposta automaticamente per ogni video:

- **Title**: Nome strumento senza numero
- **Creator**: Villa Medici Giulini
- **Description**: Descrizione completa della collezione
- **Subject tags**: 
  - musical instruments
  - historical instruments
  - italian heritage
  - villa medici giulini
- **Language**: Italiano
- **License**: Creative Commons BY-NC-SA 4.0
- **Collection**: opensource_movies (pubblica)

## 🔍 Gestione Video

Dopo l'upload, puoi:

1. **Vedere tutti i tuoi video**:
   ```
   https://archive.org/details/@YourUsername
   ```

2. **Modificare metadata**:
   - Vai sul video
   - Clicca "Edit Item"
   - Modifica descrizione, tags, ecc.

3. **Scaricare video**:
   - Ogni video ha link di download
   - Formato originale + versioni compresse

4. **Statistiche**:
   - Visualizzazioni
   - Download
   - Paesi degli spettatori

## 💡 Vantaggi per Villa Medici Giulini

- 🏛️ **Preservazione culturale**: I video sono archiviati per sempre
- 🌍 **Visibilità globale**: Indicizzati da Google
- 📚 **Educativo**: Parte dell'archivio culturale mondiale
- 🔗 **SEO**: Link da archive.org al tuo sito
- 📊 **Analytics**: Vedi chi guarda i tuoi video
- 💰 **Costo zero**: Sempre gratis

## ⚠️ Troubleshooting

### "ia command not found"
```bash
# Prova con pip invece di pip3
pip install internetarchive

# Oppure specifica il path
python3 -m pip install internetarchive
```

### "Authentication failed"
Controlla che `.env` contenga email e password corretti.

### "File già esistente"
Se hai già caricato un video con lo stesso identifier, lo script lo salta. Puoi:
1. Cancellare il video su archive.org
2. Modificare lo script per cambiare l'identifier

### Upload interrotto
Lo script salva i progressi in `archive-mappings.json`. Puoi:
1. Commentare i video già caricati nello script
2. Riavviare solo per i video mancanti

## 🎯 Prossimi Passi

Dopo l'upload:

1. ✅ Verifica i video su Internet Archive
2. ✅ Condividi la collezione sui social
3. ✅ Aggiungi link nella descrizione del sito
4. ✅ Considera di creare una "Collection" dedicata a Villa Medici Giulini

### Creare una Collection Dedicata

Puoi richiedere una collection personalizzata:

1. Vai su https://archive.org/create
2. Richiedi una nuova collection
3. Nome suggerito: "villa-medici-giulini-instruments"
4. I tuoi video appariranno tutti insieme

## 📞 Supporto

- **Internet Archive Forum**: https://archive.org/about/faqs.php
- **Community**: https://archive.org/iathreads/
- **Email Support**: info@archive.org

---

**Buon caricamento! 🏛️**

_I tuoi video saranno preservati per sempre e condivisi con il mondo._
