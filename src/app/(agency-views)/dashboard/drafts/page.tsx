"use client";
/**
 * app/(agency-views)/dashboard/drafts/page.tsx  (nouveau — P-19)
 *
 * Page "Brouillons" du dashboard agence.
 * Liste les VoyageBrouillon INCOMPLET et PRET, avec actions par ligne.
 */

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileEdit,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  Pencil,
  Rocket,
  Trash2,
  CalendarDays,
  Bus,
  RefreshCw,
  ChevronRight,
  Plus,
} from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import Loader from "@/modals/Loader";
import { useBrouillons } from "@/lib/hooks/dasboard/useBrouillons";
import type {
  VoyageBrouillon,
  StatutBrouillon,
} from "@/lib/types/voyage.types";

// ── Badge statut ──────────────────────────────────────────────────────────────
function StatutBadge({ statut }: { statut: StatutBrouillon }) {
  const styles: Record<StatutBrouillon, string> = {
    INCOMPLET: "bg-orange-50 text-orange-600 border border-orange-200",
    PRET: "bg-green-50 text-green-700 border border-green-200",
    CONVERTI: "bg-gray-50 text-gray-500 border border-gray-200",
    ANNULE: "bg-red-50 text-red-500 border border-red-200",
  };
  const labels: Record<StatutBrouillon, string> = {
    INCOMPLET: "Incomplet",
    PRET: "Prêt à publier",
    CONVERTI: "Converti",
    ANNULE: "Annulé",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${styles[statut]}`}
    >
      {statut === "INCOMPLET" && <AlertCircle size={11} />}
      {statut === "PRET" && <CheckCircle2 size={11} />}
      {labels[statut]}
    </span>
  );
}

// ── Indicateur ressource (véhicule / chauffeur / places) ─────────────────────
function RessourceChip({ label, ok }: { label: string; ok: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full
        ${ok ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}
    >
      {ok ? "✓" : "✗"} {label}
    </span>
  );
}

// ── Modale de confirmation ────────────────────────────────────────────────────
function ConfirmModal({
  message,
  onConfirm,
  onCancel,
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 space-y-4">
        <p className="text-sm text-gray-700">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm text-white bg-red-500 rounded-xl hover:bg-red-600 transition"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Ligne brouillon ───────────────────────────────────────────────────────────
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

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Infos principales */}
          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <StatutBadge statut={brouillon.statutBrouillon} />
              {brouillon.ligneServiceId && (
                <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                  Depuis planning
                </span>
              )}
            </div>

            <h3 className="font-semibold text-gray-800 text-sm truncate">
              {brouillon.titre}
            </h3>

            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <MapPin size={12} className="shrink-0" />
              <span>
                {brouillon.lieuDepart ?? "—"} → {brouillon.lieuArrive ?? "—"}
              </span>
              {brouillon.dateDepartPrev && (
                <>
                  <span className="text-gray-300">·</span>
                  <CalendarDays size={12} className="shrink-0" />
                  <span>{formatDate(brouillon.dateDepartPrev)}</span>
                  {brouillon.heureDepartEffectif && (
                    <span>{brouillon.heureDepartEffectif}</span>
                  )}
                </>
              )}
            </div>

            {/* Chips ressources */}
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              <RessourceChip label="Véhicule" ok={!!brouillon.vehiculeId} />
              <RessourceChip label="Chauffeur" ok={!!brouillon.chauffeurId} />
              <RessourceChip
                label="Places"
                ok={!!brouillon.nbrPlaceReservable}
              />
            </div>

            {brouillon.notes && (
              <p className="text-[11px] text-gray-400 italic truncate">
                {brouillon.notes}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Compléter / Modifier */}
            <button
              onClick={() =>
                router.push(`/dashboard/trip-planning?draft=${brouillon.id}`)
              }
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700
                border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              title={isIncomplet ? "Compléter ce brouillon" : "Modifier"}
            >
              <Pencil size={13} />
              {isIncomplet ? "Compléter" : "Modifier"}
            </button>

            {/* Publier (seulement si PRET) */}
            <button
              onClick={() => setConfirmPublish(true)}
              disabled={!isPret}
              title={
                !isPret
                  ? "Complétez toutes les ressources avant de publier"
                  : "Publier ce voyage"
              }
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition
                ${
                  isPret
                    ? "bg-primary text-white hover:bg-primary/90 shadow-sm"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
            >
              <Rocket size={13} />
              Publier
            </button>

            {/* Supprimer */}
            <button
              onClick={() => setConfirmDelete(true)}
              title="Supprimer ce brouillon"
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Modales de confirmation */}
      {confirmDelete && (
        <ConfirmModal
          message={`Supprimer définitivement le brouillon "${brouillon.titre}" ?`}
          onConfirm={() => {
            setConfirmDelete(false);
            onSupprimer(brouillon.id);
          }}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
      {confirmPublish && (
        <ConfirmModal
          message={`Publier le voyage "${brouillon.titre}" ? Il sera immédiatement visible sur la plateforme.`}
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

// ── Page principale ───────────────────────────────────────────────────────────
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

  type FiltreBtn = {
    key: "TOUS" | "INCOMPLET" | "PRET";
    label: string;
    count: number;
  };
  const filtres: FiltreBtn[] = [
    { key: "TOUS", label: "Tous", count: compteurs.total },
    { key: "INCOMPLET", label: "Incomplets", count: compteurs.incomplet },
    { key: "PRET", label: "Prêts", count: compteurs.pret },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-60">
        <Loader message="Chargement des brouillons..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Brouillons"
        subtitle="Voyages en cours de création. Complétez les ressources manquantes avant de publier."
      />

      {/* Filtres + action */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        {/* Filtres statut */}
        <div className="flex gap-2 flex-wrap">
          {filtres.map((f) => (
            <button
              key={f.key}
              onClick={() => setFiltre(f.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition
                ${
                  filtre === f.key
                    ? "bg-primary text-white shadow-sm"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
            >
              {f.label}
              <span
                className={`text-xs font-bold px-1.5 py-0.5 rounded-full
                  ${filtre === f.key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}
              >
                {f.count}
              </span>
            </button>
          ))}
        </div>

        {/* Bouton nouveau voyage */}
        <Link href="/dashboard/trip-planning">
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 shadow-sm transition">
            <Plus size={16} />
            Nouveau voyage
          </button>
        </Link>
      </div>

      {/* Erreur */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl border border-red-200">
          <AlertCircle size={16} />
          {error}
          <button
            onClick={refetch}
            className="ml-auto flex items-center gap-1 underline text-xs"
          >
            <RefreshCw size={12} />
            Réessayer
          </button>
        </div>
      )}

      {/* Liste */}
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
        /* État vide */
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 text-center">
          <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <FileEdit className="w-7 h-7 text-gray-300" />
          </div>
          <h3 className="font-semibold text-gray-700 mb-1">
            {filtre === "TOUS"
              ? "Aucun brouillon en cours"
              : `Aucun brouillon "${filtre.toLowerCase()}"`}
          </h3>
          <p className="text-sm text-gray-400 max-w-xs mb-5">
            {filtre === "TOUS"
              ? "Créez un voyage ou générez-en un depuis le planning pour commencer."
              : "Changez de filtre ou créez un nouveau voyage."}
          </p>
          <Link href="/dashboard/trip-planning">
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition">
              <Plus size={15} />
              Planifier un voyage
            </button>
          </Link>
        </div>
      )}

      {/* Lien vers le planning */}
      {brouillons.length > 0 && (
        <Link
          href="/dashboard/planning"
          className="flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <Bus size={15} />
          Aller au planning pour générer de nouveaux voyages
          <ChevronRight size={14} />
        </Link>
      )}
    </div>
  );
}
