import {
  FaBus,
  FaHistory,
  FaHome,
  FaStore,
  FaTicketAlt,
  FaMapMarkedAlt,
} from "react-icons/fa";
import { BsFillCalendarCheckFill, BsFillCalendarXFill } from "react-icons/bs";
import React from "react";

export interface LinkItem {
  name: string;
  link?: string;
  icon: React.ElementType;
  subLinks?: LinkItem[];
  badge?: string;
  description?: string;
}

export const linkList = [
  {
    name: "Market Place",
    link: "/market-place",
    icon: FaHome,
  },
  {
    name: "Gares Routières",
    link: "/gares-routieres",
    icon: FaMapMarkedAlt,
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
