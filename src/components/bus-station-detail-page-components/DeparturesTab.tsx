"use client";
/**
 * DeparturesTab.tsx  (mis à jour — P-07)
 *
 * Onglet "Prochains Départs" sur la page détail d'une gare.
 * Retypé avec `DepartDuJour` : champs propres du nouveau modèle.
 */

import Link from "next/link";
import { Clock, MapPin, Ticket } from "lucide-react";
import type { DepartDuJour } from "@/lib/types/gare.types";

type DeparturesTabProps = {
  departs: DepartDuJour[];
};

const DeparturesTab = ({ departs }: DeparturesTabProps) => {
  if (departs.length === 0) {
    return (
      <p className="text-sm text-gray-400 text-center py-8">
        Aucun départ prévu depuis cette gare aujourd'hui.
      </p>
    );
  }

  return (
    <div>
      {/* Tableau — grands écrans */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="py-3 px-4">Heure</th>
              <th className="py-3 px-4">Destination</th>
              <th className="py-3 px-4">Agence</th>
              <th className="py-3 px-4">Classe</th>
              <th className="py-3 px-4">Prix</th>
              <th className="py-3 px-4">Places</th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {departs.map((d) => (
              <tr key={d.idVoyage} className="hover:bg-gray-50 transition">
                <td className="py-3 px-4 font-bold text-gray-900 whitespace-nowrap">
                  {d.heureDepartEffectif}
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-gray-700">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    {d.lieuArrive}
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-600 whitespace-nowrap">
                  {d.nomAgence ?? "—"}
                </td>
                <td className="py-3 px-4 text-gray-500 whitespace-nowrap">
                  {d.nomClasse ?? "—"}
                </td>
                <td className="py-3 px-4 font-semibold text-gray-800 whitespace-nowrap">
                  {d.prix != null
                    ? `${d.prix.toLocaleString("fr-FR")} FCFA`
                    : "—"}
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      d.nbrPlaceRestante === 0
                        ? "bg-red-50 text-red-600"
                        : d.nbrPlaceRestante <= 5
                          ? "bg-orange-50 text-orange-600"
                          : "bg-green-50 text-green-700"
                    }`}
                  >
                    {d.nbrPlaceRestante} place
                    {d.nbrPlaceRestante !== 1 ? "s" : ""}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {d.nbrPlaceRestante > 0 ? (
                    <Link
                      href={`/market-place/trip/${d.idVoyage}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary/90 transition"
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      Réserver
                    </Link>
                  ) : (
                    <span className="text-xs text-gray-400">Complet</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cartes — petits écrans */}
      <div className="md:hidden space-y-3">
        {departs.map((d) => (
          <div key={d.idVoyage} className="bg-gray-50 rounded-xl p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-gray-900">{d.lieuArrive}</p>
                <p className="text-xs text-gray-500 mt-0.5">{d.nomAgence}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary">
                  {d.heureDepartEffectif}
                </p>
                {d.nomClasse && (
                  <p className="text-xs text-gray-400">{d.nomClasse}</p>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
              <p className="text-sm font-semibold text-gray-700">
                {d.prix != null
                  ? `${d.prix.toLocaleString("fr-FR")} FCFA`
                  : "—"}
              </p>
              {d.nbrPlaceRestante > 0 ? (
                <Link
                  href={`/market-place/trip/${d.idVoyage}`}
                  className="px-4 py-1.5 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary/90"
                >
                  Réserver
                </Link>
              ) : (
                <span className="text-xs text-red-500 font-medium">
                  Complet
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeparturesTab;
