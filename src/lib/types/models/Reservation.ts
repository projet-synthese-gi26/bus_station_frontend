import {Trip} from "@/lib/types/models/Trip";
import {TravelAgency} from "@/lib/types/models/Agency";

export interface Reservation {
    idReservation: string;
    dateReservation: string;
    dateConfirmation: string;
    nbrPassager: number;
    prixTotal: number;
    statutReservation: "RESERVER" | "ANNULEE" | "CONFIRMEE" | string;
    idUser: string;
    idVoyage: string;
    statutPayement: "PENDING" | "PAID" | "FAILED" | string;
    transactionCode: string;
    montantPaye: number;
}

export interface ReservationDetails {
    reservation: Reservation;
    voyage: Trip;
    agence: TravelAgency;
}