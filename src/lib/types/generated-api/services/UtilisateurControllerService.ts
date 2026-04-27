/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthentificationDTO } from '../models/AuthentificationDTO';
import type { ChauffeurRequestDTO } from '../models/ChauffeurRequestDTO';
import type { EmployeRequestDTO } from '../models/EmployeRequestDTO';
import type { UserDTO } from '../models/UserDTO';
import type { UserDTO2 } from '../models/UserDTO2';
import type { UserResponseCreatedDTO } from '../models/UserResponseCreatedDTO';
import type { UserResponseDTO } from '../models/UserResponseDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UtilisateurControllerService {
    /**
     * Update employe agence voyage
     * @param employeId
     * @param requestBody
     * @returns UserResponseCreatedDTO Employe updated successfully
     * @throws ApiError
     */
    public static updateEmployeAgenceVoyage(
        employeId: string,
        requestBody: EmployeRequestDTO,
    ): CancelablePromise<UserResponseCreatedDTO> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/utilisateur/employe/{employeId}',
            path: {
                'employeId': employeId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Employe not found`,
                409: `Conflict with existing data`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Delete employe agence voyage
     * @param employeId
     * @returns void
     * @throws ApiError
     */
    public static deleteEmployeAgenceVoyage(
        employeId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/utilisateur/employe/{employeId}',
            path: {
                'employeId': employeId,
            },
            errors: {
                400: `User is not an employe`,
                404: `Employe not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Update chauffeur agence voyage
     * @param chauffeurId
     * @param requestBody
     * @returns UserResponseCreatedDTO Chauffeur updated successfully
     * @throws ApiError
     */
    public static updateChauffeurAgenceVoyage(
        chauffeurId: string,
        requestBody: ChauffeurRequestDTO,
    ): CancelablePromise<UserResponseCreatedDTO> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/utilisateur/chauffeur/{chauffeurId}',
            path: {
                'chauffeurId': chauffeurId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Chauffeur not found`,
                409: `Conflict with existing data`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Delete chauffeur agence voyage
     * @param chauffeurId
     * @returns void
     * @throws ApiError
     */
    public static deleteChauffeurAgenceVoyage(
        chauffeurId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/utilisateur/chauffeur/{chauffeurId}',
            path: {
                'chauffeurId': chauffeurId,
            },
            errors: {
                404: `Chauffeur not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Sign up a user
     * @param requestBody
     * @returns UserResponseCreatedDTO OK
     * @throws ApiError
     */
    public static inscription(
        requestBody: UserDTO,
    ): CancelablePromise<UserResponseCreatedDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/utilisateur/inscription',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Create employe agence voyage
     * @param requestBody
     * @returns UserResponseCreatedDTO Employe created successfully
     * @throws ApiError
     */
    public static createEmployeAgenceVoyage(
        requestBody: EmployeRequestDTO,
    ): CancelablePromise<UserResponseCreatedDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/utilisateur/employe',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                409: `User already exists`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Get a token for an user
     * @param requestBody
     * @returns UserResponseDTO OK
     * @throws ApiError
     */
    public static getToken(
        requestBody: AuthentificationDTO,
    ): CancelablePromise<UserResponseDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/utilisateur/connexion',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Create chauffeur agence voyage
     * @param requestBody
     * @returns UserResponseCreatedDTO Chauffeur created successfully
     * @throws ApiError
     */
    public static createChauffeurAgenceVoyage(
        requestBody: ChauffeurRequestDTO,
    ): CancelablePromise<UserResponseCreatedDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/utilisateur/chauffeur',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                409: `User already exists`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Test endpoint
     * @returns string OK
     * @throws ApiError
     */
    public static test(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/utilisateur/test',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Get a user information by token
     * @returns UserDTO2 User information
     * @throws ApiError
     */
    public static getMethodName(): CancelablePromise<UserDTO2> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/utilisateur/profil',
            errors: {
                404: `User not found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Get employes by agence ID
     * @param agenceId
     * @returns UserResponseDTO Employes found successfully
     * @throws ApiError
     */
    public static getEmployesByAgenceId(
        agenceId: string,
    ): CancelablePromise<Array<UserResponseDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/utilisateur/employes/{agenceId}',
            path: {
                'agenceId': agenceId,
            },
            errors: {
                404: `Agence not found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Get chauffeurs by agence ID
     * @param agenceId
     * @returns UserResponseDTO Chauffeurs found successfully
     * @throws ApiError
     */
    public static getChauffeursByAgenceId(
        agenceId: string,
    ): CancelablePromise<UserResponseDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/utilisateur/chauffeurs/{agenceId}',
            path: {
                'agenceId': agenceId,
            },
            errors: {
                404: `Agence not Found`,
                500: `Internal Server Error`,
            },
        });
    }
}
