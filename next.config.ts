import type { NextConfig } from "next";
import path from "path";

// Pin the app root. A package-lock.json in the user home otherwise makes
// Next treat that folder as the workspace and fail to resolve local deps.
const projectRoot = path.resolve(process.cwd());

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  outputFileTracingRoot: projectRoot,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
