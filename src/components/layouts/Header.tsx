"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, Globe } from "lucide-react";
import { useNavigation } from "@/lib/hooks/useNavigation";
import { useTranslation } from "react-i18next";
import { changeLanguage } from "@/lib/services/i18n-services/languageService";
import { SupportedLanguage } from "@/lib/types/common";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);

  function toggleMenu(): void {
    setIsMenuOpen(!isMenuOpen);
  }

  function toggleLanguageMenu(): void {
    setIsLanguageMenuOpen(!isLanguageMenuOpen);
  }

  function updateLanguage(lang: SupportedLanguage): void {
    changeLanguage(lang);
    setIsLanguageMenuOpen(false);
  }

  const [scrolled, setScrolled] = useState(false);
  const navigation = useNavigation();
  const [t, i18n] = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${
        scrolled ? "bg-primary/80 drop-shadow" : ""
      }`}
    >
      <div className="container mt-3">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center">
              <span className="md:text-4xl text-3xl text-white font-extrabold">
                Bus Station
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8 mt-1">
              <Link
                href="/market-place"
                className="hover:px-4 hover:py-2 text-white font-bold hover:bg-white hover:rounded-2xl hover:text-blue-600  transition-all duration-300"
              >
                {t("footer.trip")}
              </Link>
              {/* TODO: Remplacer par la clé de traduction t("footer.bus_stations") */}
              <Link
                href="/gares-routieres"
                className="hover:px-4 hover:py-2 text-white font-bold hover:bg-white hover:rounded-2xl hover:text-blue-600  transition-all duration-300"
              >
                Gares Routières
              </Link>
              <Link
                href="/agency"
                className="hover:px-4 hover:py-2 text-white font-bold hover:bg-white hover:rounded-2xl hover:text-blue-600  transition-all duration-300"
              >
                {t("footer.agency")}
              </Link>

              <Link
                href="/about"
                className="hover:px-4 hover:py-2 text-white font-bold hover:bg-white hover:rounded-2xl hover:text-blue-600  transition-all duration-300"
              >
                {t("footer.about-us")}
              </Link>
              <Link
                href="/contact-us"
                className="hover:px-4 hover:py-2 text-white font-bold hover:bg-white hover:rounded-2xl hover:text-blue-600  transition-all duration-300"
              >
                {t("footer.contact-us")}
              </Link>
              <Link
                href="/faqs"
                className="hover:px-4 hover:py-2 text-white font-bold hover:bg-white hover:rounded-2xl hover:text-blue-600  transition-all duration-300"
              >
                {t("faqs")}
              </Link>
            </nav>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative bg-white  rounded-lg">
              <button
                onClick={toggleLanguageMenu}
                className="flex items-center font-bold  rounded-lg text-blue-600 hover:text-blue-800 transition-colors px-2 py-1 border border-gray-200 hover:border-blue-300"
              >
                <Globe className="h-4 w-4 mr-1" />
                <span className="mr-1">{i18n.language}</span>
                <ChevronDown className="h-3 w-3" />
              </button>

              {isLanguageMenuOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  <div className="py-1">
                    <button
                      onClick={() => updateLanguage("fr")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    >
                      Fr
                    </button>
                    <button
                      onClick={() => updateLanguage("en")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    >
                      En
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={navigation.onGoToLogin}
              className="cursor-pointer px-4 py-2  rounded-2xl border-white text-white  border-2 font-bold  hover:bg-white hover:text-blue-600  duration-300 transition-all"
            >
              {t("landingPage.heroSection.loginText")}
            </button>
            <button
              onClick={navigation.onGoToRegister}
              className="cursor-pointer px-4 py-2  rounded-2xl border-white text-blue-800 border-2 font-bold  bg-white hover:text-blue-600  duration-300 transition-all"
            >
              {t("header.registerText")}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-blue-600 focus:outline-none"
            >
              {isMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/market-place"
                className="text-gray-700 hover:text-blue-600 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Voyages
              </Link>
              <Link
                href="/agency"
                className="text-gray-700 hover:text-blue-600 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Agences
              </Link>
              <Link
                href="/gares-routieres"
                className="text-gray-700 hover:text-blue-600 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Gares Routières
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-blue-600 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                À propos
              </Link>
              <Link
                href="/ressources"
                className="text-gray-700 hover:text-blue-600 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Ressources
              </Link>

              {/* Language Selector Mobile */}
              <div className="py-2 border-t">
                <p className="text-sm text-gray-500 mb-2">Langue</p>
                <div className="flex flex-wrap gap-2">
                  <button className="px-3 py-1 text-sm border border-gray-200 rounded-md hover:border-blue-300 hover:text-blue-600">
                    Français
                  </button>
                  <button className="px-3 py-1 text-sm border border-gray-200 rounded-md hover:border-blue-300 hover:text-blue-600">
                    English
                  </button>
                  <button className="px-3 py-1 text-sm border border-gray-200 rounded-md hover:border-blue-300 hover:text-blue-600">
                    Español
                  </button>
                </div>
              </div>

              <div className="flex flex-col space-y-2 pt-4 border-t">
                <button
                  onClick={navigation.onGoToLogin}
                  className="cursor-pointer px-4 py-2  rounded-2xl border-white text-white  border-2 font-bold  hover:bg-white hover:text-blue-600  duration-300 transition-all"
                >
                  {t("landingPage.heroSection.loginText")}
                </button>
                <button
                  onClick={navigation.onGoToRegister}
                  className="cursor-pointer px-4 py-2  rounded-2xl border-white text-blue-800 border-2 font-bold  bg-white hover:text-blue-600  duration-300 transition-all"
                >
                  {t("header.registerText")}
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
