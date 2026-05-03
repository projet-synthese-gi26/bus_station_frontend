/**
 * useTripPlannerV2.ts
 * Hook principal pour P-20 — formulaire multi-étapes création/édition voyage.
 * Emplacement suggéré : src/lib/hooks/dasboard/useTripPlannerV2.ts
 *
 * Modes supportés :
 *   ?mode=new          → création brouillon vierge
 *   ?edit={voyageId}   → modification voyage existant
 *   ?draft={id}        → complétion d'un brouillon
 *   ?from-ligne={id}&date={date} → pré-rempli depuis LigneService
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

export interface TripPlannerState {
  // Identité
  mode: TripPlannerMode;
  agenceId: string | null;
  currentStep: StepIndex;
  isLastStep: boolean;

  // Chargement
  isLoadingResources: boolean;
  isLoadingPrefill: boolean;
  isSubmitting: boolean;

  // Ressources disponibles pour les selects
  vehicules: VehiculeOption[];
  chauffeurs: ChauffeurOption[];
  classes: ClassVoyageOption[];
  gares: GareOption[];

  // Labels de mode
  pageTitle: string;
  pageSubtitle: string;

  // Erreur globale
  globalError: string | null;
  successMessage: string | null;

  // Brouillon chargé (si mode draft)
  brouillonId: string | null;
  brouillonStatut: string | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildISODateTime(date: string, time: string): string {
  if (!date || !time) return "";
  try {
    return new Date(`${date}T${time}:00`).toISOString();
  } catch {
    return "";
  }
}

// Mappe les données backend brouillon/voyage/ligne vers le formulaire
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

// Mappe les données LigneService vers formulaire (from-ligne mode)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  // ── Lecture des query params ──────────────────────────────────────────────
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

  // ── États ─────────────────────────────────────────────────────────────────
  const [agenceId, setAgenceId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<StepIndex>(0);
  const [isLoadingResources, setIsLoadingResources] = useState(false);
  const [isLoadingPrefill, setIsLoadingPrefill] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [brouillonId, setBrouillonId] = useState<string | null>(draftId);
  const [brouillonStatut, setBrouillonStatut] = useState<string | null>(null);

  // Ressources
  const [vehicules, setVehicules] = useState<VehiculeOption[]>([]);
  const [chauffeurs, setChauffeurs] = useState<ChauffeurOption[]>([]);
  const [classes, setClasses] = useState<ClassVoyageOption[]>([]);
  const [gares, setGares] = useState<GareOption[]>([]);

  // ── React Hook Form ───────────────────────────────────────────────────────
  const form = useForm<TripPlannerFormData, unknown, TripPlannerFormInput>({
    resolver: zodResolver(tripPlannerSchema) as never,
    defaultValues: tripPlannerDefaults as TripPlannerFormData,
    mode: "onChange",
  });

  // ── Résolution agenceId depuis userId ─────────────────────────────────────
  useEffect(() => {
    if (isUserLoading || !userData?.userId) return;
    getAgencyByChefId(userData.userId)
      .then((agency) => {
        if (agency?.agencyId) setAgenceId(agency.agencyId);
        else
          setGlobalError(
            "Impossible de résoudre l'agence de l'utilisateur connecté.",
          );
      })
      .catch(() => setGlobalError("Erreur lors du chargement de l'agence."));
  }, [userData, isUserLoading]);

  // ── Chargement des ressources (véhicules, chauffeurs, classes, gares) ─────
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

  // ── Pré-remplissage selon le mode ─────────────────────────────────────────
  useEffect(() => {
    if (!agenceId) return;

    if (mode === "edit" && editingId) {
      setIsLoadingPrefill(true);
      getVoyageForEdit(editingId)
        .then((data) => {
          if (data)
            form.reset({ ...tripPlannerDefaults, ...mapToFormData(data) });
        })
        .finally(() => setIsLoadingPrefill(false));
    } else if (mode === "draft" && draftId) {
      setIsLoadingPrefill(true);
      getBrouillonForEdit(draftId)
        .then((data) => {
          if (data) {
            form.reset({ ...tripPlannerDefaults, ...mapToFormData(data) });
            setBrouillonStatut(String(data.statutBrouillon ?? ""));
          }
        })
        .finally(() => setIsLoadingPrefill(false));
    } else if (mode === "from-ligne" && fromLigneId) {
      setIsLoadingPrefill(true);
      getLigneServiceForPrefill(fromLigneId)
        .then((data) => {
          if (data) {
            form.reset({
              ...tripPlannerDefaults,
              ...mapLigneToFormData(data, prefillDate ?? ""),
            });
          }
        })
        .finally(() => setIsLoadingPrefill(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agenceId, mode]);

  // ── Navigation entre étapes ───────────────────────────────────────────────
  const TOTAL_STEPS = 4;

  const goNext = useCallback(async () => {
    if (currentStep >= 3) return;
    // Valider uniquement les champs de l'étape courante
    if (currentStep < 3) {
      const schema = stepSchemas[currentStep as 0 | 1 | 2];
      const stepFields = Object.keys(
        schema.shape,
      ) as (keyof TripPlannerFormData)[];
      const valid = await form.trigger(stepFields);
      if (!valid) return;
    }
    setCurrentStep((s) => (s + 1) as StepIndex);
  }, [currentStep, form]);

  const goBack = useCallback(() => {
    if (currentStep > 0) setCurrentStep((s) => (s - 1) as StepIndex);
  }, [currentStep]);

  const goToStep = useCallback((step: StepIndex) => {
    setCurrentStep(step);
  }, []);

  // ── Soumission ────────────────────────────────────────────────────────────

  /** Sauvegarder en brouillon */
  const saveDraft = useCallback(async () => {
    if (!agenceId) return;
    setIsSubmitting(true);
    setGlobalError(null);
    const values = form.getValues();

    const payload: BrouillonCreateDTO = {
      agenceVoyageId: agenceId,
      titre: values.titre,
      description: values.description,
      lieuDepart: values.lieuDepart,
      lieuArrive: values.lieuArrive,
      pointDeDepart: values.pointDeDepart,
      pointArrivee: values.pointArrivee,
      dateDepartPrev: values.dateDepartPrev
        ? buildISODateTime(
            values.dateDepartPrev,
            values.heureDepartEffectif ?? "00:00",
          )
        : undefined,
      heureDepartEffectif: values.heureDepartEffectif,
      heureArrive: values.heureArrive,
      dureeEstimee: values.dureeEstimee,
      vehiculeId: values.vehiculeId || null,
      chauffeurId: values.chauffeurId || null,
      classVoyageId: values.classVoyageId || null,
      nbrPlaceReservable: values.nbrPlaceReservable,
      prix: values.prix,
      amenities: values.amenities,
      smallImage: values.smallImage || null,
      bigImage: values.bigImage || null,
      dateLimiteReservation: values.dateLimiteReservation
        ? new Date(values.dateLimiteReservation).toISOString()
        : null,
      dateLimiteConfirmation: values.dateLimiteConfirmation
        ? new Date(values.dateLimiteConfirmation).toISOString()
        : null,
      ligneServiceId: fromLigneId ?? null,
    };

    try {
      let result;
      if (mode === "draft" && brouillonId) {
        result = await updateBrouillon(brouillonId, payload);
      } else {
        result = await createBrouillon(payload);
        if (result.success && result.data) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const newId =
            (result.data as any).id ?? (result.data as any).idBrouillon;
          if (newId) setBrouillonId(newId);
        }
      }

      if (result.success) {
        setSuccessMessage("Brouillon sauvegardé avec succès.");
        setTimeout(() => router.push("/dashboard/drafts"), 1500);
      } else {
        setGlobalError(result.error ?? "Erreur lors de la sauvegarde.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [agenceId, form, mode, brouillonId, fromLigneId, router]);

  /** Créer et publier directement */
  const createAndPublish = useCallback(async () => {
    if (!agenceId) return;
    const valid = await form.trigger();
    if (!valid) {
      setGlobalError("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    setIsSubmitting(true);
    setGlobalError(null);
    const values = form.getValues();

    if (mode === "edit" && editingId) {
      // Mode modification voyage existant
      const result = await updateVoyage(editingId, {
        titre: values.titre,
        lieuDepart: values.lieuDepart,
        lieuArrive: values.lieuArrive,
        pointDeDepart: values.pointDeDepart,
        pointArrivee: values.pointArrivee,
        dateDepartPrev: buildISODateTime(
          values.dateDepartPrev,
          values.heureDepartEffectif,
        ),
        heureDepartEffectif: values.heureDepartEffectif,
        heureArrive: values.heureArrive,
        vehiculeId: values.vehiculeId || undefined,
        chauffeurId: values.chauffeurId || undefined,
        classVoyageId: values.classVoyageId || undefined,
        nbrPlaceReservable: values.nbrPlaceReservable,
        prix: values.prix,
        amenities: values.amenities,
      });
      if (result.success) {
        setSuccessMessage("Voyage modifié avec succès.");
        setTimeout(() => router.push("/dashboard/marketplace"), 1500);
      } else {
        setGlobalError(result.error ?? "Erreur lors de la modification.");
      }
      setIsSubmitting(false);
      return;
    }

    if (mode === "draft" && brouillonId && brouillonStatut === "PRET") {
      // Publier le brouillon existant
      const result = await publierBrouillon(brouillonId);
      if (result.success) {
        setSuccessMessage("Voyage publié avec succès !");
        setTimeout(() => router.push("/dashboard/marketplace"), 1500);
      } else {
        setGlobalError(result.error ?? "Erreur lors de la publication.");
      }
      setIsSubmitting(false);
      return;
    }

    // Création directe d'un voyage publié
    const voyagePayload: VoyageCreateDTO = {
      agenceVoyageId: agenceId,
      titre: values.titre,
      lieuDepart: values.lieuDepart,
      lieuArrive: values.lieuArrive,
      pointDeDepart: values.pointDeDepart,
      pointArrivee: values.pointArrivee,
      dateDepartPrev: buildISODateTime(
        values.dateDepartPrev,
        values.heureDepartEffectif,
      ),
      heureDepartEffectif: values.heureDepartEffectif,
      heureArrive: values.heureArrive,
      dureeEstimee: values.dureeEstimee,
      classVoyageId: values.classVoyageId ?? "",
      vehiculeId: values.vehiculeId ?? "",
      chauffeurId: values.chauffeurId || null,
      nbrPlaceReservable: values.nbrPlaceReservable,
      prix: values.prix,
      amenities: values.amenities,
      smallImage: values.smallImage || null,
      bigImage: values.bigImage || null,
      dateLimiteReservation: values.dateLimiteReservation
        ? new Date(values.dateLimiteReservation).toISOString()
        : null,
      dateLimiteConfirmation: values.dateLimiteConfirmation
        ? new Date(values.dateLimiteConfirmation).toISOString()
        : null,
      description: values.description,
      voyageBrouillonId: brouillonId,
    };

    const createResult = await createVoyage(voyagePayload);
    if (!createResult.success) {
      setGlobalError(createResult.error ?? "Erreur lors de la création.");
      setIsSubmitting(false);
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newVoyageId =
      (createResult.data as any)?.idVoyage ?? (createResult.data as any)?.id;
    if (newVoyageId) {
      await publierVoyage(newVoyageId);
    }
    setSuccessMessage("Voyage créé et publié avec succès !");
    setTimeout(() => router.push("/dashboard/marketplace"), 1500);
    setIsSubmitting(false);
  }, [agenceId, form, mode, editingId, brouillonId, brouillonStatut, router]);

  // ── Labels de mode ────────────────────────────────────────────────────────
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
      ? "Renseignez les ressources manquantes, puis publiez ou sauvegardez."
      : mode === "from-ligne"
        ? "Voyage pré-rempli depuis votre planning récurrent. Choisissez la date et les ressources."
        : mode === "edit"
          ? "Modifiez les informations du voyage."
          : "Créez un nouveau voyage ou sauvegardez-le en brouillon.";

  const canPublish = mode !== "draft" || brouillonStatut === "PRET";

  return {
    // Form
    form,

    // Navigation
    currentStep,
    totalSteps: TOTAL_STEPS,
    isLastStep: currentStep === TOTAL_STEPS - 1,
    goNext,
    goBack,
    goToStep,

    // États
    agenceId,
    mode,
    isLoadingResources,
    isLoadingPrefill,
    isSubmitting,
    globalError,
    successMessage,
    setGlobalError,

    // Ressources
    vehicules,
    chauffeurs,
    classes,
    gares,

    // Brouillon
    brouillonId,
    brouillonStatut,
    canPublish,

    // Labels
    pageTitle,
    pageSubtitle,

    // Actions
    saveDraft,
    createAndPublish,
  };
}
