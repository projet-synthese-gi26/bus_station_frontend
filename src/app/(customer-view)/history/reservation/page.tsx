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
  Phone,
  Search,
  Filter,
  Eye,
  Timer,
  Download,
  QrCode,
  Ticket,
  Users,
  Car
} from 'lucide-react';

// Interfaces TypeScript
interface PassagerDetails {
  nom: string;
  carteID: string;
  age: number;
  genre: string;
  siege: string;
  prixBillet: number;
  telephone?: string;
}

interface Reservation {
  idHistorique: string;
  etatVoyage: string;
  statusVoyage: 'VIP' | 'Standard';
  lieuDepart: string;
  lieuArrivee: string;
  quartierDepart: string;
  quartierArrivee: string;
  heureDepart: string;
  heureArrivee: string;
  dateDepart: string;
  passagerDetails: PassagerDetails;
}

interface HistoriqueData {
  historiques: Reservation[];
}

interface TransparentModalProps {
  isOpen: boolean;
  children: React.ReactNode;
}



// Données de démonstration
const historiqueData: HistoriqueData = {
  historiques: [
    {
      idHistorique: "R-001",
      etatVoyage: "terminé",
      statusVoyage: "VIP",
      lieuDepart: "Douala",
      lieuArrivee: "Yaoundé",
      quartierDepart: "Akwa",
      quartierArrivee: "Melen",
      heureDepart: "2025-01-15T08:00:00Z",
      heureArrivee: "2025-01-15T12:00:00Z",
      dateDepart: "15/01/2025",
      passagerDetails: {
        nom: "Jean Dupont",
        carteID: "CM123456789",
        age: 35,
        genre: "Masculin",
        siege: "A12",
        prixBillet: 15000,
        telephone: "+237 690 123 456"
      }
    },
    {
      idHistorique: "R-002",
      etatVoyage: "en cours",
      statusVoyage: "Standard",
      lieuDepart: "Bafoussam",
      lieuArrivee: "Douala",
      quartierDepart: "Centre-ville",
      quartierArrivee: "Bonaberi",
      heureDepart: "2025-01-20T14:30:00Z",
      heureArrivee: "2025-01-20T18:00:00Z",
      dateDepart: "20/01/2025",
      passagerDetails: {
        nom: "Marie Kamga",
        carteID: "CM987654321",
        age: 28,
        genre: "Féminin",
        siege: "B05",
        prixBillet: 8500,
        telephone: "+237 690 555 777"
      }
    },
    {
      idHistorique: "R-003",
      etatVoyage: "en attente",
      statusVoyage: "VIP",
      lieuDepart: "Yaoundé",
      lieuArrivee: "Bamenda",
      quartierDepart: "Bastos",
      quartierArrivee: "Commercial Avenue",
      heureDepart: "2025-01-25T06:45:00Z",
      heureArrivee: "2025-01-25T11:30:00Z",
      dateDepart: "25/01/2025",
      passagerDetails: {
        nom: "Paul Mbarga",
        carteID: "CM456789123",
        age: 42,
        genre: "Masculin",
        siege: "A01",
        prixBillet: 12000,
        telephone: "+237 690 333 444"
      }
    }
  ]
};

// Modal Transparent Component
const TransparentModal: React.FC<TransparentModalProps> = ({ isOpen, children }) => {
  if (!isOpen) return null;

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        {children}
      </div>
  );
};

