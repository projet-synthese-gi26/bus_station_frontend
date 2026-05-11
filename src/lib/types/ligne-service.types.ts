/**
 * ligne-service.types.ts
 *
 * Remplace complètement le type `PlannerTrip` du mock json-server.
 * LigneService = template d'horaires récurrents d'une agence (planning).
 */

// ── Énumération ───────────────────────────────────────────────────────────────

export type JourSemaine =
  | "LUNDI"
  | "MARDI"
  | "MERCREDI"
  | "JEUDI"
  | "VENDREDI"
  | "SAMEDI"
  | "DIMANCHE";

// ── Type principal ────────────────────────────────────────────────────────────

export interface LigneService {
  id: string;
  nom: string;
  lieuDepart: string;
  lieuArrive: string;
  heureDepart: string | null;
  heureArrivee: string | null;
  joursOperation: JourSemaine[];
  agenceVoyageId: string;
  classVoyageId?: string | null;
  nomClasse?: string | null;
  vehiculeId?: string | null;
  actif: boolean;
  description?: string | null;
  pointDeDepart?: string | null;
  pointArrivee?: string | null;
  prix?: number | null;
  dureeEstimee?: string | null;
  createdAt?: string;
  updatedAt?: string;
}


// ── DTOs ──────────────────────────────────────────────────────────────────────

export type CreateLigneServiceDTO = Omit<LigneService, "id" | "createdAt" | "updatedAt">;
export type UpdateLigneServiceDTO = Partial<CreateLigneServiceDTO>;

// ── Génération unitaire depuis une LigneService ───────────────────────────────

export interface GenererVoyageUnitaireDTO {
  ligneServiceId: string;
  agenceVoyageId: string;
  dateDepartPrev: string; // date précise choisie par l'agence
  vehiculeId?: string | null; // si override manuel
  chauffeurId?: string | null; // si override manuel
  nbrPlaceReservable?: number | null;
  publierDirectement: boolean; // true = créer Voyage PUBLIE, false = créer Brouillon
}

// ── Génération en masse ───────────────────────────────────────────────────────

export interface GenererSemaineDTO {
  agenceVoyageId: string;
  lignesIds: string[]; // toutes les lignes actives, ou sélection
  semaineDebut: string; // lundi de la semaine au format YYYY-MM-DD
}

// Agence
export * from "./agence.types";

// Gare
export * from "./gare.types";

// Voyage & Brouillon
export * from "./voyage.types";

// Ligne de service (Planning)
export * from "./ligne-service.types";

// BSM
export * from "./bsm.types";

// Employés & Chauffeurs
export * from "./employe.types";

// Types communs existants (on les ré-exporte pour centraliser)
export type { PaginatedResponse, Gender } from "./common";
