/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UserResponseCreatedDTO = {
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
    created_by?: string;
    updated_by?: string;
    id?: string;
    email?: string;
    friendly_name?: string;
    secondary_email?: string;
    date_of_birth?: string;
    gender?: 'MALE'|'FEMALE';
    country_code?: string;
    dial_code?: string;
    secondary_phone_number?: string;
    avatar_picture?: string;
    profile_picture?: string;
    country_id?: string;
    last_login_time?: string;
    keywords?: Array<string>;
    registration_date?: string;
    type?: 'PROVIDER'|'CONSUMER';
    first_name?: string;
    last_name?: string;
    username?: string;
    phone_number?: string;
    roles?: Array<'USAGER' | 'EMPLOYE' | 'AGENCE_VOYAGE' | 'ORGANISATION'>;
};
export namespace UserResponseCreatedDTO {
    export enum gender {
        MALE = 'MALE',
        FEMALE = 'FEMALE',
    }
    export enum type {
        PROVIDER = 'PROVIDER',
        CONSUMER = 'CONSUMER',
    }
}

