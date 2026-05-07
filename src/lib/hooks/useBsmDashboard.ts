"use client";
/**
 * useBsmDashboard.ts  (recâblé — Bloc BSM)
 * Emplacement : src/lib/hooks/useBsmDashboard.ts
 *
 * Changements par rapport à l'ancien hook :
 *  - Utilise getBsmStatistiques() → GET /bsm/statistiques/{gareId}
 *    pour les KPIs au lieu de les calculer côté client
 *  - Utilise getBsmCompte() → GET /bsm/profil (nouveau endpoint)
 *  - Tous les services importés depuis bsm-service.ts recâblé
 *  - Pattern identique au reste du projet : catch → fallback silencieux
 */

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import {
  getBsmCompte,
  getBsmGare,
  getBsmStatistiques,
  getAgencesAffiliees,
  getTaxesAffiliation,
  getPolitiquesGare,
  getAlertesGare,
  updateBsmGare,
  updateStatutAgence,
  envoyerAlerte,
  marquerTaxePayee as marquerTaxePayeeService,
  creerTaxeAffiliation,
  creerPolitiqueGare,
  updatePolitiqueGare,
  supprimerPolitiqueGare,
  updateBsmCompte,
  type BsmStatistiques,
} from "@/lib/services/bsm-service";
import type { Gare, UpdateGareDTO } from "@/lib/types/gare.types";
import type { AgenceVoyageFull, StatutAgence } from "@/lib/types/agence.types";
import type {
  TaxeAffiliation,
  PolitiqueGare,
  AlerteAgence,
  BsmCompte,
  UpdateBsmCompteDTO,
  CreateAlerteDTO,
  CreatePolitiqueDTO,
  UpdatePolitiqueDTO,
  CreateTaxeDTO,
} from "@/lib/types/bsm.types";
import { getGares } from "@/lib/services/gare-service";

