/** @type {import('next').NextConfig} */
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
    'undici', 
    '@mui', 
    'framer-motion'
  ],
  
  // Disable webpack5 features that conflict with our setup
  webpack: (config) => {
    // Avoid issues with private class methods
    config.module.rules.push({
      test: /node_modules[\/\\](firebase|@firebase)[\/\\].+\.m?js$/,
      resolve: {
        fullySpecified: false
      }
    });
    
    return config;
  }
}

module.exports = nextConfig 