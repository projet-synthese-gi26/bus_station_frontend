// src/app/dashboard/subscription/page.tsx
"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import PageHeader from "@/components/dashboard/PageHeader";
import PlanCard from "@/components/dashboard/subscription/PlanCard";
import { SubscriptionPlan, BillingHistoryItem } from "@/lib/types/dashboard";

const SubscriptionPage = () => {
  const { t } = useTranslation();

  const plans: SubscriptionPlan[] = [
    {
      name: "Basique",
      price: "30 000 FCFA/mois",
      features: ["10 voyages publiés", "Support par email", "Analyses de base"],
      isCurrent: false,
    },
    {
      name: "Pro",
      price: "65 000 FCFA/mois",
      features: [
        "Voyages illimités",
        "Support prioritaire",
        "Analyses avancées",
        "API d'intégration",
      ],
      isCurrent: true,
    },
    {
      name: "Entreprise",
      price: t("dashboard.subscription.plans.enterprise.price"),
      features: [
        "Toutes les fonctionnalités Pro",
        "Gestion multi-utilisateurs",
        "Support dédié",
      ],
      isCurrent: false,
    },
  ];

  const billingHistory: BillingHistoryItem[] = [
    { id: "inv-001", date: "2025-06-01", amount: 65000, status: "paid" },
    { id: "inv-002", date: "2025-05-01", amount: 65000, status: "paid" },
  ];

  return (
    <>
      <PageHeader
        title={t("dashboard.subscription.title")}
        subtitle={t("dashboard.subscription.subtitle")}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard key={plan.name} {...plan} />
        ))}
      </div>

      <div className="mt-8 rounded-lg border border-gray-200 bg-white shadow-sm">
        <h3 className="p-4 text-lg font-semibold text-gray-900 border-b border-gray-200">
          {t("dashboard.subscription.billingHistory")}
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-600">
                  {t("dashboard.subscription.table.date")}
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">
                  {t("dashboard.subscription.table.amount")}
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">
                  {t("dashboard.subscription.table.status")}
                </th>
              </tr>
            </thead>
            <tbody>
              {billingHistory.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-2 text-gray-700">{item.date}</td>
                  <td className="px-4 py-2 text-gray-700">
                    {item.amount.toLocaleString()} FCFA
                  </td>{" "}
                  {/* MODIFIÉ */}
                  <td className="px-4 py-2 capitalize text-green-600">
                    {t(`dashboard.subscription.status.${item.status}`)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default SubscriptionPage;
