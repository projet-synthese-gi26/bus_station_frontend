import axiosInstance from "@/lib/services/axios-services/axiosInstance";
import {ReservationCreationSchema} from "@/lib/types/schema/reservationCreationSchema";
import {AxiosError, AxiosResponse} from "axios";
import {Reservation, ReservationDetails} from "@/lib/types/models/Reservation";
import {PaymentRequestFormType} from "@/lib/types/schema/paymentRequestSchema";
import {PaginatedResponse} from "@/lib/types/common";
import {ReservationPreviewDTO} from "@/lib/types/generated-api";


const url :string= "reservation";





export async function createReservation(data: ReservationCreationSchema): Promise<Reservation|null>
{
    if (!data) throw new Error("reservation data must not be empty");
    try
    {
        const apiResponse: AxiosResponse<Reservation> = await axiosInstance.post(`${url}/reserver`, data);
        if(apiResponse.status === 201)
        {
            console.log(apiResponse);
            return apiResponse.data;
        }
        else
        {
            console.warn("unattended http code ", apiResponse.status, apiResponse);
            return null;
        }
    }
    catch(error)
    {
        console.error("erreur lors de la reservation ", error);
        throw error;
    }
}


export async function createPayment(data: PaymentRequestFormType): Promise<string|number>
{
    if (!data) throw new Error("payment data must not be empty");
    try
    {
        const apiResponse: AxiosResponse<void> = await axiosInstance.put(`${url}/payer`, data);
        if(apiResponse.status === 200 || apiResponse.status === 204)
        {
            console.info("payment success", apiResponse.data);
            return "payment success";
        }
        else
        {
            console.warn("unattended http code ", apiResponse.status, apiResponse);
            return apiResponse.status;
        }
    }
    catch(error)
    {
        console.error("erreur lors de la reservation ", error);
        throw error;
    }

}


export async function getCustomerReservations(idUser: string): Promise<PaginatedResponse<ReservationDetails>|null>
{
    try
    {
        const apiResponse: AxiosResponse<PaginatedResponse<ReservationDetails>> = await axiosInstance.get(`/${url}/utilisateur/${idUser}`);
        if(apiResponse.status === 200)
        {
            console.log(apiResponse);
            return apiResponse.data;
        }
        else
        {
            console.warn("unattended http code ", apiResponse.status, apiResponse);
            return null;
        }
    }
    catch (error)
    {
        console.error("error during retrieving reservation ", error);
        throw error;
    }
}


export async function getReservationDetail(idReservation: string): Promise<ReservationDetails|null>
{
    try {
        const apiResponse: AxiosResponse<ReservationDetails> = await axiosInstance.get(`/${url}/${idReservation}`);
        if (apiResponse.status === 200) {
            console.log(apiResponse);
            return apiResponse.data;
        }
        else
        {
            console.warn("unattended http code ", apiResponse.status, apiResponse);
            return null;
        }
    }catch (error)
    {
        console.error("error during retrieving reservation detail ", error);
        throw error;
    }
}

/**
 * Récupère la liste paginée de toutes les réservations pour les voyages d'une agence.
 * @param agencyId - L'ID de l'agence.
 * @returns Une promesse résolue avec les données paginées des réservations.
 */
export async function getReservationsByAgency(agencyId: string): Promise<PaginatedResponse<ReservationPreviewDTO>> {
    if (!agencyId) {
        throw new Error("L'ID de l'agence est requis pour récupérer les réservations.");
    }
    try {
        const response: AxiosResponse<PaginatedResponse<ReservationPreviewDTO>> = await axiosInstance.get(`${url}/agence/${agencyId}`,);
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError;
        console.error(`[reservation-service] Erreur lors de la récupération des réservations pour l'agence ${agencyId}:`, error);
        throw axiosError;
    }
}