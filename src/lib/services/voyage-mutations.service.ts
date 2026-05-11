/**
 * voyage-mutations.service.ts
 */

import apiClient from "@/lib/api/api-client";

export interface BrouillonCreateDTO {
  agenceVoyageId: string;
  titre: string;
  description: string | null;
  lieuDepart: string;
  lieuArrive: string;
  pointDeDepart: string | null;
  pointArrivee: string | null;
  dateDepartPrev: string | null;
  heureDepartEffectif: string | null;
  heureArrive: string | null;
  dureeEstimee: string | null;
  classVoyageId: string | null;
  vehiculeId: string | null;
  chauffeurId: string | null;
  nbrPlaceReservable: number | null;
  prix: number | null;
  amenities: string[] | null;
  smallImage: string | null;
  bigImage: string | null;
  dateLimiteReservation: string | null;
  dateLimiteConfirmation: string | null;
  notes: string | null;
  ligneServiceId: string | null;
  statutBrouillon?: string; // INCOMPLET | PRET | CONVERTI | ANNULE
}

export type BrouillonUpdateDTO = Partial<BrouillonCreateDTO>;

export interface VoyageCreateDTO {
  titre: string;
  description: string;
  dateDepartPrev: string;
  lieuDepart: string;
  lieuArrive: string;
  heureArrive: string;
  pointDeDepart: string;
  pointArrivee: string;
  nbrPlaceReservable: number;
  heureDepartEffectif?: string;
  nbrPlaceReserve: number;
  nbrPlaceConfirm: number;
  statusVoyage: "EN_ATTENTE" | "PUBLIE" | "EN_COURS" | "TERMINE" | "ANNULE";
  nbrPlaceRestante: number;
  dateLimiteReservation: string;
  dateLimiteConfirmation: string;
  smallImage?: string | null;
  bigImage?: string | null;
  chauffeurId: string;
  vehiculeId: string;
  classVoyageId: string;
  agenceVoyageId: string;
  amenities: string[] | null;
}

export type VoyageUpdateDTO = Partial<VoyageCreateDTO>;

export interface MutationResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

function cleanPayload<T extends object>(payload: T): T {
  const cleaned = { ...payload } as Record<string, unknown>;
  for (const key in cleaned) {
    if (cleaned[key] === "") {
      cleaned[key] = null;
    }
  }
  return cleaned as T;
}

export async function createBrouillon(
  payload: BrouillonCreateDTO,
): Promise<MutationResult> {
  try {
    const res = await apiClient.post("/voyage/brouillon", cleanPayload(payload));
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
    const res = await apiClient.put(`/voyage/brouillon/${id}`, cleanPayload(payload));
    return { success: true, data: res.data };
  } catch (err: unknown) {
    const msg = extractErrorMessage(err);
    console.error("[voyage-mutations] PUT /voyage/brouillon/{id} failed:", msg);
    return { success: false, error: msg };
  }
}

export async function publierBrouillon(id: string): Promise<MutationResult> {
  try {
    const res = await apiClient.post(`/voyage/brouillon/${id}/publier`);
    return { success: true, data: res.data };
  } catch (err: unknown) {
    const msg = extractErrorMessage(err);
    console.error("[voyage-mutations] POST /voyage/brouillon/{id}/publier failed:", msg);
    return { success: false, error: msg };
  }
}

export async function createVoyage(
  payload: VoyageCreateDTO & { prix?: unknown },
): Promise<MutationResult> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { prix: _prix, ...safePayload } = payload;
    const res = await apiClient.post("/voyage", cleanPayload(safePayload as VoyageCreateDTO));
    return { success: true, data: res.data };
  } catch (err: unknown) {
    const msg = extractErrorMessage(err);
    console.error("[voyage-mutations] POST /voyage failed:", msg);
    return { success: false, error: msg };
  }
}

// APRÈS
export async function updateVoyage(
  id: string,
  payload: VoyageUpdateDTO & { prix?: unknown },
): Promise<MutationResult> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { prix: _prix, ...safePayload } = payload;
    const res = await apiClient.put(`/voyage/${id}`, cleanPayload(safePayload as VoyageUpdateDTO));
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