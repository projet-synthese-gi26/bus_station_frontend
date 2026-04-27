/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EmployeResponseDTO = {
    employeId?: string;
    userId?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    poste?: string;
    departement?: string;
    dateEmbauche?: string;
    statutEmploye?: EmployeResponseDTO.statutEmploye;
    nomManager?: string;
    agenceVoyageId?: string;
    nomAgence?: string;
};
export namespace EmployeResponseDTO {
    export enum statutEmploye {
        ACTIF = 'ACTIF',
        INACTIF = 'INACTIF',
        SUSPENDU = 'SUSPENDU',
        EN_CONGE = 'EN_CONGE',
        DEMISSIONNE = 'DEMISSIONNE',
        LICENCIE = 'LICENCIE',
    }
}

