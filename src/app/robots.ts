import type { MetadataRoute } from "next";

import { siteShell } from "@/lib/site-shell";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin"],
      },
    ],
    sitemap: `${siteShell.siteUrl}/sitemap.xml`,
  };
}
