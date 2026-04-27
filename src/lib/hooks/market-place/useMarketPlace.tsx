import {useEffect, useState} from "react";
import {SearchFilterType} from "@/app/(customer-view)/market-place/page";
import { Wifi, Snowflake, Usb } from "lucide-react";
import {Trip} from "@/lib/types/models/Trip";
import {retrieveAllTrips} from "@/lib/services/trip-service";



export function useMarketPlace()
{


    const [availableTrips, setAvailableTrips] = useState<Partial<Trip>[] | null>(null);
    const [filteredTrips, setFilteredTrips] = useState<Partial<Trip>[]|null>(null);
    const [error, setError] = useState<string|null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [activeFilter, setActiveFilter] = useState<string>("all");
    const [searchFilters, setSearchFilters] = useState<SearchFilterType>({
        departure: "",
        arrival: "",
        date: "",
    });



    useEffect(() => {
        fetchAvailableTrips();
    }, [])


    useEffect(() => {
        filterTrips();
    }, [activeFilter, availableTrips]);



    function filterTrips() {
        if (activeFilter === "all") {
            setFilteredTrips(availableTrips)
        }
        else
        {
            const filtered = availableTrips && availableTrips.filter(
                (trip) => trip.lieuDepart === activeFilter || trip.lieuArrive === activeFilter,
            )
            setFilteredTrips(filtered)
        }
    }




    async function fetchAvailableTrips() {

            setIsLoading(true)
            await retrieveAllTrips()
                .then((result) => {
                    if(result)
                    {
                        console.log(result);
                        setAvailableTrips(result.content);
                        setFilteredTrips(result.content);
                    }
                    else
                    {
                        setFilteredTrips(null);
                        setAvailableTrips(null);
                    }
                })
                .catch(() => {
                    setAvailableTrips(null);
                    setFilteredTrips(null);
                    setError("Something went wrong when retrieving all trips. If the problem persists please contact the support at support@busstation.com or +237 690878909");

                })
                .finally(()=> setIsLoading(false));

    }



    function handleSearch()
    {
        let filtered = availableTrips

        if (searchFilters.departure) {
            filtered = filtered && filtered.filter((trip) =>
                {
                    if(trip?.lieuDepart) trip.lieuDepart.toLowerCase().includes(searchFilters.departure.toLowerCase());
                }
            )
        }

        if (searchFilters.arrival) {
            filtered = filtered && filtered.filter((trip) =>
                {
                    if (trip?.lieuArrive) trip.lieuArrive.toLowerCase().includes(searchFilters.arrival.toLowerCase());
                }
            )
        }
        setFilteredTrips(filtered);
    }



    function getClassColor(className: string) {
        switch (className.toLowerCase()) {
            case "vip":
                return "bg-blue-600 text-white"
            case "premium":
                return "bg-blue-500 text-white"
            case "standard":
                return "bg-blue-400 text-white"
            case "economy":
                return "bg-gray-500 text-white"
            default:
                return "bg-gray-500 text-white"
        }
    }


    function getAmenityIcon(amenity: string) {
        switch (amenity.toLowerCase()) {
            case "wifi":
                return <Wifi className="h-4 w-4"/>
            case "ac":
                return <Snowflake className="h-4 w-4" />
            case "usb":
                return <Usb className="h-4 w-4" />
            default:
                return null
        }
    }

    return {
        handleSearch,
        getAmenityIcon,
        getClassColor,
        isLoading,
        filteredTrips,
        activeFilter,
        setActiveFilter,
        searchFilters,
        setSearchFilters,
        error,
    }
}