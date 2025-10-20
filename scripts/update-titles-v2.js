const fs = require('fs');
const path = require('path');

// Titoli corretti forniti dall'utente (usando array per evitare problemi di escape)
const correctTitles = [
  { id: 1, name: 'Cembalo Giovanni Natale Boccalari, Napoli, 1679' },
  { id: 2, name: 'Cembalo "Ottoboni", Italia, (Roma?), seconda metà del secolo XVII' },
  { id: 3, name: 'Cembalo Onofrio Guarracino (attribuito), Napoli, seconda metà del secolo XVII' },
  { id: 4, name: 'Cembalo Andrés Fernández Santos, Valladolid, 1728' },
  { id: 5, name: `Spinetta trapezoidale all'ottava Rinaldo Bertoni, Bologna, 1707` },
  { id: 6, name: `Spinetta rettangolare all'ottava Hieronimus (Girolamo) Bassi, Venezia, 1713` },
  { id: 7, name: 'Arpicordo rettangolare Baptista Carenonus, Salò, 1700 (?)' },
  { id: 8, name: `Cembalo fiammingo trasformato in fortepiano "ravalé" da Joseph Treyer "L'empereur", Parigi, 1759` },
  { id: 9, name: 'Cembalo e fortepiano "combinatorio" Johann Ludwig Hellen (Hehlen), Berna, 1763' },
  { id: 10, name: 'Fortepiano a coda Nannette Stein e Matthäus Andreas Stein (Frère et Soeur Stein), Vienna, tra il 1794 e il 1802' },
  { id: 11, name: 'Fortepiano a coda Anton Walter, Vienna, ca. 1789' },
  { id: 12, name: 'Fortepiano a coda Anton Walter, Vienna, ca. 1796' },
  { id: 13, name: 'Fortepiano a coda Johann Schantz, Vienna, ca. 1810' },
  { id: 14, name: 'Fortepiano a coda Johann Schantz, Vienna, 1810-20' },
  { id: 15, name: 'Fortepiano a coda Johann o Joseph Fritz, Vienna, ca. 1830' },
  { id: 16, name: 'Fortepiano a coda Conrad Graf, Vienna, ca. 1834' },
  { id: 17, name: 'Fortepiano a coda Conrad Graf, Vienna, ca. 1834' },
  { id: 18, name: 'Fortepiano a coda Johann Baptist Streicher, Vienna, 1837' },
  { id: 19, name: 'Fortepiano a coda Joseph Dohnal figlio, Vienna, ca. 1830' },
  { id: 20, name: 'Fortepiano a coda Maximilian Schott, Vienna, ca. 1840' },
  { id: 21, name: 'Fortepiano a coda Ignaz Bösendorfer, Vienna, ca. 1850' },
  { id: 22, name: 'Fortepiano a coda Ignace Pleyel, Parigi, 1839' },
  { id: 23, name: 'Fortepiano a coda Ignace Pleyel, Parigi, 1852' },
  { id: 24, name: 'Fortepiano a coda Boisselot et Fils, Marsiglia, dopo 1844' },
  { id: 25, name: 'Fortepiano a coda Pierre-Orphée Erard, Londra, ca. 1853' },
  { id: 26, name: 'Fortepiano da boudoir (con scatola da cucito), Vienna (?), prima metà del secolo XIX' },
  { id: 27, name: 'Fortepiano a tavolo Johann Christoph Zumpe, Londra, 1780 – non in grado di suonare' },
  { id: 28, name: 'Fortepiano a tavolo Fratelli Elli, Milano, 1800' },
  { id: 29, name: 'Fortepiano a tavolo Gaetano Scappa, Milano, 1796' },
  { id: 30, name: 'Fortepiano a tavolo dipinto Italia (?), seconda metà del secolo XVIII' },
  { id: 31, name: 'Fortepiano a tavolo Italia (?), seconda metà del secolo XVIII – non rin grado di suonare' },
  { id: 32, name: 'Fortepiano a tavolo Jean-Henri Pape, Parigi, 1825' },
  { id: 33, name: 'Pianoforte a coda Emerich Bétsy (padre), Vienna, 1854' },
  { id: 34, name: 'Pianoforte a coda, Modello 3bis [Auguste Wolff]/Pleyel, Paris, 1882' },
  { id: 35, name: 'Pianoforte a coda Julius Blüthner, Leipzig, 1902' },
  { id: 36, name: 'Pianoforte mezza-coda aliquot Julius Blüthner, Leipzig, 1929' },
  { id: 37, name: 'Pianoforte mezza-coda, Modello L C. Bechstein, Berlino, 1963' },
  { id: 38, name: 'Pianoforte a coda Modello B Steinway & Sons, Amburgo, 1990' },
  { id: 39, name: 'Organo Bartolomeo Ravani, Lucca, seconda metà del secolo XVII' },
  { id: 40, name: 'Organo Scuola veneziana, seconda metà del secolo XVIII' },
  { id: 41, name: 'Organo Dominicus Antonius Rossi (attribuito), Napoli, secolo XVIII' },
  { id: 42, name: 'Arpa diatonica Anonimo, Germania del sud oppure Austria (Vienna?), ca. 1830' },
  { id: 43, name: 'Arpa a pedali a movimento semplice [Godefroid] Holtzman, Parigi, 1775' },
  { id: 44, name: 'Arpa a pedali a movimento semplice Jean-Henri Naderman, Parigi, 1790' },
  { id: 45, name: 'Arpa a pedali a movimento semplice Jean-Henri Naderman, Parigi, 1790' },
  { id: 46, name: 'Arpa a pedali a movimento semplice [J· B·] Hurtz, Parigi, ca. 1785' },
  { id: 47, name: 'Arpa a pedali a movimento semplice [Pierre-Joseph?] Zimmerman, Parigi, ca. 1785' },
  { id: 48, name: 'Arpa a pedali a movimento semplice Cousineau Père et Fils, Parigi, ca.1785' },
  { id: 49, name: 'Arpa a pedali a movimento semplice [Jacques-Georges] Cousineau, Parigi, tra il 1815 e il 1818' },
  { id: 50, name: 'Arpa a pedali a movimento semplice [Henri] Naderman, Parigi, dopo il 1820' },
  { id: 51, name: 'Arpa a pedali a movimento doppio Sébastien Erard, Londra, 1821, numero di serie N 3218' },
  { id: 52, name: 'Arpa a pedali a movimento doppio Sébastien Erard, Londra, 1825, numero di serie N 3704' },
  { id: 53, name: 'Salterio (25 cori) Italia, fine del secolo XVIII' },
  { id: 54, name: 'Salterio (24 cori) Italia, fine del secolo XVIII' },
  { id: 55, name: 'Salterio (27 cori) Italia, ca. 1800' },
  { id: 56, name: 'Salterio (23 cori) Gran Bretagna (?), inizio del secolo XIX' },
  { id: 57, name: 'Salterio (26 cori) Germania o Impero austro-ungarico (?), prima metà del secolo XIX' },
  { id: 58, name: 'Mandolino a sei corde Carlo Albertini e figlio, Lombardia, prima metà del secolo XX' },
  { id: 59, name: 'Mandolino napoletano Napoli, secolo XX' },
  { id: 60, name: 'Chitarra Fernando del Perugia, Firenze, 1894' },
  { id: 61, name: 'Fortepiano a coda "Archinto", Johann Schanz, Vienna, ca. 1816' },
  { id: 62, name: 'Pianoforte a coda "Giulini" Johann Heitzmann und Sohn, Vienna, ca. 1870' },
  { id: 63, name: 'Pianoforte a coda Pleyel Wolff et Compagnie, Parigi, 1885' },
  { id: 64, name: 'Pianoforte a coda Érard, Parigi, 1883' },
  { id: 65, name: 'Pianoforte a coda Erard, Parigi, 1892' },
  { id: 66, name: 'Arpa a pedali a movimento semplice Érard, Parigi, 1808, numero di serie N 123' },
  { id: 67, name: 'Arpa a pedali a doppio movimento Érard, Parigi, ottobre 1919, numero di serie N 4114' },
  { id: 68, name: 'Arpa a pedali a doppio movimento Érard "Bassi", Parigi, 1902, numero di serie N 4584' },
  { id: 69, name: 'Salterio Antonio Berti, Firenze, secondo quarto del secolo XVIII' },
  { id: 70, name: 'Salterio italiano con scatola, Venezia, 1725-1740' },
  { id: 71, name: 'Salterio Antonio Berti, Firenze, prima metà del secolo XVIII' },
  { id: 72, name: 'Mandolino Nicola e Raffaele Calace, Napoli,1892, con scatola' },
  { id: 73, name: 'Mandolino napoletano anonimo, fine del XIX secolo – inizio del XX – non in grado di suonare' },
  { id: 74, name: 'Fortepiano a coda "Prearo" Johannes Michael Schoelly, Roma, 1793' },
  { id: 75, name: 'Pianoforte a coda "Bigatti" Ernest Kaps, n.10188, Dresden, ca. 1885' },
  { id: 76, name: 'Pianoforte mezza coda aliquot Julius Blüthner, n.137200, Leipzig, 1971' },
  { id: 77, name: 'Pianoforte a coda "Montorfano" Burger & Jacobi, n.28543, Madretsch, Bienne, 1931' },
  { id: 78, name: 'Pianoforte a coda Pleyel, n.173871, Parigi, ca. 1923' },
  { id: 79, name: 'Pianoforte a coda "Ravasio" Augusto Tallone, n.2136/c.XXXI/91, Milano, 08-03-1960' },
  { id: 80, name: 'Pianoforte mezza coda Modello O-180, Steinway & Sons, n. 238617, Amburgo, 1899' },
  { id: 81, name: 'Pianoforte quarto di coda Steinway & Sons, Modello S-155 n.299308, New York-Hamburg, 1926' },
  { id: 82, name: 'Pianoforte mezza coda Modello A-188 Steinway & Sons n.484418, Amburgo, 1991' },
  { id: 83, name: 'Pianoforte mezza coda Yamaha G1 RE 4700115, Hamamatsu, 1989' },
  { id: 84, name: 'Pianoforte mezza coda Yamaha G1 RE 4800351 Hamamatsu, 1989' },
  { id: 85, name: 'Pianoforte mezza coda Yamaha G2 E 1853242, Hamamatsu, 1974' },
  { id: 86, name: 'Harmonium Kaslier, Parigi, ca. 1930' },
  { id: 87, name: 'Le Guide Chant Kaslier, Parigi, ca. 1930' },
  { id: 88, name: 'Violino Giuseppe Pedrazzini (1879-1957), Milano, 1920' },
  { id: 89, name: 'Violino da bambino, metà del secolo XX – non in grado di suonare' },
  { id: 90, name: 'Violino Maidstone, inizio del secolo XX' },
  { id: 91, name: 'Violino Stefano Caponnetto, Catania, primo quarto del secolo XX' },
  { id: 92, name: 'Viola Wenzl Fuchs, 1960' }
];

