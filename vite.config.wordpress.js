
const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react-swc');
const path = require('path');

console.log('[Vite Config] Loading WordPress build configuration...');
console.log('[Vite Config] Current working directory:', process.cwd());
console.log('[Vite Config] Entry file path:', path.resolve(__dirname, 'src/main-wordpress.tsx'));
console.log('[Vite Config] Output directory:', path.resolve(__dirname, 'wordpress-plugin/catering-menu-pro/build'));

module.exports = defineConfig({
  plugins: [
    react({
      // Add some debugging for the React plugin
      devTarget: 'es2022'
    })
  ],
  build: {
    outDir: 'wordpress-plugin/catering-menu-pro/build',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      },
      onwarn(warning, warn) {
        console.log('[Vite Warning]:', warning.message);
        warn(warning);
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
    },
    minify: 'terser',
    sourcemap: false,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  logLevel: 'info'
});

console.log('[Vite Config] Configuration loaded successfully');
