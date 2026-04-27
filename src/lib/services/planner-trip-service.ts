/**
 * planner-trip-service.ts  (remplacé — P-05)
 *
 * Service pour les lignes de service (planning hebdomadaire).
 * Remplace l'ancien service qui utilisait PlannerTrip et localhost:3001/plannerTrips.
 * Utilise apiClient + API_ROUTES.
 *
 * Les noms de fonctions exportées sont conservés pour rétrocompatibilité
 * avec les composants qui les importent encore.
 */

import apiClient from "@/lib/api/api-client";
import { API_ROUTES } from "@/lib/config/api.config";
import type {
  LigneService,
  CreateLigneServiceDTO,
  UpdateLigneServiceDTO,
} from "@/lib/types/ligne-service.types";

// ─── Lecture ──────────────────────────────────────────────────────────────────

export async function getPlannerTripsByAgencyId(
  agencyId: string,
): Promise<LigneService[]> {
  const res = await apiClient.get<LigneService[]>(
    API_ROUTES.planning.byAgence(agencyId),
  );
  return Array.isArray(res.data) ? res.data : [];
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export async function createPlannerTrip(
  data: CreateLigneServiceDTO,
): Promise<LigneService> {
  const res = await apiClient.post<LigneService>(
    API_ROUTES.planning.create,
    data,
  );
  return res.data;
}

export async function updatePlannerTrip(
  id: string,
  data: UpdateLigneServiceDTO,
): Promise<LigneService> {
  const res = await apiClient.patch<LigneService>(
    API_ROUTES.planning.update(id),
    data,
  );
  return res.data;
}

export async function deletePlannerTrip(id: string): Promise<void> {
  await apiClient.delete(API_ROUTES.planning.delete(id));
}
