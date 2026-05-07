"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import BusStationManagerSidebar from "@/components/bus-station-dashboard/BusStationDashboardSidebar";
import { BsmProvider } from "@/lib/contexts/BsmContext";
import { getBusStationNavLinks } from "@/app/(bus-station-manager-views)/bsm-dashboard/busStationNavLink";
import { useBusStation } from "@/context/Provider";

function BsmLayoutInner({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useTranslation();
  const { logout } = useBusStation();
  const { menuItems, secondaryMenuItems } = getBusStationNavLinks(t);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <BusStationManagerSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        menuItems={menuItems}
        secondaryMenuItems={secondaryMenuItems}
        logout={logout}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function BusStationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BsmProvider>
      <BsmLayoutInner>{children}</BsmLayoutInner>
    </BsmProvider>
  );
}