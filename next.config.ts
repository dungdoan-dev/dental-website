import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "**.supabase.co", pathname: "/storage/v1/object/public/site-media/**" },
    ],
  },
};

export default function config(phase: string): NextConfig {
  return {
    ...nextConfig,
    // Separate dev files from production output to avoid Windows file locks.
    distDir: process.env.NEXT_BUILD_DIR || (phase === PHASE_DEVELOPMENT_SERVER ? ".next" : ".next-production"),
  };
}
