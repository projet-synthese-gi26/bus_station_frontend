import React, { JSX } from "react";
import { Variants } from "framer-motion";
import { UseFormRegisterReturn } from "react-hook-form";
import { ReservationDetails } from "@/lib/types/models/Reservation";
import { TravelAgency } from "@/lib/types/models/Agency";
import { Trip } from "@/lib/types/models/Trip";

export interface AgencyProfileProps {
  agency: TravelAgency;
  trips: Trip[];
  onBack: () => void;
  agencyId: string;
}

export interface LinkListProps {
  name: string;
  link: string;
}


export interface SocialLinkProps {
  href: string;
  icon: JSX.ElementType;
  color: string;
}

export interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  variants: Variants;
}

export type InputFieldProps = {
  id: string;
  name?: string;
  label: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
  required?: boolean;
  toggleVisibility?: boolean;
  register?: UseFormRegisterReturn;
  error?: string;
};

export interface TextareaFieldProps {
  id: string;
  name?: string;
  label: string;
  placeholder?: string;
  rows?: number;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  icon?: React.ReactNode;
  required?: boolean;
  register?: UseFormRegisterReturn;
  error?: string;
}

export interface UserAccountTypeProps {
  createAgency: boolean;
  setCreateAgencyAction: (param: boolean) => void;
}

export interface AccountTypeCardProps {
  selected: boolean;
  onSelect: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
}

export interface TeamMemberProps {
  name: string;
  role: string;
  description: string;
  imageUrl: string;
  github?: string;
  linkedin?: string;
  email?: string;
}

// export interface TravelAgency {
//   id: string;
//   name: string;
//   logo: string;
//   location: string;
//   rating: number;
//   description: string;
//   specialties: string[];
//   contact: {
//     email: string;
//     phone: string;
//     website: string;
//   };
// }

// export interface Trip {
//   id: string;
//   agencyId: string;
//   title: string;
//   destination: string;
//   departureDate: string;
//   returnDate: string;
//   price: number;
//   image: string;
//   description: string;
//   included: string[];
//   rating: number;
// }

export interface AgencySidebarProps {
  agencies: TravelAgency[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onSelectAgency: (id: string) => void;
  selectedAgencyId: string | null;
}

export interface AgencyProfileProps {
  agency: TravelAgency;
  trips: Trip[];
  onBack: () => void;
}

export interface TripCardProps {
  trip: Trip;
  index: number;
}

export interface GridCardTripProps {
  reservationDetails: ReservationDetails;
  onPayment: () => void;
  onCancel: () => void;
  onViewDetails: () => void;
}
