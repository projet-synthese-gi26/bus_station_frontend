// src/lib/services/voyage-generation-service.ts
// =========================================================================
// Bloc 4 — Service Génération de Voyages
//
// Backend de référence : https://traefikdev.yowyob.com/bus-station
//
// Endpoints :
//   - POST /voyage/generer-unitaire    → génère un voyage à partir d'un créneau
//   - POST /voyage/matching-preview    → preview matching ressources pour une semaine
//   - POST /voyage/generer-semaine     → publie tous les voyages publiables, brouillonne les autres
//
// ⚠️ IMPORTANT : ces endpoints utilisent du CAMEL_CASE pour les payloads
// (pas de @JsonProperty sur les DTO de génération côté backend).
// =========================================================================

import { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "./axios-services/axiosInstance";
import {
  GenerationUnitaireRequest,
  GenerationSemaineRequest,
  GenerationResult,
  GenerationSemaineResponse,
  MatchingPreviewResponse,
} from "@/lib/types/planning";

const URL_BASE = "/voyage";

function logAxiosError(scope: string, error: unknown): void {
  const axErr = error as AxiosError;
  console.error(
    `[voyage-generation-service] ${scope}:`,
    axErr.response?.data || axErr.message || error,
  );
}

/**
 * POST /voyage/generer-unitaire
 *
 * Génère un voyage à partir d'un créneau pour une date précise.
 * - Si publierDirectement=true ET matching ressources OK → statut "PUBLIE" + voyageId
 * - Sinon → statut "INCOMPLET" + brouillonId (un brouillon a été créé)
 */
export async function genererUnitaire(
  request: GenerationUnitaireRequest,
): Promise<GenerationResult> {
  try {
    const response: AxiosResponse<GenerationResult> = await axiosInstance.post(
      `${URL_BASE}/generer-unitaire`,
      request,
    );
    return response.data;
  } catch (error) {
    logAxiosError("genererUnitaire", error);
    throw error;
  }
}

/**
 * POST /voyage/matching-preview
 *
 * Prévisualise le matching ressources (véhicule, chauffeur) pour une semaine donnée.
 * Aucune création n'est faite côté backend.
 *
 * @param request.semaineDebut Doit être un lundi (format YYYY-MM-DD).
 */
export async function matchingPreview(
  request: GenerationSemaineRequest,
): Promise<MatchingPreviewResponse> {
  try {
    const response: AxiosResponse<MatchingPreviewResponse> =
      await axiosInstance.post(`${URL_BASE}/matching-preview`, request);
    return response.data;
  } catch (error) {
    logAxiosError("matchingPreview", error);
    throw error;
  }
}

/**
 * POST /voyage/generer-semaine
 *
 * Génère tous les voyages d'une semaine pour une liste de lignes données.
 * - Voyages avec matching OK → statut PUBLIE
 * - Voyages avec conflit ressources → brouillon créé pour résolution manuelle
 *
 * @param request.semaineDebut Doit être un lundi (format YYYY-MM-DD).
 */
export async function genererSemaine(
  request: GenerationSemaineRequest,
): Promise<GenerationSemaineResponse> {
  try {
    const response: AxiosResponse<GenerationSemaineResponse> =
      await axiosInstance.post(`${URL_BASE}/generer-semaine`, request);
    return response.data;
  } catch (error) {
    logAxiosError("genererSemaine", error);
    throw error;
  }
}

// ====================== Helpers ======================

/**
 * Retourne le lundi de la semaine d'une date donnée (ou de la semaine actuelle).
 * Format YYYY-MM-DD.
 */
export function getMondayOfWeek(date: Date = new Date()): string {
  const d = new Date(date);
  const day = d.getDay(); // 0 = dimanche, 1 = lundi, ..., 6 = samedi
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  // Format YYYY-MM-DD en local
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Ajoute n semaines à un lundi (format YYYY-MM-DD) et retourne le lundi correspondant.
 */
export function addWeeksToMonday(monday: string, weeks: number): string {
  const [y, m, d] = monday.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + weeks * 7);
  return getMondayOfWeek(date);
}
// END OF FILE: src/lib/services/voyage-generation-service.ts
