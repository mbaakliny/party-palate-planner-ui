
const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react-swc');
const path = require('path');

module.exports = defineConfig({
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
      fileName: () => 'index.js'
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
});
