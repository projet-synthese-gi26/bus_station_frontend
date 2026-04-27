/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AgenceVoyage } from '../models/AgenceVoyage';
import type { CreateOrganizationRequest } from '../models/CreateOrganizationRequest';
import type { OrganizationDto } from '../models/OrganizationDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OrganizationControllerService {
    /**
     * @param requestBody
     * @returns OrganizationDto OK
     * @throws ApiError
     */
    public static createOrganization(
        requestBody: CreateOrganizationRequest,
    ): CancelablePromise<OrganizationDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/organizations',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Obtenir toutes les agences d'une organisations
     * Récupère la liste de toutes les agences de l'organisation
     * @param organisationId
     * @returns AgenceVoyage Liste récupérée avec succès
     * @throws ApiError
     */
    public static getAllCoupons1(
        organisationId: string,
    ): CancelablePromise<Array<AgenceVoyage>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/organizations/agencies/{organisationId}',
            path: {
                'organisationId': organisationId,
            },
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
}
