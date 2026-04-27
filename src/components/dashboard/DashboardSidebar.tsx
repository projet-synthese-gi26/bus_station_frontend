"use client"

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Car,
  Calendar,
  Store,
  MessageCircle,
  Gem,
  Cog,
  X,
  Bus,

  LogOut,
  FileEdit,
  ChevronDown, // Ajouté depuis la version en conflit
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useBusStation } from "@/context/Provider";
import { useAgency } from "@/lib/contexts/AgencyContext"; // Ajouté depuis la version en conflit


interface SidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (arg: boolean) => void
}

const SidebarHeader = ({ onClose }: { onClose: () => void }) => {
  return (
      <div
          onClick={() => (window.location.href = "/dashboard")}
          className="cursor-pointer flex-1 relative p-6 bg-primary overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
          />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm border border-white/20">
              <Bus className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white">Bus Station</h1>
              <p className="text-sm font-semibold text-white/80">Agency Dashboard</p>
            </div>
          </div>

          <button
              className="cursor-pointer lg:hidden p-2 text-white hover:bg-white/20 rounded-lg transition-colors duration-200"
              onClick={onClose}
              aria-label="Fermer la sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
  )
}

const SidebarLink = ({
                       href,
                       icon,
                       label,
                       pathname,
                       badge,
                       description,
                     }: {
  href: string
  icon: React.ElementType
  label: string
  pathname: string
  badge?: string
  description?: string
}) => {
  const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href))
  const Icon = icon

  return (
      <Link href={href} className="block cursor-pointer mb-1">
        <div
            className={`group relative flex items-center gap-3 rounded-xl p-3 transition-all duration-300 ${
                isActive
                    ? "bg-primary text-white shadow-lg transform scale-[1.02]"
                    : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:via-blue-100 hover:to-purple-50 hover:text-blue-600 hover:shadow-md hover:transform hover:scale-[1.01]"
            }`}
        >
          <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-300 ${
                  isActive
                      ? "bg-white/20 text-white"
                      : "bg-gradient-to-br from-blue-50 to-purple-50 text-blue-600 group-hover:from-blue-100 group-hover:to-purple-100"
              }`}
          >
            <Icon className="h-5 w-5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
            <span className={`font-semibold text-sm truncate ${isActive ? "text-white" : "text-gray-900"}`}>
              {label}
            </span>
              {badge && (
                  <span
                      className={`px-2 py-1 text-xs font-medium rounded-full shadow-sm ${
                          isActive ? "bg-white/20 text-white" : "bg-primary text-white"
                      }`}
                  >
                {badge}
              </span>
              )}
            </div>
            {description && (
                <p className={`text-xs truncate mt-0.5 ${isActive ? "text-white/80" : "text-gray-500"}`}>{description}</p>
            )}
          </div>
        </div>
      </Link>
  )
}

const DashboardSidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { logout } = useBusStation();
  const { agencies, setAgencies, selectedAgency, setSelectedAgency } = useAgency();
  const [isAgencyDropdownOpen, setAgencyDropdownOpen] = useState(false);

  // Simuler la récupération des agences
  useEffect(() => {
    // Dans une vraie application, vous feriez un appel API ici
    const mockAgencies = [
      { id: '1', name: 'Agence de Yaoundé' },
      { id: '2', name: 'Agence de Douala' },
      { id: '3', name: 'Agence de Bafoussam' },
    ];
    setAgencies(mockAgencies);
    if (!selectedAgency && mockAgencies.length > 0) {
      setSelectedAgency(mockAgencies[0]);
    }
  }, [setAgencies, setSelectedAgency, selectedAgency]);


  const sidebar = useRef<HTMLDivElement>(null);


  // Fermer en cliquant à l'extérieur
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !sidebar.current.contains(target as Node)) {
        setSidebarOpen(false)
      }
    }
    document.addEventListener("click", clickHandler)
    return () => document.removeEventListener("click", clickHandler)
  })

  // Gérer le redimensionnement de la fenêtre
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true)
      }
    }
    window.addEventListener("resize", handleResize)
    handleResize()
    return () => window.removeEventListener("resize", handleResize)
  }, [setSidebarOpen])

  const menuItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: t("dashboard.sidebar.overview"), description: "Vue d'ensemble" },
    { href: "/dashboard/planning", icon: FileEdit, label: "Profil & Planning", description: "Gérer votre profil et planning" },
    { href: "/dashboard/resources", icon: Car, label: t("dashboard.sidebar.resources"), description: "Véhicules & équipements" },
    { href: "/dashboard/trip-planning", icon: Bus, label: t("dashboard.sidebar.tripPlanning"), description: "Planification des voyages" },
    { href: "/dashboard/drafts", icon: FileEdit, label: "Brouillons", description: "Voyages en cours de création", badge: "3" },
    { href: "/dashboard/marketplace", icon: Store, label: t("dashboard.sidebar.agencyMarketplace"), description: "Place de marché" },
    { href: "/dashboard/calendar", icon: Calendar, label: t("dashboard.sidebar.calendar"), description: "Planning des voyages" },
    { href: "/dashboard/feedback", icon: MessageCircle, label: t("dashboard.sidebar.feedback"), description: "Avis & commentaires" },
  ]

  const secondaryMenuItems = [
    { href: "/dashboard/subscription", icon: Gem, label: t("dashboard.sidebar.subscription"), description: "Plan & facturation" },
    { href: "/dashboard/settings", icon: Cog, label: t("dashboard.sidebar.settings"), description: "Configuration" },
  ]

  return (
      <>
        {/* Overlay pour mobile */}
        <div
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
                sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar */}
        <aside
            ref={sidebar}
            className={`fixed inset-y-0 left-0 z-50 lg:w-80 w-80 bg-white border-r border-gray-100 transform transition-transform duration-300 ease-out lg:translate-x-0 lg:static lg:inset-0 ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          {/* Header */}
          <SidebarHeader onClose={() => setSidebarOpen(false)} />


          {/* Sélecteur d'agence */}
          <div className="px-6 mt-4">
            <h3 className="mb-2 ml-1 text-sm font-semibold text-gray-500">AGENCE SÉLECTIONNÉE</h3>
            <div className="relative">
              <button
                  onClick={() => setAgencyDropdownOpen(!isAgencyDropdownOpen)}
                  className="w-full flex items-center justify-between rounded-lg bg-gray-100 px-4 py-2 text-left font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span>{selectedAgency ? selectedAgency.name : 'Choisir une agence'}</span>
                <ChevronDown className={`h-5 w-5 transition-transform ${isAgencyDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isAgencyDropdownOpen && (
                  <div className="absolute z-10 mt-2 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      {agencies.map((agency) => (
                          <a
                              key={agency.id}
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setSelectedAgency(agency);
                                setAgencyDropdownOpen(false);
                              }}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            {agency.name}
                          </a>
                      ))}
                    </div>
                  </div>
              )}

            </div>
          </div>


          {/* Menu de la Sidebar */}
          <div className="flex flex-col overflow-y-auto duration-300 ease-linear">
            <nav className="mt-5 py-4 px-4 lg:px-6">
              <div>
                <h3 className="mb-4 ml-4 text-sm font-semibold text-gray-500">
                  {t("dashboard.sidebar.menu")}
                </h3>
                <ul className="mb-6 flex flex-col gap-1.5">
                  {menuItems.map((item) => (
                      <li key={item.href}>
                        <SidebarLink {...item} pathname={pathname} />
                      </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="mb-4 ml-4 text-sm font-semibold text-gray-500">
                  {t("dashboard.sidebar.other")}
                </h3>
                <ul className="mb-6 flex flex-col gap-1.5">
                  {secondaryMenuItems.map((item) => (
                      <li key={item.href}>
                        <SidebarLink {...item} pathname={pathname} />
                      </li>
                  ))}
                  <li>
                    <button
                        onClick={logout}
                        className="group relative flex w-full items-center gap-2.5 rounded-lg py-2 px-4 font-medium text-gray-700 duration-300 ease-in-out hover:bg-red-50 hover:text-red-600"
                    >
                      <LogOut className="h-5 w-5" />
                      {t("dashboard.sidebar.logout")}
                    </button>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </aside>
      </>
  );
};


export default DashboardSidebar;
