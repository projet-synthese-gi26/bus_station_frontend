/**
 * reservation-service.ts  (recâblé)
 * Emplacement : src/lib/services/reservation-service.ts
 *
 * Remplace l'ancien service qui utilisait axiosInstance + mauvais endpoints.
 * Tous les appels passent désormais par apiClient (JWT auto-injecté).
 *
 * ⚠️ ANOMALIE BACKEND À SIGNALER :
 *  - Endpoint annulation présent en 3 versions dans la doc :
 *    • RESERVATIONS.md  → POST /reservation/annuler/{reservationId}  (id dans l'URL)
 *    • ETAPE_2          → POST /reservation/{id}/annuler             (id dans l'URL)
 *    • generated-api    → POST /reservation/annuler                  (id dans le body)
 *  - On suit ETAPE_2 (source la plus récente) : POST /reservation/{id}/annuler
 *
 *  - Endpoint user reservations :
 *    • generated-api    → GET /reservation/utilisateur/{idUser}  (ancien backend)
 *    • RESERVATIONS.md  → GET /reservation/user/{userId}         (nouveau backend)
 *  - On suit RESERVATIONS.md.
 *
 *  - Endpoint paiement :
 *    • Ancien service   → PUT /reservation/payer
 *    • RESERVATIONS.md  → POST /paiement/initier
 *  - On suit RESERVATIONS.md.
 */

import apiClient from "@/lib/api/api-client";
import type { PaginatedResponse } from "@/lib/types/common";
import type {
  ReservationPreviewDTO,
  ReservationDetailDTO,
  ReservationDTO,
  ReservationCancelDTO,
} from "@/lib/types/generated-api";
import type { ReservationDetails } from "@/lib/types/models/Reservation";

// ── Types locaux pour le paiement ─────────────────────────────────────────────

export interface InitierPaiementDTO {
  reservationId: string;
  amount: number;
  mobilePhone: string;
  mobilePhoneName: "MTN" | "ORANGE" | string;
}

