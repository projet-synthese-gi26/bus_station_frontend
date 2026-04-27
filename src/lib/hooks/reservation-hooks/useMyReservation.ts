import { useEffect, useState } from "react";
import { useBusStation } from "@/context/Provider";
import { getCustomerReservations, getReservationDetail } from "@/lib/services/reservation-service";
import { ReservationDetails } from "@/lib/types/models/Reservation";



export function useMyReservation(reservationId: string) {
    const { userData } = useBusStation();

   /*** STATE FOR MY SCHEDULED TRIPS ***/
    const [myScheduledTrips, setMyScheduledTrips] = useState<ReservationDetails[]>([]);
    const [reservationDetail, setReservationDetail] = useState<ReservationDetails | null>(null);
    const [selectedTrip, setSelectedTrip] = useState<ReservationDetails | null>(null);

    /*** STATE FOR PAGINATION ***/
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [canRenderPaginationContent, setCanRenderPaginationContent] = useState(false);

    /*** STATE FOR SEARCH ***/
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredTrips, setFilteredTrips] = useState<ReservationDetails[]>([]);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

   /*** STATE FOR LOADING AND ERRROS ***/
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    /*** STATE FOR MODALS ***/
    const [canOpenTripAnnulationModal, setCanOpenTripAnnulationModal] = useState(false);
    const [canOpenPaymentRequestModal, setCanOpenPaymentRequestModal] = useState(false);
    const [canOpenSuccessModal, setCanOpenSuccessModal] = useState(false);

    // Messages
    const [successMessage, setSuccessMessage] = useState("");



    useEffect(() => {
        if (userData?.userId) {
            fetchMyScheduledTrips(userData.userId);
        }
    }, [userData?.userId]);


    useEffect(() => {
        if (reservationId) {
            fetchReservationDetail(reservationId);
        }
    }, [reservationId]);




    useEffect(() => {
        if (searchQuery.trim()) {
            const filtered = myScheduledTrips.filter((trip) => {
                const voyage = trip.voyage;
                const agence = trip.agence;
                return (
                    voyage?.titre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    voyage?.lieuDepart?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    voyage?.lieuArrive?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    agence?.longName?.toLowerCase().includes(searchQuery.toLowerCase())
                );
            });
            setFilteredTrips(filtered);
        } else {
            setFilteredTrips(myScheduledTrips);
        }
    }, [searchQuery, myScheduledTrips]);


    async function fetchMyScheduledTrips(userId: string)
    {
        setIsLoading(true);
        setError(null);
        await getCustomerReservations(userId)
            .then((result) => {
                if(result?.content)
                {
                    setMyScheduledTrips(result.content);
                    setTotalPages(result.totalPages || 1);
                    setCanRenderPaginationContent(!result.empty);
                    setFilteredTrips(result.content);
                }
                else {
                    setMyScheduledTrips([]);
                    setFilteredTrips([]);
                    setCanRenderPaginationContent(false);
                }
            })
            .catch((error) => {
                setError(error as Error);
                setMyScheduledTrips([]);
                setFilteredTrips([]);
            })
            .finally(()=> setIsLoading(false));
    }



    function openPaymentModal(trip: ReservationDetails) {
        setSelectedTrip(trip);
        setCanOpenPaymentRequestModal(true);
    }


    function openCancellationModal(trip: ReservationDetails) {
        setSelectedTrip(trip);
        setCanOpenTripAnnulationModal(true);
    }


    function navigateToDetails(reservationId: string) {
        window.location.href = `/my-reservations/reservation-details/${reservationId}`;
    }

    function filterByStatus(status: string) {
        const filtered = status === "All Status"
            ? myScheduledTrips
            : myScheduledTrips.filter((trip) => {
                const reservation = trip.reservation;
                switch (status) {
                    case "Paid": return reservation?.statutPayement === "PAID";
                    case "Confirmed": return reservation?.statutReservation === "CONFIRMEE";
                    case "Pending Payment": return reservation?.statutReservation === "RESERVER";
                    case "Cancelled": return reservation?.statutReservation === "ANNULEE";
                    default: return true;
                }
            });
        setFilteredTrips(filtered);
    }


    function filterByAgency(agencyName: string) {
        const filtered = agencyName === "All Agencies"
            ? myScheduledTrips
            : myScheduledTrips.filter((trip) => trip.agence?.longName === agencyName);
        setFilteredTrips(filtered);
    }


    function filterByDate(dateString: string) {
        const filtered = !dateString
            ? myScheduledTrips
            : myScheduledTrips.filter((trip) => trip.voyage?.dateDepartEffectif?.startsWith(dateString));
        setFilteredTrips(filtered);
    }


    function clearAllFilters() {
        setSearchQuery("");
        setFilteredTrips(myScheduledTrips);
    }





    async function fetchReservationDetail(idReservation: string) {
        if (!idReservation) return;

        setIsLoading(true);
        setError(null);

        await getReservationDetail(idReservation)
            .then((result)=> {
                if(result) setReservationDetail(result)
                else setReservationDetail(null);
            })
            .catch((error)=> {
                setError(error as Error);
                setReservationDetail(null);
            })
            .finally(() => setIsLoading(false));
    }




    return {
        myScheduledTrips,
        filteredTrips,
        selectedTrip,
        reservationDetail,
        isLoading,
        error,
        searchQuery,
        currentPage,
        totalPages,
        canRenderPaginationContent,
        viewMode,
        canOpenTripAnnulationModal,
        canOpenPaymentRequestModal,
        canOpenSuccessModal,
        successMessage,
        setSearchQuery,
        setCurrentPage,
        setViewMode,
        openPaymentModal,
        openCancellationModal,
        navigateToDetails,
        filterByStatus,
        filterByAgency,
        filterByDate,
        clearAllFilters,
        setCanOpenTripAnnulationModal,
        setCanOpenPaymentRequestModal,
        setCanOpenSuccessModal,
    }
}