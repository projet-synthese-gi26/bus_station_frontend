// src/components/bus-station-dashboard/StationDetails.tsx

import React from "react";
import { BusStation } from "@/lib/types/bus-station";
import { MapPin, Info } from "lucide-react";

interface StationDetailsProps {
  station: BusStation;
}

const StationDetails: React.FC<StationDetailsProps> = ({ station }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">{station.nom}</h2>
      <div className="flex items-center mb-2">
        <MapPin className="text-gray-500 mr-2" />
        <p>{station.adresse}</p>
      </div>
      <div className="flex items-center">
        <Info className="text-gray-500 mr-2" />
        <p>{station.description}</p>
      </div>
      {/* TODO: Add map component */}
    </div>
  );
};

export default StationDetails;
