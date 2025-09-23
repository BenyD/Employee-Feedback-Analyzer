import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Employee Feedback Analyzer - Text Analytics Demo",
    short_name: "Feedback Analyzer",
    description:
      "A comprehensive demonstration of Text Analytics and Natural Language Processing techniques in employee feedback analysis",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#3B82F6",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
    categories: ["education", "productivity", "utilities"],
    lang: "en",
    orientation: "portrait-primary",
  };
}
