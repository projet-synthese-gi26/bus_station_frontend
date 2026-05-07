// ============================================================
// P-27 : app/(bus-station-manager-views)/bsm-dashboard/policies-taxes/page.tsx
// ============================================================
"use client";
/**
 * policies-taxes/page.tsx  (reconstruit — P-27)
 * Deux onglets : Politiques | Taxes d'affiliation
 */

import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Check,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  X,
  Save,
} from "lucide-react";
import Loader from "@/modals/Loader";
import { useBsm } from "@/lib/contexts/BsmContext";
import type {
  PolitiqueGare,
  CreatePolitiqueDTO,
  TaxeAffiliation,
  CategoriePolitique,
  CreateTaxeDTO,
} from "@/lib/types/bsm.types";
import type { AgenceVoyageFull } from "@/lib/types/agence.types";

// ── Modale politique ──────────────────────────────────────────────────────────
function PolitiqueModal({
  isOpen,
  onClose,
  onSave,
  initial,
  gareId,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (d: CreatePolitiqueDTO, id?: string) => Promise<void>;
  initial?: PolitiqueGare | null;
  gareId: string | number;
}) {
  const [form, setForm] = useState<CreatePolitiqueDTO>({
    gareId: typeof gareId === "string" ? 0 : gareId,
    titre: "",
    description: "",
    categorie: "REGLEMENT",
    montant: undefined,
    dateEffet: new Date().toISOString().split("T")[0],
    documentUrl: undefined,
  });
  const [saving, setSaving] = useState(false);

  useState(() => {
    if (initial)
      setForm({
        gareId: initial.gareId,
        titre: initial.titre,
        description: initial.description,
        categorie: initial.categorie,
        montant: initial.montant ?? undefined,
        dateEffet: initial.dateEffet,
        documentUrl: initial.documentUrl ?? undefined,
      });
  });

  if (!isOpen) return null;
  const set = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));
  const cls =
    "w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30";

  const CATS: { value: CategoriePolitique; label: string }[] = [
    { value: "POLITIQUE", label: "Politique" },
    { value: "TAXE", label: "Taxe" },
    { value: "REGLEMENT", label: "Règlement" },
    { value: "FRAIS_SERVICE", label: "Frais de service" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-800">
            {initial ? "Modifier la politique" : "Nouvelle politique"}
          </h2>
          <button onClick={onClose}>
            <X size={18} className="text-gray-400" />
          </button>
        </div>
        <div className="p-5 space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
              Titre *
            </label>
            <input
              value={form.titre}
              onChange={(e) => set("titre", e.target.value)}
              className={cls}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
              Catégorie
            </label>
            <select
              value={form.categorie}
              onChange={(e) => set("categorie", e.target.value)}
              className={cls}
            >
              {CATS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              className={cls + " resize-none"}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
                Montant (FCFA)
              </label>
              <input
                type="number"
                value={form.montant ?? ""}
                onChange={(e) =>
                  set(
                    "montant",
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
                className={cls}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
                Date d'effet
              </label>
              <input
                type="date"
                value={form.dateEffet}
                onChange={(e) => set("dateEffet", e.target.value)}
                className={cls}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 p-5 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            onClick={async () => {
              setSaving(true);
              try {
                await onSave(form, initial?.idPolitique);
                onClose();
              } finally {
                setSaving(false);
              }
            }}
            disabled={saving || !form.titre}
            className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-primary rounded-xl hover:bg-primary/90 disabled:opacity-60"
          >
            <Save size={15} /> {saving ? "..." : "Sauvegarder"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modale création taxe ──────────────────────────────────────────────────────
function TaxeModal({
  isOpen,
  onClose,
  onSave,
  gareRoutiereId,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (d: CreateTaxeDTO) => Promise<void>;
  gareRoutiereId: number | string;
}) {
  const [form, setForm] = useState({ nomTaxe: "", montantFixe: "" });
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;
  const cls =
    "w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-800">Nouvelle taxe d'affiliation</h2>
          <button onClick={onClose}>
            <X size={18} className="text-gray-400" />
          </button>
        </div>
        <div className="p-5 space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
              Nom de la taxe *
            </label>
            <input
              value={form.nomTaxe}
              onChange={(e) => setForm((p) => ({ ...p, nomTaxe: e.target.value }))}
              placeholder="ex: Taxe mensuelle d'occupation"
              className={cls}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
              Montant fixe (FCFA) *
            </label>
            <input
              type="number"
              value={form.montantFixe}
              onChange={(e) => setForm((p) => ({ ...p, montantFixe: e.target.value }))}
              placeholder="ex: 50000"
              className={cls}
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 p-5 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            onClick={async () => {
              if (!form.nomTaxe || !form.montantFixe) return;
              setSaving(true);
              try {
                await onSave({
                  gareRoutiereId,
                  nomTaxe: form.nomTaxe,
                  montantFixe: Number(form.montantFixe),
                });
                setForm({ nomTaxe: "", montantFixe: "" });
                onClose();
              } finally {
                setSaving(false);
              }
            }}
            disabled={saving || !form.nomTaxe || !form.montantFixe}
            className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-primary rounded-xl hover:bg-primary/90 disabled:opacity-60"
          >
            <Save size={15} /> {saving ? "..." : "Créer"}
          </button>
        </div>
      </div>
    </div>
  );
}

const CAT_COLOR: Record<CategoriePolitique, string> = {
  POLITIQUE: "bg-blue-50 text-blue-700",
  TAXE: "bg-orange-50 text-orange-700",
  REGLEMENT: "bg-purple-50 text-purple-700",
  FRAIS_SERVICE: "bg-teal-50 text-teal-700",
};

export default function PoliciesTaxesPage() {
  const {
    politiques,
    taxes,
    agences,
    isLoading,
    savePolitique,
    supprimerPolitique,
    marquerTaxePayee,
    creerTaxe,
    gareId,
  } = useBsm();
  const [tab, setTab] = useState<"politiques" | "taxes">("politiques");
  const [modal, setModal] = useState<{
    open: boolean;
    initial?: PolitiqueGare;
  }>({ open: false });
  const [taxeModal, setTaxeModal] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-60">
        <Loader />
      </div>
    );

  const agenceName = (id: string) =>
    agences.find((a) => a.agencyId === id)?.shortName ?? id;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Politiques & Taxes</h1>
      <div className="flex gap-2 border-b border-gray-100 pb-0">
        {(["politiques", "taxes"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-3 text-sm font-medium border-b-2 transition ${tab === t ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            {t === "politiques"
              ? "Politiques & Règlements"
              : "Taxes d'affiliation"}
          </button>
        ))}
      </div>

      {tab === "politiques" && (
        <div className="space-y-4">
          <button
            onClick={() => setModal({ open: true })}
            className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-primary rounded-xl hover:bg-primary/90 transition"
          >
            <Plus size={15} /> Ajouter une politique
          </button>
          {politiques.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-10">
              Aucune politique définie.
            </p>
          ) : (
            politiques.map((p) => (
              <div
                key={p.idPolitique}
                className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <div
                  className="flex items-center gap-3 p-4 cursor-pointer"
                  onClick={() =>
                    setExpanded(
                      expanded === p.idPolitique ? null : p.idPolitique,
                    )
                  }
                >
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CAT_COLOR[p.categorie]}`}
                  >
                    {p.categorie}
                  </span>
                  <p className="flex-1 font-medium text-gray-800 text-sm">
                    {p.titre}
                  </p>
                  {p.montant != null && (
                    <p className="text-sm font-semibold text-gray-700">
                      {p.montant.toLocaleString("fr-FR")} FCFA
                    </p>
                  )}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setModal({ open: true, initial: p });
                      }}
                      className="p-1.5 text-gray-400 hover:text-primary rounded-lg"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        supprimerPolitique(p.idPolitique);
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg"
                    >
                      <Trash2 size={14} />
                    </button>
                    {expanded === p.idPolitique ? (
                      <ChevronUp size={16} className="text-gray-400" />
                    ) : (
                      <ChevronDown size={16} className="text-gray-400" />
                    )}
                  </div>
                </div>
                {expanded === p.idPolitique && (
                  <div className="px-4 pb-4 border-t border-gray-50 pt-3">
                    <p className="text-sm text-gray-600 whitespace-pre-line">
                      {p.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      En vigueur depuis le{" "}
                      {new Date(p.dateEffet).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {tab === "taxes" && (
        <div className="space-y-4">
          <button
            onClick={() => setTaxeModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-primary rounded-xl hover:bg-primary/90 transition"
          >
            <Plus size={15} /> Ajouter une taxe
          </button>
          {taxes.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-10">
              Aucune taxe enregistrée.
            </p>
          ) : (
            taxes
              .sort((a, b) => {
                const order = {
                  EN_RETARD: 0,
                  EN_ATTENTE: 1,
                  PAYE: 2,
                  PARTIELLEMENT_PAYE: 1,
                };
                return (
                  (order[a.statutPaiement] ?? 3) -
                  (order[b.statutPaiement] ?? 3)
                );
              })
              .map((t) => (
                <div
                  key={t.idTaxe}
                  className={`flex items-center gap-4 p-4 rounded-xl border ${
                    t.statutPaiement === "EN_RETARD"
                      ? "bg-red-50/50 border-red-100"
                      : t.statutPaiement === "EN_ATTENTE"
                        ? "bg-orange-50/30 border-orange-100"
                        : "bg-white border-gray-100"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-800 truncate">
                      {agenceName(t.agenceVoyageId)}
                    </p>
                    <p className="text-xs text-gray-400">
                      Période : {t.periode} · Échéance :{" "}
                      {new Date(t.dateEcheance).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <p className="font-bold text-sm text-gray-800 shrink-0">
                    {t.montant.toLocaleString("fr-FR")} FCFA
                  </p>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      t.statutPaiement === "PAYE"
                        ? "bg-green-100 text-green-700"
                        : t.statutPaiement === "EN_RETARD"
                          ? "bg-red-100 text-red-600"
                          : "bg-orange-100 text-orange-600"
                    }`}
                  >
                    {t.statutPaiement.replace("_", " ")}
                  </span>
                  {t.statutPaiement !== "PAYE" && (
                    <button
                      onClick={() => marquerTaxePayee(t.idTaxe)}
                      className="flex items-center gap-1 text-xs text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-100 transition shrink-0"
                    >
                      <Check size={12} /> Marquer payée
                    </button>
                  )}
                </div>
              ))
          )}
        </div>
      )}

      <PolitiqueModal
        isOpen={modal.open}
        onClose={() => setModal({ open: false })}
        onSave={savePolitique}
        initial={modal.initial}
        gareId={gareId ?? 1}
      />

      <TaxeModal
        isOpen={taxeModal}
        onClose={() => setTaxeModal(false)}
        onSave={creerTaxe}
        gareRoutiereId={gareId ?? 1}
      />
    </div>
  );
}
