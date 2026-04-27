"use client";
/**
 * StationCard.tsx  (mis à jour — P-06)
 *
 * Carte gare pour le listing /gares-routieres.
 * Retypé avec `Gare` (nouveau type de conception).
 * Utilise idGare (number) au lieu de id (string mock).
 */

import Image from "next/image";
import Link from "next/link";
import { MapPin, Building2, Clock } from "lucide-react";
import type { Gare } from "@/lib/types/gare.types";

type StationCardProps = {
  station: Gare;
};

const StationCard = ({ station }: StationCardProps) => {
  return (
    <Link href={`/gares-routieres/${station.idGare}`} className="block group">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1">
        {/* Image */}
        <div className="relative h-44 w-full bg-gray-100">
          {station.imageUrl ? (
            <Image
              src={station.imageUrl}
              alt={`Photo de ${station.nom}`}
              fill
              className="object-cover transition-opacity duration-300 group-hover:opacity-90"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <Building2 className="w-12 h-12 text-gray-300" />
            </div>
          )}
          {/* Badge ouvert / fermé */}
          <div
            className={`absolute top-3 right-3 text-xs font-semibold py-1 px-2.5 rounded-full
              ${
                station.estOuvert
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
          >
            {station.estOuvert ? "Ouvert" : "Fermé"}
          </div>
        </div>

        {/* Contenu */}
        <div className="p-4 space-y-2">
          <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">
            {station.nom}
          </h3>

          <div className="flex items-center gap-1 text-xs text-gray-500">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span>
              {station.quartier ? `${station.quartier}, ` : ""}
              {station.ville}
            </span>
          </div>

          {station.horaires && (
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>{station.horaires}</span>
            </div>
          )}

          {/* Services chips (max 3) */}
          {station.services && station.services.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {station.services.slice(0, 3).map((s) => (
                <span
                  key={s}
                  className="text-[10px] bg-blue-50 text-blue-600 font-medium px-2 py-0.5 rounded-full"
                >
                  {s}
                </span>
              ))}
              {station.services.length > 3 && (
                <span className="text-[10px] text-gray-400">
                  +{station.services.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default StationCard;
