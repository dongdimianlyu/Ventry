// Fallback package installer with retries and error handling
const { execSync } = require('child_process');
const fs = require('fs');

// Configuration
const MAX_RETRIES = 5;
const INITIAL_DELAY = 10000; // 10 seconds
const CORE_BABEL_DEPS = [
  '@babel/plugin-transform-private-methods',
  '@babel/plugin-transform-private-property-in-object',
  '@babel/plugin-transform-class-properties',
  '@babel/plugin-transform-class-static-block',
  '@babel/plugin-transform-runtime',
  '@babel/plugin-proposal-do-expressions',
  '@babel/runtime'
];

// Set npm config for better network handling
console.log('Setting npm configuration for reliable network...');
execSync('npm config set registry https://registry.npmjs.org/');
execSync('npm config set fetch-retry-mintimeout 30000');
execSync('npm config set fetch-retry-maxtimeout 300000');
execSync('npm config set fetch-retries 10');
execSync('npm config set network-timeout 300000');
execSync('npm config set timeout 300000');
execSync('npm config set ca null');
execSync('npm config set strict-ssl false');
execSync('npm config set progress false');
execSync('npm config set legacy-peer-deps true');

// Function to run a command with retries
function runWithRetries(command, maxRetries = MAX_RETRIES) {
  let retryCount = 0;
  let delay = INITIAL_DELAY;
  
  while (retryCount < maxRetries) {
    try {
      console.log(`[Attempt ${retryCount + 1}/${maxRetries}] Running: ${command}`);
      execSync(command, { stdio: 'inherit' });
      console.log(`Command succeeded: ${command}`);
      return true;
    } catch (error) {
      console.error(`Attempt ${retryCount + 1} failed: ${error.message}`);
      retryCount++;
      
      if (retryCount < maxRetries) {
        console.log(`Retrying in ${delay/1000} seconds...`);
        // Sleep for delay milliseconds
        execSync(`sleep ${delay/1000}`);
        // Increase delay for next retry (exponential backoff)
        delay *= 2;
      } else {
        console.error(`All ${maxRetries} attempts failed for command: ${command}`);
      }
    }
  }
  
  return false;
}

// Clean up any .babelrc files that might conflict with Next.js
console.log('Cleaning up .babelrc files...');
try {
  execSync('find . -name ".babelrc" -not -path "*/node_modules/*" -delete');
} catch (e) {
  console.warn('Warning when cleaning .babelrc files:', e.message);
}

// Main installation strategy
console.log('Starting package installation...');

// Try regular npm install first
const mainInstallSuccess = runWithRetries('npm install --prefer-offline --no-fund --no-audit --legacy-peer-deps');

// If main install failed, try installing core dependencies individually
if (!mainInstallSuccess) {
  console.log('Regular installation failed, trying individual core packages...');
  const individualSuccess = CORE_BABEL_DEPS.every(dep => {
    return runWithRetries(`npm install --no-save ${dep}`);
  });
  
  if (!individualSuccess) {
    console.error('Failed to install core dependencies individually.');
    process.exit(1);
  }
}

console.log('Package installation completed successfully!'); 