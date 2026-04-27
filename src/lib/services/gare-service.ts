/**
 * gare-service.ts  (remplacé — P-06 & P-07)
 *
 * Service gares pour l'espace public et le dashboard BSM.
 * Remplace l'ancien service qui utilisait localhost:3001/gares hardcodé.
 * Utilise apiClient + API_ROUTES.
 *
 * Noms de fonctions exportées conservés pour ne pas casser
 * les hooks existants (useGaresRoutieres, useGareDetails).
 */

import apiClient from "@/lib/api/api-client";
import { API_ROUTES } from "@/lib/config/api.config";
import type {
  Gare,
  AgenceAffilieePreview,
  DepartDuJour,
} from "@/lib/types/gare.types";
import type { AgenceVoyageFull } from "@/lib/types/agence.types";
import type { VoyageFull } from "@/lib/types/voyage.types";

// ─── Gares ────────────────────────────────────────────────────────────────────

/** Toutes les gares */
export async function getAllGares(): Promise<Gare[]> {
  const res = await apiClient.get<Gare[]>(API_ROUTES.gare.all);
  return Array.isArray(res.data) ? res.data : [];
}

/** Détail d'une gare par ID */
export async function getGareById(id: string | number): Promise<Gare | null> {
  const res = await apiClient.get<Gare>(API_ROUTES.gare.byId(Number(id)));
  return res.data ?? null;
}

/** Mise à jour d'une gare (BSM) */
export async function updateGare(
  id: number,
  data: Partial<Gare>,
): Promise<Gare> {
  const res = await apiClient.patch<Gare>(API_ROUTES.gare.update(id), data);
  return res.data;
}

// ─── Agences d'une gare ───────────────────────────────────────────────────────

/** Agences affiliées actives d'une gare */
export async function getAgencesByGareId(
  gareId: string | number,
): Promise<AgenceVoyageFull[]> {
  const res = await apiClient.get<AgenceVoyageFull[]>(
    API_ROUTES.gare.agences(Number(gareId)),
  );
  return Array.isArray(res.data) ? res.data : [];
}

// ─── Départs d'une gare ───────────────────────────────────────────────────────

/**
 * Voyages PUBLIE partant de cette gare (départs du jour ou à venir).
 * json-server ne filtre pas par date nativement → on filtre côté client.
 */
export async function getDepartsByGareId(
  gareId: string | number,
): Promise<DepartDuJour[]> {
  const res = await apiClient.get<VoyageFull[]>(
    API_ROUTES.gare.voyages(Number(gareId)),
  );

  const data = Array.isArray(res.data) ? res.data : [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return data
    .filter((v) => {
      if (v.statusVoyage !== "PUBLIE") return false;
      if (!v.dateDepartPrev) return true;
      return new Date(v.dateDepartPrev) >= today;
    })
    .sort((a, b) => {
      const ha = a.heureDepartEffectif ?? "00:00";
      const hb = b.heureDepartEffectif ?? "00:00";
      return ha.localeCompare(hb);
    })
    .map(
      (v): DepartDuJour => ({
        idVoyage: v.idVoyage,
        titre: v.titre,
        heureDepartEffectif: v.heureDepartEffectif ?? "—",
        lieuArrive: v.lieuArrive ?? "—",
        nbrPlaceRestante: v.nbrPlaceRestante ?? 0,
        nbrPlaceReservable: v.nbrPlaceReservable ?? 0,
        prix: v.prix,
        nomAgence: v.nomAgence,
        nomClasse: v.nomClasse,
        statusVoyage: v.statusVoyage,
      }),
    );
}
