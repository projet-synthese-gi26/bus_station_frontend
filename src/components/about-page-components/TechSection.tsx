"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Image from "next/image";

export default function TechSection() {
  const [t] = useTranslation();

  function translate(key: string): string {
    return t("aboutUs." + key);
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
            {translate("tech.title")}
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-8"></div>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            {translate("tech.description")}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4  justify-center">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 flex items-center justify-center mb-4">
              <Image
                src="/images/tech/nextjs.png"
                alt="Next.js"
                width={80}
                height={80}
              />
            </div>
            <span className="text-gray-800 font-medium">Next.js</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 flex items-center justify-center mb-4">
              <Image
                src="/images/tech/typescript.png"
                alt="TypeScript"
                width={80}
                height={80}
              />
            </div>
            <span className="text-gray-800 font-medium">TypeScript</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 flex items-center justify-center mb-4">
              <Image
                src="/images/tech/tailwind.png"
                alt="Tailwind CSS"
                width={80}
                height={80}
              />
            </div>
            <span className="text-gray-800 font-medium">Tailwind CSS</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 flex items-center justify-center mb-4">
              <Image
                src="/images/tech/framer.png"
                alt="Framer Motion"
                width={80}
                height={80}
              />
            </div>
            <span className="text-gray-800 font-medium">Framer Motion</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 flex items-center justify-center mb-4">
              <Image
                src="/images/tech/nextjs.png"
                alt="Next.js"
                width={80}
                height={80}
              />
            </div>
            <span className="text-gray-800 font-medium">Next.js</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 flex items-center justify-center mb-4">
              <Image
                src="/images/tech/typescript.png"
                alt="TypeScript"
                width={80}
                height={80}
              />
            </div>
            <span className="text-gray-800 font-medium">TypeScript</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 flex items-center justify-center mb-4">
              <Image
                src="/images/tech/tailwind.png"
                alt="Tailwind CSS"
                width={80}
                height={80}
              />
            </div>
            <span className="text-gray-800 font-medium">Tailwind CSS</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 flex items-center justify-center mb-4">
              <Image
                src="/images/tech/framer.png"
                alt="Framer Motion"
                width={80}
                height={80}
              />
            </div>
            <span className="text-gray-800 font-medium">Framer Motion</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
