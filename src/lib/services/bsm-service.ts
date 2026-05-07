/**
 * bsm-service.ts  (recâblé — Bloc BSM)
 * Emplacement : src/lib/services/bsm-service.ts
 *
 * Tous les appels utilisent apiClient (default export) + le pattern
 * normalize + catch → fallback établi dans le projet.
 *
 * ⚠️  ANOMALIES BACKEND À SIGNALER (voir commentaires inline) :
 *  1. PUT statut agence : BSM_OPERATIONS.md dit /bsm/agence/{id}/statut
 *     mais ETAPE_2 dit /agence/{id}/statut — on utilise /bsm/agence/{id}/statut
 *     car c'est dans le périmètre BSM. À aligner avec l'équipe backend.
 *  2. GET alertes gare : ETAPE_2 dit /alerte/gare/{gareId}
 *     mais la todolist mentionne /alerte-agence/gare/{gareId}.
 *     On utilise /alerte/gare/{gareId} (source la plus récente = ETAPE_2).
 *  3. Taxes affiliation : BSM_OPERATIONS.md dit POST /bsm/taxe-affiliation
 *     mais ETAPE_2 dit POST /taxe-affiliation. On suit ETAPE_2.
 */

import apiClient from "@/lib/api/api-client";
import type { Gare, UpdateGareDTO } from "@/lib/types/gare.types";
import type { AgenceVoyageFull } from "@/lib/types/agence.types";
import type {
  TaxeAffiliation,
  PolitiqueGare,
  AlerteAgence,
  BsmCompte,
  UpdateBsmCompteDTO,
  CreateAlerteDTO,
  CreatePolitiqueDTO,
  UpdatePolitiqueDTO,
} from "@/lib/types/bsm.types";
import type { StatutAgence } from "@/lib/types/agence.types";

// ── Helpers ───────────────────────────────────────────────────────────────────

function toArray<T>(val: unknown): T[] {
  if (Array.isArray(val)) return val as T[];
  if (val && typeof val === "object") {
    const v = val as Record<string, unknown>;
    if (Array.isArray(v.content)) return v.content as T[];
  }
  return [];
}

// ── STATISTIQUES ─────────────────────────────────────────────────────────────

export interface BsmStatistiques {
  gareId: string;
  nbAgencesAffiliees: number;
  nbAgencesActives: number;
  nbVoyagesAujourdhui: number;
  nbVoyagesAVenir: number;
  tauxRemplissageMoyen: number;
}

export async function getBsmStatistiques(
  gareId: number | string,
): Promise<BsmStatistiques | null> {
  try {
    const res = await apiClient.get(`/bsm/statistiques/${gareId}`);
    return res.data as BsmStatistiques;
  } catch {
    console.error("[bsm-service] GET /bsm/statistiques failed");
    return null;
  }
}

// ── PROFIL BSM ────────────────────────────────────────────────────────────────

function normalizeBsmCompte(raw: Record<string, unknown>): BsmCompte {
  // Le backend peut nommer l'ID de la gare de plusieurs façons
  const rawGareId =
    raw.gareId ??
    raw.gareRoutiereId ??
    raw.idGare ??
    raw.stationId ??
    raw.busStationId ??
    null;

  // Accepter UUID (string) ou entier
  const gareId =
    rawGareId === null || rawGareId === undefined
      ? 0
      : typeof rawGareId === "string" && isNaN(Number(rawGareId))
        ? (rawGareId as unknown as number) // UUID conservé tel quel
        : Number(rawGareId);

  return {
    idCompte: String(raw.idCompte ?? raw.id ?? ""),
    gareId,
    userId: String(raw.userId ?? ""),
    username: raw.username ? String(raw.username) : undefined,
    nom: String(raw.nom ?? raw.first_name ?? raw.name ?? ""),
    email: String(raw.email ?? ""),
    telephone: String(raw.telephone ?? raw.phone_number ?? raw.phone ?? ""),
    role: "BSM",
    derniereConnexion: raw.derniereConnexion
      ? String(raw.derniereConnexion)
      : undefined,
  };
}

