import {z} from 'zod';
import {passengerSchema} from "@/lib/types/schema/passengerReservationSchema";

export const reservationCreationSchema = z.object({
    nbrPassager: z.number(),
    montantPaye: z.number(),
    idUser: z.string().min(1, "id user is required"),
    idVoyage: z.string().min(1, "id trip is required"),
    passagerDTO: z.array(passengerSchema).min(1, "Au moins un passager requis")
});

export type ReservationCreationSchema = z.infer<typeof reservationCreationSchema>;