const INSTRUMENTS_FILE = path.join(__dirname, '../app/data/instruments.js');

// Leggi il file di backup originale
const content = fs.readFileSync(INSTRUMENTS_FILE + '.backup-titles', 'utf8');

// Estrai l'array degli strumenti
const arrayMatch = content.match(/export const instruments = \[([\s\S]*?)\];/);
if (!arrayMatch) {
  console.error('❌ Impossibile trovare l\'array instruments');
  process.exit(1);
}

// Parse degli strumenti dal backup originale
const instruments = eval(`[${arrayMatch[1]}]`);

// Crea una mappa dei titoli corretti
const titleMap = new Map(correctTitles.map(t => [t.id, t.name]));

// Aggiorna i titoli
instruments.forEach(inst => {
  if (titleMap.has(inst.id)) {
    inst.name = titleMap.get(inst.id);
  }
});

// Funzione per escapare le virgolette e altri caratteri speciali nelle stringhe
function escapeString(str) {
  return str
    .replace(/\\/g, '\\\\')  // Escape backslash
    .replace(/"/g, '\\"')    // Escape double quotes
    .replace(/\n/g, '\\n')   // Escape newline
    .replace(/\r/g, '\\r')   // Escape carriage return
    .replace(/\t/g, '\\t');  // Escape tab
}

// Funzione per formattare un oggetto strumento
function formatInstrument(inst) {
  let parts = [`id: ${inst.id}`];
  
  parts.push(`name: "${escapeString(inst.name)}"`);
  
  if (inst.author) parts.push(`author: "${escapeString(inst.author)}"`);
  if (inst.location) parts.push(`location: "${escapeString(inst.location)}"`);
  if (inst.year) parts.push(`year: "${escapeString(inst.year)}"`);
  if (inst.audioFile) parts.push(`audioFile: "${escapeString(inst.audioFile)}"`);
  if (inst.archiveId) parts.push(`archiveId: "${escapeString(inst.archiveId)}"`);
  if (inst.embedUrl) parts.push(`embedUrl: "${escapeString(inst.embedUrl)}"`);
  
  return `  { ${parts.join(', ')} }`;
}

// Genera il nuovo contenuto
const newInstruments = instruments.map(formatInstrument).join(',\n');

const newContent = `// Database completo dei 92 strumenti musicali della collezione
// "Alla Ricerca dei Suoni Perduti"

export const instruments = [
${newInstruments}
];
`;

// Crea backup
const backupPath = `${INSTRUMENTS_FILE}.backup-${Date.now()}`;
fs.copyFileSync(INSTRUMENTS_FILE, backupPath);
console.log(`💾 Backup creato: ${backupPath}`);

// Scrivi il nuovo file
fs.writeFileSync(INSTRUMENTS_FILE, newContent, 'utf8');
console.log(`✅ Aggiornati ${instruments.length} titoli`);
console.log(`📄 File salvato: ${INSTRUMENTS_FILE}`);
