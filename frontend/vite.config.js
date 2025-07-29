import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    },
    target: 'es2015',
    minify: 'esbuild', // Changed from terser to esbuild
    sourcemap: false
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
})
