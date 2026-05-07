// src/lib/types/planning.ts
// =========================================================================
// Bloc 4 — Types pour les Lignes de Service (Plannings) et la Génération de Voyages
//
// Backend de référence : https://traefikdev.yowyob.com/bus-station
//
// ⚠️ Convention de nommage IMPORTANTE :
//   - /ligne-service (PlanningController)        → payload en SNAKE_CASE
//   - /voyage/generer-* + /matching-preview      → payload en CAMEL_CASE
//   (le backend utilise @JsonProperty sur les DTO Planning, mais pas sur ceux
//    de la génération de voyages)
// =========================================================================

// ============== Enums ==============

export type RecurrenceType =
  | "QUOTIDIEN"
  | "HEBDOMADAIRE"
  | "MENSUEL"
  | "ANNUEL";

export type StatutPlanning = "BROUILLON" | "ACTIF" | "INACTIF";

export type DayOfWeekBackend =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

// Statuts retournés par la génération de voyages
export type StatutGeneration = "PUBLIE" | "INCOMPLET";

// ============== Créneau (CreneauPlanningDTO côté backend, snake_case) ==============

/**
 * Créneau d'un planning. C'est la "ligne de service" récurrente
 * (ex : "Yaoundé → Douala tous les lundis à 8h00").
 */
export interface Creneau {
  id_creneau?: string;
  id_planning?: string;

  // Scheduling
  jour_semaine?: DayOfWeekBackend | null;
  jour_mois?: number | null;
  mois?: number | null;

  // Voyage template
  titre?: string;
  description?: string;

  heure_depart: string; // "HH:mm:ss"
  heure_arrivee?: string | null; // "HH:mm:ss"
  duree_estimee?: string | null;

  lieu_depart: string;
  lieu_arrive: string;
  point_de_depart?: string | null;
  point_arrivee?: string | null;

  // Resources
  id_class_voyage: string;
  id_vehicule: string;
  id_chauffeur?: string | null;

  // Reservation settings
  nbr_places_disponibles?: number;
  delai_reservation_heures?: number;
  delai_confirmation_heures?: number;

  // Media
  small_image?: string | null;
  big_image?: string | null;
  amenities?: string[];

  actif?: boolean;
}

// Payload pour la création d'un créneau (les ids ne sont pas envoyés)
export type CreneauCreatePayload = Omit<Creneau, "id_creneau" | "id_planning">;

// Payload pour la mise à jour partielle d'un créneau (PATCH)
export type CreneauUpdatePayload = Partial<CreneauCreatePayload>;

// ============== Planning (PlanningVoyageDTO côté backend, snake_case) ==============

export interface PlanningVoyage {
  id_planning?: string;
  id_agence_voyage: string;
  nom: string;
  description?: string;
  recurrence: RecurrenceType;
  statut?: StatutPlanning;
  date_debut: string; // "YYYY-MM-DD"
  date_fin?: string | null;
  date_creation?: string;
  date_modification?: string;
  creneaux?: Creneau[];
}

export type PlanningVoyageCreatePayload = Omit<
  PlanningVoyage,
  "id_planning" | "statut" | "date_creation" | "date_modification"
>;

export type PlanningVoyageUpdatePayload = Partial<
  Omit<
    PlanningVoyage,
    "id_planning" | "creneaux" | "date_creation" | "date_modification"
  >
>;

// ============== Preview list response (PlanningVoyagePreviewDTO) ==============

export interface PlanningVoyagePreview {
  id_planning: string;
  id_agence_voyage: string;
  nom: string;
  description?: string;
  recurrence: RecurrenceType;
  statut?: StatutPlanning;
  date_debut: string;
  date_fin?: string | null;
  nb_creneaux?: number;
  // Optional agency name (when included by backend)
  nom_agence?: string;
}

// ============== Génération de Voyages (camelCase côté backend) ==============

/**
 * POST /voyage/generer-unitaire
 */
export interface GenerationUnitaireRequest {
  ligneServiceId: string; // = id_creneau
  dateDepartPrev: string; // "YYYY-MM-DD"
  publierDirectement: boolean;
}

/**
 * POST /voyage/matching-preview
 * POST /voyage/generer-semaine
 */
export interface GenerationSemaineRequest {
  agenceId: string;
  lignesIds: string[]; // tableau d'id_creneau
  semaineDebut: string; // "YYYY-MM-DD" (lundi de la semaine)
}

/**
 * Item retourné dans le preview de matching pour chaque ligne
 */
export interface MatchingPreviewItem {
  ligneServiceId: string;
  titre?: string;
  lieuDepart?: string;
  lieuArrive?: string;
  dateDepartPrev?: string; // ISO datetime
  heureArrive?: string; // ISO datetime
  vehiculeMatcheId?: string | null;
  chauffeurMatcheId?: string | null;
  classVoyageId?: string | null;
  statutPrevu: StatutGeneration;
  conflits: string[];
}

/**
 * Réponse de POST /voyage/matching-preview
 */
export interface MatchingPreviewResponse {
  voyagesPreview: MatchingPreviewItem[];
  totalPublie?: number;
  totalIncomplet?: number;
}

/**
 * Réponse de POST /voyage/generer-unitaire (GenerationResultDTO)
 */
export interface GenerationResult {
  ligneServiceId: string;
  dateDepartPrev: string; // ISO datetime
  statut: StatutGeneration;
  voyageId?: string | null; // présent si PUBLIE
  brouillonId?: string | null; // présent si INCOMPLET
  vehiculeId?: string | null;
  chauffeurId?: string | null;
  classVoyageId?: string | null;
  conflits: string[];
  message?: string;
}

/**
 * Réponse de POST /voyage/generer-semaine
 */
export interface GenerationSemaineResponse {
  voyagesPubliesIds: string[];
  brouillonsCreesIds: string[];
  erreurs: string[];
  totalPublie: number;
  totalBrouillons: number;
}

// ============== Helpers de conversion (front <-> backend) ==============

export const DAYS_OF_WEEK_BACKEND: DayOfWeekBackend[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

/**
 * Convertit un index de jour côté front (1..7, lundi=1) vers l'enum backend.
 */
export function dayIndexToBackend(index: number): DayOfWeekBackend {
  const safe = Math.min(7, Math.max(1, index));
  return DAYS_OF_WEEK_BACKEND[safe - 1];
}

/**
 * Convertit l'enum backend vers un index 1..7 (lundi=1).
 */
export function dayBackendToIndex(
  day: DayOfWeekBackend | string | null | undefined,
): number {
  if (!day) return 1;
  const idx = DAYS_OF_WEEK_BACKEND.indexOf(day as DayOfWeekBackend);
  return idx >= 0 ? idx + 1 : 1;
}

/**
 * "HH:mm" → "HH:mm:00"
 */
export function timeToBackend(t: string | null | undefined): string {
  if (!t) return "00:00:00";
  if (t.length === 5) return `${t}:00`;
  return t;
}

/**
 * "HH:mm:ss" → "HH:mm"
 */
export function timeFromBackend(t: string | null | undefined): string {
  if (!t) return "00:00";
  return t.substring(0, 5);
}
// END OF FILE: src/lib/types/planning.ts
