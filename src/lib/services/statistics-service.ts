// src/lib/services/statistics-service.ts
import { AxiosResponse, AxiosError } from "axios";
import axiosInstance from "./axios-services/axiosInstance";
import {
  AgenceStatisticsDTO,
  AgenceEvolutionDTO,
} from "../types/generated-api";

// =========================================================================
// Service Statistiques Agence
// FIX (mai 2026) : la base URL était `/statistics/agence` (anglais),
// le backend expose `/statistiques/agence` (français).
// Endpoints :
//   - GET /statistiques/agence/{id}/general
//   - GET /statistiques/agence/{id}/evolution
//   - GET /statistiques/agence/{id}/complete
// =========================================================================

const url = "/statistiques/agence";

/**
 * Récupère les statistiques générales (KPIs) pour une agence.
 */
export async function getAgencyGeneralStats(
  agencyId: string,
): Promise<AgenceStatisticsDTO> {
  if (!agencyId) throw new Error("Agency ID is required");
  try {
    const response: AxiosResponse<AgenceStatisticsDTO> =
      await axiosInstance.get(`${url}/${agencyId}/general`);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(
      "[statistics-service] Erreur getAgencyGeneralStats:",
      axiosError.response?.data || axiosError.message,
    );
    throw axiosError;
  }
}

/**
 * Récupère les données d'évolution pour les graphiques.
 */
export async function getAgencyEvolutionStats(
  agencyId: string,
): Promise<AgenceEvolutionDTO> {
  if (!agencyId) throw new Error("Agency ID is required");
  try {
    const response: AxiosResponse<AgenceEvolutionDTO> = await axiosInstance.get(
      `${url}/${agencyId}/evolution`,
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(
      "[statistics-service] Erreur getAgencyEvolutionStats:",
      axiosError.response?.data || axiosError.message,
    );
    throw axiosError;
  }
}
