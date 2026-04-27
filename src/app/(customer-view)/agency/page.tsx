"use client";
/**
 * app/(customer-view)/agency/page.tsx  (reconstruit — P-04)
 *
 * Page listing public de toutes les agences.
 * Filtre par gare + recherche par nom.
 */

import {
  Building2,
  Search,
  Globe,
  AlertCircle,
  RefreshCw,
  MapPin,
} from "lucide-react";
import AgencyCard from "@/components/agencies-page-components/AgencyCard";
import Loader from "@/modals/Loader";
import { useAgencies } from "@/lib/hooks/agency-public-hooks/useAgencies";
import { useGares } from "@/lib/hooks/agency-public-hooks/useGares";

export default function AgenciesPage() {
  const {
    agencies,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    selectedGareId,
    setSelectedGareId,
    refetch,
  } = useAgencies();

  const { gares } = useGares();

  // ── États ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader message="Chargement des agences..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center gap-4">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <p className="text-gray-500">{error}</p>
        <button
          onClick={refetch}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition"
        >
          <RefreshCw size={15} />
          Réessayer
        </button>
      </div>
    );
  }

  // ── Rendu ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Nos agences partenaires
            </h1>
          </div>
          <p className="text-gray-500 text-sm ml-11">
            {agencies.length} agence{agencies.length !== 1 ? "s" : ""}{" "}
            disponible{agencies.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Barre de recherche + filtre gare */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          {/* Recherche */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom ou ville..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm
                focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                transition"
            />
          </div>

          {/* Filtre par gare */}
          {gares.length > 0 && (
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <select
                value={selectedGareId ?? ""}
                onChange={(e) =>
                  setSelectedGareId(
                    e.target.value ? Number(e.target.value) : null,
                  )
                }
                className="pl-9 pr-8 py-2.5 border border-gray-200 rounded-xl bg-white text-sm
                  text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30
                  focus:border-primary transition appearance-none min-w-[180px]"
              >
                <option value="">Toutes les gares</option>
                {gares.map((g) => (
                  <option key={g.idGare} value={g.idGare}>
                    {g.nom}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Grille ou état vide */}
        {agencies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {agencies.map((agency) => (
              <AgencyCard key={agency.agencyId} agency={agency} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <Globe className="w-7 h-7 text-blue-300" />
            </div>
            <h3 className="font-semibold text-gray-700 mb-1">
              Aucune agence trouvée
            </h3>
            <p className="text-sm text-gray-400">
              {searchQuery
                ? `Aucun résultat pour "${searchQuery}"`
                : "Aucune agence disponible pour le moment."}
            </p>
            {(searchQuery || selectedGareId) && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedGareId(null);
                }}
                className="mt-4 text-sm text-primary underline underline-offset-2"
              >
                Effacer les filtres
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
