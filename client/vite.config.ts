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

  // Products and banners are managed locally in public/products and public/banners
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

