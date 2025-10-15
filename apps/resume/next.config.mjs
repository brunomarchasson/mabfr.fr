/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@mabru/ui', '@mabru/auth-client'],
  trailingSlash: true,
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000, // Check for changes every second
      aggregateTimeout: 300, // Delay before rebuilding
    };
    return config;
  },
};

export default nextConfig;
