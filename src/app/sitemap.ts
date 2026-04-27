import { MetadataRoute } from "next";
import { retrieveAllTrips } from "@/lib/services/trip-service";
const BASE_URL = "http://agence-voyage.ddns.net";

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

  // 2. Pages de voyages dynamiques
  let dynamicTripRoutes: MetadataRoute.Sitemap = [];
  try {
    const tripsResponse = await retrieveAllTrips();
    if (tripsResponse && tripsResponse.content) {
      dynamicTripRoutes = tripsResponse.content.map((trip) => ({
        url: `${BASE_URL}/market-place/trip/${trip.idVoyage}`,
        lastModified: trip.datePublication || new Date().toISOString(),
        changeFrequency: "weekly" as const,
        priority: 0.9,
      }));
    }
  } catch (error) {
    console.error(
      "Erreur lors de la génération du sitemap pour les voyages:",
      error
    );
  }

  return [...staticRoutes, ...dynamicTripRoutes];
}
