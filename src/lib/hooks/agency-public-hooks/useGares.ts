"use client";
/**
 * useGares.ts  (nouveau — P-04)
 *
 * Hook simple pour charger la liste des gares.
 * Utilisé dans le filtre de la page /agency et dans /gares-routieres.
 */

import { useState, useEffect } from "react";
import apiClient from "@/lib/api/api-client";
import { API_ROUTES } from "@/lib/config/api.config";
import type { Gare } from "@/lib/types/gare.types";

export function useGares() {
  const [gares, setGares] = useState<Gare[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient
      .get<Gare[]>(API_ROUTES.gare.all)
      .then((res) => setGares(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError("Impossible de charger les gares."))
      .finally(() => setIsLoading(false));
  }, []);

  return { gares, isLoading, error };
}
