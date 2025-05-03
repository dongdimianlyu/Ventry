/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disable strict mode in development for better performance
  output: 'standalone',
  
  // Explicitly configure Babel
  compiler: {
    // Disable SWC since we're using Babel
    emotion: false,
  },
  
  // Improve build performance
  swcMinify: true,
  
  // Disable font optimization since we're using Babel
  optimizeFonts: false,
}

module.exports = nextConfig 