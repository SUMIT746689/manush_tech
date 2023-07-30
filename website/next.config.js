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
      {
        protocol: 'http',
        hostname: '192.168.10.96',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '68.183.93.52',
        port: '3006',
        pathname: '/**',
      },
    ],
  },
  
}

module.exports = nextConfig
