"use client";
/**
 * app/(bus-station-manager-views)/bsm-dashboard/affiliated-agencies/page.tsx
 * (reconstruit — P-26)
 *
 * Liste des agences affiliées avec :
 *   - Badge statut (ACTIVE / SUSPENDUE)
 *   - Montant de taxe dû par agence
 *   - Menu contextuel ⋮ : Alerte, Rappel taxe, Suspendre/Réactiver
 */

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Store,
  MoreVertical,
  Send,
  CreditCard,
  ShieldOff,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import Loader from "@/modals/Loader";
import AlerteModal from "@/modals/AlerteModal";
import { useBsm } from "@/lib/contexts/BsmContext";
import type { AgenceVoyageFull } from "@/lib/types/agence.types";
import type { TaxeAffiliation, TypeAlerte } from "@/lib/types/bsm.types";

// ── Menu ⋮ ────────────────────────────────────────────────────────────────────
function AgenceContextMenu({
  agence,
  taxeEnRetard,
  onAlerte,
  onRappelTaxe,
  onToggleStatut,
}: {
  agence: AgenceVoyageFull;
  taxeEnRetard: TaxeAffiliation | null;
  onAlerte: () => void;
  onRappelTaxe: () => void;
  onToggleStatut: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isSuspendue = agence.statutAgence === "SUSPENDUE";

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
        title="Actions"
      >
        <MoreVertical size={16} />
      </button>

      {open && (
        <div className="absolute right-0 top-8 z-20 bg-white rounded-xl shadow-lg border border-gray-100 w-52 py-1 text-sm">
          <button
            onClick={() => {
              setOpen(false);
              onAlerte();
            }}
            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition"
          >
            <Send size={14} className="text-blue-500" />
            Envoyer une alerte
          </button>
          <button
            onClick={() => {
              setOpen(false);
              onRappelTaxe();
            }}
            disabled={!taxeEnRetard}
            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <CreditCard size={14} className="text-orange-500" />
            Rappel de taxe
            {!taxeEnRetard && (
              <span className="ml-auto text-xs text-gray-400">À jour</span>
            )}
          </button>
          <div className="my-1 border-t border-gray-100" />
          <button
            onClick={() => {
              setOpen(false);
              onToggleStatut();
            }}
            className={`flex items-center gap-2.5 w-full px-4 py-2.5 hover:bg-gray-50 transition ${
              isSuspendue ? "text-green-700" : "text-red-600"
            }`}
          >
            {isSuspendue ? (
              <>
                <ShieldCheck size={14} /> Réactiver l'agence
              </>
            ) : (
              <>
                <ShieldOff size={14} /> Suspendre l'agence
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Ligne agence ──────────────────────────────────────────────────────────────
function AgenceRow({
  agence,
  taxes,
  onAlerte,
  onRappelTaxe,
  onToggleStatut,
}: {
  agence: AgenceVoyageFull;
  taxes: TaxeAffiliation[];
  onAlerte: (a: AgenceVoyageFull) => void;
  onRappelTaxe: (a: AgenceVoyageFull, t: TaxeAffiliation) => void;
  onToggleStatut: (a: AgenceVoyageFull) => void;
}) {
  const isSuspendue = agence.statutAgence === "SUSPENDUE";
  const taxesAgence = taxes.filter((t) => t.agenceVoyageId === agence.agencyId);
  const taxeEnRetard =
    taxesAgence.find(
      (t) =>
        t.statutPaiement === "EN_RETARD" || t.statutPaiement === "EN_ATTENTE",
    ) ?? null;
  const montantDu = taxesAgence
    .filter((t) => t.statutPaiement !== "PAYE")
    .reduce((acc, t) => acc + t.montant, 0);

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl border transition ${
        isSuspendue
          ? "bg-red-50/50 border-red-100"
          : "bg-white border-gray-100 hover:shadow-sm"
      }`}
    >
      {/* Logo */}
      <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
        {agence.logoUrl ? (
          <Image
            src={agence.logoUrl}
            alt=""
            width={40}
            height={40}
            className="object-cover"
            unoptimized
          />
        ) : (
          <Store className="w-5 h-5 m-2.5 text-gray-400" />
        )}
      </div>

      {/* Infos */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-gray-800 text-sm truncate">
            {agence.longName ?? agence.shortName}
          </p>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              isSuspendue
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-700"
            }`}
          >
            {isSuspendue ? "SUSPENDUE" : "ACTIVE"}
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-0.5 truncate">
          {agence.location}
        </p>
      </div>

      {/* Taxe due */}
      <div className="text-right hidden sm:block shrink-0">
        {montantDu > 0 ? (
          <p className="text-sm font-semibold text-orange-600">
            {montantDu.toLocaleString("fr-FR")} FCFA
          </p>
        ) : (
          <p className="text-xs text-green-600 font-medium">À jour</p>
        )}
        <p className="text-[10px] text-gray-400">taxes dues</p>
      </div>

      {/* Menu ⋮ */}
      <AgenceContextMenu
        agence={agence}
        taxeEnRetard={taxeEnRetard}
        onAlerte={() => onAlerte(agence)}
        onRappelTaxe={() => taxeEnRetard && onRappelTaxe(agence, taxeEnRetard)}
        onToggleStatut={() => onToggleStatut(agence)}
      />
    </div>
  );
}

// ── Page principale ───────────────────────────────────────────────────────────
export default function AffiliatedAgenciesPage() {
  const {
    agences,
    taxes,
    isLoading,
    error,
    refetch,
    toggleStatutAgence,
    sendAlerte,
    compte,
    gareId,
  } = useBsm();

  const [alerteModal, setAlerteModal] = useState<{
    open: boolean;
    agence: AgenceVoyageFull | null;
    type: "ALERTE" | "TAX_REMINDER";
    taxe: TaxeAffiliation | null;
  }>({ open: false, agence: null, type: "ALERTE", taxe: null });

  const [confirmStatut, setConfirmStatut] = useState<{
    open: boolean;
    agence: AgenceVoyageFull | null;
  }>({ open: false, agence: null });

  const [filtre, setFiltre] = useState<"TOUS" | "ACTIVE" | "SUSPENDUE">("TOUS");

  const agencesFiltrees = agences.filter((a) =>
    filtre === "TOUS" ? true : a.statutAgence === filtre,
  );

  const handleSendAlerte = async (message: string, type: TypeAlerte) => {
    if (!alerteModal.agence || !gareId) return;
    await sendAlerte({
      agenceVoyageId: alerteModal.agence.agencyId,
      gareId,
      type,
      message,
      envoyePar: compte ? `BSM ${compte.nom}` : "Bureau de la Gare",
    });
  };

  const handleToggleStatut = async () => {
    if (!confirmStatut.agence) return;
    const newStatut =
      confirmStatut.agence.statutAgence === "SUSPENDUE"
        ? "ACTIVE"
        : "SUSPENDUE";
    await toggleStatutAgence(confirmStatut.agence.agencyId, newStatut);
    setConfirmStatut({ open: false, agence: null });
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-60">
        <Loader />
      </div>
    );
  if (error)
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <AlertCircle className="w-10 h-10 text-red-300" />
        <p className="text-sm text-gray-500">{error}</p>
        <button
          onClick={refetch}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm rounded-xl"
        >
          <RefreshCw size={14} /> Réessayer
        </button>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Agences affiliées
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {agences.length} agence{agences.length > 1 ? "s" : ""} dans cette
            gare
          </p>
        </div>
        <div className="flex gap-2">
          {(["TOUS", "ACTIVE", "SUSPENDUE"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFiltre(f)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full transition ${
                filtre === f
                  ? "bg-primary text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {f === "TOUS"
                ? "Toutes"
                : f === "ACTIVE"
                  ? "Actives"
                  : "Suspendues"}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {agencesFiltrees.map((a) => (
          <AgenceRow
            key={a.agencyId}
            agence={a}
            taxes={taxes}
            onAlerte={(ag) =>
              setAlerteModal({
                open: true,
                agence: ag,
                type: "ALERTE",
                taxe: null,
              })
            }
            onRappelTaxe={(ag, t) =>
              setAlerteModal({
                open: true,
                agence: ag,
                type: "TAX_REMINDER",
                taxe: t,
              })
            }
            onToggleStatut={(ag) =>
              setConfirmStatut({ open: true, agence: ag })
            }
          />
        ))}
        {agencesFiltrees.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-12">
            Aucune agence.
          </p>
        )}
      </div>

      {/* Modale alerte */}
      <AlerteModal
        isOpen={alerteModal.open}
        onClose={() =>
          setAlerteModal({
            open: false,
            agence: null,
            type: "ALERTE",
            taxe: null,
          })
        }
        onSend={handleSendAlerte}
        agence={alerteModal.agence}
        type={alerteModal.type}
        taxeEnRetard={alerteModal.taxe}
      />

      {/* Modale confirmation statut */}
      {confirmStatut.open && confirmStatut.agence && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 space-y-4">
            <p className="text-sm text-gray-700">
              {confirmStatut.agence.statutAgence === "SUSPENDUE"
                ? `Réactiver l'agence "${confirmStatut.agence.longName}" ?`
                : `Suspendre l'agence "${confirmStatut.agence.longName}" ? Ses voyages ne seront plus visibles.`}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmStatut({ open: false, agence: null })}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleToggleStatut}
                className={`px-4 py-2 text-sm text-white rounded-xl transition ${
                  confirmStatut.agence.statutAgence === "SUSPENDUE"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
