/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Données nécessaires pour annuler la réservation (ID de la réservation et informations supplémentaires).
 */
export type ReservationCancelDTO = {
    causeAnnulation?: string;
    origineAnnulation?: string;
    idReservation?: string;
    idPassagers?: Array<string>;
    canceled?: boolean;
};

