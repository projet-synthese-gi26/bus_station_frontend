import axiosInstance from "@/lib/services/axios-services/axiosInstance";
import { AxiosError, AxiosResponse } from "axios";
import { LigneService, CreateLigneServiceDTO, JourSemaine } from "@/lib/types/ligne-service.types";
import { PlannerTrip } from "@/lib/types/models/Trip";

const URL = "/ligne-service";

// ─── helpers ────────────────────────────────────────────────────────────────

const DAY_MAP_FR_TO_EN: Record<JourSemaine, string> = {
  LUNDI: "MONDAY", MARDI: "TUESDAY", MERCREDI: "WEDNESDAY",
  JEUDI: "THURSDAY", VENDREDI: "FRIDAY", SAMEDI: "SATURDAY", DIMANCHE: "SUNDAY",
};

const DAY_MAP_EN_TO_FR: Record<string, JourSemaine> = {
  MONDAY: "LUNDI", TUESDAY: "MARDI", WEDNESDAY: "MERCREDI",
  THURSDAY: "JEUDI", FRIDAY: "VENDREDI", SATURDAY: "SAMEDI", SUNDAY: "DIMANCHE",
};

function localTimeToString(t: { hour: number; minute: number } | null | undefined): string | null {
  if (!t) return null;
  return `${String(t.hour).padStart(2, "0")}:${String(t.minute).padStart(2, "0")}`;
}

function toLocalTime(timeStr: string | null | undefined): string | null {
  if (!timeStr) return null;
  const [hour, minute] = timeStr.split(":").map(Number);
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`;
}

function toBackendPayload(data: CreateLigneServiceDTO) {
  return {
    nom: data.nom || `${data.lieuDepart} → ${data.lieuArrive}`,
    recurrence: "HEBDOMADAIRE",
    statut: data.actif ? "ACTIF" : "BROUILLON",
    id_agence_voyage: data.agenceVoyageId,
    date_debut: new Date().toISOString().split("T")[0],
    creneaux: (data.joursOperation ?? []).map((jour) => {
      const creneau: Record<string, unknown> = {
        lieu_depart: data.lieuDepart,
        lieu_arrive: data.lieuArrive,
        heure_depart: toLocalTime(data.heureDepart),
        heure_arrivee: toLocalTime(data.heureArrivee),
        jour_semaine: DAY_MAP_FR_TO_EN[jour] ?? jour,
      };
      // N'envoyer les FK optionnelles que si elles ont une valeur
      if (data.classVoyageId) creneau.id_class_voyage = data.classVoyageId;
      if (data.vehiculeId) creneau.id_vehicule = data.vehiculeId;
      return creneau;
    }),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromBackend(raw: any): LigneService {
  const creneaux: any[] = raw.creneaux ?? [];
  const first = creneaux[0];
  return {
    id: String(raw.id_planning ?? raw.id ?? ""),
    nom: raw.nom ?? "",
    lieuDepart: first?.lieu_depart ?? "",
    lieuArrive: first?.lieu_arrive ?? "",
    heureDepart: localTimeToString(first?.heure_depart),
    heureArrivee: localTimeToString(first?.heure_arrivee),
    joursOperation: creneaux.map((c: any) => DAY_MAP_EN_TO_FR[c.jour_semaine] ?? c.jour_semaine),
    agenceVoyageId: raw.id_agence_voyage ?? "",
    classVoyageId: first?.id_class_voyage ?? null,
    vehiculeId: first?.id_vehicule ?? null,
    actif: raw.statut === "ACTIF",
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

// ─── API ────────────────────────────────────────────────────────────────────

export async function getLignesByAgencyId(agencyId: string): Promise<LigneService[]> {
  if (!agencyId) return [];
  try {
    const res: AxiosResponse<any[]> = await axiosInstance.get(`${URL}/agence/${agencyId}`);
    console.log("[planner-trip-service] GET lignes raw:", JSON.stringify(res.data, null, 2));
    const mapped = (res.data ?? []).map(fromBackend);
    console.log("[planner-trip-service] GET lignes mapped:", mapped);
    return mapped;
  } catch (error) {
    console.error("[planner-trip-service] Erreur récupération lignes:", (error as AxiosError).message);
    throw error;
  }
}

export async function createPlannerTrip(data: CreateLigneServiceDTO): Promise<void> {
  const payload = toBackendPayload(data);
  console.log("[planner-trip-service] Payload envoyé →", JSON.stringify(payload, null, 2));
  try {
    await axiosInstance.post(URL, payload);
  } catch (error) {
    const axErr = error as AxiosError;
    console.error("[planner-trip-service] Erreur création ligne:", JSON.stringify(axErr.response?.data) ?? axErr.message);
    throw error;
  }
}

export async function deletePlannerTrip(ligneId: string): Promise<void> {
  try {
    await axiosInstance.delete(`${URL}/${ligneId}`);
  } catch (error) {
    console.error("[planner-trip-service] Erreur suppression ligne:", (error as AxiosError).message);
    throw error;
  }
}

// updatePlannerTrip conservé pour le drag-and-drop (à connecter au backend plus tard)
export async function updatePlannerTrip(_tripId: string, _data: any): Promise<void> {
  throw new Error("updatePlannerTrip: non encore connecté au backend");
}