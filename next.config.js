/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    // Enable styled-components support
    styledComponents: true,
  },
  // Ensure images from data URLs are allowed
  images: {
    domains: ['localhost'],
    // Allow images from data URLs (e.g., pasted or uploaded images)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
};

module.exports = nextConfig;