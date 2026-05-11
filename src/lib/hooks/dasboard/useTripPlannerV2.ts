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

function mapToFormData(raw: Record<string, unknown>): Partial<TripPlannerFormData> {
  const dateStr = raw.dateDepartPrev
    ? new Date(raw.dateDepartPrev as string).toISOString().split("T")[0]
    : "";

  return {
    titre: (raw.titre ?? raw.title ?? "") as string,
    description: (raw.description ?? "Aucune description fournie") as string,
    lieuDepart: (raw.lieuDepart ?? "") as string,
    lieuArrive: (raw.lieuArrive ?? "") as string,
    pointDeDepart: (raw.pointDeDepart ?? "") as string,
    pointArrivee: (raw.pointArrivee ?? "") as string,
    dateDepartPrev: dateStr,
    heureDepartEffectif: (raw.heureDepartEffectif ?? raw.heureDepart ?? "") as string,
    heureArrive: (raw.heureArrive ?? raw.heureArrivee ?? "") as string,
    dureeEstimee: (raw.dureeEstimee ?? raw.dureeVoyage ?? "") as string,
    nbrPlaceReservable: Number(raw.nbrPlaceReservable ?? 1),
    prix: Number(raw.prix ?? 0),
    dateLimiteReservation: raw.dateLimiteReservation
      ? new Date(raw.dateLimiteReservation as string).toISOString().split("T")[0]
      : "",
    dateLimiteConfirmation: raw.dateLimiteConfirmation
      ? new Date(raw.dateLimiteConfirmation as string).toISOString().split("T")[0]
      : "",
    smallImage: (raw.smallImage ?? "") as string,
    bigImage: (raw.bigImage ?? "") as string,
    vehiculeId: (raw.vehiculeId ?? "") as string,
    chauffeurId: (raw.chauffeurId ?? "") as string,
    classVoyageId: (raw.classVoyageId ?? "") as string,
    amenities: Array.isArray(raw.amenities) ? raw.amenities as string[] : [],
  };
}

