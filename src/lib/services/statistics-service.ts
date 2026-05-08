// src/lib/services/statistics-service.ts
import apiClient from "@/lib/api/api-client";
import type { AgenceStatisticsDTO, AgenceEvolutionDTO } from "../types/generated-api";

const url = "/statistiques/agence";

export async function getAgencyGeneralStats(
  agencyId: string,
): Promise<AgenceStatisticsDTO | null> {
  if (!agencyId) return null;
  try {
    const res = await apiClient.get(`${url}/${agencyId}/general`);
    return res.data as AgenceStatisticsDTO;
  } catch {
    console.error("[statistics-service] GET general stats failed");
    return null;
  }
}

export async function getAgencyEvolutionStats(
  agencyId: string,
): Promise<AgenceEvolutionDTO | null> {
  if (!agencyId) return null;
  try {
    const res = await apiClient.get(`${url}/${agencyId}/evolution`);
    return res.data as AgenceEvolutionDTO;
  } catch {
    console.error("[statistics-service] GET evolution stats failed");
    return null;
  }
}
