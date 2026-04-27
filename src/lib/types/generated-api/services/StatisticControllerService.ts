/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AgenceEvolutionDTO } from '../models/AgenceEvolutionDTO';
import type { AgenceStatisticsDTO } from '../models/AgenceStatisticsDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StatisticControllerService {
    /**
     * Obtenir les statistiques générales d'une agence
     * Récupère toutes les statistiques chiffrées d'une agence : nombre d'employés, voyages, réservations, revenus, etc.
     * @param agenceId
     * @returns AgenceStatisticsDTO Statistiques récupérées avec succès
     * @throws ApiError
     */
    public static getAgenceStatistics(
        agenceId: string,
    ): CancelablePromise<AgenceStatisticsDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/statistics/agence/{agenceId}/general',
            path: {
                'agenceId': agenceId,
            },
            errors: {
                404: `Agence non trouvée`,
                500: `Erreur interne du serveur`,
            },
        });
    }
    /**
     * Obtenir les évolutions dans le temps pour une agence
     * Récupère les données d'évolution temporelle : réservations, voyages, revenus et utilisateurs sur les derniers mois.
     * @param agenceId
     * @returns AgenceEvolutionDTO Évolutions récupérées avec succès
     * @throws ApiError
     */
    public static getAgenceEvolution(
        agenceId: string,
    ): CancelablePromise<AgenceEvolutionDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/statistics/agence/{agenceId}/evolution',
            path: {
                'agenceId': agenceId,
            },
            errors: {
                404: `Agence non trouvée`,
                500: `Erreur interne du serveur`,
            },
        });
    }
    /**
     * Obtenir toutes les statistiques d'une agence
     * Récupère à la fois les statistiques générales et les évolutions temporelles en un seul appel.
     * @param agenceId
     * @returns any Toutes les statistiques récupérées avec succès
     * @throws ApiError
     */
    public static getCompleteAgenceStatistics(
        agenceId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/statistics/agence/{agenceId}/complete',
            path: {
                'agenceId': agenceId,
            },
            errors: {
                404: `Agence non trouvée`,
                500: `Erreur interne du serveur`,
            },
        });
    }
}
