/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UserDTO = {
    last_name?: string;
    first_name?: string;
    email: string;
    username: string;
    password: string;
    phone_number?: string;
    role: Array<'USAGER' | 'EMPLOYE' | 'AGENCE_VOYAGE' | 'ORGANISATION'>;
    gender: UserDTO.gender;
};
export namespace UserDTO {
    export enum gender {
        MALE = 'MALE',
        FEMALE = 'FEMALE',
    }
}

