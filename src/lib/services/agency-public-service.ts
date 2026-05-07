import { AxiosResponse } from "axios";
import axiosInstance from "@/lib/services/axios-services/axiosInstance";
import { TravelAgency } from "@/lib/types/models/Agency";
import { Trip } from "@/lib/types/models/Trip";

// =========================================================================
// Service Agence — vue publique (catalogue + profil + voyages)
// Backend : https://traefikdev.yowyob.com/bus-station
// Endpoints :
//   - GET    /agence                      → Page<AgenceVoyageResponseDTO>
//   - GET    /agence/{id}                 → AgenceVoyageResponseDTO
//   - PATCH  /agence/{id}                 → AgenceVoyageDTO (snake_case)
//   - GET    /voyage/agence/{id}/public   → Page<VoyagePreviewDTO>
// =========================================================================

const PLACEHOLDER = "/placeholder.svg";

// ----------------- Types bruts backend -----------------------------------

interface AgenceVoyageResponseRaw {
  id: string;
  organisationId: string | null;
  userId: string | null;
  longName: string;
  shortName: string;
  logoUrl: string | null;
  location: string | null;
  socialNetwork: string | null;
  description: string | null;
  greetingMessage: string | null;
  rating?: number;
  specialties?: string[];
  contact?: { email: string; phone: string; website: string } | null;
  gareIds?: string[];
  isActive?: boolean;
  moyensPaiement?: string[];
}

interface VoyagePreviewDTORaw {
  idVoyage: string;
  nomAgence: string | null;
  lieuDepart: string | null;
  lieuArrive: string | null;
  nbrPlaceRestante: number | null;
  nbrPlaceReservable: number | null;
  dateDepartPrev: string | null;
  dureeVoyage: string | null;
  nomClasseVoyage: string | null;
  prix: number | null;
  smallImage: string | null;
  bigImage: string | null;
  amenities: string[] | null;
  statusVoyage: string | null;
}

interface SpringPage<T> {
  content: T[];
  totalElements?: number;
  totalPages?: number;
  number?: number;
  size?: number;
  last?: boolean;
}

// Type union pour la réponse "voyages publics" (parfois Array, parfois Page).
type VoyagesPublicResponse =
  | SpringPage<VoyagePreviewDTORaw>
  | VoyagePreviewDTORaw[];

// ----------------- Helpers ----------------------------------------------

function formatIsoDuration(iso: string | null): string {
  if (!iso) return "";
  const h = parseInt(iso.match(/(\d+)H/)?.[1] ?? "0", 10);
  const m = parseInt(iso.match(/(\d+)M/)?.[1] ?? "0", 10);
  if (h > 0 && m > 0) return `${h}h ${m}min`;
  if (h > 0) return `${h}h`;
  if (m > 0) return `${m}min`;
  return "";
}

// ----------------- Mappers -----------------------------------------------

function mapResponseToTravelAgency(raw: AgenceVoyageResponseRaw): TravelAgency {
  return {
    agencyId: raw.id,
    id: raw.id,
    organisationId: raw.organisationId ?? "",
    userId: raw.userId ?? "",
    longName: raw.longName ?? "",
    shortName: raw.shortName ?? "",
    location: raw.location ?? "",
    socialNetwork: raw.socialNetwork ?? "",
    description: raw.description ?? "",
    greetingMessage: raw.greetingMessage ?? "",
    logoUrl: raw.logoUrl || PLACEHOLDER,
    rating: raw.rating ?? 0,
    specialties: raw.specialties ?? [],
    contact: raw.contact ?? { email: "", phone: "", website: "" },
    gareIds: raw.gareIds ?? [],
  };
}

