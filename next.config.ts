// next.config.ts
import type { NextConfig } from "next";

// Use dynamic import for CommonJS modules in TypeScript
const withPWA = require("next-pwa");

const config: NextConfig = {
  reactStrictMode: true,
};

// Apply the withPWA wrapper to the config
export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
})(config);
