import type { NextConfig } from "next";

// Browser-side Supabase calls (admin login, CRUD, image uploads) need the
// Supabase origin whitelisted in connect-src. Derived from the env var so the
// project ref is never hardcoded here.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseHost = supabaseUrl ? new URL(supabaseUrl).hostname : "";

const nextConfig: NextConfig = {
  // Allow next/image to load product photos served from Supabase Storage.
  images: supabaseHost
    ? { remotePatterns: [{ protocol: "https", hostname: supabaseHost }] }
    : undefined,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline'",
              // blob: is needed for local image previews (URL.createObjectURL).
              "img-src 'self' data: blob: https:",
              "font-src 'self'",
              ["connect-src 'self' https://www.google-analytics.com", supabaseUrl]
                .filter(Boolean)
                .join(" "),
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
