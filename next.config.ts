
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Performance optimizations
  reactStrictMode: true,
  compress: true,
  experimental: {
    // Turbopack optimizations
    turbo: {
      // Disable experimental turbopack configurations that might cause issues
      resolveAlias: {
        // Add any necessary aliases here if needed
      }
    }
  },
  // Disable webpack optimizations when using Turbopack
  webpack: process.env.TURBOPACK ? undefined : (config, { isServer }) => {
    if (!isServer) {
      config.optimization.usedExports = true;
      config.optimization.sideEffects = true;
    }
    return config;
  },
  
  // TypeScript and ESLint configurations
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Image optimization
  images: {
    minimumCacheTTL: 60 * 60 * 24 * 7, // 1 week cache
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
};

export default nextConfig;
