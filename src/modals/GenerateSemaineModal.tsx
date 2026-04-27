"use client";
/**
 * GenerateSemaineModal.tsx  (nouveau — P-21)
 *
 * Modale "Générer la semaine" — génération en masse depuis les LigneService actives.
 * Étape 1 : sélection de la semaine (week picker).
 * Étape 2 : tableau de prévisualisation du matching (simulé côté json-server).
 * Confirmation : génère tous les voyages (publiés + brouillons incomplets).
 */

import { useState, useCallback } from "react";
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
import type {
  LigneService,
  JourSemaine,
} from "@/lib/types/ligne-service.types";
import type { AgenceVoyageFull } from "@/lib/types/agence.types";
import type {
  MatchingPreviewItem,
  MatchingPreviewResponse,
} from "@/lib/types/voyage.types";
import toast from "react-hot-toast";

const JOUR_NUM: Record<JourSemaine, number> = {
  LUNDI: 1,
  MARDI: 2,
  MERCREDI: 3,
  JEUDI: 4,
  VENDREDI: 5,
  SAMEDI: 6,
  DIMANCHE: 7,
};

/** Simule le matching côté client (json-server ne calcule pas les disponibilités) */
function simulateMatching(
  lignes: LigneService[],
  semaineDebut: Date,
  agency: AgenceVoyageFull,
): MatchingPreviewItem[] {
  const items: MatchingPreviewItem[] = [];
  lignes
    .filter((l) => l.actif)
    .forEach((ligne) => {
      ligne.joursOperation.forEach((jour) => {
        const jourNum = JOUR_NUM[jour];
        // Date = lundi de la semaine + offset jour
        const date = addDays(semaineDebut, jourNum - 1);
        const dateDepartPrev = new Date(
          `${format(date, "yyyy-MM-dd")}T${ligne.heureDepart}:00`,
        ).toISOString();

        const hasVehicule = !!agency.vehiculeIdDefaut;
        const hasChauffeur = !!agency.chauffeurIdDefaut;
        const complet = hasVehicule && hasChauffeur;

        items.push({
          ligneServiceId: ligne.id,
          titre: `${ligne.lieuDepart} → ${ligne.lieuArrive}`,
          dateDepartPrev,
          vehiculeMatche: hasVehicule
            ? {
                idVehicule: agency.vehiculeIdDefaut!,
                nom: "Bus par défaut",
                modele: "",
              }
            : null,
          chauffeurMatche: hasChauffeur
            ? {
                userId: agency.chauffeurIdDefaut!,
                last_name: "Chauffeur",
                first_name: "par défaut",
              }
            : null,
          statutPrevu: complet ? "PUBLIE" : "INCOMPLET",
          conflits: complet
            ? []
            : [
                !hasVehicule ? "Aucun véhicule par défaut configuré" : "",
                !hasChauffeur ? "Aucun chauffeur par défaut configuré" : "",
              ].filter(Boolean),
        });
      });
    });
  return items.sort(
    (a, b) =>
      new Date(a.dateDepartPrev).getTime() -
      new Date(b.dateDepartPrev).getTime(),
  );
}

interface GenerateSemaineModalProps {
  isOpen: boolean;
  onClose: () => void;
  lignes: LigneService[];
  agency: AgenceVoyageFull | null;
  onGenerated: () => void; // refetch brouillons / voyages
}

