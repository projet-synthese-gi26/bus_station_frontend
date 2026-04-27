"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useSearchParams } from "next/navigation"
import { Car, Tag, UserCheck, Users } from "lucide-react"
import PageHeader from "@/components/dashboard/PageHeader"
import VehiclesTab from "@/components/dashboard/resources/VehiclesTab"
import DriversTab from "@/components/dashboard/resources/DriversTab"
import EmployeesTab from "@/components/dashboard/resources/EmployeesTab"
import type { ResourceTab } from "@/lib/types/dashboard"
import ClassVoyageTab from "@/components/dashboard/resources/ClassVoyageTab"


const ResourcesPage = () => {
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<ResourceTab>("vehicles")

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab === "vehicles" || tab === "drivers" || tab === "employees" || tab === "classes") {
      setActiveTab(tab)
    }
  }, [searchParams])

  const tabs = [
    {
      id: "vehicles",
      label: t("dashboard.resources.tabs.vehicles"),
      icon: Car,
      count: "12",
    },
    {
      id: "drivers",
      label: t("dashboard.resources.tabs.drivers"),
      icon: UserCheck,
      count: "8",
    },
    {
      id: "employees",
      label: t("dashboard.resources.tabs.employees"),
      icon: Users,
      count: "15",
    },
    {
      id: "classes",
      label: "Classes de Voyage",
      icon: Tag,
      count: "4",
    },
  ]

  return (
      <div className="space-y-8">
        <PageHeader
            title={t("dashboard.resources.title")}
            subtitle={t("dashboard.resources.subtitle")}
        />

        {/* Modern Tab Navigation */}
        <div className="bg-gray-100 rounded-xl shadow-sm border border-gray-100 p-2">
          <nav className="flex space-x-1" aria-label="Tabs">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as ResourceTab)}
                    className={`cursor-pointer group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm  transition-all duration-200 ${
                        activeTab === tab.id
                            ? "bg-primary text-white shadow-sm font-extrabold"
                            : "text-gray-600 hover:bg-blue-600/30 hover:text-gray-900 font-medium"
                    }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                  <span
                      className={`ml-auto rounded-full px-2 py-0.5 text-xs font-medium ${activeTab === tab.id ? "bg-white text-primary" : "bg-blue-600/80 text-white group-hover:text-primary group-hover:bg-white"}`}
                  >
                {tab.count}
              </span>
                </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="">
          {activeTab === "vehicles" && <VehiclesTab />}
          {activeTab === "drivers" && <DriversTab />}
          {activeTab === "employees" && <EmployeesTab />}
          {activeTab === "classes" && <ClassVoyageTab />}
        </div>
      </div>
  )
}

export default ResourcesPage
