import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-404',
      closeBundle() {
        // Copy 404.html untuk GitHub Pages SPA routing
        const src = path.resolve(__dirname, '404.html');
        const dest = path.resolve(__dirname, 'dist', '404.html');
        
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, dest);
          console.log('✓ 404.html copied to dist/');
        }
      }
    }
  ],
  
  // PENTING: Ganti 'WebGIS-Nunukan' dengan nama repository GitHub Anda
  // Format: '/nama-repository/'
  base: '/',
  
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    
    // Optimasi bundle size dengan code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'leaflet-vendor': ['leaflet', 'react-leaflet']
        }
      }
    }
  },
  
  // Tambahan untuk fix MIME type issue di GitHub Pages
  assetsInclude: ['**/*.geojson', '**/*.kml', '**/*.tif'],
})