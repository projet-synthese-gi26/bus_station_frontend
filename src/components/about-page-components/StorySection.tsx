"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Image from "next/image";

export default function StorySection() {
  const [t] = useTranslation();

  function translate(key: string): string {
    return t("aboutUs." + key);
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full md:w-1/2">
            <div className="relative h-80 md:h-96 rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/images/office.svg"
                alt="Notre histoire"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full md:w-1/2">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              {translate("story.title")}
            </h2>
            <div className="w-20 h-1 bg-primary mb-6"></div>
            <p className="text-gray-600 mb-4">
              {translate("story.paragraph1")}
            </p>
            <p className="text-gray-600 mb-4">
              {translate("story.paragraph2")}
            </p>
            <p className="text-gray-600">{translate("story.paragraph3")}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
