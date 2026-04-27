"use client";
/**
 * EditableMoyensPaiement.tsx  (nouveau — P-21)
 *
 * Remplace EditableAgencyContact + EditableAgencySpecialties (champs mock supprimés).
 * Permet à l'agence de configurer ses moyens de paiement Mobile Money.
 */

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, XCircle, CreditCard } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import type { MoyenPaiement, TypePaiement } from "@/lib/types/agence.types";

const TYPE_OPTIONS: { value: TypePaiement; label: string }[] = [
  { value: "ORANGE_MONEY", label: "Orange Money" },
  { value: "MTN_MOMO", label: "MTN MoMo" },
  { value: "EXPRESS_UNION", label: "Express Union" },
  { value: "YUP", label: "YUP" },
  { value: "VIREMENT_BANCAIRE", label: "Virement bancaire" },
  { value: "CASH", label: "Espèces en agence" },
  { value: "AUTRE", label: "Autre" },
];

interface EditableMoyensPaiementProps {
  moyens: MoyenPaiement[];
  onSave: (moyens: MoyenPaiement[]) => Promise<void>;
}

export default function EditableMoyensPaiement({
  moyens,
  onSave,
}: EditableMoyensPaiementProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [list, setList] = useState<MoyenPaiement[]>(moyens ?? []);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setList(moyens ?? []);
  }, [moyens]);

  const handleChange = (
    id: string,
    field: keyof MoyenPaiement,
    value: string | boolean,
  ) => {
    setList((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
    );
  };

  const handleAdd = () => {
    setList((prev) => [
      ...prev,
      {
        id: uuidv4(),
        type: "ORANGE_MONEY",
        nomOperateur: "Orange Money",
        codeMarchand: "",
        numeroDépot: "",
        nomCompte: "",
        actif: true,
      },
    ]);
  };

  const handleRemove = (id: string) =>
    setList((prev) => prev.filter((m) => m.id !== id));

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(list);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setList(moyens ?? []);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-gray-800">Moyens de paiement</h3>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs text-primary hover:bg-primary/5 px-3 py-1.5 rounded-lg transition"
          >
            Configurer
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="flex items-center gap-1 text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition"
            >
              <XCircle size={13} /> Annuler
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1 text-xs text-white bg-primary px-3 py-1.5 rounded-lg hover:bg-primary/90 transition disabled:opacity-60"
            >
              <Save size={13} /> {isSaving ? "Sauvegarde..." : "Sauvegarder"}
            </button>
          </div>
        )}
      </div>

      {/* Lecture seule */}
      {!isEditing && (
        <div className="space-y-2">
          {list.length === 0 ? (
            <p className="text-sm text-gray-400 italic">
              Aucun moyen de paiement configuré.
            </p>
          ) : (
            list
              .filter((m) => m.actif)
              .map((m) => (
                <div key={m.id} className="flex items-center gap-3 text-sm">
                  <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
                  <span className="font-medium text-gray-700">
                    {m.nomOperateur}
                  </span>
                  {m.codeMarchand && (
                    <span className="text-gray-400 font-mono text-xs">
                      {m.codeMarchand}
                    </span>
                  )}
                  {m.numeroDépot && (
                    <span className="text-gray-400 font-mono text-xs">
                      {m.numeroDépot}
                    </span>
                  )}
                </div>
              ))
          )}
        </div>
      )}

      {/* Mode édition */}
      {isEditing && (
        <div className="space-y-4">
          {list.map((m) => (
            <div
              key={m.id}
              className="border border-gray-100 rounded-xl p-3 space-y-2 bg-gray-50"
            >
              <div className="flex items-center justify-between">
                <select
                  value={m.type}
                  onChange={(e) => {
                    const opt = TYPE_OPTIONS.find(
                      (o) => o.value === e.target.value,
                    );
                    handleChange(m.id, "type", e.target.value as TypePaiement);
                    if (opt) handleChange(m.id, "nomOperateur", opt.label);
                  }}
                  className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {TYPE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1 text-xs text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={m.actif}
                      onChange={(e) =>
                        handleChange(m.id, "actif", e.target.checked)
                      }
                      className="rounded"
                    />
                    Actif
                  </label>
                  <button
                    onClick={() => handleRemove(m.id)}
                    className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {(["codeMarchand", "numeroDépot", "nomCompte"] as const).map(
                  (f) => (
                    <input
                      key={f}
                      value={(m[f] as string) ?? ""}
                      onChange={(e) => handleChange(m.id, f, e.target.value)}
                      placeholder={
                        f === "codeMarchand"
                          ? "Code marchand"
                          : f === "numeroDépot"
                            ? "Numéro dépôt"
                            : "Nom du compte"
                      }
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  ),
                )}
              </div>
            </div>
          ))}
          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 text-xs text-primary hover:bg-primary/5 px-3 py-2 rounded-lg border border-dashed border-primary/30 w-full justify-center transition"
          >
            <Plus size={13} /> Ajouter un moyen de paiement
          </button>
        </div>
      )}
    </div>
  );
}
