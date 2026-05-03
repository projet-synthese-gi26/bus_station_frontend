/**
 * gare-service.ts
 *
 * Service Gare Routière — toutes les requêtes sur `/gare` du backend.
 *
 * Normalisation : le backend renvoie `idGareRoutiere`, `nomGareRoutiere`,
 * `photoUrl`, `isOpen`, etc. On les transforme en `idGare`, `nom`, `imageUrl`,
 * `estOuvert` pour rester compatible avec les composants UI existants
 * (StationCard, GareCard, useGares, useGaresRoutieres, etc.).
 *
 * Endpoints backend mappés :
 *   GET    /gare                    → Page<GareRoutierePreviewDTO>
 *   GET    /gare/{id}               → GareRoutiereDTO
 *   GET    /gare/{id}/agences       → Flux<AgenceVoyageResponseDTO>
 *   GET    /gare/{id}/voyages       → Page<VoyagePreviewDTO>
 *   PUT    /gare/{id}               → GareRoutiereDTO  (BSM uniquement)
 *
 * NOTE BACKEND : `GET /gare` peut renvoyer un 500 si le mapper Spring
 * échoue. Dans ce cas le service catch et renvoie [] pour que la page
 * affiche un état "aucun résultat" plutôt que de planter.
 */

import apiClient from "@/lib/api/api-client";
import type { Gare, UpdateGareDTO } from "@/lib/types/gare.types";
import type { AgenceVoyageFull } from "@/lib/types/agence.types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Extrait un tableau d'une réponse, qu'elle soit paginée (`{content: []}`) ou directe. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toArray(data: any): any[] {
  if (Array.isArray(data)) return data;
  if (data?.content && Array.isArray(data.content)) return data.content;
  if (data && (data.idGareRoutiere || data.id || data.idGare)) return [data];
  return [];
}

/** Normalise la réponse backend en type Gare frontend. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeGare(raw: any): Gare {
  if (!raw) {
    return {
      idGare: "",
      nom: "",
      ville: "",
      estOuvert: true,
    };
  }

  // ID : peut être idGareRoutiere (backend), id, ou idGare (legacy mock)
  const id = raw.idGareRoutiere ?? raw.idGare ?? raw.id ?? "";

  // Nom : peut être nomGareRoutiere ou nom
  const nom = raw.nomGareRoutiere ?? raw.nom ?? "";

  // Image : peut être photoUrl ou imageUrl
  const imageUrl = raw.photoUrl ?? raw.imageUrl ?? null;

  // Statut ouvert : peut être isOpen ou estOuvert
  const estOuvert =
    typeof raw.isOpen === "boolean"
      ? raw.isOpen
      : typeof raw.estOuvert === "boolean"
        ? raw.estOuvert
        : true;

  // Adresse : si pas fournie, construire à partir de ville/quartier
  const adresseRaw = raw.adresse ?? "";
  const ville = raw.ville ?? "";
  const quartier = raw.quartier ?? null;
  const adresse =
    adresseRaw || `${ville}${quartier ? ` — ${quartier}` : ""}`.trim();

  // Coordonnées GPS (le backend a une sous-structure `localisation: Coordonnee`)
  let latitude: number | null = raw.latitude ?? null;
  let longitude: number | null = raw.longitude ?? null;
  if (raw.localisation && typeof raw.localisation === "object") {
    latitude = latitude ?? raw.localisation.latitude ?? null;
    longitude = longitude ?? raw.localisation.longitude ?? null;
  }

  return {
    idGare: String(id),
    nom,
    ville,
    quartier,
    adresse,
    latitude,
    longitude,
    description: raw.description ?? null,
    imageUrl,
    services: Array.isArray(raw.services) ? raw.services : [],
    estOuvert,
    nombreAgences: raw.nbreAgence ?? raw.nombreAgences ?? undefined,
    horaires: raw.horaires ?? null,
    termes_et_conditions: raw.termes_et_conditions ?? null,
    tax_policy: raw.tax_policy ?? null,
    president_name: raw.president_name ?? raw.nomPresident ?? null,
    managerId: raw.managerId ?? null,
    localisation:
      typeof raw.localisation === "string" ? raw.localisation : null,
  };
}

/** Normalise la réponse agence backend en type frontend (utilisé pour /gare/{id}/agences). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeAgence(raw: any): AgenceVoyageFull {
  if (!raw) {
    return { agencyId: "", statutAgence: "ACTIVE" };
  }
  return {
    agencyId: raw.agencyId ?? raw.id ?? "",
    organisationId: raw.organisationId ?? raw.organisation_id,
    userId: raw.userId ?? raw.user_id,
    longName: raw.longName ?? raw.long_name ?? "",
    shortName: raw.shortName ?? raw.short_name,
    location: raw.location,
    logoUrl: raw.logoUrl ?? null,
    description: raw.description,
    greetingMessage: raw.greetingMessage,
    socialNetwork: raw.socialNetwork,
    statutAgence:
      raw.statutAgence ?? (raw.isActive === false ? "SUSPENDUE" : "ACTIVE"),
    gareIds: Array.isArray(raw.gareIds) ? raw.gareIds.map(String) : [],
    rating: typeof raw.rating === "number" ? raw.rating : undefined,
    specialties: Array.isArray(raw.specialties) ? raw.specialties : undefined,
    contact: raw.contact ?? undefined,
    moyensPaiement: Array.isArray(raw.moyensPaiement) ? raw.moyensPaiement : [],
    vehiculeIdDefaut: raw.vehiculeIdDefaut ?? null,
    chauffeurIdDefaut: raw.chauffeurIdDefaut ?? null,
  };
}

// ─── GET /gare ────────────────────────────────────────────────────────────────

/**
 * Liste paginée des gares routières.
 * Renvoie toujours un tableau (vide si erreur 500 backend).
 */
