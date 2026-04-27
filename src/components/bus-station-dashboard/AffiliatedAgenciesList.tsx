// src/components/bus-station-dashboard/AffiliatedAgenciesList.tsx

import React from "react";
import { AgencyWithTaxStatus } from "@/lib/hooks/useBusStationDashboard";
import Image from "next/image";
import Link from "next/link";

interface AffiliatedAgenciesListProps {
  agencies: AgencyWithTaxStatus[];
}

const TaxStatusBadge: React.FC<{ status: AgencyWithTaxStatus["taxStatus"] }> = ({
  status,
}) => {
  const statusStyles = {
    payé: "bg-green-100 text-green-800",
    "en attente": "bg-yellow-100 text-yellow-800",
    "en retard": "bg-red-100 text-red-800",
  };

  if (!status) return null;

  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
        statusStyles[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
};

const AffiliatedAgenciesList: React.FC<AffiliatedAgenciesListProps> = ({
  agencies,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Agences Affiliées</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agencies.map((agency) => (
          <Link href={`/agency/${agency.id}`} key={agency.id} passHref>
            <div className="border p-4 rounded-lg cursor-pointer hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <Image
                    src={agency.logoUrl ?? "/placeholder.png"}
                    alt={agency.longName ?? "Agence"}
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                  <h3 className="text-lg font-semibold ml-4">
                    {agency.longName}
                  </h3>
                </div>
                <TaxStatusBadge status={agency.taxStatus} />
              </div>
              <p className="mt-2 text-gray-600">{agency.description}</p>
              {agency.taxStatus && (
                <div className="mt-4 text-sm">
                  <p>
                    <strong>Montant:</strong> {agency.taxAmount?.toLocaleString()} FCFA
                  </p>
                  <p>
                    <strong>Échéance:</strong> {agency.taxDueDate}
                  </p>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AffiliatedAgenciesList;
