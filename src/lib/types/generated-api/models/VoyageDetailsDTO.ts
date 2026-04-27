/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserResponseDTO } from './UserResponseDTO';
import type { Vehicule } from './Vehicule';
import {Amenity} from "@/lib/types/generated-api/models/VoyageCreateRequestDTO";
export type VoyageDetailsDTO = {
    idVoyage?: string;
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
    nbrPlaceReservable?: number;
    nbrPlaceRestante?: number;
    datePublication?: string;
    dateLimiteReservation?: string;
    dateLimiteConfirmation?: string;
    statusVoyage?: VoyageDetailsDTO.statusVoyage;
    smallImage?: string;
    bigImage?: string;
    nomClasseVoyage?: string;
    prix?: number;
    nomAgence?: string;
    pointDeDepart?: string;
    pointArrivee?: string;
    vehicule?: Vehicule;
    chauffeur?: UserResponseDTO;
    placeReservees?: Array<number>;
    amenities?: Array<Amenity>;
};


export namespace VoyageDetailsDTO {
    export enum statusVoyage {
        EN_ATTENTE = 'EN_ATTENTE',
        PUBLIE = 'PUBLIE',
        EN_COURS = 'EN_COURS',
        TERMINE = 'TERMINE',
        ANNULE = 'ANNULE',
    }
}

