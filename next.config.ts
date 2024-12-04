import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "unique-pelican-804.convex.cloud",
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
