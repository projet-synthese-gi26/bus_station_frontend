"use client";
/**
 * InfoTab.tsx  (mis à jour — P-07)
 *
 * Onglet "Infos Pratiques" sur la page détail d'une gare.
 * Retypé avec `Gare` : affiche description, termes_et_conditions, tax_policy.
 * Plus de règlement hardcodé.
 */

import type { Gare } from "@/lib/types/gare.types";
import { Info, FileText, CreditCard } from "lucide-react";

type InfoTabProps = {
  station: Gare;
};

const InfoTab = ({ station }: InfoTabProps) => {
  return (
    <div className="space-y-6 text-sm">
      {station.description && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-gray-800">À propos de la gare</h3>
          </div>
          <p className="text-gray-600 leading-relaxed">{station.description}</p>
        </div>
      )}

      {station.termes_et_conditions && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-gray-800">Termes & Conditions</h3>
          </div>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">
            {station.termes_et_conditions}
          </p>
        </div>
      )}

      {station.tax_policy && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-gray-800">Politique de taxes</h3>
          </div>
          <p className="text-gray-600 leading-relaxed">{station.tax_policy}</p>
        </div>
      )}

      {!station.description &&
        !station.termes_et_conditions &&
        !station.tax_policy && (
          <p className="text-gray-400 text-center py-6">
            Aucune information disponible pour cette gare.
          </p>
        )}
    </div>
  );
};

export default InfoTab;
