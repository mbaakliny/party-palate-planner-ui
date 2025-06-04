
#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('='.repeat(60));
console.log('Building Catering Menu Pro for WordPress...');
console.log('='.repeat(60));

// Function to log with timestamp
function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

// Function to check if a command exists
function commandExists(command) {
  try {
    execSync(`which ${command}`, { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

try {
  // Environment checks
  log('Checking environment...');
  log(`Node version: ${process.version}`);
  log(`Platform: ${process.platform}`);
  log(`Current directory: ${process.cwd()}`);
  
  // Check if required commands exist
  log('Checking required commands...');
  if (!commandExists('npx')) {
    console.error('❌ Error: npx command not found!');
    console.log('Please install Node.js and npm first.');
    process.exit(1);
  }
  log('✅ npx command found');

  // Check if vite.config.wordpress.js exists
  log('Checking configuration files...');
  if (!fs.existsSync('vite.config.wordpress.js')) {
    console.error('❌ Error: vite.config.wordpress.js not found!');
    console.log('Please make sure vite.config.wordpress.js is in your project root.');
    process.exit(1);
  }
  log('✅ vite.config.wordpress.js found');

  // Check if main-wordpress.tsx exists
  if (!fs.existsSync('src/main-wordpress.tsx')) {
    console.error('❌ Error: src/main-wordpress.tsx not found!');
    console.log('Please make sure the WordPress entry file exists.');
    process.exit(1);
  }
  log('✅ src/main-wordpress.tsx found');

  // Check package.json
  if (fs.existsSync('package.json')) {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    log(`Project name: ${packageJson.name || 'unknown'}`);
    log(`Vite dependency: ${packageJson.devDependencies?.vite || packageJson.dependencies?.vite || 'not found'}`);
  }

  // Clean previous build
  const buildPath = path.join('wordpress-plugin', 'catering-menu-pro', 'build');
  log(`Target build path: ${path.resolve(buildPath)}`);
  
  if (fs.existsSync(buildPath)) {
    log('Cleaning previous build...');
    fs.rmSync(buildPath, { recursive: true, force: true });
    log('✅ Previous build cleaned');
  }

  // Ensure build directory exists
  log('Creating build directory...');
  fs.mkdirSync(buildPath, { recursive: true });
  log('✅ Build directory created');

  // Check if vite is available
  log('Checking Vite availability...');
  try {
    execSync('npx vite --version', { stdio: 'pipe' });
    log('✅ Vite is available');
  } catch (error) {
    log('⚠️  Vite version check failed, but continuing...');
    log(`Vite error: ${error.message}`);
  }

  // Run the build command with detailed output
  log('Starting Vite build process...');
  log('Command: npx vite build --config vite.config.wordpress.js');
  
  const buildProcess = spawn('npx', ['vite', 'build', '--config', 'vite.config.wordpress.js'], {
    stdio: ['pipe', 'pipe', 'pipe'],
    env: { 
      ...process.env, 
      NODE_ENV: 'production',
      DEBUG: '*'
    }
  });

  let stdout = '';
  let stderr = '';

  buildProcess.stdout.on('data', (data) => {
    const output = data.toString();
    stdout += output;
    process.stdout.write(output);
  });

  buildProcess.stderr.on('data', (data) => {
    const output = data.toString();
    stderr += output;
    process.stderr.write(output);
  });

  buildProcess.on('close', (code) => {
    log(`Build process exited with code: ${code}`);
    
    if (code !== 0) {
      console.error('❌ Build failed!');
      console.log('\n--- STDOUT ---');
      console.log(stdout || 'No stdout output');
      console.log('\n--- STDERR ---');
      console.log(stderr || 'No stderr output');
      process.exit(1);
    }

    // Check if build was successful
    log('Checking build output...');
    if (fs.existsSync(buildPath)) {
      try {
        const files = fs.readdirSync(buildPath, { recursive: true });
        log('✅ Build completed successfully!');
        log(`Build files created in: ${buildPath}`);
        log('Generated files:');
        files.forEach(file => log(`  - ${file}`));
        
        // Check file sizes
        files.forEach(file => {
          const filePath = path.join(buildPath, file);
          if (fs.statSync(filePath).isFile()) {
            const stats = fs.statSync(filePath);
            log(`  ${file}: ${(stats.size / 1024).toFixed(2)} KB`);
          }
        });
        
        console.log('\n🎉 SUCCESS! Next steps:');
        console.log('1. Zip the wordpress-plugin/catering-menu-pro folder');
        console.log('2. Upload and activate the plugin in WordPress');
        console.log('3. Use [catering_menu] shortcode in any page');
      } catch (dirError) {
        console.error('❌ Error reading build directory:', dirError.message);
      }
    } else {
      console.log('⚠️  Build completed but files not found in expected location');
      log(`Expected path: ${path.resolve(buildPath)}`);
      
      // Check if files were created elsewhere
      const altPaths = ['dist', 'build', 'wordpress-plugin/build'];
      for (const altPath of altPaths) {
        if (fs.existsSync(altPath)) {
          log(`Found files in alternative location: ${altPath}`);
          const files = fs.readdirSync(altPath, { recursive: true });
          files.forEach(file => log(`  - ${file}`));
        }
      }
    }
  });

  buildProcess.on('error', (error) => {
    console.error('❌ Failed to start build process:', error.message);
    log(`Error details: ${JSON.stringify(error, null, 2)}`);
    process.exit(1);
  });

} catch (error) {
  console.error('❌ Build script failed:', error.message);
  log(`Error stack: ${error.stack}`);
  log(`Error details: ${JSON.stringify(error, null, 2)}`);
  process.exit(1);
}
