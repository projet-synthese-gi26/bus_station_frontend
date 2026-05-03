/**
 * voyage-brouillon-service.ts  (refait — P-19, Lot 4)
 *
 * Service pour les voyages brouillons (VoyageBrouillon).
 * Utilisé par /dashboard/drafts et /dashboard/trip-planning.
 *
 * IMPORTANT — Endpoints backend réels :
 *   GET    /agence/{agenceId}/brouillons?statut=    → lister par agence
 *                                                     (PAS /voyage-brouillon?...)
 *   POST   /voyage/brouillon                         → créer
 *   GET    /voyage/brouillon/{id}                    → détail
 *   PUT    /voyage/brouillon/{id}                    → update partiel
 *   DELETE /voyage/brouillon/{id}                    → supprimer
 *   POST   /voyage/brouillon/{id}/publier            → publier
 *
 * Le service normalise la réponse backend (`id` → `id`, mais aussi
 * gère les dates ISO et les enums du `statutBrouillon`).
 */

import apiClient from "@/lib/api/api-client";
import type {
  VoyageBrouillon,
  CreateBrouillonDTO,
  UpdateBrouillonDTO,
  StatutBrouillon,
} from "@/lib/types/voyage.types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toArray(data: any): any[] {
  if (Array.isArray(data)) return data;
  if (data?.content && Array.isArray(data.content)) return data.content;
  if (data && data.id) return [data];
  return [];
}

/**
 * Normalise un VoyageBrouillonResponseDTO du backend en VoyageBrouillon frontend.
 * Le backend renvoie déjà des champs camelCase, mais on s'assure des valeurs par défaut.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeBrouillon(raw: any): VoyageBrouillon {
  return {
    id: raw.id ?? "",
    agenceVoyageId: raw.agenceVoyageId ?? "",
    ligneServiceId: raw.ligneServiceId ?? null,
    titre: raw.titre ?? "",
    lieuDepart: raw.lieuDepart ?? "",
    lieuArrive: raw.lieuArrive ?? "",
    pointDeDepart: raw.pointDeDepart ?? null,
    pointArrivee: raw.pointArrivee ?? null,
    dateDepartPrev: raw.dateDepartPrev ?? null,
    heureDepartEffectif: raw.heureDepartEffectif ?? null,
    heureArrive: raw.heureArrive ?? null,
    dureeEstimee: raw.dureeEstimee ?? null,
    classVoyageId: raw.classVoyageId ?? null,
    vehiculeId: raw.vehiculeId ?? null,
    chauffeurId: raw.chauffeurId ?? null,
    nbrPlaceReservable: raw.nbrPlaceReservable ?? null,
    prix: raw.prix ?? null,
    amenities: Array.isArray(raw.amenities) ? raw.amenities : [],
    smallImage: raw.smallImage ?? null,
    bigImage: raw.bigImage ?? null,
    dateLimiteReservation: raw.dateLimiteReservation ?? null,
    dateLimiteConfirmation: raw.dateLimiteConfirmation ?? null,
    statutBrouillon: (raw.statutBrouillon as StatutBrouillon) ?? "INCOMPLET",
    notes: raw.notes ?? null,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

// ─── Lecture ──────────────────────────────────────────────────────────────────

/**
 * Liste les brouillons d'une agence, avec filtre optionnel par statut.
 * Endpoint réel : GET /agence/{agenceId}/brouillons?statut=INCOMPLET
 */
export async function getBrouillonsByAgence(
  agenceId: string,
  statut?: StatutBrouillon,
): Promise<VoyageBrouillon[]> {
  if (!agenceId) return [];
  try {
    const res = await apiClient.get(`/agence/${agenceId}/brouillons`, {
      params: statut ? { statut } : undefined,
    });
    return toArray(res.data).map(normalizeBrouillon);
  } catch (error) {
    console.error(
      `[voyage-brouillon] GET /agence/${agenceId}/brouillons :`,
      error,
    );
    return [];
  }
}

/** Détail d'un brouillon par ID */
export async function getBrouillonById(
  id: string,
): Promise<VoyageBrouillon | null> {
  try {
    const res = await apiClient.get(`/voyage/brouillon/${id}`);
    return normalizeBrouillon(res.data);
  } catch (error) {
    console.error(`[voyage-brouillon] GET /voyage/brouillon/${id} :`, error);
    return null;
  }
}

// ─── Mutations ────────────────────────────────────────────────────────────────

/** Créer un nouveau brouillon */
export async function createBrouillon(
  data: CreateBrouillonDTO,
): Promise<VoyageBrouillon> {
  const res = await apiClient.post("/voyage/brouillon", data);
  return normalizeBrouillon(res.data);
}

/**
 * Modifier un brouillon existant.
 * Le backend utilise PUT mais traite les champs null comme "ne pas modifier"
 * (PATCH-like). Tous les champs du DTO sont optionnels.
 */
export async function updateBrouillon(
  id: string,
  data: UpdateBrouillonDTO,
): Promise<VoyageBrouillon> {
  const res = await apiClient.put(`/voyage/brouillon/${id}`, data);
  return normalizeBrouillon(res.data);
}

/** Supprimer définitivement un brouillon */
export async function deleteBrouillon(id: string): Promise<void> {
  await apiClient.delete(`/voyage/brouillon/${id}`);
}

/**
 * Publier un brouillon PRET → crée un Voyage publié et marque le
 * brouillon comme CONVERTI. Retourne le voyage créé.
 *
 * Endpoint réel : POST /voyage/brouillon/{id}/publier
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function publierBrouillon(id: string): Promise<any> {
  const res = await apiClient.post(`/voyage/brouillon/${id}/publier`);
  return res.data;
}
// END OF FILE: src/lib/services/voyage-brouillon-service.ts
