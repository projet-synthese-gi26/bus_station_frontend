"use client";

import React from "react";
import {
  DollarSign,
  BookOpen,
  BarChart3,
  Users,
  AlertCircle,
  RefreshCw,
  Plus, // de l'autre version
} from "lucide-react";

// Imports des deux versions combinés
import { useAgency } from "@/lib/contexts/AgencyContext";
import { useNavigation } from "@/lib/hooks/useNavigation";
import { useDashboardOverview } from "@/lib/hooks/dasboard/useDashboardOverview";

// Imports de composants
import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import OverviewCharts from "@/components/dashboard/overview/OverviewCharts";
import RecentBookings from "@/components/dashboard/overview/RecentBookings";
import Loader from "@/modals/Loader";
import { StatCardData } from "@/lib/types/dashboard";

const DashboardOverviewPage = () => {
  // Hooks des deux versions
  const navigate = useNavigation();
  const { isLoading, apiError, generalStats, evolutionData, recentBookings } =
    useDashboardOverview();
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="p-10 text-center text-red-600 bg-red-50 rounded-xl border border-red-200">
        <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-lg font-semibold">Erreur de chargement</h3>
        <p className="mt-1 text-sm">{apiError}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-3 bg-red-600 text-white rounded-xl flex items-center gap-2 mx-auto hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <RefreshCw className="h-4 w-4" /> Réessayer
        </button>
      </div>
    );
  }

  // Logique de "pas d'agence sélectionnée" (de la version HEAD)

  // Logique d'erreur (commune aux deux)
  if (apiError) {
    return (
      <div className="p-10 text-center text-red-600 bg-red-50 rounded-xl border border-red-200">
        <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-lg font-semibold">Erreur de chargement</h3>
        <p className="mt-1 text-sm">{apiError}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-3 bg-red-600 text-white rounded-xl flex items-center gap-2 mx-auto hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <RefreshCw className="h-4 w-4" /> Réessayer
        </button>
      </div>
    );
  }

  const stats: StatCardData[] = [
    {
      label: "Revenu Total",
      value: `${generalStats?.revenus?.toLocaleString() || 0}`,
      currency: "FCFA",
      change: "+12%",
      changeType: "increase",
      icon: DollarSign,
      gradient: "from-green-400 to-green-600",
    },
    {
      label: "Total Réservations",
      value: String(generalStats?.nombreReservations || 0),
      change: "+8%",
      changeType: "increase",
      icon: BookOpen,
      gradient: "from-blue-400 to-blue-600",
    },
    {
      label: "Voyages Publiés",
      value: String(generalStats?.nombreVoyages || 0),
      change: "+15%",
      changeType: "increase",
      icon: BarChart3,
      gradient: "from-purple-400 to-purple-600",
    },
    {
      label: "Nouveaux Clients",
      value: String(generalStats?.nouveauxUtilisateurs || 0),
      change: "+23%",
      changeType: "increase",
      icon: Users,
      gradient: "from-orange-400 to-orange-600",
    },
  ];

  // Le JSX final qui combine les deux versions
  return (
    <div className="space-y-8">
      <PageHeader
        // Titre dynamique de la version HEAD
        title={"Aperçu du Tableau de Bord"}
        subtitle="Voici un résumé de l'activité de votre agence."
      />

      {/* Hero CTA Card de l'autre version */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
        <div className="relative flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-2">
              Prêt à Planifier un Nouveau Voyage ?
            </h2>
            <p className="text-blue-100 mb-6 text-lg">
              Créez et publiez vos voyages en quelques clics. Atteignez plus de
              clients et développez votre activité.
            </p>
            <button
              onClick={() => navigate.onGoToTripPlanning()}
              className="cursor-pointer bg-white text-primary px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Planifier un Voyage
            </button>
          </div>
          <div className="flex-shrink-0">
            <div className="w-32 h-32 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20">
              <BarChart3 className="h-16 w-16 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts and Recent Bookings */}
      <div className="grid grid-cols-12 gap-6">
        <OverviewCharts data={evolutionData} />
        <RecentBookings bookings={recentBookings} />
      </div>
    </div>
  );
};
export default DashboardOverviewPage;
