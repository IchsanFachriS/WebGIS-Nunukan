import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // PENTING: Ganti 'WebGIS-Nunukan' dengan nama repository GitHub Anda
  // Format: '/nama-repository/'
  base: '/WebGIS-Nunukan/',
  
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
  }
})