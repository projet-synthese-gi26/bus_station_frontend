/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Voyage } from '../models/Voyage';
import type { VoyageCreateRequestDTO } from '../models/VoyageCreateRequestDTO';
import type { VoyageDetailsDTO } from '../models/VoyageDetailsDTO';
import type { VoyagePreviewDTO } from '../models/VoyagePreviewDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class VoyageControllerService {
    /**
     * Mettre à jour un voyage
     * Modifie un voyage existant.
     * @param id
     * @param requestBody
     * @returns Voyage Voyage mis à jour avec succès
     * @throws ApiError
     */
    public static updateVoyage(
        id: string,
        requestBody: Voyage,
    ): CancelablePromise<Voyage> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/voyage/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Données invalides`,
                404: `Voyage non trouvé`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Supprimer un voyage
     * Supprime un voyage en fonction de son identifiant.
     * @param id
     * @returns void
     * @throws ApiError
     */
    public static deleteVoyage(
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/voyage/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Voyage non trouvé`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Créer un voyage
     * Ajoute un nouveau voyage à la base de données.
     * @param requestBody
     * @returns Voyage Voyage créé avec succès
     * @throws ApiError
     */
    public static createVoyage(
        requestBody: VoyageCreateRequestDTO,
    ): CancelablePromise<Voyage> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/voyage/create',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Données invalides`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Obtenir les détails d'un voyage par ID
     * Récupère un voyage en fonction de son identifiant.
     * @param id
     * @returns VoyageDetailsDTO Voyage trouvé
     * @throws ApiError
     */
    public static getVoyageById1(
        id: string,
    ): CancelablePromise<VoyageDetailsDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/voyage/byId/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Voyage non trouvé`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Obtenir tous les voyages
     * Récupère la liste de tous les voyages (champs stricts pour le preview) enregistrés.
     * @param page
     * @param size
     * @returns VoyagePreviewDTO Liste récupérée avec succès
     * @throws ApiError
     */
    public static getAllVoyages1(
        page?: number,
        size: number = 12,
    ): CancelablePromise<Array<VoyagePreviewDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/voyage/all',
            query: {
                'page': page,
                'size': size,
            },
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Obtenir tous les voyages d'une agence
     * Récupère la liste de tous les voyages d'une agence spécifique.
     * @param agenceId
     * @param page
     * @param size
     * @returns VoyagePreviewDTO Liste récupérée avec succès
     * @throws ApiError
     */
    public static getAllVoyagesByAgence(
        agenceId: string,
        page?: number,
        size: number = 12,
    ): CancelablePromise<Array<VoyagePreviewDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/voyage/agence/{agenceId}',
            path: {
                'agenceId': agenceId,
            },
            query: {
                'page': page,
                'size': size,
            },
            errors: {
                404: `Agence non trouvée`,
                500: `Erreur interne du serveur`,
            },
        });
    }
}
