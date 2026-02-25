import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // C'est ici que Google stocke les photos
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
