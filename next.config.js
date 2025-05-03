/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disable strict mode in development for better performance
  output: 'standalone',
  
  // Improve development performance
  swcMinify: true,
}

module.exports = nextConfig 