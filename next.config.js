/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  experimental: {
    serverMinification: false,
  },
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
