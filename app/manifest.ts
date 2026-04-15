import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PulseForge Workout",
    short_name: "PulseForge",
    description: "Premium workout tracking with real-time progression and analytics.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#2563eb",
    icons: [
      {
        src: "/icons/icon-192.svg",
        sizes: "any",
        type: "image/svg+xml"
      },
      {
        src: "/icons/icon-512.svg",
        sizes: "any",
        type: "image/svg+xml"
      }
    ]
  };
}
