"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations/animationTool";
import { useInView } from "react-intersection-observer";
import { useTranslation } from "react-i18next";
import AboutCard from "./AboutCard";
import { GraduationCap, Code, Globe, Heart } from "lucide-react";

export default function MissionSection() {
  const [missionRef, missionInView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const [t] = useTranslation();

  function translate(key: string): string {
    return t("aboutUs." + key);
  }

  const aboutCards = [
    {
      icon: GraduationCap,
      title: translate("values.education.title"),
      description: translate("values.education.description"),
    },
    {
      icon: Code,
      title: translate("values.innovation.title"),
      description: translate("values.innovation.description"),
    },
    {
      icon: Globe,
      title: translate("values.global.title"),
      description: translate("values.global.description"),
    },
    {
      icon: Heart,
      title: translate("values.passion.title"),
      description: translate("values.passion.description"),
    },
  ];

  return (
    <motion.section
      ref={missionRef}
      initial="hidden"
      animate={missionInView ? "visible" : "hidden"}
      variants={staggerContainer}
      className="py-20">
      <div className="container mx-auto px-4">
        <motion.div variants={fadeInUp} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
            {translate("mission.title")}
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-8"></div>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            {translate("mission.description")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {aboutCards.map((card, index) => (
            <AboutCard key={index} {...card} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}
