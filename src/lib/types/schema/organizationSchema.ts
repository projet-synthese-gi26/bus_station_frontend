import { z } from "zod";


export const baseOrganizationSchema = z.object({
    long_name: z.string().min(1, "The Name of the organization is required"),
    ceo_name: z.string().min(1, "The Name of CEO is required"),
    email: z.string().min(1,"The Email of organization is required").email("Enter a valid email"),
    description: z.string().min(1, "The Short description of the organization is required"),
    short_name: z.string().min(1, "The Short name is required").optional(),
    year_founded: z.string().min(1, "The year of foundation is required"),
    business_registration_number: z.string().min(1, "The Organization registration number is required"),
    tax_number: z.string().min(1, "The Tax number of the organization is required"),
    type: z.enum(["SOLE_PROPRIETORSHIP", "CORPORATION", "PARTNERSHIP", "LLC", "NONPROFIT"])
        .refine((val) => !!val, {
            message: "The type of organization is required.",
        }),
    business_domains: z.array(z.string()).optional(),
    web_site_url: z.string().url("Enter a valid URL").optional().or(z.literal("")),
}).superRefine((data) => {
    if (!data.short_name) {
        data.short_name = data.long_name;
    }
    if(!data.business_domains)
    {
        data.business_domains = [process.env.NEXT_PUBLIC_AGENCY_BUSINESS_DOMAIN_ID as string];
    }
    if (data.year_founded) {
        data.year_founded = `${data.year_founded}T00:00:00.000Z`;
    }
});

export type OrganizationFormType = z.infer<typeof baseOrganizationSchema>;



