import React from "react";
import {
  X,
  Edit,
  XCircle,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Car,
  Info,
} from "lucide-react";
import TransparentModal from "@/modals/TransparentModal";
import { formatDateOnly, formatDateToTime } from "@/lib/services/date-services";
import { TripDetails } from "@/lib/types/models/Trip";

interface EnhancedTripDetailModalProps {
  isOpen: boolean;
  trip: TripDetails | null;
  onClose: () => void;
  onEdit: (id: string) => void;
  onCancel: (id: string) => void;
  onDelete: (id: string) => void;
}

const InfoCard: React.FC<{
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  className?: string;
}> = ({ icon: Icon, label, value, className = "" }) => (
  <div className={`bg-gray-50 rounded-lg p-4 ${className}`}>
    <div className="flex items-start gap-3">
      <div className="p-2 bg-primary/10 rounded-lg">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
        <div className="text-gray-900 font-semibold">{value}</div>
      </div>
    </div>
  </div>
);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusConfig = (status: string) => {
    const configs = {
      PUBLIE: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        label: "Publié",
      },
      EN_COURS: {
        color: "bg-green-100 text-green-800 border-green-200",
        label: "En cours",
      },
      EN_ATTENTE: {
        color: "bg-amber-100 text-amber-800 border-amber-200",
        label: "En attente",
      },
      TERMINE: {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        label: "Terminé",
      },
      ANNULE: {
        color: "bg-red-100 text-red-800 border-red-200",
        label: "Annulé",
      },
    };
    return configs[status as keyof typeof configs] || configs.EN_ATTENTE;
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}
    >
      {config.label}
    </span>
  );
};

export const EnhancedTripDetailModal: React.FC<
  EnhancedTripDetailModalProps
> = ({ isOpen, trip, onClose, onEdit, onCancel, onDelete }) => {
  if (!isOpen || !trip) return null;

  // Valeurs avec fallback pour éviter les "possibly undefined"
  const placesReservable = trip.nbrPlaceReservable ?? 0;
  const placesRestantes = trip.nbrPlaceRestante ?? 0;
  const prix = trip.prix ?? 0;

  const isActionable =
    trip.statusVoyage !== "TERMINE" && trip.statusVoyage !== "ANNULE";
  const occupancyRate =
    placesReservable > 0
      ? ((placesReservable - placesRestantes) / placesReservable) * 100
      : 0;

  return (
    <TransparentModal isOpen={isOpen}>
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{trip.titre}</h2>
              <div className="flex items-center gap-4 text-primary-100">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDateOnly(trip.dateDepartPrev || "")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{formatDateToTime(trip.dateDepartPrev || "")}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={trip.statusVoyage!} />
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Informations de voyage */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Informations du voyage
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard
                  icon={MapPin}
                  label="Trajet"
                  value={`${trip.lieuDepart} → ${trip.lieuArrive}`}
                  className="md:col-span-2"
                />
                <InfoCard
                  icon={Calendar}
                  label="Date de départ"
                  value={formatDateOnly(trip.dateDepartPrev || "")}
                />
                <InfoCard
                  icon={Clock}
                  label="Heure de départ"
                  value={formatDateToTime(trip.dateDepartPrev || "")}
                />
              </div>
            </div>

            {/* Réservations et tarifs */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Réservations & Tarifs
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InfoCard
                  icon={Users}
                  label="Places"
                  value={
                    <div>
                      <div className="text-lg">
                        {placesReservable - placesRestantes} /{" "}
                        {placesReservable}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {placesRestantes} disponibles
                      </div>
                    </div>
                  }
                />
                <InfoCard
                  icon={DollarSign}
                  label="Prix par place"
                  value={`${prix.toLocaleString()} FCFA`}
                />
                <InfoCard
                  icon={DollarSign}
                  label="Revenus estimés"
                  value={`${(prix * (placesReservable - placesRestantes)).toLocaleString()} FCFA`}
                />
              </div>

              {/* Barre de progression des réservations */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Taux d&#39;occupation</span>
                  <span>{occupancyRate.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${occupancyRate}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span>
                  <span>{placesReservable} places</span>
                </div>
              </div>
            </div>

            {/* Informations véhicule */}
            {trip.vehicule && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Car className="h-5 w-5 text-primary" />
                  Véhicule assigné
                </h3>
                <InfoCard
                  icon={Car}
                  label="Véhicule"
                  value={
                    <div>
                      <div className="font-semibold">{trip.vehicule.nom}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        Plaque: {trip.vehicule.plaqueMatricule}
                      </div>
                    </div>
                  }
                />
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        {isActionable && (
          <div className="border-t border-gray-200 bg-gray-50 p-6">
            <div className="flex flex-wrap justify-end gap-3">
              <button
                onClick={() => onEdit(trip.idVoyage!)}
                className="flex items-center gap-2 text-sm bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Edit className="h-4 w-4" />
                Modifier
              </button>
              <button
                onClick={() => onCancel(trip.idVoyage!)}
                className="flex items-center gap-2 text-sm bg-amber-500 text-white px-6 py-3 rounded-lg hover:bg-amber-600 transition-colors font-medium"
              >
                <XCircle className="h-4 w-4" />
                Annuler le voyage
              </button>
              <button
                onClick={() => onDelete(trip.idVoyage!)}
                className="flex items-center gap-2 text-sm bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                <Trash2 className="h-4 w-4" />
                Supprimer
              </button>
            </div>
          </div>
        )}
      </div>
    </TransparentModal>
  );
};
