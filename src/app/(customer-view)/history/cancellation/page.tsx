'use client';

import React, {JSX, useState} from 'react';
import {
  MapPin,
  Clock,
  User,
  CreditCard,
  UserCircle,
  Euro,
  X,
  Calendar,
  Ban,
  Phone,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  Building,
  Timer
} from 'lucide-react';
import TransparentModal from "@/modals/TransparentModal";
import {Tooltip} from "antd";


// Interfaces TypeScript
interface PassagerDetails {
  nom: string;
  telephone: string;
}

interface Reservation {
  idHistorique: string;
  etatVoyage: string;
  statusVoyage: 'VIP' | 'Standard';
  lieuDepart: string;
  lieuArrivee: string;
  heureDepart: string;
  heureArrivee: string;
  dateDepart: string;
  initiateurAnnulation: 'Client' | 'Agence';
  causeAnnulation: string;
  agencePrestaire: string;
  contact: string;
  passagerDetails: PassagerDetails;
  montantRembourse: number;
  dateAnnulation: string;
}

interface HistoriqueData {
  historiques: Reservation[];
}

type FilterType = 'all' | 'client' | 'agence';

// Données fake pour démonstration
const historiqueData: HistoriqueData = {
  historiques: [
    {
      idHistorique: "H-001",
      etatVoyage: "annulé",
      statusVoyage: "VIP",
      lieuDepart: "Douala",
      lieuArrivee: "Yaoundé",
      heureDepart: "2025-01-15T08:00:00Z",
      heureArrivee: "2025-01-15T12:00:00Z",
      dateDepart: "15/01/2025",
      initiateurAnnulation: "Client",
      causeAnnulation: "Empêchement personnel de dernière minute",
      agencePrestaire: "BUCCA VOYAGE",
      contact: "+237 690 123 456",
      passagerDetails: {
        nom: "Jean Dupont",
        telephone: "+237 690 123 456"
      },
      montantRembourse: 15000,
      dateAnnulation: "14/01/2025"
    },
    {
      idHistorique: "H-002",
      etatVoyage: "annulé",
      statusVoyage: "Standard",
      lieuDepart: "Bafoussam",
      lieuArrivee: "Douala",
      heureDepart: "2025-01-20T14:30:00Z",
      heureArrivee: "2025-01-20T18:00:00Z",
      dateDepart: "20/01/2025",
      initiateurAnnulation: "Agence",
      causeAnnulation: "Problème technique du véhicule",
      agencePrestaire: "EXPRESS VOYAGE",
      contact: "+237 690 987 654",
      passagerDetails: {
        nom: "Marie Kamga",
        telephone: "+237 690 555 777"
      },
      montantRembourse: 8500,
      dateAnnulation: "19/01/2025"
    },
    {
      idHistorique: "H-003",
      etatVoyage: "annulé",
      statusVoyage: "VIP",
      lieuDepart: "Yaoundé",
      lieuArrivee: "Bamenda",
      heureDepart: "2025-01-25T06:45:00Z",
      heureArrivee: "2025-01-25T11:30:00Z",
      dateDepart: "25/01/2025",
      initiateurAnnulation: "Client",
      causeAnnulation: "Changement de programme professionnel",
      agencePrestaire: "ROYAL TRANSPORT",
      contact: "+237 690 111 222",
      passagerDetails: {
        nom: "Paul Mbarga",
        telephone: "+237 690 333 444"
      },
      montantRembourse: 12000,
      dateAnnulation: "23/01/2025"
    }
  ]
};

