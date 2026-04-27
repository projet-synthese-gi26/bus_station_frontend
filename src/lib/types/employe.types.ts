/**
 * employe.types.ts
 *
 * Types pour les employés et chauffeurs.
 * Extension du generated-api EmployeResponseDTO.
 */

export type StatutEmploye =
  | "ACTIF" | "INACTIF" | "SUSPENDU"
  | "EN_CONGE" | "DEMISSIONNE" | "LICENCIE";

export type TypeEmploye = "CHAUFFEUR" | "EMPLOYE";

// ── Type principal ────────────────────────────────────────────────────────────

export interface Employe {
  employeId: string;
  userId: string;
  agenceVoyageId: string;
  nom: string;
  prenom: string;
  poste: string;
  departement?: string;
  dateEmbauche?: string;
  statutEmploye: StatutEmploye;
  salaire?: number;
  nomManager?: string;
  nomAgence?: string;
  type: TypeEmploye;
  // Champs chauffeur
  numeroPiece?: string;
  permisCategorie?: string | null;
  anneesExperience?: number | null;
}

// ── Résumé rapide pour les sélecteurs ────────────────────────────────────────

export interface ChauffeurPreview {
  userId: string;
  nom: string;
  prenom: string;
  permisCategorie?: string | null;
  statutEmploye: StatutEmploye;
}
