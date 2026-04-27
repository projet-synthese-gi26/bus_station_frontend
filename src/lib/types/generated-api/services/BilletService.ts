/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BilletDTO } from '../models/BilletDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BilletService {
    /**
     * Obtenir les informations d'un billet
     * Cette méthode permet de récupérer toutes les informations liées à un billet, y compris les informations sur le passager et le voyage.
     * @param idPassager
     * @returns BilletDTO Billet trouvé et retourné avec succès
     * @throws ApiError
     */
    public static getBilletInformation(
        idPassager: string,
    ): CancelablePromise<BilletDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/utilisateur/billet/{idPassager}',
            path: {
                'idPassager': idPassager,
            },
            errors: {
                404: `Le passager ou les informations associées n'ont pas été trouvés`,
                500: `Erreur interne du serveur`,
            },
        });
    }
}
