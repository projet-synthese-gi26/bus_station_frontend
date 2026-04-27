"use client";
// src/components/agencies-page-components/weekly-schedule/WeeklyScheduleList.tsx

import React from "react";
import { MapPin, Clock } from "lucide-react";
import type { PlannerEntry } from "./DraggableTrip";

const categoryColors: Record<string, { bg: string; border: string }> = {
  VIP: { bg: "bg-purple-500", border: "border-purple-700" },
  Classic: { bg: "bg-blue-500", border: "border-blue-700" },
  Premium: { bg: "bg-yellow-500", border: "border-yellow-700" },
  Nocturne: { bg: "bg-indigo-800", border: "border-indigo-900" },
};

const getCategoryColor = (category: string) =>
  categoryColors[category] ?? { bg: "bg-gray-400", border: "border-gray-600" };

interface WeeklyScheduleListProps {
  daysOfWeek: string[];
  dailySchedules: PlannerEntry[][][];
}

export default function WeeklyScheduleList({
  daysOfWeek,
  dailySchedules,
}: WeeklyScheduleListProps) {
  return (
    <div className="md:hidden p-4 space-y-6">
      {daysOfWeek.map((day, dayIndex) => {
        const flat = dailySchedules[dayIndex]?.flat() ?? [];
        if (flat.length === 0) return null;
        return (
          <div key={day} className="mb-4">
            <h3 className="font-bold text-lg text-gray-700 border-b-2 border-gray-200 pb-1 mb-2">
              {day}
            </h3>
            <div className="space-y-2">
              {flat.map((entry) => {
                const colors = getCategoryColor(entry.category);
                return (
                  <div
                    key={entry.id}
                    className={`p-2 rounded-lg border-l-4 ${colors.bg} ${colors.border} text-white`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{entry.title}</span>
                    </div>
                    <div className="text-sm flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>
                        {entry.startTime} - {entry.endTime}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
