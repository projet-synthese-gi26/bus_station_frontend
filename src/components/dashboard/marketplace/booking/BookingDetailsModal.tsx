import React from 'react';
import {
    XCircle,
    MapPin,
    Calendar,
    Users,
    Mail,
    Download
} from "lucide-react";
import { formatDateOnly } from "@/lib/services/date-services";
import { ReservationPreviewDTO } from "@/lib/types/generated-api";
import TransparentModal from "@/modals/TransparentModal";
import BookingStatusBadge from "./BookingStatusBadge";

interface BookingDetailsModalProps {
    booking: ReservationPreviewDTO | null;
    isOpen: boolean;
    onClose: () => void;
    getStatusInfo: (status: string) => {
        text: string;
        color: string;
        dot: string;
    };
    onContactClient: (booking: ReservationPreviewDTO) => void;
    onDownload: (booking: ReservationPreviewDTO) => void;
}

export default function BookingDetailsModal({booking, isOpen, onClose, getStatusInfo, onContactClient, onDownload}: BookingDetailsModalProps) {

    if (!booking) return null;

    const { reservation, voyage, agence } = booking;
    const statusInfo = getStatusInfo(reservation?.statutReservation || 'RESERVER');

    return (
        <TransparentModal isOpen={isOpen}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Détails de la Réservation</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <XCircle className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* En-tête avec statut */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-gray-900 text-lg">
                                    Réservation #{reservation?.idReservation?.substring(0, 16)}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Créée le {formatDateOnly(reservation?.dateReservation || '')}
                                </p>
                            </div>
                            <BookingStatusBadge
                                status={reservation?.statutReservation || 'RESERVER'}
                                statusInfo={statusInfo}
                            />
                        </div>
                    </div>

                    {/* Informations du voyage */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <h3 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                Informations du Voyage
                            </h3>
                            <div className="space-y-2">
                                <p className="text-sm text-blue-700">
                                    <strong>Titre:</strong> {voyage?.titre}
                                </p>
                                <p className="text-sm text-blue-700">
                                    <strong>Itinéraire:</strong> {voyage?.lieuDepart} → {voyage?.lieuArrive}
                                </p>
                                <p className="text-sm text-blue-700">
                                    <strong>Date de départ:</strong> {formatDateOnly(voyage?.dateDepartPrev || '')}
                                </p>
                                <p className="text-sm text-blue-700">
                                    <strong>Heure:</strong> {voyage?.heureDepartEffectif || 'Non spécifiée'}
                                </p>
                            </div>
                        </div>

                        <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                            <h3 className="font-medium text-green-900 mb-3 flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Détails de la Réservation
                            </h3>
                            <div className="space-y-2">
                                <p className="text-sm text-green-700">
                                    <strong>Nombre de passagers:</strong> {reservation?.nbrPassager}
                                </p>
                                <p className="text-sm text-green-700">
                                    <strong>Prix total:</strong> {reservation?.prixTotal?.toLocaleString()} FCFA
                                </p>
                                <p className="text-sm text-green-700">
                                    <strong>Prix unitaire:</strong> {reservation?.prixTotal && reservation?.nbrPassager && reservation?.prixTotal/reservation?.nbrPassager || 'NA'} FCFA
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Informations supplémentaires */}
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                        <h3 className="font-medium text-purple-900 mb-3 flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Informations Complémentaires
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-sm text-purple-700">
                                    <strong>ID Réservation complet:</strong>
                                </p>
                                <p className="text-xs text-purple-600 font-mono bg-white p-2 rounded border">
                                    {reservation?.idReservation}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-purple-700">
                                    <strong>ID Voyage:</strong>
                                </p>
                                <p className="text-xs text-purple-600 font-mono bg-white p-2 rounded border">
                                    {voyage?.idVoyage}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-purple-700">
                                    <strong>Agence:</strong>
                                </p>
                                <p className="text-sm text-purple-600">
                                    {agence?.longName || 'Non spécifiée'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                    <button
                        onClick={() => onContactClient(booking)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Mail className="h-4 w-4" />
                        Contacter client
                    </button>
                    <button
                        onClick={() => onDownload(booking)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        <Download className="h-4 w-4" />
                        Télécharger PDF
                    </button>
                    <button
                        onClick={onClose}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors ml-auto"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </TransparentModal>
    );
}