"use client";
/**
 * app/(agency-views)/dashboard/planning/page.tsx  (reconstruit — P-21)
 *
 * Page "Profil & Planning" du dashboard agence.
 * Sections :
 *   1. Informations publiques de l'agence (éditables)
 *   2. Moyens de paiement (éditables)
 *   3. Planning hebdomadaire (WeeklySchedule isEditable=true)
 *      + Bouton "Ajouter créneau" → LigneServiceModal
 *      + Bouton "Générer la semaine" → GenerateSemaineModal
 *      + Menu ⋮ sur chaque créneau → Modifier / Générer voyage / Supprimer
 */

import { useState, useCallback } from "react";
import { Plus, CalendarRange, Frown } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import Loader from "@/modals/Loader";
import EditableAgencyInfo from "@/components/dashboard-planner-page/EditableAgencyInfo";
import EditableMoyensPaiement from "@/components/dashboard-planner-page/EditableMoyensPaiement";
import WeeklySchedule from "@/components/agencies-page-components/WeeklySchedule";
import LigneServiceModal from "@/modals/LigneServiceModal";
import GenerateVoyageModal from "@/modals/GenerateVoyageModal";
import GenerateSemaineModal from "@/modals/GenerateSemaineModal";
import { useDashboardPlanning } from "@/lib/hooks/dasboard/useDashboardPlanning";
import { usePlannerTrips } from "@/lib/hooks/agency-public-hooks/usePlannerTrips";
import {
  createPlannerTrip,
  updatePlannerTrip,
  deletePlannerTrip,
} from "@/lib/services/planner-trip-service";
import { getAllClassVoyagesByAgence } from "@/lib/services/class-voyage-service";
import type {
  LigneService,
  CreateLigneServiceDTO,
} from "@/lib/types/ligne-service.types";
import type { ClassVoyage } from "@/lib/types/generated-api";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { isMoyenPaiementObject } from "@/lib/types/agence.types";

export default function AgencyPlanningPage() {
  const {
    agency,
    agencyId,
    isLoading,
    error,
    saveProfilPublic,
    saveMoyensPaiement,
    refetch,
  } = useDashboardPlanning();

  const { trips: lignes, refetch: refetchLignes } = usePlannerTrips(agencyId);

  // Classes pour les modales
  const [classes, setClasses] = useState<ClassVoyage[]>([]);
  useEffect(() => {
    if (!agencyId) return;
    getAllClassVoyagesByAgence(agencyId)
      .then(setClasses)
      .catch(() => {});
  }, [agencyId]);

  // ── États des modales ────────────────────────────────────────────────────
  const [isLigneModalOpen, setLigneModalOpen] = useState(false);
  const [editingLigne, setEditingLigne] = useState<LigneService | null>(null);
  const [isGenUnitOpen, setGenUnitOpen] = useState(false);
  const [selectedLigne, setSelectedLigne] = useState<LigneService | null>(null);
  const [isGenSemaineOpen, setGenSemaineOpen] = useState(false);

  // ── Actions CRUD LigneService ────────────────────────────────────────────
  const handleCreateLigne = useCallback(
    async (data: CreateLigneServiceDTO) => {
      await createPlannerTrip(data);
      toast.success("Créneau créé !");
      refetchLignes();
      refreshSchedule();   // ← ajouter
    },
    [refetchLignes],
  );

  const handleUpdateLigne = useCallback(
    async (data: CreateLigneServiceDTO) => {
      if (!editingLigne) return;
      await updatePlannerTrip(editingLigne.id, data);
      toast.success("Créneau mis à jour !");
      refetchLignes();
      refreshSchedule();   // ← ajouter
    },
    [editingLigne, refetchLignes],
  );

  const handleDeleteLigne = useCallback(
    async (id: string) => {
      await deletePlannerTrip(id);
      toast.success("Créneau supprimé.");
      refetchLignes();
      refreshSchedule();   // ← ajouter
    },
    [refetchLignes],
  );

  // ── Ouvrir modale génération unitaire depuis WeeklySchedule ─────────────
  // WeeklySchedule appelle onTripClick(entryId) → entryId = "{ligneId}-{JOUR}"
  const handleTripClick = useCallback(
    (entryId: string) => {
      const ligneId = entryId.split("-").slice(0, -1).join("-");
      const ligne = lignes.find((l) => l.id === ligneId);
      if (ligne) {
        setSelectedLigne(ligne);
        setGenUnitOpen(true);
      }
    },
    [lignes],
  );

  const [scheduleKey, setScheduleKey] = useState(0);
  const refreshSchedule = () => setScheduleKey((k) => k + 1);

  // ── États de chargement ──────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-60">
        <Loader message="Chargement de l'agence..." />
      </div>
    );
  }

  if (error || !agency) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Frown className="w-12 h-12 text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-700 mb-2">
          Erreur de chargement
        </h2>
        <p className="text-gray-400 text-sm">
          {error ?? "Agence introuvable."}
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <PageHeader
        title="Profil & Planning"
        subtitle="Gérez les informations publiques de votre agence et votre planning hebdomadaire."
      />

      {/* Section 1 — Informations publiques */}
      <EditableAgencyInfo agency={agency} onSave={saveProfilPublic} />

      {/* Section 2 — Moyens de paiement */}
      <EditableMoyensPaiement
        // ✅ Après
        moyens={(agency.moyensPaiement ?? []).filter(isMoyenPaiementObject)}
        onSave={saveMoyensPaiement}
      />

      {/* Section 3 — Planning */}
      <div className="space-y-3">
        {/* Header planning avec actions */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-800">
              Planning hebdomadaire
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Visible sur votre page publique en lecture seule.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setEditingLigne(null);
                setLigneModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
            >
              <Plus size={14} />
              Ajouter un créneau
            </button>
            <button
              onClick={() => setGenSemaineOpen(true)}
              disabled={lignes.filter((l) => l.actif).length === 0}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-primary rounded-xl hover:bg-primary/90 disabled:opacity-50 transition"
            >
              <CalendarRange size={14} />
              Générer la semaine
            </button>
          </div>
        </div>

        {/* WeeklySchedule en mode éditable */}
        <WeeklySchedule key={scheduleKey} agencyId={agencyId} isEditable={true} />
      </div>

      {/* Modales */}
      <LigneServiceModal
        isOpen={isLigneModalOpen}
        onClose={() => setLigneModalOpen(false)}
        onSave={editingLigne ? handleUpdateLigne : handleCreateLigne}
        agenceVoyageId={agencyId}
        classes={classes}
        initial={editingLigne}
      />

      <GenerateVoyageModal
        isOpen={isGenUnitOpen}
        onClose={() => setGenUnitOpen(false)}
        ligne={selectedLigne}
        agency={agency}
      />

      <GenerateSemaineModal
        isOpen={isGenSemaineOpen}
        onClose={() => setGenSemaineOpen(false)}
        lignes={lignes}
        agency={agency}
        onGenerated={() => {
          refetch();
          refetchLignes();
        }}
      />
    </div>
  );
}
