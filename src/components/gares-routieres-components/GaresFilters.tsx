"use client";

import React from "react";
import { SlidersHorizontal, X } from "lucide-react";

interface GaresFiltersProps {
  allServices: string[];
  selectedServices: string[];
  handleServiceToggle: (service: string) => void;
}

export default function GaresFilters({
  allServices,
  selectedServices,
  handleServiceToggle,
}: GaresFiltersProps) {
  if (!allServices || allServices.length === 0) return null;

  const clearAll = () => selectedServices.forEach((s) => handleServiceToggle(s));

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 mr-1">
        <SlidersHorizontal className="h-3.5 w-3.5" />
        Services
      </span>

      {allServices.map((service) => {
        const active = selectedServices.includes(service);
        return (
          <button
            key={service}
            onClick={() => handleServiceToggle(service)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-150 border ${
              active
                ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-200"
                : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600"
            }`}
          >
            {service.replace(/_/g, " ")}
          </button>
        );
      })}

      {selectedServices.length > 0 && (
        <button
          onClick={clearAll}
          className="ml-2 flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 transition border border-transparent hover:border-red-100"
        >
          <X className="h-3 w-3" />
          Réinitialiser
        </button>
      )}
    </div>
  );
}