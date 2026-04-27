"use client";
/**
 * useGaresRoutieres.ts  (remplacé — P-06)
 *
 * Hook pour la page listing des gares (/gares-routieres).
 * Retourne les gares filtrées par recherche texte + filtre par services.
 */

import { useState, useEffect, useMemo } from "react";
import { getAllGares } from "@/lib/services/gare-service";
import type { Gare } from "@/lib/types/gare.types";

export function useGaresRoutieres() {
  const [gares, setGares] = useState<Gare[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  useEffect(() => {
    fetchGares();
  }, []);

  async function fetchGares() {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllGares();
      setGares(data);
    } catch {
      setError("Impossible de charger les gares routières.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleServiceToggle = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service],
    );
  };

  const filteredGares = useMemo(() => {
    return gares.filter((g) => {
      const q = searchQuery.toLowerCase();
      const matchesQuery =
        !q ||
        g.nom.toLowerCase().includes(q) ||
        g.ville.toLowerCase().includes(q) ||
        (g.quartier ?? "").toLowerCase().includes(q);

      const matchesServices =
        selectedServices.length === 0 ||
        selectedServices.every((s) => (g.services ?? []).includes(s));

      return matchesQuery && matchesServices;
    });
  }, [gares, searchQuery, selectedServices]);

  // Tous les services uniques déduits des données
  const allServices = useMemo(
    () => Array.from(new Set(gares.flatMap((g) => g.services ?? []))),
    [gares],
  );

  return {
    gares: filteredGares,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    selectedServices,
    handleServiceToggle,
    allServices,
    refetch: fetchGares,
  };
}
