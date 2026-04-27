/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClassVoyage } from '../models/ClassVoyage';
import type { ClassVoyageDTO } from '../models/ClassVoyageDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ClassVoyageControllerService {
    /**
     * Obtenir une classe de voyage par ID
     * Récupère une classe de voyage en fonction de son identifiant.
     * @param id
     * @returns ClassVoyage Classe de voyage trouvée
     * @throws ApiError
     */
    public static getClassVoyageById(
        id: string,
    ): CancelablePromise<ClassVoyage> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/class-voyage/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Classe de voyage non trouvée`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Mettre à jour une classe de voyage
     * Modifie une classe de voyage existante.
     * @param id
     * @param requestBody
     * @returns ClassVoyage Classe de voyage mise à jour avec succès
     * @throws ApiError
     */
    public static updateClassVoyage(
        id: string,
        requestBody: ClassVoyageDTO,
    ): CancelablePromise<ClassVoyage> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/class-voyage/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Données invalides`,
                404: `Classe de voyage non trouvée`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Supprimer une classe de voyage
     * Supprime une classe de voyage en fonction de son identifiant.
     * @param id
     * @returns void
     * @throws ApiError
     */
    public static deleteClassVoyage(
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/class-voyage/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Classe de voyage non trouvée`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Obtenir toutes les classes de voyage
     * Récupère la liste de toutes les classes de voyage enregistrées.
     * @param page
     * @param size
     * @returns ClassVoyage Liste récupérée avec succès
     * @throws ApiError
     */
    public static getAllClassVoyages(
        page?: number,
        size: number = 10,
    ): CancelablePromise<Array<ClassVoyage>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/class-voyage',
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
     * Créer une classe de voyage
     * Ajoute une nouvelle classe de voyage à la base de données.
     * @param requestBody
     * @returns ClassVoyage Classe de voyage créée avec succès
     * @throws ApiError
     */
    public static createClassVoyage(
        requestBody: ClassVoyageDTO,
    ): CancelablePromise<ClassVoyage> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/class-voyage',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Données invalides`,
                500: `Internal Server Error`,
            },
        });
    }
}
