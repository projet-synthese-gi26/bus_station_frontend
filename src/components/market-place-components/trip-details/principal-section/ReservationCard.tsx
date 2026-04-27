import React, {JSX} from "react";
import {Calendar, Clock, MapPin, Users} from "lucide-react";
import {formatDateOnly, formatDateToTime, formatFullDateTime} from "@/lib/services/date-services";
import {PrincipalSectionInterface} from "@/components/market-place-components/trip-details/principal-section/PrincipalSection";

export default function ReservationCard({tripDetails, setCanOpenReservationModal}:PrincipalSectionInterface): JSX.Element
{
    return (
        <>
            <div
                className="lg:mt-5 mt-0 bg-gradient-to-r from-gray-50 via-gray-100 to-gray-200 rounded-2xl shadow-lg border border-gray-100 p-6">
                {/* Price */}
                <div className="mb-6">
                    <div className="flex items-baseline gap-2 mb-2">
                            <span
                                className="text-4xl font-bold text-blue-600">{(tripDetails.prix ?? 0).toLocaleString()}</span>
                        <span className="text-lg text-blue-600 font-semibold">FCFA</span>
                        <span className="text-gray-500">/person</span>
                    </div>
                    <div className="lg:ml-0 ml-2 flex items-center gap-2 text-sm text-gray-600">
                        <Users className="h-4 w-4"/>
                        <span>Only <span className="font-extrabold text-black">{tripDetails.nbrPlaceReservable}</span> seats left at this price</span>
                    </div>
                </div>

                {/* Trip Details */}
                <div className="space-y-6 mb-6">
                    <div className="flex items-start gap-3">
                        <div
                            className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <MapPin className="h-5 w-5 text-blue-600"/>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Departure</p>
                            <p className="font-semibold text-gray-900">
                                {tripDetails.lieuDepart} - {tripDetails.pointDeDepart}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div
                            className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                            <MapPin className="h-5 w-5 text-red-600"/>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Arrival</p>
                            <p className="font-semibold text-gray-900">
                                {tripDetails.lieuArrive} - {tripDetails.pointArrivee}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div
                            className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <Calendar className="h-5 w-5 text-blue-600"/>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Travel Date</p>
                            <p className="font-semibold text-gray-900">{formatDateOnly(tripDetails.dateDepartPrev)}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div
                            className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <Clock className="h-5 w-5 text-blue-600"/>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Departure Time</p>
                            <p className="font-semibold text-gray-900">{formatDateToTime(tripDetails.heureDepartEffectif)}</p>
                        </div>
                    </div>
                </div>

                {/* Book button */}
                <div className="lg:mt-0 mt-3 flex justify-center">
                    <button
                        onClick={() => setCanOpenReservationModal(true)}
                        className="lg:w-full px-6  lg:py-4 py-2.5  bg-primary hover:bg-blue-800 cursor-pointer text-white rounded-xl font-semibold text-lg  transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        Book This Trip
                    </button>
                </div>


                <p className="text-center  text-sm text-red-500 font-semibold mt-4">
                    Booking deadline: {formatFullDateTime(tripDetails.dateLimiteReservation ?? "")}
                </p>
            </div>
        </>
    )
}