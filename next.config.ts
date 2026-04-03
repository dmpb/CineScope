import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Playwright usa 127.0.0.1; Next.js 16 bloquea HMR cross-origin sin esto en `next dev`. */
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org"
      }
    ]
  }
};

export default nextConfig;