export default function GenerateSemaineModal({
  isOpen,
  onClose,
  lignes,
  agency,
  onGenerated,
}: GenerateSemaineModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [weekOffset, setWeekOffset] = useState(1); // 1 = semaine prochaine par défaut
  const [preview, setPreview] = useState<MatchingPreviewItem[]>([]);
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

  const handlePreview = () => {
    if (!agency) return;
    const items = simulateMatching(lignesActives, semaineDebut, agency);
    setPreview(items);
    setStep(2);
  };

  const totalPublie = preview.filter((p) => p.statutPrevu === "PUBLIE").length;
  const totalIncomplet = preview.filter(
    (p) => p.statutPrevu === "INCOMPLET",
  ).length;

  const handleGenerate = async () => {
    if (!agency) return;
    setIsGenerating(true);
    const toastId = toast.loading("Génération en cours...");
    try {
      // Simulation : créer chaque brouillon/voyage via json-server
      // Le vrai backend exposera POST /voyage/generer-semaine
      await apiClient.post(API_ROUTES.generation.semaine, {
        agenceVoyageId: agency.agencyId,
        lignesIds: lignesActives.map((l) => l.id),
        semaineDebut: format(semaineDebut, "yyyy-MM-dd"),
      });
      toast.success(
        `${totalPublie} voyage${totalPublie > 1 ? "s" : ""} publié${totalPublie > 1 ? "s" : ""} · ${totalIncomplet} brouillon${totalIncomplet > 1 ? "s" : ""} créé${totalIncomplet > 1 ? "s" : ""}`,
        { id: toastId, duration: 4000 },
      );
      onGenerated();
      onClose();
    } catch {
      // json-server ne gère pas encore cet endpoint → simuler succès
      toast.success(
        `Simulation : ${totalPublie} publiés · ${totalIncomplet} brouillons`,
        { id: toastId, duration: 4000 },
      );
      onGenerated();
      onClose();
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
          {/* Étape 1 — sélection semaine */}
          {step === 1 && (
            <>
              <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                <button
                  onClick={() => setWeekOffset((w) => Math.max(1, w - 1))}
                  disabled={weekOffset <= 1}
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
                  className="p-2 rounded-lg hover:bg-gray-200 transition"
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

          {/* Étape 2 — tableau de prévisualisation */}
          {step === 2 && (
            <>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-full font-semibold">
                  <CheckCircle2 size={14} /> {totalPublie} publiés
                </span>
                <span className="flex items-center gap-1.5 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full font-semibold">
                  <AlertCircle size={14} /> {totalIncomplet} incomplets
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-3 py-2.5 font-semibold text-gray-500">
                        Trajet
                      </th>
                      <th className="text-left px-3 py-2.5 font-semibold text-gray-500">
                        Date
                      </th>
                      <th className="text-left px-3 py-2.5 font-semibold text-gray-500">
                        Véhicule
                      </th>
                      <th className="text-left px-3 py-2.5 font-semibold text-gray-500">
                        Chauffeur
                      </th>
                      <th className="text-left px-3 py-2.5 font-semibold text-gray-500">
                        Statut
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {preview.map((item, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-3 py-2 font-medium text-gray-700">
                          {item.titre}
                        </td>
                        <td className="px-3 py-2 text-gray-500">
                          {format(
                            new Date(item.dateDepartPrev),
                            "EEE dd/MM HH:mm",
                            { locale: fr },
                          )}
                        </td>
                        <td className="px-3 py-2">
                          {item.vehiculeMatche ? (
                            <span className="text-green-600">
                              ✓ {item.vehiculeMatche.nom}
                            </span>
                          ) : (
                            <span className="text-red-500">✗ Aucun</span>
                          )}
                        </td>
                        <td className="px-3 py-2">
                          {item.chauffeurMatche ? (
                            <span className="text-green-600">
                              ✓ {item.chauffeurMatche.first_name}
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
                    ))}
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
              className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
            >
              ← Retour
            </button>
          )}
          <button
            onClick={() => {
              onClose();
              setStep(1);
            }}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
          >
            Annuler
          </button>
          {step === 1 ? (
            <button
              onClick={handlePreview}
              disabled={lignesActives.length === 0}
              className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-primary rounded-xl hover:bg-primary/90 disabled:opacity-50 transition"
            >
              Aperçu du matching →
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
              {isGenerating ? "Génération..." : "Générer tous les voyages"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
