// src/lib/services/bus-station-service.ts
import {
  BusStation,
  Agency,
  Trip,
  AffiliationTax,
  PolicyAndTax,
  BusStationManagerAccount,
} from "@/lib/types/bus-station";
import axiosInstance from "@/lib/services/axios-services/axiosInstance";

// =========================================================================
// Service BSM Dashboard — connecté au vrai backend
// Base URL : NEXT_PUBLIC_TRIP_AGENCY_BACKEND_API_URL
// =========================================================================

const PLACEHOLDER = "/placeholder.svg";

// ----------------- Types bruts backend -----------------------------------

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
  nbreAgence?: number | null;
  localisation?: { latitude: number; longitude: number } | null;
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
  statusVoyage: string | null;
}

interface SpringPage<T> {
  content: T[];
  totalElements?: number;
  totalPages?: number;
}

type VoyagesPublicResponse =
  | SpringPage<VoyagePreviewDTORaw>
  | VoyagePreviewDTORaw[];

interface AffiliationRaw {
  id: string;
  gareRoutiereId: string;
  agencyId: string;
  agencyName: string;
  statut: "PAYE" | "EN_ATTENTE" | "EN_RETARD" | string;
  echeance: string;
  montantAffiliation: number;
  createdAt?: string;
  updatedAt?: string;
}

interface TaxeRaw {
  idTaxe: string;
  gareRoutiereId: string;
  nomTaxe: string;
  description: string | null;
  tauxTaxe: number | null;
  montantFixe: number | null;
  dateEffet: string;
  documentUrl: string | null;
}

interface TaxeAffiliationGareRaw {
  gareRoutiereId: string;
  montantTotalDu?: number;
  taxes: TaxeRaw[];
}

interface PolitiqueGareRaw {
  idPolitique?: string;
  id?: string;
  gareRoutiereId: string;
  titre?: string;
  nomPolitique?: string;
  description: string | null;
  category?: string;
  dateEffet?: string;
  documentUrl?: string | null;
}

// ----------------- Mappers -----------------------------------------------

function mapGareToBusStation(raw: GareRoutiereDTORaw): BusStation {
  return {
    id: raw.idGareRoutiere,
    nom: raw.nomGareRoutiere ?? "",
    ville: raw.ville ?? "",
    quartier: raw.quartier ?? "",
    adresse: raw.adresse ?? `${raw.quartier ?? ""}, ${raw.ville ?? ""}`,
    localisation: {
      latitude: raw.localisation?.latitude ?? 0,
      longitude: raw.localisation?.longitude ?? 0,
    },
    description: raw.description ?? "",
    imageUrl: raw.photoUrl || PLACEHOLDER,
    services: raw.services ?? [],
    nbAgencesAffiliees: raw.nbreAgence ?? 0,
    estOuvert: true,
    horaires: raw.horaires ?? "",
  };
}

function mapAgenceResponseToAgency(raw: AgenceVoyageResponseRaw): Agency {
  return {
    id: raw.id,
    organisationId: raw.organisationId ?? "",
    userId: raw.userId ?? "",
    longName: raw.longName ?? "",
    shortName: raw.shortName ?? "",
    logoUrl: raw.logoUrl || PLACEHOLDER,
    location: raw.location ?? "",
    description: raw.description ?? "",
    greetingMessage: raw.greetingMessage ?? "",
    rating: raw.rating ?? 0,
    specialties: raw.specialties ?? [],
    contact: raw.contact ?? { email: "", phone: "", website: "" },
    gareIds: raw.gareIds ?? [],
  };
}

function mapVoyageToTrip(raw: VoyagePreviewDTORaw, agencyId: string): Trip {
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
  return {
    idVoyage: raw.idVoyage,
    id: raw.idVoyage,
    titre: `${raw.lieuDepart ?? ""} → ${raw.lieuArrive ?? ""}`,
    description: "",
    dateDepartPrev: dateDepart,
    lieuDepart: raw.lieuDepart ?? "",
    dateDepartEffectif: "",
    dateArriveEffectif: "",
    lieuArrive: raw.lieuArrive ?? "",
    heureDepartEffectif: heureDepart,
    dureeVoyage: raw.dureeVoyage ?? "",
    heureArrive: "",
    nbrPlaceReservable: raw.nbrPlaceReservable ?? 0,
    nbrPlaceRestante: raw.nbrPlaceRestante ?? 0,
    datePublication: "",
    dateLimiteReservation: "",
    dateLimiteConfirmation: "",
    statusVoyage: raw.statusVoyage ?? "PUBLIE",
    smallImage: raw.smallImage || PLACEHOLDER,
    bigImage: raw.bigImage || PLACEHOLDER,
    nomClasseVoyage: raw.nomClasseVoyage ?? "Standard",
    prix: raw.prix ?? 0,
    nomAgence: raw.nomAgence ?? "",
    agencyId,
    pointDeDepart: raw.lieuDepart ?? "",
    pointArrivee: raw.lieuArrive ?? "",
    vehicule: {
      idVehicule: "",
      nom: "",
      modele: "",
      description: "",
      nbrPlaces: 0,
      lienPhoto: "",
      idAgenceVoyage: agencyId,
      plaqueMatricule: "",
    },
    placeReservees: [],
    amenities: [],
  };
}

