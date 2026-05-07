import { AxiosResponse, AxiosError } from "axios";
import axiosInstance from "./axios-services/axiosInstance";
import {
  ChauffeurRequestDTO,
  UserResponseCreatedDTO,
} from "@/lib/types/generated-api";
import { Customer } from "@/lib/types/models/BusinessActor";

// =========================================================================
// Service Chauffeur
// Endpoints backend (préfixe /utilisateur, vérifiés en cURL) :
//   - GET    /utilisateur/chauffeurs/{agenceId}
//   - POST   /utilisateur/chauffeur
//   - PUT    /utilisateur/chauffeur/{chauffeurId}
//   - DELETE /utilisateur/chauffeur/{chauffeurId}
// =========================================================================

const url = "/utilisateur";

export async function getDriversByAgency(
  agencyId: string,
): Promise<Customer[] | null> {
  if (!agencyId) {
    console.error("[chauffeur-service] getDriversByAgency: agencyId manquant.");
    return null;
  }
  try {
    const response: AxiosResponse<Customer[]> = await axiosInstance.get(
      `${url}/chauffeurs/${agencyId}`,
    );
    if (response.status === 200) {
      return response.data ?? [];
    }
    console.warn(
      `[chauffeur-service] getDriversByAgency: statut inattendu ${response.status}`,
    );
    return null;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("[chauffeur-service] getDriversByAgency :", {
      message: axiosError.message,
      status: axiosError.response?.status,
      data: axiosError.response?.data,
    });
    throw error;
  }
}

export async function createDriverForAgency(
  data: ChauffeurRequestDTO,
): Promise<UserResponseCreatedDTO | null> {
  try {
    const response: AxiosResponse<UserResponseCreatedDTO> =
      await axiosInstance.post(`${url}/chauffeur`, data);
    if (response.status === 201 || response.status === 200) {
      return response.data;
    }
    console.warn(
      `[chauffeur-service] createDriverForAgency: statut inattendu ${response.status}`,
    );
    return null;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("[chauffeur-service] createDriverForAgency :", {
      message: axiosError.message,
      status: axiosError.response?.status,
      data: axiosError.response?.data,
    });
    throw error;
  }
}

export async function updateDriver(
  driverId: string,
  data: ChauffeurRequestDTO,
): Promise<UserResponseCreatedDTO | null> {
  try {
    const response: AxiosResponse<UserResponseCreatedDTO> =
      await axiosInstance.put(`${url}/chauffeur/${driverId}`, data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(
      `[chauffeur-service] updateDriver ${driverId} :`,
      axiosError.response?.data || axiosError.message,
    );
    throw axiosError;
  }
}

/**
 * Supprime un chauffeur.
 * FIX (mai 2026) : la route correcte est /utilisateur/chauffeur/{id}
 * (et non /utilisateur/employe/{id} comme dans la version précédente).
 */
export async function deleteDriver(driverId: string): Promise<void> {
  try {
    await axiosInstance.delete(`${url}/chauffeur/${driverId}`);
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(
      `[chauffeur-service] deleteDriver ${driverId} :`,
      axiosError.response?.data || axiosError.message,
    );
    throw axiosError;
  }
}
