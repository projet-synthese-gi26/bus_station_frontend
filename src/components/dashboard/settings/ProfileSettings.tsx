// src/components/dashboard/settings/ProfileSettings.tsx
import React from "react";
import { useTranslation } from "react-i18next";

const ProfileSettings = () => {
  const { t } = useTranslation();

  return (
    <form>
      <div className="space-y-6">
        <div>
          <label
            htmlFor="agency-name"
            className="block text-sm font-medium text-gray-700">
            Nom de l agence
          </label>
          <input
            type="text"
            id="agency-name"
            defaultValue="Agence Aventure"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="contact-email"
            className="block text-sm font-medium text-gray-700">
            Email de contact
          </label>
          <input
            type="email"
            id="contact-email"
            defaultValue="contact@aventure.com"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="welcome-message"
            className="block text-sm font-medium text-gray-700">
            Message d accueil
          </label>
          <textarea
            id="welcome-message"
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"></textarea>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
          {t("dashboard.settings.saveChanges")}
        </button>
      </div>
    </form>
  );
};

export default ProfileSettings;
