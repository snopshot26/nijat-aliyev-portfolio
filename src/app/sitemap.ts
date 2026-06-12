import type { MetadataRoute } from "next";

import { siteShell } from "@/lib/site-shell";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/admin", "/admin/login"];

  return routes.map((route) => ({
    url: `${siteShell.siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route.startsWith("/admin") ? "monthly" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
