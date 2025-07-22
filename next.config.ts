import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React Strict Mode for better error detection
  reactStrictMode: true,

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ]
  },

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    domains: [], // Add any external image domains you use
  },

  // Enable SWC minification (faster than Terser)
  swcMinify: true,

  // Disable powered by header for security
  poweredByHeader: false,
};

export default nextConfig;
