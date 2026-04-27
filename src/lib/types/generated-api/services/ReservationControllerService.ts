/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PayRequestDTO } from '../models/PayRequestDTO';
import type { Reservation } from '../models/Reservation';
import type { ReservationCancelDTO } from '../models/ReservationCancelDTO';
import type { ReservationDetailDTO } from '../models/ReservationDetailDTO';
import type { ReservationDTO } from '../models/ReservationDTO';
import type { ReservationPreviewDTO } from '../models/ReservationPreviewDTO';
import type { VoyageCancelDTO } from '../models/VoyageCancelDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ReservationControllerService {
    /**
     * Obtenir une réservation et la liste de ses passagers par ID
     * Récupère une réservation spécifique par ID Ainsi que la liste de tout ses passagers.
     * @param id
     * @returns ReservationDetailDTO Réservation trouvée
     * @throws ApiError
     */
    public static getReservationById(
        id: string,
    ): CancelablePromise<ReservationDetailDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/reservation/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Réservation non trouvée`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Mettre à jour une réservation
     * Modifie une réservation existante.
     * @param id
     * @param requestBody
     * @returns Reservation Réservation mise à jour avec succès
     * @throws ApiError
     */
    public static updateReservation(
        id: string,
        requestBody: Reservation,
    ): CancelablePromise<Reservation> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/reservation/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Données invalides`,
                404: `Réservation non trouvée`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Supprimer une réservation
     * Supprime une réservation par son ID.
     * @param id
     * @returns void
     * @throws ApiError
     */
    public static deleteReservation(
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/reservation/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Réservation non trouvée`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Payer une réservation
     * Permet à un utilisateur de payer une réservation. En cas de succès, la réservation est considérée comme payée.
     * @param requestBody
     * @returns string Réservation payée avec succès.
     * @throws ApiError
     */
    public static payerReservation(
        requestBody: PayRequestDTO,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/reservation/payer',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Erreur, données de paiement invalides ou problème avec le paiement.`,
                404: `Réservation inexistante ou non trouvée.`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Annuler un voyage par une agence uniquement
     * Permet d'annuler un voyage.
     * @param voyageCancelDto
     * @returns string Voyage annulé avec succès.
     * @throws ApiError
     */
    public static annulerVoyage(
        voyageCancelDto: VoyageCancelDTO,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/reservation/voyage/annuler',
            query: {
                'voyageCancelDTO': voyageCancelDto,
            },
            errors: {
                400: `Erreur, Voyage non existant ou données invalides.`,
                404: `Voyage inexistant.`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Créer une réservation
     * Ajoute une nouvelle réservation.
     * @param requestBody
     * @returns Reservation Réservation créée avec succès
     * @throws ApiError
     */
    public static createReservation(
        requestBody: ReservationDTO,
    ): CancelablePromise<Reservation> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/reservation/reserver',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Données invalides`,
                404: `le voyage dont l'id est donnée n'existe pas`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Annuler une réservation
     * Permet d'annuler une réservation en par un utilisateur. Si l'annulation a lieu après confirmation, un coupon est généré.
     * @param requestBody
     * @returns string Réservation annulée avec succès.
     * @throws ApiError
     */
    public static annulerReservation(
        requestBody: ReservationCancelDTO,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/reservation/annuler',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Erreur, réservation non existante ou données invalides.`,
                404: `reservation inexistante.`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Obtenir toutes les réservations d'un utilisateur
     * Récupère la liste de toutes les réservations d'un utilisateur.
     * @param idUser
     * @param page
     * @param size
     * @returns ReservationPreviewDTO Liste récupérée avec succès
     * @throws ApiError
     */
    public static getAllReservationsForUser(
        idUser: string,
        page?: number,
        size: number = 10,
    ): CancelablePromise<Array<ReservationPreviewDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/reservation/utilisateur/{idUser}',
            path: {
                'idUser': idUser,
            },
            query: {
                'page': page,
                'size': size,
            },
            errors: {
                400: `données invalides.`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Obtenir toutes les réservations d'une agence
     * Récupère la liste de toutes les réservations pour les voyages d'une agence spécifique.
     * @param agenceId
     * @param page
     * @param size
     * @returns ReservationPreviewDTO Liste récupérée avec succès
     * @throws ApiError
     */
    public static getAllReservationsByAgence(
        agenceId: string,
        page?: number,
        size: number = 10,
    ): CancelablePromise<Array<ReservationPreviewDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/reservation/agence/{agenceId}',
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
