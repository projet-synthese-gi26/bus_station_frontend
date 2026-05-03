"use client";
/**
 * /agency/page.tsx — Liste publique des agences (P-04)
 *
 * Design : hero avec gradient et pattern, recherche flottante, filtres
 * en chips par gare, stats banner, grille responsive de cartes.
 *
 * Source de données :
 *   - GET /agence              → toutes les agences (paginé)
 *   - GET /gare                → liste pour le filtre par gare
 *   - GET /agence/gare-routiere/{gareId} → si une gare est sélectionnée
 */

import React, { useEffect, useState, useMemo } from "react";
import {
  Search,
  Building2,
  Bus,
  Filter,
  X,
  MapPin,
  Compass,
} from "lucide-react";
import {
  getAllAgences,
  getAgencesByGareRoutiere,
} from "@/lib/services/agency-service";
import { getGares } from "@/lib/services/gare-service";
import AgencyCard from "@/components/agencies-page-components/AgencyCard";
import type { AgenceVoyageFull } from "@/lib/types/agence.types";
import type { Gare } from "@/lib/types/gare.types";

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const AgencyCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
    <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200" />
    <div className="pt-9 pb-4 px-4 space-y-2">
      <div className="h-4 bg-gray-100 rounded w-3/4" />
      <div className="h-3 bg-gray-100 rounded w-1/2" />
      <div className="h-3 bg-gray-100 rounded w-full mt-3" />
      <div className="h-3 bg-gray-100 rounded w-2/3" />
    </div>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AgencyListPage() {
  const [agences, setAgences] = useState<AgenceVoyageFull[]>([]);
  const [gares, setGares] = useState<Gare[]>([]);
  const [search, setSearch] = useState("");
  const [selectedGareId, setSelectedGareId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingFilter, setIsLoadingFilter] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charge initial : agences + gares en parallèle
  useEffect(() => {
    const load = async () => {
      try {
        const [agencesData, garesData] = await Promise.all([
          getAllAgences({ size: 100 }),
          getGares({ size: 100 }),
        ]);
        setAgences(agencesData);
        setGares(garesData);
      } catch {
        setError("Impossible de charger les agences.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // Recharge quand on change la gare sélectionnée
  useEffect(() => {
    if (selectedGareId === null) return; // état initial, géré par le useEffect précédent
    const load = async () => {
      setIsLoadingFilter(true);
      try {
        const data = selectedGareId
          ? await getAgencesByGareRoutiere(selectedGareId)
          : await getAllAgences({ size: 100 });
        setAgences(data);
      } finally {
        setIsLoadingFilter(false);
      }
    };
    load();
  }, [selectedGareId]);

  // Filtre côté client par recherche texte + statut actif
  const filtered = useMemo(() => {
    let result = agences.filter((a) => a.statutAgence !== "SUSPENDUE");
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.longName?.toLowerCase().includes(q) ||
          a.shortName?.toLowerCase().includes(q) ||
          a.location?.toLowerCase().includes(q),
      );
    }
    return result;
  }, [agences, search]);

  const handleClearFilters = () => {
    setSearch("");
    setSelectedGareId(null);
  };

  return (
    <div className="min-h-full -mx-4 -mt-4">
      {/* ═══════════════════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 px-4 pt-12 pb-32">
        {/* Pattern décoratif */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />

        {/* Cercles décoratifs flous */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-20 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-blue-200 text-sm font-medium mb-3">
            <Compass className="w-4 h-4" />
            <span>Découvrir nos partenaires</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 leading-tight">
            Agences de Voyage
          </h1>
          <p className="text-blue-100 text-base max-w-2xl mb-6 leading-relaxed">
            Trouvez l&apos;agence qui correspond à votre trajet. Comparez,
            choisissez et réservez en quelques clics.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          BARRE DE RECHERCHE FLOTTANTE (chevauche le hero)
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="relative -mt-20 px-4 z-10">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-2 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une agence par nom ou ville..."
              className="w-full pl-12 pr-4 py-3 bg-transparent border-0 focus:outline-none text-gray-900 placeholder:text-gray-400"
            />
          </div>
          {(search || selectedGareId) && (
            <button
              onClick={handleClearFilters}
              className="px-3 py-2 text-xs font-medium text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1"
            >
              <X className="w-4 h-4" /> Effacer
            </button>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          CONTENU
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Filtres par gare */}
        {gares.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4 text-gray-500" />
              <p className="text-sm font-semibold text-gray-700">
                Filtrer par gare
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedGareId(null)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all
                  ${
                    !selectedGareId
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600"
                  }`}
              >
                Toutes ({agences.length})
              </button>
              {gares.slice(0, 8).map((gare) => (
                <button
                  key={gare.idGare}
                  onClick={() => setSelectedGareId(gare.idGare)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5
                    ${
                      selectedGareId === gare.idGare
                        ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                        : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600"
                    }`}
                >
                  <MapPin className="w-3 h-3" />
                  {gare.nom || gare.ville}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Erreur */}
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
            <p className="text-red-700 font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-sm text-red-600 hover:underline font-medium"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Loading initial */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <AgencyCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Loading filtre */}
        {!isLoading && isLoadingFilter && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 opacity-50">
            {Array.from({ length: 3 }).map((_, i) => (
              <AgencyCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isLoadingFilter && !error && filtered.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
              <Bus className="w-10 h-10 text-blue-300" />
            </div>
            <p className="text-gray-700 font-semibold text-lg">
              Aucune agence trouvée
            </p>
            <p className="text-gray-500 text-sm mt-1">
              {search || selectedGareId
                ? "Essayez de modifier vos critères de recherche."
                : "Revenez plus tard pour découvrir nos partenaires."}
            </p>
            {(search || selectedGareId) && (
              <button
                onClick={handleClearFilters}
                className="mt-4 inline-flex items-center gap-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <X className="w-4 h-4" /> Effacer les filtres
              </button>
            )}
          </div>
        )}

        {/* Liste */}
        {!isLoading && !error && filtered.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-gray-500">
                <strong className="text-gray-900">{filtered.length}</strong>{" "}
                agence{filtered.length > 1 ? "s" : ""} trouvée
                {filtered.length > 1 ? "s" : ""}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((agency) => (
                <AgencyCard key={agency.agencyId} agency={agency} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
// END OF FILE: src/app/(customer-view)/agency/page.tsx
