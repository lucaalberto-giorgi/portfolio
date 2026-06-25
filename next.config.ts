import type { NextConfig } from "next";
import path from "path";

const allowedDevOrigins = process.env.ALLOWED_DEV_ORIGINS?.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(allowedDevOrigins?.length ? { allowedDevOrigins } : {}),
  turbopack: {
    root: path.join(__dirname, "."),
  },
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "vercel.app",
        port: "",
      },
      {
        protocol: "https",
        hostname: "api.screenshotone.com",
        port: "",
      },
    ],
    qualities: [75, 100],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            // Prevents MIME type sniffing, reducing the risk of malicious file uploads
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            // Protects against clickjacking attacks by preventing your site from being embedded in iframes.
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            // Controls how much referrer information is included with requests, balancing security and functionality.
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            // Enforces HTTPS connections
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
