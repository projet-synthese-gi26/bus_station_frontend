"use client";

import React, { useRef, useCallback } from "react";
import type { PlannerEntry } from "./DraggableTrip";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";
import { DraggableTrip } from "./DraggableTrip";
import { useRouter } from "next/navigation";
import { updatePlannerTrip } from "@/lib/services/planner-trip-service";
import toast from "react-hot-toast";

interface WeeklyScheduleTimelineProps {
  daysOfWeek: string[];
  hours: string[];
  dailySchedules: PlannerEntry[][][];
  maxOverlapsPerDay: number[];
  refetch: () => void;
  isEditable: boolean;
  onDeleteRequest: (entryId: string) => void;
  onTripClick?: (entryId: string) => void;
}

// Couleurs plus robustes
const getCategoryColor = (category: string) => {
  const cat = (category || "Standard").toLowerCase();
  if (cat.includes("vip") || cat.includes("premium")) 
    return { bg: "bg-purple-500", border: "border-purple-700" };
  if (cat.includes("classique") || cat.includes("classic")) 
    return { bg: "bg-blue-500", border: "border-blue-700" };
  if (cat.includes("nuit") || cat.includes("nocturne")) 
    return { bg: "bg-indigo-800", border: "border-indigo-900" };
  if (cat.includes("eco")) 
    return { bg: "bg-green-500", border: "border-green-700" };
  
  // Par défaut
  return { bg: "bg-cyan-600", border: "border-cyan-800" };
};

const timeToMinutes = (time: string): number => {
  if (!time) return 0;
  const [h, m] = time.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
};

