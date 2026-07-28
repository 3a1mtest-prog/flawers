import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The catalogue lives in ../shared so the website and the mobile app read the
  // same data. Turbopack only resolves files under its root, so point the root
  // at the repository rather than at web/.
  turbopack: {
    root: path.join(__dirname, ".."),
  },
};

export default nextConfig;
