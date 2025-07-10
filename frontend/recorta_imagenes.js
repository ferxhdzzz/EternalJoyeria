// Script para recortar y hacer zoom a todas las imágenes de /public/Products/ a formato cuadrado (centrado)
// Requiere instalar sharp: npm install sharp

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dir = path.join(__dirname, 'public', 'Products');
const FINAL_SIZE = 600; // tamaño final del lienzo cuadrado (ajusta si quieres más grande o pequeño)
const ZOOM = 1.5; // factor de zoom (1.5 = 150%)

fs.readdirSync(dir).forEach(file => {
  const ext = path.extname(file).toLowerCase();
  if (!['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) return;
  const filePath = path.join(dir, file);
  sharp(filePath)
    .metadata()
    .then(meta => {
      // Calcula el tamaño de recorte con zoom
      const cropSize = Math.floor(Math.min(meta.width, meta.height) / ZOOM);
      const left = Math.floor((meta.width - cropSize) / 2);
      const top = Math.floor((meta.height - cropSize) / 2);
      return sharp(filePath)
        .extract({
          left,
          top,
          width: cropSize,
          height: cropSize
        })
        .resize(FINAL_SIZE, FINAL_SIZE)
        .toFile(filePath + '.tmp')
        .then(() => {
          fs.renameSync(filePath + '.tmp', filePath);
          console.log('Recortada y con zoom:', file);
        });
    })
    .catch(err => console.error('Error con', file, err));
}); 