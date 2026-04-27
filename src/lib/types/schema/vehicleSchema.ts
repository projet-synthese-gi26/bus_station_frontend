/*import { z } from "zod";

// Schéma pour le formulaire de création/modification de véhicule
export const vehicleFormSchema = z.object({
  nom: z.string().min(3, "Le nom du véhicule est requis (ex: Bus VIP 01)."),
  modele: z.string().min(2, "Le modèle est requis (ex: Coaster)."),
  plaqueMatricule: z
    .string()
    .min(5, "La plaque d'immatriculation est requise."),
  nbrPlaces: z.coerce
    .number()
    .int()
    .positive("Le nombre de places doit être supérieur à 0."),
  description: z.string().optional(),
  lienPhoto: z
    .string()
    .url("Veuillez entrer une URL d'image valide.")
    .optional()
    .or(z.literal("")),
});

export type VehicleFormType = z.infer<typeof vehicleFormSchema>;
*/

// src/lib/types/schema/vehicleSchema.ts
import { z } from "zod";

export const vehicleFormSchema = z.object({
  nom: z.string().min(3, "Le nom du véhicule est requis (au moins 3 caractères)."),
  modele: z.string().min(2, "Le modèle est requis."),
  plaqueMatricule: z
      .string()
      .min(5, "La plaque d'immatriculation est requise."),
  nbrPlaces: z.coerce // Utilise coerce pour convertir la chaîne de l'input en nombre
      .number({ invalid_type_error: "Le nombre de places doit être un chiffre." })
      .int()
      .positive("Le nombre de places doit être supérieur à 0."),
  description: z.string().optional(),
  lienPhoto: z.string().url("Veuillez entrer une URL valide.").optional().or(z.literal("")),
});

export type VehicleFormType = z.infer<typeof vehicleFormSchema>;