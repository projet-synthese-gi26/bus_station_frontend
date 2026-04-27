/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PolitiqueAnnulation } from '@/lib/types/generated-api';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PolitiqueAnnulationControllerService {
    /**
     * Obtenir une politique d'annulation par ID
     * Récupère une politique d'annulation spécifique par ID.
     * @param id
     * @returns PolitiqueAnnulation Politique trouvée
     * @throws ApiError
     */
    public static getPolicyById(
        id: string,
    ): CancelablePromise<PolitiqueAnnulation> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/politique-annulation/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Politique non trouvée`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Mettre à jour une politique d'annulation
     * Modifie une politique d'annulation existante.
     * @param id
     * @param requestBody
     * @returns PolitiqueAnnulation Politique mise à jour avec succès
     * @throws ApiError
     */
    public static updatePolicy(
        id: string,
        requestBody: PolitiqueAnnulation,
    ): CancelablePromise<PolitiqueAnnulation> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/politique-annulation/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Données invalides`,
                404: `Politique non trouvée`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Supprimer une politique d'annulation
     * Supprime une politique d'annulation par son ID.
     * @param id
     * @returns void
     * @throws ApiError
     */
    public static deletePolicy(
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/politique-annulation/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Politique non trouvée`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Obtenir toutes les politiques d'annulation
     * Récupère la liste de toutes les politiques d'annulation.
     * @returns PolitiqueAnnulation Liste récupérée avec succès
     * @throws ApiError
     */
    public static getAllPolicies(): CancelablePromise<Array<PolitiqueAnnulation>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/politique-annulation',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Créer une politique d'annulation
     * Ajoute une nouvelle politique d'annulation.
     * @param requestBody
     * @returns PolitiqueAnnulation Politique créée avec succès
     * @throws ApiError
     */
    public static createPolicy(
        requestBody: PolitiqueAnnulation,
    ): CancelablePromise<PolitiqueAnnulation> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/politique-annulation',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Données invalides`,
                500: `Internal Server Error`,
            },
        });
    }
}
