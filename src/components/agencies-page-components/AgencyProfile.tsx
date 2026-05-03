"use client";
/**
 * AgencyProfile.tsx  (reconstruit — P-05)
 *
 * Profil public complet d'une agence : header, onglets, planning, moyens de paiement.
 * Retypé avec AgenceVoyageFull. Plus de champs mock (rating, specialties, contact).
 *
 * Structure :
 *   - Header : logo, nom, description, localisation, réseaux sociaux
 *   - Onglets : [Voyages] [Planning] [À propos]
 *   - Section Moyens de paiement (toujours visible, hors onglets)
 */

import { isMoyenPaiementObject } from "@/lib/types/agence.types";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Globe,
  Bus,
  Calendar,
  Info,
  Ticket,
  Clock,
  Users,
  AlertCircle,
} from "lucide-react";
import WeeklySchedule from "@/components/agencies-page-components/WeeklySchedule";
import PaymentMethodsSection from "@/components/agencies-page-components/PaymentMethodsSection";
import type { AgenceVoyageFull } from "@/lib/types/agence.types";
import type { VoyagePreviewFull } from "@/lib/types/voyage.types";
import type { LigneService } from "@/lib/types/ligne-service.types";

type Tab = "voyages" | "planning" | "apropos";

interface AgencyProfileProps {
  agency: AgenceVoyageFull;
  trips: VoyagePreviewFull[];
  agencyId: string;
  onBack: () => void;
}

// ── Carte voyage preview ──────────────────────────────────────────────────────
function VoyageCard({ voyage }: { voyage: VoyagePreviewFull }) {
  return (
    <Link
      href={`/market-place/trip/${voyage.idVoyage}`}
      className="block bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all"
    >
      {voyage.smallImage && (
        <div className="relative h-32 bg-gray-100">
          <Image
            src={voyage.smallImage}
            alt={voyage.titre ?? "Voyage"}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      )}
      <div className="p-3 space-y-1.5">
        <p className="font-semibold text-gray-800 text-sm line-clamp-1">
          {voyage.lieuDepart} → {voyage.lieuArrive}
        </p>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Clock className="w-3.5 h-3.5" />
          <span>{voyage.heureDepartEffectif ?? "—"}</span>
          {voyage.nomClasseVoyage && (
            <span className="ml-1 px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-medium">
              {voyage.nomClasseVoyage}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          {voyage.prix != null && (
            <p className="text-sm font-bold text-primary">
              {voyage.prix.toLocaleString("fr-FR")} FCFA
            </p>
          )}
          {voyage.nbrPlaceRestante != null && (
            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                voyage.nbrPlaceRestante === 0
                  ? "bg-red-50 text-red-500"
                  : voyage.nbrPlaceRestante <= 5
                    ? "bg-orange-50 text-orange-500"
                    : "bg-green-50 text-green-600"
              }`}
            >
              {voyage.nbrPlaceRestante === 0
                ? "Complet"
                : `${voyage.nbrPlaceRestante} places`}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

// ── Composant principal ───────────────────────────────────────────────────────
export default function AgencyProfile({
  agency,
  trips,
  agencyId,
  onBack,
}: AgencyProfileProps) {
  const [activeTab, setActiveTab] = useState<Tab>("voyages");
  const isSuspendue = agency.statutAgence === "SUSPENDUE";

  const tabs: {
    id: Tab;
    label: string;
    icon: React.ReactNode;
    count?: number;
  }[] = [
    {
      id: "voyages",
      label: "Voyages",
      icon: <Ticket size={15} />,
      count: trips.length,
    },
    { id: "planning", label: "Planning", icon: <Calendar size={15} /> },
    { id: "apropos", label: "À propos", icon: <Info size={15} /> },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Bouton retour */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition"
      >
        <ArrowLeft size={16} />
        Retour aux agences
      </button>

      {/* Badge suspension */}
      {isSuspendue && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          <AlertCircle size={16} />
          Cette agence est temporairement suspendue. Les réservations ne sont
          pas disponibles.
        </div>
      )}

      {/* Header agence */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start gap-5 p-6">
          {/* Logo */}
          <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-gray-100 shrink-0 bg-gray-50">
            {agency.logoUrl ? (
              <Image
                src={agency.logoUrl}
                alt={agency.longName ?? "Logo agence"}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Bus className="w-8 h-8 text-gray-300" />
              </div>
            )}
          </div>

          {/* Infos */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 truncate">
              {agency.longName}
            </h1>
            {agency.shortName && (
              <p className="text-sm text-gray-400 mt-0.5">{agency.shortName}</p>
            )}

            <div className="flex flex-wrap gap-3 mt-3">
              {agency.location && (
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin size={13} className="shrink-0" />
                  {agency.location}
                </span>
              )}
              {agency.socialNetwork && (
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Globe size={13} className="shrink-0" />
                  {agency.socialNetwork}
                </span>
              )}
            </div>

            {agency.greetingMessage && (
              <p className="mt-3 text-sm text-gray-600 italic">
                &ldquo;{agency.greetingMessage}&rdquo;
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <nav className="flex border-b border-gray-100">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-medium border-b-2 transition
                ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
            >
              {tab.icon}
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full font-semibold
                    ${activeTab === tab.id ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-500"}`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-5">
          {/* Onglet Voyages */}
          {activeTab === "voyages" && (
            <div>
              {trips.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Ticket className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">
                    Aucun voyage disponible pour le moment.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trips.map((v) => (
                    <VoyageCard key={v.idVoyage} voyage={v} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Onglet Planning */}
          {activeTab === "planning" && (
            <div>
              <p className="text-xs text-gray-400 mb-4">
                Horaires habituels de l'agence — pour réserver, consultez
                l'onglet Voyages.
              </p>
              <WeeklySchedule agencyId={agencyId} isEditable={false} />
            </div>
          )}

          {/* Onglet À propos */}
          {activeTab === "apropos" && (
            <div className="space-y-4 text-sm text-gray-600">
              {agency.description ? (
                <p className="leading-relaxed">{agency.description}</p>
              ) : (
                <p className="text-gray-400">Aucune description disponible.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Section Moyens de paiement — toujours visible */}
      <PaymentMethodsSection
        moyensPaiement={agency.moyensPaiement?.filter(isMoyenPaiementObject)}
      />
    </div>
  );
}
