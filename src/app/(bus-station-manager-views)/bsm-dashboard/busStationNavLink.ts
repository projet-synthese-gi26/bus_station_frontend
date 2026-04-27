import {
  LayoutDashboard,
  Building2,
  Store,
  Scale,
  ShieldAlert,
  Settings,
} from "lucide-react";
import { TFunction } from "i18next";

interface NavLink {
  href: string;
  icon: React.ElementType;
  label: string;
  description?: string;
  badge?: string;
}

export const getBusStationNavLinks = (t: TFunction): { menuItems: NavLink[]; secondaryMenuItems: NavLink[] } => {
  const menuItems: NavLink[] = [
    {
      href: "/bsm-dashboard",
      icon: LayoutDashboard,
      label: t("bsm-dashboard.sidebar.overview"),
      description: "Vision globale : Statut de la gare, KPIs d'affluence, Alertes critiques.",
    },
    {
      href: "/bsm-dashboard/infrastructure",
      icon: Building2,
      label: t("bsm-dashboard.sidebar.infrastructure"),
      description: "Gestion de l'entité numérique : Profil, GPS, Superficie, Capacité.",
    },
    {
      href: "/bsm-dashboard/affiliated-agencies",
      icon: Store,
      label: t("bsm-dashboard.sidebar.affiliated-agencies"),
      description: "Liste des locataires, Statut des contrats, Historique des présences.",
    },
    {
      href: "/bsm-dashboard/policies-taxes",
      icon: Scale,
      label: t("bsm-dashboard.sidebar.policies-taxes"),
      description: "Cœur du réacteur : Configuration des taxes, Règlements intérieurs, T&C.",
    },

  ];

  const secondaryMenuItems: NavLink[] = [
    {
      href: "/bsm-dashboard/settings",
      icon: Settings,
      label: t("bsm-dashboard.sidebar.settings"),
      description: "Gestion du compte administrateur.",
    },
  ];

  return { menuItems, secondaryMenuItems };
};

