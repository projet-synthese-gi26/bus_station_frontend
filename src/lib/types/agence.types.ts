/**
 * agence.types.ts
 *
 * Extension du type `AgenceVoyage` généré par openapi-typescript-codegen.
 * On NE modifie PAS les fichiers generated-api. On étend ici.
 *
 * Champs nouveaux (conception v4) :
 *   - logoUrl, statutAgence, moyensPaiement[]
 *   - vehiculeIdDefaut, chauffeurIdDefaut, nbrPlaceDefaut, dateLimite*
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

// ── Type principal ────────────────────────────────────────────────────────────

/**
 * AgenceVoyageFull = AgenceVoyage (generated) + champs étendus.
 * À utiliser partout où on a besoin du profil complet de l'agence.
 */
export interface AgenceVoyageFull {
  // Champs du generated-api (AgenceVoyage)
  agencyId: string;
  organisationId?: string;
  userId?: string;
  longName?: string;
  shortName?: string;
  location?: string;
  socialNetwork?: string;
  description?: string;
  greetingMessage?: string;

  // Champs étendus
  gareId?: number;
  logoUrl?: string | null;
  statutAgence: StatutAgence;
  moyensPaiement?: MoyenPaiement[];

  // Ressources par défaut (génération automatique)
  vehiculeIdDefaut?: string | null;
  chauffeurIdDefaut?: string | null;
  nbrPlaceDefaut?: number | null;
  dateLimiteResaAvant?: number | null;
  dateLimiteConfAvant?: number | null;
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
  moyensPaiement: MoyenPaiement[];
}

export interface UpdateRessourcesDefautDTO {
  vehiculeIdDefaut?: string | null;
  chauffeurIdDefaut?: string | null;
  nbrPlaceDefaut?: number | null;
  dateLimiteResaAvant?: number | null;
  dateLimiteConfAvant?: number | null;
}

export interface UpdateStatutAgenceDTO {
  statutAgence: StatutAgence;
}
