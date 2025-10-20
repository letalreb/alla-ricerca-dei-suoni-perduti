const fs = require('fs');
const path = require('path');

// Titoli corretti forniti dall'utente
const correctTitles = {
  1: 'Cembalo Giovanni Natale Boccalari, Napoli, 1679',
  2: 'Cembalo "Ottoboni", Italia, (Roma?), seconda metà del secolo XVII',
  3: 'Cembalo Onofrio Guarracino (attribuito), Napoli, seconda metà del secolo XVII',
  4: 'Cembalo Andrés Fernández Santos, Valladolid, 1728',
  5: 'Spinetta trapezoidale all'ottava Rinaldo Bertoni, Bologna, 1707',
  6: 'Spinetta rettangolare all'ottava Hieronimus (Girolamo) Bassi, Venezia, 1713',
  7: 'Arpicordo rettangolare Baptista Carenonus, Salò, 1700 (?)',
  8: 'Cembalo fiammingo trasformato in fortepiano "ravalé" da Joseph Treyer "L'empereur", Parigi, 1759',
  9: 'Cembalo e fortepiano "combinatorio" Johann Ludwig Hellen (Hehlen), Berna, 1763',
  10: 'Fortepiano a coda Nannette Stein e Matthäus Andreas Stein (Frère et Soeur Stein), Vienna, tra il 1794 e il 1802',
  11: 'Fortepiano a coda Anton Walter, Vienna, ca. 1789',
  12: 'Fortepiano a coda Anton Walter, Vienna, ca. 1796',
  13: 'Fortepiano a coda Johann Schantz, Vienna, ca. 1810',
  14: 'Fortepiano a coda Johann Schantz, Vienna, 1810-20',
  15: 'Fortepiano a coda Johann o Joseph Fritz, Vienna, ca. 1830',
  16: 'Fortepiano a coda Conrad Graf, Vienna, ca. 1834',
  17: 'Fortepiano a coda Conrad Graf, Vienna, ca. 1834',
  18: 'Fortepiano a coda Johann Baptist Streicher, Vienna, 1837',
  19: 'Fortepiano a coda Joseph Dohnal figlio, Vienna, ca. 1830',
  20: 'Fortepiano a coda Maximilian Schott, Vienna, ca. 1840',
  21: 'Fortepiano a coda Ignaz Bösendorfer, Vienna, ca. 1850',
  22: 'Fortepiano a coda Ignace Pleyel, Parigi, 1839',
  23: 'Fortepiano a coda Ignace Pleyel, Parigi, 1852',
  24: 'Fortepiano a coda Boisselot et Fils, Marsiglia, dopo 1844',
  25: 'Fortepiano a coda Pierre-Orphée Erard, Londra, ca. 1853',
  26: 'Fortepiano da boudoir (con scatola da cucito), Vienna (?), prima metà del secolo XIX',
  27: 'Fortepiano a tavolo Johann Christoph Zumpe, Londra, 1780 – non in grado di suonare',
  28: 'Fortepiano a tavolo Fratelli Elli, Milano, 1800',
  29: 'Fortepiano a tavolo Gaetano Scappa, Milano, 1796',
  30: 'Fortepiano a tavolo dipinto Italia (?), seconda metà del secolo XVIII',
  31: 'Fortepiano a tavolo Italia (?), seconda metà del secolo XVIII – non rin grado di suonare',
  32: 'Fortepiano a tavolo Jean-Henri Pape, Parigi, 1825',
  33: 'Pianoforte a coda Emerich Bétsy (padre), Vienna, 1854',
  34: 'Pianoforte a coda, Modello 3bis [Auguste Wolff]/Pleyel, Paris, 1882',
  35: 'Pianoforte a coda Julius Blüthner, Leipzig, 1902',
  36: 'Pianoforte mezza-coda aliquot Julius Blüthner, Leipzig, 1929',
  37: 'Pianoforte mezza-coda, Modello L C. Bechstein, Berlino, 1963',
  38: 'Pianoforte a coda Modello B Steinway & Sons, Amburgo, 1990',
  39: 'Organo Bartolomeo Ravani, Lucca, seconda metà del secolo XVII',
  40: 'Organo Scuola veneziana, seconda metà del secolo XVIII',
  41: 'Organo Dominicus Antonius Rossi (attribuito), Napoli, secolo XVIII',
  42: 'Arpa diatonica Anonimo, Germania del sud oppure Austria (Vienna?), ca. 1830',
  43: 'Arpa a pedali a movimento semplice [Godefroid] Holtzman, Parigi, 1775',
  44: 'Arpa a pedali a movimento semplice Jean-Henri Naderman, Parigi, 1790',
  45: 'Arpa a pedali a movimento semplice Jean-Henri Naderman, Parigi, 1790',
  46: 'Arpa a pedali a movimento semplice [J· B·] Hurtz, Parigi, ca. 1785',
  47: 'Arpa a pedali a movimento semplice [Pierre-Joseph?] Zimmerman, Parigi, ca. 1785',
  48: 'Arpa a pedali a movimento semplice Cousineau Père et Fils, Parigi, ca.1785',
  49: 'Arpa a pedali a movimento semplice [Jacques-Georges] Cousineau, Parigi, tra il 1815 e il 1818',
  50: 'Arpa a pedali a movimento semplice [Henri] Naderman, Parigi, dopo il 1820',
  51: 'Arpa a pedali a movimento doppio Sébastien Erard, Londra, 1821, numero di serie N 3218',
  52: 'Arpa a pedali a movimento doppio Sébastien Erard, Londra, 1825, numero di serie N 3704',
  53: 'Salterio (25 cori) Italia, fine del secolo XVIII',
  54: 'Salterio (24 cori) Italia, fine del secolo XVIII',
  55: 'Salterio (27 cori) Italia, ca. 1800',
  56: 'Salterio (23 cori) Gran Bretagna (?), inizio del secolo XIX',
  57: 'Salterio (26 cori) Germania o Impero austro-ungarico (?), prima metà del secolo XIX',
  58: 'Mandolino a sei corde Carlo Albertini e figlio, Lombardia, prima metà del secolo XX',
  59: 'Mandolino napoletano Napoli, secolo XX',
  60: 'Chitarra Fernando del Perugia, Firenze, 1894',
  61: 'Fortepiano a coda "Archinto", Johann Schanz, Vienna, ca. 1816',
  62: 'Pianoforte a coda "Giulini" Johann Heitzmann und Sohn, Vienna, ca. 1870',
  63: 'Pianoforte a coda Pleyel Wolff et Compagnie, Parigi, 1885',
  64: 'Pianoforte a coda Érard, Parigi, 1883',
  65: 'Pianoforte a coda Erard, Parigi, 1892',
  66: 'Arpa a pedali a movimento semplice Érard, Parigi, 1808, numero di serie N 123',
  67: 'Arpa a pedali a doppio movimento Érard, Parigi, ottobre 1919, numero di serie N 4114',
  68: 'Arpa a pedali a doppio movimento Érard "Bassi", Parigi, 1902, numero di serie N 4584',
  69: 'Salterio Antonio Berti, Firenze, secondo quarto del secolo XVIII',
  70: 'Salterio italiano con scatola, Venezia, 1725-1740',
  71: 'Salterio Antonio Berti, Firenze, prima metà del secolo XVIII',
  72: 'Mandolino Nicola e Raffaele Calace, Napoli,1892, con scatola',
  73: 'Mandolino napoletano anonimo, fine del XIX secolo – inizio del XX – non in grado di suonare',
  74: 'Fortepiano a coda "Prearo" Johannes Michael Schoelly, Roma, 1793',
  75: 'Pianoforte a coda "Bigatti" Ernest Kaps, n.10188, Dresden, ca. 1885',
  76: 'Pianoforte mezza coda aliquot Julius Blüthner, n.137200, Leipzig, 1971',
  77: 'Pianoforte a coda "Montorfano" Burger & Jacobi, n.28543, Madretsch, Bienne, 1931',
  78: 'Pianoforte a coda Pleyel, n.173871, Parigi, ca. 1923',
  79: 'Pianoforte a coda "Ravasio" Augusto Tallone, n.2136/c.XXXI/91, Milano, 08-03-1960',
  80: 'Pianoforte mezza coda Modello O-180, Steinway & Sons, n. 238617, Amburgo, 1899',
  81: 'Pianoforte quarto di coda Steinway & Sons, Modello S-155 n.299308, New York-Hamburg, 1926',
  82: 'Pianoforte mezza coda Modello A-188 Steinway & Sons n.484418, Amburgo, 1991',
  83: 'Pianoforte mezza coda Yamaha G1 RE 4700115, Hamamatsu, 1989',
  84: 'Pianoforte mezza coda Yamaha G1 RE 4800351 Hamamatsu, 1989',
  85: 'Pianoforte mezza coda Yamaha G2 E 1853242, Hamamatsu, 1974',
  86: 'Harmonium Kaslier, Parigi, ca. 1930',
  87: 'Le Guide Chant Kaslier, Parigi, ca. 1930',
  88: 'Violino Giuseppe Pedrazzini (1879-1957), Milano, 1920',
  89: 'Violino da bambino, metà del secolo XX – non in grado di suonare',
  90: 'Violino Maidstone, inizio del secolo XX',
  91: 'Violino Stefano Caponnetto, Catania, primo quarto del secolo XX',
  92: 'Viola Wenzl Fuchs, 1960'
};

