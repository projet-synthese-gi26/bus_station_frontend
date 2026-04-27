"use client";
/**
 * useGareDetails.ts  (remplacé — P-07)
 *
 * Hook pour la page détail d'une gare (/gares-routieres/[id]).
 * Charge en parallèle : gare, agences affiliées, départs.
 */

import { useState, useEffect } from "react";
import {
  getGareById,
  getAgencesByGareId,
  getDepartsByGareId,
} from "@/lib/services/gare-service";
import type { Gare, DepartDuJour } from "@/lib/types/gare.types";
import type { AgenceVoyageFull } from "@/lib/types/agence.types";

export function useGareDetails(gareId: string) {
  const [gare, setGare] = useState<Gare | null>(null);
  const [agences, setAgences] = useState<AgenceVoyageFull[]>([]);
  const [departs, setDeparts] = useState<DepartDuJour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (gareId) fetchFullDetails(gareId);
  }, [gareId]);

  async function fetchFullDetails(id: string) {
    setIsLoading(true);
    setError(null);
    try {
      const [gareData, agencesData, departsData] = await Promise.all([
        getGareById(id),
        getAgencesByGareId(id),
        getDepartsByGareId(id),
      ]);

      if (!gareData) {
        setError("Gare introuvable.");
        return;
      }
      setGare(gareData);
      setAgences(agencesData);
      setDeparts(departsData);
    } catch {
      setError("Erreur lors du chargement des données de la gare.");
    } finally {
      setIsLoading(false);
    }
  }

  return {
    gare,
    agences,
    departs,
    isLoading,
    error,
    refetch: () => fetchFullDetails(gareId),
  };
}
