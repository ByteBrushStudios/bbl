import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  }
};

export default nextConfig;
