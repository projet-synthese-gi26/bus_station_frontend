// src/lib/types/dashboard.ts
//
// Types utilisés par les anciennes pages dashboard (subscription, resources, feedback, overview).
// Fichier introduit pour combler les imports legacy `@/lib/types/dashboard`.
// À terme, ces types devraient être migrés vers les types centralisés (voyage.types, agence.types, etc.)

import type { ElementType } from "react";

/**
 * Plan d'abonnement affiché sur la page /dashboard/subscription
 */
export interface SubscriptionPlan {
  id?: string;
  name: string;
  price: string;
  features: string[];
  isCurrent?: boolean;
  isPopular?: boolean;
  description?: string;
}

/**
 * Item de l'historique de facturation (page /dashboard/subscription)
 */
export interface BillingHistoryItem {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "failed" | "refunded";
}

/**
 * Carte de statistique affichée sur le dashboard d'agence (overview).
 * Doit matcher les props attendues par <StatCard /> :
 * label, value, change, changeType, icon (composant Lucide), gradient.
 */
export interface StatCardData {
  label: string;
  value: string;
  currency?: string;
  change: string;
  changeType: "increase" | "decrease";
  icon: ElementType;
  gradient: string;
}

/**
 * Item de feedback / avis client affiché sur /dashboard/feedback
 */
export interface Feedback {
  id: string;
  customerName: string;
  tripName: string;
  rating: number;
  comment: string;
  date: string;
  agencyResponse?: string;
}

/**
 * Onglet de la page Resources (véhicules, chauffeurs, employés, classes).
 * Représenté comme une union de strings — l'état activeTab stocke directement
 * l'identifiant de l'onglet actif.
 */
export type ResourceTab = "vehicles" | "drivers" | "employees" | "classes";

/**
 * Réservation récente affichée sur le dashboard
 */
export interface RecentBooking {
  id: string;
  customerName: string;
  tripTitle: string;
  date: string;
  amount: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
}

/**
 * Données de graphique d'overview (revenus, voyages, etc.)
 */
export interface OverviewChartData {
  label: string;
  value: number;
  date?: string;
}
