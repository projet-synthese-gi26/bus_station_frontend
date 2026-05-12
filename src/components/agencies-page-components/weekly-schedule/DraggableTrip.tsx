"use client";

import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Clock, MapPin, Trash2 } from "lucide-react";

export interface PlannerEntry {
  id: string;
  agencyId: string;
  title: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  category: string;
  _ligneServiceId: string;
}

interface DraggableTripProps {
  trip: PlannerEntry;
  style: React.CSSProperties; // contient left, width, top, height
  colors: { bg: string; border: string };
  isEditable: boolean;
  onDelete: (tripId: string) => void;
  onTripClick: (tripId: string) => void;
}

export function DraggableTrip({
  trip,
  style,
  colors,
  isEditable,
  onDelete,
  onTripClick,
}: DraggableTripProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: trip.id,
    data: trip,
    disabled: !isEditable,
  });

  // Sécurisation absolue des styles pour éviter les conflits CSS
  const dynamicStyle: React.CSSProperties = {
    ...style,
    position: "absolute",
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    zIndex: transform ? 50 : 10,
    transition: transform ? 'none' : 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  return (
    <div
      ref={setNodeRef}
      style={dynamicStyle}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        if (!isEditable) { 
          e.stopPropagation(); 
          onTripClick(trip.id); 
        }
      }}
      className={`rounded-md text-white text-[11px] overflow-hidden
        ${isEditable ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"}
        border-l-4 ${colors.bg} ${colors.border}
        shadow hover:shadow-lg group`}
      title={`${trip.title}\n${trip.startTime} - ${trip.endTime}\nClasse: ${trip.category}`}
    >
      <div className="h-full w-full px-2 flex flex-col justify-center bg-white/10 backdrop-blur-sm">
        <div className="font-bold flex items-center gap-1 leading-tight truncate">
          {/* Affiche seulement l'arrivée pour gagner de la place si c'est petit */}
          <span className="truncate">{trip.title.split("→").pop()?.trim() || trip.title}</span>
        </div>
        <div className="flex items-center gap-1 opacity-90 text-[10px] font-medium mt-0.5">
          <Clock className="w-2.5 h-2.5 shrink-0" />
          <span className="truncate">{trip.startTime} - {trip.endTime}</span>
        </div>
      </div>
      
      {isEditable && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(trip.id); }}
          className="absolute top-1 right-1 p-0.5 bg-black/40 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-20"
          aria-label="Supprimer"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}