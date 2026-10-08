import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  outputFileTracingRoot: path.join(process.cwd()),
  serverExternalPackages: ["better-sqlite3"],
  images: {
    formats: ["image/webp"],
  },
};

export default nextConfig;
