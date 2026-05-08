/**
 * voyage-mutations.service.ts
 * Toutes les mutations pour P-20 : créer/modifier brouillon et voyage.
 */

import apiClient from "@/lib/api/api-client";

// ── DTOs envoyés au backend ───────────────────────────────────────────────────

export interface BrouillonCreateDTO {
  agenceVoyageId: string;
  titre: string;
  description: string | null; // Changé : obligatoire d'envoyer soit string soit null
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
}

export type BrouillonUpdateDTO = Partial<BrouillonCreateDTO>;

export interface VoyageCreateDTO {
  titre: string;
  description: string;
  dateDepartPrev: string;      // ISO 8601
  lieuDepart: string;
  lieuArrive: string;
  heureArrive: string;        // ISO 8601
  pointDeDepart: string;
  pointArrivee: string;
  nbrPlaceReservable: number;
  heureDepartEffectif?: string; // ISO 8601
  nbrPlaceReserve: number;
  nbrPlaceConfirm: number;
  statusVoyage: "EN_ATTENTE" | "PUBLIE" | "EN_COURS" | "TERMINE" | "ANNULE";
  nbrPlaceRestante: number;
  dateLimiteReservation: string;
  dateLimiteConfirmation: string;
  smallImage?: string | null;
  bigImage?: string | null;
  chauffeurId: string;         // UUID
  vehiculeId: string;          // UUID
  classVoyageId: string;       // UUID
  agenceVoyageId: string;      // UUID
  amenities: string[] | null;
}

export type VoyageUpdateDTO = Partial<VoyageCreateDTO>;

// ── Résultat générique ────────────────────────────────────────────────────────

export interface MutationResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// ── Helper de Nettoyage (CORRECTION) ──────────────────────────────────────────
/**
 * Transforme les chaînes vides ("") en `null`.
 * Cela empêche Spring Boot de crasher (HttpMessageNotReadableException)
 * lorsqu'il essaie de parser "" en UUID, LocalDate ou Integer.
 */
function cleanPayload<T extends Record<string, any>>(payload: T): T {
  const cleaned = { ...payload };
  for (const key in cleaned) {
    if (cleaned[key] === "") {
      cleaned[key] = null as any;
    }
  }
  return cleaned;
}

// ── Brouillon ─────────────────────────────────────────────────────────────────

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
    const res = await apiClient.post("/voyage", cleanPayload(payload));
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
    const res = await apiClient.put(`/voyage/${id}`, cleanPayload(payload));
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