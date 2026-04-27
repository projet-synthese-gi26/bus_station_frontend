// src/lib/types/schema/classVoyageSchema.ts
import { z } from "zod";

export const classVoyageSchema = z.object({
    nom: z.string().min(3, "Le nom de la classe est requis (ex: VIP, Classique)."),
    prix: z.coerce.number({ invalid_type_error: "Le prix doit être un nombre."}).positive("Le prix doit être positif."),
    tauxAnnulation: z.coerce.number({ invalid_type_error: "Le taux doit être un nombre."}).min(0, "Le taux ne peut être négatif.").max(100, "Le taux ne peut dépasser 100."),
});

export type ClassVoyageFormType = z.infer<typeof classVoyageSchema>;