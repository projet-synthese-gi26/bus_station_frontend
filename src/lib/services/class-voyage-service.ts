import { AxiosResponse } from "axios";
import axiosInstance from "./axios-services/axiosInstance";
import { ClassVoyage, ClassVoyageDTO } from "../types/generated-api";
import { PaginatedResponse } from "../types/common";

const url = "/class-voyage";

// Le backend renvoie un champ `id` qu'on remappe vers `idClassVoyage` pour
// rester compatible avec les hooks/composants existants (useClassVoyageTab).
interface ClassVoyageRaw {
  id?: string;
  idClassVoyage?: string;
  nom?: string;
  prix?: number;
  tauxAnnulation?: number;
  idAgenceVoyage?: string;
}

function normalizeClassVoyage(raw: ClassVoyageRaw): ClassVoyage {
  return {
    idClassVoyage: raw.idClassVoyage ?? raw.id,
    nom: raw.nom,
    prix: raw.prix,
    tauxAnnulation: raw.tauxAnnulation,
    idAgenceVoyage: raw.idAgenceVoyage,
  };
}

export async function getAllClassVoyagesByAgence(
  agenceId: string,
): Promise<ClassVoyage[]> {
  try {
    const response: AxiosResponse<ClassVoyageRaw[]> = await axiosInstance.get(
      `${url}/agence/${agenceId}`,
    );
    return (response.data ?? []).map(normalizeClassVoyage);
  } catch (error) {
    console.error(
      "[class-voyage-service] Erreur de récupération des classes:",
      error,
    );
    throw error;
  }
}

export async function getAllClasses(): Promise<PaginatedResponse<ClassVoyage>> {
  try {
    const response: AxiosResponse<PaginatedResponse<ClassVoyageRaw>> =
      await axiosInstance.get(url);
    return {
      ...response.data,
      content: (response.data.content ?? []).map(normalizeClassVoyage),
    };
  } catch (error) {
    console.error(
      "[class-voyage-service] Erreur de récupération des classes:",
      error,
    );
    throw error;
  }
}

export async function createClassVoyage(
  data: ClassVoyageDTO,
): Promise<ClassVoyage> {
  try {
    const response: AxiosResponse<ClassVoyageRaw> = await axiosInstance.post(
      url,
      data,
    );
    return normalizeClassVoyage(response.data);
  } catch (error) {
    throw error;
  }
}

export async function updateClassVoyage(
  id: string,
  data: ClassVoyageDTO,
): Promise<ClassVoyage> {
  try {
    const response: AxiosResponse<ClassVoyageRaw> = await axiosInstance.put(
      `${url}/${id}`,
      data,
    );
    return normalizeClassVoyage(response.data);
  } catch (error) {
    throw error;
  }
}

export async function deleteClassVoyage(id: string): Promise<void> {
  try {
    await axiosInstance.delete(`${url}/${id}`);
  } catch (error) {
    throw error;
  }
}
