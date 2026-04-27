import { Gender } from "@/lib/types/common";

export type BusinessActorType = "PROVIDER" | "CONSUMER";

export interface BusinessActor {
  created_at: string;
  updated_at: string;
  deleted_at: string;
  created_by: string;
  updated_by: string;
  id: string;
  email: string; // Corrigé de "" à string
  friendly_name: string;
  secondary_email: string;
  date_of_birth: string;
  gender: Gender;
  country_code: string;
  dial_code: string;
  secondary_phone_number: string;
  avatar_picture: string;
  profile_picture: string;
  country_id: string;
  last_login_time: string;
  keywords: string[];
  registration_date: string;
  type: BusinessActorType;
  first_name: string;
  last_name: string;
  username: string;
  phone_number: string;
  age: number;
}

export interface Customer {
  userId: string;
  last_name: string;
  first_name: string;
  email: string;
  username: string;
  phone_number: string;
  role: string[];
  avatar?: string; // Ajout optionnel pour la photo de profil
  age: number;
}

// Renommé pour plus de clarté, car c'est la réponse du login
export interface LoginResponseDTO extends Customer {
  token: string;
}


