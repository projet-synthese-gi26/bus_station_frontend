import { AxiosResponse } from "axios";
import {
  BusinessActor,
  Customer,
  LoginResponseDTO,
} from "@/lib/types/models/BusinessActor";
import { BusinessActorFormType } from "@/lib/types/schema/businessActorSchema";
import { LoginSchemaType } from "@/lib/types/schema/loginSchema";
import axiosInstance from "@/lib/services/axios-services/axiosInstance";

/**
 * Réponse brute du backend pour POST /auth/login
 * (alignée avec AuthTokensDTO côté backend)
 */
interface AuthTokensResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    userId: string;
    token: string | null;
    email: string;
    username: string;
    role: string[];
    last_name: string;
    first_name: string;
    phone_number: string;
  };
}

/**
 * Retire les champs qui n'existent pas dans le UserDTO du backend.
 * - confirmPassword : utilisé uniquement pour la validation Zod
 * - age : champ frontend non présent dans le backend (sera ignoré)
 */
function buildRegisterPayload(data: BusinessActorFormType) {
  const { confirmPassword: _confirmPassword, age: _age, ...payload } = data;
  return payload;
}

/**
 * POST /auth/register
 * Inscription d'un nouvel utilisateur (USAGER, AGENCE_VOYAGE, ...).
 * La réponse backend (UserResponseCreatedDTO) est presque identique à BusinessActor :
 * mêmes champs snake_case, plus quelques métadonnées en plus (created_at, etc.).
 */
export async function createBusinessActor(
  data: BusinessActorFormType,
): Promise<BusinessActor | null> {
  try {
    const payload = buildRegisterPayload(data);
    const apiResponse: AxiosResponse<BusinessActor> = await axiosInstance.post(
      "/auth/register",
      payload,
    );
    if (apiResponse.status === 201 || apiResponse.status === 200) {
      return apiResponse.data;
    }
    console.warn(
      "Code HTTP inattendu lors de l'inscription :",
      apiResponse.status,
    );
    return null;
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    throw error;
  }
}

/**
 * POST /auth/login
 * Connexion : retourne un objet enrichi (LoginResponseDTO = Customer + token).
 *
 * Mapping clé :
 *   backend.user                    → Customer (mêmes champs)
 *   backend.accessToken             → Customer.token
 *
 * Effets de bord : on ne stocke PAS encore le token ici, c'est le Provider
 * (saveAuthParams) qui s'en occupe. On stocke en revanche le refreshToken
 * et l'expiresIn pour permettre le refresh ultérieurement.
 */
export async function loginBusinessActor(
  data: LoginSchemaType,
): Promise<LoginResponseDTO | null> {
  try {
    const apiResponse: AxiosResponse<AuthTokensResponse> =
      await axiosInstance.post("/auth/login", data);
    if (apiResponse.status !== 200) {
      console.warn(
        "Code HTTP inattendu lors de la connexion :",
        apiResponse.status,
      );
      return null;
    }

    const { accessToken, refreshToken, expiresIn, user } = apiResponse.data;

    // Stockage anticipé du refresh token (le Provider stocke déjà l'access token via saveAuthParams)
    if (typeof window !== "undefined") {
      localStorage.setItem("bus_station_refresh_token", refreshToken);
      const expirationDate = new Date(
        Date.now() + expiresIn * 1000,
      ).toISOString();
      localStorage.setItem("bus_station_token_expirationDate", expirationDate);
    }

    // On reconstitue un LoginResponseDTO (= Customer + token) attendu par l'appelant.
    const loginResponse: LoginResponseDTO = {
      userId: user.userId,
      email: user.email,
      username: user.username,
      role: user.role,
      last_name: user.last_name,
      first_name: user.first_name,
      phone_number: user.phone_number,
      token: accessToken,
      // age n'est pas renvoyé par le backend ; le code consommateur tolère undefined
      age: undefined as unknown as number,
    };

    return loginResponse;
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    throw error;
  }
}

/**
 * GET /auth/me
 * Récupère le profil de l'utilisateur courant. Le token Bearer est injecté
 * automatiquement par l'auth-interceptor.
 */
export async function getConnectedUser(
  token: string,
): Promise<Customer | null> {
  if (!token) return null;

  try {
    const apiResponse: AxiosResponse<Customer> =
      await axiosInstance.get("/auth/me");
    if (apiResponse.status === 200) {
      return apiResponse.data;
    }
    console.warn("Code HTTP inattendu sur /auth/me :", apiResponse.status);
    return null;
  } catch (error) {
    console.error("Erreur lors de la récupération du profil :", error);
    throw error;
  }
}
