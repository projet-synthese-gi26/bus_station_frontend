import { AxiosResponse, AxiosError } from "axios";
import axiosInstance from "./axios-services/axiosInstance";
import {Vehicule, VehiculeDTO} from "../types/generated-api";

const url = "/vehicule";

/**
 * Récupère tous les véhicules d'une agence spécifique.
 * @param agencyId - L'ID de l'agence de voyage.
 * @returns Une promesse résolue avec un tableau de véhicules ou null.
 */
export async function getVehiclesByAgency(agencyId: string): Promise<Vehicule[] | null> {
  console.log(`[vehicule-service] Récupération des véhicules pour l'agence ID: ${agencyId}`);
  if (!agencyId) {
    console.error("[vehicule-service] Erreur: l'ID de l'agence est manquant.");
    return null;
  }
  try {
    const response: AxiosResponse<Vehicule[]> = await axiosInstance.get(
        `${url}/agence/${agencyId}`
    );
    return response.data;
  } catch (error) {
    console.error(`[vehicule-service] Erreur lors de la récupération des véhicules pour l'agence ${agencyId}:`, error);
    throw error;
  }
}

/**
 * Crée un nouveau véhicule pour une agence spécifique.
 * @param data - Les données du véhicule à créer.
 * @returns Une promesse résolue avec les détails du véhicule créé ou null.
 */
export async function createVehicleForAgency(data: VehiculeDTO): Promise<Vehicule | null> {
  console.log("[vehicule-service] Création d'un véhicule avec le payload:", data);
  try {
    const response: AxiosResponse<Vehicule> = await axiosInstance.post(url, data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("[vehicule-service] Erreur lors de la création du véhicule:", axiosError.response?.data || axiosError.message);
    throw axiosError;
  }
}



/**
 * Met à jour un véhicule existant.
 * @param vehicleId - L'ID du véhicule à modifier.
 * @param data - Les nouvelles données du véhicule.
 * @returns Une promesse résolue avec le véhicule mis à jour.
 */
export async function updateVehicle(vehicleId: string, data: VehiculeDTO): Promise<Vehicule | null> {
  console.log(`[vehicule-service] Mise à jour du véhicule ID ${vehicleId}`);
  try {
    const response: AxiosResponse<Vehicule> = await axiosInstance.put(`${url}/${vehicleId}`, data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(`[vehicule-service] Erreur lors de la mise à jour du véhicule ${vehicleId}:`, axiosError.response?.data || axiosError.message);
    throw axiosError;
  }
}

/**
 * Supprime un véhicule.
 * @param vehicleId - L'ID du véhicule à supprimer.
 * @returns Une promesse qui se résout lorsque la suppression est terminée.
 */
export async function deleteVehicle(vehicleId: string): Promise<void> {
  console.log(`[vehicule-service] Suppression du véhicule ID ${vehicleId}`);
  try {
    await axiosInstance.delete(`${url}/${vehicleId}`);
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(`[vehicule-service] Erreur lors de la suppression du véhicule ${vehicleId}:`, axiosError.response?.data || axiosError.message);
    throw axiosError;
  }
}

