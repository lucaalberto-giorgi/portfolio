import type { MetadataRoute } from "next";

import { SITE_INFO } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    short_name: SITE_INFO.name,
    name: SITE_INFO.name,
    description: SITE_INFO.description,
    icons: [
      {
        src: "/icon",
        type: "image/png",
        sizes: "256x256",
        purpose: "any",
      },
      {
        src: "/icon",
        type: "image/png",
        sizes: "192x192",
        purpose: "any",
      },
      {
        src: "/icon",
        type: "image/png",
        sizes: "512x512",
        purpose: "any",
      },
      {
        src: "/icon",
        type: "image/png",
        sizes: "512x512",
        purpose: "maskable",
      },
    ],
    id: "/?utm_source=pwa",
    start_url: "/?utm_source=pwa",
    display: "standalone",
    scope: "/",
    screenshots: [],
  };
}