function mapAffiliationToTax(raw: AffiliationRaw): AffiliationTax {
  let status: "payé" | "en attente" | "en retard" = "en attente";
  if (raw.statut === "PAYE") status = "payé";
  else if (raw.statut === "EN_RETARD") status = "en retard";
  return {
    id: raw.id,
    agencyId: raw.agencyId,
    stationId: raw.gareRoutiereId,
    amount: raw.montantAffiliation ?? 0,
    dueDate: raw.echeance ?? "",
    status,
    paymentDate: raw.statut === "PAYE" ? (raw.updatedAt ?? null) : null,
  };
}

function mapTaxeToPolicyTax(raw: TaxeRaw): PolicyAndTax {
  return {
    id: raw.idTaxe,
    stationId: raw.gareRoutiereId,
    title: raw.nomTaxe ?? "",
    description: raw.description ?? "",
    category: "Taxe",
    amount: raw.montantFixe ?? null,
    effectiveDate: raw.dateEffet ?? "",
    documentUrl: raw.documentUrl ?? null,
  };
}

function mapPolitiqueToPolicyTax(raw: PolitiqueGareRaw): PolicyAndTax {
  return {
    id: raw.idPolitique || raw.id || "",
    stationId: raw.gareRoutiereId,
    title: raw.titre || raw.nomPolitique || "",
    description: raw.description ?? "",
    category: "Politique",
    amount: null,
    effectiveDate: raw.dateEffet ?? "",
    documentUrl: raw.documentUrl ?? null,
  };
}

// ----------------- API publiques (signatures conservées) -----------------

export const getBusStationDetails = async (
  stationId: string,
): Promise<BusStation> => {
  const response = await axiosInstance.get<GareRoutiereDTORaw>(
    `/gare/${stationId}`,
  );
  if (response.status !== 200 || !response.data) {
    throw new Error("Failed to fetch bus station details");
  }
  return mapGareToBusStation(response.data);
};

export const getAffiliatedAgencies = async (
  stationId: string,
): Promise<Agency[]> => {
  try {
    const response = await axiosInstance.get<AgenceVoyageResponseRaw[]>(
      `/gare/${stationId}/agences`,
    );
    if (response.status === 200 && Array.isArray(response.data)) {
      return response.data.map(mapAgenceResponseToAgency);
    }
    return [];
  } catch (err) {
    console.error("[bus-station-service] Erreur getAffiliatedAgencies :", err);
    return [];
  }
};

/**
 * Récupère les voyages d'un ensemble d'agences (BSM dashboard).
 * Pas d'endpoint multi-agences en un appel → on itère.
 */
export const getTripsByAgencies = async (
  agencyIds: string[],
): Promise<Trip[]> => {
  if (!agencyIds || agencyIds.length === 0) return [];
  try {
    const allTrips: Trip[] = [];
    for (const agencyId of agencyIds) {
      try {
        const response = await axiosInstance.get<VoyagesPublicResponse>(
          `/voyage/agence/${agencyId}/public`,
          { params: { page: 0, size: 50 } },
        );
        if (response.status === 200 && response.data) {
          const data = response.data;
          const content: VoyagePreviewDTORaw[] = Array.isArray(data)
            ? data
            : (data.content ?? []);
          allTrips.push(...content.map((v) => mapVoyageToTrip(v, agencyId)));
        }
      } catch {
        // Agence sans voyages publics — on ignore et on continue
      }
    }
    return allTrips;
  } catch (err) {
    console.error("[bus-station-service] Erreur getTripsByAgencies :", err);
    return [];
  }
};

export const getAffiliationTaxes = async (
  stationId: string,
): Promise<AffiliationTax[]> => {
  try {
    const response = await axiosInstance.get<AffiliationRaw[]>(
      `/affiliation/gare/${stationId}`,
    );
    if (response.status === 200 && Array.isArray(response.data)) {
      return response.data.map(mapAffiliationToTax);
    }
    return [];
  } catch (err) {
    console.error("[bus-station-service] Erreur getAffiliationTaxes :", err);
    return [];
  }
};

export const getPoliciesAndTaxes = async (
  stationId: string,
): Promise<PolicyAndTax[]> => {
  const [taxes, politiques] = await Promise.all([
    (async (): Promise<PolicyAndTax[]> => {
      try {
        const r = await axiosInstance.get<TaxeAffiliationGareRaw>(
          `/taxe-affiliation/gare/${stationId}`,
        );
        if (r.status === 200 && r.data && Array.isArray(r.data.taxes)) {
          return r.data.taxes.map(mapTaxeToPolicyTax);
        }
      } catch {
        // pas de taxes → on continue
      }
      return [];
    })(),
    (async (): Promise<PolicyAndTax[]> => {
      try {
        const r = await axiosInstance.get<PolitiqueGareRaw[]>(
          `/politique-gare/gare/${stationId}`,
        );
        if (r.status === 200 && Array.isArray(r.data)) {
          return r.data.map(mapPolitiqueToPolicyTax);
        }
      } catch {
        // pas de politiques → on continue
      }
      return [];
    })(),
  ]);
  return [...politiques, ...taxes];
};

export const getBusStationManagerAccount = async (
  busStationId: string,
): Promise<BusStationManagerAccount> => {
  return {
    id: busStationId,
    busStationId,
    name: "",
    email: "",
    phone: "",
    role: "BUS_STATION_MANAGER",
    lastLogin: "",
  };
};
