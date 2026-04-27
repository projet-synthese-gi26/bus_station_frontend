/**
 * agency-public-service.ts  (remplacé — P-04)
 *
 * Service agences pour l'espace public.
 * Utilise apiClient + API_ROUTES → pointe sur le json-server.
 * Pour migrer vers le vrai backend : changer NEXT_PUBLIC_API_URL dans .env.local
 *
 * Les noms de fonctions exportées sont conservés pour ne pas casser
 * les autres hooks qui les importent encore (useAgencyPublicDetails, etc.)
 */

import apiClient from "@/lib/api/api-client";
import { API_ROUTES } from "@/lib/config/api.config";
import type { AgenceVoyageFull } from "@/lib/types/agence.types";
import type { VoyagePreviewFull } from "@/lib/types/voyage.types";

// ─── Agences ─────────────────────────────────────────────────────────────────

/** Toutes les agences actives (listing public) */
export async function getAllPublicAgencies(): Promise<AgenceVoyageFull[]> {
  const res = await apiClient.get<AgenceVoyageFull[]>(API_ROUTES.agence.all);
  const data = Array.isArray(res.data) ? res.data : [];
  return data.filter((a) => a.statutAgence === "ACTIVE");
}

/** Profil public d'une agence par son ID */
export async function getPublicAgencyById(
  id: string,
): Promise<AgenceVoyageFull | null> {
  const res = await apiClient.get<AgenceVoyageFull>(
    API_ROUTES.agence.public(id),
  );
  return res.data ?? null;
}

/** Toutes les agences d'une gare */
export async function getAgencesByGare(
  gareId: number,
): Promise<AgenceVoyageFull[]> {
  const res = await apiClient.get<AgenceVoyageFull[]>(
    API_ROUTES.gare.agences(gareId),
  );
  return Array.isArray(res.data) ? res.data : [];
}

// ─── Voyages d'une agence (public) ───────────────────────────────────────────

/** Voyages publiés à venir d'une agence */
export async function getTripsByAgencyId(
  agencyId: string,
): Promise<VoyagePreviewFull[]> {
  const res = await apiClient.get<VoyagePreviewFull[]>(
    API_ROUTES.voyage.publicByAgence(agencyId),
  );
  const data = Array.isArray(res.data) ? res.data : [];
  // Filtrer uniquement les voyages futurs (json-server ne le fait pas nativement)
  const now = new Date();
  return data.filter((v) => {
    if (!v.dateDepartPrev) return true;
    return new Date(v.dateDepartPrev) > now;
  });
}

// ─── Mise à jour profil agence ────────────────────────────────────────────────

/** Met à jour le profil public d'une agence */
export async function updateAgencyDetails(
  agencyId: string,
  data: Partial<AgenceVoyageFull>,
): Promise<AgenceVoyageFull> {
  const res = await apiClient.patch<AgenceVoyageFull>(
    API_ROUTES.agence.update(agencyId),
    data,
  );
  return res.data;
}
