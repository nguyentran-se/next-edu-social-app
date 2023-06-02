/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // pageExtensions: ['page.tsx'],
  //TODO: Remove this on production
  images: {
    domains: ['images.unsplash.com'],
  },
};

module.exports = nextConfig;
