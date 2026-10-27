import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import enquiryDevApi from './vite-plugins/enquiry-dev-api.js'

export default defineConfig({
  plugins: [react(), tailwindcss(), enquiryDevApi()],
  // three.js is reached only via a dynamic import (Scene3D), so it is split and lazy-loaded.
  build: { chunkSizeWarningLimit: 1400 },
})
