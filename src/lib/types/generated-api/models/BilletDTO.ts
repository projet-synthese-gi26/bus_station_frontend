/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type BilletDTO = {
    titre?: string;
    description?: string;
    dateDepartPrev?: string;
    lieuDepart?: string;
    dateDepartEffectif?: string;
    dateArriveEffectif?: string;
    lieuArrive?: string;
    heureDepartEffectif?: string;
    dureeVoyage?: {
        seconds?: number;
        zero?: boolean;
        nano?: number;
        negative?: boolean;
        units?: Array<{
            durationEstimated?: boolean;
            timeBased?: boolean;
            dateBased?: boolean;
        }>;
    };
    heureArrive?: string;
    statusVoyage?: BilletDTO.statusVoyage;
    smallImage?: string;
    bigImage?: string;
    nomClasseVoyage?: string;
    prix?: number;
    nomAgence?: string;
    pointDeDepart?: string;
    pointArrivee?: string;
    numeroPieceIdentific?: string;
    nom?: string;
    genre?: string;
    age?: number;
    nbrBaggage?: number;
    placeChoisis?: number;
};
export namespace BilletDTO {
    export enum statusVoyage {
        EN_ATTENTE = 'EN_ATTENTE',
        PUBLIE = 'PUBLIE',
        EN_COURS = 'EN_COURS',
        TERMINE = 'TERMINE',
        ANNULE = 'ANNULE',
    }
}

