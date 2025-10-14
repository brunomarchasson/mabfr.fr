/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@mabru/ui', '@mabru/auth-client'],
  basePath: '/auth',
  trailingSlash: true,
  webpack: (config) => {
    // Enable polling for file changes, which is required for hot-reloading
    // to work reliably in some Docker-on-Windows/Mac setups.
    config.watchOptions = {
      poll: 1000, // Check for changes every second
      aggregateTimeout: 300, // Delay before rebuilding
    };
    return config;
  },
};

export default nextConfig;
