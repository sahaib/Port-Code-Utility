import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '../public');

async function generateFavicons() {
  try {
    // Read the base SVG
    const svgBuffer = await fs.readFile(path.join(PUBLIC_DIR, 'base-icon.svg'));
    
    // Generate PNGs of different sizes
    const sizes = {
      'favicon-16x16.png': 16,
      'favicon-32x32.png': 32,
      'apple-touch-icon.png': 180,
      'android-chrome-192x192.png': 192,
      'android-chrome-512x512.png': 512
    };

    // Generate each size
    for (const [filename, size] of Object.entries(sizes)) {
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(path.join(PUBLIC_DIR, filename));
      
      console.log(`✅ Generated ${filename}`);
    }

    // Generate ICO file (contains multiple sizes)
    const icoSizes = [16, 32, 48];
    const icoBuffers = await Promise.all(
      icoSizes.map(size => 
        sharp(svgBuffer)
          .resize(size, size)
          .png()
          .toBuffer()
      )
    );

    // Use the first buffer as favicon.ico (16x16)
    await fs.writeFile(
      path.join(PUBLIC_DIR, 'favicon.ico'),
      icoBuffers[0]
    );
    
    console.log('✅ Generated favicon.ico');
    console.log('🎉 All favicon assets generated successfully!');

  } catch (error) {
    console.error('❌ Error generating favicons:', error);
    process.exit(1);
  }
}

generateFavicons(); 