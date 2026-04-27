"use client";
/**
 * AgenciesTab.tsx  (mis à jour — P-07)
 *
 * Onglet "Agences présentes" sur la page détail d'une gare.
 * Retypé avec `AgenceVoyageFull` : utilise agencyId au lieu de id (mock).
 */

import Image from "next/image";
import Link from "next/link";
import { Bus } from "lucide-react";
import type { AgenceVoyageFull } from "@/lib/types/agence.types";

type AgenciesTabProps = {
  agences: AgenceVoyageFull[];
};

const AgenciesTab = ({ agences }: AgenciesTabProps) => {
  if (agences.length === 0) {
    return (
      <p className="text-sm text-gray-400 text-center py-8">
        Aucune agence affiliée à cette gare.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {agences.map((agence) => (
        <Link
          key={agence.agencyId}
          href={`/agency/${agence.agencyId}`}
          className="block p-4 bg-gray-50 rounded-xl text-center transition hover:shadow-md hover:-translate-y-0.5"
        >
          <div className="relative h-16 w-full mb-3">
            {agence.logoUrl ? (
              <Image
                src={agence.logoUrl}
                alt={`Logo de ${agence.shortName}`}
                fill
                className="object-contain"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Bus className="w-8 h-8 text-gray-300" />
              </div>
            )}
          </div>
          <p className="text-xs font-semibold text-gray-700 line-clamp-2">
            {agence.shortName ?? agence.longName}
          </p>
        </Link>
      ))}
    </div>
  );
};

export default AgenciesTab;
