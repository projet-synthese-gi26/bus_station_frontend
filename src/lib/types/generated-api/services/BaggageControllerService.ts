/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Baggage } from '../models/Baggage';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BaggageControllerService {
    /**
     * Obtenir un bagage par ID
     * Récupère un bagage spécifique par son ID.
     * @param id
     * @returns Baggage Bagage trouvé
     * @throws ApiError
     */
    public static getBaggageById(
        id: string,
    ): CancelablePromise<Baggage> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/baggages/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Bagage non trouvé`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Mettre à jour un bagage
     * Modifie un bagage existant.
     * @param id
     * @param requestBody
     * @returns Baggage Bagage mis à jour avec succès
     * @throws ApiError
     */
    public static updateBaggage(
        id: string,
        requestBody: Baggage,
    ): CancelablePromise<Baggage> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/baggages/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Données invalides`,
                404: `Bagage non trouvé`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Supprimer un bagage
     * Supprime un bagage par son ID.
     * @param id
     * @returns void
     * @throws ApiError
     */
    public static deleteBaggage(
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/baggages/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Bagage non trouvé`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Obtenir tous les bagages
     * Récupère la liste de tous les bagages.
     * @returns Baggage Liste récupérée avec succès
     * @throws ApiError
     */
    public static getAllBaggages(): CancelablePromise<Array<Baggage>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/baggages',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Créer un bagage
     * Ajoute un nouveau bagage.
     * @param requestBody
     * @returns Baggage Bagage créé avec succès
     * @throws ApiError
     */
    public static createBaggage(
        requestBody: Baggage,
    ): CancelablePromise<Baggage> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/baggages',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Données invalides`,
                500: `Internal Server Error`,
            },
        });
    }
}
