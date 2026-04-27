/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AgenceVoyage } from './AgenceVoyage';
import type { Passager } from './Passager';
import type { Reservation } from './Reservation';
import type { Vehicule } from './Vehicule';
import type { Voyage } from './Voyage';
export type ReservationDetailDTO = {
    reservation?: Reservation;
    passager?: Array<Passager>;
    voyage?: Voyage;
    agence?: AgenceVoyage;
    vehicule?: Vehicule;
};

