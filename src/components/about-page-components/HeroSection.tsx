"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations/animationTool";
import { useInView } from "react-intersection-observer";
import { MapPin, Users, Code } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function HeroSection() {
  const [heroRef, heroInView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const [t] = useTranslation();

  function translate(key: string): string {
    return t("aboutUs." + key);
  }

  return (
    <motion.section
      ref={heroRef}
      initial="hidden"
      animate={heroInView ? "visible" : "hidden"}
      variants={staggerContainer}
      className="relative bg-primary py-20 text-white">
      <div className="container mx-auto px-4 mb-16">
        <motion.div
          variants={fadeInUp}
          className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold my-12 ">
            {translate("hero.title")}
          </h1>
          <p className="text-xl mb-8">{translate("hero.subtitle")}</p>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{translate("hero.location")}</span>
            </div>
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              <span>{translate("hero.team")}</span>
            </div>
            <div className="flex items-center">
              <Code className="w-5 h-5 mr-2" />
              <span>{translate("hero.project")}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Wave SVG shape divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="fill-gray-50 w-full h-16">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V56.44Z"></path>
        </svg>
      </div>
    </motion.section>
  );
}
