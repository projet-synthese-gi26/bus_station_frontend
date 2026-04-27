/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TauxPeriode } from './TauxPeriode';
export type PolitiqueAnnulation = {
    idPolitique?: string;
    listeTauxPeriode?: Array<TauxPeriode>;
    dureeCoupon?: {
        seconds?: number;
        zero?: boolean;
        nano?: number;
        negative?: boolean;
        units?: Array<{
            durationEstimated?: boolean;
            duration?: {
                seconds?: number;
                zero?: boolean;
                nano?: number;
                negative?: boolean;
            };
            timeBased?: boolean;
            dateBased?: boolean;
        }>;
    };
    idAgenceVoyage?: string;
};

