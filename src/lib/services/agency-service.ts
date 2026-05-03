/**
 * agency-service.ts
 *
 * Service Agence de Voyage — toutes les requêtes sur `/agence` du backend.
 *
 * Normalisation : le backend `AgenceVoyageResponseDTO` renvoie :
 *   id (UUID), isActive (bool), gareIds (List<UUID>),
 *   moyensPaiement (List<String>), rating, specialties, contact, ...
 *
 * On les transforme vers `AgenceVoyageFull` (camelCase, statutAgence dérivé).
 *
 * Endpoints backend mappés :
 *   GET    /agence                              → Page<AgenceVoyageResponseDTO>
 *   GET    /agence/{id}                         → AgenceVoyageResponseDTO
 *   GET    /agence/{id}/public                  → AgenceVoyageResponseDTO
 *   GET    /agence/chef-agence/{id}             → AgenceVoyageDTO
 *   GET    /agence/gare-routiere/{gareId}       → Flux<AgenceVoyagePreviewDTO>
 *   POST   /agence                              → création
 *   PATCH  /agence/{id}                         → update partiel
 *   PUT    /agence/{id}/statut                  → suspend/réactive (BSM)
 *   PUT    /agence/{id}/moyens-paiement         → config paiement
 *   POST   /affiliation                         → affilier à une gare
 */

import axios, { type AxiosResponse } from "axios";
import apiClient from "@/lib/api/api-client";
import { API_BASE_URL } from "@/lib/config/api.config";
import type { AgenceVoyageFull } from "@/lib/types/agence.types";
import type { TravelAgency } from "@/lib/types/models/Agency";
import type { TravelAgencyFormType } from "@/lib/types/schema/travelAgencySchema";

// ─── Helpers ──────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toArray(data: any): any[] {
  if (Array.isArray(data)) return data;
  if (data?.content && Array.isArray(data.content)) return data.content;
  if (data && (data.id || data.agencyId)) return [data];
  return [];
}

/**
 * Normalise une réponse backend (AgenceVoyageResponseDTO ou AgenceVoyageDTO
 * ou AgenceVoyagePreviewDTO) en AgenceVoyageFull frontend.
 *
 * Gère : id ↔ agencyId, isActive ↔ statutAgence, gareIds (list),
 * snake_case fallback (long_name, short_name, etc.).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeAgence(raw: any): AgenceVoyageFull {
  if (!raw) {
    return { agencyId: "", statutAgence: "ACTIVE" };
  }

  // Identifiants
  const agencyId = raw.agencyId ?? raw.id ?? raw.idAgenceVoyage ?? "";

  // Statut : dérivé de isActive (boolean) ou explicitement statutAgence
  let statutAgence: AgenceVoyageFull["statutAgence"];
  if (raw.statutAgence) {
    statutAgence = raw.statutAgence;
  } else if (raw.isActive === false) {
    statutAgence = "SUSPENDUE";
  } else {
    statutAgence = "ACTIVE";
  }

  // gareIds : peut venir en List<UUID> (backend) ou en gareId unique (legacy)
  let gareIds: string[] = [];
  if (Array.isArray(raw.gareIds)) {
    gareIds = raw.gareIds.map(String);
  } else if (raw.gareId) {
    gareIds = [String(raw.gareId)];
  } else if (raw.gareRoutiereId) {
    gareIds = [String(raw.gareRoutiereId)];
  }

  return {
    agencyId: String(agencyId),
    organisationId: raw.organisationId ?? raw.organisation_id,
    userId: raw.userId ?? raw.user_id,
    longName: raw.longName ?? raw.long_name ?? "",
    shortName: raw.shortName ?? raw.short_name,
    location: raw.location,
    logoUrl: raw.logoUrl ?? null,
    description: raw.description,
    greetingMessage: raw.greetingMessage ?? raw.greeting_message,
    socialNetwork: raw.socialNetwork ?? raw.social_network,
    statutAgence,
    gareIds,
    rating: typeof raw.rating === "number" ? raw.rating : undefined,
    specialties: Array.isArray(raw.specialties) ? raw.specialties : undefined,
    contact: raw.contact ?? undefined,
    moyensPaiement: Array.isArray(raw.moyensPaiement) ? raw.moyensPaiement : [],
    vehiculeIdDefaut: raw.vehiculeIdDefaut ?? null,
    chauffeurIdDefaut: raw.chauffeurIdDefaut ?? null,
    nbrPlaceDefaut: raw.nbrPlaceDefaut ?? null,
    dateLimiteResaAvant: raw.dateLimiteResaAvant ?? null,
    dateLimiteConfAvant: raw.dateLimiteConfAvant ?? null,
  };
}

// ─── POST /agence ─────────────────────────────────────────────────────────────

export async function createAgency(
  data: TravelAgencyFormType,
): Promise<TravelAgency | null> {
  try {
    const res: AxiosResponse = await apiClient.post("/agence", data);
    if (res.status === 201 || res.status === 200) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const r = res.data as any;
      return { ...r, agencyId: r.agencyId ?? r.id ?? "" } as TravelAgency;
    }
    return null;
  } catch (error) {
    console.error("[agency-service] Erreur création agence :", error);
    throw error;
  }
}

// ─── GET /agence/chef-agence/{id} ─────────────────────────────────────────────

export async function getAgenceByChef(
  chefId: string,
): Promise<AgenceVoyageFull> {
  const res = await apiClient.get(`/agence/chef-agence/${chefId}`);
  return normalizeAgence(res.data);
}

/** Alias rétrocompatible (utilisé par les hooks dashboard). */
export const getAgencyByChefId = getAgenceByChef;

