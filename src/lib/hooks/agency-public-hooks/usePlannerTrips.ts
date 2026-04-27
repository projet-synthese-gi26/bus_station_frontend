"use client";
/**
 * usePlannerTrips.ts  (remplacé — P-05)
 *
 * Hook pour charger les lignes de service d'une agence.
 * Retourne LigneService[] au lieu de PlannerTrip[].
 * L'interface de retour est identique pour ne pas casser WeeklySchedule.
 */

import { useState, useEffect, useCallback } from "react";
import { getPlannerTripsByAgencyId } from "@/lib/services/planner-trip-service";
import type { LigneService } from "@/lib/types/ligne-service.types";

interface UsePlannerTripsReturn {
  trips: LigneService[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const usePlannerTrips = (agencyId: string): UsePlannerTripsReturn => {
  const [trips, setTrips] = useState<LigneService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrips = useCallback(async () => {
    if (!agencyId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await getPlannerTripsByAgencyId(agencyId);
      setTrips(data);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Erreur de chargement du planning.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [agencyId]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  return { trips, isLoading, error, refetch: fetchTrips };
};
