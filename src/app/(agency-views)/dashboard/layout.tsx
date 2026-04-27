import React from "react";

// Ce layout ne fait que passer les enfants, car la structure principale
// est déjà gérée par (agency-views)/layout.tsx.
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
