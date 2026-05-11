import { AxiosResponse } from "axios";
import axios from "axios";
import {
  BusinessActor,
  Customer,
  AuthTokensDTO,
  LoginResponseDTO,
} from "@/lib/types/models/BusinessActor";
import { BusinessActorFormType } from "@/lib/types/schema/businessActorSchema";
import { LoginSchemaType } from "@/lib/types/schema/loginSchema";
import axiosInstance from "@/lib/services/axios-services/axiosInstance";
import apiClient from "@/lib/api/api-client";

function stripConfirmPassword(data: BusinessActorFormType) {
  const { confirmPassword: _, ...rest } = data;
  return rest;
}

// Correction de createBusinessActor (inscription)
export async function createBusinessActor(
    data: BusinessActorFormType
): Promise<BusinessActor | null> {
    try {
        const dataToSend = stripConfirmPassword(data);
        const apiResponse: AxiosResponse<BusinessActor> = await axiosInstance.post(
            "/auth/register",   // ← était /utilisateur/inscription
            dataToSend
        );
        if (apiResponse.status === 201 || apiResponse.status === 200) {
            return apiResponse.data;
        }
        return null;
    } catch (error) {
        console.error("Error when creating the business actor", error);
        throw error;
    }
}

// Correction de loginBusinessActor (connexion)
export async function loginBusinessActor(
    data: LoginSchemaType
): Promise<AuthTokensDTO | null> {
    try {
        const apiResponse: AxiosResponse<AuthTokensDTO> = await axiosInstance.post(
            "/auth/login",
            data
        );
        if (apiResponse.status === 200) return apiResponse.data;
        return null;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(
                error.response.data.message || `Error during login: ${error.response.status}`
            );
        }
        throw new Error("Error during login process");
    }
}

// Correction de getConnectedUser
export async function getConnectedUser(): Promise<Customer | null> {
    try {
        const apiResponse: AxiosResponse<Customer> = await axiosInstance.get("/auth/me");  // ← était /utilisateur/profil
        if (apiResponse.status === 200) return apiResponse.data;
        return null;
    } catch (error) {
        console.error("Something went wrong when getting the current user", error);
        throw new Error("Something went wrong when getting the current user");
    }
}

export async function updateUserProfile(data: Partial<Customer>): Promise<Customer | null> {
    try {
        const apiResponse: AxiosResponse<Customer> = await axiosInstance.put("/auth/me", data);
        if (apiResponse.status === 200) return apiResponse.data;
        return null;
    } catch (error) {
        console.error("Error updating user profile", error);
        throw error;
    }
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
        await axiosInstance.put("/auth/me/password", { currentPassword, newPassword });
    } catch (error) {
        console.error("Error changing password", error);
        throw error;
    }
}

export async function forgotPassword(email: string): Promise<{ token?: string } | null> {
    try {
        const apiResponse = await axiosInstance.post("/auth/forgot-password", { email });
        return apiResponse.data ?? null;
    } catch (error) {
        console.error("Error during forgot password", error);
        throw error;
    }
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
    try {
        await axiosInstance.post("/auth/reset-password", { token, newPassword });
    } catch (error) {
        console.error("Error during reset password", error);
        throw error;
    }
}