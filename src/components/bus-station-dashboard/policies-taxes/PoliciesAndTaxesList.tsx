// src/components/bus-station-dashboard/policies-taxes/PoliciesAndTaxesList.tsx
import React from "react";
import { PolicyAndTax } from "@/lib/types/bus-station";
import { FileText, Tag } from "lucide-react";

interface PoliciesAndTaxesListProps {
  policiesAndTaxes: PolicyAndTax[];
}

const PoliciesAndTaxesList: React.FC<PoliciesAndTaxesListProps> = ({
  policiesAndTaxes,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          Politiques et Taxes
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Gestion des règlements et des taxes de la gare routière.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {policiesAndTaxes.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.title}
                </h3>
                <span
                  className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    item.category === "TAXE"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-purple-100 text-purple-800"
                  }`}
                >
                  {item.category}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600">{item.description}</p>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center">
                  <Tag className="h-4 w-4 text-gray-400 mr-2" />
                  <span>
                    Montant:{" "}
                    {item.amount
                      ? `${item.amount.toLocaleString()} FCFA`
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center">
                  <FileText className="h-4 w-4 text-gray-400 mr-2" />
                  <span>Date d'effet: {item.effectiveDate}</span>
                </div>
              </div>
            </div>
            {item.documentUrl && (
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                <a
                  href={item.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                >
                  Voir le document
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PoliciesAndTaxesList;