function mapPreviewToTrip(raw: VoyagePreviewDTORaw): Trip {
  const dateDepart = raw.dateDepartPrev ?? "";
  let heureDepart = "";
  if (dateDepart) {
    const d = new Date(dateDepart);
    if (!isNaN(d.getTime())) {
      heureDepart = d.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  }
  const validStatuts = [
    "PUBLIE",
    "EN_COURS",
    "EN_ATTENTE",
    "TERMINE",
    "ANNULE",
  ] as const;
  type Statut = (typeof validStatuts)[number];
  const statut: Statut = (validStatuts as readonly string[]).includes(
    raw.statusVoyage ?? "",
  )
    ? (raw.statusVoyage as Statut)
    : "PUBLIE";

  return {
    idVoyage: raw.idVoyage,
    titre: `${raw.lieuDepart ?? ""} → ${raw.lieuArrive ?? ""}`,
    description: "",
    dateDepartPrev: dateDepart,
    lieuDepart: raw.lieuDepart ?? "",
    dateDepartEffectif: "",
    dateArriveEffectif: "",
    lieuArrive: raw.lieuArrive ?? "",
    heureDepartEffectif: heureDepart,
    dureeVoyage: formatIsoDuration(raw.dureeVoyage),
    heureArrive: "",
    nbrPlaceReservable: raw.nbrPlaceReservable ?? 0,
    nbrPlaceRestante: raw.nbrPlaceRestante ?? 0,
    datePublication: "",
    dateLimiteReservation: "",
    dateLimiteConfirmation: "",
    statusVoyage: statut,
    smallImage: raw.smallImage || PLACEHOLDER,
    bigImage: raw.bigImage || PLACEHOLDER,
    nomClasseVoyage: raw.nomClasseVoyage ?? "Standard",
    prix: raw.prix ?? 0,
    nomAgence: raw.nomAgence ?? "",
    pointDeDepart: raw.lieuDepart ?? "",
    pointArrivee: raw.lieuArrive ?? "",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vehicule: {} as any,
    placeReservees: [],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    amenities: (raw.amenities ?? []) as any,
  };
}

// ----------------- API publiques (signatures conservées) -----------------

/**
 * Récupère une agence publique par son ID.
 */
export async function getPublicAgencyById(
  id: string,
): Promise<TravelAgency | null> {
  if (!id) return null;
  try {
    const response: AxiosResponse<AgenceVoyageResponseRaw> =
      await axiosInstance.get(`/agence/${id}`);
    if (response.status === 200 && response.data) {
      return mapResponseToTravelAgency(response.data);
    }
    console.warn(`[agency-public-service] Aucune agence trouvée pour ${id}`);
    return null;
  } catch (error) {
    console.error(`[agency-public-service] Erreur API :`, error);
    return null;
  }
}

/**
 * Met à jour les informations d'une agence (PATCH /agence/{id}).
 * Le backend attend un AgenceVoyageDTO en snake_case.
 */
export async function updateAgencyDetails(
  agencyId: string,
  dataToUpdate: Partial<TravelAgency>,
): Promise<TravelAgency> {
  if (!agencyId) {
    throw new Error(
      "[agency-public-service] updateAgencyDetails: agencyId requis",
    );
  }

  const payload: Record<string, unknown> = {};
  if (dataToUpdate.organisationId !== undefined)
    payload.organisation_id = dataToUpdate.organisationId;
  if (dataToUpdate.userId !== undefined) payload.user_id = dataToUpdate.userId;
  if (dataToUpdate.longName !== undefined)
    payload.long_name = dataToUpdate.longName;
  if (dataToUpdate.shortName !== undefined)
    payload.short_name = dataToUpdate.shortName;
  if (dataToUpdate.location !== undefined)
    payload.location = dataToUpdate.location;
  if (dataToUpdate.socialNetwork !== undefined)
    payload.social_network = dataToUpdate.socialNetwork;
  if (dataToUpdate.description !== undefined)
    payload.description = dataToUpdate.description;
  if (dataToUpdate.greetingMessage !== undefined)
    payload.greeting_message = dataToUpdate.greetingMessage;
  if (
    dataToUpdate.gareIds &&
    Array.isArray(dataToUpdate.gareIds) &&
    dataToUpdate.gareIds.length > 0
  ) {
    payload.gare_routiere_id = dataToUpdate.gareIds[0];
  }

  try {
    const response: AxiosResponse<AgenceVoyageResponseRaw> =
      await axiosInstance.patch(`/agence/${agencyId}`, payload);
    if (response.status === 200 && response.data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = response.data as any;
      if (data.id) return mapResponseToTravelAgency(data);

      // Fallback si le backend renvoie un AgenceVoyageDTO partiel (snake_case)
      return {
        agencyId,
        id: agencyId,
        organisationId: data.organisation_id ?? "",
        userId: data.user_id ?? "",
        longName: data.long_name ?? "",
        shortName: data.short_name ?? "",
        location: data.location ?? "",
        socialNetwork: data.social_network ?? "",
        description: data.description ?? "",
        greetingMessage: data.greeting_message ?? "",
        logoUrl: PLACEHOLDER,
        rating: 0,
        specialties: [],
        contact: { email: "", phone: "", website: "" },
        gareIds: data.gare_routiere_id ? [data.gare_routiere_id] : [],
      };
    }
    throw new Error(`Code HTTP inattendu : ${response.status}`);
  } catch (error) {
    console.error(
      `[agency-public-service] Erreur update agence ${agencyId} :`,
      error,
    );
    throw error;
  }
}

/**
 * Récupère les voyages publics d'une agence.
 */
export async function getTripsByAgencyId(agencyId: string): Promise<Trip[]> {
  if (!agencyId) return [];
  try {
    const response: AxiosResponse<VoyagesPublicResponse> =
      await axiosInstance.get(`/voyage/agence/${agencyId}/public`, {
        params: { page: 0, size: 50 },
      });
    if (response.status === 200 && response.data) {
      const data = response.data;
      const content: VoyagePreviewDTORaw[] = Array.isArray(data)
        ? data
        : (data.content ?? []);
      return content.map(mapPreviewToTrip);
    }
    return [];
  } catch (error) {
    console.error(
      `[agency-public-service] Erreur récupération voyages agence ${agencyId} :`,
      error,
    );
    return [];
  }
}

/**
 * Récupère toutes les agences publiques (paginé côté backend).
 */
export async function getAllPublicAgencies(): Promise<TravelAgency[]> {
  try {
    const response: AxiosResponse<SpringPage<AgenceVoyageResponseRaw>> =
      await axiosInstance.get(`/agence`, { params: { page: 0, size: 100 } });
    if (response.status === 200 && response.data) {
      const content = response.data.content ?? [];
      return content.map(mapResponseToTravelAgency);
    }
    return [];
  } catch (error) {
    console.error(
      "[agency-public-service] Erreur getAllPublicAgencies :",
      error,
    );
    return [];
  }
}
