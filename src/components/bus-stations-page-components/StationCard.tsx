"use client";
/**
 * StationCard.tsx  (mise à jour — Lot 2)
 *
 * Carte gare pour le listing /gares-routieres.
 * `idGare` est maintenant un UUID (string).
 *
 * Design : cover image avec gradient overlay si pas de photo,
 * services en chips, badge ouvert/fermé, hover-lift.
 */

import Image from "next/image";
import Link from "next/link";
import { MapPin, Building2, Clock, Bus, ArrowUpRight } from "lucide-react";
import type { Gare } from "@/lib/types/gare.types";

type StationCardProps = {
  station: Gare;
};

const StationCard = ({ station }: StationCardProps) => {
  return (
    <Link href={`/gares-routieres/${station.idGare}`} className="block group">
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 group-hover:border-blue-200">
        {/* ── Image / cover ─────────────────────────────────────────────── */}
        <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900">
          {station.imageUrl ? (
            <Image
              src={station.imageUrl}
              alt={`Photo de ${station.nom}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              unoptimized
            />
          ) : (
            <>
              {/* Pattern décoratif si pas d'image */}
              <div
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage: `linear-gradient(45deg, white 1px, transparent 1px),
                                    linear-gradient(-45deg, white 1px, transparent 1px)`,
                  backgroundSize: "20px 20px",
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Building2
                  className="w-16 h-16 text-white/30"
                  strokeWidth={1.5}
                />
              </div>
            </>
          )}

          {/* Overlay gradient pour la lisibilité */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          {/* Badge ouvert / fermé */}
          <div
            className={`absolute top-3 right-3 flex items-center gap-1 text-xs font-semibold py-1 px-2.5 rounded-full shadow-md backdrop-blur-sm
              ${
                station.estOuvert
                  ? "bg-green-500/95 text-white"
                  : "bg-red-500/95 text-white"
              }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                station.estOuvert ? "bg-white animate-pulse" : "bg-white"
              }`}
            />
            {station.estOuvert ? "Ouvert" : "Fermé"}
          </div>

          {/* Nom de la ville en overlay bottom-left */}
          <div className="absolute bottom-3 left-4 right-12">
            <p className="text-[10px] text-white/80 font-medium uppercase tracking-wider">
              {station.ville}
            </p>
            <h3 className="text-white font-bold text-base leading-tight line-clamp-1 drop-shadow-md">
              {station.nom || "Gare sans nom"}
            </h3>
          </div>

          {/* Indicateur hover */}
          <div className="absolute bottom-3 right-3 w-8 h-8 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ArrowUpRight className="w-4 h-4 text-blue-600" />
          </div>
        </div>

        {/* ── Contenu ─────────────────────────────────────────────────────── */}
        <div className="p-4 space-y-2.5">
          {/* Localisation */}
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-blue-500" />
            <span className="truncate">
              {station.quartier ? `${station.quartier}, ` : ""}
              {station.adresse || station.ville}
            </span>
          </div>

          {/* Horaires */}
          {station.horaires && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Clock className="w-3.5 h-3.5 shrink-0 text-gray-400" />
              <span className="truncate">{station.horaires}</span>
            </div>
          )}

          {/* Services chips (max 3) */}
          {station.services && station.services.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {station.services.slice(0, 3).map((s) => (
                <span
                  key={s}
                  className="text-[10px] bg-blue-50 text-blue-700 font-medium px-2 py-0.5 rounded-full border border-blue-100"
                >
                  {s}
                </span>
              ))}
              {station.services.length > 3 && (
                <span className="text-[10px] text-gray-500 font-medium px-2 py-0.5">
                  +{station.services.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Footer : nombre d'agences */}
          {station.nombreAgences != null && station.nombreAgences > 0 && (
            <div className="pt-3 mt-2 border-t border-gray-100 flex items-center gap-1.5 text-xs text-gray-500">
              <Bus className="w-3.5 h-3.5 text-blue-500" />
              <span>
                <strong className="text-gray-700">
                  {station.nombreAgences}
                </strong>{" "}
                agence{station.nombreAgences > 1 ? "s" : ""} affiliée
                {station.nombreAgences > 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default StationCard;
// END OF FILE: src/components/bus-stations-page-components/StationCard.tsx
