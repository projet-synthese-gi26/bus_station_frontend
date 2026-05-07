import { AxiosResponse } from "axios";
import axiosInstance from "@/lib/services/axios-services/axiosInstance";
import { Customer } from "@/lib/types/models/BusinessActor";

/* ============================================================================
 * AUTH SERVICE — Endpoints additionnels du Bloc 1 Authentification
 * (forgot-password, reset-password, refresh, logout, change-password, updateMe)
 *
 * Les endpoints de base (register, login, me) restent dans businessActor-service.ts
 * pour conserver la compatibilité avec le Provider et les hooks existants.
 * ============================================================================
 */

/* -------------------------- FORGOT / RESET PASSWORD ----------------------- */

export interface ForgotPasswordResponse {
  message: string;
  /** Présent uniquement en environnement DEV — facilite les tests sans email */
  debugToken?: string;
}

/**
 * POST /auth/forgot-password
 * Demande un email de réinitialisation. Retourne toujours un message générique
 * pour éviter l'énumération d'emails.
 */
export async function forgotPassword(
  email: string,
): Promise<ForgotPasswordResponse> {
  const response: AxiosResponse<ForgotPasswordResponse> =
    await axiosInstance.post("/auth/forgot-password", { email });
  return response.data;
}

/**
 * POST /auth/reset-password
 * Finalise le changement avec le token reçu par email (ou le debugToken en DEV).
 * Backend renvoie 204 No Content en cas de succès.
 */
export async function resetPassword(
  token: string,
  newPassword: string,
): Promise<void> {
  await axiosInstance.post("/auth/reset-password", { token, newPassword });
}

/* ------------------------------- REFRESH ---------------------------------- */

export interface RefreshTokensResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: Customer;
}

/**
 * POST /auth/refresh
 * Régénère un access token à partir d'un refresh token valide.
 */
export async function refreshAccessToken(
  refreshToken: string,
): Promise<RefreshTokensResponse> {
  const response: AxiosResponse<RefreshTokensResponse> =
    await axiosInstance.post("/auth/refresh", { refreshToken });
  return response.data;
}

/* -------------------------------- LOGOUT ---------------------------------- */

/**
 * POST /auth/logout
 * Blackliste l'access token courant + révoque le refresh token côté serveur.
 * Le frontend doit ensuite nettoyer son localStorage (responsabilité du Provider).
 */
export async function logoutBackend(refreshToken?: string): Promise<void> {
  await axiosInstance.post(
    "/auth/logout",
    refreshToken ? { refreshToken } : undefined,
  );
}

/* -------------------------- CHANGE PASSWORD (auth) ------------------------ */

/**
 * PUT /auth/me/password
 * Changement du mot de passe (utilisateur connecté).
 */
export async function changeOwnPassword(
  oldPassword: string,
  newPassword: string,
): Promise<void> {
  await axiosInstance.put("/auth/me/password", { oldPassword, newPassword });
}

/* -------------------------------- UPDATE ME ------------------------------- */

export interface UpdateMePayload {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
}

/**
 * PUT /auth/me
 * Met à jour le profil de l'utilisateur connecté.
 */
export async function updateMe(payload: UpdateMePayload): Promise<Customer> {
  const response: AxiosResponse<Customer> = await axiosInstance.put(
    "/auth/me",
    payload,
  );
  return response.data;
}
