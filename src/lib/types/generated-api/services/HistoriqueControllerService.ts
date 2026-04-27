/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Historique } from '../models/Historique';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class HistoriqueControllerService {
    /**
     * Obtenir un historique par ID
     * Récupère un historique spécifique par ID.
     * @param id
     * @returns Historique Historique trouvé
     * @throws ApiError
     */
    public static getHistoriqueById(
        id: string,
    ): CancelablePromise<Historique> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/historique/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Historique non trouvé`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Mettre à jour un historique
     * Modifie un historique existant.
     * @param id
     * @param requestBody
     * @returns Historique Historique mis à jour avec succès
     * @throws ApiError
     */
    public static updateHistorique(
        id: string,
        requestBody: Historique,
    ): CancelablePromise<Historique> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/historique/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Données invalides`,
                404: `Historique non trouvé`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Supprimer un historique
     * Supprime un historique par son ID.
     * @param id
     * @returns void
     * @throws ApiError
     */
    public static deleteHistorique(
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/historique/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Historique non trouvé`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Obtenir tous les historique
     * Récupère la liste de tous les historiques.
     * @returns Historique Liste récupérée avec succès
     * @throws ApiError
     */
    public static getAllHistoriques(): CancelablePromise<Array<Historique>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/historique',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Créer un historique
     * Ajoute un nouvel historique.
     * @param requestBody
     * @returns Historique Historique créé avec succès
     * @throws ApiError
     */
    public static createHistorique(
        requestBody: Historique,
    ): CancelablePromise<Historique> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/historique',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Données invalides`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Obtenir tous les historique de reservation d'un utilisateur
     * Récupère la liste de tous les historiques de reservations d'un utilisateur.
     * @param idUtilisateur
     * @returns Historique Liste récupérée avec succès
     * @throws ApiError
     */
    public static getHistoriqueReservation(
        idUtilisateur: string,
    ): CancelablePromise<Array<Historique>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/historique/reservation/{idUtilisateur}',
            path: {
                'idUtilisateur': idUtilisateur,
            },
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
}
