"use client";
/**
 * AgencyCard.tsx  (reconstruit — P-04)
 *
 * Carte agence pour le listing public /agency.
 * Typé avec AgenceVoyageFull (conception v4).
 * Badge SUSPENDUE visible si l'agence est suspendue.
 */

import Image from "next/image";
import Link from "next/link";
import { MapPin, Bus, AlertCircle } from "lucide-react";
import type { AgenceVoyageFull } from "@/lib/types/agence.types";

interface AgencyCardProps {
  agency: AgenceVoyageFull;
}

export default function AgencyCard({ agency }: AgencyCardProps) {
  const isSuspendue = agency.statutAgence === "SUSPENDUE";

  return (
    <Link
      href={`/agency/${agency.agencyId}`}
      className={`block bg-white rounded-2xl shadow-sm border overflow-hidden
        transition-all duration-300 group
        ${
          isSuspendue
            ? "opacity-60 border-red-200 cursor-not-allowed pointer-events-none"
            : "border-gray-100 hover:shadow-md hover:-translate-y-1"
        }`}
    >
      {/* Image de couverture */}
      <div className="relative h-36 bg-gray-100">
        {agency.logoUrl ? (
          <Image
            src={agency.logoUrl}
            alt={agency.longName ?? "Agence"}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <Bus className="w-10 h-10 text-indigo-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Badge SUSPENDUE */}
        {isSuspendue && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
            <AlertCircle className="w-3 h-3" />
            Suspendue
          </div>
        )}

        {/* Nom court en overlay */}
        <p className="absolute bottom-2 left-3 text-white text-xs font-medium opacity-80">
          {agency.shortName}
        </p>
      </div>

      {/* Contenu */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2">
          {agency.longName ?? "Agence sans nom"}
        </h3>

        {agency.location && (
          <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{agency.location}</span>
          </div>
        )}

        {agency.description && (
          <p className="mt-2 text-xs text-gray-400 line-clamp-2">
            {agency.description}
          </p>
        )}
      </div>
    </Link>
  );
}
