"use client";
/**
 * useTripPlanner.ts  (étendu — P-20)
 *
 * Étend le hook existant avec deux nouveaux modes via query params :
 *   ?edit={id}        → EXISTANT, inchangé
 *   ?draft={id}       → NOUVEAU : pré-rempli depuis un VoyageBrouillon
 *   ?from-ligne={id}  → NOUVEAU : pré-rempli depuis une LigneService
 *   ?date={YYYY-MM-DD}→ NOUVEAU : date pré-remplie (utilisé avec from-ligne)
 *
 * Deux nouvelles actions de soumission :
 *   - handleSaveAsDraft()  → crée/met à jour un VoyageBrouillon
 *   - handlePublish()      → existant, crée un Voyage publié
 *
 * ⚠️ Les parties existantes (resources loading, form, isEditMode) sont conservées
 *    à l'identique pour ne pas casser TripPlannerForm.tsx.
 */

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import {
  TripPlannerFormType,
  tripPlannerSchema,
} from "@/lib/types/schema/tripSchema";
import { useBusStation } from "@/context/Provider";
import { getAgencyByChefId } from "@/lib/services/agency-service";
import {
  createTrip,
  updateTrip,
  getTripDetailsForEdit,
} from "@/lib/services/trip-service";
import { getVehiclesByAgency } from "@/lib/services/vehicule-service";
import { getDriversByAgency } from "@/lib/services/chauffeur-service";
import { getAllClassVoyagesByAgence } from "@/lib/services/class-voyage-service";
import {
  Vehicule,
  VoyageCreateRequestDTO,
  ClassVoyage,
} from "@/lib/types/generated-api";
import { Customer } from "@/lib/types/models/BusinessActor";
import { Amenity } from "@/lib/types/generated-api/models/VoyageCreateRequestDTO";
// ── Nouveaux imports P-20 ────────────────────────────────────────────────────
import {
  getBrouillonById,
  createBrouillon,
  updateBrouillon,
} from "@/lib/services/voyage-brouillon-service";
import { getPlannerTripsByAgencyId } from "@/lib/services/planner-trip-service";
import type { VoyageBrouillon } from "@/lib/types/voyage.types";
import type { LigneService } from "@/lib/types/ligne-service.types";

type ResourceState<T> = {
  data: T[];
  isLoading: boolean;
  error: string | null;
};

const toISODateTime = (date: string, time: string): string =>
  new Date(`${date}T${time}:00`).toISOString();

