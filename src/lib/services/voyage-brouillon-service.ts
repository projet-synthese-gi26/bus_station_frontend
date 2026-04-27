/**
 * voyage-brouillon-service.ts  (nouveau — P-19)
 *
 * Service pour les voyages brouillons (VoyageBrouillon).
 * Utilisé par la page /dashboard/drafts et le formulaire /dashboard/trip-planning.
 */

import apiClient from "@/lib/api/api-client";
import { API_ROUTES } from "@/lib/config/api.config";
import type {
  VoyageBrouillon,
  CreateBrouillonDTO,
  UpdateBrouillonDTO,
} from "@/lib/types/voyage.types";

// ─── Lecture ──────────────────────────────────────────────────────────────────

/** Tous les brouillons d'une agence */
export async function getBrouillonsByAgence(
  agenceId: string,
): Promise<VoyageBrouillon[]> {
  const res = await apiClient.get<VoyageBrouillon[]>(
    API_ROUTES.brouillon.byAgence(agenceId),
  );
  return Array.isArray(res.data) ? res.data : [];
}

/** Détail d'un brouillon par ID */
export async function getBrouillonById(id: string): Promise<VoyageBrouillon> {
  const res = await apiClient.get<VoyageBrouillon>(
    API_ROUTES.brouillon.byId(id),
  );
  return res.data;
}

// ─── Mutations ────────────────────────────────────────────────────────────────

/** Créer un nouveau brouillon */
export async function createBrouillon(
  data: CreateBrouillonDTO,
): Promise<VoyageBrouillon> {
  const res = await apiClient.post<VoyageBrouillon>(
    API_ROUTES.brouillon.create,
    data,
  );
  return res.data;
}

/** Modifier un brouillon existant */
export async function updateBrouillon(
  id: string,
  data: UpdateBrouillonDTO,
): Promise<VoyageBrouillon> {
  const res = await apiClient.patch<VoyageBrouillon>(
    API_ROUTES.brouillon.update(id),
    data,
  );
  return res.data;
}

/** Supprimer un brouillon */
export async function deleteBrouillon(id: string): Promise<void> {
  await apiClient.delete(API_ROUTES.brouillon.delete(id));
}

/**
 * Publier un brouillon PRET → crée un vrai Voyage + archive le brouillon.
 *
 * Sur json-server : on simule en deux étapes locales.
 * Sur le vrai backend : un seul endpoint POST /voyage/brouillon/{id}/publier.
 */
export async function publierBrouillon(id: string): Promise<void> {
  // Simulation json-server : mettre le statut à CONVERTI
  await updateBrouillon(id, { statutBrouillon: "CONVERTI" });
  // Le vrai backend créera le Voyage et archivera le brouillon en une seule opération.
}
