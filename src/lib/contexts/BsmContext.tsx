"use client";
/**
 * BsmContext.tsx  (nouveau — P-24 à P-29)
 *
 * Partage l'état du hook useBsmDashboard entre toutes les pages BSM
 * sans refaire un appel API dans chaque page.
 * À placer dans le layout BSM.
 */

import React, { createContext, useContext } from "react";
import { useBsmDashboard } from "@/lib/hooks/useBsmDashboard";

type BsmContextType = ReturnType<typeof useBsmDashboard>;

const BsmContext = createContext<BsmContextType | null>(null);

export function BsmProvider({ children }: { children: React.ReactNode }) {
  const bsm = useBsmDashboard();
  return <BsmContext.Provider value={bsm}>{children}</BsmContext.Provider>;
}

export function useBsm(): BsmContextType {
  const ctx = useContext(BsmContext);
  if (!ctx) throw new Error("useBsm must be used inside BsmProvider");
  return ctx;
}
