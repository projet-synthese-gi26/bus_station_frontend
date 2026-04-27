

//import { useInView } from "react-intersection-observer";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import CTASection from "@/components/landing-page-components/CTASection";
//import { staggerContainer } from "@/lib/animations/animationTool";
import HeroSection from "@/components/about-page-components/HeroSection";
import MissionSection from "@/components/about-page-components/MissionSection";
import StorySection from "@/components/about-page-components/StorySection";
import TeamSection from "@/components/about-page-components/TeamSection";
import TechSection from "@/components/about-page-components/TechSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À Propos de Nous",
  description:
    "Découvrez l'équipe et l'histoire derrière Bus Station, un projet innovant pour simplifier le voyage au Cameroun.",
};

export default function AboutUsPage() {
  return (
    <>
      <Header />
      <div className="bg-gray-50">
        <HeroSection />
        <MissionSection />
        <StorySection />
        <TeamSection />
        <TechSection />
      </div>
      <CTASection />
      <Footer />
    </>
  );
}
