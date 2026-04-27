import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useBusStation } from "@/context/Provider";
import { getAgencyByChefId } from "@/lib/services/agency-service";
import {
  getTripsByAgency,
  updateTrip,
  deleteVoyage,
} from "@/lib/services/trip-service";
import { PaginatedResponse } from "@/lib/types/common";
import { TripDetails } from "@/lib/types/models/Trip";

interface ConfirmModal {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
}

export function usePublishedTrips() {
  const { userData, isLoading: isUserLoading } = useBusStation();
  const router = useRouter();

  // États principaux
  const [allTrips, setAllTrips] = useState<TripDetails[]>([]);
  const [agencyId, setAgencyId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // États de filtrage et recherche
  const [filter, setFilter] = useState<
    "PUBLIE" | "EN_COURS" | "TERMINE" | "ANNULE" | "all"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");

  // État de modal de confirmation
  const [confirmModal, setConfirmModal] = useState<ConfirmModal>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // Récupération des voyages
  const fetchTrips = useCallback(async (id: string) => {
    setIsLoading(true);
    setApiError(null);
    try {
      const response: PaginatedResponse<TripDetails> | null =
        await getTripsByAgency(id);
      const nonDraftTrips =
        response?.content?.filter((t) => t.statusVoyage !== "EN_ATTENTE") || [];
      setAllTrips(nonDraftTrips);
    } catch (error) {
      console.error(error);
      setApiError("Impossible de charger la liste des voyages publiés.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialisation
  useEffect(() => {
    if (!isUserLoading && userData?.userId) {
      getAgencyByChefId(userData.userId).then((agency) => {
        if (agency?.agencyId) {
          setAgencyId(agency.agencyId);
          fetchTrips(agency.agencyId);
        } else {
          setApiError("Aucune agence associée n'a été trouvée.");
          setIsLoading(false);
        }
      });
    }
  }, [userData, isUserLoading, fetchTrips]);

  // Filtrage des voyages (par statut + recherche)
  const filteredTrips = useMemo(() => {
    let trips =
      filter === "all"
        ? allTrips
        : allTrips.filter((trip) => trip.statusVoyage === filter);

    if (searchTerm) {
      trips = trips.filter(
        (trip) =>
          trip.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          trip.lieuDepart?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          trip.lieuArrive?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    return trips;
  }, [allTrips, filter, searchTerm]);

  // Statistiques calculées
  const stats = useMemo(() => {
    const total = allTrips.length;
    const publies = allTrips.filter((t) => t.statusVoyage === "PUBLIE").length;
    const enCours = allTrips.filter(
      (t) => t.statusVoyage === "EN_COURS",
    ).length;
    const termines = allTrips.filter(
      (t) => t.statusVoyage === "TERMINE",
    ).length;

    const totalRevenue = allTrips.reduce((sum, trip) => {
      const placesReservees =
        (trip.nbrPlaceReservable ?? 0) - (trip.nbrPlaceRestante ?? 0);
      return sum + placesReservees * (trip.prix ?? 0);
    }, 0);

    const totalReservations = allTrips.reduce((sum, trip) => {
      return sum + (trip.nbrPlaceReserve ?? 0);
    }, 0);

    return {
      total,
      publies,
      enCours,
      termines,
      totalRevenue,
      totalReservations,
    };
  }, [allTrips]);

  // Calculs pour un voyage spécifique
  const calculateTripStats = useCallback((trip: TripDetails) => {
    const placesReservable = trip.nbrPlaceReservable ?? 0;
    const placesRestante = trip.nbrPlaceRestante ?? 0;
    const placesReservees = placesReservable - placesRestante;
    const occupancyRate =
      placesReservable > 0 ? (placesReservees / placesReservable) * 100 : 0;
    const revenueCalcule = placesReservees * (trip.prix ?? 0);

    return { placesReservees, occupancyRate, revenueCalcule };
  }, []);

  // Gestionnaires d'actions
  const handleViewBookings = useCallback((tripId: string) => {
    window.location.href = `/dashboard/marketplace/bookings/${tripId}`;
  }, []);

  const handleEditTrip = useCallback(
    (tripId: string) => {
      router.push(`/dashboard/trip-planning?edit=${tripId}`);
    },
    [router],
  );

  const handleCancelTrip = useCallback(
    async (tripId: string) => {
      if (!agencyId) return;

      setIsActionLoading(true);
      try {
        await updateTrip(tripId, { statusVoyage: "ANNULE" });
        await fetchTrips(agencyId);
      } catch (error: unknown) {
        console.error(error);
        setApiError("Erreur lors de l'annulation du voyage.");
      } finally {
        setIsActionLoading(false);
      }
    },
    [agencyId, fetchTrips],
  );

  // Gestionnaires de modal
  const openCancelModal = useCallback(
    (tripId: string) => {
      setConfirmModal({
        isOpen: true,
        title: "Annuler le voyage",
        message:
          "Êtes-vous sûr de vouloir annuler ce voyage ? Cette action ne peut pas être annulée.",
        onConfirm: () => {
          handleCancelTrip(tripId);
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        },
      });
    },
    [handleCancelTrip],
  );

  const closeModal = useCallback(() => {
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
  }, []);

  // Options de filtres
  const filterOptions = useMemo(
    () => [
      { label: "Tous", value: "all" },
      { label: "Publiés", value: "PUBLIE" },
      { label: "En cours", value: "EN_COURS" },
      { label: "Terminés", value: "TERMINE" },
      { label: "Annulés", value: "ANNULE" },
    ],
    [],
  );

  return {
    // États
    isLoading,
    isActionLoading,
    apiError,

    // Données
    filteredTrips,
    stats,

    // Filtrage et recherche
    filter,
    setFilter,
    searchTerm,
    setSearchTerm,
    filterOptions,

    // Modal
    confirmModal,
    closeModal,

    // Actions
    handleViewBookings,
    handleEditTrip,
    openCancelModal,

    // Utilitaires
    calculateTripStats,
  };
}
