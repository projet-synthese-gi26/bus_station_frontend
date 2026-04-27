"use client";
/**
 * app/(agency-views)/dashboard/trip-planning/page.tsx  (mis à jour — P-20)
 *
 * Ajoute :
 *   - Lecture de ?draft= et ?from-ligne= via le hook étendu
 *   - Bouton "Sauvegarder en brouillon" à côté du bouton "Publier"
 *   - Titre et sous-titre dynamiques selon le mode
 *
 * TripPlannerForm.tsx n'est PAS modifié.
 * Le bouton "Sauvegarder en brouillon" est ajouté directement dans cette page,
 * en dehors du formulaire (appelle handleSaveAsDraft du hook).
 */

import { Suspense } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import TripPlannerForm from "@/components/dashboard/trip-planning/TripPlannerForm";
import { useTripPlanner } from "@/lib/hooks/dasboard/useTripPlanner";
import Loader from "@/modals/Loader";
import { FileEdit, Rocket } from "lucide-react";
import toast from "react-hot-toast";

function TripPlannerPageContent() {
  const tripPlanner = useTripPlanner();

  if (tripPlanner.isPageLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader />
      </div>
    );
  }

  const handleDraft = async () => {
    const toastId = toast.loading("Sauvegarde du brouillon...");
    try {
      await tripPlanner.handleSaveAsDraft();
      toast.success(tripPlanner.successMessage || "Brouillon sauvegardé !", {
        id: toastId,
      });
    } catch {
      toast.error("Erreur lors de la sauvegarde.", { id: toastId });
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title={tripPlanner.modeLabel}
        subtitle={
          tripPlanner.modeSubtitle ??
          (tripPlanner.isEditMode
            ? "Modifiez les informations du voyage et sauvegardez."
            : "Renseignez les détails pour créer et publier un nouveau voyage.")
        }
      />

      {/* Formulaire principal (inchangé) */}
      <TripPlannerForm hook={tripPlanner} />

      {/* Bouton "Sauvegarder en brouillon" — uniquement en mode création/draft/from-ligne */}
      {!tripPlanner.isEditMode && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleDraft}
            disabled={tripPlanner.isSubmitting}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium
              text-gray-700 border border-gray-200 bg-white rounded-xl
              hover:bg-gray-50 transition disabled:opacity-50"
          >
            <FileEdit size={16} />
            Sauvegarder en brouillon
          </button>
        </div>
      )}
    </div>
  );
}

export default function TripPlanningPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center py-20">
          <Loader />
        </div>
      }
    >
      <TripPlannerPageContent />
    </Suspense>
  );
}
