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
  /* "dureeVoyage": {
        "seconds": number,
        "zero": boolean,
        "nano": number,
        "negative": boolean,
        "units": [
            {
                "durationEstimated": boolean,
                "timeBased": boolean,
                "dateBased": boolean
            }
        ]
    },*/
  dureeVoyage: string;
  heureArrive: string;
  nbrPlaceReservable: number;
  nbrPlaceRestante: number;
  datePublication: string;
  dateLimiteReservation: string;
  dateLimiteConfirmation: string;
  statusVoyage: "PUBLIE" | "EN_COURS" | "EN_ATTENTE" | "TERMINE" | "ANNULE";
  smallImage: string;
  bigImage: string;
  nomClasseVoyage: string;
  prix: number;
  nomAgence: string;
  pointDeDepart: string;
  pointArrivee: string;
  vehicule: Vehicle;
  placeReservees: number[];
  amenities: Amenity[];
}

export interface TripDetails extends Trip {
  chauffeur: Customer;
}

export interface TripAxiosResponseInterface {
  content: Partial<Trip>[];
  empty: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: {
    offset: number;
    sort: SortInterface;
    scrollPosition: {
      initial: boolean;
      pagingState: string;
    };
    pageNumber: number;
    pageSize: number;
    pagingState: string;
    paged: boolean;
    unpaged: boolean;
  };
  size: number;
  sort: SortInterface;
  totalElements: number;
  totalPages: number;
}

/**
 * PlannerTrip — représente un créneau récurrent dans la grille hebdomadaire.
 *
 * BLOC 4 : `id` est désormais un UUID (string) car il représente un id_creneau backend.
 * Des champs optionnels ont été ajoutés pour transporter les données nécessaires
 * à la création/modification d'un créneau côté backend (lieu, ressources, etc.)
 * sans changer la signature publique des composants WeeklySchedule.
 */
export interface PlannerTrip {
  id: string;
  agencyId: string;
  title: string;
  dayOfWeek: number; // 1 for Monday, 7 for Sunday
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  category: string;
  description?: string;

  // -------- Bloc 4 — backend-related fields (optional in the front model) --------
  /** Id du planning parent (utile pour ajouter d'autres créneaux à la même ligne). */
  planningId?: string;
  lieuDepart?: string;
  lieuArrive?: string;
  pointDeDepart?: string;
  pointArrivee?: string;
  /** UUID de la classe voyage backend. */
  classVoyageId?: string;
  /** UUID du véhicule backend. */
  vehiculeId?: string;
  /** UUID du chauffeur backend (chauffeurs.id, pas user_id). */
  chauffeurId?: string;
  /** Nombre de places disponibles pour les voyages générés depuis ce créneau. */
  nbrPlaces?: number;
}
// END OF FILE: src/lib/types/models/Trip.ts