export default function CancellationHistoryVoyage(): JSX.Element {
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterBy, setFilterBy] = useState<FilterType>('all');

  // Fonction pour formater l'heure
  const formatTime = (timeString: string): string => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Fonction pour filtrer les réservations
  const filteredReservations: Reservation[] = historiqueData.historiques
      .filter((reservation: Reservation) => reservation.etatVoyage === 'annulé')
      .filter((reservation: Reservation) => {
        const matchesSearch = searchTerm === '' ||
            reservation.passagerDetails.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reservation.idHistorique.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reservation.lieuDepart.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reservation.lieuArrivee.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filterBy === 'all' ||
            reservation.initiateurAnnulation.toLowerCase() === filterBy;

        return matchesSearch && matchesFilter;
      });

  const getInitiatorBadge = (initiator: 'Client' | 'Agence'): string => {
    if (initiator === 'Client') {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    } else if (initiator === 'Agence') {
      return 'bg-orange-100 text-orange-800 border-orange-200';
    }
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusBadge = (status: 'VIP' | 'Standard'): string => {
    if (status === 'VIP') {
      return 'bg-purple-100 text-purple-800 border-purple-200';
    }
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setFilterBy(e.target.value as FilterType);
  };

  const handleReservationSelect = (reservation: Reservation): void => {
    setSelectedReservation(reservation);
  };

  const handleCloseModal = (): void => {
    setSelectedReservation(null);
  };

  const renderCancellationDetails = (reservation: Reservation): JSX.Element => {
    return (
        <div className="flex items-center justify-center p-4">
          <div className="bg-white shadow-2xl rounded-xl max-w-5xl w-full relative max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white relative">
              <Tooltip title={"close modal"} placement={"top"}>
                <button
                    onClick={handleCloseModal}
                    className="cursor-pointer absolute top-6 right-4 text-white bg-white/50 hover:bg-white/50 hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"
                    type="button"
                >
                  <X className="h-6 w-6"/>
                </button>
              </Tooltip>


              <div className="flex items-center gap-4">
                <div className="text-white bg-opacity-20 p-3 rounded-xl">
                  <Ban className="h-8 w-8"/>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Détails de l&#39;Annulation</h2>
                  <p className="text-red-100">Réservation #{reservation.idHistorique}</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Trip Information */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-500" />
                  Informations du Voyage
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <MapPin className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Départ</p>
                      <p className="font-semibold text-gray-900">{reservation.lieuDepart}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <MapPin className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Arrivée</p>
                      <p className="font-semibold text-gray-900">{reservation.lieuArrivee}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Calendar className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-semibold text-gray-900">{reservation.dateDepart}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-yellow-100 p-2 rounded-lg">
                      <Clock className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Heure Départ</p>
                      <p className="font-semibold text-gray-900">{formatTime(reservation.heureDepart)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-teal-100 p-2 rounded-lg">
                      <Timer className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Heure Arrivée</p>
                      <p className="font-semibold text-gray-900">{formatTime(reservation.heureArrivee)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-pink-100 p-2 rounded-lg">
                      <CreditCard className="h-5 w-5 text-pink-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Statut</p>
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(reservation.statusVoyage)}`}>
                      {reservation.statusVoyage}
                    </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Passenger Information */}
              <div className="bg-blue-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-500" />
                  Informations Passager
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <UserCircle className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Nom du passager</p>
                      <p className="font-semibold text-gray-900">{reservation.passagerDetails.nom}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Phone className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Téléphone</p>
                      <p className="font-semibold text-gray-900">{reservation.passagerDetails.telephone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cancellation Information */}
              <div className="bg-red-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Détails de l&#39;Annulation
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-100 p-2 rounded-lg">
                      <UserCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Initiateur</p>
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getInitiatorBadge(reservation.initiateurAnnulation)}`}>
                      {reservation.initiateurAnnulation}
                    </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <Calendar className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date d&#39;annulation</p>
                      <p className="font-semibold text-gray-900">{reservation.dateAnnulation}</p>
                    </div>
                  </div>

                  <div className="col-span-full">
                    <div className="flex items-start gap-3">
                      <div className="bg-yellow-100 p-2 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Cause de l&#39;annulation</p>
                        <p className="font-semibold text-gray-900">{reservation.causeAnnulation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Agency & Financial Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Building className="h-5 w-5 text-green-500" />
                    Agence
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <Building className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Nom</p>
                        <p className="font-semibold text-gray-900">{reservation.agencePrestaire}</p>
                      </div>
                    </div>

                    {reservation.contact && (
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <Phone className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Contact</p>
                            <p className="font-semibold text-gray-900">{reservation.contact}</p>
                          </div>
                        </div>
                    )}
                  </div>
                </div>

                <div className="bg-purple-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Euro className="h-5 w-5 text-purple-500" />
                    Remboursement
                  </h3>

                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Euro className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Montant remboursé</p>
                      <p className="text-2xl font-bold text-purple-600">{reservation.montantRembourse.toLocaleString()} FCFA</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  };

  return (
      <div className="min-h-screen p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-gray-100 rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Voyages Annulés</h1>
                <p className="text-gray-600">Historique de vos réservations annulées</p>
              </div>
              <div className="flex items-center gap-2 text-red-600">
                <Ban className="h-6 w-6" />
                <span className="text-lg font-semibold">{filteredReservations.length} Annulation(s)</span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Rechercher par nom, ID, ville..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                />
              </div>
              <div className="flex items-center gap-3">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                    value={filterBy}
                    onChange={handleFilterChange}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                >
                  <option value="all">Tous les initiateurs</option>
                  <option value="client">Client</option>
                  <option value="agence">Agence</option>
                </select>
              </div>
            </div>
          </div>

          {/* Cancellations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReservations.map((reservation: Reservation) => (
                <div
                    key={reservation.idHistorique}
                    className="bg-white shadow-sm rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-red-300"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 border-b border-red-200">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-gray-900">#{reservation.idHistorique}</h3>
                      <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(reservation.statusVoyage)}`}>
                      {reservation.statusVoyage}
                    </span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                      Annulé
                    </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="h-4 w-4" />
                      <span className="font-medium">{reservation.passagerDetails.nom}</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4">
                    <div className="space-y-6">
                      {/* Route */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="bg-blue-100 p-1.5 rounded-lg">
                            <MapPin className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Départ</p>
                            <p className="font-medium text-sm">{reservation.lieuDepart}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="bg-green-100 p-1.5 rounded-lg">
                            <MapPin className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Arrivée</p>
                            <p className="font-medium text-sm">{reservation.lieuArrivee}</p>
                          </div>
                        </div>
                      </div>

                      {/* Date & Time */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="bg-purple-100 p-1.5 rounded-lg">
                            <Calendar className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Date</p>
                            <p className="font-medium text-sm">{reservation.dateDepart}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="bg-yellow-100 p-1.5 rounded-lg">
                            <Clock className="h-4 w-4 text-yellow-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Heure</p>
                            <p className="font-medium text-sm">{formatTime(reservation.heureDepart)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Initiator */}
                      <div className="flex items-center gap-2">
                        <div className="bg-red-100 p-1.5 rounded-lg">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Annulé par</p>
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getInitiatorBadge(reservation.initiateurAnnulation)}`}>
                        {reservation.initiateurAnnulation}
                      </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-10 flex justify-center items-center">
                      <button
                          onClick={() => handleReservationSelect(reservation)}
                          className=" bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center gap-2"
                          type="button"
                      >
                        <Eye className="h-4 w-4" />
                        Voir les détails
                      </button>
                    </div>
                  </div>
                </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredReservations.length === 0 && (
              <div className="text-center py-12">
                <Ban className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-500 mb-2">Aucune annulation trouvée</h3>
                <p className="text-gray-400">Essayez d&#39;ajuster vos filtres de recherche.</p>
              </div>
          )}

          {/* Modal using TransparentModal */}
          <TransparentModal isOpen={selectedReservation !== null}>
            {selectedReservation && renderCancellationDetails(selectedReservation)}
          </TransparentModal>
        </div>
      </div>
  );
}