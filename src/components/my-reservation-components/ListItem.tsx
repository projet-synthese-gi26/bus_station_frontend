import React from "react";
import Image from "next/image";
import {
    Calendar,
    Clock,
    Users,
    AlertTriangle,
    CheckCircle2
} from "lucide-react";
import { ReservationDetails } from "@/lib/types/models/Reservation";

interface TripListItemProps {
    trip: ReservationDetails;
    onPayment: () => void;
    onCancel: () => void;
    onViewDetails: () => void;
}

export default function TripListItem({ trip, onPayment, onCancel, onViewDetails }: TripListItemProps) {
    const tripDetails = trip?.voyage;
    const reservation = trip?.reservation;
    const agencyInfo = trip?.agence;

    const needsPayment = reservation?.statutReservation === "RESERVER";
    const remainingAmount = (reservation?.prixTotal || 0) - (reservation?.montantPaye || 0);

    const getStatusInfo = (statutReservation: string, statutPayement: string) => {
        if (statutPayement === "PAID") {
            return {
                label: "Paid",
                color: "bg-green-100 text-green-700 border-green-200",
                icon: CheckCircle2
            };
        }

        if (statutReservation === "CONFIRMEE") {
            return {
                label: "Confirmed",
                color: "bg-blue-100 text-blue-700 border-blue-200",
                icon: CheckCircle2
            };
        } else if (statutReservation === "RESERVER") {
            return {
                label: "Pending Payment",
                color: "bg-orange-100 text-orange-700 border-orange-200",
                icon: AlertTriangle
            };
        } else if (statutReservation === "ANNULEE") {
            return {
                label: "Cancelled",
                color: "bg-red-100 text-red-700 border-red-200",
                icon: AlertTriangle
            };
        } else {
            return {
                label: "Unknown",
                color: "bg-gray-100 text-gray-700 border-gray-200",
                icon: AlertTriangle
            };
        }
    };

    const getClassColor = (className: string) => {
        const colors: Record<string, string> = {
            VIP: "from-purple-500 to-pink-500",
            Premium: "from-blue-500 to-purple-500",
            Standard: "from-blue-400 to-blue-500",
            Economy: "from-gray-400 to-gray-500",
        };
        return colors[className] || colors.Standard;
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const formatTime = (dateString: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const statusInfo = getStatusInfo(
        reservation?.statutReservation || "",
        reservation?.statutPayement || ""
    );

    const isCancelled = reservation?.statutReservation === "ANNULEE";

    return (
        <div className={`bg-white rounded-lg border border-gray-100 p-4 hover:shadow-sm transition-all duration-200 ${
            isCancelled ? "opacity-60" : ""
        }`}>
            <div className="flex items-center gap-4">
                {/* Image */}
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                        src={tripDetails?.bigImage || "/placeholder.svg"}
                        alt={`Trip from ${tripDetails?.lieuDepart} to ${tripDetails?.lieuArrive}`}
                        fill
                        className="object-cover"
                    />
                    {isCancelled && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">CANCELLED</span>
                        </div>
                    )}
                </div>

                {/* Main Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <h3 className="font-semibold text-gray-900 truncate">
                                {tripDetails?.lieuDepart || "N/A"} → {tripDetails?.lieuArrive || "N/A"}
                            </h3>
                            <p className="text-sm text-gray-600 truncate">
                                {agencyInfo?.longName || "Unknown Agency"}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                                <statusInfo.icon className="h-3 w-3" />
                                {statusInfo.label}
                            </div>
                            <div className={`bg-gradient-to-r ${getClassColor(tripDetails?.nomClasseVoyage || "")} text-white px-2 py-1 rounded-full text-xs font-medium`}>
                                {tripDetails?.nomClasseVoyage || "Standard"}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(tripDetails?.dateDepartEffectif || "")}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{formatTime(tripDetails?.heureDepartEffectif || "")}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>{reservation?.nbrPassager || 0} passenger(s)</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <div className="font-bold text-primary">
                                    {(reservation?.prixTotal || 0).toLocaleString()} FCFA
                                </div>
                                {needsPayment && remainingAmount > 0 && (
                                    <div className="text-xs text-orange-600">
                                        {remainingAmount.toLocaleString()} FCFA remaining
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={onViewDetails}
                                    className="bg-primary text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                                >
                                    Details
                                </button>

                                {needsPayment && remainingAmount > 0 && !isCancelled && (
                                    <button
                                        onClick={onPayment}
                                        className="bg-orange-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
                                    >
                                        Pay
                                    </button>
                                )}

                                {!isCancelled && (
                                    <button
                                        onClick={onCancel}
                                        className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}