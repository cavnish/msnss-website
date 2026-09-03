import type { NextConfig } from "next";

// Allow Next/Image and remote media from the configured Supabase project.
const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [];
try {
  if (process.env.SUPABASE_URL) {
    const host = new URL(process.env.SUPABASE_URL).hostname;
    remotePatterns.push({ protocol: "https", hostname: host });
  }
} catch {
  // ignore malformed SUPABASE_URL — media simply won't be whitelisted
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;