function mapLigneToFormData(
  ligne: Record<string, unknown>,
  dateOverride?: string,
): Partial<TripPlannerFormData> {
  return {
    lieuDepart: (ligne.lieuDepart ?? "") as string,
    lieuArrive: (ligne.lieuArrive ?? "") as string,
    pointDeDepart: (ligne.pointDeDepart ?? "") as string,
    pointArrivee: (ligne.pointArrivee ?? "") as string,
    heureDepartEffectif: (ligne.heureDepart ?? "") as string,
    heureArrive: (ligne.heureArrivee ?? "") as string,
    dureeEstimee: (ligne.dureeEstimee ?? "") as string,
    classVoyageId: (ligne.classVoyageId ?? "") as string,
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

  const mode: TripPlannerMode = editingId
    ? "edit"
    : draftId
      ? "draft"
      : fromLigneId
        ? "from-ligne"
        : "new";

  const [agenceId, setAgenceId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<StepIndex>(0);
  const [isLoadingResources, setIsLoadingResources] = useState(false);
  const [isLoadingPrefill, setIsLoadingPrefill] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [brouillonId, setBrouillonId] = useState<string | null>(draftId);
  const [brouillonStatut, setBrouillonStatut] = useState<string | null>(null);

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
      getVoyageForEdit(editingId)
        .then((data) => {
          if (data) form.reset({ ...tripPlannerDefaults, ...mapToFormData(data as Record<string, unknown>) });
        })
        .finally(() => setIsLoadingPrefill(false));
    } else if (mode === "draft" && draftId) {
      setIsLoadingPrefill(true);
      getBrouillonForEdit(draftId)
        .then((data) => {
          if (data) {
            form.reset({ ...tripPlannerDefaults, ...mapToFormData(data as Record<string, unknown>) });
            setBrouillonStatut(String((data as Record<string, unknown>).statutBrouillon ?? ""));
          }
        })
        .finally(() => setIsLoadingPrefill(false));
    } else if (mode === "from-ligne" && fromLigneId) {
      setIsLoadingPrefill(true);
      getLigneServiceForPrefill(fromLigneId)
        .then((data) => {
          if (data) form.reset({ ...tripPlannerDefaults, ...mapLigneToFormData(data as Record<string, unknown>, prefillDate ?? "") });
        })
        .finally(() => setIsLoadingPrefill(false));
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
      description: values.description || "Aucune description fournie",
      lieuDepart: values.lieuDepart,
      lieuArrive: values.lieuArrive,
      pointDeDepart: values.pointDeDepart || null,
      pointArrivee: values.pointArrivee || null,
      dateDepartPrev: values.dateDepartPrev
        ? buildISODateTime(values.dateDepartPrev, values.heureDepartEffectif || "00:00")
        : null,
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
      dateLimiteReservation: values.dateLimiteReservation
        ? buildISODateTime(values.dateLimiteReservation, "23:59")
        : null,
      dateLimiteConfirmation: values.dateLimiteConfirmation
        ? buildISODateTime(values.dateLimiteConfirmation, "23:59")
        : null,
      notes: values.description || "Aucune description fournie",
      ligneServiceId: fromLigneId || null,
    };

    try {
      let result;
      if (mode === "draft" && brouillonId) {
        result = await updateBrouillon(brouillonId, payload);
      } else {
        result = await createBrouillon(payload);
        if (result.success && result.data) {
          const newId =
            (result.data as Record<string, unknown>).id ??
            (result.data as Record<string, unknown>).idBrouillon;
          if (newId) setBrouillonId(String(newId));
        }
      }
      if (result.success) {
        setSuccessMessage("Brouillon sauvegardé avec succès !");
        setIsSuccess(true);
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

    // ── Garde : UUIDs requis par le backend ───────────────────────────────
    if (!values.classVoyageId || !values.vehiculeId || !values.chauffeurId) {
      setGlobalError(
        "Veuillez sélectionner une classe de voyage, un véhicule et un chauffeur avant de publier.",
      );
      setIsSubmitting(false);
      return;
    }

    // ── Dates ISO strictes ────────────────────────────────────────────────
    const isoDateDepart = new Date(
      `${values.dateDepartPrev}T${values.heureDepartEffectif || "00:00"}:00`,
    ).toISOString();

    const isoDateArrive = new Date(
      `${values.dateDepartPrev}T${values.heureArrive || "00:00"}:00`,
    ).toISOString();

    const isoDateLimiteReservation = values.dateLimiteReservation
      ? new Date(`${values.dateLimiteReservation}T23:59:59`).toISOString()
      : isoDateDepart;

    const isoDateLimiteConfirmation = values.dateLimiteConfirmation
      ? new Date(`${values.dateLimiteConfirmation}T23:59:59`).toISOString()
      : isoDateDepart;

    // ── Payload conforme à VoyageCreateRequestDTO ─────────────────────────
    const voyagePayload: VoyageCreateDTO = {
      agenceVoyageId: agenceId,
      titre: values.titre,
      description: values.description || "Aucune description fournie",
      lieuDepart: values.lieuDepart,
      lieuArrive: values.lieuArrive,
      pointDeDepart: values.pointDeDepart || "",
      pointArrivee: values.pointArrivee || "",
      dateDepartPrev: isoDateDepart,
      heureArrive: isoDateArrive,
      heureDepartEffectif: isoDateDepart,
      nbrPlaceReservable: Number(values.nbrPlaceReservable),
      nbrPlaceRestante: Number(values.nbrPlaceReservable),
      nbrPlaceReserve: 0,
      nbrPlaceConfirm: 0,
      statusVoyage: mode === "edit" ? "EN_ATTENTE" : "PUBLIE",
      dateLimiteReservation: isoDateLimiteReservation,
      dateLimiteConfirmation: isoDateLimiteConfirmation,
      classVoyageId: values.classVoyageId,
      vehiculeId: values.vehiculeId,
      chauffeurId: values.chauffeurId,
      amenities: values.amenities || [],
      smallImage: values.smallImage || null,
      bigImage: values.bigImage || null,
    };

    try {
      const result = editingId
        ? await updateVoyage(editingId, voyagePayload)
        : await createVoyage(voyagePayload);

      if (result.success) {
        setSuccessMessage(
          editingId ? "Modification réussie !" : "Voyage publié avec succès !",
        );
        setIsSuccess(true);

        // Archiver le brouillon source si applicable
        if (brouillonId) {
          await updateBrouillon(brouillonId, { statutBrouillon: "CONVERTI" });
        }

        setTimeout(() => router.push("/dashboard/marketplace"), 2000);
      } else {
        setGlobalError(
          result.error || "Le serveur a refusé la création du voyage.",
        );
      }
    } catch {
      setGlobalError("Erreur de communication avec le serveur.");
    } finally {
      setIsSubmitting(false);
    }
  }, [agenceId, form, mode, editingId, brouillonId, router]);

  const canPublish =
    mode !== "draft" ||
    (!!formValues.vehiculeId &&
      !!formValues.chauffeurId &&
      !!formValues.classVoyageId &&
      !!formValues.prix);

  const pageTitle =
    mode === "edit"
      ? "Modifier le voyage"
      : mode === "draft"
        ? "Compléter le brouillon"
        : mode === "from-ligne"
          ? "Générer un voyage"
          : "Planifier un nouveau voyage";

  const pageSubtitle =
    mode === "draft"
      ? "Complétez les ressources, puis publiez."
      : mode === "from-ligne"
        ? "Voyage pré-rempli depuis votre planning."
        : "Créez un nouveau voyage.";

  return {
    form,
    currentStep,
    totalSteps: TOTAL_STEPS,
    isLastStep: currentStep === TOTAL_STEPS - 1,
    goNext,
    goBack,
    goToStep,
    agenceId,
    mode,
    isLoadingResources,
    isLoadingPrefill,
    isSubmitting,
    isSuccess,
    setIsSuccess,
    globalError,
    successMessage,
    setGlobalError,
    vehicules,
    chauffeurs,
    classes,
    gares,
    brouillonId,
    brouillonStatut,
    canPublish,
    pageTitle,
    pageSubtitle,
    saveDraft,
    createAndPublish,
  };
}