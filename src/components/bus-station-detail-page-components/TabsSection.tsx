"use client";
/**
 * TabsSection.tsx  (mis à jour — P-07)
 *
 * Conteneur d'onglets de la page détail d'une gare.
 * Retypé avec les nouveaux types : Gare, AgenceVoyageFull, DepartDuJour.
 */

import { useState } from "react";
import { Users, Bus, Info } from "lucide-react";
import AgenciesTab from "./AgenciesTab";
import DeparturesTab from "./DeparturesTab";
import InfoTab from "./InfoTab";
import type { Gare, DepartDuJour } from "@/lib/types/gare.types";
import type { AgenceVoyageFull } from "@/lib/types/agence.types";

type Tab = "agences" | "departs" | "infos";

type TabsSectionProps = {
  station: Gare;
  agences: AgenceVoyageFull[];
  departs: DepartDuJour[];
};

const TabsSection = ({ station, agences, departs }: TabsSectionProps) => {
  const [activeTab, setActiveTab] = useState<Tab>("agences");

  const tabs = [
    {
      id: "agences" as Tab,
      label: "Agences présentes",
      icon: <Users size={15} />,
      count: agences.length,
    },
    {
      id: "departs" as Tab,
      label: "Prochains départs",
      icon: <Bus size={15} />,
      count: departs.length,
    },
    {
      id: "infos" as Tab,
      label: "Infos pratiques",
      icon: <Info size={15} />,
      count: null,
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Navigation */}
      <div className="border-b border-gray-100">
        <nav className="flex" aria-label="Onglets">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 whitespace-nowrap py-4 px-5 text-sm font-medium border-b-2 transition
                ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200"
                }`}
            >
              {tab.icon}
              {tab.label}
              {tab.count !== null && (
                <span
                  className={`ml-1 text-xs font-semibold rounded-full px-1.5 py-0.5
                    ${
                      activeTab === tab.id
                        ? "bg-primary/10 text-primary"
                        : "bg-gray-100 text-gray-500"
                    }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenu */}
      <div className="p-5">
        {activeTab === "agences" && <AgenciesTab agences={agences} />}
        {activeTab === "departs" && <DeparturesTab departs={departs} />}
        {activeTab === "infos" && <InfoTab station={station} />}
      </div>
    </div>
  );
};

export default TabsSection;
