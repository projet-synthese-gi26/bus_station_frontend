import {
  FaBus,
  FaHistory,
  FaHome,
  FaStore,
  FaTicketAlt,
  FaTachometerAlt,
} from "react-icons/fa";
import { BsFillCalendarCheckFill, BsFillCalendarXFill } from "react-icons/bs";
import React from "react";
import { Customer } from "@/lib/types/models/BusinessActor";

export interface LinkItem {
  name: string;
  link?: string;
  icon: React.ElementType;
  subLinks?: LinkItem[];
  badge?: string;
  description?: string;
}

const baseLinks: LinkItem[] = [
  {
    name: "Market Place",
    link: "/market-place",
    icon: FaHome,
  },
  {
    name: "Agences",
    link: "/agency",
    icon: FaStore,
  },
  {
    name: "My reservations",
    link: "/my-reservations",
    icon: FaBus,
  },
  {
    name: "Coupons",
    link: "/coupons",
    icon: FaTicketAlt,
  },
  /* {
           name: "Statistics",
           link: "/statistics",
           icon: AiOutlineBarChart,
       },*/
  {
    name: "History",
    icon: FaHistory,
    subLinks: [
      {
        icon: BsFillCalendarCheckFill,
        name: "Reservation",
        link: "/history/reservation",
      },
      {
        icon: BsFillCalendarXFill,
        name: "Cancellation",
        link: "/history/cancellation",
      },
    ],
  },
];

// Fonction qui génère la liste complète de liens en fonction de l'utilisateur
export const getClientNavLinks = (user: Customer | null): LinkItem[] => {
  const allLinks = [...baseLinks];

  // Vérifier si l'utilisateur a le rôle d'agence
  if (user && user.role.includes("AGENCE_VOYAGE")) {
    const dashboardLink: LinkItem = {
      name: "Gérer mon agence",
      link: "/dashboard",
      icon: FaTachometerAlt,
      description: "Accéder au tableau de bord",
    };
    // Insérer le lien du tableau de bord au début de la liste
    allLinks.unshift(dashboardLink);
  }

  return allLinks;
};
