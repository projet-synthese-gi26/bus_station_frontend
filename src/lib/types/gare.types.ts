/**
 * gare.types.ts
 *
 * Type Gare aligné avec la réponse backend (`GareRoutierePreviewDTO` / `GareRoutiereDTO`).
 *
 * IMPORTANT — Évolution :
 *   - L'ID de gare est désormais un UUID (string), conformément au backend.
 *   - Le service de gare normalise les champs `nomGareRoutiere → nom`,
 *     `photoUrl → imageUrl`, `isOpen → estOuvert` pour conserver la
 *     compatibilité avec les composants UI existants.
 */

// ── Type principal ────────────────────────────────────────────────────────────

export interface Gare {
  /** UUID côté backend (`idGareRoutiere`). */
  idGare: string;

  /** Nom de la gare (mappé depuis `nomGareRoutiere`). */
  nom: string;

  ville: string;
  quartier?: string | null;
  adresse?: string;

  latitude?: number | null;
  longitude?: number | null;

  description?: string | null;

  /** URL de la photo (mappé depuis `photoUrl`). */
  imageUrl?: string | null;

  services?: string[];

  /** Mappé depuis `isOpen`. */
  estOuvert: boolean;

  /** Nombre d'agences affiliées (mappé depuis `nbreAgence`). */
  nombreAgences?: number;

  horaires?: string | null;
  termes_et_conditions?: string | null;
  tax_policy?: string | null;
  president_name?: string | null;
  managerId?: string | null;

  /** Alias legacy (utilisé par InfrastructureForm, DetailHeader). */
  localisation?: string | null;
}

// ── DTO de mutation ───────────────────────────────────────────────────────────

export type UpdateGareDTO = Partial<Omit<Gare, "idGare">>;

// ── Sous-types pour les onglets de la page détail gare ───────────────────────

export interface AgenceAffilieePreview {
  agencyId: string;
  shortName: string;
  longName?: string;
  logoUrl?: string | null;
  location?: string;
  statutAgence: "ACTIVE" | "SUSPENDUE" | "EN_ATTENTE_VALIDATION";
}

export interface DepartDuJour {
  idVoyage: string;
  titre: string;
  heureDepartEffectif: string;
  lieuArrive: string;
  nbrPlaceRestante: number;
  nbrPlaceReservable: number;
  prix?: number;
  nomAgence?: string;
  logoAgence?: string | null;
  nomClasse?: string;
  statusVoyage: string;
}
// END OF FILE: src/lib/types/gare.types.ts
