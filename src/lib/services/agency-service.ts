import axios, { AxiosResponse } from "axios";
import { TravelAgencyFormType } from "@/lib/types/schema/travelAgencySchema";
import { TravelAgency } from "@/lib/types/models/Agency";
import axiosInstance from "./axios-services/axiosInstance";

const url: string = `${process.env.NEXT_PUBLIC_TRIP_AGENCY_BACKEND_API_URL}`;

export async function createAgency(
  data: TravelAgencyFormType,
): Promise<TravelAgency | null> {
  try {
    const response: AxiosResponse<TravelAgency> = await axios.post(
      `${url}/agence`,
      data,
    );
    if (response.status === 201 || response.status === 200) {
      console.log(response);
      return response?.data;
    } else {
      console.warn("Unattended HTTP code", response?.data);
      return null;
    }
  } catch (error) {
    console.error("Error when creating the organization ", error);
    throw error;
  }
}

/**
 * Récupère les informations d'une agence de voyage en utilisant l'ID de son chef.
 * @param chefId - L'ID de l'utilisateur connecté (chef d'agence).
 * @returns Une promesse résolue avec les détails de l'agence ou null.
 */
export async function getAgencyByChefId(
  chefId: string,
): Promise<TravelAgency | null> {
  if (!chefId) return null;

  try {
    const response: AxiosResponse = await axiosInstance.get(
      `/agence?page=0&size=50`,
    );

    if (response.status === 200) {
      const agencies = response.data?.content ?? [];
      const found = agencies.find((a: any) => a.userId === chefId);

      if (!found) {
        console.warn(
          `[agency-service] Aucune agence trouvée pour userId: ${chefId}`,
        );
        return null;
      }

      const normalized: TravelAgency = {
        ...found,
        agencyId: found.id, // ← le backend retourne "id", on le mappe vers "agencyId"
      };

      console.log(
        `[agency-service] Agence trouvée pour le chef d'agence ${chefId}:`,
        normalized,
      );
      return normalized;
    }
    return null;
  } catch (error) {
    console.error(`[agency-service] Erreur:`, error);
    throw error;
  }
}
