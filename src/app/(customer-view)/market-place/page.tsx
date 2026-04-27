"use client"

import React, {JSX} from "react"
import MarketPlaceHeader from "@/components/market-place-components/market-place/Market-Place-Header";
import Filters from "@/components/market-place-components/market-place/Filters";
import TripGrid from "@/components/market-place-components/market-place/TripGrid";
import Loader from "@/components/market-place-components/market-place/loader";
import {useMarketPlace} from "@/lib/hooks/market-place/useMarketPlace";
import {useNavigation} from "@/lib/hooks/useNavigation";
import NoTripFound from "@/components/market-place-components/market-place/NoTripFound";
import TripError from "@/components/market-place-components/market-place/TripError";




export interface SearchFilterType {
    departure: string;
    arrival: string;
    date: string;
}

export default function MarketPlace(): JSX.Element {


    const marketPlace = useMarketPlace();
    const navigate = useNavigation();



    if (marketPlace.isLoading) return <Loader/>
    return (
        <div className="min-h-screen p-2">
            {/* Header avec recherche */}
            <MarketPlaceHeader
                searchFilters={marketPlace.searchFilters}
                setSearchFilters={marketPlace.setSearchFilters}
                handleSearch={marketPlace.handleSearch}
            />

            {/* Filtres */}
            <Filters
                activeFilter={marketPlace.activeFilter}
                setActiveFilter={marketPlace.setActiveFilter}
            />

            {/* Grille des voyages */}
            <TripGrid
                filteredTrips={marketPlace.filteredTrips || []}
                getClassColor={marketPlace.getClassColor}
                getAmenityIcon={marketPlace.getAmenityIcon}
                navigate = {navigate.onGoToTripDetail}
            />

            {/* Pagination */}
            {marketPlace.filteredTrips && marketPlace.filteredTrips.length > 0 && (
                <div className="flex justify-center mt-12">
                    <div className="flex items-center gap-2">
                        <button className="w-10 h-10 rounded-lg bg-white border-2 border-gray-200 text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-600 transition-colors flex items-center justify-center">
                            ←
                        </button>
                        <button className="w-10 h-10 rounded-lg bg-blue-600 text-white font-semibold flex items-center justify-center shadow-lg">
                            1
                        </button>
                        <button className="w-10 h-10 rounded-lg bg-white border-2 border-gray-200 text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-600 transition-colors flex items-center justify-center">
                            2
                        </button>
                        <button className="w-10 h-10 rounded-lg bg-white border-2 border-gray-200 text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-600 transition-colors flex items-center justify-center">
                            3
                        </button>
                        <span className="px-2 text-gray-500">...</span>
                        <button className="w-10 h-10 rounded-lg bg-white border-2 border-gray-200 text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-600 transition-colors flex items-center justify-center">
                            →
                        </button>
                    </div>
                </div>
            )}

            {/* Any trip found */}
            {marketPlace.filteredTrips && marketPlace.filteredTrips.length === 0 && (
                <NoTripFound/>
            )}

            {/* Loading error */}
            {marketPlace.filteredTrips === null && (
                <TripError error={marketPlace.error}/>
            )}
        </div>
    )
}
