"use client";
/**
 * LigneServiceModal.tsx  (nouveau — P-21)
 *
 * Modale de création et modification d'une LigneService (créneau planning).
 * Champs : trajet, jours, heures, classe, prix, description.
 */

import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import type {
  LigneService,
  JourSemaine,
  CreateLigneServiceDTO,
} from "@/lib/types/ligne-service.types";
import type { ClassVoyage } from "@/lib/types/generated-api";

const JOURS: { key: JourSemaine; label: string }[] = [
  { key: "LUNDI", label: "Lun" },
  { key: "MARDI", label: "Mar" },
  { key: "MERCREDI", label: "Mer" },
  { key: "JEUDI", label: "Jeu" },
  { key: "VENDREDI", label: "Ven" },
  { key: "SAMEDI", label: "Sam" },
  { key: "DIMANCHE", label: "Dim" },
];

interface LigneServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateLigneServiceDTO) => Promise<void>;
  agenceVoyageId: string;
  classes: ClassVoyage[];
  initial?: LigneService | null; // null = création, objet = édition
}

const EMPTY: Omit<CreateLigneServiceDTO, "agenceVoyageId"> = {
  lieuDepart: "",
  lieuArrive: "",
  pointDeDepart: "",
  pointArrivee: "",
  heureDepart: "08:00",
  heureArrivee: "12:00",
  joursOperation: [],
  classVoyageId: null,
  nomClasse: null,
  prix: null,
  dureeEstimee: "",
  actif: true,
  description: "",
};

export default function LigneServiceModal({
  isOpen,
  onClose,
  onSave,
  agenceVoyageId,
  classes,
  initial,
}: LigneServiceModalProps) {
  const [form, setForm] = useState({ ...EMPTY });
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      if (initial) {
        setForm({
          lieuDepart: initial.lieuDepart,
          lieuArrive: initial.lieuArrive,
          pointDeDepart: initial.pointDeDepart ?? "",
          pointArrivee: initial.pointArrivee ?? "",
          heureDepart: initial.heureDepart,
          heureArrivee: initial.heureArrivee,
          joursOperation: initial.joursOperation,
          classVoyageId: initial.classVoyageId ?? null,
          nomClasse: initial.nomClasse ?? null,
          prix: initial.prix ?? null,
          dureeEstimee: initial.dureeEstimee ?? "",
          actif: initial.actif,
          description: initial.description ?? "",
        });
      } else {
        setForm({ ...EMPTY });
      }
      setErrors({});
    }
  }, [isOpen, initial]);

  const set = (key: string, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleJour = (jour: JourSemaine) =>
    setForm((prev) => ({
      ...prev,
      joursOperation: prev.joursOperation.includes(jour)
        ? prev.joursOperation.filter((j) => j !== jour)
        : [...prev.joursOperation, jour],
    }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.lieuDepart.trim()) e.lieuDepart = "Requis";
    if (!form.lieuArrive.trim()) e.lieuArrive = "Requis";
    if (!form.heureDepart) e.heureDepart = "Requis";
    if (!form.heureArrivee) e.heureArrivee = "Requis";
    if (form.joursOperation.length === 0)
      e.jours = "Sélectionnez au moins un jour";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setIsSaving(true);
    try {
      const selectedClass = classes.find(
        (c) => c.idClassVoyage === form.classVoyageId,
      );
      await onSave({
        ...form,
        agenceVoyageId,
        nomClasse: selectedClass?.nom ?? form.nomClasse,
        prix: form.prix ?? (selectedClass ? Number(selectedClass.prix) : null),
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const inputCls = (err?: string) =>
    `w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 ${
      err ? "border-red-300" : "border-gray-200"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-800">
            {initial ? "Modifier le créneau" : "Nouveau créneau de planning"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Corps */}
        <div className="p-5 space-y-4">
          {/* Trajet */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
                Départ *
              </label>
              <input
                value={form.lieuDepart}
                onChange={(e) => set("lieuDepart", e.target.value)}
                placeholder="ex: Yaoundé"
                className={inputCls(errors.lieuDepart)}
              />
              {errors.lieuDepart && (
                <p className="text-red-500 text-xs mt-0.5">
                  {errors.lieuDepart}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
                Arrivée *
              </label>
              <input
                value={form.lieuArrive}
                onChange={(e) => set("lieuArrive", e.target.value)}
                placeholder="ex: Douala"
                className={inputCls(errors.lieuArrive)}
              />
              {errors.lieuArrive && (
                <p className="text-red-500 text-xs mt-0.5">
                  {errors.lieuArrive}
                </p>
              )}
            </div>
          </div>

          {/* Points précis */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
                Point départ
              </label>
              <input
                value={form.pointDeDepart ?? ""}
                onChange={(e) => set("pointDeDepart", e.target.value)}
                placeholder="ex: Gare de Mvan"
                className={inputCls()}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
                Point arrivée
              </label>
              <input
                value={form.pointArrivee ?? ""}
                onChange={(e) => set("pointArrivee", e.target.value)}
                placeholder="ex: Gare Bonabéri"
                className={inputCls()}
              />
            </div>
          </div>

          {/* Heures */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
                Heure départ *
              </label>
              <input
                type="time"
                value={form.heureDepart}
                onChange={(e) => set("heureDepart", e.target.value)}
                className={inputCls(errors.heureDepart)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
                Heure arrivée *
              </label>
              <input
                type="time"
                value={form.heureArrivee}
                onChange={(e) => set("heureArrivee", e.target.value)}
                className={inputCls(errors.heureArrivee)}
              />
            </div>
          </div>

          {/* Jours */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">
              Jours d'opération *
            </label>
            <div className="flex flex-wrap gap-2">
              {JOURS.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleJour(key)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition ${
                    form.joursOperation.includes(key)
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-600 border-gray-200 hover:border-primary/40"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {errors.jours && (
              <p className="text-red-500 text-xs mt-1">{errors.jours}</p>
            )}
          </div>

          {/* Classe + Prix */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
                Classe
              </label>
              <select
                value={form.classVoyageId ?? ""}
                onChange={(e) => set("classVoyageId", e.target.value || null)}
                className={inputCls()}
              >
                <option value="">— Sans classe —</option>
                {classes.map((c) => (
                  <option key={c.idClassVoyage} value={c.idClassVoyage}>
                    {c.nom}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
                Prix indicatif (FCFA)
              </label>
              <input
                type="number"
                value={form.prix ?? ""}
                onChange={(e) =>
                  set("prix", e.target.value ? Number(e.target.value) : null)
                }
                placeholder="ex: 6000"
                className={inputCls()}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
              Description (optionnel)
            </label>
            <textarea
              value={form.description ?? ""}
              onChange={(e) => set("description", e.target.value)}
              rows={2}
              className={inputCls()}
              placeholder="Notes sur ce créneau..."
            />
          </div>

          {/* Actif toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.actif}
              onChange={(e) => set("actif", e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-700">
              Créneau actif (visible sur la page publique)
            </span>
          </label>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-5 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-primary rounded-xl hover:bg-primary/90 transition disabled:opacity-60"
          >
            <Save size={15} />
            {isSaving
              ? "Sauvegarde..."
              : initial
                ? "Modifier"
                : "Créer le créneau"}
          </button>
        </div>
      </div>
    </div>
  );
}
