/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disable strict mode in development for better performance
  output: 'standalone',
  
  // Explicitly configure Babel
  experimental: {
    forceSwcTransforms: false, // Force Babel instead of SWC
  },
  
  // Disable SWC features
  swcMinify: false,
  
  // Disable font optimization since we're using Babel
  optimizeFonts: false,
  
  // Transpile all node_modules
  transpilePackages: ['@firebase', 'firebase', 'undici'],
}

module.exports = nextConfig 