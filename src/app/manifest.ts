import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nijat Aliyev Portfolio",
    short_name: "Nijat Aliyev",
    description: "Portfolio website for Nijat Aliyev.",
    start_url: "/",
    display: "standalone",
    background_color: "#060816",
    theme_color: "#060816",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
