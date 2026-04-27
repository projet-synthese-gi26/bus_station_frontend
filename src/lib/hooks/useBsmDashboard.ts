"use client";
/**
 * useBsmDashboard.ts  (nouveau — P-24 à P-29)
 *
 * Hook central pour toutes les pages BSM.
 * Remplace useBusStationDashboard + usePoliciesAndTaxes + useBusStationManagerAccount.
 * Fini le "gare-001" hardcodé : lit le gareId depuis le compte BSM connecté.
 *
 * Usage :
 *   const bsm = useBsmDashboard();
 *   bsm.gare, bsm.agences, bsm.taxes, bsm.politiques, bsm.alertes, bsm.compte
 */

import { useState, useEffect, useCallback } from "react";
import {
  getBsmGare,
  updateBsmGare,
  getAgencesAffiliees,
  updateStatutAgence,
  getTaxesAffiliation,
  updateStatutTaxe,
  getPolitiquesGare,
  createPolitiqueGare,
  updatePolitiqueGare,
  deletePolitiqueGare,
  getAlertesGare,
  envoyerAlerte,
  getBsmCompte,
  updateBsmCompte,
} from "@/lib/services/bsm-service";
import type { Gare, UpdateGareDTO } from "@/lib/types/gare.types";
import type { AgenceVoyageFull, StatutAgence } from "@/lib/types/agence.types";
import type {
  BsmCompte,
  UpdateBsmCompteDTO,
  TaxeAffiliation,
  UpdateTaxeStatutDTO,
  PolitiqueGare,
  CreatePolitiqueDTO,
  UpdatePolitiqueDTO,
  AlerteAgence,
  CreateAlerteDTO,
} from "@/lib/types/bsm.types";
import toast from "react-hot-toast";

