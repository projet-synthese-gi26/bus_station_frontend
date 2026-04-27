/**
 * bsm.types.ts
 *
 * Types pour le tableau de bord du BusStation Manager.
 * Remplace les types mock AffiliationTax, PolicyAndTax, BusStationManagerAccount
 * de l'ancien bus-station.ts.
 */

// ── Affiliation Contrat ───────────────────────────────────────────────────────

export type FrequencePaiement = "MENSUEL" | "TRIMESTRIEL" | "ANNUEL";
export type StatutContrat = "ACTIF" | "EXPIRE" | "RESILIE" | "EN_ATTENTE";

export interface AffiliationContrat {
  idContrat: string;
  agenceVoyageId: string;
  gareId: number;
  dateDebut: string;
  dateFin?: string | null;
  montantLoyer: number;
  frequencePaiement: FrequencePaiement;
  statutContrat: StatutContrat;
}

// ── Taxe d'affiliation ────────────────────────────────────────────────────────

export type StatutPaiementTaxe =
  | "EN_ATTENTE"
  | "PAYE"
  | "EN_RETARD"
  | "PARTIELLEMENT_PAYE";

export interface TaxeAffiliation {
  idTaxe: string;
  agenceVoyageId: string;
  gareId: number;
  montant: number;
  dateEcheance: string;
  datePaiement?: string | null;
  statutPaiement: StatutPaiementTaxe;
  periode: string; // ex: "2026-04"
}

export type UpdateTaxeStatutDTO = {
  statutPaiement: StatutPaiementTaxe;
  datePaiement?: string;
};

// ── Politique de gare ─────────────────────────────────────────────────────────

export type CategoriePolitique =
  | "POLITIQUE"
  | "TAXE"
  | "REGLEMENT"
  | "FRAIS_SERVICE";

/**
 * PolitiqueGare — modèle backend en français.
 * Les champs `id`, `title`, `category`, `amount`, `effectiveDate` sont des
 * alias optionnels pour rétrocompatibilité avec les anciens composants UI
 * (PoliciesAndTaxesList.tsx). À supprimer quand les composants seront migrés.
 */
export interface PolitiqueGare {
  idPolitique: string;
  gareId: number;
  titre: string;
  description: string;
  categorie: CategoriePolitique;
  montant?: number | null;
  dateEffet: string;
  documentUrl?: string | null;
  // ── Alias legacy (à éliminer après migration complète) ──
  id?: string;
  title?: string;
  category?: CategoriePolitique;
  amount?: number | null;
  effectiveDate?: string;
}

export type CreatePolitiqueDTO = Omit<PolitiqueGare, "idPolitique">;
export type UpdatePolitiqueDTO = Partial<CreatePolitiqueDTO>;

// ── Alerte agence ─────────────────────────────────────────────────────────────

export type TypeAlerte =
  | "ALERTE_GENERALE"
  | "TAX_REMINDER"
  | "AVERTISSEMENT"
  | "SUSPENSION_NOTICE"
  | "REACTIVATION_NOTICE";

export interface AlerteAgence {
  idAlerte: string;
  agenceVoyageId: string;
  gareId: number;
  type: TypeAlerte;
  message: string;
  dateEnvoi: string;
  envoyePar: string;
  lu: boolean;
}

export interface CreateAlerteDTO {
  agenceVoyageId: string;
  gareId: number;
  type: TypeAlerte;
  message: string;
  envoyePar: string;
}

// ── Compte BSM ────────────────────────────────────────────────────────────────

/**
 * BsmCompte — modèle backend en français.
 * Les champs `name`, `phone`, `lastLogin` sont des alias optionnels pour
 * rétrocompatibilité avec SettingsForm.tsx. À supprimer après migration.
 */
export interface BsmCompte {
  idCompte: string;
  gareId: number;
  userId: string;
  nom: string;
  email: string;
  telephone: string;
  role: "BSM";
  derniereConnexion?: string;
  // ── Alias legacy (à éliminer après migration complète) ──
  name?: string;
  phone?: string;
  lastLogin?: string;
}

export type UpdateBsmCompteDTO = Pick<BsmCompte, "nom" | "email" | "telephone">;
