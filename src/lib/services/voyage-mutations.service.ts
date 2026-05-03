/**
 * voyage-mutations.service.ts
 * Toutes les mutations pour P-20 : créer/modifier brouillon et voyage.
 */

import apiClient from "@/lib/api/api-client";

// ── DTOs envoyés au backend ───────────────────────────────────────────────────

export interface BrouillonCreateDTO {
  agenceVoyageId: string;
  titre: string;
  description?: string;
  lieuDepart?: string;
  lieuArrive?: string;
  pointDeDepart?: string;
  pointArrivee?: string;
  dateDepartPrev?: string; // ISO 8601
  heureDepartEffectif?: string; // "HH:mm"
  heureArrive?: string;
  dureeEstimee?: string;
  classVoyageId?: string | null;
  vehiculeId?: string | null;
  chauffeurId?: string | null;
  nbrPlaceReservable?: number | null;
  prix?: number | null;
  amenities?: string[];
  smallImage?: string | null;
  bigImage?: string | null;
  dateLimiteReservation?: string | null;
  dateLimiteConfirmation?: string | null;
  notes?: string | null;
  ligneServiceId?: string | null;
}

export type BrouillonUpdateDTO = Partial<BrouillonCreateDTO>;

export interface VoyageCreateDTO {
  agenceVoyageId: string;
  titre: string;
  lieuDepart: string;
  lieuArrive: string;
  pointDeDepart?: string;
  pointArrivee?: string;
  dateDepartPrev: string;
  heureDepartEffectif: string;
  heureArrive?: string;
  dureeEstimee?: string;
  classVoyageId: string;
  vehiculeId: string;
  chauffeurId?: string | null;
  nbrPlaceReservable: number;
  prix: number;
  amenities?: string[];
  smallImage?: string | null;
  bigImage?: string | null;
  dateLimiteReservation?: string | null;
  dateLimiteConfirmation?: string | null;
  description?: string;
  voyageBrouillonId?: string | null;
}

export type VoyageUpdateDTO = Partial<VoyageCreateDTO>;

// ── Résultat générique ────────────────────────────────────────────────────────

export interface MutationResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// ── Brouillon ─────────────────────────────────────────────────────────────────

export async function createBrouillon(
  payload: BrouillonCreateDTO,
): Promise<MutationResult> {
  try {
    const res = await apiClient.post("/voyage/brouillon", payload);
    return { success: true, data: res.data };
  } catch (err: unknown) {
    const msg = extractErrorMessage(err);
    console.error("[voyage-mutations] POST /voyage/brouillon failed:", msg);
    return { success: false, error: msg };
  }
}

export async function updateBrouillon(
  id: string,
  payload: BrouillonUpdateDTO,
): Promise<MutationResult> {
  try {
    const res = await apiClient.put(`/voyage/brouillon/${id}`, payload);
    return { success: true, data: res.data };
  } catch (err: unknown) {
    const msg = extractErrorMessage(err);
    console.error("[voyage-mutations] PUT /voyage/brouillon/{id} failed:", msg);
    return { success: false, error: msg };
  }
}

/** Convertir un brouillon PRET en Voyage publié */
export async function publierBrouillon(id: string): Promise<MutationResult> {
  try {
    const res = await apiClient.post(`/voyage/brouillon/${id}/publier`);
    return { success: true, data: res.data };
  } catch (err: unknown) {
    const msg = extractErrorMessage(err);
    console.error(
      "[voyage-mutations] POST /voyage/brouillon/{id}/publier failed:",
      msg,
    );
    return { success: false, error: msg };
  }
}

// ── Voyage ────────────────────────────────────────────────────────────────────

export async function createVoyage(
  payload: VoyageCreateDTO,
): Promise<MutationResult> {
  try {
    const res = await apiClient.post("/voyage", payload);
    return { success: true, data: res.data };
  } catch (err: unknown) {
    const msg = extractErrorMessage(err);
    console.error("[voyage-mutations] POST /voyage failed:", msg);
    return { success: false, error: msg };
  }
}

export async function updateVoyage(
  id: string,
  payload: VoyageUpdateDTO,
): Promise<MutationResult> {
  try {
    const res = await apiClient.put(`/voyage/${id}`, payload);
    return { success: true, data: res.data };
  } catch (err: unknown) {
    const msg = extractErrorMessage(err);
    console.error("[voyage-mutations] PUT /voyage/{id} failed:", msg);
    return { success: false, error: msg };
  }
}

export async function publierVoyage(id: string): Promise<MutationResult> {
  try {
    const res = await apiClient.put(`/voyage/${id}/publier`);
    return { success: true, data: res.data };
  } catch (err: unknown) {
    const msg = extractErrorMessage(err);
    console.error("[voyage-mutations] PUT /voyage/{id}/publier failed:", msg);
    return { success: false, error: msg };
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function extractErrorMessage(err: unknown): string {
  if (err && typeof err === "object") {
    const axiosErr = err as {
      response?: { data?: { message?: string; error?: string } };
      message?: string;
    };
    return (
      axiosErr.response?.data?.message ??
      axiosErr.response?.data?.error ??
      axiosErr.message ??
      "Erreur inconnue"
    );
  }
  return String(err);
}