export function useTripPlanner() {
  const { userData, isLoading: isUserLoading } = useBusStation();
  const router = useRouter();
  const searchParams = useSearchParams();

  // ── Query params ─────────────────────────────────────────────────────────
  const editingTripId = searchParams.get("edit");
  const draftId = searchParams.get("draft"); // NOUVEAU
  const fromLigneId = searchParams.get("from-ligne"); // NOUVEAU
  const prefillDate = searchParams.get("date"); // NOUVEAU

  // ── Mode détecté ─────────────────────────────────────────────────────────
  const isEditMode = !!editingTripId;
  const isDraftMode = !!draftId && !editingTripId;
  const isFromLigneMode = !!fromLigneId && !editingTripId && !draftId;

  // Label du mode pour l'affichage dans PageHeader
  const modeLabel = isEditMode
    ? "Modifier un Voyage"
    : isDraftMode
      ? "Compléter le brouillon"
      : isFromLigneMode
        ? "Générer un voyage"
        : "Planifier un Nouveau Voyage";

  const modeSubtitle = isDraftMode
    ? "Renseignez les ressources manquantes, puis publiez ou sauvegardez."
    : isFromLigneMode
      ? "Voyage pré-rempli depuis votre planning. Choisissez la date et les ressources."
      : undefined;

  // ── États ────────────────────────────────────────────────────────────────
  const [agencyId, setAgencyId] = useState<string | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(draftId); // NOUVEAU

  const [vehicles, setVehicles] = useState<ResourceState<Vehicule>>({
    data: [],
    isLoading: true,
    error: null,
  });
  const [drivers, setDrivers] = useState<ResourceState<Customer>>({
    data: [],
    isLoading: true,
    error: null,
  });
  const [travelClasses, setTravelClasses] = useState<
    ResourceState<ClassVoyage>
  >({ data: [], isLoading: true, error: null });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [formApiError, setFormApiError] = useState<string | null>(null);

  const form = useForm<TripPlannerFormType>({
    resolver: zodResolver(tripPlannerSchema),
  });

  // ── Chargement des ressources (inchangé) ─────────────────────────────────
  const loadResource = useCallback(
    async <T>(
      fetcher: () => Promise<T[] | null>,
      setter: React.Dispatch<React.SetStateAction<ResourceState<T>>>,
      resourceName: string,
    ) => {
      setter((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const data = await fetcher();
        setter({ data: data || [], isLoading: false, error: null });
      } catch {
        setter({
          data: [],
          isLoading: false,
          error: `Échec du chargement (${resourceName}).`,
        });
      }
    },
    [],
  );

  const reloadVehicles = useCallback(() => {
    if (agencyId)
      loadResource(
        () => getVehiclesByAgency(agencyId),
        setVehicles,
        "véhicules",
      );
  }, [agencyId, loadResource]);

  const reloadDrivers = useCallback(() => {
    if (agencyId)
      loadResource(
        () => getDriversByAgency(agencyId),
        setDrivers,
        "chauffeurs",
      );
  }, [agencyId, loadResource]);

  const reloadClasses = useCallback(() => {
    if (agencyId)
      loadResource(
        async () =>
          (await getAllClassVoyagesByAgence(agencyId)).filter(
            (c) => c.idAgenceVoyage === agencyId,
          ),
        setTravelClasses,
        "classes",
      );
  }, [agencyId, loadResource]);

  // ── Initialisation ───────────────────────────────────────────────────────
  useEffect(() => {
    if (isUserLoading || !userData?.userId) return;

    const initialize = async () => {
      try {
        const agency = await getAgencyByChefId(userData.userId);
        if (!agency?.agencyId) {
          setFormApiError("Agence non trouvée.");
          setIsPageLoading(false);
          return;
        }

        setAgencyId(agency.agencyId);
        form.setValue("agenceVoyageId", agency.agencyId);

        // Charger les ressources en parallèle
        await Promise.all([
          loadResource(
            () => getVehiclesByAgency(agency.agencyId),
            setVehicles,
            "véhicules",
          ),
          loadResource(
            () => getDriversByAgency(agency.agencyId),
            setDrivers,
            "chauffeurs",
          ),
          loadResource(
            async () =>
              (await getAllClassVoyagesByAgence(agency.agencyId)).filter(
                (c) => c.idAgenceVoyage === agency.agencyId,
              ),
            setTravelClasses,
            "classes",
          ),
        ]);

        // ── Mode EDIT (existant, inchangé) ──────────────────────────────
        if (editingTripId) {
          const tripDetails = await getTripDetailsForEdit(editingTripId);
          form.reset({
            titre: tripDetails.titre,
            description: tripDetails.description,
            lieuDepart: tripDetails.lieuDepart,
            pointDeDepart: tripDetails.pointDeDepart,
            lieuArrive: tripDetails.lieuArrive,
            pointArrivee: tripDetails.pointArrivee,
            dateDepartPrev: tripDetails.dateDepartPrev?.split("T")[0] || "",
            heureArrive:
              tripDetails.heureArrive?.split("T")[1].substring(0, 5) || "",
            heureDepartEffectif:
              tripDetails.heureDepartEffectif?.split("T")[1].substring(0, 5) ||
              "",
            dateLimiteReservation:
              tripDetails.dateLimiteReservation?.split("T")[0] || "",
            dateLimiteConfirmation:
              tripDetails.dateLimiteConfirmation?.split("T")[0] || "",
            nbrPlaceReservable: tripDetails.nbrPlaceReservable,
            vehiculeId: tripDetails.vehicule?.idVehicule,
            chauffeurId: tripDetails.chauffeur?.userId,
            classVoyageId: (tripDetails as any).classVoyageId,
            agenceVoyageId: agency.agencyId,
            amenities: tripDetails.amenities as Array<Amenity> | undefined,
          });
        }

        // ── Mode DRAFT — pré-remplir depuis un VoyageBrouillon ──────────
        if (isDraftMode && draftId) {
          try {
            const brouillon = await getBrouillonById(draftId);
            if (!brouillon) return;
            form.reset({
              titre: brouillon.titre,
              description: brouillon.notes ?? "",
              lieuDepart: brouillon.lieuDepart ?? "",
              pointDeDepart: brouillon.pointDeDepart ?? "",
              lieuArrive: brouillon.lieuArrive ?? "",
              pointArrivee: brouillon.pointArrivee ?? "",
              dateDepartPrev: brouillon.dateDepartPrev?.split("T")[0] ?? "",
              heureDepartEffectif: brouillon.heureDepartEffectif ?? "",
              heureArrive: brouillon.heureArrive ?? "",
              nbrPlaceReservable: brouillon.nbrPlaceReservable ?? undefined,
              vehiculeId: brouillon.vehiculeId ?? undefined,
              chauffeurId: brouillon.chauffeurId ?? undefined,
              classVoyageId: brouillon.classVoyageId ?? undefined,
              agenceVoyageId: agency.agencyId,
              amenities: (brouillon.amenities as Array<Amenity>) ?? [],
              smallImage: brouillon.smallImage ?? "",
              bigImage: brouillon.bigImage ?? "",
              dateLimiteReservation:
                brouillon.dateLimiteReservation?.split("T")[0] ?? "",
              dateLimiteConfirmation:
                brouillon.dateLimiteConfirmation?.split("T")[0] ?? "",
            });
            setCurrentDraftId(draftId);
          } catch {
            setFormApiError("Impossible de charger le brouillon.");
          }
        }

        // ── Mode FROM-LIGNE — pré-remplir depuis une LigneService ───────
        if (isFromLigneMode && fromLigneId) {
          try {
            const lignes = await getPlannerTripsByAgencyId(agency.agencyId);
            const ligne = lignes.find((l) => l.id === fromLigneId) as
              | LigneService
              | undefined;

            if (ligne) {
              const dateDep = prefillDate ?? "";
              form.reset({
                titre: `${ligne.lieuDepart} → ${ligne.lieuArrive}`,
                description: ligne.description ?? "",
                lieuDepart: ligne.lieuDepart,
                pointDeDepart: ligne.pointDeDepart ?? "",
                lieuArrive: ligne.lieuArrive,
                pointArrivee: ligne.pointArrivee ?? "",
                dateDepartPrev: dateDep,
                heureDepartEffectif: ligne.heureDepart,
                heureArrive: ligne.heureArrivee,
                classVoyageId: ligne.classVoyageId ?? undefined,
                agenceVoyageId: agency.agencyId,
                // Les ressources par défaut de l'agence seront pré-sélectionnées
                // une fois que l'agence étendra son modèle (P-23)
              });
            }
          } catch {
            setFormApiError("Impossible de charger la ligne de service.");
          }
        }
      } catch {
        setFormApiError("Erreur d'initialisation de la page.");
      } finally {
        setIsPageLoading(false);
      }
    };

    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData, isUserLoading]);

  // ── Soumission existante (publier / EN_ATTENTE) ───────────────────────────
  const handleSubmitForm = async (
    data: TripPlannerFormType,
    status: "EN_ATTENTE" | "PUBLIE",
  ) => {
    setIsSubmitting(true);
    setFormApiError(null);

    const { nbrPlaceReservable, ...restOfData } = data;
    const payload: VoyageCreateRequestDTO = {
      ...restOfData,
      nbrPlaceReservable,
      nbrPlaceRestante: nbrPlaceReservable,
      statusVoyage: status,
      heureArrive: toISODateTime(data.dateDepartPrev, data.heureArrive),
      heureDepartEffectif: toISODateTime(
        data.dateDepartPrev,
        data.heureDepartEffectif,
      ),
      nbrPlaceConfirm: 0,
      nbrPlaceReserve: 0,
    };

    try {
      if (editingTripId) {
        await updateTrip(editingTripId, payload);
        setSuccessMessage("Voyage mis à jour avec succès !");
      } else {
        await createTrip(payload);
        setSuccessMessage("Voyage créé avec succès !");
        // Si on publie depuis un brouillon, l'archiver
        if (currentDraftId) {
          await updateBrouillon(currentDraftId, {
            statutBrouillon: "CONVERTI",
          });
        }
      }
      setIsSuccess(true);
    } catch {
      setFormApiError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── NOUVELLE action : sauvegarder comme brouillon ─────────────────────────
  const handleSaveAsDraft = async () => {
    const data = form.getValues();
    if (!agencyId) return;
    setIsSubmitting(true);
    setFormApiError(null);

    // Calculer le statut : PRET si toutes ressources renseignées, sinon INCOMPLET
    const hasToutesRessources =
      !!data.vehiculeId &&
      !!data.chauffeurId &&
      !!data.nbrPlaceReservable &&
      !!data.dateDepartPrev &&
      !!data.classVoyageId;
    const statut = hasToutesRessources ? "PRET" : "INCOMPLET";

    try {
      const brouillonData = {
        agenceVoyageId: agencyId,
        ligneServiceId: fromLigneId ?? undefined,
        titre: data.titre,
        lieuDepart: data.lieuDepart,
        lieuArrive: data.lieuArrive,
        pointDeDepart: data.pointDeDepart ?? null,
        pointArrivee: data.pointArrivee ?? null,
        dateDepartPrev: data.dateDepartPrev
          ? new Date(
              `${data.dateDepartPrev}T${data.heureDepartEffectif}:00`,
            ).toISOString()
          : null,
        heureDepartEffectif: data.heureDepartEffectif ?? null,
        heureArrive: data.heureArrive ?? null,
        classVoyageId: data.classVoyageId ?? null,
        vehiculeId: data.vehiculeId ?? null,
        chauffeurId: data.chauffeurId ?? null,
        nbrPlaceReservable: data.nbrPlaceReservable ?? null,
        prix: null,
        amenities: (data.amenities as any) ?? [],
        smallImage: data.smallImage ?? null,
        bigImage: data.bigImage ?? null,
        dateLimiteReservation: data.dateLimiteReservation
          ? new Date(`${data.dateLimiteReservation}T23:59:00`).toISOString()
          : null,
        dateLimiteConfirmation: data.dateLimiteConfirmation
          ? new Date(`${data.dateLimiteConfirmation}T23:59:00`).toISOString()
          : null,
        statutBrouillon: statut as any,
        notes: data.description ?? null,
      };

      if (currentDraftId) {
        await updateBrouillon(currentDraftId, brouillonData);
        setSuccessMessage("Brouillon mis à jour !");
      } else {
        const newDraft = await createBrouillon(brouillonData);
        setCurrentDraftId(newDraft.id);
        setSuccessMessage(
          statut === "PRET"
            ? "Brouillon sauvegardé — prêt à publier !"
            : "Brouillon sauvegardé. Complétez les ressources manquantes.",
        );
      }
      setIsSuccess(true);
    } catch {
      setFormApiError("Erreur lors de la sauvegarde du brouillon.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = (data: TripPlannerFormType) =>
    handleSubmitForm(data, editingTripId ? "EN_ATTENTE" : "PUBLIE");

  return {
    // ── Existant (inchangé — TripPlannerForm l'utilise directement) ──────
    form,
    onSubmit: handleSubmitForm,
    isSubmitting,
    isSuccess,
    successMessage,
    setIsSuccess,
    formApiError,
    isEditMode,
    isPageLoading,
    vehicles,
    drivers,
    travelClasses,
    reloadVehicles,
    reloadDrivers,
    reloadClasses,
    // ── Nouveau ──────────────────────────────────────────────────────────
    isDraftMode,
    isFromLigneMode,
    modeLabel,
    modeSubtitle,
    currentDraftId,
    handleSaveAsDraft,
  };
}
