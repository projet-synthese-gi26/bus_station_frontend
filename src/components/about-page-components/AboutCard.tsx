"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations/animationTool";
import React from "react";

interface AboutCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

export default function AboutCard({
  icon: Icon,
  title,
  description,
}: AboutCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md">
      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-primary" />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-center">{description}</p>
    </motion.div>
  );
}