export async function getGares(params?: {
  searchTerm?: string;
  page?: number;
  size?: number;
}): Promise<Gare[]> {
  try {
    const res = await apiClient.get("/gare", {
      params: {
        searchTerm: params?.searchTerm || undefined,
        page: params?.page ?? 0,
        size: params?.size ?? 20,
      },
    });
    return toArray(res.data).map(normalizeGare);
  } catch (error) {
    console.error("[gare-service] GET /gare a échoué :", error);
    return [];
  }
}

/** Alias rétrocompatibles utilisés par les hooks existants. */
export const getAllGares = getGares;

// ─── GET /gare/{id} ───────────────────────────────────────────────────────────

export async function getGareById(id: string | number): Promise<Gare | null> {
  try {
    const res = await apiClient.get(`/gare/${id}`);
    return normalizeGare(res.data);
  } catch (error) {
    console.error(`[gare-service] GET /gare/${id} a échoué :`, error);
    return null;
  }
}

// ─── GET /gare/{id}/agences ───────────────────────────────────────────────────

export async function getAgencesByGare(
  gareId: string | number,
): Promise<AgenceVoyageFull[]> {
  try {
    const res = await apiClient.get(`/gare/${gareId}/agences`);
    return toArray(res.data).map(normalizeAgence);
  } catch (error) {
    console.error(`[gare-service] GET /gare/${gareId}/agences :`, error);
    return [];
  }
}

export const getAgencesByGareId = getAgencesByGare;

// ─── GET /gare/{id}/voyages ───────────────────────────────────────────────────

export async function getVoyagesByGare(
  gareId: string | number,
  params?: { date?: string; page?: number; size?: number },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any[]> {
  try {
    const res = await apiClient.get(`/gare/${gareId}/voyages`, {
      params: {
        date: params?.date,
        page: params?.page ?? 0,
        size: params?.size ?? 12,
      },
    });
    return toArray(res.data);
  } catch (error) {
    console.error(`[gare-service] GET /gare/${gareId}/voyages :`, error);
    return [];
  }
}

export const getDepartsByGareId = getVoyagesByGare;

// ─── PUT /gare/{id} — BSM uniquement ─────────────────────────────────────────

export async function updateGare(
  id: string | number,
  payload: UpdateGareDTO,
): Promise<Gare> {
  const res = await apiClient.put(`/gare/${id}`, payload);
  return normalizeGare(res.data);
}
// END OF FILE: src/lib/services/gare-service.ts
