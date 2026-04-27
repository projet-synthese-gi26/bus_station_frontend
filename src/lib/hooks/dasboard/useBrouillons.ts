"use client";
/**
 * useBrouillons.ts  (nouveau — P-19)
 *
 * Hook pour la page /dashboard/drafts.
 * Charge les brouillons de l'agence connectée, gère les filtres et actions.
 */

import { useState, useEffect, useMemo, useCallback } from "react";
import { useAgency } from "@/lib/contexts/AgencyContext";
import {
  getBrouillonsByAgence,
  deleteBrouillon,
  publierBrouillon,
} from "@/lib/services/voyage-brouillon-service";
import type {
  VoyageBrouillon,
  StatutBrouillon,
} from "@/lib/types/voyage.types";
import toast from "react-hot-toast";

type FiltreStatut = "TOUS" | StatutBrouillon;

export function useBrouillons() {
  const { selectedAgency } = useAgency();
  const agenceId = selectedAgency?.id ?? "";

  const [brouillons, setBrouillons] = useState<VoyageBrouillon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtre, setFiltre] = useState<FiltreStatut>("TOUS");

  // ── Chargement ──────────────────────────────────────────────────────────
  const fetchBrouillons = useCallback(async () => {
    if (!agenceId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getBrouillonsByAgence(agenceId);
      // Exclure les CONVERTIS et ANNULÉS de la liste active
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
    fetchBrouillons();
  }, [fetchBrouillons]);

  // ── Filtre ───────────────────────────────────────────────────────────────
  const brouillonsFiltres = useMemo(() => {
    if (filtre === "TOUS") return brouillons;
    return brouillons.filter((b) => b.statutBrouillon === filtre);
  }, [brouillons, filtre]);

  // ── Compteurs par statut ─────────────────────────────────────────────────
  const compteurs = useMemo(
    () => ({
      total: brouillons.length,
      incomplet: brouillons.filter((b) => b.statutBrouillon === "INCOMPLET")
        .length,
      pret: brouillons.filter((b) => b.statutBrouillon === "PRET").length,
    }),
    [brouillons],
  );

  // ── Actions ──────────────────────────────────────────────────────────────
  const handlePublier = useCallback(
    async (id: string) => {
      const toastId = toast.loading("Publication en cours...");
      try {
        await publierBrouillon(id);
        toast.success("Voyage publié avec succès !", { id: toastId });
        await fetchBrouillons();
      } catch {
        toast.error("Erreur lors de la publication.", { id: toastId });
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
