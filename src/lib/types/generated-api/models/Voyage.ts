/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Voyage = {
    idVoyage?: string;
    titre?: string;
    description?: string;
    dateDepartPrev?: string;
    lieuDepart?: string;
    dateDepartEffectif?: string;
    dateArriveEffectif?: string;
    lieuArrive?: string;
    heureDepartEffectif?: string;
    pointDeDepart?: string;
    pointArrivee?: string;
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
    nbrPlaceReservable?: number;
    nbrPlaceReserve?: number;
    nbrPlaceConfirm?: number;
    nbrPlaceRestante?: number;
    datePublication?: string;
    dateLimiteReservation?: string;
    dateLimiteConfirmation?: string;
    statusVoyage?: 'EN_ATTENTE' | 'PUBLIE' | 'EN_COURS' | 'TERMINE' | 'ANNULE';
    smallImage?: string;
    bigImage?: string;
    amenities?: Array<'WIFI' | 'AC' | 'USB' | 'SNACKS' | 'BEVERAGES' | 'POWER_OUTLETS' | 'ENTERTAINMENT' | 'COMFORTABLE_SEATS' | 'RESTROOMS' | 'LUGGAGE_STORAGE' | 'CHILD_SEATS' | 'PET_FRIENDLY' | 'AIRPORT_PICKUP' | 'AIRPORT_DROP_OFF' | 'MEAL_SERVICE' | 'ONBOARD_GUIDE' | 'SEAT_SELECTION' | 'GROUP_DISCOUNTS' | 'LATE_CHECK_IN' | 'LATE_CHECK_OUT'>;
};
export namespace Voyage {
    export enum statusVoyage {
        EN_ATTENTE = 'EN_ATTENTE',
        PUBLIE = 'PUBLIE',
        EN_COURS = 'EN_COURS',
        TERMINE = 'TERMINE',
        ANNULE = 'ANNULE',
    }
}



