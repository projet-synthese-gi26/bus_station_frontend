"use client";
// src/components/agencies-page-components/WeeklySchedule.tsx
/**
 * WeeklySchedule mis à jour.
 * - usePlannerTrips retourne maintenant LigneService[]
 * - On mappe LigneService → PlannerEntry (type interne avec id: string)
 * - Les sous-composants (Timeline, List, Header, Footer) utilisent PlannerEntry
 */

import React, { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { usePlannerTrips } from "@/lib/hooks/agency-public-hooks/usePlannerTrips";
import {
  createPlannerTrip,
  deletePlannerTrip,
} from "@/lib/services/planner-trip-service";
import type {
  LigneService,
  JourSemaine,
} from "@/lib/types/ligne-service.types";
import type { PlannerEntry } from "./weekly-schedule/DraggableTrip";

import WeeklyScheduleHeader from "./weekly-schedule/WeeklyScheduleHeader";
import WeeklyScheduleTimeline from "./weekly-schedule/WeeklyScheduleTimeline";
import WeeklyScheduleList from "./weekly-schedule/WeeklyScheduleList";
import WeeklyScheduleFooter from "./weekly-schedule/WeeklyScheduleFooter";
import AddTripModal from "@/modals/AddTripModal";
import ConfirmActionModal from "@/modals/ConfirmActionModal";
import Loader from "@/modals/Loader";
import toast from "react-hot-toast";

// ── Mapping JourSemaine → numéro ────────────────────────────────────────────
const JOUR_TO_NUM: Record<JourSemaine, number> = {
  LUNDI: 1,
  MARDI: 2,
  MERCREDI: 3,
  JEUDI: 4,
  VENDREDI: 5,
  SAMEDI: 6,
  DIMANCHE: 7,
};

function ligneToEntries(ligne: LigneService): PlannerEntry[] {
  return (ligne.joursOperation ?? []).map((jour) => ({
    id: `${ligne.id}-${jour}`,
    agencyId: ligne.agenceVoyageId,
    title: `${ligne.lieuDepart} → ${ligne.lieuArrive}`,
    dayOfWeek: JOUR_TO_NUM[jour],
    startTime: ligne.heureDepart,
    endTime: ligne.heureArrivee,
    category: ligne.nomClasse ?? ligne.classVoyageId ?? "Standard",
    _ligneServiceId: ligne.id,
  }));
}

const timeToMinutes = (t: string) => {
  if (!t) return 0;
  const [h, m] = t.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
};

interface WeeklyScheduleProps {
  agencyId: string;
  isEditable?: boolean;
}

export default function WeeklySchedule({
  agencyId,
  isEditable = false,
}: WeeklyScheduleProps) {
  const {
    trips: lignes,
    isLoading,
    error,
    refetch,
  } = usePlannerTrips(agencyId);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const router = useRouter();

  const daysOfWeek = useMemo(
    () => [
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
      "Dimanche",
    ],
    [],
  );
  const hours = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}h`),
    [],
  );

  // Convertir LigneService[] → PlannerEntry[]
  const allEntries = useMemo<PlannerEntry[]>(
    () => lignes.flatMap(ligneToEntries),
    [lignes],
  );

  const allCategories = useMemo(
    () => [...new Set(allEntries.map((e) => e.category))].filter(Boolean),
    [allEntries],
  );

  const filteredEntries = useMemo(
    () =>
      activeFilters.length > 0
        ? allEntries.filter((e) => activeFilters.includes(e.category))
        : allEntries,
    [allEntries, activeFilters],
  );

  const dailySchedules = useMemo<PlannerEntry[][][]>(
    () =>
      daysOfWeek.map((_, dayIndex) => {
        const dayEntries = filteredEntries
          .filter((e) => e.dayOfWeek === dayIndex + 1)
          .sort(
            (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime),
          );
        const lanes: PlannerEntry[][] = [];
        dayEntries.forEach((entry) => {
          let placed = false;
          for (const lane of lanes) {
            const last = lane[lane.length - 1];
            if (
              last &&
              timeToMinutes(entry.startTime) >= timeToMinutes(last.endTime)
            ) {
              lane.push(entry);
              placed = true;
              break;
            }
          }
          if (!placed) lanes.push([entry]);
        });
        return lanes;
      }),
    [filteredEntries, daysOfWeek],
  );

  const maxOverlapsPerDay = useMemo(
    () => dailySchedules.map((lanes) => lanes.length),
    [dailySchedules],
  );

  const handleFilterToggle = (category: string) => {
    setActiveFilters((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const handleDeleteRequest = useCallback((entryId: string) => {
    setSelectedEntryId(entryId);
    setIsDeleteModalOpen(true);
  }, []);

  const handleConfirmDelete = async () => {
    if (!selectedEntryId) return;
    // entryId = "{ligneId}-{JOUR}" → extraire l'ID de la LigneService
    const ligneId = selectedEntryId.includes("-")
      ? selectedEntryId.split("-").slice(0, -1).join("-")
      : selectedEntryId;
    toast.loading("Suppression...");
    try {
      await deletePlannerTrip(ligneId);
      toast.dismiss();
      toast.success("Créneau supprimé !");
      setIsDeleteModalOpen(false);
      setSelectedEntryId(null);
      refetch();
    } catch {
      toast.dismiss();
      toast.error("Erreur lors de la suppression.");
    }
  };

  const handleTripClick = useCallback(
    (entryId: string) => {
      if (!isEditable) {
        router.push(`/market-place/trip/${entryId}`);
      }
    },
    [isEditable, router],
  );

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader message="Chargement du planning..." />
      </div>
    );
  if (error)
    return <div className="text-red-500 text-center p-4">Erreur : {error}</div>;

  return (
    <>
      <div className="bg-white shadow-xl rounded-2xl w-full mx-auto font-sans">
        <WeeklyScheduleHeader
          allCategories={allCategories}
          activeFilters={activeFilters}
          onFilterToggle={handleFilterToggle}
          onAddRequest={isEditable ? () => setIsAddModalOpen(true) : undefined}
        />
        <WeeklyScheduleList
          daysOfWeek={daysOfWeek}
          dailySchedules={dailySchedules}
        />
        <WeeklyScheduleTimeline
          daysOfWeek={daysOfWeek}
          hours={hours}
          dailySchedules={dailySchedules}
          maxOverlapsPerDay={maxOverlapsPerDay}
          refetch={refetch}
          isEditable={isEditable}
          onDeleteRequest={handleDeleteRequest}
          onTripClick={handleTripClick}
        />
        <WeeklyScheduleFooter
          tripCount={filteredEntries.length}
          isEditable={isEditable}
        />
      </div>

      {isEditable && (
        <>
          <AddTripModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSave={async (data) => {
              await createPlannerTrip(data as any);
              toast.success("Créneau ajouté !");
              setIsAddModalOpen(false);
              refetch();
            }}
            agencyId={agencyId}
          />
          <ConfirmActionModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleConfirmDelete}
            title="Confirmer la suppression"
            message="Supprimer ce créneau du planning ?"
          />
        </>
      )}
    </>
  );
}
