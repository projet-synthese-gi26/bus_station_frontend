// ============================================================
// P-28 : bsm-alertes-page.tsx → app/.../bsm-dashboard/alertes/page.tsx
// ============================================================
"use client";

import {
  Bell,
  Send,
  AlertTriangle,
  CreditCard,
  Info,
  ShieldOff,
  ShieldCheck,
} from "lucide-react";
import Loader from "@/modals/Loader";
import { useBsm } from "@/lib/contexts/BsmContext";
import type { TypeAlerte } from "@/lib/types/bsm.types";

const ICON: Record<TypeAlerte, React.ReactNode> = {
  ALERTE_GENERALE: <Bell size={14} className="text-blue-500" />,
  TAX_REMINDER: <CreditCard size={14} className="text-orange-500" />,
  AVERTISSEMENT: <AlertTriangle size={14} className="text-yellow-500" />,
  SUSPENSION_NOTICE: <ShieldOff size={14} className="text-red-500" />,
  REACTIVATION_NOTICE: <ShieldCheck size={14} className="text-green-500" />,
};

const LABEL: Record<TypeAlerte, string> = {
  ALERTE_GENERALE: "Alerte générale",
  TAX_REMINDER: "Rappel de taxe",
  AVERTISSEMENT: "Avertissement",
  SUSPENSION_NOTICE: "Avis de suspension",
  REACTIVATION_NOTICE: "Avis de réactivation",
};

export function AlertesPage() {
  const { alertes, agences, isLoading } = useBsm();

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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Historique des alertes
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {alertes.length} alerte{alertes.length > 1 ? "s" : ""} envoyée
          {alertes.length > 1 ? "s" : ""}
        </p>
      </div>

      {alertes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Bell className="w-10 h-10 text-gray-200 mb-4" />
          <p className="text-gray-400 text-sm">
            Aucune alerte envoyée pour le moment.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {[...alertes]
            .sort(
              (a, b) =>
                new Date(b.dateEnvoi).getTime() -
                new Date(a.dateEnvoi).getTime(),
            )
            .map((alerte) => (
              <div
                key={alerte.idAlerte}
                className={`bg-white rounded-xl border shadow-sm p-4 ${alerte.lu ? "border-gray-100" : "border-blue-100 bg-blue-50/20"}`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {ICON[alerte.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs font-semibold text-gray-700">
                        {LABEL[alerte.type]}
                      </span>
                      <span className="text-xs text-gray-400">
                        → {agenceName(alerte.agenceVoyageId)}
                      </span>
                      {!alerte.lu && (
                        <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full font-semibold">
                          Nouveau
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 whitespace-pre-line">
                      {alerte.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1.5">
                      {new Date(alerte.dateEnvoi).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {" · "}
                      {alerte.envoyePar}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default AlertesPage;
