"use client";

import constate from "constate";
import { useCallback, useEffect, useMemo, useState } from "react";
import { loginSchema, LoginSchemaType } from "@/lib/types/schema/loginSchema";
import {
  getConnectedUser,
  loginBusinessActor,
} from "@/lib/services/businessActor-service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tokenKeyName } from "@/lib/services/axios-services/interceptors/auth-interceptor";
import { AuthTokensDTO, Customer } from "@/lib/types/models/BusinessActor";

export const [BusStationProvider, useBusStation] = constate(
  useBusStationProvider,
  (value) => value.authMethods
);

function useBusStationProvider() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<Customer | null>(null);
  const [axiosErrors, setAxiosErrors] = useState<string | null>(null);
  const [isCustomerAuthenticated, setIsCustomerAuthenticated] =
    useState<boolean>(false);
  const [isAgencyConnected, setIsAgencyConnected] = useState<boolean>(false);
  const [isOrganizationConnected, setIsOrganizationConnected] =
    useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  function saveAuthParams(accessToken: string, refreshToken?: string) {
    localStorage.setItem(tokenKeyName, accessToken);
    if (refreshToken) {
      localStorage.setItem("bus_station_refresh_token", refreshToken);
    }
  }

  function clearLocaleStorage() {
    localStorage.removeItem(tokenKeyName);
    localStorage.removeItem("bus_station_refresh_token");
    localStorage.removeItem("bus_station_token_expirationDate");
  }

  const logout = useCallback(() => {
    clearLocaleStorage();
    window.location.href = "/";
  }, []);

  function applyRoles(roles: string[]) {
    if (roles.includes("AGENCE_VOYAGE")) setIsAgencyConnected(true);
    else if (roles.includes("ORGANISATION")) {
      setIsAgencyConnected(true);
      setIsOrganizationConnected(true);
    } else {
      setIsCustomerAuthenticated(true);
    }
  }

    const login = useCallback(async (data: LoginSchemaType): Promise<string[] | null> => {
        setIsLoading(true);
        setAxiosErrors(null);
        try {
            const result = await loginBusinessActor(data);
            if (result) {
                setUserData(result.user as Customer);
                saveAuthParams(result.accessToken, result.refreshToken);
                if (result.user.role.includes("AGENCE_VOYAGE")) setIsAgencyConnected(true);
                else if (result.user.role.includes("ORGANISATION")) {
                    setIsAgencyConnected(true);
                    setIsOrganizationConnected(true);
                }
                else setIsCustomerAuthenticated(true);
                setIsLoading(false);
                return result.user.role;
            } else {
                setAxiosErrors("Une erreur inattendue est survenue.");
                setIsLoading(false);
                return null;
            }
        } catch (error: any) {
            if (error?.response?.status === 401 || error?.response?.status === 403) {
                setAxiosErrors("Identifiants incorrects, veuillez réessayer !");
            } else if (error?.response?.status === 404) {
                setAxiosErrors("Utilisateur non trouvé, veuillez réessayer !");
            } else {
                setAxiosErrors(error?.message || "Une erreur est survenue. Vérifiez votre connexion.");
            }
            setIsLoading(false);
            return null;
        }
    }, []);

  async function getCurrentUser(): Promise<void> {
    const token = localStorage.getItem(tokenKeyName);
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const result = await getConnectedUser();
      if (result) {
        setUserData(result);
        applyRoles(result.role);
      } else {
        clearLocaleStorage();
      }
    } catch {
      clearLocaleStorage();
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getCurrentUser();
  }, []);

  const authMethods = useMemo(
    () => ({
      isLoading,
      userData,
      axiosErrors,
      errors,
      isCustomerAuthenticated,
      isAgencyConnected,
      isOrganizationConnected,
      logout,
      login,
      handleSubmit,
      register,
    }),
    [
      isLoading,
      userData,
      axiosErrors,
      errors,
      isCustomerAuthenticated,
      isAgencyConnected,
      isOrganizationConnected,
      logout,
      login,
    ]
  );

  return { authMethods };
}