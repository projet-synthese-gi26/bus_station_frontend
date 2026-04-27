// src/lib/types/bus-station.ts
/**
 * FICHIER DE COMPATIBILITÉ — NE PAS SUPPRIMER ENCORE.
 * Re-exporte les nouveaux types sous les anciens noms utilisés par
 * les anciens composants BSM (StationDetails, TripsChart, etc.).
 * Quand tous les anciens composants auront été migrés, ce fichier pourra être supprimé.
 */

export type { Gare as BusStation } from "@/lib/types/gare.types";
export type { AgenceVoyageFull as Agency } from "@/lib/types/agence.types";
export type {
  TaxeAffiliation as AffiliationTax,
  PolitiqueGare as PolicyAndTax,
  BsmCompte as BusStationManagerAccount,
} from "@/lib/types/bsm.types";

// Types internes utilisés uniquement par les anciens hooks/composants BSM
export interface Trip {
  id: string;
  agencyId: string;
  date: string;
  destination: string;
  origin: string;
  status: string;
}

export interface TripsByDate {
  date: string;
  count: number;
}
