// src/lib/hooks/agency-public-hooks/usePlannerTrips.ts

import { useState, useEffect, useCallback } from "react";
import { PlannerTrip } from "@/lib/types/models/Trip";
import { getPlannerTripsByAgencyId } from "@/lib/services/planner-trip-service";

interface UsePlannerTripsReturn {
  trips: PlannerTrip[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch and manage planner trips for a specific agency.
 *
 * BLOC 4 : la signature est inchangée mais en interne le service appelle
 * désormais le vrai backend `/ligne-service` (et plus le mock JSON-server).
 *
 * @param agencyId - The ID of the agency.
 * @returns An object containing the trips, loading state, and error state.
 */
export const usePlannerTrips = (agencyId: string): UsePlannerTripsReturn => {
  const [trips, setTrips] = useState<PlannerTrip[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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
      const errorMessage =
        e instanceof Error ? e.message : "An unknown error occurred";
      console.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [agencyId]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  return { trips, isLoading, error, refetch: fetchTrips };
};
// END OF FILE: src/lib/hooks/agency-public-hooks/usePlannerTrips.ts
