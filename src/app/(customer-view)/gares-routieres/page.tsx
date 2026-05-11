"use client";

import React, { JSX } from "react";
import { useGaresRoutieres } from "@/lib/hooks/gare-hooks/useGaresRoutieres";
import StationCard from "@/components/bus-stations-page-components/StationCard";
import Loader from "@/modals/Loader";
import GaresHeader from "@/components/gares-routieres-components/GaresHeader";
import GaresFilters from "@/components/gares-routieres-components/GaresFilters";
import NoGareFound from "@/components/gares-routieres-components/NoGareFound";
import GaresError from "@/components/gares-routieres-components/GaresError";

export default function GaresRoutieresPage(): JSX.Element {
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

  if (isLoading) return <Loader message="Chargement des gares routières..." />;

  return (
    <div className="min-h-screen p-2">
      <GaresHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        totalCount={gares.length}
      />
      <GaresFilters
        allServices={allServices ?? []}
        selectedServices={selectedServices}
        handleServiceToggle={handleServiceToggle}
      />
      {gares.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {gares.map((gare) => (
            <StationCard key={gare.idGare} station={gare} />
          ))}
        </div>
      )}
      {gares.length === 0 && !error && (
        <NoGareFound searchQuery={searchQuery} onClear={() => setSearchQuery("")} />
      )}
      {error && <GaresError error={error} onRetry={refetch} />}
    </div>
  );
}