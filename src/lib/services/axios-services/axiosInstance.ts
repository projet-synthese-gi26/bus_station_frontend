import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import authInterceptor from "./interceptors/auth-interceptor";
import { tokenKeyName } from "./interceptors/auth-interceptor";

const REFRESH_TOKEN_KEY = "bus_station_refresh_token";

const axiosInstance: AxiosInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_TRIP_AGENCY_BACKEND_API_URL ||
    "http://localhost:8080",
  timeout: 60000,
});

authInterceptor(axiosInstance);

// ── Silent token refresh ─────────────────────────────────────────────────────
let isRefreshing = false;
let queue: Array<(newToken: string) => void> = [];

function flushQueue(newToken: string) {
  queue.forEach((cb) => cb(newToken));
  queue = [];
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    const refreshToken =
      typeof window !== "undefined"
        ? localStorage.getItem(REFRESH_TOKEN_KEY)
        : null;

    // Pas de refresh token → laisser l'erreur remonter normalement
    if (!refreshToken) {
      return Promise.reject(error);
    }

    original._retry = true;

    if (isRefreshing) {
      // Une requête de refresh est déjà en cours → on attend le résultat
      return new Promise((resolve) => {
        queue.push((newToken: string) => {
          original.headers["Authorization"] = `Bearer ${newToken}`;
          resolve(axiosInstance(original));
        });
      });
    }

    isRefreshing = true;

    try {
      // POST /auth/refresh — body = refresh token en JSON string
      const res = await axios.post(
        `${axiosInstance.defaults.baseURL}/auth/refresh`,
        JSON.stringify(refreshToken),
        { headers: { "Content-Type": "application/json" } },
      );

      const newToken: string =
        typeof res.data === "string" ? res.data : res.data?.accessToken;

      localStorage.setItem(tokenKeyName, newToken);
      flushQueue(newToken);

      // Rejouer la requête originale avec le nouveau token
      original.headers["Authorization"] = `Bearer ${newToken}`;
      return axiosInstance(original);
    } catch {
      // Refresh échoué → session expirée, nettoyage
      localStorage.removeItem(tokenKeyName);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      queue = [];
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  },
);

export default axiosInstance;