export function useBsmDashboard() {
  const [gare, setGare] = useState<Gare | null>(null);
  const [agences, setAgences] = useState<AgenceVoyageFull[]>([]);
  const [taxes, setTaxes] = useState<TaxeAffiliation[]>([]);
  const [politiques, setPolitiques] = useState<PolitiqueGare[]>([]);
  const [alertes, setAlertes] = useState<AlerteAgence[]>([]);
  const [compte, setCompte] = useState<BsmCompte | null>(null);
  const [gareId, setGareId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Chargement initial ────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const bsmCompte = await getBsmCompte();
      if (!bsmCompte) {
        setError("Compte BSM introuvable.");
        return;
      }
      setCompte(bsmCompte);
      const gid = bsmCompte.gareId;
      setGareId(gid);

      const [gareData, agencesData, taxesData, politiquesData, alertesData] =
        await Promise.all([
          getBsmGare(gid),
          getAgencesAffiliees(gid),
          getTaxesAffiliation(gid),
          getPolitiquesGare(gid),
          getAlertesGare(gid),
        ]);
      setGare(gareData);
      setAgences(agencesData);
      setTaxes(taxesData);
      setPolitiques(politiquesData);
      setAlertes(alertesData);
    } catch (e) {
      setError("Erreur lors du chargement du dashboard BSM.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ── KPIs calculés ─────────────────────────────────────────────────────────
  const kpis = {
    nbAgencesActives: agences.filter((a) => a.statutAgence === "ACTIVE").length,
    nbAgencesSuspendues: agences.filter((a) => a.statutAgence === "SUSPENDUE")
      .length,
    taxesEnRetard: taxes.filter((t) => t.statutPaiement === "EN_RETARD").length,
    alertesNonLues: alertes.filter((a) => !a.lu).length,
  };

  // ── Actions Gare ─────────────────────────────────────────────────────────
  const saveGare = useCallback(
    async (data: UpdateGareDTO) => {
      if (!gareId) return;
      const tid = toast.loading("Mise à jour de la gare...");
      try {
        const updated = await updateBsmGare(gareId, data);
        setGare(updated);
        toast.success("Gare mise à jour !", { id: tid });
      } catch {
        toast.error("Erreur lors de la mise à jour.", { id: tid });
        throw new Error();
      }
    },
    [gareId],
  );

  // ── Actions Agences ───────────────────────────────────────────────────────
  const toggleStatutAgence = useCallback(
    async (agencyId: string, statut: StatutAgence) => {
      const tid = toast.loading(
        statut === "SUSPENDUE" ? "Suspension..." : "Réactivation...",
      );
      try {
        await updateStatutAgence(agencyId, statut);
        setAgences((prev) =>
          prev.map((a) =>
            a.agencyId === agencyId ? { ...a, statutAgence: statut } : a,
          ),
        );
        toast.success(
          statut === "SUSPENDUE" ? "Agence suspendue." : "Agence réactivée.",
          { id: tid },
        );
      } catch {
        toast.error("Erreur lors du changement de statut.", { id: tid });
        throw new Error();
      }
    },
    [],
  );

  const sendAlerte = useCallback(async (data: CreateAlerteDTO) => {
    const tid = toast.loading("Envoi de l'alerte...");
    try {
      const alerte = await envoyerAlerte(data);
      setAlertes((prev) => [alerte, ...prev]);
      toast.success("Alerte envoyée !", { id: tid });
    } catch {
      toast.error("Erreur lors de l'envoi.", { id: tid });
      throw new Error();
    }
  }, []);

  // ── Actions Taxes ─────────────────────────────────────────────────────────
  const marquerTaxePayee = useCallback(async (taxeId: string) => {
    const tid = toast.loading("Mise à jour...");
    try {
      const updated = await updateStatutTaxe(taxeId, {
        statutPaiement: "PAYE",
        datePaiement: new Date().toISOString().split("T")[0],
      });
      setTaxes((prev) => prev.map((t) => (t.idTaxe === taxeId ? updated : t)));
      toast.success("Taxe marquée comme payée.", { id: tid });
    } catch {
      toast.error("Erreur.", { id: tid });
    }
  }, []);

  // ── Actions Politiques ────────────────────────────────────────────────────
  const savePolitique = useCallback(
    async (data: CreatePolitiqueDTO, id?: string) => {
      const tid = toast.loading("Sauvegarde...");
      try {
        if (id) {
          const updated = await updatePolitiqueGare(id, data);
          setPolitiques((prev) =>
            prev.map((p) => (p.idPolitique === id ? updated : p)),
          );
        } else {
          const created = await createPolitiqueGare(data);
          setPolitiques((prev) => [...prev, created]);
        }
        toast.success("Politique sauvegardée !", { id: tid });
      } catch {
        toast.error("Erreur.", { id: tid });
        throw new Error();
      }
    },
    [],
  );

  const supprimerPolitique = useCallback(async (id: string) => {
    const tid = toast.loading("Suppression...");
    try {
      await deletePolitiqueGare(id);
      setPolitiques((prev) => prev.filter((p) => p.idPolitique !== id));
      toast.success("Politique supprimée.", { id: tid });
    } catch {
      toast.error("Erreur.", { id: tid });
    }
  }, []);

  // ── Actions Compte BSM ────────────────────────────────────────────────────
  const saveCompte = useCallback(async (data: UpdateBsmCompteDTO) => {
    const tid = toast.loading("Mise à jour du compte...");
    try {
      const updated = await updateBsmCompte(data);
      setCompte(updated);
      toast.success("Compte mis à jour !", { id: tid });
    } catch {
      toast.error("Erreur.", { id: tid });
      throw new Error();
    }
  }, []);

  return {
    // Données
    gare,
    agences,
    taxes,
    politiques,
    alertes,
    compte,
    gareId,
    kpis,
    // État
    isLoading,
    error,
    refetch: fetchAll,
    // Actions
    saveGare,
    toggleStatutAgence,
    sendAlerte,
    marquerTaxePayee,
    savePolitique,
    supprimerPolitique,
    saveCompte,
  };
}
