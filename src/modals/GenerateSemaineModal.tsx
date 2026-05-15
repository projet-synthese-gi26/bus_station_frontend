"use client";

import { useState } from "react";
import {
  X,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Rocket,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { format, startOfWeek, addWeeks, addDays } from "date-fns";
import { fr } from "date-fns/locale";
import apiClient from "@/lib/api/api-client";
import { API_ROUTES } from "@/lib/config/api.config";
import type { LigneService } from "@/lib/types/ligne-service.types";
import type { AgenceVoyageFull } from "@/lib/types/agence.types";
import type { MatchingPreviewItem } from "@/lib/types/voyage.types";
import toast from "react-hot-toast";

interface GenerateSemaineModalProps {
  isOpen: boolean;
  onClose: () => void;
  lignes: LigneService[];
  agency: AgenceVoyageFull | null;
  onGenerated: () => void;
}

export default function GenerateSemaineModal({
  isOpen,
  onClose,
  lignes,
  agency,
  onGenerated,
}: GenerateSemaineModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [weekOffset, setWeekOffset] = useState(1);
  const [preview, setPreview] = useState<MatchingPreviewItem[]>([]);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const semaineDebut = startOfWeek(addWeeks(new Date(), weekOffset), {
    weekStartsOn: 1,
  });
  const semaineFin = addDays(semaineDebut, 6);
  const semaineLbl = `Semaine du ${format(semaineDebut, "d MMM", { locale: fr })} au ${format(semaineFin, "d MMM yyyy", { locale: fr })}`;

  const lignesActives = lignes.filter((l) => l.actif);
  const totalAttendus = lignesActives.reduce(
    (acc, l) => acc + l.joursOperation.length,
    0,
  );

  const handlePreview = async () => {
    if (!agency) return;

    setIsPreviewLoading(true);
    const toastId = toast.loading("Calcul du matching par le serveur...");

    try {
      console.log("[preview] agency.agencyId =", agency?.agencyId)
      const payload = {
        agenceId: agency.agencyId,
        lignesIds: lignesActives.map((l) => l.id),
        semaineDebut: format(semaineDebut, "yyyy-MM-dd"),
      };

      const res = await apiClient.post(API_ROUTES.generation.preview, payload);

      const data = res.data;
      let items: MatchingPreviewItem[] = [];
      if (Array.isArray(data)) items = data;
      else if (data?.items && Array.isArray(data.items)) items = data.items;
      else if (data?.content && Array.isArray(data.content)) items = data.content;

      items.sort(
        (a, b) => new Date(a.dateDepartPrev).getTime() - new Date(b.dateDepartPrev).getTime()
      );

      setPreview(items);
      setStep(2);
      toast.dismiss(toastId);
    } catch (error) {
      console.error("[GenerateSemaineModal] Erreur de prévisualisation :", error);
      toast.error("Erreur lors de la prévisualisation du matching.", { id: toastId });
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const totalPublie = preview.filter((p) => p.statutPrevu === "PUBLIE").length;
  const totalIncomplet = preview.filter((p) => p.statutPrevu === "INCOMPLET").length;

  const handleGenerate = async () => {
    if (!agency) return;

    setIsGenerating(true);
    const toastId = toast.loading("Génération en cours...");

    try {
      await apiClient.post(API_ROUTES.generation.semaine, {
        agenceId: agency.agencyId,
        lignesIds: lignesActives.map((l) => l.id),
        semaineDebut: format(semaineDebut, "yyyy-MM-dd"),
      });

      toast.success(
        "Semaine générée avec succès ! Les voyages et brouillons ont été créés.",
        { id: toastId, duration: 4000 },
      );

      onGenerated();
      onClose();
    } catch (error) {
      console.error("[GenerateSemaineModal] Erreur de génération :", error);
      toast.error("Erreur lors de la génération de la semaine.", { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-primary" />
            <h2 className="font-bold text-gray-800">Générer la semaine</h2>
          </div>
          <button
            onClick={() => {
              onClose();
              setStep(1);
            }}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        {/* Corps */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {step === 1 && (
            <>
              <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                <button
                  onClick={() => setWeekOffset((w) => Math.max(1, w - 1))}
                  disabled={weekOffset <= 1 || isPreviewLoading}
                  className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-30 transition"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="text-center">
                  <p className="font-semibold text-gray-800">{semaineLbl}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {lignesActives.length} ligne
                    {lignesActives.length > 1 ? "s" : ""} active
                    {lignesActives.length > 1 ? "s" : ""} · {totalAttendus}{" "}
                    voyage{totalAttendus > 1 ? "s" : ""} à générer
                  </p>
                </div>
                <button
                  onClick={() => setWeekOffset((w) => w + 1)}
                  disabled={isPreviewLoading}
                  className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-30 transition"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              {lignesActives.length === 0 && (
                <div className="flex items-center gap-2 text-orange-600 text-sm bg-orange-50 rounded-xl px-4 py-3">
                  <AlertCircle size={15} />
                  Aucune ligne de service active. Créez des créneaux dans le
                  planning d'abord.
                </div>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-full font-semibold">
                  <CheckCircle2 size={14} /> {totalPublie} publiés (estimé)
                </span>
                <span className="flex items-center gap-1.5 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full font-semibold">
                  <AlertCircle size={14} /> {totalIncomplet} brouillons (estimé)
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-3 py-2.5 font-semibold text-gray-500">Trajet</th>
                      <th className="text-left px-3 py-2.5 font-semibold text-gray-500">Date</th>
                      <th className="text-left px-3 py-2.5 font-semibold text-gray-500">Véhicule</th>
                      <th className="text-left px-3 py-2.5 font-semibold text-gray-500">Chauffeur</th>
                      <th className="text-left px-3 py-2.5 font-semibold text-gray-500">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {preview.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-3 py-6 text-center text-gray-500">
                          Aucun résultat pour cette prévisualisation.
                        </td>
                      </tr>
                    ) : (
                      preview.map((item, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-3 py-2 font-medium text-gray-700">
                            {item.titre}
                          </td>
                          <td className="px-3 py-2 text-gray-500">
                            {format(new Date(item.dateDepartPrev), "EEE dd/MM HH:mm", { locale: fr })}
                          </td>
                          <td className="px-3 py-2">
                            {item.vehiculeMatche ? (
                              <span className="text-green-600">✓ {item.vehiculeMatche.nom ?? 'Assigné'}</span>
                            ) : (
                              <span className="text-red-500">✗ Aucun</span>
                            )}
                          </td>
                          <td className="px-3 py-2">
                            {item.chauffeurMatche ? (
                              <span className="text-green-600">
                                ✓ {item.chauffeurMatche.first_name ?? 'Assigné'}
                              </span>
                            ) : (
                              <span className="text-red-500">✗ Aucun</span>
                            )}
                          </td>
                          <td className="px-3 py-2">
                            <span
                              className={`px-2 py-0.5 rounded-full font-semibold ${
                                item.statutPrevu === "PUBLIE"
                                  ? "bg-green-50 text-green-700"
                                  : "bg-orange-50 text-orange-600"
                              }`}
                            >
                              {item.statutPrevu}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-5 border-t border-gray-100 shrink-0">
          {step === 2 && (
            <button
              onClick={() => setStep(1)}
              disabled={isGenerating}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition"
            >
              ← Retour
            </button>
          )}
          <button
            onClick={() => {
              onClose();
              setStep(1);
            }}
            disabled={isPreviewLoading || isGenerating}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition"
          >
            Annuler
          </button>
          {step === 1 ? (
            <button
              onClick={handlePreview}
              disabled={lignesActives.length === 0 || isPreviewLoading}
              className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-primary rounded-xl hover:bg-primary/90 disabled:opacity-50 transition"
            >
              {isPreviewLoading ? <Loader2 size={15} className="animate-spin" /> : null}
              {isPreviewLoading ? "Calcul..." : "Aperçu du matching →"}
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-primary rounded-xl hover:bg-primary/90 disabled:opacity-60 transition"
            >
              {isGenerating ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Rocket size={15} />
              )}
              {isGenerating ? "Génération en cours..." : "Générer tous les voyages"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}