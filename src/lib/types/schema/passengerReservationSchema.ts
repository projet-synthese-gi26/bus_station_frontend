import { z } from "zod";

const allowedGenders = ["Male", "Female"] as const;
export const passengerSchema = z.object({
    nom: z.string().min(2, "Le nom complet est requis"),
    genre: z.enum(allowedGenders, {
        errorMap: () => ({ message: "Veuillez sélectionner un genre" }),
    }),
    age: z.coerce.number(
        {
            errorMap: (issue, ctx) => {
                if (issue.code === z.ZodIssueCode.invalid_type) {
                    return { message: "Vous devez entrer un nombre pour l'âge" };
                }
                return { message: ctx.defaultError };
            }
        })
        .min(1, "L'âge doit être supérieur à 0")
        .max(120, "L'âge doit être réaliste"),
    nbrBaggage: z.coerce.number(
        {
            errorMap: (issue, ctx) => {
                if (issue.code === z.ZodIssueCode.invalid_type) {
                    return { message: "Vous devez entrer un nombre pour les bagages" };
                }
                return { message: ctx.defaultError };
            }
        })
        .min(0, "Le nombre de bagages ne peut pas être négatif")
        .max(4, "Maximum 4 bagages autorisés"),
    numeroPieceIdentific: z.string().min(9, "Le numéro de pièce d'identité est requis et doit contenir au moins 9 caractères"),
    placeChoisis: z.number(),
});


export const passengersArraySchema = z.object({
    passengers: z.array(passengerSchema).min(1, "Au moins un passager requis")
});


export type PassengerFormType = z.infer<typeof passengerSchema>;
export type PassengersArrayFormType = z.infer<typeof passengersArraySchema>;