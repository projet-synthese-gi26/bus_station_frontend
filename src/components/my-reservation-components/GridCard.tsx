import React from "react";
import Image from "next/image";
import {
    Calendar,
    Clock,
    Users,
    AlertTriangle,
    CheckCircle2
} from "lucide-react";
import { FaDollarSign } from "react-icons/fa";
import {formatDateOnly, formatDateToTime} from "@/lib/services/date-services";
import {GridCardTripProps} from "@/lib/types/ui";



export default function GridCardTrip({ reservationDetails, onPayment, onCancel, onViewDetails }: GridCardTripProps) {
    const tripDetails = reservationDetails?.voyage;
    const reservation = reservationDetails?.reservation;
    const agencyInfo = reservationDetails?.agence;

    const needsPayment = reservation?.statutReservation === "RESERVER";
    const remainingAmount = (reservation?.prixTotal || 0) - (reservation?.montantPaye || 0);

    function getStatusInfo  (statutReservation: string)
    {
        switch (statutReservation) {
            case "CONFIRMEE":
                return {
                    label: "Confirmed & Paid",
                    color: "bg-green-100 text-green-700 border-green-200",
                    icon: CheckCircle2
                };
            case "RESERVER":
                return {
                    label: "Reserved",
                    color: "bg-orange-100 text-orange-700 border-orange-200",
                    icon: AlertTriangle
                };
            case "ANNULEE":
                return {
                    label: "Cancelled",
                    color: "bg-red-100 text-red-700 border-red-200",
                    icon: AlertTriangle
                };
            default:
                return {
                    label: "Pending",
                    color: "bg-gray-100 text-gray-700 border-gray-200",
                    icon: AlertTriangle
                };
        }
    }
    const statusInfo = getStatusInfo(reservation?.statutReservation || "");

    return (
        <div className={` ${statusInfo.color && `border border-${statusInfo.color}`} bg-gray-100 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 group`}>
            {/* Image Header */}
            <div className="relative h-60 overflow-hidden">
                <Image
                    src={tripDetails?.bigImage || "/placeholder.svg"}
                    alt={`Trip from ${tripDetails?.lieuDepart} to ${tripDetails?.lieuArrive}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                        <statusInfo.icon className="h-3 w-3" />
                        {statusInfo.label}
                    </div>
                </div>


                {/* Route Info */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-bold text-lg mb-1">
                        {tripDetails?.lieuDepart || "N/A"} → {tripDetails?.lieuArrive || "N/A"}
                    </h3>
                    <p className="text-sm opacity-90">{agencyInfo?.longName || "Unknown Agency"}</p>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Date & Time */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>
                            Travel Date: <strong className="text-primary">{formatDateOnly(tripDetails?.dateDepartEffectif)}</strong>
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>At: <strong>{formatDateToTime(tripDetails?.heureDepartEffectif)}</strong></span>
                    </div>
                </div>

                {/* Price & Passengers */}
                <div className="flex flex-col gap-4 items-start mb-4">
                    <div className="flex gap-0.5">
                        <FaDollarSign className="text-gray-500 mt-1.5" />
                        <p className="text-md mt-1 mr-2">Price: </p>
                        <div className="flex gap-1 text-xl font-bold text-primary">
                            <p>{(reservation?.prixTotal || 0).toLocaleString()}</p>
                            <p className="text-xs mt-2">FCFA</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>Number of travellers: <strong>{reservation?.nbrPassager || 0}</strong></span>
                    </div>
                </div>

                {/* Payment Alert */}
                {needsPayment && remainingAmount > 0 && (
                    <div className="p-2 mb-3 flex justify-between">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-orange-600" />
                            <div className="text-xs text-orange-700">
                                <span className="font-semibold">{remainingAmount.toLocaleString()} FCFA</span> remaining
                            </div>
                        </div>

                        <button
                            onClick={onPayment}
                            className="cursor-pointer bg-orange-400 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-orange-500 transition-colors"
                        >
                            Pay
                        </button>
                    </div>
                )}

                {/* Actions */}
                <div className="flex justify-center gap-2">
                    <button
                        onClick={onViewDetails}
                        className="cursor-pointer bg-primary text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                        Details
                    </button>
                    {reservation?.statutReservation !== "ANNULEE" && (
                        <button
                            onClick={onCancel}
                            className="cursor-pointer bg-red-400 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-500 transition-colors"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}