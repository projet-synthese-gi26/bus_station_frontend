// src/lib/hooks/usePoliciesAndTaxes.ts
import { useState, useEffect } from "react";
import { getPoliciesAndTaxes } from "@/lib/services/bus-station-service";
import type { PolitiqueGare } from "@/lib/types/bsm.types";

export const usePoliciesAndTaxes = (stationId: string) => {
  const [policiesAndTaxes, setPoliciesAndTaxes] = useState<PolitiqueGare[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!stationId) return;
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await getPoliciesAndTaxes(stationId);
        setPoliciesAndTaxes(data);
      } catch {
        setError("Failed to fetch policies and taxes");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [stationId]);

  return { policiesAndTaxes, loading, error };
};
