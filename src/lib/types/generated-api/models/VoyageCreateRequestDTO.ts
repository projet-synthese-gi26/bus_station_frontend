/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type VoyageCreateRequestDTO = {
    heureDepartEffectif: string,
    titre: string;
    description: string;
    dateDepartPrev: string;
    lieuDepart: string;
    lieuArrive: string;
    heureArrive: string;
    pointDeDepart: string;
    pointArrivee: string;
    nbrPlaceReservable: number;
    nbrPlaceReserve?: number;
    nbrPlaceConfirm?: number;
    statusVoyage?: 'EN_ATTENTE' | 'PUBLIE' | 'EN_COURS' | 'TERMINE' | 'ANNULE',
    nbrPlaceRestante: number;
    dateLimiteReservation: string;
    dateLimiteConfirmation: string;
    smallImage?: string;
    bigImage?: string;
    chauffeurId: string;
    vehiculeId: string;
    classVoyageId: string;
    agenceVoyageId: string;
    amenities?: Array<Amenity>;
};

export type Amenity= 'WIFI' | 'AC' | 'USB' | 'SNACKS' | 'BEVERAGES' | 'POWER_OUTLETS' | 'ENTERTAINMENT' | 'COMFORTABLE_SEATS' | 'RESTROOMS' | 'LUGGAGE_STORAGE' | 'CHILD_SEATS' | 'PET_FRIENDLY' | 'AIRPORT_PICKUP' | 'AIRPORT_DROP_OFF' | 'MEAL_SERVICE' | 'ONBOARD_GUIDE' | 'SEAT_SELECTION' | 'GROUP_DISCOUNTS' | 'LATE_CHECK_IN' | 'LATE_CHECK_OUT'

export namespace VoyageCreateRequestDTO {
    export enum statusVoyage {
        EN_ATTENTE = 'EN_ATTENTE',
        PUBLIE = 'PUBLIE',
        EN_COURS = 'EN_COURS',
        TERMINE = 'TERMINE',
        ANNULE = 'ANNULE',
    }
}

