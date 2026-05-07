import { AxiosResponse } from "axios";
import { TravelAgencyFormType } from "@/lib/types/schema/travelAgencySchema";
import { TravelAgency } from "@/lib/types/models/Agency";
import axiosInstance from "./axios-services/axiosInstance";

// =========================================================================
// Service Agence (chef d'agence)
// Backend de référence : https://traefikdev.yowyob.com/bus-station
// Endpoints :
//   - GET  /agence/chef-agence/{userId}    → AgenceVoyageResponseDTO complet
//   - POST /agence                          → création
// =========================================================================

const PLACEHOLDER = "/placeholder.svg";

interface AgenceVoyageResponseRaw {
  id: string;
  organisationId: string | null;
  userId: string | null;
  longName: string;
  shortName: string;
  logoUrl: string | null;
  location: string | null;
  socialNetwork: string | null;
  description: string | null;
  greetingMessage: string | null;
  rating?: number;
  specialties?: string[];
  contact?: { email: string; phone: string; website: string } | null;
  gareIds?: string[];
  isActive?: boolean;
  moyensPaiement?: string[];
  vehiculeIdDefaut?: string | null;
  chauffeurIdDefaut?: string | null;
}

function mapResponseToTravelAgency(raw: AgenceVoyageResponseRaw): TravelAgency {
  return {
    agencyId: raw.id,
    id: raw.id,
    organisationId: raw.organisationId ?? "",
    userId: raw.userId ?? "",
    longName: raw.longName ?? "",
    shortName: raw.shortName ?? "",
    location: raw.location ?? "",
    socialNetwork: raw.socialNetwork ?? "",
    description: raw.description ?? "",
    greetingMessage: raw.greetingMessage ?? "",
    logoUrl: raw.logoUrl || PLACEHOLDER,
    rating: raw.rating ?? 0,
    specialties: raw.specialties ?? [],
    contact: raw.contact ?? { email: "", phone: "", website: "" },
    gareIds: raw.gareIds ?? [],
  };
}

/**
 * Création d'une agence (à l'inscription d'un chef d'agence).
 */
export async function createAgency(
  data: TravelAgencyFormType,
): Promise<TravelAgency | null> {
  try {
    const response: AxiosResponse<AgenceVoyageResponseRaw> =
      await axiosInstance.post(`/agence`, data);
    if (response.status === 201 || response.status === 200) {
      return mapResponseToTravelAgency(response.data);
    }
    console.warn(
      "[agency-service] createAgency: code HTTP inattendu",
      response.status,
    );
    return null;
  } catch (error) {
    console.error("[agency-service] Erreur création agence :", error);
    throw error;
  }
}

/**
 * Récupère l'agence du chef d'agence connecté.
 * GET /agence/chef-agence/{chefId}
 */
export async function getAgencyByChefId(
  chefId: string,
): Promise<TravelAgency | null> {
  if (!chefId) {
    console.error("[agency-service] getAgencyByChefId: ID chef manquant.");
    return null;
  }

  try {
    const response: AxiosResponse<AgenceVoyageResponseRaw> =
      await axiosInstance.get(`/agence/chef-agence/${chefId}`);

    if (response.status === 200 && response.data) {
      return mapResponseToTravelAgency(response.data);
    }

    if (response.status === 404) {
      console.warn(
        `[agency-service] Aucune agence trouvée pour le chef ${chefId}`,
      );
      return null;
    }

    console.warn(
      `[agency-service] getAgencyByChefId: statut inattendu ${response.status}`,
    );
    return null;
  } catch (error) {
    console.error(
      `[agency-service] Erreur récupération agence pour chef ${chefId} :`,
      error,
    );
    throw error;
  }
}
