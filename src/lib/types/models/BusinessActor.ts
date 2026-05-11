import { Gender } from "@/lib/types/common";

export type BusinessActorType = "PROVIDER" | "CONSUMER";

export interface BusinessActor {
  created_at: string;
  updated_at: string;
  deleted_at: string;
  created_by: string;
  updated_by: string;
  id: string;
  email: string;
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
  avatar?: string;
  age?: number;
}

// Gardé pour compatibilité avec l'ancien endpoint (ne plus utiliser)
export interface LoginResponseDTO extends Customer {
  token: string;
}

// Réponse du nouveau POST /auth/login
export interface AuthTokensDTO {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    userId: string;
    token: string;
    email: string;
    username: string;
    role: string[];
    last_name: string;
    first_name: string;
    phone_number: string;
  };
}

export interface LoginResponseDTO extends Customer {
  token: string;
}