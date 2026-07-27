import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://placyhub.com.br",
      lastModified: new Date(),
    },
  ];
}