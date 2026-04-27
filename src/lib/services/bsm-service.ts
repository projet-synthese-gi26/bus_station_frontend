/**
 * bsm-service.ts  (nouveau — P-24 à P-29)
 *
 * Remplace bus-station-service.ts qui utilisait les types mock (BusStation, Agency, Trip)
 * et des URLs hardcodées localhost:3001.
 * Utilise apiClient + API_ROUTES + nouveaux types de conception.
 */

import apiClient from "@/lib/api/api-client";
import { API_ROUTES } from "@/lib/config/api.config";
import type { Gare, UpdateGareDTO } from "@/lib/types/gare.types";
import type { AgenceVoyageFull } from "@/lib/types/agence.types";
import type {
  BsmCompte,
  UpdateBsmCompteDTO,
  TaxeAffiliation,
  UpdateTaxeStatutDTO,
  PolitiqueGare,
  CreatePolitiqueDTO,
  UpdatePolitiqueDTO,
  AlerteAgence,
  CreateAlerteDTO,
} from "@/lib/types/bsm.types";

// ─── Gare ─────────────────────────────────────────────────────────────────────

export async function getBsmGare(gareId: number): Promise<Gare> {
  const res = await apiClient.get<Gare>(API_ROUTES.gare.byId(gareId));
  return res.data;
}

export async function updateBsmGare(
  gareId: number,
  data: UpdateGareDTO,
): Promise<Gare> {
  const res = await apiClient.patch<Gare>(API_ROUTES.gare.update(gareId), data);
  return res.data;
}

// ─── Agences affiliées ────────────────────────────────────────────────────────

export async function getAgencesAffiliees(
  gareId: number,
): Promise<AgenceVoyageFull[]> {
  const res = await apiClient.get<AgenceVoyageFull[]>(
    API_ROUTES.gare.agences(gareId),
  );
  return Array.isArray(res.data) ? res.data : [];
}

export async function updateStatutAgence(
  agencyId: string,
  statut: "ACTIVE" | "SUSPENDUE" | "EN_ATTENTE_VALIDATION",
): Promise<AgenceVoyageFull> {
  const res = await apiClient.patch<AgenceVoyageFull>(
    API_ROUTES.agence.updateStatut(agencyId),
    { statutAgence: statut },
  );
  return res.data;
}

// ─── Taxes d'affiliation ──────────────────────────────────────────────────────

export async function getTaxesAffiliation(
  gareId: number,
): Promise<TaxeAffiliation[]> {
  const res = await apiClient.get<TaxeAffiliation[]>(
    API_ROUTES.bsm.affiliationTaxByGare(gareId),
  );
  return Array.isArray(res.data) ? res.data : [];
}

export async function updateStatutTaxe(
  taxeId: string,
  data: UpdateTaxeStatutDTO,
): Promise<TaxeAffiliation> {
  const res = await apiClient.patch<TaxeAffiliation>(
    `/affiliation-tax/${taxeId}`,
    data,
  );
  return res.data;
}

// ─── Politiques de la gare ────────────────────────────────────────────────────

export async function getPolitiquesGare(
  gareId: number,
): Promise<PolitiqueGare[]> {
  const res = await apiClient.get<PolitiqueGare[]>(
    API_ROUTES.bsm.politiqueByGare(gareId),
  );
  return Array.isArray(res.data) ? res.data : [];
}

export async function createPolitiqueGare(
  data: CreatePolitiqueDTO,
): Promise<PolitiqueGare> {
  const res = await apiClient.post<PolitiqueGare>("/politique-gare", data);
  return res.data;
}

export async function updatePolitiqueGare(
  id: string,
  data: UpdatePolitiqueDTO,
): Promise<PolitiqueGare> {
  const res = await apiClient.patch<PolitiqueGare>(
    API_ROUTES.bsm.politiqueById(id),
    data,
  );
  return res.data;
}

export async function deletePolitiqueGare(id: string): Promise<void> {
  await apiClient.delete(API_ROUTES.bsm.politiqueById(id));
}

// ─── Alertes ──────────────────────────────────────────────────────────────────

export async function getAlertesGare(gareId: number): Promise<AlerteAgence[]> {
  const res = await apiClient.get<AlerteAgence[]>(
    API_ROUTES.bsm.alerteByGare(gareId),
  );
  return Array.isArray(res.data) ? res.data : [];
}

export async function envoyerAlerte(
  data: CreateAlerteDTO,
): Promise<AlerteAgence> {
  const res = await apiClient.post<AlerteAgence>(
    API_ROUTES.bsm.createAlerte,
    data,
  );
  return res.data;
}

// ─── Compte BSM ───────────────────────────────────────────────────────────────

export async function getBsmCompte(): Promise<BsmCompte | null> {
  const res = await apiClient.get<BsmCompte[]>(API_ROUTES.bsm.profil);
  const list = Array.isArray(res.data) ? res.data : [res.data];
  return list[0] ?? null;
}

export async function updateBsmCompte(
  data: UpdateBsmCompteDTO,
): Promise<BsmCompte> {
  const compte = await getBsmCompte();
  if (!compte) throw new Error("Compte BSM introuvable");
  const res = await apiClient.patch<BsmCompte>(`/bsm/${compte.idCompte}`, data);
  return res.data;
}
