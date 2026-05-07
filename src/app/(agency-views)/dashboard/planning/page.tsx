// src/app/(agency-views)/dashboard/planning/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useAgencyPublicDetails } from "@/lib/hooks/agency-public-hooks/useAgencyPublicDetails";
import Loader from "@/modals/Loader";
import { Frown } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import WeeklySchedule from "@/components/agencies-page-components/WeeklySchedule";
import EditableAgencyInfo from "@/components/dashboard-planner-page/EditableAgencyInfo";
import EditableAgencyContact from "@/components/dashboard-planner-page/EditableAgencyContact";
import EditableAgencySpecialties from "@/components/dashboard-planner-page/EditableAgencySpecialties";
import { useBusStation } from "@/context/Provider";
import { getAgencyByChefId } from "@/lib/services/agency-service";

export default function AgencyPlanningPage() {
  // ⚙️ BLOC 4 : on récupère le vrai agencyId du chef connecté
  // (et plus une valeur hardcodée "agency-01" comme avant la liaison API).
  const { userData } = useBusStation();
  const [agencyId, setAgencyId] = useState<string | null>(null);
  const [agencyResolveError, setAgencyResolveError] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!userData?.userId) return;
    getAgencyByChefId(userData.userId)
      .then((agency) => {
        if (agency?.agencyId) {
          setAgencyId(agency.agencyId);
        } else {
          setAgencyResolveError("Aucune agence n'est associée à votre compte.");
        }
      })
      .catch((err) => {
        console.error(err);
        setAgencyResolveError(
          "Impossible de récupérer votre agence. Veuillez réessayer.",
        );
      });
  }, [userData?.userId]);

  // Détails de l'agence (profil, spécialités, contact)
  const { agency, isLoading, error, refetch } = useAgencyPublicDetails(
    agencyId ?? "",
  );

  // Phase 1 : résolution de l'agencyId
  if (!agencyId && !agencyResolveError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader message="Récupération de votre agence..." />
      </div>
    );
  }

  if (agencyResolveError) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 mt-20">
        <Frown className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Erreur</h2>
        <p className="text-gray-500 mt-2">{agencyResolveError}</p>
      </div>
    );
  }

  // Phase 2 : chargement des détails de l'agence
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader message="Chargement des informations de l'agence..." />
      </div>
    );
  }

  if (error || !agency) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 mt-20">
        <Frown className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">
          Erreur de chargement
        </h2>
        <p className="text-gray-500 mt-2">
          {error || "Les informations de l'agence n'ont pas pu être chargées."}
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-gray-50 min-h-screen">
      <PageHeader
        title="Gestion du Profil et Planning"
        subtitle="Visualisez et modifiez les informations publiques de votre agence et votre planning hebdomadaire."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <EditableAgencyInfo agency={agency} refetch={refetch} />
          <EditableAgencySpecialties
            agencyId={agency.agencyId}
            specialties={agency.specialties}
            refetch={refetch}
          />
        </div>
        <div className="lg:col-span-1">
          <EditableAgencyContact
            agencyId={agency.agencyId}
            contact={agency.contact}
            refetch={refetch}
          />
        </div>
      </div>

      {/* The Weekly Schedule component is self-contained and fetches its own data */}
      <WeeklySchedule agencyId={agency.agencyId} isEditable={true} />
    </div>
  );
}
// END OF FILE: src/app/(agency-views)/dashboard/planning/page.tsx
