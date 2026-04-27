"use client";
/**
 * useAgencies.ts  (remplacé — P-04)
 *
 * Hook pour la page listing des agences (/agency).
 * Filtre par gare + recherche par nom/localisation.
 */

import { useState, useEffect, useMemo } from "react";
import {
  getAllPublicAgencies,
  getAgencesByGare,
} from "@/lib/services/agency-public-service";
import type { AgenceVoyageFull } from "@/lib/types/agence.types";

export function useAgencies() {
  const [agencies, setAgencies] = useState<AgenceVoyageFull[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGareId, setSelectedGareId] = useState<number | null>(null);

  useEffect(() => {
    fetchAgencies();
  }, [selectedGareId]);

  async function fetchAgencies() {
    setIsLoading(true);
    setError(null);
    try {
      const data = selectedGareId
        ? await getAgencesByGare(selectedGareId)
        : await getAllPublicAgencies();
      setAgencies(data);
    } catch {
      setError("Impossible de charger les agences.");
    } finally {
      setIsLoading(false);
    }
  }

  const filteredAgencies = useMemo(() => {
    if (!searchQuery.trim()) return agencies;
    const q = searchQuery.toLowerCase();
    return agencies.filter(
      (a) =>
        a.longName?.toLowerCase().includes(q) ||
        a.shortName?.toLowerCase().includes(q) ||
        a.location?.toLowerCase().includes(q),
    );
  }, [agencies, searchQuery]);

  return {
    agencies: filteredAgencies,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    selectedGareId,
    setSelectedGareId,
    refetch: fetchAgencies,
  };
}
