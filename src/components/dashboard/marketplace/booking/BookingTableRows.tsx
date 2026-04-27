import React from 'react';
import {
    MapPin,
    Calendar,
    Users,
    Eye,
    Mail,
    Download,
    Ban,
    ArrowRight
} from "lucide-react";
import { formatDateOnly } from "@/lib/services/date-services";
import { ReservationPreviewDTO } from "@/lib/types/generated-api";
import BookingStatusBadge from "./BookingStatusBadge";

interface BookingTableRowProps {
    booking: ReservationPreviewDTO;
    index: number;
    statusInfo: {
        text: string;
        color: string;
        dot: string;
    };
    onViewDetails: (bookingId: string) => void;
    onContactClient: (booking: ReservationPreviewDTO) => void;
    onDownload: (booking: ReservationPreviewDTO) => void;
    onCancel: (reservationId: string, clientName?: string) => void;
}

export default function BookingTableRow({booking, index, statusInfo, onViewDetails, onContactClient, onDownload, onCancel}: BookingTableRowProps) {
    const { reservation, voyage } = booking;

    // Obtenir les initiales du client (si disponible)
    const getClientInitials = () => {
        // Ici vous pourriez avoir les infos client depuis l'API
        // Pour l'instant on utilise juste "CL" pour Client
        return "CL";
    };

    // Couleur d'avatar aléatoire
    const getAvatarColor = () => {
        const colors = [
            "bg-blue-400", "bg-green-400", "bg-purple-400", "bg-pink-400",
            "bg-indigo-400", "bg-yellow-400", "bg-red-400", "bg-teal-400"
        ];
        const reservationId = reservation?.idReservation || "";
        const charCode = reservationId.charCodeAt(0) || 0;
        return colors[charCode % colors.length];
    };

    return (
        <tr className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50/50 transition-colors`}>
            {/* Réservation */}
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${getAvatarColor()} flex items-center justify-center text-white font-bold shadow-md`}>
                        {getClientInitials()}
                    </div>
                    <div>
                        <div className="font-semibold text-gray-900 text-sm">
                            #{reservation?.idReservation?.substring(0, 12)}...
                        </div>
                        <div className="text-gray-600 text-xs flex items-center gap-1">
                            <Calendar className="h-3 w-3"/>
                            {formatDateOnly(reservation?.dateReservation || '')}
                        </div>
                    </div>
                </div>
            </td>

            {/* Voyage */}
            <td className="px-6 py-4">
                <div>
                    <div className="font-medium text-gray-900 text-sm mb-1">
                        {voyage?.titre}
                    </div>
                    <div className="flex items-center gap-1 text-gray-600 text-xs">
                        <MapPin className="h-3 w-3" />
                        <span>{voyage?.lieuDepart}</span>
                        <ArrowRight className="h-3 w-3" />
                        <span>{voyage?.lieuArrive}</span>
                    </div>
                </div>
            </td>

            {/* Passagers */}
            <td className="px-6 py-4 text-center">
                <div className="flex items-center justify-center gap-1">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="font-medium text-gray-900">
            {reservation?.nbrPassager}
          </span>
                </div>
            </td>

            {/* Montant */}
            <td className="px-6 py-4 text-center">
                <div className="font-semibold text-gray-900">
                    {reservation?.prixTotal?.toLocaleString()} FCFA
                </div>
            </td>

            {/* Statut */}
            <td className="px-6 py-4 text-center">
                <BookingStatusBadge
                    status={reservation?.statutReservation || 'RESERVER'}
                    statusInfo={statusInfo}
                />
            </td>

            {/* Actions */}
            <td className="px-6 py-4">
                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={() => onViewDetails(reservation?.idReservation || '')}
                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-all duration-200"
                        title="Voir détails"
                    >
                        <Eye className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onContactClient(booking)}
                        className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
                        title="Contacter client"
                    >
                        <Mail className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onDownload(booking)}
                        className="p-2 text-green-600 hover:text-green-700 hover:bg-green-100 rounded-lg transition-all duration-200"
                        title="Télécharger"
                    >
                        <Download className="h-4 w-4" />
                    </button>
                    {reservation?.statutReservation !== 'ANNULER' && (
                        <button
                            onClick={() => onCancel(reservation?.idReservation || '', 'Client')}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-lg transition-all duration-200"
                            title="Annuler réservation"
                        >
                            <Ban className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
}