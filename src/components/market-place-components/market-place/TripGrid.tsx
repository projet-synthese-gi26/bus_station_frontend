import Image from "next/image";
import {ArrowRight, Calendar, Clock, MapPin, Users} from "lucide-react";
import React from "react";
import {formatDateOnly, formatDurationSimple} from "@/lib/services/date-services";
import CountdownTimer from "./CountdownTimer";
import {Trip} from "@/lib/types/models/Trip";
import { useRouter } from "next/navigation";


export interface TripGrid {
    filteredTrips: Partial<Trip>[],
    getClassColor: (classe: string) => string,
    getAmenityIcon: (amenity: string) => React.JSX.Element|null,
    navigate: (tripId: string) => void
}

export default function TripGrid( {filteredTrips, getClassColor, getAmenityIcon, navigate} : TripGrid)
{
    const router = useRouter();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTrips.map((trip) => {
                const now = new Date();
                const departureDate = trip.dateDepartPrev ? new Date(trip.dateDepartPrev) : null;
                const isPastTrip = departureDate ? departureDate < now : false;

                let hoursUntilDeparture = Infinity;
                if (departureDate) {
                    hoursUntilDeparture = (departureDate.getTime() - now.getTime()) / (1000 * 60 * 60);
                }

                const canPayDirectly = hoursUntilDeparture > 0 && hoursUntilDeparture <= 2;

                return (
                    <div
                        onClick={() => !isPastTrip && navigate(trip.idVoyage || "")}
                        key={trip.idVoyage}
                        className={`bg-gray-100 rounded-2xl shadow-sm overflow-hidden transition-all duration-300 group ${
                            !isPastTrip ? 'cursor-pointer hover:shadow-xl transform hover:-translate-y-2' : 'opacity-70'
                        }`}
                    >
                        <div className="relative h-48 overflow-hidden">
                            <Image
                                width={400}
                                height={300}
                                src={trip.bigImage || "/placeholder.svg"}
                                alt={`${trip.nomAgence} trip`}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            <div
                                className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold ${getClassColor(trip.nomClasseVoyage || "")}`}
                            >
                                {trip.nomClasseVoyage}
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4 ">{trip.nomAgence}</h3>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <div
                                            className="ml-2 h-7 w-7 rounded-full bg-red-100 flex items-center justify-center">
                                            <MapPin className="h-4 w-4 text-red-400"/>
                                        </div>
                                        <span className="text-sm">{trip.lieuDepart}</span>
                                        <ArrowRight className="h-4 w-4"/>
                                        <span className="text-sm">{trip.lieuArrive}</span>
                                    </div>
                                </div>
                                <div className="text-right flex gap-2">
                                    <p className="text-2xl font-bold text-primary">{trip?.prix && trip.prix.toLocaleString()}</p>
                                    <p className="mt-2 text-sm text-primary">FCFA</p>
                                </div>
                            </div>

                            {trip.dateDepartPrev && !isPastTrip &&
                                <CountdownTimer departureDateTime={trip.dateDepartPrev} />
                            }

                            <div className="mb-3 ml-2">
                                <p className="text-sm font-semibold text-gray-800 bg-gray-100 inline-block px-2 py-1 rounded">{trip.nomAgence}</p>
                            </div>
                            <div className="space-y-3 mb-6 ml-2">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                        <Calendar className="h-4 w-4 text-blue-600"/>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Travel Date</p>
                                        <p className="font-semibold text-gray-900">{trip.dateDepartPrev && formatDateOnly(trip.dateDepartPrev)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                                        <Clock className="h-4 w-4 text-blue-600"/>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Duration</p>
                                        <p className="font-semibold text-gray-900">
                                            {formatDurationSimple(trip.dureeVoyage && trip.dureeVoyage || "0")}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                                        <Users className="h-4 w-4 text-blue-600"/>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Available Seats</p>
                                        <p className="font-semibold text-gray-900">
                                            {trip.nbrPlaceReservable}/{trip.nbrPlaceRestante} seats
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {trip.amenities && trip.amenities.map((amenity, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-sm"
                                    >
                                        {getAmenityIcon(amenity)}
                                        <span>{amenity}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (canPayDirectly) {
                                        router.push(`/payment?tripId=${trip.idVoyage}`);
                                    } else if (!isPastTrip) {
                                        navigate(trip.idVoyage || "");
                                    }
                                }}
                                disabled={isPastTrip}
                                className={`w-full px-4 py-3 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg transform hover:scale-105 ${
                                    isPastTrip
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : canPayDirectly
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : 'bg-primary hover:bg-blue-700'
                                }`}
                            >
                                {isPastTrip ? "Trip Expired" : canPayDirectly ? "Pay Directly" : "Book This Trip"}
                            </button>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}