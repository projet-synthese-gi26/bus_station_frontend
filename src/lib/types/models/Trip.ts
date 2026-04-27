// src/lib/types/models/Trip.ts
import { Vehicle } from "@/lib/types/models/vehicle";
import { SortInterface } from "@/lib/types/common";
import { Customer } from "@/lib/types/models/BusinessActor";
import { Amenity } from "@/lib/types/generated-api/models/VoyageCreateRequestDTO";

export type Amenities = "WiFi" | "AC" | "USB" | "Snacks" | "Meals";

export interface Trip {
  idVoyage: string;
  titre: string;
  description: string;
  dateDepartPrev: string;
  lieuDepart: string;
  dateDepartEffectif: string;
  dateArriveEffectif: string;
  lieuArrive: string;
  heureDepartEffectif: string;
  heureArrive?: string;
  dureeVoyage?: any;
  pointDeDepart?: string;
  pointArrivee?: string;
  nbrPlaceReservable?: number;
  nbrPlaceReserve?: number;
  nbrPlaceConfirm?: number;
  nbrPlaceRestante?: number;
  datePublication?: string;
  dateLimiteReservation?: string;
  dateLimiteConfirmation?: string;
  statusVoyage?: string;
  smallImage?: string;
  bigImage?: string;
  amenities?: Amenity[];
  vehicule?: Vehicle;
  chauffeur?: Customer;
  // Champs dénormalisés utilisés par les anciens composants (marketplace, dashboard)
  nomAgence?: string;
  logoAgence?: string;
  nomClasseVoyage?: string;
  prix?: number;
}

export interface TripPreview {
  idVoyage: string;
  agenceVoyageId?: string;
  nomAgence?: string;
  logoAgence?: string;
  titre?: string;
  description?: string;
  lieuDepart?: string;
  lieuArrive?: string;
  heureDepartEffectif?: string;
  dateDepartPrev?: string;
  nbrPlaceRestante?: number;
  nbrPlaceReservable?: number;
  prix?: number;
  nomClasseVoyage?: string;
  smallImage?: string;
  dureeVoyage?: any;
  amenities?: Amenity[];
  statusVoyage?: string;
}

/**
 * TripDetails — alias de Trip pour rétrocompatibilité avec les anciens services/hooks.
 * Les nouveaux composants doivent utiliser VoyageDetailsDTO (generated-api).
 */
export type TripDetails = Trip;

/**
 * TripAxiosResponseInterface — structure de réponse paginée legacy.
 * Utilisée par trip-service.ts pour l'endpoint GET /voyage/all (ancien backend).
 */
export interface TripAxiosResponseInterface {
  content: Trip[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// Ré-export de SortInterface pour éviter le conflit de déclaration locale
// (Trip.ts redéclarait SortInterface alors qu'il est déjà dans common.ts)
export type { SortInterface };

/**
 * PlannerTrip — type legacy utilisé par AddTripModal et les anciens composants WeeklySchedule.
 * id est number pour rétrocompatibilité.
 * Les nouvelles pages utilisent LigneService (ligne-service.types.ts).
 */
export interface PlannerTrip {
  id: number;
  agencyId: string;
  title: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  category: string;
}
