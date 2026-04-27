// components/dashboard/TripCard.tsx

import React from 'react';
import Image from "next/image";
import {
    MapPin,
    Calendar,
    Users,
    Eye,
    Edit,
    Ban,
    TrendingUp,
    Activity,
    ArrowRight
} from "lucide-react";
import { formatDateOnly } from "@/lib/services/date-services";
import { TripDetails } from "@/lib/types/models/Trip";
import StatusBadge from "./StatusBadge";

interface TripCardProps {
    trip: TripDetails;
    tripStats: {
        placesReservees: number;
        occupancyRate: number;
        revenueCalcule: number;
    };
    onViewBookings: (tripId: string) => void;
    onEdit: (tripId: string) => void;
    onCancel: (tripId: string) => void;
}

export default function TripCard({
                                     trip,
                                     tripStats,
                                     onViewBookings,
                                     onEdit,
                                     onCancel
                                 }: TripCardProps) {
    const { placesReservees, occupancyRate, revenueCalcule } = tripStats;

    return (
        <div className="cursor-pointer bg-gray-100 rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 group">
            {/* Image avec statut overlay */}
            <div className="relative h-48 overflow-hidden">
                <Image
                    width={400}
                    height={300}
                    src={trip.bigImage || "/placeholder.svg"}
                    alt={`${trip.titre} trip`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="absolute top-4 right-4">
                    <StatusBadge status={trip.statusVoyage || 'PUBLIE'} />
                </div>
            </div>

            <div className="p-6">
                {/* Header avec titre et itinéraire */}
                <div className="flex justify-between items-start mb-5">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{trip.titre}</h3>
                        <div className="flex items-center gap-2 text-gray-600">
                            <div className="ml-2 h-7 w-7 rounded-full bg-red-100 flex items-center justify-center">
                                <MapPin className="h-4 w-4 text-red-400"/>
                            </div>
                            <span className="text-sm">{trip.lieuDepart}</span>
                            <ArrowRight className="h-4 w-4"/>
                            <span className="text-sm">{trip.lieuArrive}</span>
                        </div>
                    </div>
                    <div className="text-right flex gap-2">
                        <p className="text-2xl font-bold text-primary">{(trip.prix ?? 0).toLocaleString()}</p>
                        <p className="mt-2 text-sm text-primary">FCFA</p>
                    </div>
                </div>

                {/* Informations détaillées */}
                <div className="space-y-3 mb-6 ml-2">
                    <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <Calendar className="h-4 w-4 text-blue-600"/>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Date de départ</p>
                            <p className="font-semibold text-gray-900">{formatDateOnly(trip.dateDepartPrev)}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center">
                            <Users className="h-4 w-4 text-purple-600"/>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Places occupées</p>
                            <p className="font-semibold text-gray-900">
                                {placesReservees}/{trip.nbrPlaceReservable} places
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
                            <Activity className="h-4 w-4 text-green-600"/>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Taux d'occupation</p>
                            <p className="font-semibold text-gray-900">
                                {occupancyRate.toFixed(0)}% occupé
                            </p>
                        </div>
                    </div>
                </div>

                {/* Revenue si applicable */}
                {revenueCalcule > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium">
                            <TrendingUp className="h-4 w-4" />
                            <span>{revenueCalcule.toLocaleString()} FCFA de revenus</span>
                        </div>
                    </div>
                )}

                {/* Boutons d'action */}
                <div className="flex flex-col gap-3">
                    {/* Première ligne : Boutons d'administration */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => onEdit(trip.idVoyage)}
                            className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-all duration-200 font-medium"
                        >
                            <Edit className="h-4 w-4" />
                            <span>Modifier</span>
                        </button>
                        {trip.statusVoyage === 'PUBLIE' && (
                            <button
                                onClick={() => onCancel(trip.idVoyage)}
                                className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all duration-200 font-medium"
                            >
                                <Ban className="h-4 w-4" />
                                <span>Annuler</span>
                            </button>
                        )}
                    </div>

                    {/* Deuxième ligne : Bouton principal */}
                    <button
                        onClick={() => onViewBookings(trip.idVoyage)}
                        className="cursor-pointer w-full flex items-center justify-center gap-2 bg-primary text-white rounded-xl py-3 font-semibold hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        <Eye className="h-4 w-4" />
                        <span>Voir les réservations</span>
                    </button>
                </div>
            </div>
        </div>
    );
}