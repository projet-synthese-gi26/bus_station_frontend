"use client";
/**
 * app/(bus-station-manager-views)/bsm-dashboard/infrastructure/page.tsx  (reconstruit — P-25)
 */

import { useState, useEffect } from "react";
import { Save, XCircle, MapPin, Building2 } from "lucide-react";
import Loader from "@/modals/Loader";
import { useBsm } from "@/lib/contexts/BsmContext";
import type { UpdateGareDTO } from "@/lib/types/gare.types";

const SERVICES_SUGGESTIONS = [
  "Salle d'attente climatisée",
  "Restauration",
  "Wi-Fi gratuit",
  "Toilettes",
  "Parking sécurisé",
  "Guichet Mobile Money",
  "Consigne bagages",
  "Pharmacie",
  "Infirmerie",
  "Boutiques souvenirs",
];

export default function InfrastructurePage() {
  const { gare, isLoading, saveGare } = useBsm();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<UpdateGareDTO>({});

  useEffect(() => {
    if (gare)
      setForm({
        nom: gare.nom,
        ville: gare.ville,
        quartier: gare.quartier ?? "",
        adresse: gare.adresse,
        latitude: gare.latitude ?? undefined,
        longitude: gare.longitude ?? undefined,
        description: gare.description ?? "",
        imageUrl: gare.imageUrl ?? "",
        services: gare.services ?? [],
        estOuvert: gare.estOuvert,
        horaires: gare.horaires ?? "",
        termes_et_conditions: gare.termes_et_conditions ?? "",
        president_name: gare.president_name ?? "",
      });
  }, [gare]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-60">
        <Loader />
      </div>
    );
  if (!gare) return null;

  const set = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));

  const toggleService = (s: string) =>
    setForm((p) => ({
      ...p,
      services: (p.services ?? []).includes(s)
        ? (p.services ?? []).filter((x) => x !== s)
        : [...(p.services ?? []), s],
    }));

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveGare(form);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const inputCls =
    "w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30";

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-primary" /> Infrastructure
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Informations publiques de la gare.
          </p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 text-sm text-primary border border-primary/30 rounded-xl hover:bg-primary/5 transition"
          >
            Modifier
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
            >
              <XCircle size={15} /> Annuler
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-4 py-2 text-sm text-white bg-primary rounded-xl hover:bg-primary/90 disabled:opacity-60 transition"
            >
              <Save size={15} /> {isSaving ? "Sauvegarde..." : "Sauvegarder"}
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        {/* Identité */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { k: "nom", label: "Nom de la gare" },
            { k: "ville", label: "Ville" },
            { k: "quartier", label: "Quartier" },
            { k: "president_name", label: "Nom du responsable" },
            { k: "horaires", label: "Horaires d'ouverture" },
            { k: "imageUrl", label: "URL de l'image" },
          ].map(({ k, label }) => (
            <div key={k}>
              <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
                {label}
              </label>
              {isEditing ? (
                <input
                  value={(form as any)[k] ?? ""}
                  onChange={(e) => set(k, e.target.value)}
                  className={inputCls}
                />
              ) : (
                <p className="text-sm text-gray-700">
                  {(gare as any)[k] || (
                    <span className="text-gray-400 italic">—</span>
                  )}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Adresse complète */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
            Adresse
          </label>
          {isEditing ? (
            <input
              value={form.adresse ?? ""}
              onChange={(e) => set("adresse", e.target.value)}
              className={inputCls}
            />
          ) : (
            <p className="text-sm text-gray-700">{gare.adresse}</p>
          )}
        </div>

        {/* Coordonnées GPS */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { k: "latitude", label: "Latitude" },
            { k: "longitude", label: "Longitude" },
          ].map(({ k, label }) => (
            <div key={k}>
              <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block flex items-center gap-1">
                <MapPin size={11} /> {label}
              </label>
              {isEditing ? (
                <input
                  type="number"
                  step="any"
                  value={(form as any)[k] ?? ""}
                  onChange={(e) =>
                    set(k, parseFloat(e.target.value) || undefined)
                  }
                  className={inputCls}
                />
              ) : (
                <p className="text-sm font-mono text-gray-700">
                  {(gare as any)[k] ?? "—"}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
            Description
          </label>
          {isEditing ? (
            <textarea
              value={form.description ?? ""}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              className={inputCls + " resize-none"}
            />
          ) : (
            <p className="text-sm text-gray-700 whitespace-pre-line">
              {gare.description || (
                <span className="text-gray-400 italic">—</span>
              )}
            </p>
          )}
        </div>

        {/* Statut + Services */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">
            Statut
          </label>
          {isEditing ? (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.estOuvert ?? false}
                onChange={(e) => set("estOuvert", e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-700">Gare ouverte</span>
            </label>
          ) : (
            <span
              className={`text-xs font-semibold px-3 py-1.5 rounded-full ${gare.estOuvert ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
            >
              {gare.estOuvert ? "Ouvert" : "Fermé"}
            </span>
          )}
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">
            Services disponibles
          </label>
          <div className="flex flex-wrap gap-2">
            {SERVICES_SUGGESTIONS.map((s) => {
              const active = (form.services ?? []).includes(s);
              return isEditing ? (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleService(s)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition ${active ? "bg-primary text-white border-primary" : "bg-white text-gray-600 border-gray-200 hover:border-primary/40"}`}
                >
                  {s}
                </button>
              ) : active ? (
                <span
                  key={s}
                  className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full"
                >
                  {s}
                </span>
              ) : null;
            })}
            {!isEditing && (form.services ?? []).length === 0 && (
              <span className="text-sm text-gray-400 italic">
                Aucun service renseigné.
              </span>
            )}
          </div>
        </div>

        {/* Termes & conditions */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
            Termes & Conditions
          </label>
          {isEditing ? (
            <textarea
              value={form.termes_et_conditions ?? ""}
              onChange={(e) => set("termes_et_conditions", e.target.value)}
              rows={4}
              className={inputCls + " resize-none"}
            />
          ) : (
            <p className="text-sm text-gray-600 whitespace-pre-line">
              {gare.termes_et_conditions || (
                <span className="text-gray-400 italic">—</span>
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
