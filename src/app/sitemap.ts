import { MetadataRoute } from "next";

const BASE_URL = "http://agence-voyage.ddns.net";
const API_URL =
  process.env.NEXT_PUBLIC_TRIP_AGENCY_BACKEND_API_URL ??
  "http://localhost:8080";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Pages statiques
  const staticRoutes = [
    "/",
    "/about",
    "/contact-us",
    "/faqs",
    "/login",
    "/register",
    "/market-place",
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: route === "/" ? 1 : 0.8,
  }));

  // 2. Pages de voyages dynamiques (appel direct sans token)
  let dynamicTripRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${API_URL}/voyage?page=0&size=100`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.content) {
        dynamicTripRoutes = data.content.map(
          (trip: { idVoyage: string; datePublication?: string }) => ({
            url: `${BASE_URL}/market-place/trip/${trip.idVoyage}`,
            lastModified: trip.datePublication ?? new Date().toISOString(),
            changeFrequency: "weekly" as const,
            priority: 0.9,
          }),
        );
      }
    }
  } catch (error) {
    console.error("Erreur sitemap voyages:", error);
  }

  return [...staticRoutes, ...dynamicTripRoutes];
}
