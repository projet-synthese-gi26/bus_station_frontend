"use client";
/**
 * /gares-routieres/[id]/page.tsx — Détail d'une gare routière (P-07)
 *
 * Design : header avec photo en cover, badge ouvert/fermé, infos + onglets.
 *
 * Sources :
 *   - GET /gare/{id}             → détail
 *   - GET /gare/{id}/agences     → agences affiliées
 *   - GET /gare/{id}/voyages?date=YYYY-MM-DD → départs du jour
 */

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  ArrowLeft,
  Building2,
  Bus,
  Clock,
  Info,
  Users,
  Calendar,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import {
  getGareById,
  getAgencesByGare,
  getVoyagesByGare,
} from "@/lib/services/gare-service";
import type { Gare } from "@/lib/types/gare.types";
import type { AgenceVoyageFull } from "@/lib/types/agence.types";

type Tab = "agences" | "departs" | "infos";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type VoyagePreview = any;

// ─── Sous-composants ──────────────────────────────────────────────────────────

function AgenceLineCard({ agence }: { agence: AgenceVoyageFull }) {
  const initials = (agence.shortName ?? agence.longName ?? "A")
    .slice(0, 2)
    .toUpperCase();
  return (
    <Link
      href={`/agency/${agence.agencyId}`}
      className="group flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all"
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 overflow-hidden">
        {agence.logoUrl ? (
          <Image
            src={agence.logoUrl}
            alt={agence.longName ?? ""}
            width={48}
            height={48}
            className="object-cover"
            unoptimized
          />
        ) : (
          <span className="text-white font-bold text-sm">{initials}</span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
          {agence.longName}
        </p>
        {agence.shortName && (
          <p className="text-xs text-gray-500 truncate">{agence.shortName}</p>
        )}
        {agence.location && (
          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3" /> {agence.location}
          </p>
        )}
      </div>
      {agence.statutAgence === "SUSPENDUE" && (
        <span className="ml-auto shrink-0 text-xs font-bold bg-red-50 text-red-600 px-2 py-0.5 rounded-full">
          Suspendue
        </span>
      )}
      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all shrink-0" />
    </Link>
  );
}

function DepartLineCard({ voyage }: { voyage: VoyagePreview }) {
  const heure = voyage.heureDepartEffectif ?? voyage.dateDepartPrev;
  const heureStr = heure
    ? new Date(
        typeof heure === "string" && heure.length <= 5
          ? `1970-01-01T${heure}`
          : heure,
      ).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    : "—";

  return (
    <Link
      href={`/market-place/trip/${voyage.idVoyage}`}
      className="group flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all"
    >
      <div className="text-center shrink-0 px-2 py-1 bg-blue-50 rounded-xl border border-blue-100 min-w-[60px]">
        <p className="font-bold text-blue-700 text-sm">{heureStr}</p>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
          <span className="truncate">{voyage.lieuDepart}</span>
          <ArrowRight className="w-3 h-3 text-blue-500 shrink-0" />
          <span className="truncate">{voyage.lieuArrive}</span>
        </div>
        {voyage.nomAgence && (
          <p className="text-xs text-gray-500 truncate mt-0.5">
            {voyage.nomAgence}
          </p>
        )}
      </div>
      {voyage.prix != null && (
        <div className="text-right shrink-0">
          <p className="font-bold text-blue-600 text-sm">
            {Number(voyage.prix).toLocaleString("fr-FR")}
          </p>
          <p className="text-[10px] text-gray-400">FCFA</p>
        </div>
      )}
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GareDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [gare, setGare] = useState<Gare | null>(null);
  const [agences, setAgences] = useState<AgenceVoyageFull[]>([]);
  const [departs, setDeparts] = useState<VoyagePreview[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("agences");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const today = new Date().toISOString().slice(0, 10);
        const [gareData, agencesData, voyagesData] = await Promise.all([
          getGareById(id),
          getAgencesByGare(id),
          getVoyagesByGare(id, { date: today, size: 20 }),
        ]);
        if (!gareData) {
          setError("Gare introuvable.");
          return;
        }
        setGare(gareData);
        setAgences(agencesData);
        setDeparts(voyagesData);
      } catch {
        setError("Erreur lors du chargement de la gare.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-full -mx-4 -mt-4">
        <div className="h-72 bg-gradient-to-br from-slate-700 to-blue-900 animate-pulse" />
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-4">
          <div className="h-12 bg-gray-100 rounded-2xl animate-pulse" />
          <div className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !gare) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
          <AlertCircle className="w-10 h-10 text-red-400" />
        </div>
        <p className="text-gray-700 font-semibold text-lg">
          {error ?? "Gare introuvable"}
        </p>
        <button
          onClick={() => router.push("/gares-routieres")}
          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Retour aux gares
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-full -mx-4 -mt-4">
      {/* ═══════════════════════════════════════════════════════════════════
          HEADER avec cover image
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden h-72 bg-gradient-to-br from-slate-700 via-blue-800 to-indigo-900">
        {gare.imageUrl && (
          <Image
            src={gare.imageUrl}
            alt={gare.nom}
            fill
            className="object-cover"
            unoptimized
          />
        )}
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />

        {/* Contenu header */}
        <div className="relative h-full max-w-5xl mx-auto px-4 pt-8 pb-6 flex flex-col">
          <Link
            href="/gares-routieres"
            className="inline-flex items-center gap-1 text-blue-200 hover:text-white text-sm font-medium transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4" /> Toutes les gares
          </Link>

          <div className="mt-auto">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span
                className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full
                  ${
                    gare.estOuvert
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full bg-white ${
                    gare.estOuvert ? "animate-pulse" : ""
                  }`}
                />
                {gare.estOuvert ? "Ouverte" : "Fermée"}
              </span>
              {gare.nombreAgences != null && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold bg-white/15 backdrop-blur-sm border border-white/20 text-white px-2.5 py-1 rounded-full">
                  <Bus className="w-3 h-3" />
                  {gare.nombreAgences} agence{gare.nombreAgences > 1 ? "s" : ""}
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight drop-shadow-lg">
              {gare.nom}
            </h1>
            <div className="flex items-center gap-1 text-white/90 mt-2 text-sm">
              <MapPin className="w-4 h-4" />
              <span>
                {gare.quartier ? `${gare.quartier}, ` : ""}
                {gare.adresse || gare.ville}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          ONGLETS
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2">
            {(
              [
                {
                  id: "agences",
                  label: "Agences affiliées",
                  icon: Bus,
                  count: agences.length,
                },
                {
                  id: "departs",
                  label: "Départs du jour",
                  icon: Calendar,
                  count: departs.length,
                },
                { id: "infos", label: "Informations", icon: Info },
              ] as const
            ).map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap
                    ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                        : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {"count" in tab && tab.count > 0 && (
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
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          CONTENU
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* ── Onglet Agences ──────────────────────────────────────────────── */}
        {activeTab === "agences" && (
          <>
            {agences.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
                  <Bus className="w-10 h-10 text-blue-300" />
                </div>
                <p className="text-gray-700 font-semibold text-lg">
                  Aucune agence affiliée
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Cette gare n&apos;a pas encore d&apos;agence partenaire.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {agences.map((a) => (
                  <AgenceLineCard key={a.agencyId} agence={a} />
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Onglet Départs ──────────────────────────────────────────────── */}
        {activeTab === "departs" && (
          <>
            {departs.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
                  <Calendar className="w-10 h-10 text-blue-300" />
                </div>
                <p className="text-gray-700 font-semibold text-lg">
                  Aucun départ aujourd&apos;hui
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Aucun voyage publié au départ de cette gare pour la date
                  d&apos;aujourd&apos;hui.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {departs.map((v) => (
                  <DepartLineCard key={v.idVoyage} voyage={v} />
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Onglet Infos ────────────────────────────────────────────────── */}
        {activeTab === "infos" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Description */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-4 h-4 text-blue-500" />
                <h2 className="font-semibold text-gray-900">Description</h2>
              </div>
              {gare.description ? (
                <p className="text-gray-600 text-sm leading-relaxed">
                  {gare.description}
                </p>
              ) : (
                <p className="text-gray-400 text-sm italic">
                  Aucune description disponible.
                </p>
              )}

              {gare.services && gare.services.length > 0 && (
                <div className="mt-5 pt-5 border-t border-gray-100">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Services disponibles
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {gare.services.map((s) => (
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
            </div>

            {/* Side panel : président, horaires, etc. */}
            <div className="space-y-3">
              {gare.horaires && (
                <div className="bg-white rounded-2xl border border-gray-100 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <p className="font-semibold text-gray-900 text-sm">
                      Horaires
                    </p>
                  </div>
                  <p className="text-sm text-gray-600">{gare.horaires}</p>
                </div>
              )}

              {gare.president_name && (
                <div className="bg-white rounded-2xl border border-gray-100 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <p className="font-semibold text-gray-900 text-sm">
                      Président
                    </p>
                  </div>
                  <p className="text-sm text-gray-600">{gare.president_name}</p>
                </div>
              )}

              {gare.adresse && (
                <div className="bg-white rounded-2xl border border-gray-100 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <p className="font-semibold text-gray-900 text-sm">
                      Adresse
                    </p>
                  </div>
                  <p className="text-sm text-gray-600">{gare.adresse}</p>
                </div>
              )}

              {gare.termes_et_conditions && (
                <div className="bg-white rounded-2xl border border-gray-100 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-4 h-4 text-blue-500" />
                    <p className="font-semibold text-gray-900 text-sm">
                      Règlement
                    </p>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {gare.termes_et_conditions}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
// END OF FILE: src/app/(customer-view)/gares-routieres/[id]/page.tsx
