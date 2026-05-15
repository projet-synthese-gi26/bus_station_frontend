"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { usePlannerTrips } from "@/lib/hooks/agency-public-hooks/usePlannerTrips";
import { createPlannerTrip, deletePlannerTrip } from "@/lib/services/planner-trip-service";
import type { LigneService, JourSemaine } from "@/lib/types/ligne-service.types";
import type { PlannerEntry } from "./weekly-schedule/DraggableTrip";
import type { CreateLigneServiceDTO } from "@/lib/types/ligne-service.types";

import WeeklyScheduleHeader from "./weekly-schedule/WeeklyScheduleHeader";
import WeeklyScheduleTimeline from "./weekly-schedule/WeeklyScheduleTimeline";
import WeeklyScheduleList from "./weekly-schedule/WeeklyScheduleList";
import WeeklyScheduleFooter from "./weekly-schedule/WeeklyScheduleFooter";
import AddTripModal from "@/modals/AddTripModal";
import ConfirmActionModal from "@/modals/ConfirmActionModal";
import Loader from "@/modals/Loader";
import toast from "react-hot-toast";
import { getAllClassVoyagesByAgence } from "@/lib/services/class-voyage-service";
import type { ClassVoyage } from "@/lib/types/generated-api";

const JOUR_TO_NUM: Record<JourSemaine, number> = {
  LUNDI: 1, MARDI: 2, MERCREDI: 3, JEUDI: 4,
  VENDREDI: 5, SAMEDI: 6, DIMANCHE: 7,
};

// ── Extracteur d'heure "Anti-Crash" compatible Spring Boot ────────────────────
const extractCleanTime = (val: any): string => {
  if (!val) return "00:00";

  // CAS 1 : Spring Boot renvoie un tableau [Heure, Minute, Seconde?] -> ex: [8, 30]
  if (Array.isArray(val) && val.length >= 2) {
    const h = String(val[0]).padStart(2, "0");
    const m = String(val[1]).padStart(2, "0");
    return `${h}:${m}`;
  }

  // CAS 2 : C'est une chaîne de caractères
  let strVal = String(val);
  
  // Si c'est une date ISO complète (2026-05-18T13:30:00), on coupe au 'T'
  if (strVal.includes("T")) {
    strVal = strVal.split("T")[1];
  }

  // On coupe selon les deux-points ':' (ex: "08:30:00" -> ["08", "30", "00"])
  const parts = strVal.split(":");
  if (parts.length >= 2) {
    const h = parts[0].padStart(2, "0");
    const m = parts[1].padStart(2, "0");
    return `${h}:${m}`;
  }

  return "00:00"; // Sécurité finale
};

const timeToMinutes = (t: string) => {
  if (!t) return 0;
  const [h, m] = t.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
};

interface WeeklyScheduleProps {
  agencyId: string;
  isEditable?: boolean;
}

export default function WeeklySchedule({ agencyId, isEditable = false }: WeeklyScheduleProps) {
  const { trips: lignes, isLoading, error, refetch } = usePlannerTrips(agencyId);
  const[activeFilters, setActiveFilters] = useState<string[]>([]);
  const[isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [classes, setClasses] = useState<ClassVoyage[]>([]);
  const[selectedTripId, setSelectedTripId] = useState<string | null>(null);

  const daysOfWeek = useMemo(
    () =>["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"],[],
  );
  const hours = useMemo(
    () => Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}h`),[],
  );

  // Convertit LigneService[] → PlannerEntry[] avec IDs numériques
  const[allEntries, entryToLigne] = useMemo(() => {
    const map = new Map<number, string>();
    let counter = 1;
    const entries: PlannerEntry[] =[];
    
    for (const ligne of lignes) {
      for (const jour of (ligne.joursOperation ??[])) {
        const id = counter++;
        map.set(id, ligne.id);

        // CORRECTION ICI : Fallback sur les différents noms possibles + extractCleanTime
        const rawStart = (ligne as any).heureDepart || (ligne as any).heureDepartEffectif;
        const rawEnd = (ligne as any).heureArrivee || (ligne as any).heureArrive;

        entries.push({
          id: `${ligne.id}-${jour}`,
          agencyId: ligne.agenceVoyageId,
          title: ligne.nom || `${ligne.lieuDepart} → ${ligne.lieuArrive}`,
          dayOfWeek: JOUR_TO_NUM[jour] ?? 1,
          startTime: extractCleanTime(rawStart), // "08:30:00" -> "08:30"
          endTime: extractCleanTime(rawEnd),     // "13:30:00" -> "13:30"
          category: ligne.nomClasse ?? "Standard",
          _ligneServiceId: ligne.id,
        });
      }
    }
    return [entries, map];
  }, [lignes]);

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
          .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
        const lanes: PlannerEntry[][] =[];
        dayEntries.forEach((entry) => {
          let placed = false;
          for (const lane of lanes) {
            const last = lane[lane.length - 1];
            if (last && timeToMinutes(entry.startTime) >= timeToMinutes(last.endTime)) {
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
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    );
  };

  const handleDeleteRequest = useCallback((entryId: string) => {
    setSelectedTripId(entryId);
    setIsDeleteModalOpen(true);
  },[]);

  const handleConfirmDelete = async () => {
    if (!selectedTripId) return;
    const ligneId = selectedTripId?.split("-").slice(0, -1).join("-") ?? null;
    if (!ligneId) return;
    toast.loading("Suppression...");
    try {
      await deletePlannerTrip(ligneId);
      toast.dismiss();
      toast.success("Créneau supprimé !");
      setIsDeleteModalOpen(false);
      setSelectedTripId(null);
      refetch();
    } catch {
      toast.dismiss();
      toast.error("Erreur lors de la suppression.");
    }
  };

  useEffect(() => {
    if (!agencyId) return;
    getAllClassVoyagesByAgence(agencyId)
    .then((data) => {
      setClasses(data ?? []);
    })
  }, [agencyId]);

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
        <WeeklyScheduleList daysOfWeek={daysOfWeek} dailySchedules={dailySchedules} />
        <WeeklyScheduleTimeline
          daysOfWeek={daysOfWeek}
          hours={hours}
          dailySchedules={dailySchedules}
          maxOverlapsPerDay={maxOverlapsPerDay}
          refetch={refetch}
          isEditable={isEditable}
          onDeleteRequest={handleDeleteRequest}
        />
        <WeeklyScheduleFooter tripCount={filteredEntries.length} isEditable={isEditable} />
      </div>

      {isEditable && (
        <>
          <AddTripModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSave={async (data) => {
            try {
              await createPlannerTrip(data as CreateLigneServiceDTO);
              toast.success("Créneau ajouté !");
              setIsAddModalOpen(false);
              refetch();
            } catch (error: any) {
              if (error?.response?.status === 409) {
                toast.error("Ce créneau existe déjà pour cette agence.");
              } else {
                toast.error("Erreur lors de l'ajout du créneau.");
              }
            }
          }}
            agencyId={agencyId}
            classes={classes} 
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