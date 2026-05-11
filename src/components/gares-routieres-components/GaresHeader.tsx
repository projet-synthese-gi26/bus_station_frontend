"use client";

import React from "react";
import { Search, X, MapPin } from "lucide-react";

interface GaresHeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  totalCount: number;
}

export default function GaresHeader({ searchQuery, setSearchQuery, totalCount }: GaresHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl mb-6 bg-linear-to-br from-blue-700 via-blue-800 to-indigo-900 px-6 py-10 md:px-12 md:py-14">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-16 -right-16 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 w-56 h-56 rounded-full bg-indigo-400/10 blur-2xl" />

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight mb-2">
        Trouvez votre{" "}
        <span className="bg-linear-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
          gare routière
        </span>
      </h1>
      <p className="text-slate-400 text-sm md:text-base mb-8 max-w-lg leading-relaxed">
        Découvrez les meilleures gares routières pour vos départs et arrivées à travers le pays.
      </p>

      {/* Search input */}
      <div className="relative max-w-xl">
        <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
        <input
          type="text"
          placeholder="Rechercher par nom, ville ou quartier..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-white/10 backdrop-blur-sm pl-11 pr-11 py-3.5 text-sm text-white placeholder-slate-400 outline-none transition focus:border-blue-400/60 focus:bg-white/15 focus:ring-0"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-1 text-slate-300 hover:bg-white/25 hover:text-white transition"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}