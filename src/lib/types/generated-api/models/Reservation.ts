/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Reservation = {
    idReservation?: string;
    dateReservation?: string;
    dateConfirmation?: string;
    nbrPassager?: number;
    prixTotal?: number;
    statutReservation?: Reservation.statutReservation;
    idUser?: string;
    idVoyage?: string;
    statutPayement?: Reservation.statutPayement;
    transactionCode?: string;
    montantPaye?: number;
};
export namespace Reservation {
    export enum statutReservation {
        RESERVER = 'RESERVER',
        CONFIRMER = 'CONFIRMER',
        ANNULER = 'ANNULER',
        VALIDER = 'VALIDER',
    }
    export enum statutPayement {
        PENDING = 'PENDING',
        NO_PAYMENT = 'NO_PAYMENT',
        PAID = 'PAID',
        FAILED = 'FAILED',
    }
}

