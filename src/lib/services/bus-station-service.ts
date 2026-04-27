// src/lib/services/bus-station-service.ts
/**
 * FICHIER CONSERVÉ pour compatibilité avec les anciens composants BSM.
 * Les nouvelles pages utilisent bsm-service.ts à la place.
 * Les anciens hooks (useBusStationDashboard, etc.) pointent encore ici.
 */

import apiClient from "@/lib/api/api-client";
import { API_ROUTES } from "@/lib/config/api.config";
import type { Gare } from "@/lib/types/gare.types";
import type { AgenceVoyageFull } from "@/lib/types/agence.types";
import type {
  TaxeAffiliation,
  PolitiqueGare,
  BsmCompte,
} from "@/lib/types/bsm.types";

// Re-export des types sous les anciens noms pour rétrocompatibilité
export type BusStation = Gare;
export type Agency = AgenceVoyageFull;
export type AffiliationTax = TaxeAffiliation;
export type PolicyAndTax = PolitiqueGare;
export type BusStationManagerAccount = BsmCompte;

// Type interne utilisé par TripsChart
export interface TripsByDate {
  date: string;
  count: number;
}

// Type interne AgencyWithTaxStatus
export interface AgencyWithTaxStatus extends AgenceVoyageFull {
  taxStatus?: "payé" | "en attente" | "en retard";
  taxAmount?: number;
  taxDueDate?: string;
  // Alias legacy pour les composants UI (AffiliatedAgenciesList, DetailedAffiliatedAgenciesList)
  id?: string;
  logoUrl?: string;
  longName?: string;
}

// ─── Fonctions (câblées sur le nouveau apiClient) ─────────────────────────────

export const getBusStationDetails = async (
  stationId: string | number,
): Promise<Gare> => {
  const res = await apiClient.get<Gare>(
    API_ROUTES.gare.byId(Number(stationId)),
  );
  return res.data;
};

export const getAffiliatedAgencies = async (
  stationId: string | number,
): Promise<AgenceVoyageFull[]> => {
  const res = await apiClient.get<AgenceVoyageFull[]>(
    API_ROUTES.gare.agences(Number(stationId)),
  );
  return Array.isArray(res.data) ? res.data : [];
};

export const getTripsByAgencies = async (
  _agencyIds: string[],
): Promise<any[]> => {
  // Fonctionnalité remplacée par les nouvelles pages BSM
  return [];
};

export const getAffiliationTaxes = async (
  stationId: string | number,
): Promise<TaxeAffiliation[]> => {
  const res = await apiClient.get<TaxeAffiliation[]>(
    API_ROUTES.bsm.affiliationTaxByGare(Number(stationId)),
  );
  return Array.isArray(res.data) ? res.data : [];
};

export const getPoliciesAndTaxes = async (
  stationId: string | number,
): Promise<PolitiqueGare[]> => {
  const res = await apiClient.get<PolitiqueGare[]>(
    API_ROUTES.bsm.politiqueByGare(Number(stationId)),
  );
  return Array.isArray(res.data) ? res.data : [];
};

export const getBusStationManagerAccount = async (
  _busStationId: string,
): Promise<BsmCompte | null> => {
  const res = await apiClient.get<BsmCompte[]>(API_ROUTES.bsm.profil);
  const list = Array.isArray(res.data) ? res.data : [res.data];
  return list[0] ?? null;
};