export async function getBsmCompte(): Promise<BsmCompte | null> {
  try {
    const res = await apiClient.get("/bsm/profil");
    const data = res.data;
    const raw = Array.isArray(data) ? data[0] : data;
    if (!raw) return null;
    console.log("[bsm-service] /bsm/profil raw response:", JSON.stringify(raw, null, 2));
    return normalizeBsmCompte(raw as Record<string, unknown>);
  } catch {
    console.error("[bsm-service] GET /bsm/profil failed");
    return null;
  }
}

export async function updateBsmCompte(
  data: UpdateBsmCompteDTO,
): Promise<BsmCompte> {
  const res = await apiClient.put("/bsm/profil", data);
  return normalizeBsmCompte(res.data as Record<string, unknown>);
}

// ── GARE ──────────────────────────────────────────────────────────────────────

export async function getBsmGare(
  gareId: number | string,
): Promise<Gare | null> {
  try {
    const res = await apiClient.get(`/gare/${gareId}`);
    return res.data as Gare;
  } catch {
    console.error("[bsm-service] GET /gare/{id} failed");
    return null;
  }
}

export async function updateBsmGare(
  gareId: number | string,
  data: UpdateGareDTO,
): Promise<Gare> {
  const res = await apiClient.put(`/gare/${gareId}`, data);
  return res.data as Gare;
}

// ── AGENCES AFFILIÉES ─────────────────────────────────────────────────────────

export async function getAgencesAffiliees(
  gareId: number | string,
): Promise<AgenceVoyageFull[]> {
  try {
    const res = await apiClient.get(`/gare/${gareId}/agences`);
    return toArray<AgenceVoyageFull>(res.data);
  } catch {
    console.error("[bsm-service] GET /gare/{id}/agences failed");
    return [];
  }
}

/**
 * Suspendre ou réactiver une agence.
 * ⚠️ Endpoint à confirmer avec le backend :
 *    BSM_OPERATIONS.md → PUT /bsm/agence/{agenceId}/statut
 *    ETAPE_2           → PUT /agence/{id}/statut
 * On utilise la version BSM_OPERATIONS (préfixe /bsm) qui est plus précise.
 */
export async function updateStatutAgence(
  agenceId: string,
  statut: StatutAgence,
  motif?: string,
): Promise<void> {
  await apiClient.put(`/bsm/agence/${agenceId}/statut`, {
    active: statut === "ACTIVE",
    motif: motif ?? "",
  });
}

// ── TAXES D'AFFILIATION ───────────────────────────────────────────────────────

function normalizeTaxe(raw: Record<string, unknown>): TaxeAffiliation {
  return {
    idTaxe: String(raw.idTaxe ?? raw.id ?? ""),
    agenceVoyageId: String(raw.agenceVoyageId ?? ""),
    gareId: Number(raw.gareId ?? raw.gareRoutiereId ?? 0),
    montant: Number(raw.montant ?? raw.montantFixe ?? 0),
    dateEcheance: raw.dateEcheance ? String(raw.dateEcheance) : "",
    datePaiement: raw.datePaiement ? String(raw.datePaiement) : null,
    statutPaiement:
      (raw.statutPaiement as TaxeAffiliation["statutPaiement"]) ?? "EN_ATTENTE",
    periode: String(raw.periode ?? ""),
  };
}

export async function getTaxesAffiliation(
  gareId: number | string,
): Promise<TaxeAffiliation[]> {
  try {
    const res = await apiClient.get(`/taxe-affiliation/gare/${gareId}`);
    return toArray<Record<string, unknown>>(res.data).map(normalizeTaxe);
  } catch {
    console.error("[bsm-service] GET /taxe-affiliation/gare failed");
    return [];
  }
}

export async function creerTaxeAffiliation(payload: {
  gareRoutiereId: number | string;
  nomTaxe: string;
  montantFixe: number;
}): Promise<TaxeAffiliation> {
  const res = await apiClient.post("/bsm/taxe-affiliation", payload);
  return normalizeTaxe(res.data as Record<string, unknown>);
}

