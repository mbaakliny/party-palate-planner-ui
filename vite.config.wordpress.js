
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'wordpress-plugin/catering-menu-pro/build',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    },
    lib: {
      entry: path.resolve(__dirname, 'src/main-wordpress.tsx'),
      name: 'CateringMenu',
      formats: ['iife'],
      fileName: () => 'assets/index.js'
    },
    define: {
      global: 'globalThis',
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
})
