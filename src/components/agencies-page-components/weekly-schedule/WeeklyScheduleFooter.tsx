// src/components/agencies-page-components/weekly-schedule/WeeklyScheduleFooter.tsx
"use client";

import { Lightbulb } from 'lucide-react';

interface WeeklyScheduleFooterProps {
  tripCount: number;
  isEditable: boolean; // New prop
}

export default function WeeklyScheduleFooter({ tripCount, isEditable }: WeeklyScheduleFooterProps) {
  return (
    <div className="bg-gray-100 p-3 rounded-b-2xl flex justify-between items-center text-sm">
      <div className="font-medium text-gray-700">
        {tripCount} voyages planifiés
      </div>
      {isEditable && ( // Conditionally render tip
        <div className="hidden sm:flex items-center gap-2 text-gray-500">
          <Lightbulb className="w-4 h-4 text-yellow-500" />
          <span className="italic">Astuce: Glissez un voyage pour le déplacer</span>
        </div>
      )}
    </div>
  );
}