/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Coupon = {
    idCoupon?: string;
    dateDebut?: string;
    dateFin?: string;
    statusCoupon?: Coupon.statusCoupon;
    valeur?: number;
    idHistorique?: string;
    idSoldeIndemnisation?: string;
};
export namespace Coupon {
    export enum statusCoupon {
        VALIDE = 'VALIDE',
        EXPIRER = 'EXPIRER',
        UTILISER = 'UTILISER',
    }
}

