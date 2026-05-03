/**
 * voyage-form.service.ts
 * Lecture des ressources nécessaires au formulaire P-20.
 * Aucune mutation ici — uniquement des GETs.
 */

import apiClient from "@/lib/api/api-client";

// ── Types minimaux pour l'affichage dans les selects ─────────────────────────

export interface VehiculeOption {
  idVehicule: string;
  nom: string;
  modele: string;
  nbrPlaces: number;
  plaqueMatricule: string;
  lienPhoto?: string | null;
  disponible?: boolean;
}

export interface ChauffeurOption {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone?: string;
  photoUrl?: string | null;
}

export interface ClassVoyageOption {
  idClassVoyage: string;
  nom: string;
  prix: number;
  description?: string | null;
}

export interface GareOption {
  idGare: string;
  nom: string;
  ville?: string;
}

// ── Helpers de normalisation ──────────────────────────────────────────────────

function toArray<T>(val: unknown): T[] {
  if (Array.isArray(val)) return val as T[];
  if (val && typeof val === "object" && "content" in (val as object))
    return (val as { content: T[] }).content ?? [];
  return [];
}

function normalizeVehicule(raw: Record<string, unknown>): VehiculeOption {
  return {
    idVehicule: String(raw.idVehicule ?? raw.id ?? ""),
    nom: String(raw.nom ?? ""),
    modele: String(raw.modele ?? ""),
    nbrPlaces: Number(raw.nbrPlaces ?? 0),
    plaqueMatricule: String(raw.plaqueMatricule ?? ""),
    lienPhoto: raw.lienPhoto ? String(raw.lienPhoto) : null,
    disponible: raw.disponible !== 0 && raw.disponible !== false,
  };
}

function normalizeChauffeur(raw: Record<string, unknown>): ChauffeurOption {
  const firstName = String(raw.first_name ?? raw.firstName ?? "");
  const lastName = String(raw.last_name ?? raw.lastName ?? "");
  return {
    id: String(raw.id ?? raw.userId ?? ""),
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`.trim(),
    phone: raw.phone_number ? String(raw.phone_number) : undefined,
    photoUrl: raw.photoUrl ? String(raw.photoUrl) : null,
  };
}

function normalizeClass(raw: Record<string, unknown>): ClassVoyageOption {
  return {
    idClassVoyage: String(raw.idClassVoyage ?? raw.id ?? ""),
    nom: String(raw.nom ?? raw.name ?? ""),
    prix: Number(raw.prix ?? 0),
    description: raw.description ? String(raw.description) : null,
  };
}

function normalizeGare(raw: Record<string, unknown>): GareOption {
  return {
    idGare: String(raw.idGare ?? raw.idGareRoutiere ?? raw.id ?? ""),
    nom: String(raw.nom ?? raw.nomGareRoutiere ?? ""),
    ville: raw.ville ? String(raw.ville) : undefined,
  };
}

// ── Fonctions de récupération ─────────────────────────────────────────────────

/** Véhicules d'une agence */
export async function getVehiculeOptions(
  agenceId: string,
): Promise<VehiculeOption[]> {
  if (!agenceId) return [];
  try {
    const res = await apiClient.get(`/vehicule/agence/${agenceId}`);
    return toArray<Record<string, unknown>>(res.data).map(normalizeVehicule);
  } catch {
    console.error("[voyage-form] GET /vehicule/agence failed");
    return [];
  }
}

/** Chauffeurs d'une agence */
export async function getChauffeurOptions(
  agenceId: string,
): Promise<ChauffeurOption[]> {
  if (!agenceId) return [];
  try {
    const res = await apiClient.get(`/utilisateur/chauffeurs/${agenceId}`);
    return toArray<Record<string, unknown>>(res.data).map(normalizeChauffeur);
  } catch {
    console.error("[voyage-form] GET /utilisateur/chauffeurs failed");
    return [];
  }
}

/** Classes de voyage d'une agence */
export async function getClassVoyageOptions(
  agenceId: string,
): Promise<ClassVoyageOption[]> {
  if (!agenceId) return [];
  try {
    const res = await apiClient.get(`/class-voyage/agence/${agenceId}`);
    return toArray<Record<string, unknown>>(res.data).map(normalizeClass);
  } catch {
    console.error("[voyage-form] GET /class-voyage/agence failed");
    return [];
  }
}

/** Liste des gares (pour sélection points de départ/arrivée) */
export async function getGareOptions(): Promise<GareOption[]> {
  try {
    const res = await apiClient.get("/gare");
    return toArray<Record<string, unknown>>(res.data).map(normalizeGare);
  } catch {
    // GET /gare est connu comme instable — on retourne [] silencieusement
    return [];
  }
}

/** Détail d'un voyage existant pour le mode edit */
export async function getVoyageForEdit(
  voyageId: string,
): Promise<Record<string, unknown> | null> {
  if (!voyageId) return null;
  try {
    const res = await apiClient.get(`/voyage/${voyageId}`);
    return res.data as Record<string, unknown>;
  } catch {
    console.error("[voyage-form] GET /voyage/{id} failed");
    return null;
  }
}

/** Détail d'un brouillon pour le mode draft */
export async function getBrouillonForEdit(
  brouillonId: string,
): Promise<Record<string, unknown> | null> {
  if (!brouillonId) return null;
  try {
    const res = await apiClient.get(`/voyage/brouillon/${brouillonId}`);
    return res.data as Record<string, unknown>;
  } catch {
    console.error("[voyage-form] GET /voyage/brouillon/{id} failed");
    return null;
  }
}

/** Détail d'une LigneService pour le mode from-ligne */
export async function getLigneServiceForPrefill(
  ligneId: string,
): Promise<Record<string, unknown> | null> {
  if (!ligneId) return null;
  try {
    const res = await apiClient.get(`/ligne-service/${ligneId}`);
    return res.data as Record<string, unknown>;
  } catch {
    console.error("[voyage-form] GET /ligne-service/{id} failed");
    return null;
  }
}
