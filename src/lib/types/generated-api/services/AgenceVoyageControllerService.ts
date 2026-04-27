/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AgenceVoyage } from '../models/AgenceVoyage';
import type { AgenceVoyageDTO } from '../models/AgenceVoyageDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AgenceVoyageControllerService {
    /**
     * Create a new travel agency
     * @param requestBody
     * @returns AgenceVoyage Travel agency created successfully
     * @throws ApiError
     */
    public static createAgence(
        requestBody: AgenceVoyageDTO,
    ): CancelablePromise<AgenceVoyage> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/agence',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid input or duplicate agency names`,
                404: `User not found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Delete a travel agency
     * @param id
     * @returns void
     * @throws ApiError
     */
    public static deleteAgence(
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/agence/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Agency not found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Update an existing travel agency
     * @param id
     * @param requestBody
     * @returns AgenceVoyage Travel agency updated successfully
     * @throws ApiError
     */
    public static updateAgence(
        id: string,
        requestBody: AgenceVoyageDTO,
    ): CancelablePromise<AgenceVoyage> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/agence/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid input or duplicate agency names`,
                404: `Agency not found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Retouner une agence d evoyage à partir de l'id du chef d'agence
     * @param id
     * @returns AgenceVoyage Agence trouvée
     * @throws ApiError
     */
    public static getChefAgenceById(
        id: string,
    ): CancelablePromise<AgenceVoyage> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/agence/chef-agence/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Agence non trouvée`,
                500: `Internal Server Error`,
            },
        });
    }
}
