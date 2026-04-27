// src/lib/hooks/useBusStationManagerAccount.ts
import { useState, useEffect } from "react";
import { getBusStationManagerAccount } from "@/lib/services/bus-station-service";
import type { BsmCompte } from "@/lib/types/bsm.types";

export const useBusStationManagerAccount = (busStationId: string) => {
  const [account, setAccount] = useState<BsmCompte | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!busStationId) return;
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await getBusStationManagerAccount(busStationId);
        setAccount(data);
      } catch {
        setError("Failed to fetch bus station manager account");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [busStationId]);

  return { account, loading, error };
};
