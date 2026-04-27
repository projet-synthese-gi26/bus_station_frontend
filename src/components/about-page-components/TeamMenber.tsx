
"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations/animationTool";
import Image from "next/image";
import { Github, Linkedin, Mail } from "lucide-react";
import {TeamMemberProps} from "@/lib/types/ui";

export default function TeamMember({
  name,
  role,
  description,
  imageUrl,
  github,
  linkedin,
  email,
}: TeamMemberProps) {
  return (
    <motion.div
      variants={fadeInUp}
      className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative w-40 h-40 mb-4 overflow-hidden rounded-full border-4 border-primary">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-1">{name}</h3>
      <p className="text-primary font-semibold mb-3">{role}</p>
      <p className="text-gray-600 text-center mb-4">{description}</p>
      <div className="flex space-x-4 mt-auto">
        {github && (
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-primary transition-colors">
            <Github className="w-5 h-5" />
          </a>
        )}
        {linkedin && (
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-primary transition-colors">
            <Linkedin className="w-5 h-5" />
          </a>
        )}
        {email && (
          <a
            href={`mailto:${email}`}
            className="text-gray-600 hover:text-primary transition-colors">
            <Mail className="w-5 h-5" />
          </a>
        )}
      </div>
    </motion.div>
  );
}