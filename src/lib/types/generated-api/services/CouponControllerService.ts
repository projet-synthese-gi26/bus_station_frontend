/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Coupon } from '../models/Coupon';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CouponControllerService {
    /**
     * Obtenir un coupon par ID
     * Récupère un coupon spécifique par son ID.
     * @param id
     * @returns Coupon Coupon trouvé
     * @throws ApiError
     */
    public static getCouponById(
        id: string,
    ): CancelablePromise<Coupon> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/coupon/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Coupon non trouvé`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Mettre à jour un coupon
     * Modifie un coupon existant.
     * @param id
     * @param requestBody
     * @returns Coupon Coupon mis à jour avec succès
     * @throws ApiError
     */
    public static updateCoupon(
        id: string,
        requestBody: Coupon,
    ): CancelablePromise<Coupon> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/coupon/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Données invalides`,
                404: `Coupon non trouvé`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Supprimer un coupon
     * Supprime un coupon par son ID.
     * @param id
     * @returns void
     * @throws ApiError
     */
    public static deleteCoupon(
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/coupon/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Coupon non trouvé`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Obtenir tous les coupons
     * Récupère la liste de tous les coupons.
     * @returns Coupon Liste récupérée avec succès
     * @throws ApiError
     */
    public static getAllCoupons(): CancelablePromise<Array<Coupon>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/coupon',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Créer un coupon
     * Ajoute un nouveau coupon.
     * @param requestBody
     * @returns Coupon Coupon créé avec succès
     * @throws ApiError
     */
    public static createCoupon(
        requestBody: Coupon,
    ): CancelablePromise<Coupon> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/coupon',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Données invalides`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Obtenir tous les coupons d'un utilisateur
     * Récupère la liste de tous les coupons d'un utilisateur.
     * @param userId
     * @returns Coupon Liste récupérée avec succès
     * @throws ApiError
     */
    public static getCouponsByUserId(
        userId: string,
    ): CancelablePromise<Array<Coupon>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/coupon/user/{userId}',
            path: {
                'userId': userId,
            },
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
}
