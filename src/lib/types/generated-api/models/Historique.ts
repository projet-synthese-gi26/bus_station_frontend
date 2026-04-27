/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Historique = {
    idHistorique?: string;
    statusHistorique?: Historique.statusHistorique;
    dateReservation?: string;
    dateConfirmation?: string;
    dateAnnulation?: string;
    causeAnnulation?: string;
    origineAnnulation?: string;
    tauxAnnulation?: number;
    compensation?: number;
    idReservation?: string;
};
export namespace Historique {
    export enum statusHistorique {
        ANNULER_PAR_AGENCE_APRES_RESERVATION = 'ANNULER_PAR_AGENCE_APRES_RESERVATION',
        ANNULER_PAR_USAGER_APRES_RESERVATION = 'ANNULER_PAR_USAGER_APRES_RESERVATION',
        ANNULER_PAR_AGENCE_APRES_CONFIRMATION = 'ANNULER_PAR_AGENCE_APRES_CONFIRMATION',
        ANNULER_PAR_USAGER_APRES_CONFIRMATION = 'ANNULER_PAR_USAGER_APRES_CONFIRMATION',
        VALIDER = 'VALIDER',
    }
}

