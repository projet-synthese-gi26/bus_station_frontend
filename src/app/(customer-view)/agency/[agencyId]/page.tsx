"use client";
/**
 * app/(customer-view)/agency/[agencyId]/page.tsx  (reconstruit — P-05)
 *
 * Page profil public d'une agence.
 * Charge agence + voyages + lignes de service via useAgencyPublicDetails.
 */

import { use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Frown } from "lucide-react";
import AgencyProfile from "@/components/agencies-page-components/AgencyProfile";
import Loader from "@/modals/Loader";
import { useAgencyPublicDetails } from "@/lib/hooks/agency-public-hooks/useAgencyPublicDetails";

export default function AgencyDetailPage({
  params,
}: {
  params: Promise<{ agencyId: string }>;
}) {
  const router = useRouter();
  const { agencyId } = use(params);
  const { agency, trips, isLoading, error } = useAgencyPublicDetails(agencyId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader message="Chargement du profil de l'agence..." />
      </div>
    );
  }

  if (error || !agency) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 mt-20 gap-4">
        <Frown className="w-14 h-14 text-gray-300" />
        <h2 className="text-2xl font-bold text-gray-700">Agence non trouvée</h2>
        <p className="text-gray-400 text-sm">
          {error ?? "L'agence demandée n'existe pas."}
        </p>
        <Link href="/agency">
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm hover:bg-primary/90 transition">
            <ArrowLeft size={15} />
            Retour à la liste des agences
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <AgencyProfile
        agency={agency}
        trips={trips}
        agencyId={agencyId}
        onBack={() => router.back()}
      />
    </div>
  );
}
