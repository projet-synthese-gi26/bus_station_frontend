// src/lib/types/models/Agency.ts
/**
 * TravelAgency — type de l'agence utilisé par les anciens composants.
 * Les champs mock (rating, specialties, contact) sont rendus optionnels
 * pour ne pas casser les composants qui les utilisent encore.
 * Les nouvelles pages utilisent AgenceVoyageFull (agence.types.ts).
 */

export interface ContactInfo {
  phone: string;
  email: string;
  website: string;
}

export interface TravelAgency {
  agencyId: string;
  organisationId?: string;
  userId?: string;
  longName?: string;
  shortName?: string;
  location?: string;
  socialNetwork?: string;
  description?: string;
  greetingMessage?: string;
  logoUrl?: string;

  // Champs optionnels (anciens mock — conservés pour compatibilité)
  rating?: number;
  specialties?: string[];
  contact?: ContactInfo;
  gareIds?: string[];
  id?: string;
}
