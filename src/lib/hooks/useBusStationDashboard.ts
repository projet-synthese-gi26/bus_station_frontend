// src/lib/hooks/useBusStationDashboard.ts
/**
 * Hook conservé pour compatibilité avec les anciens composants BSM.
 * Les nouvelles pages utilisent useBsmDashboard (via BsmContext).
 */
import { useState, useEffect } from "react";
import {
  getBusStationDetails,
  getAffiliatedAgencies,
  getAffiliationTaxes,
  type AgencyWithTaxStatus,
  type TripsByDate,
} from "@/lib/services/bus-station-service";
import type { Gare } from "@/lib/types/gare.types";
import type { TaxeAffiliation } from "@/lib/types/bsm.types";

export { AgencyWithTaxStatus };

export const useBusStationDashboard = (stationId: string) => {
  const [station, setStation] = useState<Gare | null>(null);
  const [agencies, setAgencies] = useState<AgencyWithTaxStatus[]>([]);
  const [tripData, setTripData] = useState<TripsByDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!stationId) return;
    const fetch = async () => {
      setLoading(true);
      try {
        const [stationData, agenciesData, taxesData] = await Promise.all([
          getBusStationDetails(stationId),
          getAffiliatedAgencies(stationId),
          getAffiliationTaxes(stationId),
        ]);
        setStation(stationData);

        const taxMap = new Map<string, TaxeAffiliation[]>();
        taxesData.forEach((t) => {
          if (!taxMap.has(t.agenceVoyageId)) taxMap.set(t.agenceVoyageId, []);
          taxMap.get(t.agenceVoyageId)!.push(t);
        });

        setAgencies(
          (agenciesData as any[]).map((a: any) => {
            const taxes = taxMap.get(a.agencyId) ?? [];
            const retard = taxes.find((t) => t.statutPaiement === "EN_RETARD");
            const attente = taxes.find(
              (t) => t.statutPaiement === "EN_ATTENTE",
            );
            return {
              ...a,
              taxStatus: retard ? "en retard" : attente ? "en attente" : "payé",
              taxAmount: retard?.montant ?? attente?.montant,
              taxDueDate: retard?.dateEcheance ?? attente?.dateEcheance,
            };
          }),
        );
        setTripData([]);
      } catch {
        setError("Failed to fetch bus station data");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [stationId]);

  return { station, agencies, tripData, loading, error };
};
