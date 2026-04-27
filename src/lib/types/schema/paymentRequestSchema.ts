import {z} from 'zod';


export const paymentRequestSchema = z.object(
    {
        mobilePhone: z.string().length(9, "le numero de telephone doit avoir 9 chiffres").regex(/^[0-9]+$/ , "entrez un numero valide"),
        mobilePhoneName: z.string().min(2, "entrez un nom valide"),
        amount: z.coerce.number({
                errorMap: (issue, ctx) => {
                        if (issue.code === z.ZodIssueCode.invalid_type) {
                                return { message: "Vous devez entrer un montant valide" };
                        }
                        return { message: ctx.defaultError };
                }})
        .min(50, "Le montant minimum est de 50 FCFA"),
        userId:  z.string(),
        reservationId: z.string()
    }
);



export type PaymentRequestFormType = z.infer<typeof paymentRequestSchema>;