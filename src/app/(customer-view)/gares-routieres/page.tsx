"use client";
/**
 * /agency/[agencyId]/page.tsx — Profil public d'une agence (P-05)
 *
 * RESTAURÉE — ce fichier avait été écrasé par le code de la page liste.
 *
 * Structure :
 *   - Header : cover + logo + nom + statut + localisation
 *   - Onglets : [Voyages] [Moyens de paiement] [À propos]
 *   - Empty states soignés pour chaque onglet
 *
 * Sources :
 *   - GET /agence/{id}/public            → profil agence
 *   - GET /voyage/agence/{id}/public     → voyages publiés (paginé)
 */

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Globe,
  Bus,
  Calendar,
  Info,
  AlertCircle,
  Clock,
  CreditCard,
  Star,
  Mail,
  Phone,
  Sparkles,
} from "lucide-react";
import apiClient from "@/lib/api/api-client";
import { getAgencePublic } from "@/lib/services/agency-service";
import { isMoyenPaiementObject } from "@/lib/types/agence.types";
import type { AgenceVoyageFull, MoyenPaiement } from "@/lib/types/agence.types";

type Tab = "voyages" | "paiement" | "apropos";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type VoyagePreview = any; // VoyagePreviewDTO du backend

// ─── Sous-composants ──────────────────────────────────────────────────────────

