import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useBusStation } from '@/context/Provider';
import { getAgencyByChefId } from '@/lib/services/agency-service';
import { getTripsByAgency, updateTrip } from '@/lib/services/trip-service';
import { CalendarEvent, CalendarMonth, CalendarDay } from '@/lib/types/calendar';
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addDays,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths
} from 'date-fns';
import { fr } from 'date-fns/locale';
import {TripDetails} from "@/lib/types/models/Trip";

export function useEnhancedTripCalendar() {
    const { userData, isLoading: isUserLoading } = useBusStation();
    const router = useRouter();

    // États existants
    const [allTrips, setAllTrips] = useState<TripDetails[]>([]);
    const [agencyId, setAgencyId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [apiError, setApiError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState<TripDetails | null>(null);

    // Nouveaux états pour l'interface améliorée
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [viewType, setViewType] = useState<'month' | 'week' | 'day' | 'agenda'>('month');
    const [showDayDetail, setShowDayDetail] = useState(false);
    const [showTimelineView, setShowTimelineView] = useState(false);

    // Logique métier existante conservée
    const fetchAllTrips = useCallback(async (id: string) => {
        setIsLoading(true);
        setApiError(null);
        try {
            const response = await getTripsByAgency(id);
            setAllTrips(response?.content || []);
        } catch (error) {
            console.error(error);
            setApiError("Impossible de charger les voyages pour le calendrier.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!isUserLoading && userData?.userId) {
            getAgencyByChefId(userData.userId).then(agency => {
                if (agency?.agencyId) {
                    setAgencyId(agency.agencyId);
                    fetchAllTrips(agency.agencyId);
                } else {
                    setApiError("Aucune agence associée trouvée.");
                    setIsLoading(false);
                }
            });
        }
    }, [userData, isUserLoading, fetchAllTrips]);

    // Conversion améliorée des voyages en événements
    const calendarEvents: CalendarEvent[] = useMemo(() => {
        const events = allTrips.map(trip => {
            // Créer la date de départ avec l'heure
            const departureDate = new Date(trip.dateDepartPrev!);

            // Si heureDepartEffectif existe, l'utiliser, sinon fixer à 10h00
            if (trip.heureDepartEffectif) {
                const timeParts = trip.heureDepartEffectif.split(':');
                if (timeParts.length >= 2) {
                    departureDate.setHours(parseInt(timeParts[0]), parseInt(timeParts[1]), 0, 0);
                } else {
                    departureDate.setHours(10, 0, 0, 0); // Par défaut 10h00
                }
            } else {
                departureDate.setHours(10, 0, 0, 0); // Par défaut 10h00
            }

            // Date de fin basée sur heureArrive si disponible
            let endDate = new Date(departureDate);
            if (trip.heureArrive) {
                const arrivalTimeParts = trip.heureArrive.split(':');
                if (arrivalTimeParts.length >= 2) {
                    endDate.setHours(parseInt(arrivalTimeParts[0]), parseInt(arrivalTimeParts[1]), 0, 0);
                }
            }

            const event = {
                id: trip.idVoyage!,
                title: trip.titre!,
                start: departureDate,
                end: endDate,
                status: trip.statusVoyage!,
                description: `${trip.lieuDepart} → ${trip.lieuArrive}`,
                location: `${trip.lieuDepart} → ${trip.lieuArrive}`,
                price: trip.prix,
                availableSeats: trip.nbrPlaceRestante,
                totalSeats: trip.nbrPlaceReservable,
            };

            // Debug utile : vérifier la conversion des heures
            if (!trip.heureDepartEffectif) {
                console.log(`⏰ Voyage "${trip.titre}" sans heure définie → fixé à 10h00`);
            }

            return event;
        });

        console.log(`📊 ${events.length} événements générés pour le calendrier`);
        return events;
    }, [allTrips]);

    // Génération du calendrier mensuel
    const calendarMonth: CalendarMonth = useMemo(() => {
        const start = startOfWeek(startOfMonth(currentDate), { locale: fr });
        const end = endOfWeek(endOfMonth(currentDate), { locale: fr });

        const days: CalendarDay[] = [];
        let day = start;

        while (day <= end) {
            const dayEvents = calendarEvents.filter(event =>
                isSameDay(event.start, day)
            );

            days.push({
                date: new Date(day),
                events: dayEvents,
                isCurrentMonth: isSameMonth(day, currentDate),
                isToday: isSameDay(day, new Date()),
                isSelected: selectedDate ? isSameDay(day, selectedDate) : false,
            });

            day = addDays(day, 1);
        }

        // Organiser en semaines
        const weeks: CalendarDay[][] = [];
        for (let i = 0; i < days.length; i += 7) {
            weeks.push(days.slice(i, i + 7));
        }

        return {
            year: currentDate.getFullYear(),
            month: currentDate.getMonth(),
            days,
            weeks,
        };
    }, [currentDate, calendarEvents, selectedDate]);

    // Événements pour une date spécifique
    const getEventsForDate = useCallback((date: Date) => {
        const eventsForDate = calendarEvents.filter(event => isSameDay(event.start, date));
        // Debug: utile pour vérifier que les événements sont trouvés
        if (eventsForDate.length > 0) {
            console.log(`📅 Événements trouvés pour ${date.toDateString()}:`, eventsForDate.map(e => ({
                titre: e.title,
                heure: e.start.getHours() + 'h' + e.start.getMinutes().toString().padStart(2, '0')
            })));
        }
        return eventsForDate;
    }, [calendarEvents]);

    // Navigation
    const goToNextMonth = useCallback(() => {
        setCurrentDate(prev => addMonths(prev, 1));
    }, []);

    const goToPreviousMonth = useCallback(() => {
        setCurrentDate(prev => subMonths(prev, 1));
    }, []);

    const goToToday = useCallback(() => {
        setCurrentDate(new Date());
    }, []);

    const goToDate = useCallback((date: Date) => {
        setCurrentDate(date);
    }, []);

    // Gestion des sélections
    const handleDateSelect = useCallback((date: Date) => {
        setSelectedDate(date);
        const eventsForDate = getEventsForDate(date);

        if (eventsForDate.length === 0) {
            // Pas d'événements, aller directement à la création
            const formattedDate = format(date, 'yyyy-MM-dd');
            router.push(`/dashboard/trip-planning?departureDate=${formattedDate}`);
        } else {
            // Afficher la vue timeline horaire
            setShowTimelineView(true);
        }
    }, [getEventsForDate, router]);

    const handleEventSelect = useCallback((event: CalendarEvent) => {
        const trip = allTrips.find(t => t.idVoyage === event.id);
        if (trip) {
            setSelectedTrip(trip);
            setIsModalOpen(true);
        }
    }, [allTrips]);

    const handleCreateEvent = useCallback((date: Date) => {
        const formattedDate = format(date, 'yyyy-MM-dd');
        router.push(`/dashboard/trip-planning?departureDate=${formattedDate}`);
    }, [router]);

    // Actions existantes conservées
    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedTrip(null);
    }, []);

    const closeDayDetail = useCallback(() => {
        setShowDayDetail(false);
        setSelectedDate(null);
    }, []);

    const closeTimelineView = useCallback(() => {
        setShowTimelineView(false);
        setSelectedDate(null);
    }, []);

    const handleEdit = useCallback((tripId: string) => {
        closeModal();
        router.push(`/dashboard/trip-planning?edit=${tripId}`);
    }, [closeModal, router]);

    const handleCancel = useCallback(async (tripId: string) => {
        if (!agencyId) return;
        if (window.confirm("Voulez-vous vraiment annuler ce voyage ?")) {
            try {
                await updateTrip(tripId, { statusVoyage: 'ANNULE' });
                await fetchAllTrips(agencyId);
                closeModal();
            } catch (error) {
                console.error(error);
                alert("Erreur lors de l'annulation.");
            }
        }
    }, [agencyId, fetchAllTrips, closeModal]);

    const handleDelete = useCallback(async (tripId: string) => {
        if (window.confirm("ACTION IRRÉVERSIBLE !\nVoulez-vous vraiment supprimer définitivement ce voyage ?")) {
            try {
                // await deleteVoyage(tripId);
                if (agencyId) await fetchAllTrips(agencyId);
                closeModal();
            } catch (error) {
                console.error(error);
                alert("Erreur lors de la suppression.");
            }
        }
    }, [agencyId, fetchAllTrips, closeModal]);

    const getStatusColor = useCallback((status: string) => {
        const colors = {
            PUBLIE: 'bg-blue-500 text-white',
            EN_COURS: 'bg-green-500 text-white',
            EN_ATTENTE: 'bg-amber-500 text-white',
            TERMINE: 'bg-gray-500 text-white',
            ANNULE: 'bg-red-500 text-white',
        };
        return colors[status as keyof typeof colors] || 'bg-gray-300 text-gray-700';
    }, []);

    const getStatusDotColor = useCallback((status: string) => {
        const colors = {
            PUBLIE: 'bg-blue-500',
            EN_COURS: 'bg-green-500',
            EN_ATTENTE: 'bg-amber-500',
            TERMINE: 'bg-gray-500',
            ANNULE: 'bg-red-500',
        };
        return colors[status as keyof typeof colors] || 'bg-gray-300';
    }, []);

    return {
        // États
        isLoading,
        apiError,
        currentDate,
        selectedDate,
        viewType,
        showDayDetail,
        showTimelineView,
        calendarMonth,
        calendarEvents,
        isModalOpen,
        selectedTrip,

        // Getters
        getEventsForDate,
        getStatusColor,
        getStatusDotColor,

        // Navigation
        goToNextMonth,
        goToPreviousMonth,
        goToToday,
        goToDate,
        setViewType,

        // Actions
        handleDateSelect,
        handleEventSelect,
        handleCreateEvent,
        closeModal,
        closeDayDetail,
        closeTimelineView,
        handleEdit,
        handleCancel,
        handleDelete,
    };
}