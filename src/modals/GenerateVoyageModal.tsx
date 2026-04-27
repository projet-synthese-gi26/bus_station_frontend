"use client";
/**
 * GenerateVoyageModal.tsx  (nouveau — P-21)
 *
 * Modale "Générer un voyage" depuis un créneau LigneService (génération unitaire).
 * Pré-remplit depuis la LigneService, permet de choisir la date et les ressources.
 * Deux actions : "Sauvegarder en brouillon" et "Générer et Publier".
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, FileEdit, Rocket, AlertTriangle } from "lucide-react";
import type { LigneService } from "@/lib/types/ligne-service.types";
import type { AgenceVoyageFull } from "@/lib/types/agence.types";

interface GenerateVoyageModalProps {
  isOpen: boolean;
  onClose: () => void;
  ligne: LigneService | null;
  agency: AgenceVoyageFull | null;
}

export default function GenerateVoyageModal({
  isOpen,
  onClose,
  ligne,
  agency,
}: GenerateVoyageModalProps) {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setDate("");
      setError("");
    }
  }, [isOpen, ligne]);

  if (!isOpen || !ligne) return null;

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];

  const handleAction = (publish: boolean) => {
    if (!date) {
      setError("Veuillez sélectionner une date de départ.");
      return;
    }
    if (!ligne) return;

    // Naviguer vers /dashboard/trip-planning?from-ligne={id}&date={date}
    // Le hook useTripPlanner pré-remplira le formulaire
    const params = new URLSearchParams({
      "from-ligne": ligne.id,
      date,
    });
    if (publish) params.set("publish", "1");

    onClose();
    router.push(`/dashboard/trip-planning?${params.toString()}`);
  };

  const hasDefaultResources = !!(
    agency?.vehiculeIdDefaut && agency?.chauffeurIdDefaut
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-800">Générer un voyage</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        {/* Corps */}
        <div className="p-5 space-y-4">
          {/* Résumé du créneau */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-1 text-sm">
            <p className="font-semibold text-gray-800">
              {ligne.lieuDepart} → {ligne.lieuArrive}
            </p>
            <p className="text-gray-500">
              {ligne.heureDepart} – {ligne.heureArrivee}
              {ligne.nomClasse && (
                <span className="ml-2 px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs">
                  {ligne.nomClasse}
                </span>
              )}
            </p>
            {ligne.prix != null && (
              <p className="text-gray-500">
                {ligne.prix.toLocaleString("fr-FR")} FCFA
              </p>
            )}
          </div>

          {/* Sélection date */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">
              Date de départ *
            </label>
            <input
              type="date"
              min={minDateStr}
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setError("");
              }}
              className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                error ? "border-red-300" : "border-gray-200"
              }`}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          {/* Info ressources par défaut */}
          <div
            className={`flex items-start gap-2.5 text-xs rounded-xl p-3 ${
              hasDefaultResources
                ? "bg-green-50 text-green-700"
                : "bg-orange-50 text-orange-700"
            }`}
          >
            {hasDefaultResources ? (
              <>
                <span className="mt-0.5">✓</span>
                <p>
                  Les ressources par défaut de l'agence seront utilisées (bus et
                  chauffeur assignés automatiquement). Vous pourrez les modifier
                  dans le formulaire.
                </p>
              </>
            ) : (
              <>
                <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                <p>
                  Aucune ressource par défaut configurée. Le voyage sera
                  sauvegardé en brouillon <strong>INCOMPLET</strong> si vous ne
                  sélectionnez pas un bus et un chauffeur dans le formulaire.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row gap-2 p-5 border-t border-gray-100">
          <button
            onClick={() => handleAction(false)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
          >
            <FileEdit size={15} />
            Sauvegarder en brouillon
          </button>
          <button
            onClick={() => handleAction(true)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-primary rounded-xl hover:bg-primary/90 transition"
          >
            <Rocket size={15} />
            Générer et Publier
          </button>
        </div>
      </div>
    </div>
  );
}
