// src/app/dashboard/feedback/page.tsx
"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Star } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import { Feedback } from "@/lib/types/dashboard";

const FeedbackPage = () => {
  const { t } = useTranslation();

  const mockFeedback: Feedback[] = [
    {
      id: "fb-1",
      customerName: "Claire Durand",
      tripName: "Safari à Waza",
      rating: 5,
      comment:
        "Une expérience inoubliable ! Le guide était fantastique et l'organisation parfaite.",
      date: "2025-05-23",
    },
    {
      id: "fb-2",
      customerName: "Lucas Bernard",
      tripName: "Safari à Waza",
      rating: 4,
      comment:
        "Très bon voyage. Juste un petit bémol sur le confort du véhicule pour les longs trajets.",
      date: "2025-05-24",
    },
  ];

  return (
    <>
      <PageHeader
        title={t("dashboard.feedback.title")}
        subtitle={t("dashboard.feedback.subtitle")}
      />

      <div className="space-y-4">
        {mockFeedback.map((fb) => (
          <div
            key={fb.id}
            className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-gray-900">
                  {fb.customerName}
                </h4>
                <p className="text-sm text-gray-500">
                  {t("dashboard.feedback.onTrip")} &quot;{fb.tripName}&quot;
                </p>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < fb.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="mt-3 text-gray-700 italic">
              {" "}
              &quot;{fb.comment}&quot;{" "}
            </p>
            <p className="mt-3 text-right text-xs text-gray-400">{fb.date}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default FeedbackPage;
