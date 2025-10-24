const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const thumbnailsDir = path.join(__dirname, '../public/images/thumbnails');

async function optimizeImages() {
  try {
    const files = fs.readdirSync(thumbnailsDir);
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|JPG|JPEG)$/i.test(file)
    );

    console.log(`Found ${imageFiles.length} images to optimize`);

    for (const file of imageFiles) {
      const inputPath = path.join(thumbnailsDir, file);
      const stats = fs.statSync(inputPath);
      const sizeBefore = (stats.size / 1024).toFixed(2);

      // Crea un file temporaneo per l'output
      const tempPath = path.join(thumbnailsDir, `temp_${file}`);
      
      // Normalizza l'estensione a .jpg
      const outputFile = file.replace(/\.(jpeg|JPG|JPEG)$/i, '.jpg');
      const outputPath = path.join(thumbnailsDir, outputFile);

      try {
        await sharp(inputPath)
          .resize(1200, 1200, { 
            fit: 'inside',
            withoutEnlargement: true 
          })
          .jpeg({ 
            quality: 85,
            progressive: true,
            mozjpeg: true
          })
          .toFile(tempPath);

        const statsAfter = fs.statSync(tempPath);
        const sizeAfter = (statsAfter.size / 1024).toFixed(2);
        const reduction = ((1 - statsAfter.size / stats.size) * 100).toFixed(1);

        // Sostituisci il file originale
        if (file !== outputFile) {
          // Se cambiamo estensione, rimuovi il file originale
          fs.unlinkSync(inputPath);
        }
        fs.renameSync(tempPath, outputPath);

        console.log(`✓ ${file} → ${outputFile}: ${sizeBefore}KB → ${sizeAfter}KB (-${reduction}%)`);
      } catch (error) {
        console.error(`✗ Error optimizing ${file}:`, error.message);
        // Pulisci il file temporaneo se esiste
        if (fs.existsSync(tempPath)) {
          fs.unlinkSync(tempPath);
        }
      }
    }

    console.log('\n✓ Optimization complete!');
  } catch (error) {
    console.error('Error:', error);
  }
}

optimizeImages();
