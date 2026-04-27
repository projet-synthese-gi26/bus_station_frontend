export type OrganizationType = "SOLE_PROPRIETORSHIP" | "CORPORATION" | "PARTNERSHIP" | "LLC" | "NONPROFIT";



export interface Organization  {
    "created_at": string,
    "updated_at": string,
    "deleted_at": string,
    "created_by": string,
    "updated_by": string,
    "organization_id": string,
    "business_domains": [string],
    "email": string,
    "short_name": string,
    "long_name": string,
    "description": string,
    "logo_url": string,
    "is_individual_business": boolean,
    "type":OrganizationType,
    "is_active": boolean,
    "website_url": string,
    "social_network": string,
    "business_registration_number": string,
    "tax_number": string,
    "capital_share": number,
    "registration_date": string,
    "ceo_name": string,
    "year_founded": string,
    "keywords": [string],
    "status": string
}