export function useBsmDashboard() {
  // ── État principal ────────────────────────────────────────────────────────
  const [gare, setGare] = useState<Gare | null>(null);
  const [agences, setAgences] = useState<AgenceVoyageFull[]>([]);
  const [taxes, setTaxes] = useState<TaxeAffiliation[]>([]);
  const [politiques, setPolitiques] = useState<PolitiqueGare[]>([]);
  const [alertes, setAlertes] = useState<AlerteAgence[]>([]);
  const [compte, setCompte] = useState<BsmCompte | null>(null);
  const [statistiques, setStatistiques] = useState<BsmStatistiques | null>(
    null,
  );
  const [gareId, setGareId] = useState<string | number | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── KPIs : priorité aux stats backend, fallback calcul client ─────────────
  const kpis = statistiques
    ? {
        nbAgencesActives: statistiques.nbAgencesActives,
        nbAgencesSuspendues:
          statistiques.nbAgencesAffiliees - statistiques.nbAgencesActives,
        taxesEnRetard: taxes.filter((t) => t.statutPaiement === "EN_RETARD")
          .length,
        alertesNonLues: alertes.filter((a) => !a.lu).length,
        nbVoyagesAujourdhui: statistiques.nbVoyagesAujourdhui,
        nbVoyagesAVenir: statistiques.nbVoyagesAVenir,
        tauxRemplissage: statistiques.tauxRemplissageMoyen,
      }
    : {
        // Fallback : calcul client si l'endpoint stats est indisponible
        nbAgencesActives: agences.filter((a) => a.statutAgence === "ACTIVE")
          .length,
        nbAgencesSuspendues: agences.filter(
          (a) => a.statutAgence === "SUSPENDUE",
        ).length,
        taxesEnRetard: taxes.filter((t) => t.statutPaiement === "EN_RETARD")
          .length,
        alertesNonLues: alertes.filter((a) => !a.lu).length,
        nbVoyagesAujourdhui: 0,
        nbVoyagesAVenir: 0,
        tauxRemplissage: 0,
      };

  // ── Chargement initial ────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Récupérer le profil BSM pour obtenir le gareId
      const bsmCompte = await getBsmCompte();
      if (!bsmCompte) {
        setError("Profil BSM introuvable. Vérifiez votre connexion.");
        setIsLoading(false);
        return;
      }
      setCompte(bsmCompte);
      let gid: number | string = bsmCompte.gareId;

      if (!gid || gid === 0) {
        const toutesLesGares = await getGares({ size: 100 });

        let gareMatch = toutesLesGares.find(
          (g) => g.managerId === bsmCompte.userId,
        );

        if (!gareMatch && bsmCompte.username) {
          const code = bsmCompte.username.replace(/^bsm_/i, "").toLowerCase();
          gareMatch = toutesLesGares.find((g) =>
            g.nom.toLowerCase().includes(code),
          );
        }

        if (!gareMatch && bsmCompte.email) {
          const domainCode = bsmCompte.email
            .split("@")[1]
            ?.split(".")[0]
            ?.replace(/^gare-/i, "")
            .toLowerCase();
          if (domainCode) {
            gareMatch = toutesLesGares.find((g) =>
              g.nom.toLowerCase().includes(domainCode),
            );
          }
        }

        if (gareMatch) {
          gid = gareMatch.idGare;
          console.log("[useBsmDashboard] gare résolue:", gareMatch.nom, "→", gid);
        } else {
          setError("Aucune gare associée à ce compte BSM.");
          setIsLoading(false);
          return;
        }
      }
      setGareId(gid);

      // 2. Charger toutes les données en parallèle
      const [
        gareData,
        statsData,
        agencesData,
        taxesData,
        politiquesData,
        alertesData,
      ] = await Promise.all([
        getBsmGare(gid),
        getBsmStatistiques(gid),
        getAgencesAffiliees(gid),
        getTaxesAffiliation(gid),
        getPolitiquesGare(gid),
        getAlertesGare(gid),
      ]);

      setGare(gareData);
      setStatistiques(statsData);
      setAgences(agencesData);
      setTaxes(taxesData);
      setPolitiques(politiquesData);
      setAlertes(alertesData);
    } catch {
      setError("Erreur lors du chargement du dashboard BSM.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ── Actions Gare ──────────────────────────────────────────────────────────
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
        throw new Error("saveGare failed");
      }
    },
    [gareId],
  );

  // ── Actions Agences ───────────────────────────────────────────────────────
  const toggleStatutAgence = useCallback(
    async (agencyId: string, statut: StatutAgence) => {
      const label = statut === "SUSPENDUE" ? "Suspension" : "Réactivation";
      const tid = toast.loading(`${label} en cours...`);
      try {
        await updateStatutAgence(agencyId, statut);
        // Mise à jour optimiste locale
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
        throw new Error("toggleStatutAgence failed");
      }
    },
    [],
  );

  // ── Actions Alertes ───────────────────────────────────────────────────────
  const sendAlerte = useCallback(async (data: CreateAlerteDTO) => {
    const tid = toast.loading("Envoi de l'alerte...");
    try {
      const alerte = await envoyerAlerte(data);
      setAlertes((prev) => [alerte, ...prev]);
      toast.success("Alerte envoyée !", { id: tid });
    } catch {
      toast.error("Erreur lors de l'envoi.", { id: tid });
      throw new Error("sendAlerte failed");
    }
  }, []);

  // ── Actions Taxes ─────────────────────────────────────────────────────────
  const marquerTaxePayee = useCallback(async (taxeId: string) => {
    const tid = toast.loading("Mise à jour du statut...");
    try {
      await marquerTaxePayeeService(taxeId);
      setTaxes((prev) =>
        prev.map((t) =>
          t.idTaxe === taxeId ? { ...t, statutPaiement: "PAYE" } : t,
        ),
      );
      toast.success("Taxe marquée comme payée.", { id: tid });
    } catch {
      toast.error("Erreur.", { id: tid });
      throw new Error("marquerTaxePayee failed");
    }
  }, []);

  // ── Actions Taxes ─────────────────────────────────────────────────────────
  const creerTaxe = useCallback(async (data: CreateTaxeDTO) => {
    const tid = toast.loading("Création de la taxe...");
    try {
      const taxe = await creerTaxeAffiliation(data);
      setTaxes((prev) => [taxe, ...prev]);
      toast.success("Taxe créée !", { id: tid });
    } catch {
      toast.error("Erreur lors de la création.", { id: tid });
      throw new Error("creerTaxe failed");
    }
  }, []);

  // ── Actions Politiques ────────────────────────────────────────────────────
  const savePolitique = useCallback(
    async (
      data:
        | CreatePolitiqueDTO
        | (UpdatePolitiqueDTO & { idPolitique?: string }),
    ) => {
      const tid = toast.loading("Sauvegarde de la politique...");
      try {
        if ("idPolitique" in data && data.idPolitique) {
          const { idPolitique, ...rest } = data as UpdatePolitiqueDTO & {
            idPolitique: string;
          };
          const updated = await updatePolitiqueGare(idPolitique, rest);
          setPolitiques((prev) =>
            prev.map((p) => (p.idPolitique === idPolitique ? updated : p)),
          );
        } else {
          const created = await creerPolitiqueGare(data as CreatePolitiqueDTO);
          setPolitiques((prev) => [created, ...prev]);
        }
        toast.success("Politique sauvegardée !", { id: tid });
      } catch {
        toast.error("Erreur lors de la sauvegarde.", { id: tid });
        throw new Error("savePolitique failed");
      }
    },
    [],
  );

  const supprimerPolitique = useCallback(async (id: string) => {
    const tid = toast.loading("Suppression...");
    try {
      await supprimerPolitiqueGare(id);
      setPolitiques((prev) => prev.filter((p) => p.idPolitique !== id));
      toast.success("Politique supprimée.", { id: tid });
    } catch {
      toast.error("Erreur.", { id: tid });
      throw new Error("supprimerPolitique failed");
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
      throw new Error("saveCompte failed");
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
    statistiques,
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
    creerTaxe,
    savePolitique,
    supprimerPolitique,
    saveCompte,
  };
}
