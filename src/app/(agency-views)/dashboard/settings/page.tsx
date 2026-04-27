// src/app/dashboard/settings/page.tsx
"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import PageHeader from "@/components/dashboard/PageHeader";
import ProfileSettings from "@/components/dashboard/settings/ProfileSettings";

const SettingsPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageHeader
        title={t("dashboard.settings.title")}
        subtitle={t("dashboard.settings.subtitle")}
      />

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <ProfileSettings />
      </div>
    </>
  );
};

export default SettingsPage;