// ─── GET /agence/{id} ─────────────────────────────────────────────────────────

export async function getAgenceById(
  id: string,
): Promise<AgenceVoyageFull | null> {
  try {
    const res = await apiClient.get(`/agence/${id}`);
    return normalizeAgence(res.data);
  } catch (error) {
    console.error(`[agency-service] GET /agence/${id} :`, error);
    return null;
  }
}

// ─── GET /agence/{id}/public ──────────────────────────────────────────────────

export async function getAgencePublic(
  id: string,
): Promise<AgenceVoyageFull | null> {
  try {
    const res = await apiClient.get(`/agence/${id}/public`);
    return normalizeAgence(res.data);
  } catch (error) {
    console.error(`[agency-service] GET /agence/${id}/public :`, error);
    return null;
  }
}

// Alias utilisé par useAgencyPublicDetails (legacy)
export const getPublicAgencyById = getAgencePublic;

// ─── GET /agence ──────────────────────────────────────────────────────────────

export async function getAllAgences(params?: {
  page?: number;
  size?: number;
}): Promise<AgenceVoyageFull[]> {
  try {
    const res = await apiClient.get("/agence", {
      params: { page: params?.page ?? 0, size: params?.size ?? 50 },
    });
    return toArray(res.data).map(normalizeAgence);
  } catch (error) {
    console.error("[agency-service] GET /agence :", error);
    return [];
  }
}

// Alias rétrocompatible (utilisé par useAgencies)
export const getAllPublicAgencies = getAllAgences;

/**
 * Version sans token pour visiteurs non connectés.
 * Utilise axios directement (pas apiClient) pour éviter d'envoyer un token invalide.
 */
export async function getAllAgencesPublic(params?: {
  page?: number;
  size?: number;
}): Promise<AgenceVoyageFull[]> {
  try {
    const res = await axios.get(`${API_BASE_URL}/agence`, {
      params: { page: params?.page ?? 0, size: params?.size ?? 50 },
    });
    return toArray(res.data).map(normalizeAgence);
  } catch (error) {
    console.error("[agency-service] GET /agence (public) :", error);
    return [];
  }
}

// ─── GET /agence/gare-routiere/{gareId} ──────────────────────────────────────

export async function getAgencesByGareRoutiere(
  gareRoutiereId: string,
): Promise<AgenceVoyageFull[]> {
  try {
    const res = await apiClient.get(`/agence/gare-routiere/${gareRoutiereId}`);
    return toArray(res.data).map(normalizeAgence);
  } catch (error) {
    console.error(
      `[agency-service] GET /agence/gare-routiere/${gareRoutiereId} :`,
      error,
    );
    return [];
  }
}

// Alias utilisé par useAgencies
export const getAgencesByGare = getAgencesByGareRoutiere;

// ─── PATCH /agence/{id} ──────────────────────────────────────────────────────

export async function updateAgency(
  id: string,
  payload: Partial<AgenceVoyageFull>,
): Promise<AgenceVoyageFull> {
  // Le backend utilise PATCH (mise à jour partielle)
  const res = await apiClient.patch(`/agence/${id}`, payload);
  return normalizeAgence(res.data);
}

/** Alias utilisé par updateAgencyDetails (legacy). */
export const updateAgencyDetails = updateAgency;

// ─── PUT /agence/{id}/statut — BSM ────────────────────────────────────────────

export async function updateStatutAgence(
  agenceId: string,
  active: boolean,
  motif?: string,
): Promise<AgenceVoyageFull> {
  const res = await apiClient.put(`/agence/${agenceId}/statut`, {
    active,
    motif: motif ?? "",
  });
  return normalizeAgence(res.data);
}

// ─── POST /affiliation ────────────────────────────────────────────────────────

export async function createAffiliation(payload: {
  gareRoutiereId: string;
  agencyId: string;
  montantAffiliation?: number;
  echeance?: string;
}): Promise<void> {
  await apiClient.post("/affiliation", payload);
}
// END OF FILE: src/lib/services/agency-service.ts
