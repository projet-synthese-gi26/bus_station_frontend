import { useState, useEffect, useCallback } from "react";
import { LigneService } from "@/lib/types/ligne-service.types";
import { getLignesByAgencyId } from "@/lib/services/planner-trip-service";

interface UsePlannerTripsReturn {
  trips: LigneService[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const usePlannerTrips = (agencyId: string): UsePlannerTripsReturn => {
  const [trips, setTrips] = useState<LigneService[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrips = useCallback(async () => {
    if (!agencyId) { setIsLoading(false); return; }
    setIsLoading(true);
    setError(null);
    try {
      const data = await getLignesByAgencyId(agencyId);
      setTrips(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setIsLoading(false);
    }
  }, [agencyId]);

  useEffect(() => { fetchTrips(); }, [fetchTrips]);

  return { trips, isLoading, error, refetch: fetchTrips };
};