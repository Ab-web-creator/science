import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  // Let other devices on the home network (e.g. Azat's tablet) use the dev
  // server via this Mac's address. Update it if the Mac's address changes.
  allowedDevOrigins: ["192.168.1.70"],
  partialPrefetching: true,
  turbopack: {
    rules: {
      "globals.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
