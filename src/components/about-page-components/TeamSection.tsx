"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations/animationTool";
import { useInView } from "react-intersection-observer";
import { useTranslation } from "react-i18next";
import TeamMember from "./TeamMenber";
import {TeamMemberProps} from "@/lib/types/ui";

export default function TeamSection() {
  const [teamRef, teamInView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const [t] = useTranslation();

  function translate(key: string): string {
    return t("aboutUs." + key);
  }

  const teamMembers: TeamMemberProps[] = [
    {
      name: translate("team.member1.name"),
      role: translate("team.member1.role"),
      description: translate("team.member1.description"),
      imageUrl: "/images/team/member1.svg",
      github: "https://github.com/member1",
      linkedin: "https://linkedin.com/in/member1",
      email: "member1@example.com",
    },
    {
      name: translate("team.member2.name"),
      role: translate("team.member2.role"),
      description: translate("team.member2.description"),
      imageUrl: "/images/team/member1.svg",
      github: "https://github.com/member2",
      linkedin: "https://linkedin.com/in/member2",
      email: "member2@example.com",
    },
    {
      name: translate("team.member3.name"),
      role: translate("team.member3.role"),
      description: translate("team.member3.description"),
      imageUrl: "/images/team/member1.svg",
      github: "https://github.com/member3",
      linkedin: "https://linkedin.com/in/member3",
      email: "member3@example.com",
    },
    {
      name: translate("team.member4.name"),
      role: translate("team.member4.role"),
      description: translate("team.member4.description"),
      imageUrl: "/images/team/member1.svg",
      github: "https://github.com/member4",
      linkedin: "https://linkedin.com/in/member4",
      email: "member4@example.com",
    },
    {
      name: translate("team.member5.name"),
      role: translate("team.member5.role"),
      description: translate("team.member5.description"),
      imageUrl: "/images/team/member1.svg",
      github: "https://github.com/member5",
      linkedin: "https://linkedin.com/in/member5",
      email: "member5@example.com",
    },
    {
      name: translate("team.member6.name"),
      role: translate("team.member6.role"),
      description: translate("team.member6.description"),
      imageUrl: "/images/team/member1.svg",
      github: "https://github.com/member6",
      linkedin: "https://linkedin.com/in/member6",
      email: "member6@example.com",
    },
  ];

  return (
    <motion.section
      ref={teamRef}
      initial="hidden"
      animate={teamInView ? "visible" : "hidden"}
      variants={staggerContainer}
      className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div variants={fadeInUp} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
            {translate("team.title")}
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-8"></div>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            {translate("team.description")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <TeamMember key={index} {...member} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}
