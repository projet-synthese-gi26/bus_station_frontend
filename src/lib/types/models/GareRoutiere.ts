// src/lib/types/models/GareRoutiere.ts
/**
 * GareRoutiere — type legacy conservé pour les composants existants.
 * Les nouvelles pages utilisent Gare (gare.types.ts) qui a latitude/longitude directs.
 * Ce type maintient la compatibilité avec le code existant qui utilise localisation.latitude.
 */
export interface GareRoutiere {
  id: string;
  nom: string;
  ville: string;
  quartier: string;
  adresse: string;
  localisation: {
    latitude: number;
    longitude: number;
  };
  description: string;
  imageUrl: string;
  services: string[];
  nbAgencesAffiliees: number;
  estOuvert: boolean;
  horaires?: string;
}
