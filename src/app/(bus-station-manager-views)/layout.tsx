"use client";
/**
 * app/(bus-station-manager-views)/layout.tsx  (mis à jour — P-24)
 *
 * Ajoute le BsmProvider pour partager l'état BSM entre toutes les pages.
 * Le reste de la structure (sidebar, navbar) est conservé à l'identique.
 */

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import BusStationManagerSidebar from "@/components/bus-station-dashboard/BusStationDashboardSidebar";
import { BsmProvider } from "@/lib/contexts/BsmContext";

export default function BusStationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <BsmProvider>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <BusStationManagerSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </BsmProvider>
  );
}
