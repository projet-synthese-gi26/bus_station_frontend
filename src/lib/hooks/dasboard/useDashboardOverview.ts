// src/lib/hooks/dasboard/useDashboardOverview.ts
import { useState, useEffect, useCallback } from 'react';
import { useBusStation } from '@/context/Provider';
import { getAgencyByChefId } from '@/lib/services/agency-service';
import { getReservationsByAgency } from '@/lib/services/reservation-service';
import { getAgencyGeneralStats, getAgencyEvolutionStats } from '@/lib/services/statistics-service';
import { AgenceStatisticsDTO, AgenceEvolutionDTO, ReservationPreviewDTO } from '@/lib/types/generated-api';

export function useDashboardOverview() {
    const { userData, isLoading: isUserLoading } = useBusStation();

    const [generalStats, setGeneralStats] = useState<AgenceStatisticsDTO | null>(null);
    const [evolutionData, setEvolutionData] = useState<AgenceEvolutionDTO | null>(null);
    const [recentBookings, setRecentBookings] = useState<ReservationPreviewDTO[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [apiError, setApiError] = useState<string | null>(null);

    const fetchData = useCallback(async (agencyId: string) => {
        setIsLoading(true);
        setApiError(null);
        try {
            const [stats, evolution, bookingsResponse] = await Promise.all([
                getAgencyGeneralStats(agencyId),
                getAgencyEvolutionStats(agencyId),
                getReservationsByAgency(agencyId) // On récupère les 5 plus récentes
            ]);

            setGeneralStats(stats);
            setEvolutionData(evolution);
            setRecentBookings(bookingsResponse?.content || []);

        } catch (error) {
            console.error("Erreur lors du chargement des données du dashboard", error);
            setApiError("Impossible de charger les données du tableau de bord.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!isUserLoading && userData?.userId) {
            getAgencyByChefId(userData.userId).then(agency => {
                if (agency?.agencyId) {
                    fetchData(agency.agencyId);
                } else {
                    setApiError("Agence non trouvée pour cet utilisateur.");
                    setIsLoading(false);
                }
            });
        }
    }, [userData, isUserLoading, fetchData]);

    return {
        isLoading,
        apiError,
        generalStats,
        evolutionData,
        recentBookings,
    };
}