export default function HistoriqueVoyage(): React.ReactElement {
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterBy, setFilterBy] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Fonction pour formater l'heure
  const formatTime = (timeString: string): string => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Fonction pour générer un QR Code (simulation avec un placeholder)
  const generateQRCode = (data: Reservation): string => {
    // En production, utiliser une vraie bibliothèque de QR code
    const qrData = encodeURIComponent(JSON.stringify({
      id: data.idHistorique,
      passenger: data.passagerDetails.nom,
      from: data.lieuDepart,
      to: data.lieuArrivee,
      date: data.dateDepart
    }));
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrData}`;
  };

  // Fonction pour télécharger le billet
  const downloadTicket = (): void => {
    if (!selectedReservation) return;

    const ticketContent = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <title>Billet de Voyage - Mooving Voyages</title>
          <meta charset="utf-8">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Arial', sans-serif; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
              display: flex;
              justify-content: center;
              align-items: center;
              padding: 20px;
            }
            .ticket-container {
              background: white;
              border-radius: 20px;
              box-shadow: 0 20px 40px rgba(0,0,0,0.1);
              max-width: 600px;
              width: 100%;
              overflow: hidden;
              position: relative;
            }
            .ticket-header {
              background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .logo {
              font-size: 28px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .ticket-id {
              font-size: 14px;
              opacity: 0.9;
            }
            .passenger-section {
              padding: 30px;
              background: #f8fafc;
            }
            .section-title {
              font-size: 18px;
              font-weight: bold;
              color: #1e293b;
              margin-bottom: 20px;
              display: flex;
              align-items: center;
              gap: 10px;
            }
            .passenger-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 15px;
              margin-bottom: 20px;
            }
            .passenger-detail {
              text-align: center;
              padding: 15px;
              background: white;
              border-radius: 12px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .detail-label {
              font-size: 12px;
              color: #64748b;
              margin-bottom: 5px;
            }
            .detail-value {
              font-size: 16px;
              font-weight: bold;
              color: #1e293b;
            }
            .journey-section {
              padding: 30px;
              border-top: 2px dashed #e2e8f0;
            }
            .journey-points {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 20px;
            }
            .journey-point {
              text-align: center;
              flex: 1;
            }
            .point-type {
              font-size: 14px;
              color: #64748b;
              margin-bottom: 5px;
            }
            .point-city {
              font-size: 20px;
              font-weight: bold;
              color: #1e293b;
              margin-bottom: 5px;
            }
            .point-district {
              font-size: 12px;
              color: #64748b;
              margin-bottom: 5px;
            }
            .point-time {
              font-size: 14px;
              font-weight: bold;
              color: #4f46e5;
            }
            .arrow {
              font-size: 24px;
              color: #4f46e5;
              margin: 0 20px;
            }
            .qr-section {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 20px 30px;
              background: #f1f5f9;
              border-top: 2px dashed #e2e8f0;
            }
            .qr-code {
              width: 80px;
              height: 80px;
              border: 2px solid #4f46e5;
              border-radius: 8px;
            }
            .status-info {
              text-align: right;
            }
            .status-badge {
              display: inline-block;
              padding: 8px 16px;
              border-radius: 20px;
              font-size: 14px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .status-vip {
              background: #ede9fe;
              color: #7c3aed;
            }
            .status-standard {
              background: #dcfce7;
              color: #16a34a;
            }
            .footer {
              text-align: center;
              padding: 20px;
              background: #1e293b;
              color: white;
            }
            @media print {
              body { background: white; }
              .ticket-container { box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="ticket-container">
            <div class="ticket-header">
              <div class="logo">🚌 Mooving Voyages</div>
              <div class="ticket-id">Billet de Voyage #${selectedReservation.idHistorique}</div>
            </div>
            
            <div class="passenger-section">
              <div class="section-title">
                👤 Informations Passager
              </div>
              <div class="passenger-grid">
                <div class="passenger-detail">
                  <div class="detail-label">Nom</div>
                  <div class="detail-value">${selectedReservation.passagerDetails.nom}</div>
                </div>
                <div class="passenger-detail">
                  <div class="detail-label">Carte ID</div>
                  <div class="detail-value">${selectedReservation.passagerDetails.carteID}</div>
                </div>
                <div class="passenger-detail">
                  <div class="detail-label">Âge</div>
                  <div class="detail-value">${selectedReservation.passagerDetails.age} ans</div>
                </div>
                <div class="passenger-detail">
                  <div class="detail-label">Genre</div>
                  <div class="detail-value">${selectedReservation.passagerDetails.genre}</div>
                </div>
                <div class="passenger-detail">
                  <div class="detail-label">Siège</div>
                  <div class="detail-value">${selectedReservation.passagerDetails.siege}</div>
                </div>
                <div class="passenger-detail">
                  <div class="detail-label">Prix</div>
                  <div class="detail-value">${selectedReservation.passagerDetails.prixBillet.toLocaleString()} FCFA</div>
                </div>
              </div>
            </div>
            
            <div class="journey-section">
              <div class="section-title">
                🗺️ Itinéraire de Voyage
              </div>
              <div class="journey-points">
                <div class="journey-point">
                  <div class="point-type">Départ</div>
                  <div class="point-city">${selectedReservation.lieuDepart}</div>
                  <div class="point-district">${selectedReservation.quartierDepart}</div>
                  <div class="point-time">${formatTime(selectedReservation.heureDepart)}</div>
                </div>
                <div class="arrow">→</div>
                <div class="journey-point">
                  <div class="point-type">Arrivée</div>
                  <div class="point-city">${selectedReservation.lieuArrivee}</div>
                  <div class="point-district">${selectedReservation.quartierArrivee}</div>
                  <div class="point-time">${formatTime(selectedReservation.heureArrivee)}</div>
                </div>
              </div>
              <div style="text-align: center; margin-top: 15px;">
                <strong>Date du voyage: ${selectedReservation.dateDepart}</strong>
              </div>
            </div>
            
            <div class="qr-section">
              <img src="${generateQRCode(selectedReservation)}" alt="QR Code" class="qr-code" />
              <div class="status-info">
                <div class="status-badge ${selectedReservation.statusVoyage === 'VIP' ? 'status-vip' : 'status-standard'}">
                  ${selectedReservation.statusVoyage}
                </div>
                <div style="font-size: 14px; color: #64748b;">
                  Statut: ${selectedReservation.etatVoyage}
                </div>
              </div>
            </div>
            
            <div class="footer">
              <div>Merci de voyager avec Mooving Voyages</div>
              <div style="font-size: 12px; margin-top: 5px; opacity: 0.8;">
                Présentez ce billet lors de l'embarquement
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const blob = new Blob([ticketContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `billet-${selectedReservation.idHistorique}-${selectedReservation.passagerDetails.nom.replace(/\s+/g, '-')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Fonction pour filtrer les réservations
  const filteredReservations: Reservation[] = historiqueData.historiques
      .filter((reservation: Reservation) => reservation.etatVoyage !== 'annulé')
      .filter((reservation: Reservation) => {
        const matchesSearch = searchTerm === '' ||
            reservation.passagerDetails.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reservation.idHistorique.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reservation.lieuDepart.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reservation.lieuArrivee.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filterBy === 'all' ||
            reservation.statusVoyage.toLowerCase() === filterBy;

        const matchesStatus = statusFilter === 'all' ||
            reservation.etatVoyage === statusFilter;

        return matchesSearch && matchesFilter && matchesStatus;
      });

  const getStatusBadge = (status: 'VIP' | 'Standard'): string => {
    if (status === 'VIP') {
      return 'bg-purple-100 text-purple-800 border-purple-200';
    }
    return 'bg-green-100 text-green-800 border-green-200';
  };


  const getStateBadge = (state: string): string => {
    switch (state) {
      case 'en cours':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'en attente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'terminé':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderReservationDetails = (reservation: Reservation): JSX.Element => {
    return (
        <div className="flex items-center justify-center p-4">
          <div className="bg-white shadow-2xl rounded-xl max-w-5xl w-full relative max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white relative">
              <button
                  onClick={() => setSelectedReservation(null)}
                  className="cursor-pointer absolute top-6 right-4 text-white bg-white/20 hover:bg-white/30 rounded-full p-2 transition-all duration-200"
                  type="button"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  <Ticket className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Détails de la Réservation</h2>
                  <p className="text-blue-100">Billet #{reservation.idHistorique}</p>
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
                      <p className="text-xs text-gray-500">{reservation.quartierDepart}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <MapPin className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Arrivée</p>
                      <p className="font-semibold text-gray-900">{reservation.lieuArrivee}</p>
                      <p className="text-xs text-gray-500">{reservation.quartierArrivee}</p>
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <UserCircle className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Nom complet</p>
                      <p className="font-semibold text-gray-900">{reservation.passagerDetails.nom}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <CreditCard className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Carte ID</p>
                      <p className="font-semibold text-gray-900">{reservation.passagerDetails.carteID}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Clock className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Âge</p>
                      <p className="font-semibold text-gray-900">{reservation.passagerDetails.age} ans</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-pink-100 p-2 rounded-lg">
                      <Users className="h-5 w-5 text-pink-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Genre</p>
                      <p className="font-semibold text-gray-900">{reservation.passagerDetails.genre}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <Car className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Siège</p>
                      <p className="font-semibold text-gray-900">{reservation.passagerDetails.siege}</p>
                    </div>
                  </div>

                  {reservation.passagerDetails.telephone && (
                      <div className="flex items-center gap-3">
                        <div className="bg-indigo-100 p-2 rounded-lg">
                          <Phone className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Téléphone</p>
                          <p className="font-semibold text-gray-900">{reservation.passagerDetails.telephone}</p>
                        </div>
                      </div>
                  )}
                </div>
              </div>

              {/* QR Code & Download Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-purple-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Euro className="h-5 w-5 text-purple-500" />
                    Informations Financières
                  </h3>

                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Euro className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Prix du billet</p>
                      <p className="text-2xl font-bold text-purple-600">{reservation.passagerDetails.prixBillet.toLocaleString()} FCFA</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <QrCode className="h-5 w-5 text-green-500" />
                    Code QR
                  </h3>

                  <div className="flex items-center justify-center">
                    <img
                        src={generateQRCode(reservation)}
                        alt="QR Code du billet"
                        className="w-24 h-24 border-2 border-green-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Download Button */}
              <div className="mt-6 flex justify-center">
                <button
                    onClick={downloadTicket}
                    className="bg-primary text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 text-lg font-semibold"
                >
                  <Download className="h-5 w-5" />
                  Télécharger le Billet
                </button>
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Historique des Voyages</h1>
                <p className="text-gray-600">Consultez et téléchargez vos billets de voyage</p>
              </div>
              <div className="flex items-center gap-2 text-blue-600">
                <Ticket className="h-6 w-6" />
                <span className="text-lg font-semibold">{filteredReservations.length} Réservation(s)</span>
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
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                />
              </div>
              <div className="flex items-center gap-3">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                >
                  <option value="all">Tous les types</option>
                  <option value="vip">VIP</option>
                  <option value="standard">Standard</option>
                </select>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="en cours">En cours</option>
                  <option value="en attente">En attente</option>
                  <option value="terminé">Terminé</option>
                </select>
              </div>
            </div>
          </div>

          {/* Reservations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReservations.map((reservation: Reservation) => (
                <div
                    key={reservation.idHistorique}
                    className="bg-white shadow-sm rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-blue-300"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 border-b border-gray-200">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-gray-900">#{reservation.idHistorique}</h3>
                      <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(reservation.statusVoyage)}`}>
                      {reservation.statusVoyage}
                    </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStateBadge(reservation.etatVoyage)}`}>
                      {reservation.etatVoyage}
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
                    <div className="space-y-4">
                      {/* Route */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="bg-blue-100 p-1.5 rounded-lg">
                            <MapPin className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Départ</p>
                            <p className="font-medium text-sm">{reservation.lieuDepart}</p>
                            <p className="text-xs text-gray-500">{reservation.quartierDepart}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="bg-green-100 p-1.5 rounded-lg">
                            <MapPin className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Arrivée</p>
                            <p className="font-medium text-sm">{reservation.lieuArrivee}</p>
                            <p className="text-xs text-gray-500">{reservation.quartierArrivee}</p>
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

                      {/* Price & Seat */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="bg-green-100 p-1.5 rounded-lg">
                            <Euro className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Prix</p>
                            <p className="font-medium text-sm">{reservation.passagerDetails.prixBillet.toLocaleString()} FCFA</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="bg-orange-100 p-1.5 rounded-lg">
                            <Car className="h-4 w-4 text-orange-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Siège</p>
                            <p className="font-medium text-sm">{reservation.passagerDetails.siege}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-6 flex justify-center">
                      <button
                          onClick={() => setSelectedReservation(reservation)}
                          className="cursor-pointer bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2"
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
                <Ticket className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-500 mb-2">Aucune réservation trouvée</h3>
                <p className="text-gray-400">Essayez d&#39;ajuster vos filtres de recherche.</p>
              </div>
          )}

          {/* Modal */}
          <TransparentModal isOpen={selectedReservation !== null}>
            {selectedReservation && renderReservationDetails(selectedReservation)}
          </TransparentModal>
        </div>
      </div>
  );
}