"use client"

import React from "react"
import {
    Search,
    Filter,
    AlertCircle,
    CreditCard,
    CheckCircle,
    Clock,
    XCircle,
    Users,
    MapPin,
    Settings, ArrowLeft
} from "lucide-react"
import PageHeader from "@/components/dashboard/PageHeader"
import Loader from "@/modals/Loader"
import TransparentModal from "@/modals/TransparentModal"
import { ConfirmationModal } from "@/modals/ConfirmActionModal"
import { useBookingsPage } from "@/lib/hooks/dasboard/useBookingsPage"
import BookingTableRow from "@/components/dashboard/marketplace/booking/BookingTableRows";


function BookingsPage() {
    const hook = useBookingsPage()

    if (hook.isLoading) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title={hook.tripId && hook.tripName ? `Réservations - ${hook.tripName}` : "Gestion des Réservations"}
                    subtitle={hook.tripId ? "Réservations pour ce voyage spécifique" : "Consultez et gérez toutes les réservations de vos clients"}
                />
                <div className="flex justify-center items-center py-20">
                    <Loader />
                </div>
            </div>
        )
    }

    if (hook.apiError) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title={hook.tripId && hook.tripName ? `Réservations - ${hook.tripName}` : "Gestion des Réservations"}
                    subtitle={hook.tripId ? "Réservations pour ce voyage spécifique" : "Consultez et gérez toutes les réservations de vos clients"}
                />
                {hook.tripId && (
                    <div className="flex items-center">
                        <button
                            onClick={() => window.history.back()}
                            className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 group"
                        >
                            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
                            <span className="text-sm font-medium">Retour aux voyages</span>
                        </button>
                    </div>
                )}
                <div className="p-8 text-center bg-white rounded-lg border border-gray-200">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                        <AlertCircle className="h-8 w-8 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
                    <p className="text-gray-600 mb-4">{hook.apiError}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title={hook.tripId && hook.tripName ? `Réservations - ${hook.tripName}` : "Gestion des Réservations"}
                subtitle={hook.tripId ? "Réservations pour ce voyage spécifique" : "Consultez et gérez toutes les réservations de vos clients"}
            />

            {/* Bouton de retour (seulement si on vient d'un voyage spécifique) */}

                <div className="flex items-center">
                    <button
                        onClick={() => window.history.back()}
                        className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 group"
                    >
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
                        <span className="text-sm font-medium">Retour aux voyages</span>
                    </button>
                </div>


            {/* Statistiques colorées */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-blue-700">Total</p>
                            <p className="text-2xl font-bold text-blue-900">{hook.stats.total}</p>
                        </div>
                        <CreditCard className="h-8 w-8 text-blue-400" />
                    </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-green-700">Confirmées</p>
                            <p className="text-2xl font-bold text-green-900">{hook.stats.confirmed}</p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-green-400" />
                    </div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-yellow-700">En attente</p>
                            <p className="text-2xl font-bold text-yellow-900">{hook.stats.pending}</p>
                        </div>
                        <Clock className="h-8 w-8 text-yellow-400" />
                    </div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-red-700">Annulées</p>
                            <p className="text-2xl font-bold text-red-900">{hook.stats.cancelled}</p>
                        </div>
                        <XCircle className="h-8 w-8 text-red-400" />
                    </div>
                </div>
                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-emerald-700">Revenus</p>
                            <p className="text-lg font-bold text-emerald-900">
                                {hook.stats.totalRevenue.toLocaleString()}
                            </p>
                            <p className="text-xs text-emerald-600">FCFA</p>
                        </div>
                        <CreditCard className="h-8 w-8 text-emerald-400" />
                    </div>
                </div>
            </div>

            {/* Filtres et recherche */}
            <div className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="group relative flex-1">
                        <Search className="group-hover:text-primary absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher par ID de réservation ou titre..."
                            value={hook.searchTerm}
                            onChange={(e) => hook.setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2.5 hover:border-2 hover:border-primary hover:outline-none w-full border border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Filter className="h-5 w-5 text-gray-500" />
                        <select
                            value={hook.statusFilter}
                            onChange={(e) => hook.setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors"
                        >
                            {hook.filterOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {hook.searchTerm && (
                    <p className="mt-3 text-sm text-gray-600">
                        {hook.filteredBookings.length} résultat(s) pour &#34;{hook.searchTerm}&#34;
                    </p>
                )}
            </div>

            {/* Indication de chargement des actions */}
            {hook.isActionLoading && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                        <span className="text-blue-700">Action en cours...</span>
                    </div>
                </div>
            )}

            {/* Tableau des réservations */}
            {hook.filteredBookings.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                        <CreditCard className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {hook.searchTerm ? "Aucune réservation trouvée" :
                            hook.tripId ? "Aucune réservation pour ce voyage" : "Aucune réservation disponible"}
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                        {hook.searchTerm
                            ? "Essayez de modifier vos critères de recherche"
                            : "Les réservations apparaîtront ici une fois que vos clients auront réservé des voyages."
                        }
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="min-w-full">
                        <thead className="bg-blue-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                <div className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5 text-primary"/>
                                    Réservation
                                </div>
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-primary"/>
                                    Voyage
                                </div>
                            </th>
                            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                                <div className="flex items-center justify-center gap-2">
                                    <Users className="h-5 w-5 text-primary"/>
                                    Passagers
                                </div>
                            </th>
                            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                                <div className="flex items-center justify-center gap-2">
                                    <CreditCard className="h-5 w-5 text-primary"/>
                                    Montant
                                </div>
                            </th>
                            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                                <div className="flex items-center justify-center gap-2">
                                    <Clock className="h-5 w-5 text-primary"/>
                                    Statut
                                </div>
                            </th>
                            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                                <div className="flex items-center justify-center gap-2">
                                    <Settings className="h-5 w-5 text-primary"/>
                                    Actions
                                </div>
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {hook.filteredBookings.map((booking, index) => (
                            <BookingTableRow
                                key={booking.reservation?.idReservation}
                                booking={booking}
                                index={index}
                                statusInfo={hook.getStatusInfo(booking.reservation?.statutReservation || 'RESERVER')}
                                onViewDetails={hook.handleViewDetails}
                                onContactClient={hook.handleContactClient}
                                onDownload={hook.handleDownloadReservation}
                                onCancel={hook.openCancelModal}
                            />
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal de confirmation */}
            <TransparentModal isOpen={hook.confirmModal.isOpen}>
                <ConfirmationModal isOpen={hook.confirmModal.isOpen}
                    onClose={hook.closeModal}
                    onConfirm={hook.confirmModal.onConfirm}
                    title={hook.confirmModal.title}
                    message={hook.confirmModal.message}
                />
            </TransparentModal>
        </div>
    )
}

export default BookingsPage