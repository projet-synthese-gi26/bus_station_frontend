/**
 * useTripPlannerV2.ts
 * Hook principal pour P-20 — formulaire multi-étapes création/édition voyage.
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useBusStation } from "@/context/Provider";
import { getAgencyByChefId } from "@/lib/services/agency-service";

import {
  tripPlannerSchema,
  tripPlannerDefaults,
  stepSchemas,
  type TripPlannerFormData,
  type TripPlannerFormInput,
  type StepIndex,
} from "@/lib/types/schema/tripPlannerSchema";

import {
  getVehiculeOptions,
  getChauffeurOptions,
  getClassVoyageOptions,
  getGareOptions,
  getVoyageForEdit,
  getBrouillonForEdit,
  getLigneServiceForPrefill,
  type VehiculeOption,
  type ChauffeurOption,
  type ClassVoyageOption,
  type GareOption,
} from "@/lib/services/voyage-form.service";

import {
  createBrouillon,
  updateBrouillon,
  createVoyage,
  updateVoyage,
  publierBrouillon,
  publierVoyage,
  type BrouillonCreateDTO,
  type VoyageCreateDTO,
} from "@/lib/services/voyage-mutations.service";

// ── Types locaux ──────────────────────────────────────────────────────────────

export type TripPlannerMode = "new" | "edit" | "draft" | "from-ligne";

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildISODateTime(date: string, time: string): string {
  if (!date || !time) return "";
  const fullTime = time.length === 5 ? `${time}:00` : time;
  return `${date}T${fullTime}`;
}

function mapToFormData(raw: Record<string, any>): Partial<TripPlannerFormData> {
  const dateStr = raw.dateDepartPrev
    ? new Date(raw.dateDepartPrev).toISOString().split("T")[0]
    : "";

  return {
    titre: raw.titre ?? raw.title ?? "",
    description: raw.description ?? "",
    lieuDepart: raw.lieuDepart ?? "",
    lieuArrive: raw.lieuArrive ?? "",
    pointDeDepart: raw.pointDeDepart ?? "",
    pointArrivee: raw.pointArrivee ?? "",
    dateDepartPrev: dateStr,
    heureDepartEffectif: raw.heureDepartEffectif ?? raw.heureDepart ?? "",
    heureArrive: raw.heureArrive ?? raw.heureArrivee ?? "",
    dureeEstimee: raw.dureeEstimee ?? raw.dureeVoyage ?? "",
    nbrPlaceReservable: Number(raw.nbrPlaceReservable ?? 1),
    prix: Number(raw.prix ?? 0),
    dateLimiteReservation: raw.dateLimiteReservation
      ? new Date(raw.dateLimiteReservation).toISOString().split("T")[0]
      : "",
    dateLimiteConfirmation: raw.dateLimiteConfirmation
      ? new Date(raw.dateLimiteConfirmation).toISOString().split("T")[0]
      : "",
    smallImage: raw.smallImage ?? "",
    bigImage: raw.bigImage ?? "",
    vehiculeId: raw.vehiculeId ?? "",
    chauffeurId: raw.chauffeurId ?? "",
    classVoyageId: raw.classVoyageId ?? "",
    amenities: Array.isArray(raw.amenities) ? raw.amenities : [],
  };
}

function mapLigneToFormData(
  ligne: Record<string, any>,
  dateOverride?: string,
): Partial<TripPlannerFormData> {
  return {
    lieuDepart: ligne.lieuDepart ?? "",
    lieuArrive: ligne.lieuArrive ?? "",
    pointDeDepart: ligne.pointDeDepart ?? "",
    pointArrivee: ligne.pointArrivee ?? "",
    heureDepartEffectif: ligne.heureDepart ?? "",
    heureArrive: ligne.heureArrivee ?? "",
    dureeEstimee: ligne.dureeEstimee ?? "",
    classVoyageId: ligne.classVoyageId ?? "",
    prix: Number(ligne.prix ?? 0),
    dateDepartPrev: dateOverride ?? "",
  };
}

// ── Hook principal ────────────────────────────────────────────────────────────

export function useTripPlannerV2() {
  const { userData, isLoading: isUserLoading } = useBusStation();
  const router = useRouter();
  const searchParams = useSearchParams();

  const editingId = searchParams.get("edit");
  const draftId = searchParams.get("draft");
  const fromLigneId = searchParams.get("from-ligne");
  const prefillDate = searchParams.get("date");

  const mode: TripPlannerMode = editingId ? "edit" : draftId ? "draft" : fromLigneId ? "from-ligne" : "new";

  // ── ÉTATS (Déclarations corrigées) ─────────────────────────────────────────
  const [agenceId, setAgenceId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<StepIndex>(0);
  const [isLoadingResources, setIsLoadingResources] = useState(false);
  const [isLoadingPrefill, setIsLoadingPrefill] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Correction ici : déclaration de isSuccess et setIsSuccess
  const [isSuccess, setIsSuccess] = useState(false); 
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);
  
  const [brouillonId, setBrouillonId] = useState<string | null>(draftId);
  const [brouillonStatut, setBrouillonStatut] = useState<string | null>(null);

  // Ressources
  const [vehicules, setVehicules] = useState<VehiculeOption[]>([]);
  const [chauffeurs, setChauffeurs] = useState<ChauffeurOption[]>([]);
  const [classes, setClasses] = useState<ClassVoyageOption[]>([]);
  const [gares, setGares] = useState<GareOption[]>([]);

  const form = useForm<TripPlannerFormData, unknown, TripPlannerFormInput>({
    resolver: zodResolver(tripPlannerSchema) as never,
    defaultValues: tripPlannerDefaults as TripPlannerFormData,
    mode: "onChange",
  });

  const formValues = form.watch();

  useEffect(() => {
    if (isUserLoading || !userData?.userId) return;
    getAgencyByChefId(userData.userId)
      .then((agency) => {
        if (agency?.agencyId) setAgenceId(agency.agencyId);
        else setGlobalError("Impossible de résoudre l'agence.");
      })
      .catch(() => setGlobalError("Erreur lors du chargement de l'agence."));
  }, [userData, isUserLoading]);

  useEffect(() => {
    if (!agenceId) return;
    setIsLoadingResources(true);
    Promise.all([
      getVehiculeOptions(agenceId),
      getChauffeurOptions(agenceId),
      getClassVoyageOptions(agenceId),
      getGareOptions(),
    ])
      .then(([v, c, cl, g]) => {
        setVehicules(v);
        setChauffeurs(c);
        setClasses(cl);
        setGares(g);
      })
      .finally(() => setIsLoadingResources(false));
  }, [agenceId]);

  useEffect(() => {
    if (!agenceId) return;
    if (mode === "edit" && editingId) {
      setIsLoadingPrefill(true);
      getVoyageForEdit(editingId).then((data) => {
        if (data) form.reset({ ...tripPlannerDefaults, ...mapToFormData(data) });
      }).finally(() => setIsLoadingPrefill(false));
    } else if (mode === "draft" && draftId) {
      setIsLoadingPrefill(true);
      getBrouillonForEdit(draftId).then((data) => {
        if (data) {
          form.reset({ ...tripPlannerDefaults, ...mapToFormData(data) });
          setBrouillonStatut(String(data.statutBrouillon ?? ""));
        }
      }).finally(() => setIsLoadingPrefill(false));
    } else if (mode === "from-ligne" && fromLigneId) {
      setIsLoadingPrefill(true);
      getLigneServiceForPrefill(fromLigneId).then((data) => {
        if (data) form.reset({ ...tripPlannerDefaults, ...mapLigneToFormData(data, prefillDate ?? "") });
      }).finally(() => setIsLoadingPrefill(false));
    }
  }, [agenceId, mode, editingId, draftId, fromLigneId, prefillDate, form]);

  const TOTAL_STEPS = 4;

  const goNext = useCallback(async () => {
    if (currentStep >= 3) return;
    const schema = stepSchemas[currentStep as 0 | 1 | 2];
    const stepFields = Object.keys(schema.shape) as (keyof TripPlannerFormData)[];
    const valid = await form.trigger(stepFields);
    if (!valid) return;
    setCurrentStep((s) => (s + 1) as StepIndex);
  }, [currentStep, form]);

  const goBack = useCallback(() => {
    if (currentStep > 0) setCurrentStep((s) => (s - 1) as StepIndex);
  }, [currentStep]);

  const goToStep = useCallback((step: StepIndex) => {
    setCurrentStep(step);
  }, []);

  const saveDraft = useCallback(async () => {
    if (!agenceId) return;
    setIsSubmitting(true);
    setGlobalError(null);
    const values = form.getValues();

    const payload: BrouillonCreateDTO = {
      agenceVoyageId: agenceId,
      titre: values.titre,
      description: values.description || null,
      lieuDepart: values.lieuDepart,
      lieuArrive: values.lieuArrive,
      pointDeDepart: values.pointDeDepart || null,
      pointArrivee: values.pointArrivee || null,
      dateDepartPrev: values.dateDepartPrev ? buildISODateTime(values.dateDepartPrev, values.heureDepartEffectif || "00:00") : null,
      heureDepartEffectif: values.heureDepartEffectif || null,
      heureArrive: values.heureArrive || null,
      dureeEstimee: values.dureeEstimee || null,
      classVoyageId: values.classVoyageId || null,
      vehiculeId: values.vehiculeId || null,
      chauffeurId: values.chauffeurId || null,
      nbrPlaceReservable: values.nbrPlaceReservable ? Number(values.nbrPlaceReservable) : null,
      prix: values.prix ? Number(values.prix) : null,
      amenities: values.amenities || null,
      smallImage: values.smallImage || null,
      bigImage: values.bigImage || null,
      dateLimiteReservation: values.dateLimiteReservation ? buildISODateTime(values.dateLimiteReservation, "23:59") : null,
      dateLimiteConfirmation: values.dateLimiteConfirmation ? buildISODateTime(values.dateLimiteConfirmation, "23:59") : null,
      notes: values.description || null,
      ligneServiceId: fromLigneId || null,
    };

    try {
      let result;
      if (mode === "draft" && brouillonId) {
        result = await updateBrouillon(brouillonId, payload);
      } else {
        result = await createBrouillon(payload);
        if (result.success && result.data) {
          const newId = (result.data as any).id ?? (result.data as any).idBrouillon;
          if (newId) setBrouillonId(newId);
        }
      }
      if (result.success) {
        setSuccessMessage("Brouillon sauvegardé avec succès !");
        setIsSuccess(true); // Déclenche la modale de succès
        setTimeout(() => router.push("/dashboard/drafts"), 2000);
      } else {
        setGlobalError(result.error ?? "Erreur de sauvegarde.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [agenceId, form, mode, brouillonId, fromLigneId, router]);

  const createAndPublish = useCallback(async () => {
    if (!agenceId) return;
    const valid = await form.trigger();
    if (!valid) return;

    setIsSubmitting(true);
    setGlobalError(null);
    const values = form.getValues();

    // On prépare les dates au format ISO Strict (Z) pour Spring Boot
    const isoDateDepart = new Date(`${values.dateDepartPrev}T${values.heureDepartEffectif || "00:00"}:00`).toISOString();
    const isoDateArrive = new Date(`${values.dateDepartPrev}T${values.heureArrive || "00:00"}:00`).toISOString();

    // CONSTRUCTION DU PAYLOAD STRICT (VoyageCreateRequestDTO)
    const voyagePayload: VoyageCreateDTO = {
      agenceVoyageId: agenceId,
      titre: values.titre,
      description: values.description || "",
      lieuDepart: values.lieuDepart,
      lieuArrive: values.lieuArrive,
      pointDeDepart: values.pointDeDepart || "",
      pointArrivee: values.pointArrivee || "",
      dateDepartPrev: isoDateDepart,
      heureArrive: isoDateArrive,
      heureDepartEffectif: isoDateDepart,
      nbrPlaceReservable: Number(values.nbrPlaceReservable),
      nbrPlaceRestante: Number(values.nbrPlaceReservable), // Initialement égal au max
      nbrPlaceReserve: 0,
      nbrPlaceConfirm: 0,
      statusVoyage: mode === "edit" ? "EN_ATTENTE" : "PUBLIE",
      dateLimiteReservation: values.dateLimiteReservation 
        ? new Date(`${values.dateLimiteReservation}T23:59:59`).toISOString() 
        : isoDateDepart,
      dateLimiteConfirmation: values.dateLimiteConfirmation 
        ? new Date(`${values.dateLimiteConfirmation}T23:59:59`).toISOString() 
        : isoDateDepart,
      classVoyageId: values.classVoyageId || "", 
      vehiculeId: values.vehiculeId || "",
      chauffeurId: values.chauffeurId || "",
      amenities: values.amenities || [],
      smallImage: values.smallImage || null,
      bigImage: values.bigImage || null,
    };

    try {
      // Si on vient d'un brouillon, on le met d'abord à jour
      if (mode === "draft" && brouillonId) {
        await updateBrouillon(brouillonId, voyagePayload as any);
      }

      const result = editingId 
        ? await updateVoyage(editingId, voyagePayload)
        : await createVoyage(voyagePayload);

      if (result.success) {
        setSuccessMessage(editingId ? "Modification réussie !" : "Voyage publié avec succès !");
        setIsSuccess(true);
        
        // Si c'est un brouillon qui devient un voyage, on le marque converti
        if (brouillonId) {
            await updateBrouillon(brouillonId, { statutBrouillon: "CONVERTI" } as any);
        }

        setTimeout(() => router.push("/dashboard/marketplace"), 2000);
      } else {
        setGlobalError(result.error || "Le serveur a refusé la création du voyage.");
      }
    } catch (err) {
      setGlobalError("Erreur de communication avec le serveur.");
    } finally {
      setIsSubmitting(false);
    }
  }, [agenceId, form, mode, editingId, brouillonId, router]);

  const pageTitle = mode === "edit" ? "Modifier le voyage" : mode === "draft" ? "Compléter le brouillon" : mode === "from-ligne" ? "Générer un voyage" : "Planifier un nouveau voyage";
  const pageSubtitle = mode === "draft" ? "Complétez les ressources, puis publiez." : mode === "from-ligne" ? "Voyage pré-rempli depuis votre planning." : "Créez un nouveau voyage.";

  const canPublish = mode !== "draft" || (!!formValues.vehiculeId && !!formValues.chauffeurId && !!formValues.classVoyageId && !!formValues.prix);

  return {
    form, currentStep, totalSteps: TOTAL_STEPS, isLastStep: currentStep === TOTAL_STEPS - 1,
    goNext, goBack, goToStep, agenceId, mode, isLoadingResources, isLoadingPrefill, isSubmitting,
    isSuccess, setIsSuccess, globalError, successMessage, setGlobalError, vehicules, chauffeurs, classes, gares,
    brouillonId, brouillonStatut, canPublish, pageTitle, pageSubtitle, saveDraft, createAndPublish,
  };
}