// src/lib/services/planning-service.ts
// =========================================================================
// Bloc 4 — Service Planning (Ligne de Service)
//
// Backend de référence : https://traefikdev.yowyob.com/bus-station
//
// Endpoints :
//   - POST   /ligne-service                                 → create planning + creneaux
//   - PATCH  /ligne-service/{planningId}                    → update planning
//   - DELETE /ligne-service/{planningId}                    → delete planning
//   - GET    /ligne-service/{planningId}                    → get planning with creneaux
//   - GET    /ligne-service/agence/{agenceId}               → list previews
//   - POST   /ligne-service/{planningId}/creneaux           → add creneau
//   - PATCH  /ligne-service/creneaux/{creneauId}            → update creneau
//   - DELETE /ligne-service/creneaux/{creneauId}            → delete creneau
//   - PATCH  /ligne-service/{planningId}/activer            → activate
//   - PATCH  /ligne-service/{planningId}/desactiver         → deactivate
//
// ⚠️ Tous les payloads sont en snake_case (DTO @JsonProperty côté backend).
// =========================================================================

import { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "./axios-services/axiosInstance";
import {
  PlanningVoyage,
  PlanningVoyageCreatePayload,
  PlanningVoyageUpdatePayload,
  PlanningVoyagePreview,
  Creneau,
  CreneauCreatePayload,
  CreneauUpdatePayload,
} from "@/lib/types/planning";

const URL_BASE = "/ligne-service";

function logAxiosError(scope: string, error: unknown): void {
  const axErr = error as AxiosError;
  console.error(
    `[planning-service] ${scope}:`,
    axErr.response?.data || axErr.message || error,
  );
}

// ====================== CRUD Planning ======================

/**
 * Liste les plannings (previews) d'une agence.
 */
export async function getPlanningsByAgence(
  agenceId: string,
): Promise<PlanningVoyagePreview[]> {
  if (!agenceId) return [];
  try {
    const response: AxiosResponse<PlanningVoyagePreview[]> =
      await axiosInstance.get(`${URL_BASE}/agence/${agenceId}`);
    return response.data ?? [];
  } catch (error) {
    logAxiosError(`getPlanningsByAgence(${agenceId})`, error);
    throw error;
  }
}

/**
 * Récupère le détail complet d'un planning avec ses créneaux.
 */
export async function getPlanningById(
  planningId: string,
): Promise<PlanningVoyage | null> {
  if (!planningId) return null;
  try {
    const response: AxiosResponse<PlanningVoyage> = await axiosInstance.get(
      `${URL_BASE}/${planningId}`,
    );
    return response.data ?? null;
  } catch (error) {
    logAxiosError(`getPlanningById(${planningId})`, error);
    throw error;
  }
}

/**
 * Crée un nouveau planning (avec ses créneaux).
 */
export async function createPlanning(
  payload: PlanningVoyageCreatePayload,
): Promise<PlanningVoyage> {
  try {
    const response: AxiosResponse<PlanningVoyage> = await axiosInstance.post(
      URL_BASE,
      payload,
    );
    return response.data;
  } catch (error) {
    logAxiosError("createPlanning", error);
    throw error;
  }
}

/**
 * Met à jour un planning (champs optionnels).
 */
export async function updatePlanning(
  planningId: string,
  payload: PlanningVoyageUpdatePayload,
): Promise<PlanningVoyage> {
  try {
    const response: AxiosResponse<PlanningVoyage> = await axiosInstance.patch(
      `${URL_BASE}/${planningId}`,
      payload,
    );
    return response.data;
  } catch (error) {
    logAxiosError(`updatePlanning(${planningId})`, error);
    throw error;
  }
}

/**
 * Supprime un planning (et ses créneaux en cascade).
 */
export async function deletePlanning(planningId: string): Promise<void> {
  try {
    await axiosInstance.delete(`${URL_BASE}/${planningId}`);
  } catch (error) {
    logAxiosError(`deletePlanning(${planningId})`, error);
    throw error;
  }
}

/**
 * Active un planning (statut → ACTIF).
 */
export async function activerPlanning(
  planningId: string,
): Promise<PlanningVoyage> {
  try {
    const response: AxiosResponse<PlanningVoyage> = await axiosInstance.patch(
      `${URL_BASE}/${planningId}/activer`,
    );
    return response.data;
  } catch (error) {
    logAxiosError(`activerPlanning(${planningId})`, error);
    throw error;
  }
}

/**
 * Désactive un planning (statut → INACTIF).
 */
export async function desactiverPlanning(
  planningId: string,
): Promise<PlanningVoyage> {
  try {
    const response: AxiosResponse<PlanningVoyage> = await axiosInstance.patch(
      `${URL_BASE}/${planningId}/desactiver`,
    );
    return response.data;
  } catch (error) {
    logAxiosError(`desactiverPlanning(${planningId})`, error);
    throw error;
  }
}

// ====================== CRUD Creneau ======================

/**
 * Ajoute un créneau à un planning existant.
 */
export async function addCreneau(
  planningId: string,
  payload: CreneauCreatePayload,
): Promise<Creneau> {
  try {
    const response: AxiosResponse<Creneau> = await axiosInstance.post(
      `${URL_BASE}/${planningId}/creneaux`,
      payload,
    );
    return response.data;
  } catch (error) {
    logAxiosError(`addCreneau(${planningId})`, error);
    throw error;
  }
}

/**
 * Met à jour un créneau (PATCH partiel).
 */
export async function updateCreneau(
  creneauId: string,
  payload: CreneauUpdatePayload,
): Promise<Creneau> {
  try {
    const response: AxiosResponse<Creneau> = await axiosInstance.patch(
      `${URL_BASE}/creneaux/${creneauId}`,
      payload,
    );
    return response.data;
  } catch (error) {
    logAxiosError(`updateCreneau(${creneauId})`, error);
    throw error;
  }
}

/**
 * Supprime un créneau.
 */
export async function deleteCreneau(creneauId: string): Promise<void> {
  try {
    await axiosInstance.delete(`${URL_BASE}/creneaux/${creneauId}`);
  } catch (error) {
    logAxiosError(`deleteCreneau(${creneauId})`, error);
    throw error;
  }
}

// ====================== Helpers de haut niveau ======================

/**
 * Récupère TOUS les créneaux de TOUS les plannings d'une agence,
 * en chargeant chaque planning individuellement pour avoir ses créneaux.
 *
 * Renvoie un tableau aplati de créneaux (avec id_planning toujours rempli).
 */
export async function getAllCreneauxByAgence(
  agenceId: string,
): Promise<Creneau[]> {
  if (!agenceId) return [];
  const previews = await getPlanningsByAgence(agenceId);
  if (previews.length === 0) return [];

  const allCreneaux: Creneau[] = [];
  // En parallèle (limité par le nombre de plannings, généralement 1-5)
  const detailsPromises = previews.map((p) =>
    getPlanningById(p.id_planning).catch((e) => {
      console.warn(
        `[planning-service] getAllCreneauxByAgence: skip planning ${p.id_planning}`,
        e,
      );
      return null;
    }),
  );
  const allDetails = await Promise.all(detailsPromises);
  for (const detail of allDetails) {
    if (detail?.creneaux) {
      for (const c of detail.creneaux) {
        // S'assurer que id_planning est rempli (défensif)
        if (!c.id_planning && detail.id_planning) {
          c.id_planning = detail.id_planning;
        }
        allCreneaux.push(c);
      }
    }
  }
  return allCreneaux;
}

/**
 * Trouve le premier planning ACTIF/BROUILLON d'une agence, ou en crée un par défaut.
 * Utile pour les formulaires "ajout simple de créneau" qui ne demandent pas de choisir un planning.
 */
export async function getOrCreateDefaultPlanning(
  agenceId: string,
): Promise<string> {
  const previews = await getPlanningsByAgence(agenceId);
  // Préférer un planning ACTIF, sinon BROUILLON, sinon le premier
  const ordered = [...previews].sort((a, b) => {
    const order = (s?: string) =>
      s === "ACTIF" ? 0 : s === "BROUILLON" ? 1 : 2;
    return order(a.statut) - order(b.statut);
  });
  if (ordered.length > 0) return ordered[0].id_planning;

  // Aucun planning : on en crée un par défaut
  const todayIso = new Date().toISOString().split("T")[0];
  const created = await createPlanning({
    id_agence_voyage: agenceId,
    nom: "Planning Hebdomadaire",
    description: "Planning créé automatiquement",
    recurrence: "HEBDOMADAIRE",
    date_debut: todayIso,
    creneaux: [],
  });
  if (!created.id_planning) {
    throw new Error("Création du planning par défaut : aucun id retourné");
  }
  return created.id_planning;
}
// END OF FILE: src/lib/services/planning-service.ts
