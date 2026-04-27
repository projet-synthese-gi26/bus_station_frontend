/**
 * gare.types.ts
 *
 * Remplace complètement `gares-routiere.d.ts` (ancien type mock).
 * Modèle complet de la Gare tel que défini dans la conception v4.
 */

// ── Type principal ────────────────────────────────────────────────────────────

export interface Gare {
  idGare: number;
  nom: string;
  ville: string;
  quartier?: string | null;
  adresse: string;
  latitude?: number | null;
  longitude?: number | null;
  description?: string | null;
  imageUrl?: string | null;
  services?: string[];
  estOuvert: boolean;
  horaires?: string | null;
  termes_et_conditions?: string | null;
  tax_policy?: string | null;
  president_name?: string | null;
  // ── Alias legacy (utilisé par InfrastructureForm, DetailHeader) ──
  // Champ ajouté pour rétrocompat avec les anciens composants UI.
  // À supprimer après migration vers les champs séparés (ville/quartier/adresse).
  localisation?: string | null;
}

// ── DTO de mutation ───────────────────────────────────────────────────────────

export type UpdateGareDTO = Partial<Omit<Gare, "idGare">>;

// ── Sous-types pour les onglets de la page détail gare ───────────────────────

/** Résumé d'une agence affiliée affiché dans l'onglet "Agences" d'une gare */
export interface AgenceAffilieePreview {
  agencyId: string;
  shortName: string;
  longName?: string;
  logoUrl?: string | null;
  location?: string;
  statutAgence: "ACTIVE" | "SUSPENDUE" | "EN_ATTENTE_VALIDATION";
}

/** Résumé d'un voyage affiché dans l'onglet "Départs du jour" d'une gare */
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
