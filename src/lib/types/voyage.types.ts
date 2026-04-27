/**
 * voyage.types.ts
 *
 * Extension du type `Voyage` généré + nouveau type `VoyageBrouillon`.
 * On NE touche PAS aux fichiers generated-api.
 */

// ── Ré-export des enums du generated-api pour usage centralisé ────────────────
export type StatusVoyage =
  | "EN_ATTENTE"
  | "PUBLIE"
  | "EN_COURS"
  | "TERMINE"
  | "ANNULE";

export type Amenity =
  | "WIFI"
  | "AC"
  | "USB"
  | "SNACKS"
  | "BEVERAGES"
  | "POWER_OUTLETS"
  | "ENTERTAINMENT"
  | "COMFORTABLE_SEATS"
  | "RESTROOMS"
  | "LUGGAGE_STORAGE"
  | "CHILD_SEATS"
  | "PET_FRIENDLY"
  | "AIRPORT_PICKUP"
  | "AIRPORT_DROP_OFF"
  | "MEAL_SERVICE"
  | "ONBOARD_GUIDE"
  | "SEAT_SELECTION"
  | "GROUP_DISCOUNTS"
  | "LATE_CHECK_IN"
  | "LATE_CHECK_OUT";

// ── Extension du type Voyage (generated-api) ──────────────────────────────────

/**
 * VoyageFull = Voyage (generated) + champs nécessaires au frontend.
 * Le generated-api Voyage n'inclut pas agenceVoyageId ni les IDs FK —
 * on les ajoute ici pour que les pages puissent filter/naviguer.
 */
export interface VoyageFull {
  idVoyage: string;
  agenceVoyageId?: string;
  vehiculeId?: string | null;
  classVoyageId?: string | null;
  chauffeurId?: string | null;
  voyageBrouillonId?: string | null;
  titre: string;
  description?: string;
  dateDepartPrev?: string;
  lieuDepart?: string;
  lieuArrive?: string;
  dateDepartEffectif?: string | null;
  dateArriveEffectif?: string | null;
  heureDepartEffectif?: string;
  heureArrive?: string;
  dureeVoyage?: string; // stocké comme "PT4H15M" (ISO 8601)
  pointDeDepart?: string;
  pointArrivee?: string;
  nbrPlaceReservable?: number;
  nbrPlaceReserve?: number;
  nbrPlaceConfirm?: number;
  nbrPlaceRestante?: number;
  datePublication?: string | null;
  dateLimiteReservation?: string | null;
  dateLimiteConfirmation?: string | null;
  statusVoyage: StatusVoyage;
  smallImage?: string | null;
  bigImage?: string | null;
  amenities?: Amenity[];
  // Dénormalisés (renvoyés par le backend dans les DTOs de listing)
  nomAgence?: string;
  nomClasse?: string;
  prix?: number;
}

// ── VoyagePreviewFull — version enrichie du VoyagePreviewDTO ─────────────────

export interface VoyagePreviewFull {
  idVoyage: string;
  agenceVoyageId?: string;
  nomAgence?: string;
  logoAgence?: string | null;
  titre?: string;
  lieuDepart?: string;
  lieuArrive?: string;
  heureDepartEffectif?: string;
  dateDepartPrev?: string;
  nbrPlaceRestante?: number;
  nbrPlaceReservable?: number;
  prix?: number;
  nomClasseVoyage?: string;
  smallImage?: string | null;
  dureeVoyage?: string;
  amenities?: Amenity[];
  statusVoyage?: StatusVoyage;
}

// ── VoyageBrouillon ───────────────────────────────────────────────────────────

export type StatutBrouillon = "INCOMPLET" | "PRET" | "CONVERTI" | "ANNULE";

export interface VoyageBrouillon {
  id: string;
  agenceVoyageId: string;
  ligneServiceId?: string | null;
  titre: string;
  lieuDepart?: string;
  lieuArrive?: string;
  pointDeDepart?: string | null;
  pointArrivee?: string | null;
  dateDepartPrev?: string | null;
  heureDepartEffectif?: string | null;
  heureArrive?: string | null;
  dureeEstimee?: string | null;
  classVoyageId?: string | null;
  vehiculeId?: string | null;
  chauffeurId?: string | null;
  nbrPlaceReservable?: number | null;
  prix?: number | null;
  amenities?: Amenity[];
  smallImage?: string | null;
  bigImage?: string | null;
  dateLimiteReservation?: string | null;
  dateLimiteConfirmation?: string | null;
  statutBrouillon: StatutBrouillon;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateBrouillonDTO = Omit<
  VoyageBrouillon,
  "id" | "createdAt" | "updatedAt"
>;
export type UpdateBrouillonDTO = Partial<CreateBrouillonDTO>;

// ── Matching preview ──────────────────────────────────────────────────────────

export interface MatchingPreviewItem {
  ligneServiceId: string;
  titre: string;
  dateDepartPrev: string;
  vehiculeMatche: { idVehicule: string; nom: string; modele: string } | null;
  chauffeurMatche: {
    userId: string;
    last_name: string;
    first_name: string;
  } | null;
  statutPrevu: "PUBLIE" | "INCOMPLET";
  conflits: string[];
}

export interface MatchingPreviewResponse {
  voyagesPreview: MatchingPreviewItem[];
  totalPublie: number;
  totalIncomplet: number;
}
