"use client";
/**
 * app/(customer-view)/gares-routieres/page.tsx  (mis à jour — P-06)
 *
 * Page listing de toutes les gares routières.
 * Conserve HeroSection, SearchBar, FilterBadges existants.
 * StationCard est mis à jour pour le nouveau type Gare.
 */

import HeroSection from "@/components/bus-stations-page-components/HeroSection";
import SearchBar from "@/components/bus-stations-page-components/SearchBar";
import FilterBadges from "@/components/bus-stations-page-components/FilterBadges";
import StationCard from "@/components/bus-stations-page-components/StationCard";
import Loader from "@/modals/Loader";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useGaresRoutieres } from "@/lib/hooks/gare-hooks/useGaresRoutieres";

const GaresRoutieresPage = () => {
  const {
    gares,
    isLoading,
    error,
    setSearchQuery,
    selectedServices,
    handleServiceToggle,
    allServices,
    refetch,
  } = useGaresRoutieres();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader message="Chargement des gares routières..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] text-center px-4">
        <div className="bg-red-100 p-4 rounded-full mb-4">
          <AlertCircle size={48} className="text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Erreur de chargement
        </h3>
        <p className="text-gray-500 mb-6">{error}</p>
        <button
          onClick={refetch}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition"
        >
          <RefreshCw size={18} />
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <HeroSection />

      <div className="mt-8 space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <SearchBar
            onSearchChange={setSearchQuery}
            placeholder="Rechercher par nom de gare ou par ville..."
          />
          <div className="text-sm text-gray-500 font-medium">
            {gares.length} gare{gares.length !== 1 ? "s" : ""} trouvée
            {gares.length !== 1 ? "s" : ""}
          </div>
        </div>

        {allServices.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-gray-600 mb-3">
              Filtrer par services :
            </h2>
            <FilterBadges
              services={allServices}
              selectedServices={selectedServices}
              onServiceToggle={handleServiceToggle}
            />
          </div>
        )}
      </div>

      <div className="mt-8">
        {gares.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gares.map((gare) => (
              <StationCard key={gare.idGare} station={gare} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Aucune gare trouvée
            </h3>
            <p className="text-gray-500">
              Essayez de modifier vos filtres ou votre recherche.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GaresRoutieresPage;
