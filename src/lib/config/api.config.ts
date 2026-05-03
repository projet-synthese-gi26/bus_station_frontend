/**
 * api.config.ts
 *
 * Point de configuration central pour toutes les URLs de l'API.
 * Pour migrer du json-server vers le vrai backend :
 *   → changer NEXT_PUBLIC_API_URL dans .env.local
 *   → aucun autre fichier à modifier
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_TRIP_AGENCY_BACKEND_API_URL ??
  "http://localhost:8080";

/**
 * Préfixes de routes organisés par domaine.
 * Permet de repérer facilement quel service touche quel endpoint.
 */
export const API_ROUTES = {
  // ── Public / Espace client ──────────────────────────────────────
  voyage: {
    all: "/voyage",
    byId: (id: string) => `/voyage/byId/${id}`,
    byAgence: (agencyId: string) => `/voyage/agence/${agencyId}`,
    publicByAgence: (agencyId: string) => `/voyage/agence/${agencyId}/public`,
    similaires: (id: string) => `/voyage/${id}/similaires`,
    create: "/voyage",
    update: (id: string) => `/voyage/${id}`,
    delete: (id: string) => `/voyage/${id}`,
  },

  // ── Brouillons ──────────────────────────────────────────────────
  brouillon: {
    byAgence: (agencyId: string) =>
      `/voyage-brouillon?agenceVoyageId=${agencyId}`,
    byId: (id: string) => `/voyage-brouillon/${id}`,
    create: "/voyage-brouillon",
    update: (id: string) => `/voyage-brouillon/${id}`,
    delete: (id: string) => `/voyage-brouillon/${id}`,
  },

  // ── Génération automatique ───────────────────────────────────────
  generation: {
    unitaire: "/voyage/generer-unitaire",
    preview: "/voyage/matching-preview",
    semaine: "/voyage/generer-semaine",
  },

  // ── Agences ─────────────────────────────────────────────────────
  agence: {
    all: "/agence",
    byId: (id: string) => `/agence/${id}`,
    public: (id: string) => `/agence/${id}/public`,
    byChef: (userId: string) => `/agence/chef-agence/${userId}`,
    create: "/agence",
    update: (id: string) => `/agence/${id}`,
    updateStatut: (id: string) => `/agence/${id}`, // PATCH { statutAgence }
    updateMoyens: (id: string) => `/agence/${id}`, // PATCH { moyensPaiement }
    updateDefauts: (id: string) => `/agence/${id}`, // PATCH { ressources défaut }
  },

  // ── Gares ───────────────────────────────────────────────────────
  gare: {
    all: "/gare",
    byId: (id: number) => `/gare/${id}`,
    agences: (id: number) => `/gare/${id}/agences`,
    voyages: (id: number) => `/gare/${id}/voyages`,
    update: (id: number) => `/gare/${id}`,
  },

  // ── Planning (LigneService) ─────────────────────────────────────
  planning: {
    byAgence: (agencyId: string) => `/planning/${agencyId}`,
    create: "/planning",
    update: (id: string) => `/planning/${id}`,
    delete: (id: string) => `/planning/${id}`,
  },

  // ── Véhicules ───────────────────────────────────────────────────
  vehicule: {
    byAgence: (agencyId: string) => `/vehicule/agence/${agencyId}`,
    byId: (id: string) => `/vehicule/${id}`,
    create: "/vehicule",
    update: (id: string) => `/vehicule/${id}`,
    delete: (id: string) => `/vehicule/${id}`,
  },

  // ── Classes de voyage ───────────────────────────────────────────
  classVoyage: {
    byAgence: (agencyId: string) => `/class-voyage/agence/${agencyId}`,
    byId: (id: string) => `/class-voyage/${id}`,
    create: "/class-voyage",
    update: (id: string) => `/class-voyage/${id}`,
    delete: (id: string) => `/class-voyage/${id}`,
  },

  // ── Employés & Chauffeurs ───────────────────────────────────────
  employe: {
    byAgence: (agencyId: string) => `/utilisateur/employes/${agencyId}`,
    chauffeurs: (agencyId: string) => `/utilisateur/chauffeurs/${agencyId}`,
    create: "/utilisateur/employe",
    createChauffeur: "/utilisateur/chauffeur",
    update: (id: string) => `/utilisateur/employe/${id}`,
    delete: (id: string) => `/utilisateur/employe/${id}`,
  },

  // ── Réservations ────────────────────────────────────────────────
  reservation: {
    byUser: (userId: string) => `/reservation/user/${userId}`,
    byVoyage: (voyageId: string) => `/reservation/voyage/${voyageId}`,
    byId: (id: string) => `/reservation/${id}`,
    create: "/reservation",
    annuler: (id: string) => `/reservation/${id}/annuler`,
    confirmer: (id: string) => `/reservation/${id}/confirmer`,
  },

  // ── BSM ─────────────────────────────────────────────────────────
  bsm: {
    profil: "/bsm/profil",
    updateProfil: "/bsm/profil",
    affiliationTaxByGare: (gareId: number) => `/affiliation-tax/gare/${gareId}`,
    affiliationTaxByAgence: (agencyId: string) =>
      `/affiliation-tax/agence/${agencyId}`,
    politiqueByGare: (gareId: number) => `/politique-gare/gare/${gareId}`,
    politiqueById: (id: string) => `/politique-gare/${id}`,
    alerteByGare: (gareId: number) => `/alerte-agence/gare/${gareId}`,
    alerteByAgence: (agencyId: string) => `/alerte-agence/agence/${agencyId}`,
    createAlerte: "/alerte-agence",
  },

  // ── Auth ─────────────────────────────────────────────────────────
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    me: "/auth/me",
    password: "/auth/me/password",
  },

  // ── Stats ────────────────────────────────────────────────────────
  stats: {
    general: (agencyId: string) => `/statistiques/agence/${agencyId}`,
    evolution: (agencyId: string) =>
      `/statistiques/agence/${agencyId}/evolution`,
    bsm: (gareId: number) => `/bsm/statistiques/${gareId}`,
  },
} as const;
