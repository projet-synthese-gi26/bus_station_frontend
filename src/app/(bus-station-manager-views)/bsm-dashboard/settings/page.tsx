// ============================================================
// P-29 : bsm-settings-page.tsx → app/.../bsm-dashboard/settings/page.tsx
// ============================================================

"use client";

import { useState, useEffect } from "react";
import { Save, XCircle } from "lucide-react";
import { useBsmDashboard as useBsm } from "@/lib/hooks/useBsmDashboard";
import Loader from "@/modals/Loader";

export default function BsmSettingsPage() {
  const bsm = useBsm() as any;
  const compte = bsm?.compte;
  const isLoading = bsm?.isLoading;
  const saveCompte = bsm?.saveCompte;

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ nom: "", email: "", telephone: "" });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (compte) {
      setForm({
        nom: compte.nom ?? "",
        email: compte.email ?? "",
        telephone: compte.telephone ?? "",
      });
    }
  }, [compte]);

  const handleSave = async () => {
    if (!saveCompte) return;
    setIsSaving(true);
    try {
      await saveCompte(form);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Paramètres BSM</h1>
      <div className="space-y-4 bg-white p-6 rounded-xl border border-gray-200">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom
          </label>
          <input
            type="text"
            value={form.nom}
            disabled={!isEditing}
            onChange={(e) => setForm({ ...form, nom: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 disabled:bg-gray-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={form.email}
            disabled={!isEditing}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 disabled:bg-gray-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Téléphone
          </label>
          <input
            type="tel"
            value={form.telephone}
            disabled={!isEditing}
            onChange={(e) => setForm({ ...form, telephone: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 disabled:bg-gray-50"
          />
        </div>
        <div className="flex gap-3 pt-4">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg"
            >
              Modifier
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Enregistrement…" : "Enregistrer"}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg"
              >
                <XCircle className="h-4 w-4" />
                Annuler
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
