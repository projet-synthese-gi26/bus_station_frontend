/**
 * tripPlannerSchema.ts
 * Schéma Zod complet pour le formulaire multi-étapes P-20.
 * Emplacement suggéré : src/lib/types/schema/tripPlannerSchema.ts
 */

import { z } from "zod";

// ── Amenities disponibles ─────────────────────────────────────────────────────

export const AMENITIES_LIST = [
  { value: "WIFI", label: "Wi-Fi", icon: "Wifi" },
  { value: "AC", label: "Climatisation", icon: "Wind" },
  { value: "USB", label: "Ports USB", icon: "Zap" },
  { value: "SNACKS", label: "Collations", icon: "Coffee" },
  { value: "BEVERAGES", label: "Boissons", icon: "Coffee" },
  { value: "POWER_OUTLETS", label: "Prises électriques", icon: "Plug" },
  { value: "ENTERTAINMENT", label: "Divertissement", icon: "Tv" },
  {
    value: "COMFORTABLE_SEATS",
    label: "Sièges confortables",
    icon: "Armchair",
  },
  { value: "RESTROOMS", label: "Toilettes à bord", icon: "Bath" },
  { value: "LUGGAGE_STORAGE", label: "Soute à bagages", icon: "Package" },
  { value: "CHILD_SEATS", label: "Sièges enfant", icon: "Baby" },
  { value: "PET_FRIENDLY", label: "Animaux acceptés", icon: "PawPrint" },
  { value: "MEAL_SERVICE", label: "Service repas", icon: "UtensilsCrossed" },
  { value: "SEAT_SELECTION", label: "Choix de siège", icon: "LayoutGrid" },
  { value: "GROUP_DISCOUNTS", label: "Réductions groupe", icon: "Users" },
] as const;

export type AmenityValue = (typeof AMENITIES_LIST)[number]["value"];

// ── Étape 1 : Itinéraire ──────────────────────────────────────────────────────

export const step1Schema = z.object({
  titre: z.string().min(3, "Titre requis (min. 3 caractères)"),
  description: z.string().optional(),
  lieuDepart: z.string().min(1, "Lieu de départ requis"),
  lieuArrive: z.string().min(1, "Lieu d'arrivée requis"),
  pointDeDepart: z.string().optional(),
  pointArrivee: z.string().optional(),
  dateDepartPrev: z.string().min(1, "Date de départ requise"),
  heureDepartEffectif: z.string().min(1, "Heure de départ requise"),
  heureArrive: z.string().optional(),
  dureeEstimee: z.string().optional(),
});

// ── Étape 2 : Planning & Limites ─────────────────────────────────────────────

export const step2Schema = z.object({
  nbrPlaceReservable: z
    .number({ invalid_type_error: "Nombre de places requis" })
    .int()
    .min(1, "Au moins 1 place"),
  prix: z
    .number({ invalid_type_error: "Prix requis" })
    .min(0, "Le prix ne peut pas être négatif"),
  dateLimiteReservation: z.string().optional(),
  dateLimiteConfirmation: z.string().optional(),
  smallImage: z.string().url("URL invalide").optional().or(z.literal("")),
  bigImage: z.string().url("URL invalide").optional().or(z.literal("")),
});

// ── Étape 3 : Ressources & Amenities ─────────────────────────────────────────

export const step3Schema = z.object({
  vehiculeId: z.string().optional(),
  chauffeurId: z.string().optional(),
  classVoyageId: z.string().optional(),
  amenities: z.array(z.string()).default([]),
});

// ── Schéma global (étapes fusionnées) ────────────────────────────────────────

export const tripPlannerSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema);

// On exporte les deux types : input (pour le resolver) et output (pour le form)
export type TripPlannerFormInput = z.input<typeof tripPlannerSchema>;
export type TripPlannerFormData = z.output<typeof tripPlannerSchema> & {
  amenities: string[]; // force string[] (jamais undefined grâce au .default([]))
};

// ── Valeurs par défaut ────────────────────────────────────────────────────────

export const tripPlannerDefaults: TripPlannerFormData = {
  titre: "",
  description: "",
  lieuDepart: "",
  lieuArrive: "",
  pointDeDepart: "",
  pointArrivee: "",
  dateDepartPrev: "",
  heureDepartEffectif: "",
  heureArrive: "",
  dureeEstimee: "",
  nbrPlaceReservable: 1,
  prix: 0,
  dateLimiteReservation: "",
  dateLimiteConfirmation: "",
  smallImage: "",
  bigImage: "",
  vehiculeId: "",
  chauffeurId: "",
  classVoyageId: "",
  amenities: [],
};

// ── Schémas par étape pour validation progressive ─────────────────────────────

export const stepSchemas = [step1Schema, step2Schema, step3Schema] as const;
export const STEP_TITLES = [
  "Itinéraire",
  "Planning & Limites",
  "Ressources",
  "Récapitulatif",
] as const;

export type StepIndex = 0 | 1 | 2 | 3;
