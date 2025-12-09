import type { NextConfig } from "next";
import path from "node:path";

const LOADER = path.resolve(__dirname, "src/visual-edits/component-tagger-loader.js");

const nextConfig: NextConfig = {
  // ✔ Explicitly enable webpack mode
  experimental: {
    webpackBuildWorker: true,
  },

  // ✔ Required: empty Turbopack config to silence warnings
  turbopack: {},

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },

  // ✔ Webpack loader configuration
  webpack: (config) => {
    config.module.rules.push({
      test: /\.[jt]sx?$/,
      use: [
        {
          loader: LOADER,
        },
      ],
    });
    return config;
  },
};

export default nextConfig;
