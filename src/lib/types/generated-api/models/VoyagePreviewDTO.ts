/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type VoyagePreviewDTO = {
    idVoyage?: string;
    nomAgence?: string;
    lieuDepart?: string;
    lieuArrive?: string;
    nbrPlaceRestante?: number;
    nbrPlaceReservable?: number;
    dateDepartPrev?: string;
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
    nomClasseVoyage?: string;
    prix?: number;
    smallImage?: string;
    bigImage?: string;
    amenities?: Array<'WIFI' | 'AC' | 'USB' | 'SNACKS' | 'BEVERAGES' | 'POWER_OUTLETS' | 'ENTERTAINMENT' | 'COMFORTABLE_SEATS' | 'RESTROOMS' | 'LUGGAGE_STORAGE' | 'CHILD_SEATS' | 'PET_FRIENDLY' | 'AIRPORT_PICKUP' | 'AIRPORT_DROP_OFF' | 'MEAL_SERVICE' | 'ONBOARD_GUIDE' | 'SEAT_SELECTION' | 'GROUP_DISCOUNTS' | 'LATE_CHECK_IN' | 'LATE_CHECK_OUT'>;
};

