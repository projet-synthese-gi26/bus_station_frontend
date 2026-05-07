// src/components/agencies-page-components/weekly-schedule/WeeklyScheduleTimeline.tsx
"use client";

import React, { useRef } from "react";
import { PlannerTrip } from "@/lib/types/models/Trip";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";
import { DraggableTrip } from "./DraggableTrip";
import { updatePlannerTrip } from "@/lib/services/planner-trip-service";
import toast from "react-hot-toast";

interface WeeklyScheduleTimelineProps {
  daysOfWeek: string[];
  hours: string[];
  dailySchedules: PlannerTrip[][][];
  maxOverlapsPerDay: number[];
  refetch: () => void;
  isEditable: boolean; // New prop
  // BLOC 4 : id en string (UUID backend)
  onDeleteRequest: (tripId: string) => void;
}

const categoryColors: { [key: string]: { bg: string; border: string } } = {
  VIP: { bg: "bg-purple-500", border: "border-purple-700" },
  Classic: { bg: "bg-blue-500", border: "border-blue-700" },
  Premium: { bg: "bg-yellow-500", border: "border-yellow-700" },
  Nocturne: { bg: "bg-indigo-800", border: "border-indigo-900" },
};

const getCategoryColor = (category: string) => {
  return (
    categoryColors[category] || { bg: "bg-gray-400", border: "border-gray-600" }
  );
};

const timeToMinutes = (time: string): number => {
  if (!time) return 0;
  const [h, m] = time.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
};

const minutesToTime = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

const totalMinutesInDay = 24 * 60;
const tripHeightRem = 2.5;
const tripGapRem = 0.25;

interface DayRowProps {
  day: string;
  dayIndex: number;
  hours: string[];
  schedule: PlannerTrip[][];
  rowHeight: number;
  isEditable: boolean;
  onDeleteRequest: (tripId: string) => void;
}

function DayRow({
  day,
  dayIndex,
  hours,
  schedule,
  rowHeight,
  isEditable,
  onDeleteRequest,
}: DayRowProps) {
  const { setNodeRef, isOver } = useDroppable({ id: `day-${dayIndex + 1}` });
  return (
    <div
      ref={setNodeRef}
      className="flex items-start border-t border-gray-200 relative"
      style={{ minHeight: `${rowHeight}rem` }}
    >
      {isOver && isEditable && (
        <div className="absolute inset-0 bg-primary/10 z-0" />
      )}
      <div className="w-28 flex-shrink-0 pr-4 text-right font-bold text-gray-600 pt-3 text-sm sticky left-0 bg-white/80 backdrop-blur-sm z-10">
        {day}
      </div>
      <div className="relative w-full h-full">
        {hours.slice(0, -1).map((_, hourIndex: number) => (
          <div
            key={`line-${hourIndex}`}
            className="absolute h-full border-l border-gray-200/70"
            style={{
              left: `${((hourIndex + 1) / hours.length) * 100}%`,
              top: 0,
            }}
          />
        ))}
        {schedule &&
          schedule.map((lane: PlannerTrip[], laneIndex: number) => (
            <React.Fragment key={laneIndex}>
              {lane.map((trip: PlannerTrip) => {
                const colors = getCategoryColor(trip.category);
                const startPercent =
                  (timeToMinutes(trip.startTime) / totalMinutesInDay) * 100;
                const widthPercent =
                  ((timeToMinutes(trip.endTime) -
                    timeToMinutes(trip.startTime)) /
                    totalMinutesInDay) *
                  100;
                const style = {
                  left: `${startPercent}%`,
                  width: `${widthPercent}%`,
                  top: `${laneIndex * (tripHeightRem + tripGapRem)}rem`,
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
}: WeeklyScheduleTimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = async (event: DragEndEvent) => {
    if (!isEditable) return;

    const { active, over, delta } = event;
    if (!over || !timelineRef.current) return;

    const trip = active.data.current as PlannerTrip;
    const tripDuration =
      timeToMinutes(trip.endTime) - timeToMinutes(trip.startTime);

    // Calculate new day
    const newDayOfWeek = Number(String(over.id).replace("day-", ""));

    // Calculate new time
    const timelineWidth = timelineRef.current.offsetWidth;
    const safeTimelineWidth =
      timelineWidth > 0 ? timelineWidth : window.innerWidth * 0.7;
    const pixelsPerMinute = safeTimelineWidth / totalMinutesInDay;

    const currentTripStartTimeMinutes = timeToMinutes(trip.startTime);
    const newStartMinutes =
      Math.round(
        (currentTripStartTimeMinutes + delta.x / pixelsPerMinute) / 5,
      ) * 5; // Snap to 5 minutes

    const newStartTime = minutesToTime(Math.max(0, newStartMinutes));
    const newEndTime = minutesToTime(
      Math.min(totalMinutesInDay, newStartMinutes + tripDuration),
    );

    if (
      newDayOfWeek === trip.dayOfWeek &&
      newStartTime === trip.startTime &&
      newEndTime === trip.endTime
    ) {
      return;
    }

    const updatedTrip: Partial<PlannerTrip> = {
      dayOfWeek: newDayOfWeek,
      startTime: newStartTime,
      endTime: newEndTime,
    };

    toast.loading("Mise à jour du voyage...");
    try {
      await updatePlannerTrip(trip.id, updatedTrip);
      toast.dismiss();
      toast.success("Planning mis à jour!");
      refetch();
    } catch (error) {
      toast.dismiss();
      console.error(error);
      toast.error("Impossible de mettre à jour le voyage.");
    }
  };

  return (
    <div className="hidden md:block p-4 overflow-x-auto">
      <DndContext onDragEnd={isEditable ? handleDragEnd : undefined}>
        <div
          className="relative"
          style={{ minWidth: `${hours.length * 3.5}rem` }}
        >
          <div className="flex h-10 items-center">
            <div className="w-28 flex-shrink-0" />
            {hours.map((hour) => (
              <div
                key={hour}
                className="w-14 text-center text-xs text-gray-500 flex-shrink-0"
              >
                {hour}
              </div>
            ))}
          </div>
          <div className="relative" ref={timelineRef}>
            {daysOfWeek.map((day, dayIndex) => {
              const rowHeight =
                maxOverlapsPerDay[dayIndex] > 0
                  ? maxOverlapsPerDay[dayIndex] * (tripHeightRem + tripGapRem) +
                    tripGapRem
                  : 4;
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
                />
              );
            })}
          </div>
        </div>
      </DndContext>
    </div>
  );
}
// END OF FILE: src/components/agencies-page-components/weekly-schedule/WeeklyScheduleTimeline.tsx
