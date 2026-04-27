// src/components/dashboard/subscription/PlanCard.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";
import { SubscriptionPlan } from "@/lib/types/dashboard";

const PlanCard: React.FC<SubscriptionPlan> = ({
  name,
  price,
  features,
  isCurrent,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={`rounded-lg border-2 p-6 shadow-sm ${
        isCurrent ? "border-primary" : "border-gray-200"
      }`}>
      <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
      <p className="mt-2 text-3xl font-bold text-gray-900">{price}</p>

      <ul className="mt-6 space-y-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-sm text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        disabled={isCurrent}
        className={`mt-8 w-full rounded-md py-2.5 text-sm font-semibold transition-colors ${
          isCurrent
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-primary text-white hover:bg-primary/90"
        }`}>
        {isCurrent
          ? t("dashboard.subscription.currentPlan")
          : t("dashboard.subscription.choosePlan")}
      </button>
    </div>
  );
};

export default PlanCard;
