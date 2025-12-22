import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Ganti dengan nama repository Anda persis seperti di URL GitHub
  base: '/WebGIS-Nunukan/', 
})