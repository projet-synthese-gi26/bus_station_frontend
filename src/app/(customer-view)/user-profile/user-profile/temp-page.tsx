"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import { fadeInUp, staggerContainer } from "@/lib/animations/animationTool";
import { JSX } from "react";
import { User, Mail, Phone, Calendar, MapPin, Award, TrendingUp, TrendingDown } from "lucide-react";
import { ClipboardList, CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ProfilePage(): JSX.Element {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  
  const stats = [
    { icon: TrendingUp, title: "Voyages réussis", value: "12" },
    { icon: TrendingDown, title: "Annulations", value: "1" },
    { icon: Award, title: "Points de fidélité", value: "250" },
    { icon: MapPin, title: "Villes visitées", value: "5" },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="container mx-auto px-4 py-16"
        >
          {/* Section de profil */}
          <motion.div variants={fadeInUp} className="bg-white rounded-lg shadow-lg overflow-hidden mb-12">
            <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <div className="relative">
                <Image 
                  src="/profile-placeholder.jpg"
                  alt="Photo de profil"
                  width={128}
                  height={128}
                  className="w-32 h-32 rounded-full border-4 border-white object-cover"
                />
              </div>
            </div>
            <div className="p-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">John Doe</h1>
              <p className="text-gray-600">Voyageur passionné</p>
              <div className="mt-4 flex space-x-4">
                <Link href="/edit-profile" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  Modifier le profil
                </Link>
                <Link href="/preferences" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  Mes préférences
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Section des statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-lg shadow p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <stat.icon className="w-6 h-6 text-blue-500" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Section des informations personnelles */}
          <motion.div variants={fadeInUp} className="bg-white rounded-lg shadow-lg p-6 mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Informations personnelles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-b pb-4">
                <div className="flex items-center text-gray-600 mb-2">
                  <User className="w-5 h-5 text-blue-500 mr-2" />
                  <span>Nom complet</span>
                </div>
                <p className="font-medium text-gray-900">John Doe</p>
              </div>
              <div className="border-b pb-4">
                <div className="flex items-center text-gray-600 mb-2">
                  <Mail className="w-5 h-5 text-blue-500 mr-2" />
                  <span>Email</span>
                </div>
                <p className="font-medium text-gray-900">john.doe@example.com</p>
              </div>
              <div className="border-b pb-4">
                <div className="flex items-center text-gray-600 mb-2">
                  <Phone className="w-5 h-5 text-blue-500 mr-2" />
                  <span>Téléphone</span>
                </div>
                <p className="font-medium text-gray-900">+33 6 12 34 56 78</p>
              </div>
              <div className="border-b pb-4">
                <div className="flex items-center text-gray-600 mb-2">
                  <Calendar className="w-5 h-5 text-blue-500 mr-2" />
                  <span>Membre depuis</span>
                </div>
                <p className="font-medium text-gray-900">01/01/2023</p>
              </div>
            </div>
          </motion.div>

          {/* Section des réservations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div variants={fadeInUp} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-6">
                <ClipboardList className="w-8 h-8 text-blue-500 mr-3" />
                <h3 className="text-xl font-semibold">Historique des Réservations</h3>
              </div>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="text-sm text-gray-500">17/04/2025</p>
                  <p className="font-medium text-gray-900">Paris → Lyon</p>
                  <p className="text-sm text-gray-500">Réservation #12345</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="text-sm text-gray-500">22/03/2025</p>
                  <p className="font-medium text-gray-900">Marseille → Nice</p>
                  <p className="text-sm text-gray-500">Réservation #67890</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="text-sm text-gray-500">15/02/2025</p>
                  <p className="font-medium text-gray-900">Bordeaux → Toulouse</p>
                  <p className="text-sm text-gray-500">Réservation #54321</p>
                </div>
              </div>
            </motion.div>

            {/* Section des confirmations */}
            <motion.div variants={fadeInUp} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-6">
                <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
                <h3 className="text-xl font-semibold">Confirmations</h3>
              </div>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="text-sm text-gray-500">12/04/2025</p>
                  <p className="font-medium text-gray-900">Réservation #12345 confirmée</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="text-sm text-gray-500">05/04/2025</p>
                  <p className="font-medium text-gray-900">Réservation #67890 confirmée</p>
                </div>
              </div>
            </motion.div>

            {/* Section des annulations */}
            <motion.div variants={fadeInUp} className="bg-white rounded-lg shadow-lg p-6 mt-8 md:mt-0">
              <div className="flex items-center mb-6">
                <XCircle className="w-8 h-8 text-red-500 mr-3" />
                <h3 className="text-xl font-semibold">Annulations</h3>
              </div>
              <div className="space-y-4">
                <div className="border-l-4 border-red-500 pl-4">
                  <p className="text-sm text-gray-500">10/03/2025</p>
                  <p className="font-medium text-gray-900">Réservation #54321 annulée</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </>
  );
}
