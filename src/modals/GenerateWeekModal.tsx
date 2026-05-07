// src/modals/GenerateWeekModal.tsx
"use client";

// =========================================================================
// Bloc 4 — Modale "Générer la semaine"
//
// Workflow :
//   1. L'utilisateur ouvre la modale (depuis le header de la grille hebdo).
//   2. Il choisit la semaine (lundi).
//   3. Il clique "Prévisualiser" → POST /voyage/matching-preview
//   4. Il revoit la liste des lignes (publiables / incomplètes).
//   5. Il clique "Lancer la génération" → POST /voyage/generer-semaine
//   6. Affichage du résultat (X publiés, Y brouillonnés, erreurs).
//
// Ce composant ne touche PAS au design global du dashboard.
// =========================================================================

import React, { useEffect, useState } from "react";
import {
  X,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import {
  matchingPreview,
  genererSemaine,
  getMondayOfWeek,
} from "@/lib/services/voyage-generation-service";
import {
  MatchingPreviewItem,
  GenerationSemaineResponse,
} from "@/lib/types/planning";
import { PlannerTrip } from "@/lib/types/models/Trip";
import toast from "react-hot-toast";

interface GenerateWeekModalProps {
  isOpen: boolean;
  onClose: () => void;
  agencyId: string;
  /** Liste des créneaux disponibles (PlannerTrip[]) — utilisée pour la sélection. */
  trips: PlannerTrip[];
  /** Callback appelé après une génération réussie pour rafraîchir l'UI parente. */
  onGenerated?: () => void;
}

type Step = "select" | "preview" | "result";

export default function GenerateWeekModal({
  isOpen,
  onClose,
  agencyId,
  trips,
  onGenerated,
}: GenerateWeekModalProps) {
  const [step, setStep] = useState<Step>("select");
  const [semaineDebut, setSemaineDebut] = useState<string>(getMondayOfWeek());
  const [selectedLignesIds, setSelectedLignesIds] = useState<string[]>([]);

  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewItems, setPreviewItems] = useState<MatchingPreviewItem[]>([]);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const [genLoading, setGenLoading] = useState(false);
  const [genResult, setGenResult] = useState<GenerationSemaineResponse | null>(
    null,
  );
  const [genError, setGenError] = useState<string | null>(null);

  // Reset de l'état à chaque ouverture
  useEffect(() => {
    if (isOpen) {
      setStep("select");
      setSemaineDebut(getMondayOfWeek());
      // Par défaut, tous les créneaux sont sélectionnés
      setSelectedLignesIds(trips.map((t) => t.id).filter(Boolean));
      setPreviewItems([]);
      setPreviewError(null);
      setGenResult(null);
      setGenError(null);
    }
  }, [isOpen, trips]);

  const toggleLigne = (id: string) => {
    setSelectedLignesIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const selectAll = () => {
    setSelectedLignesIds(trips.map((t) => t.id).filter(Boolean));
  };
  const deselectAll = () => {
    setSelectedLignesIds([]);
  };

  const goToPreview = async () => {
    if (selectedLignesIds.length === 0) {
      toast.error("Sélectionnez au moins une ligne.");
      return;
    }
    setPreviewError(null);
    setPreviewLoading(true);
    try {
      const res = await matchingPreview({
        agenceId: agencyId,
        lignesIds: selectedLignesIds,
        semaineDebut,
      });
      setPreviewItems(res.voyagesPreview ?? []);
      setStep("preview");
    } catch (e: unknown) {
      console.error(e);
      setPreviewError(
        "Impossible de prévisualiser le matching. Vérifiez votre sélection.",
      );
    } finally {
      setPreviewLoading(false);
    }
  };

  const launchGeneration = async () => {
    setGenError(null);
    setGenLoading(true);
    try {
      const res = await genererSemaine({
        agenceId: agencyId,
        lignesIds: selectedLignesIds,
        semaineDebut,
      });
      setGenResult(res);
      setStep("result");
      onGenerated?.();
    } catch (e: unknown) {
      console.error(e);
      setGenError(
        "Erreur lors de la génération de la semaine. Veuillez réessayer.",
      );
    } finally {
      setGenLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl relative max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Générer les voyages de la semaine
              </h2>
              <p className="text-xs text-gray-500">
                {step === "select" && "Étape 1/3 — Sélection"}
                {step === "preview" && "Étape 2/3 — Prévisualisation"}
                {step === "result" && "Étape 3/3 — Résultat"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700"
            aria-label="Fermer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* ============== ÉTAPE 1 — SÉLECTION ============== */}
          {step === "select" && (
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="semaineDebut"
                  className="block text-sm font-medium text-gray-700"
                >
                  Semaine (lundi)
                </label>
                <input
                  id="semaineDebut"
                  type="date"
                  value={semaineDebut}
                  onChange={(e) =>
                    setSemaineDebut(getMondayOfWeek(new Date(e.target.value)))
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <p className="text-xs text-gray-500 mt-1">
                  La date sera automatiquement ajustée au lundi de la semaine
                  choisie.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Lignes à inclure ({selectedLignesIds.length}/{trips.length})
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={selectAll}
                      className="text-xs text-primary hover:underline"
                    >
                      Tout sélectionner
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      type="button"
                      onClick={deselectAll}
                      className="text-xs text-primary hover:underline"
                    >
                      Tout désélectionner
                    </button>
                  </div>
                </div>

                {trips.length === 0 ? (
                  <p className="text-sm text-gray-500 italic p-4 bg-gray-50 rounded">
                    Aucune ligne planifiée. Ajoutez d&apos;abord des créneaux à
                    votre planning.
                  </p>
                ) : (
                  <div className="border border-gray-200 rounded-md max-h-60 overflow-y-auto">
                    {trips.map((t) => (
                      <label
                        key={t.id}
                        className="flex items-start gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <input
                          type="checkbox"
                          checked={selectedLignesIds.includes(t.id)}
                          onChange={() => toggleLigne(t.id)}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {t.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {dayLabel(t.dayOfWeek)} · {t.startTime} –{" "}
                            {t.endTime} · {t.category}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {previewError && (
                <p className="text-sm text-red-600">{previewError}</p>
              )}
            </div>
          )}

          {/* ============== ÉTAPE 2 — PREVIEW ============== */}
          {step === "preview" && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Aperçu du matching pour la semaine du{" "}
                <strong>{semaineDebut}</strong> :
              </p>
              {previewItems.length === 0 ? (
                <p className="text-sm italic text-gray-500 p-4 bg-gray-50 rounded">
                  Aucun voyage ne correspond aux lignes sélectionnées sur cette
                  semaine.
                </p>
              ) : (
                <ul className="space-y-2">
                  {previewItems.map((item) => {
                    const ok = item.statutPrevu === "PUBLIE";
                    return (
                      <li
                        key={item.ligneServiceId}
                        className={`p-3 rounded-md border flex items-start gap-3 ${
                          ok
                            ? "border-green-200 bg-green-50"
                            : "border-orange-200 bg-orange-50"
                        }`}
                      >
                        {ok ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900">
                            {item.titre ||
                              `${item.lieuDepart ?? "—"} → ${
                                item.lieuArrive ?? "—"
                              }`}
                          </div>
                          <div className="text-xs text-gray-600 mt-0.5">
                            {item.dateDepartPrev?.replace("T", " à ")}
                          </div>
                          <div
                            className={`text-xs font-semibold mt-1 ${
                              ok ? "text-green-700" : "text-orange-700"
                            }`}
                          >
                            {ok ? "Publiable" : "Brouillon (incomplet)"}
                          </div>
                          {item.conflits && item.conflits.length > 0 && (
                            <ul className="text-xs text-orange-700 mt-1 list-disc list-inside">
                              {item.conflits.map((c, i) => (
                                <li key={i}>{c}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
              {genError && <p className="text-sm text-red-600">{genError}</p>}
            </div>
          )}

          {/* ============== ÉTAPE 3 — RESULTAT ============== */}
          {step === "result" && genResult && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                  <div className="text-xs text-green-700 font-medium uppercase">
                    Publiés
                  </div>
                  <div className="text-3xl font-bold text-green-700 mt-1">
                    {genResult.totalPublie}
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
                  <div className="text-xs text-orange-700 font-medium uppercase">
                    Brouillons
                  </div>
                  <div className="text-3xl font-bold text-orange-700 mt-1">
                    {genResult.totalBrouillons}
                  </div>
                </div>
              </div>

              {genResult.erreurs && genResult.erreurs.length > 0 && (
                <div className="p-3 rounded-md bg-red-50 border border-red-200">
                  <div className="text-sm font-medium text-red-700 mb-1">
                    Erreurs ({genResult.erreurs.length})
                  </div>
                  <ul className="text-xs text-red-700 list-disc list-inside">
                    {genResult.erreurs.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="text-sm text-gray-600">
                Les voyages publiés sont visibles dans le marketplace. Les
                brouillons (manque de chauffeur, conflit véhicule, etc.) peuvent
                être corrigés depuis l&apos;onglet <strong>Brouillons</strong>.
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="border-t border-gray-100 p-4 flex justify-end gap-2">
          {step === "select" && (
            <>
              <button
                onClick={onClose}
                className="py-2 px-4 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300"
              >
                Annuler
              </button>
              <button
                onClick={goToPreview}
                disabled={previewLoading || selectedLignesIds.length === 0}
                className="py-2 px-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {previewLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Prévisualiser
              </button>
            </>
          )}
          {step === "preview" && (
            <>
              <button
                onClick={() => setStep("select")}
                className="py-2 px-4 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300"
                disabled={genLoading}
              >
                Retour
              </button>
              <button
                onClick={launchGeneration}
                disabled={genLoading || previewItems.length === 0}
                className="py-2 px-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {genLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Lancer la génération
              </button>
            </>
          )}
          {step === "result" && (
            <button
              onClick={onClose}
              className="py-2 px-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 shadow-md"
            >
              Fermer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function dayLabel(d: number): string {
  const labels = [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche",
  ];
  return labels[Math.max(0, Math.min(6, d - 1))];
}
// END OF FILE: src/modals/GenerateWeekModal.tsx
