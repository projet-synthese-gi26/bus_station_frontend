import { Calendar, MapPin, Search, ArrowRight } from "lucide-react";
import { SearchFilterType } from "@/app/(customer-view)/market-place/page";

export interface MarketPlaceHeaderProps {
  searchFilters: SearchFilterType;
  setSearchFilters: (searchFilters: SearchFilterType) => void;
  handleSearch: () => void;
}

export default function MarketPlaceHeader({
  searchFilters,
  setSearchFilters,
  handleSearch,
}: MarketPlaceHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-600 via-blue-700 to-indigo-800 mb-6 px-4 sm:px-6 py-8 sm:py-10 text-white shadow-xl">
      {/* Cercles décoratifs */}
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/5 rounded-full pointer-events-none" />

      <div className="relative max-w-3xl mx-auto text-center mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-3xl font-bold mb-2">Trouvez votre prochain voyage</h1>
        <p className="text-blue-200 text-xs sm:text-sm">
          Des centaines de destinations disponibles, réservez en quelques clics.
        </p>
      </div>

      {/* Barre de recherche */}
      <div className="relative max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-2 flex flex-col sm:flex-row gap-2">

          {/* Départ */}
          <div className="flex items-center gap-2 flex-1 min-w-0 px-3 py-2 rounded-xl hover:bg-gray-50 transition">
            <MapPin className="h-4 w-4 text-blue-500 shrink-0" />
            <input
              type="text"
              placeholder="Ville de départ"
              value={searchFilters.departure}
              onChange={(e) => setSearchFilters({ ...searchFilters, departure: e.target.value })}
              className="w-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent min-w-0"
            />
          </div>

          <div className="hidden sm:flex items-center text-gray-300 shrink-0">
            <ArrowRight className="h-4 w-4" />
          </div>

          {/* Arrivée */}
          <div className="flex items-center gap-2 flex-1 min-w-0 px-3 py-2 rounded-xl hover:bg-gray-50 transition">
            <MapPin className="h-4 w-4 text-indigo-500 shrink-0" />
            <input
              type="text"
              placeholder="Ville d'arrivée"
              value={searchFilters.arrival}
              onChange={(e) => setSearchFilters({ ...searchFilters, arrival: e.target.value })}
              className="w-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent min-w-0"
            />
          </div>

          {/* Date */}
          <div className="flex items-center gap-2 flex-1 min-w-0 px-3 py-2 rounded-xl hover:bg-gray-50 transition">
            <Calendar className="h-4 w-4 text-blue-500 shrink-0" />
            <input
              type="date"
              value={searchFilters.date}
              onChange={(e) => setSearchFilters({ ...searchFilters, date: e.target.value })}
              className="w-full min-w-0 text-sm text-gray-600 focus:outline-none bg-transparent"
            />
          </div>

          {/* Bouton */}
          <button
            onClick={handleSearch}
            className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 py-2.5 text-sm font-semibold flex items-center justify-center gap-2 transition shadow-md hover:shadow-lg shrink-0 w-full sm:w-auto"
          >
            <Search className="h-4 w-4" />
            Rechercher
          </button>
        </div>
      </div>
    </div>
  );
}