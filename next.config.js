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
    
    // Make sure we're not using next/font
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'next/font/google': require.resolve('./src/lib/empty-module.js'),
        'next/font/local': require.resolve('./src/lib/empty-module.js'),
      };
    }
    
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