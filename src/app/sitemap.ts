import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://placyhub.netlify.app",
      lastModified: new Date(),
    },
  ];
}