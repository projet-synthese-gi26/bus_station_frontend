"use client";
// src/components/bus-station-detail-page-components/ServicesSection.tsx

import {
  Wifi,
  ParkingCircle,
  Utensils,
  Monitor,
  Toilet,
  Shield,
} from "lucide-react";
import type { Gare } from "@/lib/types/gare.types";

interface ServicesSectionProps {
  // Accepte string[] ou undefined (Gare.services est optionnel)
  services?: string[];
}

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  WIFI: <Wifi className="w-5 h-5" />,
  PARKING: <ParkingCircle className="w-5 h-5" />,
  RESTAURATION: <Utensils className="w-5 h-5" />,
  SECURITE: <Shield className="w-5 h-5" />,
  TOILETTES: <Toilet className="w-5 h-5" />,
};

const ServicesSection = ({ services }: ServicesSectionProps) => {
  if (!services || services.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Services disponibles
      </h2>
      <div className="flex flex-wrap gap-3">
        {services.map((service) => (
          <div
            key={service}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-primary rounded-full text-sm font-medium"
          >
            {SERVICE_ICONS[service] ?? <Monitor className="w-4 h-4" />}
            <span>{service.replace(/_/g, " ")}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesSection;
