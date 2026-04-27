import axios, { AxiosResponse } from "axios";
import {
  BusinessActor,
  Customer,
  LoginResponseDTO,
} from "@/lib/types/models/BusinessActor";
import { BusinessActorFormType } from "@/lib/types/schema/businessActorSchema";
import { LoginSchemaType } from "@/lib/types/schema/loginSchema";
import axiosInstance from "@/lib/services/axios-services/axiosInstance";

const url: string = `${process.env.NEXT_PUBLIC_TRIP_AGENCY_BACKEND_API_URL}/utilisateur`;

function stripConfirmPassword(data: BusinessActorFormType) {
  const { confirmPassword, ...rest } = data;
  return { confirmPassword, rest };
}

export async function createBusinessActor(
  data: BusinessActorFormType,
): Promise<BusinessActor | null> {
  try {
    const dataToSend = stripConfirmPassword(data);
    const apiResponse: AxiosResponse<BusinessActor> = await axios.post(
      `${url}/inscription`,
      dataToSend.rest,
    );
    if (apiResponse.status === 201 || apiResponse.status === 200) {
      console.log(apiResponse.data);
      return apiResponse.data;
    } else {
      console.warn("Code HTTP innatendu", apiResponse.status);
      return null;
    }
  } catch (error) {
    console.error("Error when creating the business actor ", error);
    throw error;
  }
}

// export async function loginBusinessActor(
//   data: LoginSchemaType,
// ): Promise<LoginResponseDTO | null> {
//   try {
//     const apiResponse: AxiosResponse<LoginResponseDTO> = await axios.post(
//       `${url}/connexion`,
//       data,
//     );
//     if (apiResponse.status === 200) {
//       console.log(apiResponse.data);
//       return apiResponse.data;
//     } else {
//       console.warn("Unattended http code", apiResponse.status);
//       return null;
//     }
//   } catch (error) {
//     console.error("error during login process ", error);
//     throw new Error("Error during login processs");
//   }
// }

export async function getConnectedUser(
  token: string,
): Promise<Customer | null> {
  if (!token) return null;
  try {
    const apiResponse: AxiosResponse<Customer> =
      await axiosInstance.get("/auth/me");
    if (apiResponse.status === 200) return apiResponse.data;
    return null;
  } catch (error) {
    console.error("Erreur récupération utilisateur connecté :", error);
    return null; // ← return null au lieu de throw, pour ne pas bloquer la page
  }
}

// ✅ Vrai appel au backend Spring Boot

export async function loginBusinessActor(
  data: LoginSchemaType,
): Promise<LoginResponseDTO | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

  // ⚠️ axios.post (pas axiosInstance.post) — sinon l'intercepteur injecte un vieux token
  const apiResponse = await axios.post(
    `${baseUrl}/auth/login`,
    { username: data.username, password: data.password },
    { headers: { "Content-Type": "application/json" } },
  );

  const { accessToken, refreshToken, user } = apiResponse.data;

  if (typeof window !== "undefined") {
    localStorage.setItem("bus_station_refresh_token", refreshToken);
  }

  return {
    userId: user.userId,
    first_name: user.firstName ?? "",
    last_name: user.lastName ?? "",
    email: user.email,
    username: user.username,
    phone_number: user.phoneNumber ?? "",
    role: user.role ?? [],
    token: accessToken,
  } as LoginResponseDTO;
}
