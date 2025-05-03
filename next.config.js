/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: false, // Disable strict mode in development for better performance
  output: 'standalone',
  
  // Completely disable SWC
  swcMinify: false,
  
  // Explicitly configure for Babel usage
  compiler: {
    // Must be set to false when using Babel
    styledComponents: false
  },
  
  experimental: {
    // Force using Babel, not SWC
    forceSwcTransforms: false,
    
    // Disable font optimization since we're using Babel
    fontLoaders: []
  },
  
  // Disable font optimization
  optimizeFonts: false,
  
  // We need to transpile these packages
  transpilePackages: [
    '@firebase', 
    'firebase', 
    'undici'
  ],
  
  // Disable webpack5 features that conflict with our setup
  webpack: (config, { isServer }) => {
    // Avoid issues with private class methods
    config.module.rules.push({
      test: /node_modules[\/\\](firebase|@firebase|undici)[\/\\].+\.m?js$/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false
      }
    });
    
    // Disable source maps to reduce build size
    config.devtool = false;
    
    // Replace firebase imports with empty module
    config.resolve.alias = {
      ...config.resolve.alias,
      // Replace font imports
      'next/font/google': path.resolve(__dirname, './src/lib/empty-module.js'),
      'next/font/local': path.resolve(__dirname, './src/lib/empty-module.js'),
      
      // Replace Firebase imports
      'firebase/app': path.resolve(__dirname, './src/lib/empty-firebase.js'),
      'firebase/auth': path.resolve(__dirname, './src/lib/empty-firebase.js'),
      'firebase/firestore': path.resolve(__dirname, './src/lib/empty-firebase.js'),
      'firebase': path.resolve(__dirname, './src/lib/empty-firebase.js'),
      '@firebase/auth': path.resolve(__dirname, './src/lib/empty-firebase.js'),
      '@firebase/app': path.resolve(__dirname, './src/lib/empty-firebase.js'),
      '@firebase/firestore': path.resolve(__dirname, './src/lib/empty-firebase.js'),
    };
    
    return config;
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig 