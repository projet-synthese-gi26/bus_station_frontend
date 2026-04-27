import React from "react";
import {
    MapPin,
    Calendar,
    Clock,
    Users,
    CreditCard,
    AlertCircle,
    Truck,
    AlertTriangle
} from "lucide-react";
import { FaHouse, FaExclamation } from "react-icons/fa6";
import { BiStar } from "react-icons/bi";
import { formatDateOnly, formatDateToTime } from "@/lib/services/date-services";
import { ReservationDetails } from "@/lib/types/models/Reservation";

interface ReservationSummaryProps {
    reservationDetails: ReservationDetails;
}

export default function ReservationSummary({ reservationDetails }: ReservationSummaryProps) {
    const isConfirmed = reservationDetails?.reservation?.statutReservation === "CONFIRMER";

    return (
        <div className="bg-gray-100 rounded-lg overflow-hidden shadow-md">
            <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between mb-4 sm:mb-7">
                    <div className="flex items-center gap-2 mb-4 sm:mb-0">
                        <MapPin className="text-primary h-8 w-8 sm:h-10 sm:w-10" />
                        <div>
                            <p className="text-lg sm:text-xl text-gray-500">Route</p>
                            <p className="font-bold text-sm sm:text-md">
                                {reservationDetails?.voyage?.titre}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 sm:gap-4 items-center">
                        <span className={`flex justify-center items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                            isConfirmed
                                ? "bg-green-100 text-green-600 border-2 border-green-300"
                                : "bg-orange-100 text-orange-600 border-2 border-orange-300"
                        }`}>
                            <FaExclamation className="mr-1" />
                            {isConfirmed ? "confirmed" : "waiting for confirmation"}
                        </span>
                        <span className="flex gap-0.5 justify-center items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-blue-100 border-2 border-blue-300 text-primary">
                            <BiStar className="w-3 h-3 sm:w-4 sm:h-4" />
                            {reservationDetails?.voyage?.nomClasseVoyage || "not specified"}
                        </span>
                    </div>
                </div>

                <div className="ml-0 sm:ml-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Colonne 1 */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <FaHouse className="text-primary h-6 w-6" />
                            <div>
                                <p className="text-md text-gray-500">Agency</p>
                                <p className="font-bold">
                                    {reservationDetails?.agence?.longName || "not specified"}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Truck className="text-primary h-6 w-6" />
                            <div>
                                <p className="text-md text-gray-500">Bus</p>
                                <p className="font-bold">
                                    {reservationDetails?.voyage?.vehicule?.plaqueMatricule || "not specified"}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="text-primary h-6 w-6" />
                            <div>
                                <p className="text-md text-gray-500">Departure Date</p>
                                <p className="font-bold">
                                    {reservationDetails?.voyage?.dateDepartEffectif
                                        ? formatDateOnly(reservationDetails?.voyage?.dateDepartEffectif)
                                        : "not specified"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Colonne 2 */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Clock className="text-primary h-6 w-6" />
                            <div>
                                <p className="text-md text-gray-500">Departure time</p>
                                <p className="font-bold">
                                    {reservationDetails?.voyage?.heureDepartEffectif
                                        ? formatDateToTime(reservationDetails?.voyage?.heureDepartEffectif)
                                        : "not specified"}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="text-primary h-6 w-6" />
                            <div>
                                <p className="text-md text-gray-500">Departure Location</p>
                                <p className="font-bold">
                                    {reservationDetails?.voyage?.lieuDepart && reservationDetails?.voyage?.pointDeDepart
                                        ? `${reservationDetails.voyage.lieuDepart} - ${reservationDetails.voyage.pointDeDepart}`
                                        : reservationDetails?.voyage?.lieuDepart || "not specified"}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="text-primary h-6 w-6" />
                            <div>
                                <p className="text-md text-gray-500">Arrival Location</p>
                                <p className="font-bold">
                                    {reservationDetails?.voyage?.lieuArrive && reservationDetails?.voyage?.pointArrivee
                                        ? `${reservationDetails.voyage.lieuArrive} - ${reservationDetails.voyage.pointArrivee}`
                                        : reservationDetails?.voyage?.lieuArrive || "not specified"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Colonne 3 */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Users className="text-primary h-6 w-6" />
                            <div>
                                <p className="text-md text-gray-500">Passengers</p>
                                <p className="font-bold">
                                    {/*reservationDetails?.passager?.length || **/0} passenger(s)
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <CreditCard className="text-primary h-6 w-6" />
                            <div>
                                <p className="text-md text-gray-500">Amount Paid</p>
                                <p className="font-bold">
                                    {reservationDetails?.reservation?.montantPaye.toFixed(2).toLocaleString()} FCFA
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <AlertCircle className="text-primary h-6 w-6" />
                            <div>
                                <p className="text-md text-gray-500">Payment Deadline</p>
                                <p className="font-bold">
                                    {reservationDetails?.voyage?.dateLimiteConfirmation
                                        ? formatDateOnly(reservationDetails?.voyage?.dateLimiteConfirmation)
                                        : "not specified"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cancellation Policy */}
            <div className="bg-orange-50 p-4">
                <h3 className="font-semibold text-orange-600 flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-10 w-10" />
                    <p className="text-xl mt-1">Cancellation Policy</p>
                </h3>
                <p className="text-md ml-10 text-justify text-orange-800">
                    Cancellation policies vary by agency and take into account the time of year,
                    ticket price and the time between cancellation and travel date. Depending on
                    these criteria, cancellation fees may apply, or a coupon of varying value may
                    be generated for future use.
                </p>
            </div>
        </div>
    );
}