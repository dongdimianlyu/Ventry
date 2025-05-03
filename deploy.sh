#!/bin/bash

echo "Cleaning up previous build files..."
rm -rf .next node_modules package-lock.json

echo "Installing dependencies..."
npm install --legacy-peer-deps

echo "Building application..."
npm run build

echo "Build complete! Ready for deployment." 