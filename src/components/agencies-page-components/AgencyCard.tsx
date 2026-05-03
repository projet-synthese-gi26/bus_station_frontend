"use client";
/**
 * AgencyCard.tsx  (redesign — Lot 2)
 *
 * Carte agence pour le listing /agency.
 * Design : cover image avec gradient overlay, logo en badge circulaire
 * positionné en bas à gauche, badge statut, hover-lift.
 *
 * Aucune dépendance à `placeholder.svg` : fallback = gradient bleu propre.
 */

import Image from "next/image";
import Link from "next/link";
import { MapPin, Bus, AlertCircle, Star, ArrowUpRight } from "lucide-react";
import type { AgenceVoyageFull } from "@/lib/types/agence.types";

interface AgencyCardProps {
  agency: AgenceVoyageFull;
}

export default function AgencyCard({ agency }: AgencyCardProps) {
  const isSuspendue = agency.statutAgence === "SUSPENDUE";
  const initials = (agency.shortName ?? agency.longName ?? "A")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Link
      href={isSuspendue ? "#" : `/agency/${agency.agencyId}`}
      className={`group relative block bg-white rounded-2xl border border-gray-100 overflow-hidden
        transition-all duration-300
        ${
          isSuspendue
            ? "opacity-60 cursor-not-allowed pointer-events-none"
            : "hover:shadow-xl hover:-translate-y-1 hover:border-blue-200"
        }`}
    >
      {/* ── Cover : image OU gradient fallback ─────────────────────────── */}
      <div className="relative h-32 overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700">
        {agency.logoUrl && (
          <Image
            src={agency.logoUrl}
            alt={agency.longName ?? "Agence"}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            unoptimized
          />
        )}

        {/* Pattern décoratif si pas d'image */}
        {!agency.logoUrl && (
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px),
                                radial-gradient(circle at 80% 50%, white 1px, transparent 1px)`,
              backgroundSize: "24px 24px",
            }}
          />
        )}

        {/* Overlay gradient pour la lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

        {/* Badge SUSPENDUE en haut à droite */}
        {isSuspendue && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-red-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-md">
            <AlertCircle className="w-3 h-3" />
            Suspendue
          </div>
        )}

        {/* Badge rating en haut à droite si disponible */}
        {!isSuspendue && agency.rating != null && agency.rating > 0 && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/95 backdrop-blur-sm text-gray-900 text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            {agency.rating.toFixed(1)}
          </div>
        )}

        {/* Logo en avatar circulaire flottant en bas à gauche */}
        <div className="absolute -bottom-6 left-4 w-14 h-14 rounded-2xl bg-white shadow-lg ring-4 ring-white flex items-center justify-center overflow-hidden">
          {agency.logoUrl ? (
            <Image
              src={agency.logoUrl}
              alt={agency.shortName ?? ""}
              width={56}
              height={56}
              className="object-cover"
              unoptimized
            />
          ) : (
            <span className="text-blue-600 font-bold text-base">
              {initials}
            </span>
          )}
        </div>

        {/* Indicateur "voir profil" en hover */}
        <div className="absolute bottom-3 right-3 w-8 h-8 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ArrowUpRight className="w-4 h-4 text-blue-600" />
        </div>
      </div>

      {/* ── Contenu ─────────────────────────────────────────────────────── */}
      <div className="pt-9 pb-4 px-4">
        <h3 className="font-bold text-gray-900 text-base leading-tight line-clamp-1 group-hover:text-blue-600 transition-colors">
          {agency.longName ?? "Agence sans nom"}
        </h3>
        {agency.shortName && (
          <p className="text-xs text-gray-400 font-medium mt-0.5">
            {agency.shortName}
          </p>
        )}

        {agency.location && (
          <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-blue-500" />
            <span className="truncate">{agency.location}</span>
          </div>
        )}

        {agency.description && (
          <p className="mt-2.5 text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {agency.description}
          </p>
        )}

        {/* Footer : nombre de gares affiliées */}
        {agency.gareIds && agency.gareIds.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-xs text-gray-500">
            <Bus className="w-3.5 h-3.5 text-blue-500" />
            <span>
              <strong className="text-gray-700">{agency.gareIds.length}</strong>{" "}
              gare{agency.gareIds.length > 1 ? "s" : ""} affiliée
              {agency.gareIds.length > 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
// END OF FILE: src/components/agencies-page-components/AgencyCard.tsx
