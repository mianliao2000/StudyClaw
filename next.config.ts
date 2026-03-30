import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "110mb",
    },
  },
  serverExternalPackages: ["pdf-parse", "mammoth"],
};

export default nextConfig;
