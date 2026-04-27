"use client";
/**
 * useAgencyPublicDetails.ts  (remplacé — P-05)
 *
 * Hook pour la page profil public d'une agence /agency/[agencyId].
 * Charge en parallèle : profil agence, voyages publiés, lignes de service (planning).
 * Retourne les nouveaux types de la conception v4.
 */

import { useState, useEffect } from "react";
import {
  getPublicAgencyById,
  getTripsByAgencyId,
} from "@/lib/services/agency-public-service";
import apiClient from "@/lib/api/api-client";
import { API_ROUTES } from "@/lib/config/api.config";
import type { AgenceVoyageFull } from "@/lib/types/agence.types";
import type { VoyagePreviewFull } from "@/lib/types/voyage.types";
import type { LigneService } from "@/lib/types/ligne-service.types";

export function useAgencyPublicDetails(agencyId: string) {
  const [agency, setAgency] = useState<AgenceVoyageFull | null>(null);
  const [trips, setTrips] = useState<VoyagePreviewFull[]>([]);
  const [lignesService, setLignes] = useState<LigneService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (agencyId) fetchDetails(agencyId);
  }, [agencyId]);

  async function fetchDetails(id: string) {
    setIsLoading(true);
    setError(null);
    try {
      const [agencyData, tripsData, lignesData] = await Promise.all([
        getPublicAgencyById(id),
        getTripsByAgencyId(id),
        apiClient
          .get<LigneService[]>(API_ROUTES.planning.byAgence(id))
          .then((r) =>
            Array.isArray(r.data) ? r.data.filter((l) => l.actif) : [],
          )
          .catch(() => [] as LigneService[]),
      ]);

      if (!agencyData) {
        setError("Agence introuvable.");
        return;
      }
      setAgency(agencyData);
      setTrips(tripsData);
      setLignes(lignesData);
    } catch {
      setError("Erreur lors du chargement du profil de l'agence.");
    } finally {
      setIsLoading(false);
    }
  }

  return {
    agency,
    trips,
    lignesService,
    isLoading,
    error,
    refetch: () => fetchDetails(agencyId),
  };
}