export async function marquerTaxePayee(taxeId: string): Promise<void> {
  await apiClient.put(`/taxe-affiliation/${taxeId}/statut`, {
    statut: "PAYE",
  });
}

// ── POLITIQUES DE GARE ────────────────────────────────────────────────────────

function normalizePolitique(raw: Record<string, unknown>): PolitiqueGare {
  return {
    idPolitique: String(raw.idPolitique ?? raw.id ?? ""),
    gareId: Number(raw.gareId ?? raw.gareRoutiereId ?? 0),
    titre: String(raw.titre ?? raw.title ?? ""),
    description: String(raw.description ?? ""),
    categorie: (raw.categorie as PolitiqueGare["categorie"]) ?? "POLITIQUE",
    montant: raw.montant != null ? Number(raw.montant) : null,
    dateEffet: String(raw.dateEffet ?? raw.effectiveDate ?? ""),
    documentUrl: raw.documentUrl ? String(raw.documentUrl) : null,
  };
}

export async function getPolitiquesGare(
  gareId: number | string,
): Promise<PolitiqueGare[]> {
  try {
    const res = await apiClient.get(`/politique-gare/gare/${gareId}`);
    return toArray<Record<string, unknown>>(res.data).map(normalizePolitique);
  } catch {
    console.error("[bsm-service] GET /politique-gare/gare failed");
    return [];
  }
}

export async function creerPolitiqueGare(
  payload: CreatePolitiqueDTO,
): Promise<PolitiqueGare> {
  const { gareId, ...rest } = payload;
  const res = await apiClient.post("/politique-gare", {
    gareRoutiereId: gareId,
    ...rest,
  });
  return normalizePolitique(res.data as Record<string, unknown>);
}

export async function updatePolitiqueGare(
  id: string,
  payload: UpdatePolitiqueDTO,
): Promise<PolitiqueGare> {
  const res = await apiClient.put(`/politique-gare/${id}`, payload);
  return normalizePolitique(res.data as Record<string, unknown>);
}

export async function supprimerPolitiqueGare(id: string): Promise<void> {
  await apiClient.delete(`/politique-gare/${id}`);
}

// ── ALERTES ───────────────────────────────────────────────────────────────────

function normalizeAlerte(raw: Record<string, unknown>): AlerteAgence {
  return {
    idAlerte: String(raw.idAlerte ?? raw.id ?? ""),
    agenceVoyageId: String(raw.agenceVoyageId ?? raw.agenceId ?? ""),
    gareId: Number(raw.gareId ?? 0),
    type: (raw.type ?? raw.typeAlerte) as AlerteAgence["type"],
    message: String(raw.message ?? ""),
    dateEnvoi: String(raw.dateEnvoi ?? new Date().toISOString()),
    envoyePar: String(raw.envoyePar ?? "BSM"),
    lu: Boolean(raw.lu ?? false),
  };
}

/**
 * Historique des alertes envoyées depuis une gare.
 * ⚠️ ETAPE_2 dit GET /alerte/gare/{gareId} — on utilise cet endpoint.
 *    La todolist mentionne /alerte-agence/gare/{gareId} — à confirmer.
 */
export async function getAlertesGare(
  gareId: number | string,
): Promise<AlerteAgence[]> {
  try {
    const res = await apiClient.get(`/alerte/gare/${gareId}`);
    return toArray<Record<string, unknown>>(res.data).map(normalizeAlerte);
  } catch {
    console.error("[bsm-service] GET /alerte/gare failed");
    return [];
  }
}

export async function envoyerAlerte(
  payload: CreateAlerteDTO,
): Promise<AlerteAgence> {
  const res = await apiClient.post("/alerte", {
    agenceId: payload.agenceVoyageId,
    message: payload.message,
    typeAlerte: payload.type,
  });
  return normalizeAlerte(res.data as Record<string, unknown>);
}
