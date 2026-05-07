"use client";

import React from "react";
import {
  Search,
  Filter,
  AlertCircle,
  Route,
  Clock,
  Activity,
  CreditCard,
} from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import Loader from "@/modals/Loader";
import TransparentModal from "@/modals/TransparentModal";
import { ConfirmationModal } from "@/modals/ConfirmationModal";
import { usePublishedTrips } from "@/lib/hooks/dasboard/usePublishedTrips";
import TripCard from "@/components/dashboard/marketplace/TripCard";

function PublishedTripsPage() {
  const hook = usePublishedTrips();

  if (hook.isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Mes Voyages Publiés"
          subtitle="Gérez vos voyages publiés et consultez les réservations"
        />
        <div className="flex justify-center items-center py-20">
          <Loader />
        </div>
      </div>
    );
  }

  if (hook.apiError) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Mes Voyages Publiés"
          subtitle="Gérez vos voyages publiés et consultez les réservations"
        />
        <div className="p-8 text-center bg-white rounded-lg border border-gray-200">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Erreur de chargement
          </h3>
          <p className="text-gray-600 mb-4">{hook.apiError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mes Voyages Publiés"
        subtitle="Gérez vos voyages publiés et consultez les réservations"
      />

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700">Total</p>
              <p className="text-2xl font-bold text-blue-900">
                {hook.stats.total}
              </p>
            </div>
            <Route className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700">Publiés</p>
              <p className="text-2xl font-bold text-green-900">
                {hook.stats.publies}
              </p>
            </div>
            <Activity className="h-8 w-8 text-green-400" />
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-700">En cours</p>
              <p className="text-2xl font-bold text-yellow-900">
                {hook.stats.enCours}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Terminés</p>
              <p className="text-2xl font-bold text-gray-900">
                {hook.stats.termines}
              </p>
            </div>
            <Route className="h-8 w-8 text-gray-400" />
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
              placeholder="Rechercher un voyage..."
              value={hook.searchTerm}
              onChange={(e) => hook.setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full border-2 border-gray-300 rounded-xl hover:border-2 hover:border-primary  outline-none focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="flex items-center gap-3">
            <Filter className="h-5 w-5 text-gray-500" />
            <div className="flex gap-2">
              {hook.filterOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() =>
                    hook.setFilter(
                      opt.value as
                        | "PUBLIE"
                        | "EN_COURS"
                        | "TERMINE"
                        | "ANNULE"
                        | "all",
                    )
                  }
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    hook.filter === opt.value
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {hook.searchTerm && (
          <p className="mt-3 text-sm text-gray-600">
            {hook.filteredTrips.length} résultat(s) pour &#34;{hook.searchTerm}
            &#34;
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

      {/* Grille de voyages */}
      {hook.filteredTrips.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
            <Route className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {hook.searchTerm ? "Aucun voyage trouvé" : "Aucun voyage publié"}
          </h3>
          <p className="text-gray-600 mb-6 max-w-sm mx-auto">
            {hook.searchTerm
              ? "Essayez de modifier votre recherche"
              : "Vos voyages publiés apparaîtront ici une fois que vous en aurez créé."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {hook.filteredTrips.map((trip) => (
            <TripCard
              key={trip.idVoyage}
              trip={trip}
              tripStats={hook.calculateTripStats(trip)}
              onViewBookings={hook.handleViewBookings}
              onEdit={hook.handleEditTrip}
              onCancel={hook.openCancelModal}
            />
          ))}
        </div>
      )}

      {/* Modal de confirmation */}
      <TransparentModal isOpen={hook.confirmModal.isOpen}>
        <ConfirmationModal
          onClose={hook.closeModal}
          onConfirm={hook.confirmModal.onConfirm}
          title={hook.confirmModal.title}
          message={hook.confirmModal.message}
        />
      </TransparentModal>
    </div>
  );
}

export default PublishedTripsPage;
