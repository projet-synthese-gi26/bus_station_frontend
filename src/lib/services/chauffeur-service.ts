import { AxiosResponse, AxiosError } from "axios";
import axiosInstance from "./axios-services/axiosInstance";
import {ChauffeurRequestDTO, UserResponseCreatedDTO} from "@/lib/types/generated-api";
import {Customer} from "@/lib/types/models/BusinessActor";


const url = "/utilisateur";

export async function getDriversByAgency(agencyId: string): Promise<Customer[] | null> {
  console.log(`[SERVICE_REQUEST] getDriversByAgency pour agencyId: ${agencyId}`);
  if (!agencyId) {
    console.error("[SERVICE_ERROR] getDriversByAgency: ID de l'agence manquant.");
    return null;
  }
  try {
    const response: AxiosResponse<Customer[]> = await axiosInstance.get(`${url}/chauffeurs/${agencyId}`);
    if (response.status === 200) {
      console.log(`[SERVICE_SUCCESS] getDriversByAgency: ${response.data.length} chauffeur(s) trouvé(s).`);
      return response.data;
    }
    console.warn(`[SERVICE_WARN] getDriversByAgency: Statut inattendu - ${response.status}`, response.data);
    return null;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(`[SERVICE_FAILURE] getDriversByAgency: Erreur lors de la récupération des chauffeurs.`,
      {
        message: axiosError.message,
        status: axiosError.response?.status,
        data: axiosError.response?.data,
      }
    );
    throw error;
  }
}

export async function createDriverForAgency(
  data: ChauffeurRequestDTO
): Promise<UserResponseCreatedDTO | null> {
  console.log("[SERVICE_REQUEST] createDriverForAgency avec payload:", data);
  try {
    const response: AxiosResponse<UserResponseCreatedDTO> =
      await axiosInstance.post(`${url}/chauffeur`, data);
    if (response.status === 201) {
      console.log(
        "[SERVICE_SUCCESS] createDriverForAgency: Chauffeur créé avec succès.",
        response.data
      );
      return response.data;
    }
    console.warn(
      `[SERVICE_WARN] createDriverForAgency: Statut inattendu - ${response.status}`,
      response.data
    );
    return null;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(
      `[SERVICE_FAILURE] createDriverForAgency: Erreur lors de la création du chauffeur.`,
      {
        message: axiosError.message,
        status: axiosError.response?.status,
        data: axiosError.response?.data,
      }
    );
    throw error;
  }
}



/**
 * Met à jour les informations d'un chauffeur.
 * @param driverId - L'ID de l'employé (chauffeur) à mettre à jour.
 * @param data - Les données du chauffeur à mettre à jour.
 * @returns Une promesse résolue avec les détails du chauffeur mis à jour.
 */
export async function updateDriver(driverId: string, data: ChauffeurRequestDTO): Promise<UserResponseCreatedDTO | null> {
  console.log(`[chauffeur-service] Mise à jour du chauffeur ID ${driverId}`);
  try {
    const response: AxiosResponse<UserResponseCreatedDTO> = await axiosInstance.put(`${url}/chauffeur/${driverId}`, data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(`[chauffeur-service] Erreur lors de la mise à jour du chauffeur ${driverId}:`, axiosError.response?.data || axiosError.message);
    throw axiosError;
  }
}


/**
 * Supprime un chauffeur.
 * @param driverId - L'ID du chauffeur à supprimer.
 * @returns Une promesse qui se résout lorsque la suppression est terminée.
 */
export async function deleteDriver(driverId: string): Promise<void> {
  console.log(`[chauffeur-service] Suppression du chauffeur ID ${driverId}`);
  try {
    // Note: l'API utilise l'employeId pour la suppression, ce qui est correct car un chauffeur est un type d'employé.
    await axiosInstance.delete(`${url}/employe/${driverId}`);
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(`[chauffeur-service] Erreur lors de la suppression du chauffeur ${driverId}:`, axiosError.response?.data || axiosError.message);
    throw axiosError;
  }
}
