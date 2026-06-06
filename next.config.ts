import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    domains: [], // add if using external images
  },
};

export default nextConfig;