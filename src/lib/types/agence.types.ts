/**
 * agence.types.ts
 *
 * Type AgenceVoyageFull aligné avec la réponse backend
 * (`AgenceVoyageResponseDTO`) tout en conservant les champs étendus
 * de la conception v4 (logoUrl, statutAgence, moyensPaiement…).
 *
 * Évolutions importantes par rapport à la version précédente :
 *   - `gareIds: string[]` (UUIDs des gares affiliées) — backend renvoie
 *     une liste, pas un seul ID. Utilisé pour le filtre "par gare" sur
 *     la page /agency.
 *   - `moyensPaiement` accepte string[] (réponse backend) ou MoyenPaiement[]
 *     (objets legacy). Le composant qui consomme doit gérer les deux cas.
 *   - `rating`, `specialties`, `contact` ajoutés (renvoyés par le backend).
 */

// ── Énumérations ─────────────────────────────────────────────────────────────

export type StatutAgence = "ACTIVE" | "SUSPENDUE" | "EN_ATTENTE_VALIDATION";

export type TypePaiement =
  | "ORANGE_MONEY"
  | "MTN_MOMO"
  | "EXPRESS_UNION"
  | "YUP"
  | "VIREMENT_BANCAIRE"
  | "CASH"
  | "AUTRE";

// ── Sous-types ───────────────────────────────────────────────────────────────

export interface MoyenPaiement {
  id: string;
  type: TypePaiement;
  nomOperateur: string;
  codeMarchand?: string | null;
  numeroDépot?: string | null;
  nomCompte?: string | null;
  actif: boolean;
}

export interface ContactInfo {
  email?: string | null;
  phone?: string | null;
  website?: string | null;
}

// ── Type principal ────────────────────────────────────────────────────────────

/**
 * AgenceVoyageFull — modèle agence côté frontend.
 *
 * Construit par `normalizeAgence()` à partir de la réponse backend.
 * Tous les champs sont nommés en camelCase (convention frontend).
 */
export interface AgenceVoyageFull {
  // Identifiants
  agencyId: string; // mappé depuis `id` backend
  organisationId?: string;
  userId?: string;

  // Identité
  longName?: string;
  shortName?: string;
  location?: string;
  logoUrl?: string | null;
  description?: string;
  greetingMessage?: string;
  socialNetwork?: string;

  // Statut (dérivé de `isActive` côté backend)
  statutAgence: StatutAgence;

  // Affiliations (UUIDs des gares routières)
  gareIds?: string[];

  // Champs renvoyés par le backend mais non encore utilisés partout
  rating?: number;
  specialties?: string[];
  contact?: ContactInfo;

  // Moyens de paiement — peut être un tableau de strings (backend brut)
  // OU d'objets MoyenPaiement (config étendue côté front).
  moyensPaiement?: Array<string | MoyenPaiement>;

  // Ressources par défaut (génération automatique de voyages)
  vehiculeIdDefaut?: string | null;
  chauffeurIdDefaut?: string | null;
  nbrPlaceDefaut?: number | null;
  dateLimiteResaAvant?: number | null;
  dateLimiteConfAvant?: number | null;
}

// ── Helpers de discrimination moyensPaiement ─────────────────────────────────

/** Retourne true si l'élément est un objet MoyenPaiement (pas une string). */
export function isMoyenPaiementObject(
  m: string | MoyenPaiement,
): m is MoyenPaiement {
  return typeof m === "object" && m !== null && "type" in m;
}

// ── DTO de mutation ───────────────────────────────────────────────────────────

export interface UpdateAgenceProfilDTO {
  longName?: string;
  shortName?: string;
  description?: string;
  greetingMessage?: string;
  location?: string;
  socialNetwork?: string;
  logoUrl?: string;
}

export interface UpdateMoyensPaiementDTO {
  moyensPaiement: string[];
}

export interface UpdateRessourcesDefautDTO {
  vehiculeIdDefaut?: string | null;
  chauffeurIdDefaut?: string | null;
  nbrPlaceDefaut?: number | null;
  dateLimiteResaAvant?: number | null;
  dateLimiteConfAvant?: number | null;
}

export interface UpdateStatutAgenceDTO {
  active: boolean;
  motif?: string;
}
// END OF FILE: src/lib/types/agence.types.ts
