import { MetadataRoute } from "next";

const BASE_URL = "http://agence-voyage.ddns.net";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard/", // Bloque l'accès à toutes les pages du dashboard
        "/profil/", // Bloque l'accès aux profils utilisateurs
        "/(customer-view)/my-reservation/", // Bloque l'accès aux réservations personnelles
      ],
    },
    sitemap: `${BASE_URL}/sitemap.xml`, // Indique l'emplacement du sitemap
  };
}
