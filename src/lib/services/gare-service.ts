import { AxiosResponse } from "axios";
import axiosInstance from "@/lib/services/axios-services/axiosInstance";
import { GareRoutiere } from "@/lib/types/models/GareRoutiere";
import { TravelAgency } from "@/lib/types/models/Agency";
import { Trip } from "@/lib/types/models/Trip";

// =========================================================================
// Service Gare Routière — connecté au backend
// Base URL configurée via NEXT_PUBLIC_TRIP_AGENCY_BACKEND_API_URL
// (cf. axiosInstance.ts) → https://traefikdev.yowyob.com/bus-station
// =========================================================================

const PLACEHOLDER_PHOTO = "/placeholder.svg";

// ----------------- Types bruts retournés par le backend ------------------

interface GareRoutiereDTORaw {
  idGareRoutiere: string;
  nomGareRoutiere: string;
  adresse: string | null;
  ville: string;
  quartier: string;
  description: string | null;
  services: string[] | null;
  horaires: string | null;
  photoUrl: string | null;
  nomPresident: string | null;
  idCoordonneeGPS?: string | null;
  managerId?: string | null;
  nbreAgence?: number | null;
  localisation?: { latitude: number; longitude: number } | null;
}

interface GareRoutierePreviewDTORaw {
  idGareRoutiere: string;
  nomGareRoutiere: string;
  ville: string;
  quartier: string;
  photoUrl: string | null;
  services: string[] | null;
  nbreAgence: number | null;
  // Le backend Java sérialise le getter `isOpen()` en `open` côté JSON
  open: boolean;
}

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

// ----------------- Helpers ----------------------------------------------

/**
 * Convertit une durée ISO-8601 (ex: "PT4H30M") en "4h 30min".
 */
function formatIsoDuration(iso: string | null): string {
  if (!iso) return "";
  const h = parseInt(iso.match(/(\d+)H/)?.[1] ?? "0", 10);
  const m = parseInt(iso.match(/(\d+)M/)?.[1] ?? "0", 10);
  if (h > 0 && m > 0) return `${h}h ${m}min`;
  if (h > 0) return `${h}h`;
  if (m > 0) return `${m}min`;
  return "";
}

// ----------------- Mappers backend → frontend ----------------------------

function mapGareDtoToUi(raw: GareRoutiereDTORaw): GareRoutiere {
  const adresse =
    raw.adresse ??
    `${raw.quartier ?? ""}, ${raw.ville ?? ""}`.replace(/^,\s*|,\s*$/g, "");
  return {
    id: raw.idGareRoutiere,
    nom: raw.nomGareRoutiere ?? "",
    ville: raw.ville ?? "",
    quartier: raw.quartier ?? "",
    adresse,
    localisation: {
      latitude: raw.localisation?.latitude ?? 0,
      longitude: raw.localisation?.longitude ?? 0,
    },
    description: raw.description ?? "",
    imageUrl: raw.photoUrl || PLACEHOLDER_PHOTO,
    services: raw.services ?? [],
    nbAgencesAffiliees: raw.nbreAgence ?? 0,
    estOuvert: true,
    horaires: raw.horaires ?? undefined,
  };
}

function mapGarePreviewToUi(raw: GareRoutierePreviewDTORaw): GareRoutiere {
  return {
    id: raw.idGareRoutiere,
    nom: raw.nomGareRoutiere ?? "",
    ville: raw.ville ?? "",
    quartier: raw.quartier ?? "",
    adresse: `${raw.quartier ?? ""}, ${raw.ville ?? ""}`.replace(
      /^,\s*|,\s*$/g,
      "",
    ),
    localisation: { latitude: 0, longitude: 0 },
    description: "",
    imageUrl: raw.photoUrl || PLACEHOLDER_PHOTO,
    services: raw.services ?? [],
    nbAgencesAffiliees: raw.nbreAgence ?? 0,
    estOuvert: raw.open ?? true,
  };
}

function mapAgenceResponseToUi(raw: AgenceVoyageResponseRaw): TravelAgency {
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
    logoUrl: raw.logoUrl || PLACEHOLDER_PHOTO,
    rating: raw.rating ?? 0,
    specialties: raw.specialties ?? [],
    contact: raw.contact ?? { email: "", phone: "", website: "" },
    gareIds: raw.gareIds ?? [],
  };
}

function mapVoyagePreviewToTrip(raw: VoyagePreviewDTORaw): Trip {
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
    smallImage: raw.smallImage || PLACEHOLDER_PHOTO,
    bigImage: raw.bigImage || PLACEHOLDER_PHOTO,
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
 * Récupère la liste de toutes les gares (paginée côté backend).
 */
export async function getAllGares(): Promise<GareRoutiere[] | null> {
  try {
    const response: AxiosResponse<SpringPage<GareRoutierePreviewDTORaw>> =
      await axiosInstance.get(`/gare`, { params: { page: 0, size: 100 } });
    if (response.status === 200 && response.data) {
      const content = response.data.content ?? [];
      return content.map(mapGarePreviewToUi);
    }
    console.warn(
      "[gare-service] getAllGares: code HTTP inattendu",
      response.status,
    );
    return null;
  } catch (error) {
    console.error("[gare-service] Erreur récupération gares :", error);
    throw error;
  }
}

/**
 * Récupère le détail d'une gare par son ID.
 */
export async function getGareById(id: string): Promise<GareRoutiere | null> {
  if (!id) throw new Error("L'ID de la gare est requis");
  try {
    const response: AxiosResponse<GareRoutiereDTORaw> = await axiosInstance.get(
      `/gare/${id}`,
    );
    if (response.status === 200 && response.data) {
      return mapGareDtoToUi(response.data);
    }
    console.warn(
      "[gare-service] getGareById: code HTTP inattendu",
      response.status,
    );
    return null;
  } catch (error) {
    console.error(`[gare-service] Erreur récupération gare ${id} :`, error);
    throw error;
  }
}

/**
 * Récupère les agences affiliées à une gare.
 */
export async function getAgencesByGareId(
  gareId: string,
): Promise<TravelAgency[] | null> {
  if (!gareId) return [];
  try {
    const response: AxiosResponse<AgenceVoyageResponseRaw[]> =
      await axiosInstance.get(`/gare/${gareId}/agences`);
    if (response.status === 200 && Array.isArray(response.data)) {
      return response.data.map(mapAgenceResponseToUi);
    }
    return [];
  } catch (error) {
    console.error(
      `[gare-service] Erreur récupération agences gare ${gareId} :`,
      error,
    );
    return [];
  }
}

/**
 * Récupère les voyages (départs) d'une gare.
 */
export async function getDepartsByGareId(
  gareId: string,
): Promise<Trip[] | null> {
  if (!gareId) return [];
  try {
    const response: AxiosResponse<SpringPage<VoyagePreviewDTORaw>> =
      await axiosInstance.get(`/gare/${gareId}/voyages`, {
        params: { page: 0, size: 50 },
      });
    if (response.status === 200 && response.data) {
      const content = response.data.content ?? [];
      return content.map(mapVoyagePreviewToTrip);
    }
    return [];
  } catch (error) {
    console.error(
      `[gare-service] Erreur récupération voyages gare ${gareId} :`,
      error,
    );
    return [];
  }
}
