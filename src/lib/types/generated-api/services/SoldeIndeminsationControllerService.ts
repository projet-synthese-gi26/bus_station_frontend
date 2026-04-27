/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { SoldeIndemnisation } from '@/lib/types/generated-api';
import type { VoyagePreviewDTO } from '@/lib/types/generated-api';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SoldeIndeminsationControllerService {
    /**
     * Obtenir un solde indemnisation par son ID
     * Récupère un solde indemnisation en fonction de son identifiant.
     * @param id
     * @returns SoldeIndemnisation solde indemnisation trouvé
     * @throws ApiError
     */
    public static getVoyageById(
        id: string,
    ): CancelablePromise<SoldeIndemnisation> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/solde-indemnisation/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `solde indemnisation non trouvé`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Mettre à jour un solde indemnisation
     * Modifie un solde indemnisation existant.
     * @param id
     * @param requestBody
     * @returns SoldeIndemnisation solde indemnisation mis à jour avec succès
     * @throws ApiError
     */
    public static updateVoyage1(
        id: string,
        requestBody: SoldeIndemnisation,
    ): CancelablePromise<SoldeIndemnisation> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/solde-indemnisation/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Données invalides`,
                404: `solde indemnisation non trouvé`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Supprimer un solde indemnisation
     * Supprime un solde indemnisation en fonction de son identifiant.
     * @param id
     * @returns void
     * @throws ApiError
     */
    public static deleteVoyage1(
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/solde-indemnisation/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `solde indemnisation non trouvé`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Obtenir tous les sodes d'indemnisation
     * Récupère la liste de tous les sodes d'indemnisation enregistrés.
     * @returns VoyagePreviewDTO Liste récupérée avec succès
     * @throws ApiError
     */
    public static getAllVoyages(): CancelablePromise<Array<VoyagePreviewDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/solde-indemnisation',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Créer un solde indemnisation
     * Ajoute un nouveau solde indemnisation à la base de données.
     * @param requestBody
     * @returns SoldeIndemnisation solde indemnisation créé avec succès
     * @throws ApiError
     */
    public static createVoyage1(
        requestBody: SoldeIndemnisation,
    ): CancelablePromise<SoldeIndemnisation> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/solde-indemnisation',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Données invalides`,
                500: `Internal Server Error`,
            },
        });
    }
}
