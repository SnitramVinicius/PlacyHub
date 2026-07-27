import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/anfitriao",
        "/admin",
        "/perfil",
      ],
    },
    sitemap:
       "https://placyhub.com.br/sitemap.xml",
  };
}