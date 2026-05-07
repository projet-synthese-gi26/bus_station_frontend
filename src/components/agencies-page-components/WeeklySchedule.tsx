// src/components/agencies-page-components/WeeklySchedule.tsx
"use client";

import React, { useState, useMemo, useCallback } from "react";
import { usePlannerTrips } from "@/lib/hooks/agency-public-hooks/usePlannerTrips";
import {
  createPlannerTrip,
  deletePlannerTrip,
} from "@/lib/services/planner-trip-service";
import { PlannerTrip } from "@/lib/types/models/Trip";

import WeeklyScheduleHeader from "./weekly-schedule/WeeklyScheduleHeader";
import WeeklyScheduleTimeline from "./weekly-schedule/WeeklyScheduleTimeline";
import WeeklyScheduleList from "./weekly-schedule/WeeklyScheduleList";
import WeeklyScheduleFooter from "./weekly-schedule/WeeklyScheduleFooter";
import AddTripModal from "@/modals/AddTripModal";
import ConfirmActionModal from "@/modals/ConfirmActionModal";
import GenerateWeekModal from "@/modals/GenerateWeekModal";
import Loader from "@/modals/Loader";
import toast from "react-hot-toast";

interface WeeklyScheduleProps {
  agencyId: string;
  isEditable?: boolean; // New prop to control editing features
}

const timeToMinutes = (time: string): number => {
  if (!time) return 0;
  const [h, m] = time.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
};

export default function WeeklySchedule({
  agencyId,
  isEditable = false,
}: WeeklyScheduleProps) {
  const { trips, isLoading, error, refetch } = usePlannerTrips(agencyId);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  // BLOC 4 : id passe en string (UUID backend)
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

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
  const allCategories = useMemo(
    () => [...new Set(trips.map((trip) => trip.category))].filter(Boolean),
    [trips],
  ); // filter(Boolean) to remove any empty string categories

  const handleFilterToggle = (category: string) => {
    setActiveFilters((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const filteredTrips = useMemo(
    () =>
      activeFilters.length > 0
        ? trips.filter((trip) => activeFilters.includes(trip.category))
        : trips,
    [trips, activeFilters],
  );

  const dailySchedules = useMemo(
    () =>
      daysOfWeek.map((_, dayIndex) => {
        const dayTrips = filteredTrips
          .filter((trip) => trip.dayOfWeek === dayIndex + 1)
          .sort(
            (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime),
          );
        const lanes: PlannerTrip[][] = [];
        dayTrips.forEach((trip) => {
          let placed = false;
          for (const lane of lanes) {
            const lastTrip = lane[lane.length - 1];
            if (
              lastTrip &&
              timeToMinutes(trip.startTime) >= timeToMinutes(lastTrip.endTime)
            ) {
              // Check lastTrip existence
              lane.push(trip);
              placed = true;
              break;
            }
          }
          if (!placed) lanes.push([trip]);
        });
        return lanes;
      }),
    [filteredTrips, daysOfWeek],
  );

  const maxOverlapsPerDay = useMemo(
    () => dailySchedules.map((lanes) => lanes.length),
    [dailySchedules],
  );

  const handleAddTrip = async (data: Omit<PlannerTrip, "id">) => {
    toast.loading("Ajout du voyage...");
    try {
      await createPlannerTrip(data);
      toast.dismiss();
      toast.success("Voyage ajouté avec succès!");
      setIsAddModalOpen(false);
      refetch();
    } catch (e) {
      toast.dismiss();
      console.error(e);
      toast.error("Erreur lors de l'ajout du voyage.");
    }
  };

  const handleDeleteRequest = useCallback((tripId: string) => {
    setSelectedTripId(tripId);
    setIsDeleteModalOpen(true);
  }, []);

  const handleConfirmDelete = async () => {
    if (!selectedTripId) return;
    toast.loading("Suppression en cours...");
    try {
      await deletePlannerTrip(selectedTripId);
      toast.dismiss();
      toast.success("Voyage supprimé!");
      setIsDeleteModalOpen(false);
      setSelectedTripId(null);
      refetch();
    } catch (e) {
      toast.dismiss();
      console.error(e);
      toast.error("Erreur lors de la suppression.");
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader message="Chargement du planning..." />
      </div>
    );
  if (error)
    return <div className="text-red-500 text-center p-4">Erreur: {error}</div>;

  return (
    <>
      <div className="bg-white shadow-xl rounded-2xl w-full mx-auto my-8 font-sans">
        <WeeklyScheduleHeader
          allCategories={allCategories}
          activeFilters={activeFilters}
          onFilterToggle={handleFilterToggle}
          onAddRequest={isEditable ? () => setIsAddModalOpen(true) : undefined}
          onGenerateWeekRequest={
            isEditable && trips.length > 0
              ? () => setIsGenerateModalOpen(true)
              : undefined
          }
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
        />
        <WeeklyScheduleFooter
          tripCount={filteredTrips.length}
          isEditable={isEditable}
        />
      </div>

      {isEditable && (
        <>
          <AddTripModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSave={handleAddTrip}
            agencyId={agencyId}
          />

          <ConfirmActionModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleConfirmDelete}
            title="Confirmer la suppression"
            message="Êtes-vous sûr de vouloir supprimer ce voyage du planning? Cette action est irréversible."
          />

          <GenerateWeekModal
            isOpen={isGenerateModalOpen}
            onClose={() => setIsGenerateModalOpen(false)}
            agencyId={agencyId}
            trips={trips}
            onGenerated={refetch}
          />
        </>
      )}
    </>
  );
}
// END OF FILE: src/components/agencies-page-components/WeeklySchedule.tsx
