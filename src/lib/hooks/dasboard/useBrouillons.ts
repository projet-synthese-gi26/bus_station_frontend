"use client";
/**
 * useBrouillons.ts  (refait — P-19, Lot 4)
 *
 * Hook pour la page /dashboard/drafts.
 *
 * Changements par rapport à la version précédente :
 *   - N'utilise plus AgencyContext (qui n'est pas alimenté → bug "agenceId vide").
 *   - Récupère l'agence via useBusStation() + getAgencyByChefId(),
 *     même pattern que useDashboardOverview, useDashboardPlanning, etc.
 *   - publierBrouillon appelle maintenant le vrai endpoint backend.
 */

import { useState, useEffect, useMemo, useCallback } from "react";
import toast from "react-hot-toast";
import { useBusStation } from "@/context/Provider";
import { getAgencyByChefId } from "@/lib/services/agency-service";
import {
  getBrouillonsByAgence,
  deleteBrouillon,
  publierBrouillon,
} from "@/lib/services/voyage-brouillon-service";
import type {
  VoyageBrouillon,
  StatutBrouillon,
} from "@/lib/types/voyage.types";

type FiltreStatut = "TOUS" | "INCOMPLET" | "PRET";

export function useBrouillons() {
  const { userData, isLoading: isUserLoading } = useBusStation();

  const [agenceId, setAgenceId] = useState<string | null>(null);
  const [brouillons, setBrouillons] = useState<VoyageBrouillon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtre, setFiltre] = useState<FiltreStatut>("TOUS");

  // ── Récupération de l'agence du chef d'agence connecté ─────────────────
  useEffect(() => {
    if (isUserLoading) return;
    if (!userData?.userId) {
      setError("Utilisateur non connecté.");
      setIsLoading(false);
      return;
    }
    getAgencyByChefId(userData.userId)
      .then((agency) => {
        if (agency?.agencyId) {
          setAgenceId(agency.agencyId);
        } else {
          setError("Aucune agence associée à cet utilisateur.");
          setIsLoading(false);
        }
      })
      .catch(() => {
        setError("Impossible de récupérer votre agence.");
        setIsLoading(false);
      });
  }, [userData, isUserLoading]);

  // ── Chargement des brouillons ────────────────────────────────────────────
  const fetchBrouillons = useCallback(async () => {
    if (!agenceId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getBrouillonsByAgence(agenceId);
      // Exclure CONVERTIS et ANNULÉS de la liste active
      setBrouillons(
        data.filter(
          (b) =>
            b.statutBrouillon !== "CONVERTI" && b.statutBrouillon !== "ANNULE",
        ),
      );
    } catch {
      setError("Impossible de charger les brouillons.");
    } finally {
      setIsLoading(false);
    }
  }, [agenceId]);

  useEffect(() => {
    if (agenceId) fetchBrouillons();
  }, [agenceId, fetchBrouillons]);

  // ── Filtre client-side ──────────────────────────────────────────────────
  const brouillonsFiltres = useMemo(() => {
    if (filtre === "TOUS") return brouillons;
    return brouillons.filter(
      (b) => b.statutBrouillon === (filtre as StatutBrouillon),
    );
  }, [brouillons, filtre]);

  // ── Compteurs par statut ────────────────────────────────────────────────
  const compteurs = useMemo(
    () => ({
      total: brouillons.length,
      incomplet: brouillons.filter((b) => b.statutBrouillon === "INCOMPLET")
        .length,
      pret: brouillons.filter((b) => b.statutBrouillon === "PRET").length,
    }),
    [brouillons],
  );

  // ── Actions ─────────────────────────────────────────────────────────────
  const handlePublier = useCallback(
    async (id: string) => {
      const toastId = toast.loading("Publication en cours...");
      try {
        await publierBrouillon(id);
        toast.success("Voyage publié avec succès !", { id: toastId });
        // Suppression optimiste — le backend ne passe pas le statut à CONVERTI
        setBrouillons((prev) => prev.filter((b) => b.id !== id));
      } catch (e) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const err = e as any;
        const msg =
          err?.response?.status === 400
            ? "Le brouillon n'est pas prêt (ressources manquantes)."
            : "Erreur lors de la publication.";
        toast.error(msg, { id: toastId });
      }
    },
    [fetchBrouillons],
  );

  const handleSupprimer = useCallback(
    async (id: string) => {
      const toastId = toast.loading("Suppression...");
      try {
        await deleteBrouillon(id);
        toast.success("Brouillon supprimé.", { id: toastId });
        await fetchBrouillons();
      } catch {
        toast.error("Erreur lors de la suppression.", { id: toastId });
      }
    },
    [fetchBrouillons],
  );

  return {
    agenceId,
    brouillons: brouillonsFiltres,
    isLoading,
    error,
    filtre,
    setFiltre,
    compteurs,
    handlePublier,
    handleSupprimer,
    refetch: fetchBrouillons,
  };
}
// END OF FILE: src/lib/hooks/dasboard/useBrouillons.ts
