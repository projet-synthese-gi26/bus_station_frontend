// src/components/bus-station-dashboard/affiliated-agencies/DetailedAffiliatedAgenciesList.tsx
import React from "react";
import { AgencyWithTaxStatus } from "@/lib/hooks/useBusStationDashboard";
import Image from "next/image";
import { Bell } from "lucide-react";

const TaxStatusBadge: React.FC<{ status: AgencyWithTaxStatus["taxStatus"] }> = ({
  status,
}) => {
  const statusStyles = {
    payé: "bg-green-100 text-green-800",
    "en attente": "bg-yellow-100 text-yellow-800",
    "en retard": "bg-red-100 text-red-800",
  };

  if (!status) {
    return (
      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
        N/A
      </span>
    );
  }

  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
        statusStyles[status]
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

interface DetailedAffiliatedAgenciesListProps {
  agencies: AgencyWithTaxStatus[];
}

const DetailedAffiliatedAgenciesList: React.FC<
  DetailedAffiliatedAgenciesListProps
> = ({ agencies }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">
          Gestion des Agences Affiliées
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Suivi des paiements et statuts des taxes d'affiliation.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Agence
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Statut Taxe
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Montant
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Échéance
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {agencies.map((agency) => (
              <tr
                key={agency.id}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <Image
                        className="h-10 w-10 rounded-full object-cover"
                        src={agency.logoUrl ?? "/placeholder.png"}
                        alt={agency.longName ?? "Agence"}
                        width={40}
                        height={40}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {agency.longName}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {agency.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <TaxStatusBadge status={agency.taxStatus} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                  {agency.taxAmount
                    ? `${agency.taxAmount.toLocaleString()} FCFA`
                    : "N/A"}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    agency.taxStatus === "en retard"
                      ? "text-red-600 font-semibold"
                      : "text-gray-500"
                  }`}
                >
                  {agency.taxDueDate || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <button
                    className="flex items-center gap-2 justify-center w-full px-3 py-2 border border-transparent rounded-lg text-sm text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={agency.taxStatus !== "en retard"}
                  >
                    <Bell size={16} />
                    Rappel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DetailedAffiliatedAgenciesList;
