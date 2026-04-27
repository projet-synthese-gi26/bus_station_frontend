import HeroSection from "@/components/landing-page-components/HeroSection";
import AgencySection from "@/components/landing-page-components/AgencySection";
import StatisticSection from "@/components/landing-page-components/StatisticSection";
import FeatureSection from "@/components/landing-page-components/FeatureSection";
import CustomerSection from "@/components/landing-page-components/CustomerSection";
import CTASection from "@/components/landing-page-components/CTASection";
import Footer from "@/components/layouts/Footer";
import Header from "@/components/layouts/Header";
import { JSX } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accueil - Plateforme de réservation de voyages",
  description:
    "Trouvez, comparez et réservez vos voyages en bus au Cameroun. La meilleure plateforme pour les voyageurs et les agences.",
};

export default function LandingPage(): JSX.Element {
  return (
    <>
      <Header />
      <main className="flex flex-col min-h-screen overflow-hidden">
        <HeroSection />
        <CustomerSection />
        <StatisticSection />
        <FeatureSection />
        <AgencySection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
