/**
 * organization-service.ts
 * Endpoint : POST /organizations
 * Public — pas de token requis pour créer une organisation.
 */
import axios, { type AxiosResponse } from "axios";
import apiClient from "@/lib/api/api-client";
import { API_BASE_URL } from "@/lib/config/api.config";
import type { Organization } from "@/lib/types/models/Organization";
import type { OrganizationFormType } from "@/lib/types/schema/organizationSchema";

/**
 * POST /organizations
 * Crée une nouvelle organisation.
 * ⚠️ Utilise axios brut (pas apiClient) : à l'inscription l'utilisateur
 *    n'a pas encore de token JWT valide.
 */
export async function createOrganization(
  data: OrganizationFormType,
): Promise<Organization | null> {
  try {
    const response: AxiosResponse<Organization> = await axios.post(
      `${API_BASE_URL}/organizations`,
      data,
      { headers: { "Content-Type": "application/json" } },
    );
    if (response.status === 201 || response.status === 200) {
      return response.data;
    }
    console.warn("Code HTTP inattendu", response.status);
    return null;
  } catch (error) {
    console.error("Erreur création organisation :", error);
    throw error;
  }
}

/**
 * GET /organizations/{id}
 * Récupère une organisation par son ID.
 */
export async function getOrganizationById(id: string): Promise<Organization> {
  const res: AxiosResponse<Organization> = await apiClient.get(
    `/organizations/${id}`,
  );
  return res.data;
}
