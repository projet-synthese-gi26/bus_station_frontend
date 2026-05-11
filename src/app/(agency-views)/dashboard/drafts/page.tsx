"use client";
/**
 * /dashboard/drafts/page.tsx — Brouillons de voyages (P-19, Lot 4)
 *
 * Liste les VoyageBrouillon INCOMPLET et PRET d'une agence avec
 * actions par ligne : Compléter, Publier, Supprimer.
 *
 * Design : header + KPIs en haut, filtres en chips, lignes blanches
 * avec ressources manquantes mises en évidence.
 */

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileEdit,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Pencil,
  Rocket,
  Trash2,
  CalendarDays,
  Bus,
  RefreshCw,
  ChevronRight,
  Plus,
  Truck,
  User,
  Armchair,
  Calendar,
} from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import Loader from "@/modals/Loader";
import { useBrouillons } from "@/lib/hooks/dasboard/useBrouillons";
import type {
  VoyageBrouillon,
  StatutBrouillon,
} from "@/lib/types/voyage.types";

// ─── Sous-composants ──────────────────────────────────────────────────────────

function StatutBadge({ statut }: { statut: StatutBrouillon }) {
  const styles: Record<StatutBrouillon, string> = {
    INCOMPLET: "bg-orange-50 text-orange-700 border-orange-200",
    PRET: "bg-green-50 text-green-700 border-green-200",
    CONVERTI: "bg-gray-50 text-gray-500 border-gray-200",
    ANNULE: "bg-red-50 text-red-500 border-red-200",
  };
  const labels: Record<StatutBrouillon, string> = {
    INCOMPLET: "Incomplet",
    PRET: "Prêt à publier",
    CONVERTI: "Converti",
    ANNULE: "Annulé",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${styles[statut]}`}
    >
      {statut === "INCOMPLET" && <AlertCircle size={11} />}
      {statut === "PRET" && <CheckCircle2 size={11} />}
      {labels[statut]}
    </span>
  );
}

function RessourceChip({
  label,
  ok,
  icon: Icon,
}: {
  label: string;
  ok: boolean;
  icon: React.ElementType;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md border
        ${
          ok
            ? "bg-green-50 text-green-700 border-green-100"
            : "bg-red-50 text-red-600 border-red-100"
        }`}
    >
      <Icon size={11} />
      {label}
      <span className="font-bold">{ok ? "✓" : "✗"}</span>
    </span>
  );
}

