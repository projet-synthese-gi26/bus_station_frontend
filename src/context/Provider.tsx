"use client";

import constate from 'constate';
import { useEffect, useMemo, useState } from "react";
import { loginSchema, LoginSchemaType } from "@/lib/types/schema/loginSchema";
import { Customer } from "@/lib/types/models/BusinessActor";
import { getConnectedUser, loginBusinessActor } from "@/lib/services/businessActor-service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tokenKeyName } from "@/lib/services/axios-services/interceptors/auth-interceptor";

export const [BusStationProvider, useBusStation] = constate(useBusStationProvider, value => value.authMethods);

function useBusStationProvider()
{
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [userData, setUserData] = useState<Customer | null>(null);
    const [axiosErrors, setAxiosErrors] = useState<string | null>(null);
    const [isCustomerAuthenticated, setIsCustomerAuthenticated] = useState<boolean>(false);
    const [isAgencyConnected, setIsAgencyConnected] = useState<boolean>(false);
    const [isOrganizationConnected, setIsOrganizationConnected] = useState<boolean>(false);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginSchemaType>({
        resolver: zodResolver(loginSchema),
    });

    function saveAuthParams(token: string, expirationDate?: string) {
        localStorage.setItem(tokenKeyName, token);
        if (expirationDate) localStorage.setItem("bus_station_token_expirationDate", expirationDate);
    }

    function clearLocaleStorage() {
        localStorage.removeItem(tokenKeyName);
        localStorage.removeItem("bus_station_token_expirationDate");
    }

    function logout() {
        clearLocaleStorage();
        window.location.href = "/";
    }


    async function login(data: LoginSchemaType): Promise<string[] | null> {
        setIsLoading(true);
        setAxiosErrors(null);
        try {
            const result = await loginBusinessActor(data);
            if (result) {
                setUserData(result);
                saveAuthParams(result.token);

                if (result.role.includes("AGENCE_VOYAGE")) setIsAgencyConnected(true);
                else if (result.role.includes("ORGANISATION")) {
                    setIsAgencyConnected(true);
                    setIsOrganizationConnected(true);
                }
                else setIsCustomerAuthenticated(true);


                
                setIsLoading(false);
                return result.role;
            } else {
                setAxiosErrors("Une erreur inattendue est survenue.");
                setIsLoading(false);
                return null;
            }
        }
            // eslint-disable-next-line
        catch (error: any) {
            if (error?.response?.status === 401 || error?.response?.status === 403) {
                setAxiosErrors("Identifiants incorrects, veuillez réessayer !");
            } else if (error?.response?.status === 404) {
                setAxiosErrors("Utilisateur non trouvé, veuillez réessayer !");
            } else {
                setAxiosErrors("Une erreur est survenue. Vérifiez votre connexion.");
            }
            setIsLoading(false);
            return null;
        }
    }

    async function getCurrentUser(): Promise<void> {
        const token = localStorage.getItem(tokenKeyName);
        if (!token) {
            setIsLoading(false);
            return;
        }
        try {
            const result = await getConnectedUser(token);
            if (result) {
                setUserData(result);
                if (result.role.includes("AGENCE_VOYAGE")) setIsAgencyConnected(true);
                else if (result.role.includes("ORGANISATION")) setIsOrganizationConnected(true);
                else setIsCustomerAuthenticated(true);
            } else {
                clearLocaleStorage();
            }
        } catch (error) {
            console.error("Erreur lors de la récupération de l'utilisateur :", error);
            clearLocaleStorage();
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getCurrentUser();
    }, []);

    const authMethods = useMemo(() => ({
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
    }), [isLoading, userData, axiosErrors, errors, isCustomerAuthenticated, isAgencyConnected, isOrganizationConnected]);

    return {authMethods};
}