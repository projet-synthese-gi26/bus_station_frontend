import { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "@/lib/services/axios-services/axiosInstance";
import {Trip, TripDetails} from "@/lib/types/models/Trip";
import { PaginatedResponse } from "../types/common";
import { TripAxiosResponseInterface } from "@/lib/types/models/Trip";
import {Voyage, VoyageCreateRequestDTO, VoyageDetailsDTO} from "../types/generated-api";

const url: string = "voyage";

export async function retrieveAllTrips(): Promise<TripAxiosResponseInterface | null> {
  try {
    const apiResponse: AxiosResponse<TripAxiosResponseInterface> = await axiosInstance.get(`/${url}/all`);
    if (apiResponse.status === 200) {
      return apiResponse.data;
    } else {
      console.warn("Unattended http code", apiResponse.status);
      return null;
    }
  } catch (error) {
    console.error("error during retrieving trips", error);
    throw new Error("error during retrieving trips");
  }
}

export async function retrieveTripDetail(tripId: string): Promise<Trip | null> {
  if (!tripId || tripId === "") throw new Error("the trip id must not empty");
  try {
    const apiResponse: AxiosResponse<Trip> = await axiosInstance.get(`/${url}/byId/${tripId}`);
    if (apiResponse.status === 200) {
      console.log(apiResponse);
      return apiResponse.data;
    } else {
      console.warn("Unattended http code", apiResponse.status);
      return null;
    }
  } catch (error) {
    console.error("error during retrieving trips", error);
    throw new Error("error during retrieving trips");
  }
}

export async function createTrip(data: VoyageCreateRequestDTO): Promise<Voyage | null> {
  try {
    const response: AxiosResponse<Voyage> = await axiosInstance.post(`${url}/create`, data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("[trip-service] Erreur lors de la création du voyage:", axiosError.response?.data || axiosError.message);
    throw axiosError;
  }
}


export async function updateTrip(id: string, data: Partial<VoyageCreateRequestDTO>): Promise<Voyage | null> {
  try {
    const response: AxiosResponse<Voyage> = await axiosInstance.put(`${url}/${id}`, data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(`[trip-service] Erreur de mise à jour du voyage ${id}:`, axiosError.response?.data || axiosError.message);
    throw axiosError;
  }
}


export async function getTripsByAgency(agencyId: string): Promise<PaginatedResponse<TripDetails> | null> {
  if (!agencyId) return null;
  try {
    const response: AxiosResponse<PaginatedResponse<TripDetails>> = await axiosInstance.get(`${url}/agence/${agencyId}`);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("[trip-service] Erreur de récupération des voyages par agence:", axiosError.response?.data || axiosError.message);
    throw axiosError;
  }
}


/**
 * Publie un voyage en mettant à jour son statut.
 * @param tripId L'ID du voyage à publier.
 * @returns Le voyage mis à jour.
 */
export async function publishTrip(tripId: string): Promise<Voyage|null> {
  console.log(`[trip-service] Publication du voyage ID: ${tripId}`);
  // Le backend attend un corps de requête pour un PUT, même pour juste changer le statut.
  // On passe un objet partiel pour changer uniquement le statut.
  return await updateTrip(tripId, { statusVoyage: 'PUBLIE' });
}


// AJOUTÉ : Fonction pour récupérer les détails complets, nécessaire pour l'édition
export async function getTripDetailsForEdit(tripId: string): Promise<VoyageDetailsDTO> {
  try {
    const response: AxiosResponse<VoyageDetailsDTO> = await axiosInstance.get(`${url}/byId/${tripId}`);
    return response.data;
  } catch (error) {
    throw error as AxiosError;
  }
}



/**
 * Supprime un voyage de manière définitive.
 * @param tripId - L'ID du voyage à supprimer.
 */
export async function deleteVoyage(tripId: string): Promise<void> {
  try {
    await axiosInstance.delete(`${url}/${tripId}`);
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(`[trip-service] Erreur lors de la suppression du voyage ${tripId}:`, axiosError.response?.data || axiosError.message);
    throw axiosError;
  }
}

