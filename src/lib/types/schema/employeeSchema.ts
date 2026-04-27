// src/lib/types/schema/employeeSchema.ts
import { z } from "zod";

export const employeeFormSchema = z.object({
    // Champs pour l'utilisateur
    first_name: z.string().min(2, "Le prénom est requis."),
    last_name: z.string().min(2, "Le nom de famille est requis."),
    username: z.string().min(4, "Le nom d'utilisateur doit avoir au moins 4 caractères."),
    email: z.string().email("Veuillez entrer une adresse email valide."),
    phone_number: z.string().min(9, "Le numéro de téléphone est requis."),
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères."),
    confirmPassword: z.string(),
    gender: z.enum(["MALE", "FEMALE"], { required_error: "Veuillez sélectionner un genre." }),

    // Champs spécifiques à l'employé
    poste: z.string().min(2, "Le poste de l'employé est requis."),
    departement: z.string().min(2, "Le département est requis."),
    salaire: z.coerce.number().positive("Le salaire doit être un nombre positif."),
    managerId: z.string().uuid("L'ID du manager doit être un UUID valide.").optional().or(z.literal('')), // Optionnel si l'employé n'a pas de manager

}).refine(data => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
});

export type EmployeeFormType = z.infer<typeof employeeFormSchema>;