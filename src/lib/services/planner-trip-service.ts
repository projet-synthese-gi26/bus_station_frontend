// src/lib/services/planner-trip-service.ts
//
// =========================================================================
// Bloc 4 — ADAPTATEUR pour la grille hebdomadaire de l'agence
//
// Ce fichier conserve son ancienne API publique (getPlannerTripsByAgencyId,
// createPlannerTrip, updatePlannerTrip, deletePlannerTrip) afin que les
// composants existants (WeeklySchedule, WeeklyScheduleTimeline, AddTripModal,
// usePlannerTrips) continuent de fonctionner SANS modification de signature.
//
// En interne, il appelle désormais les vrais endpoints backend `/ligne-service`.
// L'ancien serveur mocké JSON-server (`/planner-trips`) n'est plus utilisé.
//
// Backend : https://traefikdev.yowyob.com/bus-station
// =========================================================================

import { PlannerTrip } from "@/lib/types/models/Trip";
import {
  Creneau,
  CreneauCreatePayload,
  CreneauUpdatePayload,
  dayBackendToIndex,
  dayIndexToBackend,
  timeFromBackend,
  timeToBackend,
} from "@/lib/types/planning";
import * as planningService from "@/lib/services/planning-service";
import { getAllClassVoyagesByAgence } from "@/lib/services/class-voyage-service";
import { ClassVoyage } from "@/lib/types/generated-api";

// ---------- Mapping helpers ----------

function buildClassVoyageNameById(
  classes: ClassVoyage[],
): Record<string, string> {
  const map: Record<string, string> = {};
  for (const c of classes) {
    if (c.idClassVoyage) map[c.idClassVoyage] = c.nom ?? "";
  }
  return map;
}

function categoryFromClass(
  classVoyageId: string | null | undefined,
  classNameById: Record<string, string>,
): string {
  if (!classVoyageId) return "Classic";
  return classNameById[classVoyageId] || "Classic";
}

function mapCreneauToPlannerTrip(
  c: Creneau,
  agencyId: string,
  classNameById: Record<string, string>,
): PlannerTrip {
  return {
    id: c.id_creneau ?? "",
    agencyId,
    title: c.titre || `${c.lieu_depart} → ${c.lieu_arrive}`,
    dayOfWeek: dayBackendToIndex(c.jour_semaine ?? null),
    startTime: timeFromBackend(c.heure_depart),
    endTime: timeFromBackend(c.heure_arrivee),
    category: categoryFromClass(c.id_class_voyage, classNameById),
    description: c.description ?? undefined,

    // Bloc 4 — extras (utiles pour edit / generate)
    planningId: c.id_planning,
    lieuDepart: c.lieu_depart,
    lieuArrive: c.lieu_arrive,
    pointDeDepart: c.point_de_depart ?? undefined,
    pointArrivee: c.point_arrivee ?? undefined,
    classVoyageId: c.id_class_voyage,
    vehiculeId: c.id_vehicule,
    chauffeurId: c.id_chauffeur ?? undefined,
    nbrPlaces: c.nbr_places_disponibles,
  };
}

function buildCreneauPayloadFromPlannerTrip(
  data: Omit<PlannerTrip, "id">,
): CreneauCreatePayload {
  if (!data.classVoyageId) {
    throw new Error(
      "[planner-trip-service] classVoyageId est obligatoire pour créer un créneau.",
    );
  }
  if (!data.vehiculeId) {
    throw new Error(
      "[planner-trip-service] vehiculeId est obligatoire pour créer un créneau.",
    );
  }

  const lieuDepart = data.lieuDepart || "";
  const lieuArrive = data.lieuArrive || "";

  return {
    jour_semaine: dayIndexToBackend(data.dayOfWeek),
    titre: data.title,
    description: data.description,
    heure_depart: timeToBackend(data.startTime),
    heure_arrivee: timeToBackend(data.endTime),
    lieu_depart: lieuDepart,
    lieu_arrive: lieuArrive,
    point_de_depart: data.pointDeDepart,
    point_arrivee: data.pointArrivee,
    id_class_voyage: data.classVoyageId,
    id_vehicule: data.vehiculeId,
    id_chauffeur: data.chauffeurId,
    nbr_places_disponibles: data.nbrPlaces ?? 50,
    actif: true,
  };
}

function buildCreneauUpdatePayload(
  data: Partial<PlannerTrip>,
): CreneauUpdatePayload {
  const payload: CreneauUpdatePayload = {};
  if (data.dayOfWeek !== undefined)
    payload.jour_semaine = dayIndexToBackend(data.dayOfWeek);
  if (data.startTime !== undefined)
    payload.heure_depart = timeToBackend(data.startTime);
  if (data.endTime !== undefined)
    payload.heure_arrivee = timeToBackend(data.endTime);
  if (data.title !== undefined) payload.titre = data.title;
  if (data.description !== undefined) payload.description = data.description;
  if (data.lieuDepart !== undefined) payload.lieu_depart = data.lieuDepart;
  if (data.lieuArrive !== undefined) payload.lieu_arrive = data.lieuArrive;
  if (data.pointDeDepart !== undefined)
    payload.point_de_depart = data.pointDeDepart;
  if (data.pointArrivee !== undefined)
    payload.point_arrivee = data.pointArrivee;
  if (data.classVoyageId !== undefined)
    payload.id_class_voyage = data.classVoyageId;
  if (data.vehiculeId !== undefined) payload.id_vehicule = data.vehiculeId;
  if (data.chauffeurId !== undefined) payload.id_chauffeur = data.chauffeurId;
  if (data.nbrPlaces !== undefined)
    payload.nbr_places_disponibles = data.nbrPlaces;
  return payload;
}

