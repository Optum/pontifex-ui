/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:7071/api/:path*' // Proxy to Backend
      }
    ]
  }
}

module.exports = nextConfig
