import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) {
            return 'three-core';
          }
          if (id.includes('node_modules/@react-three')) {
            return 'react-three';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'ui-icons';
          }
        },
      },
    },
  },
})
