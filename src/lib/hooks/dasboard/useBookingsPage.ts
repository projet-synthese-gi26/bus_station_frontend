import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useBusStation } from '@/context/Provider';
import { getAgencyByChefId } from '@/lib/services/agency-service';
import { getReservationsByAgency } from '@/lib/services/reservation-service';
import { ReservationPreviewDTO } from '@/lib/types/generated-api';
import { PaginatedResponse } from '@/lib/types/common';

interface ConfirmModal {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
}

export function useBookingsPage() {
    const { userData, isLoading: isUserLoading } = useBusStation();
    const params = useParams();
    const tripId = params?.tripId as string;

    // États principaux
    const [bookings, setBookings] = useState<ReservationPreviewDTO[]>([]);
    const [agencyId, setAgencyId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    // États de pagination et filtrage
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    // État de modal de confirmation
    const [confirmModal, setConfirmModal] = useState<ConfirmModal>({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: () => {}
    });

    // Modal de détails
    const [selectedBooking, setSelectedBooking] = useState<ReservationPreviewDTO | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    // Récupération des réservations
    const fetchBookings = useCallback(async (id: string, page: number) => {
        setIsLoading(true);
        setApiError(null);
        try {
            const response: PaginatedResponse<ReservationPreviewDTO> = await getReservationsByAgency(id);
            setBookings(response.content || []);
            setTotalPages(response.totalPages || 1);
            setTotalElements(response.totalElements || 0);
        } catch (error) {
            console.error(error);
            setApiError("Impossible de charger les réservations.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Initialisation
    useEffect(() => {
        if (!isUserLoading && userData?.userId) {
            getAgencyByChefId(userData.userId).then(agency => {
                if (agency?.agencyId) {
                    setAgencyId(agency.agencyId);
                    fetchBookings(agency.agencyId, 1);
                } else {
                    setApiError("Aucune agence associée trouvée.");
                    setIsLoading(false);
                }
            });
        } else if (!isUserLoading) {
            setIsLoading(false);
        }
    }, [userData, isUserLoading, fetchBookings]);

    // Rechargement lors du changement de page
    useEffect(() => {
        if (agencyId) {
            fetchBookings(agencyId, currentPage);
        }
    }, [currentPage, agencyId, fetchBookings]);

    // Filtrage des réservations (par statut + recherche + voyage spécifique)
    const filteredBookings = useMemo(() => {
        let filtered = bookings.filter(booking => {
            const reservation = booking.reservation;
            const voyage = booking.voyage;
            const searchLower = searchTerm.toLowerCase();

            const matchesSearch = searchTerm === '' ||
                reservation?.idReservation?.toLowerCase().includes(searchLower) ||
                voyage?.titre?.toLowerCase().includes(searchLower);

            const matchesStatus = statusFilter === 'all' ||
                reservation?.statutReservation === statusFilter;

            return matchesSearch && matchesStatus;
        });

        // Filtrage supplémentaire par voyage spécifique si tripId fourni
        if (tripId) {
            filtered = filtered.filter(b => b.voyage?.idVoyage === tripId);
        }

        return filtered;
    }, [bookings, searchTerm, statusFilter, tripId]);

    // Statistiques calculées
    const stats = useMemo(() => {
        const data = tripId ? filteredBookings : bookings; // Stats globales ou par voyage

        const total = data.length;
        const confirmed = data.filter(b => b.reservation?.statutReservation === 'CONFIRMER').length;
        const pending = data.filter(b => b.reservation?.statutReservation === 'RESERVER').length;
        const cancelled = data.filter(b => b.reservation?.statutReservation === 'ANNULER').length;
        const validated = data.filter(b => b.reservation?.statutReservation === 'VALIDER').length;
        const totalRevenue = data.reduce((sum, b) => sum + (b.reservation?.prixTotal || 0), 0);

        return { total, confirmed, pending, cancelled, validated, totalRevenue };
    }, [bookings, filteredBookings, tripId]);

    // Obtenir les infos d'un statut (couleurs, texte)
    const getStatusInfo = useCallback((status: string) => {
        const statusConfig = {
            CONFIRMER: { text: "Confirmée", color: "bg-green-100 text-green-700", dot: "bg-green-500" },
            RESERVER: { text: "En attente", color: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-500" },
            ANNULER: { text: "Annulée", color: "bg-red-100 text-red-700", dot: "bg-red-500" },
            VALIDER: { text: "Validée", color: "bg-blue-100 text-blue-700", dot: "bg-blue-500" }
        };
        return statusConfig[status as keyof typeof statusConfig] || statusConfig.RESERVER;
    }, []);

    // Annulation d'une réservation
    const handleCancelReservation = useCallback(async (reservationId: string) => {
        if (!agencyId) return;

        setIsActionLoading(true);
        try {
          //  await cancelReservation(reservationId);
            await fetchBookings(agencyId, currentPage);
        } catch (error: unknown) {
            console.error(error);
            setApiError("Erreur lors de l'annulation de la réservation.");
        } finally {
            setIsActionLoading(false);
        }
    }, [agencyId, fetchBookings, currentPage]);

    // Gestionnaires d'actions
    const handleViewDetails = useCallback((bookingId: string) => {
        const booking = filteredBookings.find(b => b.reservation?.idReservation === bookingId);
        if (booking) {
            setSelectedBooking(booking);
            setIsDetailModalOpen(true);
        }
    }, [filteredBookings]);

    const handleContactClient = useCallback((booking: ReservationPreviewDTO) => {
        // Logique pour contacter le client (email, etc.)
        console.log('Contact client pour réservation:', booking.reservation?.idReservation);
    }, []);

    const handleDownloadReservation = useCallback((booking: ReservationPreviewDTO) => {
        // Logique pour télécharger la réservation
        console.log('Télécharger réservation:', booking.reservation?.idReservation);
    }, []);

    // Gestionnaires de modal
    const openCancelModal = useCallback((reservationId: string, clientName?: string) => {
        setConfirmModal({
            isOpen: true,
            title: "Annuler la réservation",
            message: `Êtes-vous sûr de vouloir annuler cette réservation${clientName ? ` pour ${clientName}` : ''} ? Cette action ne peut pas être annulée.`,
            onConfirm: () => {
                handleCancelReservation(reservationId);
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
            }
        });
    }, [handleCancelReservation]);

    const closeModal = useCallback(() => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
    }, []);

    const closeDetailModal = useCallback(() => {
        setIsDetailModalOpen(false);
        setSelectedBooking(null);
    }, []);

    // Options de filtres
    const filterOptions = useMemo(() => [
        { label: "Tous les statuts", value: "all" },
        { label: "Confirmées", value: "CONFIRMER" },
        { label: "En attente", value: "RESERVER" },
        { label: "Annulées", value: "ANNULER" },
        { label: "Validées", value: "VALIDER" },
    ], []);

    // Nom du voyage si filtrage spécifique
    const tripName = tripId ? filteredBookings[0]?.voyage?.titre : null;

    return {
        // États
        isLoading,
        isActionLoading,
        apiError,

        // Données
        filteredBookings,
        stats,

        // Pagination
        currentPage,
        totalPages,
        totalElements,
        setCurrentPage,

        // Filtrage et recherche
        searchTerm,
        setSearchTerm,
        statusFilter,
        setStatusFilter,
        filterOptions,

        // Modales
        confirmModal,
        closeModal,
        selectedBooking,
        isDetailModalOpen,
        closeDetailModal,

        // Actions
        handleViewDetails,
        handleContactClient,
        handleDownloadReservation,
        openCancelModal,

        // Utilitaires
        getStatusInfo,
        tripId,
        tripName,
    };
}