/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Vehicule } from '../models/Vehicule';
import type { VehiculeDTO } from '../models/VehiculeDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class VehiculeControllerService {
    /**
     * Obtenir un vehicule par ID
     * Récupère un vehicule en fonction de son identifiant.
     * @param id
     * @returns Vehicule Vehicule trouvé
     * @throws ApiError
     */
    public static getVehiculeById(
        id: string,
    ): CancelablePromise<Vehicule> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/vehicule/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Vehicule non trouvé`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Mettre à jour un vehicule
     * Modifie un vehicule existant.
     * @param id
     * @param requestBody
     * @returns Vehicule Vehicule mis à jour avec succès
     * @throws ApiError
     */
    public static updateVehicule(
        id: string,
        requestBody: VehiculeDTO,
    ): CancelablePromise<Vehicule> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/vehicule/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Données invalides`,
                404: `vehicule non trouvé`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Supprimer un vehicule
     * Supprime un vehicule en fonction de son identifiant.
     * @param id
     * @returns void
     * @throws ApiError
     */
    public static deleteVehicule(
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/vehicule/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Vehicule non trouvé`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Obtenir tous les vehicules
     * Récupère la liste de tous les vehicules enregistrés.
     * @param page
     * @param size
     * @returns Vehicule Liste récupérée avec succès
     * @throws ApiError
     */
    public static getAllVehicules(
        page?: number,
        size: number = 10,
    ): CancelablePromise<Array<Vehicule>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/vehicule',
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
     * Créer un vehicule
     * Ajoute un nouveau vehicule à la base de données.
     * @param requestBody
     * @returns Vehicule Vehicule créé avec succès
     * @throws ApiError
     */
    public static createVehicule(
        requestBody: VehiculeDTO,
    ): CancelablePromise<Vehicule> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/vehicule',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Données invalides`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Obtenir tous les vehicules d'une agence
     * Récupère la liste de tous les vehicules de l'agence dont l'id est passé dans la route enregistrés.
     * @param idAgence
     * @returns Vehicule Liste récupérée avec succès
     * @throws ApiError
     */
    public static getAllVehiculesForAgence(
        idAgence: string,
    ): CancelablePromise<Array<Vehicule>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/vehicule/agence/{idAgence}',
            path: {
                'idAgence': idAgence,
            },
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
}
