// src/components/agencies-page-components/weekly-schedule/DraggableTrip.tsx
"use client";

import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { PlannerTrip } from "@/lib/types/models/Trip";
import { Clock, MapPin, Trash2 } from "lucide-react";

interface DraggableTripProps {
  trip: PlannerTrip;
  style: React.CSSProperties;
  colors: { bg: string; border: string };
  isEditable: boolean;
  // BLOC 4 : id en string (UUID backend)
  onDelete: (tripId: string) => void;
}

export function DraggableTrip({
  trip,
  style,
  colors,
  isEditable,
  onDelete,
}: DraggableTripProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: trip.id,
    data: trip, // Pass trip data for calculations on drop
    disabled: !isEditable, // Disable dragging if not editable
  });

  const dynamicStyle = {
    ...style,
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={dynamicStyle}
      {...attributes}
      {...listeners}
      className={`absolute my-1 rounded-md px-2 py-1 text-white text-xs overflow-hidden ${
        isEditable ? "cursor-grab" : "cursor-default"
      } shadow-md border-l-4 ${colors.bg} ${
        colors.border
      } opacity-90 hover:opacity-100 transition-all duration-200 group`}
      title={`${trip.title}\n${trip.startTime} - ${trip.endTime}`}
    >
      <div className="font-bold flex items-center gap-1.5">
        <MapPin className="w-3 h-3" />
        <span className="truncate">{trip.title}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Clock className="w-3 h-3" />
        <span className="truncate">{`${trip.startTime} - ${trip.endTime}`}</span>
      </div>
      {isEditable && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent drag from starting on delete click
            onDelete(trip.id);
          }}
          className="absolute top-1 right-1 p-1 bg-black/20 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Supprimer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
// END OF FILE: src/components/agencies-page-components/weekly-schedule/DraggableTrip.tsx
