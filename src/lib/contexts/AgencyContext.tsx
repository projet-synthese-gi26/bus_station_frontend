"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Remplacez ceci par le vrai type de vos agences
interface Agency {
  id: string;
  name: string;
}

interface AgencyContextType {
  selectedAgency: Agency | null;
  setSelectedAgency: (agency: Agency | null) => void;
  agencies: Agency[];
  setAgencies: (agencies: Agency[]) => void;
}

const AgencyContext = createContext<AgencyContextType | undefined>(undefined);

export const AgencyProvider = ({ children }: { children: ReactNode }) => {
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [agencies, setAgencies] = useState<Agency[]>([]); // Sera rempli via une API plus tard

  return (
    <AgencyContext.Provider
      value={{ selectedAgency, setSelectedAgency, agencies, setAgencies }}
    >
      {children}
    </AgencyContext.Provider>
  );
};

export const useAgency = () => {
  const context = useContext(AgencyContext);
  if (context === undefined) {
    throw new Error("useAgency must be used within an AgencyProvider");
  }
  return context;
};
