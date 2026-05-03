import axios, { AxiosResponse } from "axios";
import apiClient from "@/lib/api/api-client";
import { API_BASE_URL } from "@/lib/config/api.config";
import {
  BusinessActor,
  Customer,
  LoginResponseDTO,
} from "@/lib/types/models/BusinessActor";
import { BusinessActorFormType } from "@/lib/types/schema/businessActorSchema";
import { LoginSchemaType } from "@/lib/types/schema/loginSchema";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Retire les champs inexistants dans UserDTO backend
 * (confirmPassword, age) avant d'envoyer la requête.
 */
function stripRegisterPayload(data: BusinessActorFormType) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { confirmPassword, age, ...rest } = data;
  return rest;
}

// ─── Register ────────────────────────────────────────────────────────────────

/**
 * POST /auth/register
 * Payload : UserDTO (snake_case)
 * Réponse : UserResponseCreatedDTO — 201 Created
 */
export async function createBusinessActor(
  data: BusinessActorFormType,
): Promise<BusinessActor | null> {
  try {
    const payload = stripRegisterPayload(data);
    const apiResponse: AxiosResponse<BusinessActor> = await axios.post(
      `${API_BASE_URL}/auth/register`,
      payload,
      { headers: { "Content-Type": "application/json" } },
    );
    if (apiResponse.status === 201 || apiResponse.status === 200) {
      return apiResponse.data;
    }
    return null;
  } catch (error) {
    console.error("Erreur inscription :", error);
    throw error;
  }
}

// ─── Login ───────────────────────────────────────────────────────────────────

/**
 * POST /auth/login
 * Payload : AuthentificationDTO { username, password }
 * Réponse : AuthTokensDTO { accessToken, refreshToken, expiresIn, user }
 *
 * ⚠️ On utilise axios brut (pas apiClient) pour éviter que l'intercepteur
 *    injecte un vieux token expiré sur la requête de connexion.
 */
export async function loginBusinessActor(
  data: LoginSchemaType,
): Promise<LoginResponseDTO | null> {
  const apiResponse = await axios.post(
    `${API_BASE_URL}/auth/login`,
    { username: data.username, password: data.password },
    { headers: { "Content-Type": "application/json" } },
  );

  const { accessToken, refreshToken, user } = apiResponse.data;

  if (typeof window !== "undefined") {
    localStorage.setItem("bus_station_refresh_token", refreshToken);
  }

  return {
    userId: user.userId,
    // Le backend retourne parfois camelCase, parfois snake_case selon le mapper
    first_name: user.firstName ?? user.first_name ?? "",
    last_name: user.lastName ?? user.last_name ?? "",
    email: user.email,
    username: user.username,
    phone_number: user.phoneNumber ?? user.phone_number ?? "",
    role: user.role ?? [],
    token: accessToken,
  } as LoginResponseDTO;
}

// ─── GET /auth/me ────────────────────────────────────────────────────────────

/**
 * GET /auth/me
 * Requiert : Authorization: Bearer <accessToken>
 * Réponse : UserResponseDTO
 */
export async function getConnectedUser(
  token: string,
): Promise<Customer | null> {
  if (!token) return null;
  try {
    const apiResponse: AxiosResponse<Customer> =
      await apiClient.get("/auth/me");
    if (apiResponse.status === 200) return apiResponse.data;
    return null;
  } catch (error) {
    console.error("Erreur récupération utilisateur connecté :", error);
    return null;
  }
}

// ─── PUT /auth/me ────────────────────────────────────────────────────────────

/**
 * PUT /auth/me
 * Payload : UserDTO partiel (uniquement les champs à modifier)
 * Réponse : UserResponseDTO — 200 OK
 * Requiert : Authorization: Bearer <accessToken>
 */
export async function updateUserProfile(
  fields: Partial<{
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    gender: "MALE" | "FEMALE";
  }>,
): Promise<Customer> {
  const apiResponse: AxiosResponse<Customer> = await apiClient.put(
    "/auth/me",
    fields,
  );
  return apiResponse.data;
}

// ─── PUT /auth/me/password ───────────────────────────────────────────────────

/**
 * PUT /auth/me/password
 * Payload : ChangePasswordRequestDTO { oldPassword, newPassword }
 * Réponse : 204 No Content
 * Requiert : Authorization: Bearer <accessToken>
 * Lance une erreur 401 si l'ancien mot de passe est incorrect.
 */
export async function changePassword(
  oldPassword: string,
  newPassword: string,
): Promise<void> {
  await apiClient.put("/auth/me/password", { oldPassword, newPassword });
}

// ─── POST /auth/forgot-password ──────────────────────────────────────────────

/**
 * POST /auth/forgot-password
 * Payload : ForgotPasswordRequestDTO { email }
 * Réponse : { message: string, token?: string (DEV uniquement) }
 * Public — pas de token requis.
 */
export async function forgotPassword(
  email: string,
): Promise<{ message: string; token?: string }> {
  const apiResponse = await axios.post(
    `${API_BASE_URL}/auth/forgot-password`,
    { email },
    { headers: { "Content-Type": "application/json" } },
  );
  return apiResponse.data;
}

// ─── POST /auth/reset-password ───────────────────────────────────────────────

/**
 * POST /auth/reset-password
 * Payload : ResetPasswordRequestDTO { token, newPassword }
 * Réponse : 200 OK
 * Public — pas de token JWT requis.
 */
export async function resetPassword(
  token: string,
  newPassword: string,
): Promise<void> {
  await axios.post(
    `${API_BASE_URL}/auth/reset-password`,
    { token, newPassword },
    { headers: { "Content-Type": "application/json" } },
  );
}
