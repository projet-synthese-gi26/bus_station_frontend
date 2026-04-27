// src/lib/services/employe-service.ts
import { AxiosResponse, AxiosError } from "axios";
import axiosInstance from "./axios-services/axiosInstance";
import { UserResponseCreatedDTO, EmployeRequestDTO } from "../types/generated-api";

const url = "/utilisateur";

/**
 * Récupère tous les employés d'une agence spécifique.
 */
export async function getEmployeesByAgency(agencyId: string): Promise<UserResponseCreatedDTO[] | null> {
    if (!agencyId) {
        console.error("[SERVICE_ERROR] getEmployeesByAgency: ID de l'agence manquant.");
        return null;
    }
    try {
        const response: AxiosResponse<UserResponseCreatedDTO[]> = await axiosInstance.get(`${url}/employes/${agencyId}`);
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError;
        console.error("[SERVICE_FAILURE] getEmployeesByAgency:", axiosError.response?.data || axiosError.message);
        throw axiosError;
    }
}

/**
 * Crée un nouvel employé pour une agence.
 */
export async function createEmployeeForAgency(data: EmployeRequestDTO): Promise<UserResponseCreatedDTO | null> {
    try {
        const response: AxiosResponse<UserResponseCreatedDTO> = await axiosInstance.post(`${url}/employe`, data);
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError;
        console.error("[SERVICE_FAILURE] createEmployeeForAgency:", axiosError.response?.data || axiosError.message);
        throw axiosError;
    }
}


/**
 * Met à jour les informations d'un employé.
 * @param employeeId - L'ID de l'employé à mettre à jour.
 * @param data - Les données de l'employé à mettre à jour.
 * @returns Une promesse résolue avec les détails de l'employé mis à jour.
 */
export async function updateEmployee(employeeId: string, data: EmployeRequestDTO): Promise<UserResponseCreatedDTO | null> {
    console.log(`[employe-service] Mise à jour de l'employé ID ${employeeId}`);
    try {
        const response: AxiosResponse<UserResponseCreatedDTO> = await axiosInstance.put(`${url}/employe/${employeeId}`, data);
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError;
        console.error(`[employe-service] Erreur lors de la mise à jour de l'employé ${employeeId}:`, axiosError.response?.data || axiosError.message);
        throw axiosError;
    }
}

/**
 * Supprime un employé.
 * @param employeeId - L'ID de l'employé à supprimer.
 * @returns Une promesse qui se résout lorsque la suppression est terminée.
 */
export async function deleteEmployee(employeeId: string): Promise<void> {
    console.log(`[employe-service] Suppression de l'employé ID ${employeeId}`);
    try {
        await axiosInstance.delete(`${url}/employe/${employeeId}`);
    } catch (error) {
        const axiosError = error as AxiosError;
        console.error(`[employe-service] Erreur lors de la suppression de l'employé ${employeeId}:`, axiosError.response?.data || axiosError.message);
        throw axiosError;
    }
}