const minutesToTime = (minutes: number): string => {
  // Gère les débordements de minuit (ex: 25h = 01h)
  const safeMinutes = (minutes + 24 * 60) % (24 * 60);
  const h = Math.floor(safeMinutes / 60);
  const m = safeMinutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

const totalMinutesInDay = 24 * 60;
const tripHeightRem = 2.5;
const tripGapRem = 0.25;

function DayRow({
  day,
  dayIndex,
  hours,
  schedule,
  rowHeight,
  isEditable,
  onDeleteRequest,
  onTripClick,
}: any) {
  const { setNodeRef, isOver } = useDroppable({ id: `day-${dayIndex + 1}` });
  
  return (
    <div
      ref={setNodeRef}
      className="flex items-start relative group"
      style={{ minHeight: `${rowHeight}rem` }}
    >
      {isOver && isEditable && (
        <div className="absolute inset-0 bg-blue-50/50 border-2 border-dashed border-blue-400 rounded-lg z-0" />
      )}
      
      {/* Label du jour */}
      <div className="w-24 shrink-0 pr-3 text-right sticky left-0 z-10 pt-3 bg-white/90 backdrop-blur-sm">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          {day.slice(0, 3)}
        </span>
        <div className="text-[10px] text-gray-400 font-medium">{day.slice(3)}</div>
      </div>
      
      {/* Zone timeline */}
      <div className="relative flex-1 min-w-0 h-full">
        {/* Lignes verticales des heures */}
        {hours.slice(0, -1).map((_: any, hourIndex: number) => (
          <div
            key={`band-${hourIndex}`}
            className="absolute top-0 h-full border-l border-gray-100"
            style={{
              left: `${(hourIndex / hours.length) * 100}%`,
              width: `${(1 / hours.length) * 100}%`,
              backgroundColor: hourIndex % 2 === 0 ? "rgba(248, 250, 252, 0.5)" : "transparent"
            }}
          />
        ))}
        
        {/* Affichage des blocs de voyage */}
        {schedule &&
          schedule.map((lane: PlannerEntry[], laneIndex: number) => (
            <React.Fragment key={laneIndex}>
              {lane.map((trip: PlannerEntry) => {
                const colors = getCategoryColor(trip.category);
                
                const startMins = timeToMinutes(trip.startTime);
                let endMins = timeToMinutes(trip.endTime);
                
                // Si l'arrivée est avant le départ, c'est que ça traverse minuit
                if (endMins <= startMins && endMins !== 0) {
                  endMins += 24 * 60; 
                }

                // Calculs en % par rapport à la largeur de la div parent (24h)
                const startPercent = (startMins / totalMinutesInDay) * 100;
                const widthPercent = ((endMins - startMins) / totalMinutesInDay) * 100;
                
                const style = {
                  left: `${startPercent}%`,
                  // Largeur minimum pour que le bloc soit toujours visible et cliquable (ex: 3% ≈ 45 min visuelles)
                  width: `${Math.max(widthPercent, 3)}%`, 
                  top: `${laneIndex * (tripHeightRem + tripGapRem) + 0.25}rem`,
                  height: `${tripHeightRem}rem`,
                };
                
                return (
                  <DraggableTrip
                    key={trip.id}
                    trip={trip}
                    style={style}
                    colors={colors}
                    isEditable={isEditable}
                    onDelete={onDeleteRequest}
                    onTripClick={onTripClick!}
                  />
                );
              })}
            </React.Fragment>
          ))}
      </div>
    </div>
  );
}

export default function WeeklyScheduleTimeline({
  daysOfWeek,
  hours,
  dailySchedules,
  maxOverlapsPerDay,
  refetch,
  isEditable,
  onDeleteRequest,
  onTripClick,
}: WeeklyScheduleTimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleDragEnd = async (event: DragEndEvent) => {
    if (!isEditable) return;

    const { active, over, delta } = event;
    if (!over || !timelineRef.current) return;

    const trip = active.data.current as PlannerEntry;
    
    let startMins = timeToMinutes(trip.startTime);
    let endMins = timeToMinutes(trip.endTime);
    if (endMins <= startMins) endMins += 24 * 60;
    const tripDuration = endMins - startMins;

    const newDayOfWeek = Number(String(over.id).replace("day-", ""));

    const timelineWidth = timelineRef.current.offsetWidth;
    const pixelsPerMinute = timelineWidth / totalMinutesInDay;

    const newStartMinutes = Math.round((startMins + delta.x / pixelsPerMinute) / 15) * 15; // Snap aux 15 mins

    const newStartTime = minutesToTime(Math.max(0, newStartMinutes));
    const newEndTime = minutesToTime(newStartMinutes + tripDuration);

    if (
      newDayOfWeek === trip.dayOfWeek &&
      newStartTime === trip.startTime &&
      newEndTime === trip.endTime
    ) {
      return;
    }

    const updatedTrip: any = {
      dayOfWeek: newDayOfWeek,
      startTime: newStartTime,
      endTime: newEndTime,
    };

    toast.loading("Mise à jour du créneau...", { id: "update-trip" });
    try {
      // Le trip.id ici est "{ligneId}-{JOUR}", on doit extraire le vrai LigneId
      const ligneId = trip.id.split('-').slice(0, -1).join('-');
      await updatePlannerTrip(ligneId, updatedTrip);
      toast.success("Planning mis à jour!", { id: "update-trip" });
      refetch();
    } catch (error) {
      toast.error("Impossible de mettre à jour le créneau.", { id: "update-trip" });
    }
  };

  const handleTripClick = useCallback(
    (tripId: string) => {
      // Sur le dashboard, on veut générer un voyage unitaire
      if (onTripClick) onTripClick(tripId);
    },
    [onTripClick],
  );

  return (
    <div className="hidden md:block px-4 pb-8 overflow-x-auto">
      <DndContext onDragEnd={isEditable ? handleDragEnd : undefined}>
        {/* On force une largeur min pour éviter l'écrasement sur petits écrans */}
        <div className="relative min-w-200 lg:min-w-full">
          {/* Header heures */}
          <div className="flex h-8 items-center border-b border-gray-200 mb-2">
            <div className="w-24 shrink-0" />
            {hours.map((hour) => (
              <div key={hour} className="flex-1 text-center text-xs font-bold text-gray-400">
                {hour}
              </div>
            ))}
          </div>
          
          {/* Rows */}
          <div className="relative divide-y divide-gray-100" ref={timelineRef}>
            {daysOfWeek.map((day, dayIndex) => {
              // Calculer la hauteur de la ligne selon le nb de voyages superposés
              const overlaps = maxOverlapsPerDay[dayIndex] || 0;
              const rowHeight = overlaps > 0
                ? overlaps * (tripHeightRem + tripGapRem) + 0.5
                : 3.5;
                
              return (
                <DayRow
                  key={day}
                  day={day}
                  dayIndex={dayIndex}
                  hours={hours}
                  schedule={dailySchedules[dayIndex]}
                  rowHeight={rowHeight}
                  isEditable={isEditable}
                  onDeleteRequest={onDeleteRequest}
                  onTripClick={handleTripClick}
                />
              );
            })}
          </div>
        </div>
      </DndContext>
    </div>
  );
}