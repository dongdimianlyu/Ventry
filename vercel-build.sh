#!/bin/bash

# Set maximum number of retry attempts
MAX_RETRIES=5
RETRY_COUNT=0
RETRY_DELAY=15

echo "Setting up npm configuration for network resilience..."
npm config set registry https://registry.npmjs.org/
npm config set fetch-retry-mintimeout 30000
npm config set fetch-retry-maxtimeout 300000
npm config set fetch-retries 10
npm config set network-timeout 300000
npm config set timeout 300000
npm config set ca null
npm config set strict-ssl false
npm config set progress false

# Function to run npm install with retries
run_npm_install() {
  echo "Running npm install (attempt $((RETRY_COUNT+1)) of $MAX_RETRIES)..."
  npm install --prefer-offline --legacy-peer-deps --no-fund --no-audit
  return $?
}

# Remove any .babelrc files that might cause conflicts
echo "Cleaning up .babelrc files..."
find . -name '.babelrc' -not -path '*/node_modules/*' -delete

# Retry npm install until it succeeds or MAX_RETRIES is reached
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  run_npm_install
  
  if [ $? -eq 0 ]; then
    echo "npm install successful!"
    break
  else
    RETRY_COUNT=$((RETRY_COUNT+1))
    
    if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
      echo "npm install failed. Retrying in $RETRY_DELAY seconds..."
      sleep $RETRY_DELAY
      # Increase the delay exponentially for next retry
      RETRY_DELAY=$((RETRY_DELAY*2))
    else
      echo "All retry attempts failed. Exiting..."
      exit 1
    fi
  fi
done

# Install Babel plugins needed for the build
echo "Installing Babel plugins..."
npm install --save-dev \
  @babel/plugin-transform-private-methods \
  @babel/plugin-transform-private-property-in-object \
  @babel/plugin-transform-class-properties \
  @babel/plugin-transform-class-static-block \
  @babel/plugin-transform-runtime \
  @babel/plugin-proposal-do-expressions \
  @babel/runtime

# Run the build with environment variables
echo "Starting build process..."
DISABLE_ESLINT_PLUGIN=true NEXT_DISABLE_SOURCEMAPS=true NODE_OPTIONS='--max-old-space-size=4096' npm run build --no-lint 