export interface PayInResultDTO {
  transactionCode: string;
  status?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function toArray<T>(val: unknown): T[] {
  if (Array.isArray(val)) return val as T[];
  if (val && typeof val === "object") {
    const v = val as Record<string, unknown>;
    if (Array.isArray(v.content)) return v.content as T[];
  }
  return [];
}

function toPaginated<T>(val: unknown): PaginatedResponse<T> {
  if (val && typeof val === "object") {
    const v = val as Record<string, unknown>;
    if ("content" in v) {
      return {
        content: toArray<T>(v.content),
        totalPages: Number(v.totalPages ?? 1),
        totalElements: Number(v.totalElements ?? 0),
        size: Number(v.size ?? 10),
        number: Number(v.number ?? 0),
        empty: Boolean(v.empty ?? false),
        first: Boolean(v.first ?? true),
        last: Boolean(v.last ?? false),
      } as PaginatedResponse<T>;
    }
  }
  // Réponse non paginée → on emballe
  return {
    content: toArray<T>(val),
    totalPages: 1,
    totalElements: toArray<T>(val).length,
    size: 10,
    number: 0,
    empty: toArray<T>(val).length === 0,
    first: true,
    last: true,
  } as PaginatedResponse<T>;
}

// ── RÉSERVATIONS CLIENT ───────────────────────────────────────────────────────

/**
 * GET /reservation/user/{userId}
 * Remplace l'ancien GET /reservation/utilisateur/{idUser}
 */
export async function getCustomerReservations(
  userId: string,
  statut?: string,
  page = 0,
  size = 10,
): Promise<PaginatedResponse<ReservationDetails>> {
  if (!userId) {
    return toPaginated<ReservationDetails>([]);
  }
  try {
    const res = await apiClient.get(`/reservation/user/${userId}`, {
      params: { ...(statut ? { statut } : {}), page, size },
    });
    return toPaginated<ReservationDetails>(res.data);
  } catch {
    console.error("[reservation-service] GET /reservation/user failed");
    return toPaginated<ReservationDetails>([]);
  }
}

/**
 * GET /reservation/{id}
 * Détail complet d'une réservation (passagers, bagages, historique).
 */
export async function getReservationDetail(
  idReservation: string,
): Promise<ReservationDetails | null> {
  if (!idReservation) return null;
  try {
    const res = await apiClient.get(`/reservation/${idReservation}`);
    return res.data as ReservationDetails;
  } catch {
    console.error("[reservation-service] GET /reservation/{id} failed");
    return null;
  }
}

// ── CRÉER UNE RÉSERVATION ─────────────────────────────────────────────────────

/**
 * POST /reservation/reserver
 * Crée une réservation et bloque les places (statut RESERVER).
 */
export async function createReservation(
  data: ReservationDTO,
): Promise<ReservationDetails | null> {
  try {
    const res = await apiClient.post("/reservation/reserver", data);
    return res.data as ReservationDetails;
  } catch (err) {
    console.error("[reservation-service] POST /reservation/reserver failed");
    throw err; // on relance pour que les hooks puissent afficher l'erreur
  }
}

// ── ANNULER UNE RÉSERVATION ───────────────────────────────────────────────────

/**
 * POST /reservation/{id}/annuler
 * Annule une réservation (partielle ou totale).
 * Suit ETAPE_2 : id dans l'URL, payload dans le body.
 *
 * ⚠️ À confirmer avec le backend — 3 variantes dans la doc (voir en-tête du fichier).
 */
export async function annulerReservation(
  reservationId: string,
  payload: ReservationCancelDTO,
): Promise<void> {
  await apiClient.post(`/reservation/${reservationId}/annuler`, payload);
}

// ── RÉSERVATIONS PAR AGENCE (dashboard agence) ────────────────────────────────

/**
 * GET /reservation/agence/{agenceId}
 * Utilisé par useBookingsPage (dashboard agence).
 */
export async function getReservationsByAgency(
  agenceId: string,
  page = 0,
  size = 20,
): Promise<PaginatedResponse<ReservationPreviewDTO>> {
  try {
    const res = await apiClient.get(`/reservation/agence/${agenceId}`, {
      params: { page, size },
    });
    return toPaginated<ReservationPreviewDTO>(res.data);
  } catch {
    console.error("[reservation-service] GET /reservation/agence failed");
    return toPaginated<ReservationPreviewDTO>([]);
  }
}

/**
 * GET /reservation/voyage/{voyageId}
 * Réservations d'un voyage spécifique (P-18).
 */
export async function getReservationsByVoyage(
  voyageId: string,
): Promise<ReservationPreviewDTO[]> {
  try {
    const res = await apiClient.get(`/reservation/voyage/${voyageId}`);
    return toArray<ReservationPreviewDTO>(res.data);
  } catch {
    console.error("[reservation-service] GET /reservation/voyage failed");
    return [];
  }
}

/**
 * PUT /reservation/{id}/confirmer
 * Confirmation manuelle par l'agence (RESERVER → CONFIRMER).
 */
export async function confirmerReservation(
  reservationId: string,
): Promise<void> {
  await apiClient.put(`/reservation/${reservationId}/confirmer`);
}

// ── PAIEMENT ──────────────────────────────────────────────────────────────────

/**
 * POST /paiement/initier
 * Remplace l'ancien PUT /reservation/payer.
 * Déclenche la demande de paiement mobile (MTN/Orange).
 */
export async function initierPaiement(
  payload: InitierPaiementDTO,
): Promise<PayInResultDTO> {
  const res = await apiClient.post("/paiement/initier", payload);
  return res.data as PayInResultDTO;
}

/**
 * GET /paiement/statut/{transactionCode}
 * Vérifier le statut d'un paiement en cours.
 */
export async function getStatutPaiement(
  transactionCode: string,
): Promise<{ statut: string; transactionCode: string }> {
  const res = await apiClient.get(`/paiement/statut/${transactionCode}`);
  return res.data as { statut: string; transactionCode: string };
}

/**
 * createPayment — alias de rétrocompatibilité pour l'ancien code.
 * Les nouveaux composants doivent utiliser initierPaiement() directement.
 * @deprecated Utiliser initierPaiement() à la place.
 */
export async function createPayment(data: {
  reservationId: string;
  amount: number;
  mobilePhone: string;
  mobilePhoneName: string;
}): Promise<string | number> {
  try {
    await initierPaiement(data as InitierPaiementDTO);
    return "payment success";
  } catch {
    return 500;
  }
}
