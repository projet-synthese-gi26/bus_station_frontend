import {Calendar, MapPin, Search} from "lucide-react";
import {SearchFilterType} from "@/app/(customer-view)/market-place/page";


export interface MarketPlaceHeaderProps {
    searchFilters: SearchFilterType;
    setSearchFilters: (searchFilters: SearchFilterType)=> void;
    handleSearch: () => void;
}


export default function MarketPlaceHeader({searchFilters, setSearchFilters, handleSearch}: MarketPlaceHeaderProps)
{
    return(
    <div className="bg-gray-100 rounded-xl shadow-sm mb-8 p-5">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Available Trips</h1>
                <p className="text-sm text-gray-600">Discover amazing destinations and book your next adventure</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Departure city"
                            value={searchFilters.departure}
                            onChange={(e) => setSearchFilters({ ...searchFilters, departure: e.target.value })}
                            className="w-full pl-10 pr-4 py-2 border-2 border-primary rounded-xl focus:border-blue-800 focus:outline-none transition-colors duration-300"
                        />
                    </div>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Arrival city"
                            value={searchFilters.arrival}
                            onChange={(e) => setSearchFilters({ ...searchFilters, arrival: e.target.value })}
                            className="w-full pl-10 pr-4 py-2 border-2 border-primary rounded-xl focus:border-blue-800 focus:outline-none transition-colors duration-300"
                        />
                    </div>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600 h-5 w-5" />
                        <input
                            type="date"
                            value={searchFilters.date}
                            onChange={(e) => setSearchFilters({ ...searchFilters, date: e.target.value })}
                            className="w-full pl-10 pr-4 py-2 border-2 border-primary rounded-xl focus:border-blue-800 focus:outline-none transition-colors duration-300"
                        />
                    </div>
                </div>
                <button
                    onClick={handleSearch}
                    className="cursor-pointer bg-blue-600 text-white rounded-xl px-4 py-2 hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                    <Search className="h-5 w-5" />
                    <span>Search</span>
                </button>
            </div>
        </div>
    </div>
    )
}