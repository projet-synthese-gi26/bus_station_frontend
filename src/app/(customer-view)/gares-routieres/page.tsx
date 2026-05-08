"use client";

import React from "react";
import { useGaresRoutieres } from "@/lib/hooks/gare-hooks/useGaresRoutieres";
import StationCard from "@/components/bus-stations-page-components/StationCard";
import Loader from "@/modals/Loader";
import { AlertCircle, Search, MapPin } from "lucide-react";

export default function GaresRoutieresPage() {
  const {
    gares,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    selectedServices,
    handleServiceToggle,
    allServices,
    refetch,
  } = useGaresRoutieres();

  // Si en cours de chargement, on affiche le loader
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader message="Chargement des gares routières..." />
      </div>
    );
  }

  // Si une erreur survient (réseau, 404, etc.)
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-4">
        <div className="bg-red-50 p-8 rounded-2xl border border-red-100 max-w-md w-full shadow-sm">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-700 font-medium mb-6">{error}</p>
          <button
            onClick={refetch}
            className="px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-blue-700 transition font-semibold w-full"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* En-tête et Titre */}
      <div className="text-center space-y-4 mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Trouvez votre gare routière
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Découvrez les meilleures gares routières pour vos départs et arrivées.
        </p>
      </div>

      {/* Barre de recherche */}
      <div className="max-w-2xl mx-auto relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher par nom, ville ou quartier..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-2xl bg-white shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent transition outline-none"
        />
      </div>

      {/* Filtres de services dynamiques */}
      {allServices && allServices.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
          <span className="text-sm font-semibold text-gray-500 mr-2">Services :</span>
          {allServices.map((service) => (
            <button
              key={service}
              onClick={() => handleServiceToggle(service)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                selectedServices.includes(service)
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              {service.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      )}

      {/* Liste des gares */}
      {gares.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-6">
          {gares.map((gare) => (
            <StationCard key={gare.idGare} station={gare} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm mt-8">
          <div className="mx-auto w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <MapPin className="h-10 w-10 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Aucune gare trouvée
          </h3>
          <p className="text-gray-500">
            Essayez de modifier vos termes de recherche ou vos filtres.
          </p>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="mt-6 text-sm font-medium text-primary hover:underline"
            >
              Effacer la recherche
            </button>
          )}
        </div>
      )}
    </div>
  );
}