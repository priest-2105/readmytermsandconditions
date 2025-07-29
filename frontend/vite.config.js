import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
