/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: false,
  output: 'standalone',
  
  // Production performance optimizations
  productionBrowserSourceMaps: false,
  
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