/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class NotificationsService {
    /**
     * Tester l'envoi d'une notification
     * Envoie une notification de test à l'adresse email spécifiée. Endpoint de développement uniquement.
     * @param email Adresse email du destinataire
     * @returns any Notification envoyée avec succès
     * @throws ApiError
     */
    public static testNotification(
        email: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/notification/test',
            query: {
                'email': email,
            },
            errors: {
                400: `Erreur lors de l'envoi de la notification`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Tester une notification de bienvenue
     * Envoie une notification de bienvenue à un utilisateur existant basée sur son ID
     * @param userId Identifiant unique de l'utilisateur
     * @returns any Notification de bienvenue envoyée avec succès
     * @throws ApiError
     */
    public static testWelcomeNotification(
        userId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/notification/test-welcome/{userId}',
            path: {
                'userId': userId,
            },
            errors: {
                400: `Erreur lors de l'envoi ou utilisateur non trouvé`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Tester une notification par type
     * Envoie une notification selon le type spécifié avec des données de test appropriées
     * @param type Type de notification à envoyer
     * @param email Adresse email du destinataire
     * @param recipientName Nom du destinataire (optionnel)
     * @returns any Notification envoyée avec succès
     * @throws ApiError
     */
    public static testNotificationByType(
        type: 'VOYAGE_CREATED' | 'VOYAGE_UPDATED' | 'VOYAGE_CANCELLED' | 'VOYAGE_PUBLISHED' | 'RESERVATION_CREATED' | 'RESERVATION_CONFIRMED' | 'RESERVATION_CANCELLED' | 'RESERVATION_EXPIRED' | 'PAYMENT_RECEIVED' | 'PAYMENT_FAILED' | 'PAYMENT_PENDING' | 'USER_REGISTERED' | 'USER_PROFILE_UPDATED' | 'PASSWORD_RESET' | 'AGENCY_CREATED' | 'AGENCY_UPDATED' | 'DRIVER_ASSIGNED' | 'DRIVER_UNASSIGNED' | 'EMPLOYEE_ADDED' | 'EMPLOYEE_UPDATED' | 'EMPLOYEE_REMOVED' | 'ORGANIZATION_CREATED' | 'ORGANIZATION_UPDATED' | 'SYSTEM_MAINTENANCE' | 'SYSTEM_UPDATE',
        email: string,
        recipientName?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/notification/test-type',
            query: {
                'type': type,
                'email': email,
                'recipientName': recipientName,
            },
            errors: {
                400: `Erreur lors de l'envoi de la notification`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Lister les types de notifications
     * Retourne la liste de tous les types de notifications disponibles dans le système
     * @returns string Liste des types de notifications récupérée avec succès
     * @throws ApiError
     */
    public static getNotificationTypes(): CancelablePromise<'VOYAGE_CREATED' | 'VOYAGE_UPDATED' | 'VOYAGE_CANCELLED' | 'VOYAGE_PUBLISHED' | 'RESERVATION_CREATED' | 'RESERVATION_CONFIRMED' | 'RESERVATION_CANCELLED' | 'RESERVATION_EXPIRED' | 'PAYMENT_RECEIVED' | 'PAYMENT_FAILED' | 'PAYMENT_PENDING' | 'USER_REGISTERED' | 'USER_PROFILE_UPDATED' | 'PASSWORD_RESET' | 'AGENCY_CREATED' | 'AGENCY_UPDATED' | 'DRIVER_ASSIGNED' | 'DRIVER_UNASSIGNED' | 'EMPLOYEE_ADDED' | 'EMPLOYEE_UPDATED' | 'EMPLOYEE_REMOVED' | 'ORGANIZATION_CREATED' | 'ORGANIZATION_UPDATED' | 'SYSTEM_MAINTENANCE' | 'SYSTEM_UPDATE'> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/notification/types',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
}
