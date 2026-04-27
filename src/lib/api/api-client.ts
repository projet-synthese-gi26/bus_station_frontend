/**
 * api-client.ts
 *
 * Client HTTP centralisé pour tous les nouveaux services (Catégorie B & C).
 * Les services de Catégorie A continuent d'utiliser axiosInstance (ancien backend)
 * jusqu'à leur migration individuelle.
 *
 * Intercepteur JWT : lit le token depuis localStorage (même clé que l'ancien intercepteur).
 */

import axios, {
  type AxiosInstance,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import { API_BASE_URL } from "@/lib/config/api.config";

export const TOKEN_KEY = "bus_station_token_key";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30_000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Intercepteur requête : injecter le JWT ───────────────────────────────────
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// ── Intercepteur réponse : normalisation des erreurs ────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (process.env.NODE_ENV === "development") {
      console.group("[apiClient] Erreur HTTP");
      console.error("URL     :", error.config?.url);
      console.error("Status  :", error.response?.status);
      console.error("Payload :", error.response?.data);
      console.groupEnd();
    }
    return Promise.reject(error);
  },
);

export default apiClient;
