/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EmployeRequestDTO = {
    last_name?: string;
    first_name?: string;
    email: string;
    username: string;
    password: string;
    phone_number?: string;
    role: Array<'USAGER' | 'EMPLOYE' | 'AGENCE_VOYAGE' | 'ORGANISATION'>;
    gender: 'MALE'|'FEMALE'//EmployeRequestDTO.gender;
    agenceVoyageId: string;
    poste?: string;
    departement?: string;
    salaire?: number;
    managerId?: string;
    userExist?: boolean;
};
export namespace EmployeRequestDTO {
    export enum gender {
        MALE = 'MALE',
        FEMALE = 'FEMALE',
    }
}

