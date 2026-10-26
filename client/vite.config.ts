import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// Automatically copy uploaded mockup image to public folder for direct high-res serving
const uploadedImgPath = "C:/Users/acer/.gemini/antigravity-ide/brain/e347a522-bcec-40cb-b43d-a6babc8e170c/.user_uploaded/media_1792667897789.jpg";
const latestHeroImgPath = "C:/Users/acer/.gemini/antigravity-ide/brain/e347a522-bcec-40cb-b43d-a6babc8e170c/.user_uploaded/media_1792670208216.jpg";
const publicDir = path.resolve(__dirname, 'public');
try {
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  if (fs.existsSync(uploadedImgPath)) {
    fs.copyFileSync(uploadedImgPath, path.join(publicDir, 'pureva_mockup.jpg'));
  }
  if (fs.existsSync(latestHeroImgPath)) {
    fs.copyFileSync(latestHeroImgPath, path.join(publicDir, 'pureva_hero.jpg'));
    const buf = fs.readFileSync(latestHeroImgPath);
    let width = 0, height = 0;
    for (let i = 0; i < buf.length - 8; i++) {
      if (buf[i] === 0xFF && (buf[i+1] === 0xC0 || buf[i+1] === 0xC2)) {
        height = buf.readUInt16BE(i + 5);
        width = buf.readUInt16BE(i + 7);
        break;
      }
    }
    fs.writeFileSync(path.join(publicDir, 'hero_img_meta.json'), JSON.stringify({ width, height }));
  }

  // Copy high-res artisan product bottle images
  const productImages = {
    'groundnut_oil.jpg': 'C:/Users/acer/.gemini/antigravity-ide/brain/e347a522-bcec-40cb-b43d-a6babc8e170c/groundnut_oil_hero_1792656372186.jpg',
    'sesame_oil.jpg': 'C:/Users/acer/.gemini/antigravity-ide/brain/e347a522-bcec-40cb-b43d-a6babc8e170c/sesame_oil_hero_1792656396143.jpg',
    'coconut_oil.jpg': 'C:/Users/acer/.gemini/antigravity-ide/brain/e347a522-bcec-40cb-b43d-a6babc8e170c/coconut_oil_hero_1792656427573.jpg',
    'sunflower_oil.jpg': 'C:/Users/acer/.gemini/antigravity-ide/brain/e347a522-bcec-40cb-b43d-a6babc8e170c/sunflower_oil_product_1792733088064.jpg',
    'rice_bran_oil.jpg': 'C:/Users/acer/.gemini/antigravity-ide/brain/e347a522-bcec-40cb-b43d-a6babc8e170c/rice_bran_oil_product_1792733112941.jpg',
    'mustard_oil.jpg': 'C:/Users/acer/.gemini/antigravity-ide/brain/157f7baa-e737-4406-9c5a-a6285e7975d6/mustard_oil_packshot_1792997950122.jpg',
    'lamp_oil.jpg': 'C:/Users/acer/.gemini/antigravity-ide/brain/157f7baa-e737-4406-9c5a-a6285e7975d6/lamp_oil_packshot_1792997979164.jpg',
  };
  const productsDir = path.join(publicDir, 'products');
  if (!fs.existsSync(productsDir)) {
    fs.mkdirSync(productsDir, { recursive: true });
  }
  for (const [filename, srcPath] of Object.entries(productImages)) {
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, path.join(productsDir, filename));
    }
  }

  // Copy Gemedible-style full-width hero banners
  const bannersDir = path.join(publicDir, 'banners');
  if (!fs.existsSync(bannersDir)) {
    fs.mkdirSync(bannersDir, { recursive: true });
  }
  const bannerImages = {
    'gemedible_exact_hero_banner.jpg': 'C:/Users/acer/.gemini/antigravity-ide/brain/157f7baa-e737-4406-9c5a-a6285e7975d6/gemedible_bottles_closeup_banner_1792997846092.jpg',
    'groundnut_hero_banner.jpg': 'C:/Users/acer/.gemini/antigravity-ide/brain/157f7baa-e737-4406-9c5a-a6285e7975d6/gemedible_groundnut_banner_1792994963327.jpg',
    'smart_measuring_banner.jpg': 'C:/Users/acer/.gemini/antigravity-ide/brain/157f7baa-e737-4406-9c5a-a6285e7975d6/gemedible_smart_measuring_banner_1792994982125.jpg',
    'sesame_sunflower_banner.jpg': 'C:/Users/acer/.gemini/antigravity-ide/brain/157f7baa-e737-4406-9c5a-a6285e7975d6/gemedible_sesame_sunflower_banner_1792995006397.jpg',
  };
  for (const [filename, srcPath] of Object.entries(bannerImages)) {
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, path.join(bannersDir, filename));
    }
  }
} catch (e) {
  console.error('Failed to copy mockup image:', e);
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
    host: 'localhost'
  }
});

