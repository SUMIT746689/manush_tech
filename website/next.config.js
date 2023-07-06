/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'demo.edusofto.com.bd',
        port: '',
        pathname: '/uploads/images/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/files/**',
      },
    ],
  },
  
}

module.exports = nextConfig
