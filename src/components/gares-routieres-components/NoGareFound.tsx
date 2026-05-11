"use client";

import React from "react";
import { MapPin } from "lucide-react";

interface NoGareFoundProps {
  searchQuery?: string;
  onClear?: () => void;
}

export default function NoGareFound({ searchQuery, onClear }: NoGareFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 ring-8 ring-blue-50/50">
        <MapPin className="h-9 w-9 text-blue-300" />
      </div>
      <h3 className="mb-2 text-xl font-bold text-slate-800">Aucune gare trouvée</h3>
      <p className="mb-6 max-w-sm text-sm text-slate-500 leading-relaxed">
        {searchQuery
          ? `Aucun résultat pour « ${searchQuery} ». Essayez un autre terme ou réinitialisez vos filtres.`
          : "Aucune gare ne correspond à vos critères. Essayez de modifier vos filtres."}
      </p>
      {onClear && searchQuery && (
        <button
          onClick={onClear}
          className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
        >
          Effacer la recherche
        </button>
      )}
    </div>
  );
}