function VoyageCard({ voyage }: { voyage: VoyagePreview }) {
  const departure = voyage.dateDepartPrev
    ? new Date(voyage.dateDepartPrev)
    : null;

  return (
    <Link
      href={`/market-place/trip/${voyage.idVoyage}`}
      className="group block bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 hover:border-blue-200 transition-all duration-300"
    >
      <div className="relative h-32 bg-gradient-to-br from-blue-500 to-indigo-700 overflow-hidden">
        {voyage.smallImage && (
          <Image
            src={voyage.smallImage}
            alt={voyage.titre ?? "Voyage"}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            unoptimized
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {voyage.nomClasseVoyage && (
          <span className="absolute top-2 right-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-white/95 text-blue-700 rounded-full">
            {voyage.nomClasseVoyage}
          </span>
        )}
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
          <span className="truncate">{voyage.lieuDepart}</span>
          <span className="text-blue-500">→</span>
          <span className="truncate">{voyage.lieuArrive}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          {departure && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {departure.toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "short",
              })}
            </span>
          )}
          {voyage.heureDepartEffectif && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {voyage.heureDepartEffectif}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          {voyage.prix != null && (
            <p className="font-bold text-blue-600">
              {Number(voyage.prix).toLocaleString("fr-FR")}{" "}
              <span className="text-xs text-gray-400">FCFA</span>
            </p>
          )}
          {voyage.nbrPlaceRestante != null && (
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                voyage.nbrPlaceRestante === 0
                  ? "bg-red-50 text-red-600"
                  : voyage.nbrPlaceRestante <= 5
                    ? "bg-orange-50 text-orange-600"
                    : "bg-green-50 text-green-700"
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

function PaymentMethod({ moyen }: { moyen: string | MoyenPaiement }) {
  // Normalise en string pour l'affichage simple
  const label = isMoyenPaiementObject(moyen)
    ? moyen.nomOperateur || moyen.type
    : moyen;

  // Choisit une couleur selon le type de paiement
  const colors: Record<string, string> = {
    ORANGE: "from-orange-500 to-orange-600",
    MTN: "from-yellow-500 to-yellow-600",
    EXPRESS: "from-blue-500 to-blue-600",
    YUP: "from-purple-500 to-purple-600",
    CASH: "from-green-500 to-green-600",
  };
  const colorKey = Object.keys(colors).find((k) =>
    label.toUpperCase().includes(k),
  );
  const gradient = colorKey ? colors[colorKey] : "from-gray-500 to-gray-600";

  return (
    <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all">
      <div
        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-sm`}
      >
        <CreditCard className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-gray-900 truncate">{label}</p>
        {isMoyenPaiementObject(moyen) && moyen.codeMarchand && (
          <p className="text-xs text-gray-500 mt-0.5">
            Code marchand :{" "}
            <span className="font-mono">{moyen.codeMarchand}</span>
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function AgencyDetailPage() {
  const params = useParams<{ agencyId: string }>();
  const router = useRouter();
  const agencyId = params.agencyId;

  const [agency, setAgency] = useState<AgenceVoyageFull | null>(null);
  const [voyages, setVoyages] = useState<VoyagePreview[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("voyages");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!agencyId) return;
    const load = async () => {
      try {
        const agencyData = await getAgencePublic(agencyId);
        if (!agencyData) {
          setError("Agence introuvable");
          return;
        }
        setAgency(agencyData);

        // Charger les voyages publics de l'agence (peut échouer sans bloquer)
        try {
          const voyagesRes = await apiClient.get(
            `/voyage/agence/${agencyId}/public`,
            { params: { page: 0, size: 12 } },
          );
          const data = voyagesRes.data;
          setVoyages(Array.isArray(data) ? data : (data?.content ?? []));
        } catch (e) {
          console.warn("[agency-detail] Voyages indisponibles :", e);
        }
      } catch {
        setError("Erreur lors du chargement du profil de l'agence.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [agencyId]);

  // ─── État de chargement ─────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-full -mx-4 -mt-4">
        <div className="h-64 bg-gradient-to-br from-blue-700 to-indigo-900 animate-pulse" />
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-4">
          <div className="h-12 bg-gray-100 rounded-2xl animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-48 bg-gray-100 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── État d'erreur ──────────────────────────────────────────────────────
  if (error || !agency) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
          <AlertCircle className="w-10 h-10 text-red-400" />
        </div>
        <p className="text-gray-700 font-semibold text-lg">
          {error ?? "Agence introuvable"}
        </p>
        <button
          onClick={() => router.push("/agency")}
          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Retour aux agences
        </button>
      </div>
    );
  }

  const isSuspendue = agency.statutAgence === "SUSPENDUE";
  const initials = (agency.shortName ?? agency.longName ?? "A")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-full -mx-4 -mt-4">
      {/* ═══════════════════════════════════════════════════════════════════
          HEADER
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 px-4 pt-8 pb-24">
        {/* Pattern décoratif */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <Link
            href="/agency"
            className="inline-flex items-center gap-1 text-blue-200 hover:text-white text-sm font-medium mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Toutes les agences
          </Link>

          <div className="flex flex-col sm:flex-row items-start gap-5">
            {/* Logo */}
            <div className="w-20 h-20 rounded-2xl bg-white shadow-xl ring-4 ring-white/20 flex items-center justify-center overflow-hidden shrink-0">
              {agency.logoUrl ? (
                <Image
                  src={agency.logoUrl}
                  alt={agency.shortName ?? ""}
                  width={80}
                  height={80}
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <span className="text-blue-600 font-bold text-2xl">
                  {initials}
                </span>
              )}
            </div>

            {/* Identité */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                  {agency.longName}
                </h1>
                {isSuspendue && (
                  <span className="inline-flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    <AlertCircle className="w-3 h-3" />
                    Suspendue
                  </span>
                )}
                {agency.rating != null && agency.rating > 0 && (
                  <span className="inline-flex items-center gap-1 bg-yellow-400 text-yellow-900 text-xs font-bold px-2.5 py-1 rounded-full">
                    <Star className="w-3 h-3 fill-current" />
                    {agency.rating.toFixed(1)}
                  </span>
                )}
              </div>
              {agency.shortName && (
                <p className="text-blue-200 text-sm font-medium">
                  {agency.shortName}
                </p>
              )}
              {agency.location && (
                <div className="flex items-center gap-1 text-blue-100 mt-2 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{agency.location}</span>
                </div>
              )}
              {agency.greetingMessage && (
                <p className="text-white/90 text-sm mt-3 italic max-w-2xl">
                  &laquo; {agency.greetingMessage} &raquo;
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          BARRE D'ONGLETS (chevauche le header)
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="relative -mt-12 px-4 z-10">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-1.5 flex gap-1 overflow-x-auto">
          {(
            [
              {
                id: "voyages",
                label: "Voyages",
                icon: Bus,
                count: voyages.length,
              },
              {
                id: "paiement",
                label: "Moyens de paiement",
                icon: CreditCard,
                count: agency.moyensPaiement?.length ?? 0,
              },
              { id: "apropos", label: "À propos", icon: Info },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap
                  ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {"count" in tab && tab.count != null && tab.count > 0 && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          CONTENU DES ONGLETS
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* ── Onglet Voyages ──────────────────────────────────────────────── */}
        {activeTab === "voyages" && (
          <>
            {voyages.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
                  <Bus className="w-10 h-10 text-blue-300" />
                </div>
                <p className="text-gray-700 font-semibold text-lg">
                  Aucun voyage publié
                </p>
                <p className="text-gray-500 text-sm mt-1 max-w-md mx-auto">
                  Cette agence n&apos;a pas de voyages disponibles à la
                  réservation pour le moment.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {voyages.map((v) => (
                  <VoyageCard key={v.idVoyage} voyage={v} />
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Onglet Moyens de paiement ───────────────────────────────────── */}
        {activeTab === "paiement" && (
          <>
            {!agency.moyensPaiement || agency.moyensPaiement.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
                  <CreditCard className="w-10 h-10 text-blue-300" />
                </div>
                <p className="text-gray-700 font-semibold text-lg">
                  Aucun moyen de paiement configuré
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  L&apos;agence n&apos;a pas encore renseigné ses options de
                  paiement.
                </p>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-4">
                  Cette agence accepte les moyens de paiement suivants :
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {agency.moyensPaiement.map((m, idx) => (
                    <PaymentMethod
                      key={isMoyenPaiementObject(m) ? m.id : `${m}-${idx}`}
                      moyen={m}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* ── Onglet À propos ─────────────────────────────────────────────── */}
        {activeTab === "apropos" && (
          <div className="space-y-5">
            {/* Description */}
            {agency.description ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  <h2 className="font-semibold text-gray-900">Présentation</h2>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {agency.description}
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
                <p className="text-sm text-gray-400 italic">
                  Aucune description disponible.
                </p>
              </div>
            )}

            {/* Spécialités */}
            {agency.specialties && agency.specialties.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-semibold text-gray-900 mb-3">
                  Spécialités
                </h2>
                <div className="flex flex-wrap gap-2">
                  {agency.specialties.map((s) => (
                    <span
                      key={s}
                      className="text-xs bg-blue-50 text-blue-700 font-medium px-3 py-1 rounded-full border border-blue-100"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact */}
            {(agency.contact || agency.socialNetwork) && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-semibold text-gray-900 mb-3">Contact</h2>
                <div className="space-y-2.5">
                  {agency.contact?.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                      <a
                        href={`mailto:${agency.contact.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {agency.contact.email}
                      </a>
                    </div>
                  )}
                  {agency.contact?.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-blue-500 shrink-0" />
                      <a
                        href={`tel:${agency.contact.phone}`}
                        className="text-blue-600 hover:underline"
                      >
                        {agency.contact.phone}
                      </a>
                    </div>
                  )}
                  {(agency.contact?.website || agency.socialNetwork) && (
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="w-4 h-4 text-blue-500 shrink-0" />
                      <a
                        href={agency.contact?.website ?? agency.socialNetwork}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline truncate"
                      >
                        {agency.contact?.website ?? agency.socialNetwork}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
// END OF FILE: src/app/(customer-view)/agency/[agencyId]/page.tsx
