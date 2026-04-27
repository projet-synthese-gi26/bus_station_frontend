"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import { fadeInUp, staggerContainer } from "@/lib/animations/animationTool";
import { JSX } from "react";
import { Building, MapPin, Phone, Mail, Info, XCircle,  Clock } from "lucide-react";

export default function AgencyProfilePage(): JSX.Element {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white py-16">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="container mx-auto px-4"
        >
          <motion.h1 variants={fadeInUp} className="text-4xl font-bold text-gray-800 mb-8">
            Profil de l&#39;Agence
          </motion.h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Infos Agence */}
            <motion.div variants={fadeInUp} className="bg-white shadow-lg rounded-lg p-6">
              <ul className="space-y-4 mb-6">
                <li className="flex items-center"><Building className="w-6 h-6 text-primary mr-3"/><span className="font-medium text-gray-700">Nom de l&#39;agence </span></li>
                <li className="flex items-center"><MapPin className="w-6 h-6 text-primary mr-3"/><span className="text-gray-700">123 Rue de Rivoli, 75001 Paris</span></li>
                <li className="flex items-center"><Phone className="w-6 h-6 text-primary mr-3"/><span className="text-gray-700">+33 1 23 45 67 89</span></li>
                <li className="flex items-center"><Mail className="w-6 h-6 text-primary mr-3"/><span className="text-gray-700">contact@voyageparis.fr</span></li>
              </ul>
              <h3 className="text-xl font-semibold mb-2 flex items-center"><Info className="w-5 h-5 text-primary mr-2"/>À propos</h3>
              <p className="text-gray-600">
                Voyage Paris est une agence spécialisée dans l&#39;organisation de voyages sur mesure en France et en Europe. Nous offrons des services personnalisés pour garantir des expériences inoubliables.
              </p>
            </motion.div>
            {/* Voyages en cours & annulés */}
            <motion.section variants={staggerContainer} initial="hidden" animate={inView ? "visible" : "hidden"} className="space-y-8">
              <motion.div variants={fadeInUp} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-4"><Clock className="w-8 h-8 text-primary mr-3"/><h3 className="text-lg font-semibold">Voyages en cours</h3></div>
                <ul className="text-gray-600 space-y-1"><li>Paris → Lyon (20/04/2025)</li><li>Nice → Marseille (22/04/2025)</li></ul>
              </motion.div>
              <motion.div variants={fadeInUp} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-4"><XCircle className="w-8 h-8 text-primary mr-3"/><h3 className="text-lg font-semibold">Voyages annulés</h3></div>
                <ul className="text-gray-600 space-y-1"><li>Bordeaux → Toulouse (15/04/2025)</li></ul>
              </motion.div>
            </motion.section>
          </div>
        </motion.div>
      </main>
      <Footer />
    </>
  );
}
