// src/components/layouts/customer-navbar/LanguageSwitcher.tsx
"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Globe, ChevronDown } from "lucide-react";
import { changeLanguage } from "@/lib/services/i18n-services/languageService";
import { SupportedLanguage } from "@/lib/types/common";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const languages: SupportedLanguage[] = ["fr", "en"];

  const updateLanguage = (lang: SupportedLanguage) => {
    changeLanguage(lang);
    setIsLanguageMenuOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 group relative flex items-center">
        <Globe className="h-5 w-5 text-gray-600 group-hover:text-primary transition-colors" />
        <span className="mx-1 text-sm font-medium text-gray-700 hidden sm:block">
          {i18n.language.toUpperCase()}
        </span>
        <ChevronDown className="h-4 w-4 text-gray-500 hidden sm:block" />
      </button>

      {isLanguageMenuOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-36 bg-white rounded-xl shadow-lg border border-gray-200 z-50"
          onClick={() => setIsLanguageMenuOpen(false)}>
          <div className="p-1">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => updateLanguage(lang)}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-primary rounded-md">
                {lang === "fr" ? "Français" : "English"}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
