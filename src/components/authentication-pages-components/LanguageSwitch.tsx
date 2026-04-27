"use client"

import { motion } from "framer-motion"
import {SupportedLanguage} from "@/lib/types/common";

interface LanguageSwitchProps {
    language: SupportedLanguage
    onToggle: () => void
}

export default function LanguageSwitch({ language, onToggle }: LanguageSwitchProps) {
    return (
        <div className="flex items-center space-x-3">
          <span
              className={`text-md font-medium transition-colors ${language === "fr" ? "text-blue-600" : "text-gray-400"}`}
          >
            FR
          </span>

            <button
                onClick={onToggle}
                className="relative inline-flex h-6 w-14 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:bg-gray-300"
                role="switch"
                aria-checked={language === "en"}
            >
                <motion.span
                    layout
                    className="inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition-transform"
                    animate={{
                        x: language === "en" ? 28 : 4,
                        backgroundColor: language === "en" ? "#3B82F6" : "#6B7280",
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                    }}
                />

                {/* Indicateurs de drapeaux */}
                <div className="absolute inset-0 flex items-center justify-between px-2">
                    <motion.span className="text-sm" animate={{ opacity: language === "fr" ? 1 : 0.3 }}>
                        🇫🇷
                    </motion.span>
                    <motion.span className="text-sm" animate={{ opacity: language === "en" ? 1 : 0.3 }}>
                        🇬🇧
                    </motion.span>
                </div>
            </button>

            <span
                className={`text-md font-medium transition-colors ${language === "en" ? "text-blue-600" : "text-gray-400"}`}
            >
        EN
      </span>
        </div>
    )
}
