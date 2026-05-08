import apiClient from "@/lib/api/api-client";
import type { Coupon, SoldeIndemnisation } from "@/lib/types/generated-api";

function toArray<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === "object") {
    const d = data as Record<string, unknown>;
    if (Array.isArray(d.content)) return d.content as T[];
  }
  return [];
}

export async function getCouponsByUserId(userId: string): Promise<Coupon[]> {
  if (!userId) return [];
  try {
    const res = await apiClient.get(`/coupon/user/${userId}`);
    return toArray<Coupon>(res.data);
  } catch {
    console.error("[coupon-service] GET /coupon/user/{userId} failed");
    return [];
  }
}

export async function getSoldeIndemnisationByUserId(
  userId: string,
): Promise<SoldeIndemnisation[]> {
  if (!userId) return [];
  try {
    const res = await apiClient.get(`/solde-indemnisation/user/${userId}`);
    return toArray<SoldeIndemnisation>(res.data);
  } catch {
    console.error("[coupon-service] GET /solde-indemnisation/user/{userId} failed");
    return [];
  }
}
