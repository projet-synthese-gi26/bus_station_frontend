import { z } from "zod";

export const driverFormSchema = z.object({
  // Champs pour la création d'un NOUVEL utilisateur
  first_name: z.string().min(2, "Le prénom est requis."),
  last_name: z.string().min(2, "Le nom de famille est requis."),
  username: z
    .string()
    .min(4, "Le nom d'utilisateur doit avoir au moins 4 caractères."),
  email: z.string().email("Veuillez entrer une adresse email valide."),
  phone_number: z.string().min(9, "Le numéro de téléphone est requis."),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères."),
  gender: z.enum(["MALE", "FEMALE"], {
    message: "Veuillez sélectionner un genre.",
  }),

  // Champs spécifiques au rôle de Chauffeur
  // Note: ces champs ne sont pas dans ChauffeurRequestDTO mais sont logiques à avoir
  //numeroPermis: z.string().min(5, "Le numéro de permis est requis."),
 /* dateExpirationPermis: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Veuillez entrer une date d'expiration valide.",
  }),*/
});

export type DriverFormType = z.infer<typeof driverFormSchema>;
