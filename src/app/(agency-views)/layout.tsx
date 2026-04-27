"use client";

import React, { useState } from "react";

// Imports de composants
import Footer from "@/components/layouts/Footer"; // Gardé au cas où vous le vouliez
import NavBar from "@/components/layouts/customer-navbar/CustomerNavBar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

// ----> ÉTAPE CRUCIALE N°1 : L'IMPORT
import { AgencyProvider } from "@/lib/contexts/AgencyContext";

export default function AgenciesLayout({ children }: { children: React.ReactNode; }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    // ----> ÉTAPE CRUCIALE N°2 : LE WRAPPER
    <AgencyProvider>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <DashboardSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <NavBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              {children}
            </div>
          </main>
        </div>
      </div>
      {/* <Footer /> */}
    </AgencyProvider>
  );
}