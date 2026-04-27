import React from "react";
import Image from "next/image";
import {
    Calendar,
    Clock,
    Users,
    AlertTriangle,
    CheckCircle2
} from "lucide-react";
import {Reservation, ReservationDetails} from "@/lib/types/models/Reservation";
import {Trip} from "@/lib/types/models/Trip";
import {TravelAgency} from "@/lib/types/models/Agency";
import {formatDateOnly, formatDateToTime} from "@/lib/services/date-services";
import {FaDollarSign} from "react-icons/fa";


interface TripListItemProps {
    reservationDetails: ReservationDetails;
    onPayment: () => void;
    onCancel: () => void;
    onViewDetails: () => void;
}

export default function TripListItem({ reservationDetails, onPayment, onCancel, onViewDetails }: TripListItemProps) {


    const tripDetails: Trip = reservationDetails?.voyage;
    const reservation:Reservation = reservationDetails?.reservation;
    const agencyInfo: TravelAgency = reservationDetails?.agence;

    const needsPayment:boolean = reservation?.statutReservation === "RESERVER";
    const remainingAmount:number = (reservation?.prixTotal || 0) - (reservation?.montantPaye || 0);


    function getStatusInfo (status: string, statutReservation: string)
    {
        if (status === "CONFIRMER" && statutReservation === "CONFIRMER") {
            return {
                label: "Paid",
                color: "bg-green-100 text-green-700 border-green-200",
                icon: CheckCircle2
            };
        } else if (status === "CONFIRMER") {
            return {
                label: "Confirmed",
                color: "bg-blue-100 text-blue-700 border-blue-200",
                icon: CheckCircle2
            };
        } else {
            return {
                label: "Pending",
                color: "bg-orange-100 text-orange-700 border-orange-200",
                icon: AlertTriangle
            };
        }
    }

    const statusInfo = getStatusInfo(reservation?.statutPayement, reservation?.statutReservation);

    return (
        <div className="bg-gray-100 rounded-lg border border-gray-100 p-4 hover:shadow-sm transition-all duration-200">
            <div className="flex items-center gap-4">
                {/* Image */}
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                        src={tripDetails?.bigImage || "/placeholder.svg"}
                        alt="Trip"
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Main Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <h3 className="font-semibold text-gray-900 truncate">
                                {tripDetails?.lieuDepart} → {tripDetails?.lieuArrive}
                            </h3>
                            <p className="text-sm text-gray-600 truncate">{agencyInfo?.longName}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                                <statusInfo.icon className="h-3 w-3" />
                                {statusInfo.label}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                                <FaDollarSign className={"h-4 w-4 text-primary text-md"}/>
                                <p className="font-extrabold text-md text-primary">{Number.parseInt(String(reservation?.prixTotal || 0)).toLocaleString()} FCFA</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDateOnly(tripDetails?.dateDepartEffectif)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{formatDateToTime(tripDetails?.heureDepartEffectif)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>{reservation?.nbrPassager} Passenger(s)</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                {needsPayment && (
                                    <div className="text-xs text-orange-600">
                                        {remainingAmount.toLocaleString()} FCFA remaining
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2">
                                {needsPayment && (
                                    <button
                                        onClick={onPayment}
                                        className="bg-orange-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
                                    >
                                        Pay
                                    </button>
                                )}
                                <button
                                    onClick={onViewDetails}
                                    className="bg-primary text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                                >
                                    Details
                                </button>
                                <button
                                    onClick={onCancel}
                                    className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}