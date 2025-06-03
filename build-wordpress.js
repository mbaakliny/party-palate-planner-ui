
#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Building Catering Menu Pro for WordPress...');

try {
  // Check if vite.config.wordpress.js exists
  if (!fs.existsSync('vite.config.wordpress.js')) {
    console.error('Error: vite.config.wordpress.js not found!');
    console.log('Please make sure vite.config.wordpress.js is in your project root.');
    process.exit(1);
  }

  // Check if main-wordpress.tsx exists
  if (!fs.existsSync('src/main-wordpress.tsx')) {
    console.error('Error: src/main-wordpress.tsx not found!');
    console.log('Please make sure the WordPress entry file exists.');
    process.exit(1);
  }

  // Run the build command
  console.log('Running Vite build...');
  execSync('npx vite build --config vite.config.wordpress.js', { stdio: 'inherit' });

  // Check if build was successful
  const buildPath = path.join('wordpress-plugin', 'catering-menu-pro', 'build');
  if (fs.existsSync(buildPath)) {
    console.log('✅ Build completed successfully!');
    console.log(`Build files created in: ${buildPath}`);
    console.log('\nNext steps:');
    console.log('1. Zip the wordpress-plugin/catering-menu-pro folder');
    console.log('2. Upload and activate the plugin in WordPress');
    console.log('3. Use [catering_menu] shortcode in any page');
  } else {
    console.log('⚠️  Build completed but files not found in expected location');
  }

} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