function ConfirmModal({
  message,
  variant = "danger",
  onConfirm,
  onCancel,
}: {
  message: string;
  variant?: "danger" | "primary";
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4">
        <p className="text-sm text-gray-700 leading-relaxed">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-xl transition shadow-sm ${
              variant === "danger"
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}

function BrouillonRow({
  brouillon,
  onPublier,
  onSupprimer,
}: {
  brouillon: VoyageBrouillon;
  onPublier: (id: string) => void;
  onSupprimer: (id: string) => void;
}) {
  const router = useRouter();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmPublish, setConfirmPublish] = useState(false);

  const isIncomplet = brouillon.statutBrouillon === "INCOMPLET";
  const isPret = brouillon.statutBrouillon === "PRET";

  const formatDate = (d?: string | null) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (d?: string | null) => {
    if (!d) return null;
    return new Date(d).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <div
        className={`bg-white rounded-2xl border p-5 transition-all hover:shadow-md
          ${
            isPret
              ? "border-green-200 hover:border-green-300"
              : "border-gray-100 hover:border-blue-200"
          }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* ── Infos principales ──────────────────────────────────────── */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <StatutBadge statut={brouillon.statutBrouillon} />
              {brouillon.ligneServiceId && (
                <span className="inline-flex items-center gap-1 text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium border border-blue-100">
                  <Calendar size={10} />
                  Depuis planning
                </span>
              )}
            </div>

            <h3 className="font-semibold text-gray-900 text-base leading-tight line-clamp-1">
              {brouillon.titre || "Brouillon sans titre"}
            </h3>

            <div className="flex items-center gap-1.5 text-sm text-gray-600 flex-wrap">
              <MapPin size={13} className="shrink-0 text-blue-500" />
              <span className="font-medium">{brouillon.lieuDepart || "—"}</span>
              <span className="text-blue-400">→</span>
              <span className="font-medium">{brouillon.lieuArrive || "—"}</span>
              {brouillon.dateDepartPrev && (
                <>
                  <span className="text-gray-300 mx-1">·</span>
                  <CalendarDays size={13} className="shrink-0 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    {formatDate(brouillon.dateDepartPrev)}
                    {formatTime(brouillon.heureDepartEffectif) &&
                      ` à ${formatTime(brouillon.heureDepartEffectif)}`}
                  </span>
                </>
              )}
            </div>

            {/* Chips ressources */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <RessourceChip
                label="Véhicule"
                icon={Truck}
                ok={!!brouillon.vehiculeId}
              />
              <RessourceChip
                label="Chauffeur"
                icon={User}
                ok={!!brouillon.chauffeurId}
              />
              <RessourceChip
                label="Places"
                icon={Armchair}
                ok={
                  !!brouillon.nbrPlaceReservable &&
                  brouillon.nbrPlaceReservable > 0
                }
              />
              <RessourceChip
                label="Prix"
                icon={CheckCircle2}
                ok={!!brouillon.prix && brouillon.prix > 0}
              />
            </div>

            {brouillon.notes && (
              <p className="text-xs text-gray-400 italic line-clamp-1 pt-0.5">
                « {brouillon.notes} »
              </p>
            )}
          </div>

          {/* ── Actions ─────────────────────────────────────────────────── */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              onClick={() =>
                router.push(`/dashboard/trip-planning?draft=${brouillon.id}`)
              }
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition"
              title={isIncomplet ? "Compléter ce brouillon" : "Modifier"}
            >
              <Pencil size={13} />
              {isIncomplet ? "Compléter" : "Modifier"}
            </button>

            <button
              onClick={() => setConfirmPublish(true)}
              disabled={!isPret}
              title={
                !isPret
                  ? "Complétez toutes les ressources avant de publier"
                  : "Publier ce voyage"
              }
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition shadow-sm
                ${
                  isPret
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
            >
              <Rocket size={13} />
              Publier
            </button>

            <button
              onClick={() => setConfirmDelete(true)}
              title="Supprimer ce brouillon"
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>

      {confirmDelete && (
        <ConfirmModal
          message={`Supprimer définitivement le brouillon « ${brouillon.titre} » ? Cette action est irréversible.`}
          variant="danger"
          onConfirm={() => {
            setConfirmDelete(false);
            onSupprimer(brouillon.id);
          }}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
      {confirmPublish && (
        <ConfirmModal
          message={`Publier le voyage « ${brouillon.titre} » ? Il sera immédiatement visible sur la plateforme et les clients pourront réserver.`}
          variant="primary"
          onConfirm={() => {
            setConfirmPublish(false);
            onPublier(brouillon.id);
          }}
          onCancel={() => setConfirmPublish(false)}
        />
      )}
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DraftsPage() {
  const {
    brouillons,
    isLoading,
    error,
    filtre,
    setFiltre,
    compteurs,
    handlePublier,
    handleSupprimer,
    refetch,
  } = useBrouillons();

  const filtres = [
    { key: "TOUS" as const, label: "Tous", count: compteurs.total },
    {
      key: "INCOMPLET" as const,
      label: "Incomplets",
      count: compteurs.incomplet,
    },
    { key: "PRET" as const, label: "Prêts", count: compteurs.pret },
  ];

  if (isLoading && brouillons.length === 0) {
    return (
      <div className="flex justify-center items-center h-60">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Brouillons"
        subtitle="Voyages en cours de création. Complétez les ressources manquantes avant de publier."
      />

      {/* ─── KPIs ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-linear-to-br from-gray-50 to-white border border-gray-100 rounded-2xl p-4">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
            Total
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {compteurs.total}
          </p>
        </div>
        <div className="bg-linear-to-br from-orange-50 to-white border border-orange-100 rounded-2xl p-4">
          <p className="text-xs text-orange-600 font-medium uppercase tracking-wider">
            À compléter
          </p>
          <p className="text-2xl font-bold text-orange-700 mt-1">
            {compteurs.incomplet}
          </p>
        </div>
        <div className="bg-linear-to-br from-green-50 to-white border border-green-100 rounded-2xl p-4">
          <p className="text-xs text-green-600 font-medium uppercase tracking-wider">
            Prêts
          </p>
          <p className="text-2xl font-bold text-green-700 mt-1">
            {compteurs.pret}
          </p>
        </div>
      </div>

      {/* ─── Filtres + bouton ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <div className="flex gap-2 flex-wrap">
          {filtres.map((f) => (
            <button
              key={f.key}
              onClick={() => setFiltre(f.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition
                ${
                  filtre === f.key
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600"
                }`}
            >
              {f.label}
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full
                  ${
                    filtre === f.key
                      ? "bg-white/20 text-white"
                      : "bg-blue-50 text-blue-700"
                  }`}
              >
                {f.count}
              </span>
            </button>
          ))}
        </div>

        <Link href="/dashboard/trip-planning">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 shadow-sm shadow-blue-200 transition">
            <Plus size={16} />
            Nouveau voyage
          </button>
        </Link>
      </div>

      {/* ─── Erreur ──────────────────────────────────────────────────────── */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl border border-red-200">
          <AlertCircle size={16} className="shrink-0" />
          <span className="flex-1">{error}</span>
          <button
            onClick={refetch}
            className="flex items-center gap-1 underline text-xs font-medium hover:no-underline"
          >
            <RefreshCw size={12} />
            Réessayer
          </button>
        </div>
      )}

      {/* ─── Liste ───────────────────────────────────────────────────────── */}
      {brouillons.length > 0 ? (
        <div className="space-y-3">
          {brouillons.map((b) => (
            <BrouillonRow
              key={b.id}
              brouillon={b}
              onPublier={handlePublier}
              onSupprimer={handleSupprimer}
            />
          ))}
        </div>
      ) : (
        !error && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <FileEdit className="w-8 h-8 text-blue-300" />
            </div>
            <h3 className="font-semibold text-gray-700 text-base mb-1">
              {filtre === "TOUS"
                ? "Aucun brouillon en cours"
                : `Aucun brouillon « ${filtre.toLowerCase()} »`}
            </h3>
            <p className="text-sm text-gray-500 max-w-sm mb-5">
              {filtre === "TOUS"
                ? "Créez un voyage manuellement ou générez-en un depuis votre planning pour commencer."
                : "Modifiez le filtre ou créez un nouveau voyage."}
            </p>
            <Link href="/dashboard/trip-planning">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 shadow-sm shadow-blue-200 transition">
                <Plus size={15} />
                Planifier un voyage
              </button>
            </Link>
          </div>
        )
      )}

      {/* ─── Lien vers planning ──────────────────────────────────────────── */}
      {brouillons.length > 0 && (
        <Link
          href="/dashboard/planning"
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline font-medium"
        >
          <Bus size={15} />
          Aller au planning pour générer de nouveaux voyages
          <ChevronRight size={14} />
        </Link>
      )}
    </div>
  );
}
// END OF FILE: src/app/(agency-views)/dashboard/drafts/page.tsx
