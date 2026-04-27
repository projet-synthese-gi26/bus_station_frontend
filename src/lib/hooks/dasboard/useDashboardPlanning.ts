"use client";
/**
 * useDashboardPlanning.ts  (nouveau — P-21)
 *
 * Hook pour la page /dashboard/planning.
 * Récupère l'agencyId depuis le contexte AgencyContext (plus de hardcode).
 * Gère le profil agence, les moyens de paiement et les ressources par défaut.
 */

import { useState, useCallback } from "react";
import { useAgency } from "@/lib/contexts/AgencyContext";
import { useBusStation } from "@/context/Provider";
import { getAgencyByChefId } from "@/lib/services/agency-service";
import { updateAgencyDetails } from "@/lib/services/agency-public-service";
import { getPublicAgencyById } from "@/lib/services/agency-public-service";
import type {
  AgenceVoyageFull,
  UpdateAgenceProfilDTO,
  UpdateMoyensPaiementDTO,
  MoyenPaiement,
} from "@/lib/types/agence.types";
import toast from "react-hot-toast";
import { useEffect } from "react";

export function useDashboardPlanning() {
  const { userData } = useBusStation();
  const [agency, setAgency] = useState<AgenceVoyageFull | null>(null);
  const [agencyId, setAgencyId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgency = useCallback(async () => {
    if (!userData?.userId) return;
    setIsLoading(true);
    setError(null);
    try {
      const ag = await getAgencyByChefId(userData.userId);
      if (!ag?.agencyId) {
        setError("Agence introuvable.");
        return;
      }
      setAgencyId(ag.agencyId);
      const full = await getPublicAgencyById(ag.agencyId);
      setAgency(full);
    } catch {
      setError("Erreur lors du chargement de l'agence.");
    } finally {
      setIsLoading(false);
    }
  }, [userData?.userId]);

  useEffect(() => {
    fetchAgency();
  }, [fetchAgency]);

  // ── Sauvegarder le profil public ─────────────────────────────────────────
  const saveProfilPublic = useCallback(
    async (data: UpdateAgenceProfilDTO) => {
      if (!agencyId) return;
      const toastId = toast.loading("Sauvegarde...");
      try {
        await updateAgencyDetails(agencyId, data);
        toast.success("Profil mis à jour !", { id: toastId });
        await fetchAgency();
      } catch {
        toast.error("Erreur lors de la sauvegarde.", { id: toastId });
        throw new Error("save failed");
      }
    },
    [agencyId, fetchAgency],
  );

  // ── Sauvegarder les moyens de paiement ───────────────────────────────────
  const saveMoyensPaiement = useCallback(
    async (moyens: MoyenPaiement[]) => {
      if (!agencyId) return;
      const toastId = toast.loading("Sauvegarde des moyens de paiement...");
      try {
        await updateAgencyDetails(agencyId, { moyensPaiement: moyens } as any);
        toast.success("Moyens de paiement mis à jour !", { id: toastId });
        await fetchAgency();
      } catch {
        toast.error("Erreur lors de la sauvegarde.", { id: toastId });
        throw new Error("save failed");
      }
    },
    [agencyId, fetchAgency],
  );

  return {
    agency,
    agencyId,
    isLoading,
    error,
    refetch: fetchAgency,
    saveProfilPublic,
    saveMoyensPaiement,
  };
}
