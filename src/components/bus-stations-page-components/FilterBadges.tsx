'use client';

import React from 'react';
import { Wifi, ParkingSquare, Utensils, Armchair, ShieldCheck } from 'lucide-react';

const serviceIcons: { [key: string]: React.ReactNode } = {
  WIFI: <Wifi size={14} className="mr-1.5" />,
  PARKING: <ParkingSquare size={14} className="mr-1.5" />,
  RESTAURATION: <Utensils size={14} className="mr-1.5" />,
  SALLE_ATTENTE: <Armchair size={14} className="mr-1.5" />,
  SECURITE: <ShieldCheck size={14} className="mr-1.5" />,
  TOILETTES: <span className="mr-1.5">🚻</span>,
};

const serviceLabels: { [key: string]: string } = {
  WIFI: "Wi-Fi",
  PARKING: "Parking",
  RESTAURATION: "Restauration",
  SALLE_ATTENTE: "Salle d'attente",
  SECURITE: "Sécurité",
  TOILETTES: "Toilettes",
}

type FilterBadgesProps = {
  services: string[];
  selectedServices: string[];
  onServiceToggle: (service: string) => void;
};

const FilterBadges = ({ services, selectedServices, onServiceToggle }: FilterBadgesProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {services.map((service) => {
        const isSelected = selectedServices.includes(service);
        return (
          <button
            key={service}
            onClick={() => onServiceToggle(service)}
            className={`flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              isSelected
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {serviceIcons[service]}
            {serviceLabels[service]}
          </button>
        );
      })}
    </div>
  );
};

export default FilterBadges;