const INSTRUMENTS_FILE = path.join(__dirname, '../app/data/instruments.js');

// Leggi il file corrente
const content = fs.readFileSync(INSTRUMENTS_FILE, 'utf8');

// Estrai l'array degli strumenti
const arrayMatch = content.match(/export const instruments = \[([\s\S]*?)\];/);
if (!arrayMatch) {
  console.error('❌ Impossibile trovare l\'array instruments');
  process.exit(1);
}

// Parse degli strumenti
const instruments = eval(`[${arrayMatch[1]}]`);

// Aggiorna i titoli
instruments.forEach(inst => {
  if (correctTitles[inst.id]) {
    inst.name = correctTitles[inst.id];
  }
});

// Funzione per escapare le virgolette nelle stringhe
function escapeQuotes(str) {
  return str.replace(/"/g, '\\"').replace(/"/g, '\\"').replace(/"/g, '\\"');
}

// Funzione per formattare un oggetto strumento
function formatInstrument(inst) {
  let parts = [`id: ${inst.id}`, `name: "${escapeQuotes(inst.name)}"`];
  
  if (inst.author) parts.push(`author: "${escapeQuotes(inst.author)}"`);
  if (inst.location) parts.push(`location: "${escapeQuotes(inst.location)}"`);
  if (inst.year) parts.push(`year: "${escapeQuotes(inst.year)}"`);
  if (inst.audioFile) parts.push(`audioFile: "${escapeQuotes(inst.audioFile)}"`);
  if (inst.archiveId) parts.push(`archiveId: "${escapeQuotes(inst.archiveId)}"`);
  if (inst.embedUrl) parts.push(`embedUrl: "${escapeQuotes(inst.embedUrl)}"`);
  
  return `  { ${parts.join(', ')} }`;
}

// Ricostruisci il file
const newContent = `// Database completo dei 92 strumenti musicali della collezione
// "Alla Ricerca dei Suoni Perduti"

export const instruments = [
${instruments.map(formatInstrument).join(',\n')}
];

export default instruments;
`;

// Backup
const backupFile = INSTRUMENTS_FILE + '.backup-titles';
fs.writeFileSync(backupFile, content);
console.log(`💾 Backup creato: ${backupFile}`);

// Salva il nuovo file
fs.writeFileSync(INSTRUMENTS_FILE, newContent);
console.log(`✅ Aggiornati ${instruments.length} titoli`);
console.log(`📄 File salvato: ${INSTRUMENTS_FILE}`);
