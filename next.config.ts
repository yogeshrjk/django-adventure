import type { NextConfig } from "next";

// The app now runs as a standard Next.js server. Chapter lessons are
// generated on demand by the /api/level/[levelId] route using GEMINI_API_KEY.
// (The old static-export mode cannot host dynamic API routes.)
const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
