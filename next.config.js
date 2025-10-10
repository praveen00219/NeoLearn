/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
  images: {
    domains: ['localhost', 'lh3.googleusercontent.com', 'yt3.ggpht.com'],
  },
  experimental: {
    serverComponentsExternalPackages: ['pdfjs-dist'],
  },
  output: 'standalone',
}

module.exports = nextConfig