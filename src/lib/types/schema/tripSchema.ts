// src/lib/types/schema/tripSchema.ts
import { z } from "zod";
const allowedAmenities = ['WIFI' , 'AC' , 'USB' , 'SNACKS' , 'BEVERAGES' , 'POWER_OUTLETS' , 'ENTERTAINMENT' , 'COMFORTABLE_SEATS' , 'RESTROOMS' , 'LUGGAGE_STORAGE' , 'CHILD_SEATS' , 'PET_FRIENDLY' , 'AIRPORT_PICKUP' , 'AIRPORT_DROP_OFF' , 'MEAL_SERVICE' , 'ONBOARD_GUIDE' , 'SEAT_SELECTION' , 'GROUP_DISCOUNTS' , 'LATE_CHECK_IN' , 'LATE_CHECK_OUT'] as const;

export const tripPlannerSchema = z.object({
  titre: z.string().min(5, "Le titre doit avoir au moins 5 caractères."),
  description: z.string().min(10, "La description est requise (au moins 10 caractères)."),

  lieuDepart: z.string().min(2, "Le lieu de départ est requis."),
  pointDeDepart: z.string().min(2, "Le point de départ précis est requis."),
  lieuArrive: z.string().min(2, "Le lieu d'arrivée est requis."),
  pointArrivee: z.string().min(2, "Le point d'arrivée précis est requis."),

  dateDepartPrev: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Veuillez entrer une date de départ valide.",
  }),
  heureDepartEffectif: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Format d'heure invalide (HH:MM)."),

  // Le formulaire prend une heure, mais nous la convertirons en date-time ISO pour l'API
  heureArrive: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Format d'heure invalide (HH:MM)."),

  dateLimiteReservation: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Veuillez entrer une date limite de réservation valide.",
  }),
  dateLimiteConfirmation: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Veuillez entrer une date limite de confirmation valide.",
  }),

 // prix: z.coerce.number({invalid_type_error: "Le prix doit être un nombre."}).positive("Le prix doit être positif."),
  nbrPlaceReservable: z.coerce.number({invalid_type_error: "Entrez un nombre."}).int().positive("Le nombre de places doit être supérieur à 0."),

  vehiculeId: z.string().min(16, "Veuillez sélectionner un véhicule."),
  chauffeurId: z.string().min(16,"Veuillez sélectionner un chauffeur."),
  classVoyageId: z.string().min(16,"Veuillez sélectionner une classe de voyage."),

  agenceVoyageId: z.string(), // Champ caché

  amenities: z.array(z.enum(allowedAmenities)).optional(),
  smallImage: z.string().url("URL invalide").optional().or(z.literal("")),
  bigImage: z.string().url("URL invalide").optional().or(z.literal("")),
});

export type TripPlannerFormType = z.infer<typeof tripPlannerSchema>;