// ---------- Public API (signature compatible ancienne version) ----------

/**
 * Récupère tous les créneaux (PlannerTrip) de tous les plannings d'une agence.
 *
 * En cas d'erreur 401/403 (mode public, pas de token), retourne un tableau vide
 * silencieusement plutôt que de propager l'erreur.
 */
export async function getPlannerTripsByAgencyId(
  agencyId: string,
): Promise<PlannerTrip[]> {
  if (!agencyId) {
    console.error("[planner-trip-service] agencyId manquant.");
    return [];
  }

  try {
    // Charger les classes voyage pour mapper les catégories
    let classesById: Record<string, string> = {};
    try {
      const classes = await getAllClassVoyagesByAgence(agencyId);
      classesById = buildClassVoyageNameById(classes);
    } catch (e) {
      // Pas bloquant : on garde la catégorie par défaut
      console.warn(
        "[planner-trip-service] Impossible de charger les classes voyage",
        e,
      );
    }

    const creneaux = await planningService.getAllCreneauxByAgence(agencyId);
    return creneaux.map((c) =>
      mapCreneauToPlannerTrip(c, agencyId, classesById),
    );
  } catch (error: unknown) {
    // Mode public sans token : 401 / 403 → vide silencieux
    const status = (error as { response?: { status?: number } })?.response
      ?.status;
    if (status === 401 || status === 403) {
      return [];
    }
    console.error(
      `[planner-trip-service] Erreur récupération planner trips agence ${agencyId} :`,
      error,
    );
    throw error;
  }
}

/**
 * Crée un nouveau créneau dans un planning de l'agence.
 *
 * Si `data.planningId` n'est pas fourni, utilise le 1er planning existant
 * (priorité ACTIF > BROUILLON), ou en crée un par défaut.
 */
export async function createPlannerTrip(
  data: Omit<PlannerTrip, "id">,
): Promise<PlannerTrip | null> {
  try {
    const planningId =
      data.planningId ??
      (await planningService.getOrCreateDefaultPlanning(data.agencyId));
    const payload = buildCreneauPayloadFromPlannerTrip(data);
    const created = await planningService.addCreneau(planningId, payload);
    return {
      ...data,
      id: created.id_creneau ?? "",
      planningId,
    };
  } catch (error) {
    console.error(
      "[planner-trip-service] Erreur création planner trip :",
      error,
    );
    throw error;
  }
}

/**
 * Met à jour un créneau (id = id_creneau).
 *
 * Utilisé notamment par le drag-and-drop de la grille (changement de jour/heure).
 */
export async function updatePlannerTrip(
  tripId: string,
  data: Partial<PlannerTrip>,
): Promise<PlannerTrip | null> {
  try {
    const payload = buildCreneauUpdatePayload(data);
    const updated = await planningService.updateCreneau(tripId, payload);

    // On retourne un PlannerTrip partiel (les composants ne lisent pas la valeur de retour
    // après update — ils refetch). Mais on respecte la signature.
    if (!updated) return null;
    return {
      id: updated.id_creneau ?? tripId,
      agencyId: data.agencyId ?? "",
      title: updated.titre || `${updated.lieu_depart} → ${updated.lieu_arrive}`,
      dayOfWeek: dayBackendToIndex(updated.jour_semaine ?? null),
      startTime: timeFromBackend(updated.heure_depart),
      endTime: timeFromBackend(updated.heure_arrivee),
      category: data.category ?? "Classic",
      description: updated.description ?? undefined,
      planningId: updated.id_planning,
      lieuDepart: updated.lieu_depart,
      lieuArrive: updated.lieu_arrive,
      classVoyageId: updated.id_class_voyage,
      vehiculeId: updated.id_vehicule,
      chauffeurId: updated.id_chauffeur ?? undefined,
      nbrPlaces: updated.nbr_places_disponibles,
    };
  } catch (error) {
    console.error(
      `[planner-trip-service] Erreur update trip ${tripId} :`,
      error,
    );
    throw error;
  }
}

/**
 * Supprime un créneau (id = id_creneau).
 */
export async function deletePlannerTrip(tripId: string): Promise<void> {
  try {
    await planningService.deleteCreneau(tripId);
  } catch (error) {
    console.error(
      `[planner-trip-service] Erreur suppression trip ${tripId} :`,
      error,
    );
    throw error;
  }
}
// END OF FILE: src/lib/services/planner-trip-service.ts
