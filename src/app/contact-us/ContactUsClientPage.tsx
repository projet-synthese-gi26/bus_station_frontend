"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Mail, Phone, MapPin, Send, Globe, Clock } from "lucide-react";
import {
  fadeInUp,
  fadeInLeft,
  fadeInRight,
} from "@/lib/animations/animationTool";
import { useTranslation } from "react-i18next";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";

export default function ContactUsClientPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { t } = useTranslation();

  const [contactRef, contactInView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const [formRef2, formInView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const [mapRef, mapInView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simuler l'envoi du formulaire (à remplacer par un vrai appel API)
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      // Réinitialiser l'état après 5 secondes
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <>
      <Header />
      <main className="flex flex-col min-h-screen overflow-hidden">
        {/* Hero Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="relative text-base-color py-24 md:py-32 bg-gradient-to-br from-blue-600 to-blue-800"
        >
          <div className="container mx-auto px-4">
            <motion.h1
              variants={fadeInUp}
              className="text-3xl md:text-5xl font-semibold mb-6 tracking-normal leading-tight text-white text-center"
            >
              {t("contactPage.title", "Contactez-nous")}
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="md:text-xl text-lg mb-8 text-blue-100 max-w-3xl mx-auto text-center"
            >
              {t(
                "contactPage.subtitle",
                "Notre équipe est à votre disposition pour répondre à vos questions et vous aider à planifier votre prochain voyage."
              )}
            </motion.p>
          </div>

          {/* Séparateur ondulé */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform rotate-180">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
              className="relative block w-full h-[60px]"
            >
              <path
                d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                fill="#ffffff"
              ></path>
            </svg>
          </div>
        </motion.div>

        {/* Info Cards Section */}
        <motion.div
          ref={contactRef}
          initial="hidden"
          animate={contactInView ? "visible" : "hidden"}
          variants={fadeInUp}
          className="py-16 bg-white"
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <motion.div
                variants={fadeInUp}
                className=" bg-gray-200 rounded-xl shadow-lg p-8 text-center transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                  <Mail className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">
                  {t("contactPage.emailUs", "Écrivez-nous")}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t(
                    "contactPage.emailDescription",
                    "Pour toute demande d'information ou assistance"
                  )}
                </p>
                <a
                  href="mailto:contact@bustation.com"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  contact@bustation.com
                </a>
              </motion.div>

              {/* Card 2 */}
              <motion.div
                variants={fadeInUp}
                className="bg-gray-200 rounded-xl shadow-lg p-8 text-center transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                  <Phone className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">
                  {t("contactPage.callUs", "Appelez-nous")}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t(
                    "contactPage.callDescription",
                    "Notre service client est disponible 7j/7"
                  )}
                </p>
                <a
                  href="tel:+33123456789"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  +237 6 98 45 67 89
                </a>
              </motion.div>

              {/* Card 3 */}
              <motion.div
                variants={fadeInUp}
                className="bg-gray-200 rounded-xl shadow-lg p-8 text-center transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">
                  {t("contactPage.hours", "Horaires d'ouverture")}
                </h3>
                <p className="text-gray-600 mb-2">
                  {t("contactPage.workdays", "Lun - Ven: 9h00 - 20h00")}
                </p>
                <p className="text-gray-600">
                  {t("contactPage.weekend", "Sam - Dim: 10h00 - 18h00")}
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Contact Form Section */}
        <motion.div
          ref={formRef2}
          initial="hidden"
          animate={formInView ? "visible" : "hidden"}
          variants={fadeInUp}
          className="py-16 bg-gray-50"
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-55">
              {/* Form */}
              <motion.div variants={fadeInLeft} className="lg:w-1/2">
                <h2 className="text-3xl font-semibold mb-6">
                  {t("contactPage.formTitle", "Envoyez-nous un message")}
                </h2>
                <p className="text-gray-600 mb-8">
                  {t(
                    "contactPage.formDescription",
                    "Vous avez une question ou une requête spécifique ? Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais."
                  )}
                </p>

                <form
                  ref={formRef}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        {t("contactPage.name", "Nom complet")}
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t(
                          "contactPage.namePlaceholder",
                          "Votre nom"
                        )}
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        {t("contactPage.email", "Email")}
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t(
                          "contactPage.emailPlaceholder",
                          "votre@email.com"
                        )}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      {t("contactPage.subject", "Sujet")}
                    </label>
                    <input
                      id="subject"
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={t(
                        "contactPage.subjectPlaceholder",
                        "Objet de votre message"
                      )}
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      {t("contactPage.message", "Message")}
                    </label>
                    <textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={t(
                        "contactPage.messagePlaceholder",
                        "Détaillez votre demande ici..."
                      )}
                      required
                    ></textarea>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="privacy"
                        type="checkbox"
                        required
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="privacy"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        {t(
                          "contactPage.privacyPolicy",
                          "J'accepte la politique de confidentialité"
                        )}
                      </label>
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                    className={`flex items-center justify-center gap-2 w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors ${
                      loading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? (
                      t("contactPage.sending", "Envoi en cours...")
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        {t("contactPage.send", "Envoyer le message")}
                      </>
                    )}
                  </motion.button>

                  {submitted && (
                    <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg">
                      {t(
                        "contactPage.successMessage",
                        "Votre message a été envoyé avec succès. Nous reviendrons vers vous rapidement."
                      )}
                    </div>
                  )}
                </form>
              </motion.div>

              {/* Map and Info */}
              <motion.div variants={fadeInRight} className="lg:w-1/2">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="aspect-w-16 aspect-h-9 h-64">
                    {/* Replace with your actual map implementation */}
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <MapPin className="h-12 w-12 text-gray-400" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4">
                      {t("contactPage.ourOffices", "Nos bureaux")}
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                        <p className="text-gray-600">
                          123 Avenue des Champs-Élysées,
                          <br />
                          75008 Paris, France
                        </p>
                      </div>
                      <div className="flex items-start">
                        <Globe className="h-5 w-5 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-gray-600 mb-1">
                            {t(
                              "contactPage.international",
                              "Bureaux internationaux:"
                            )}
                          </p>
                          <ul className="text-gray-600 space-y-1">
                            <li>New York • London • Dubai • Tokyo • Sydney</li>
                          </ul>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Mail className="h-5 w-5 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                        <p className="text-gray-600">
                          <a
                            href="mailto:contact@bustation.com"
                            className="hover:text-blue-600"
                          >
                            contact@bustation.com
                          </a>
                          <br />
                          <a
                            href="mailto:support@busstation.com"
                            className="hover:text-blue-600"
                          >
                            support@busstation.com
                          </a>
                        </p>
                      </div>
                      <div className="flex items-start">
                        <Phone className="h-5 w-5 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                        <p className="text-gray-600">
                          <a
                            href="tel:+33123456789"
                            className="hover:text-blue-600"
                          >
                            +237 6 98 45 67 89
                          </a>
                          <br />
                          <a
                            href="tel:+33198765432"
                            className="hover:text-blue-600"
                          >
                            +237 6 98 45 67 89
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Global Presence Section */}
        <motion.div
          ref={mapRef}
          initial="hidden"
          animate={mapInView ? "visible" : "hidden"}
          variants={fadeInUp}
          className="py-16 bg-white"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold mb-4">
                {t("contactPage.globalPresence", "Notre présence mondiale")}
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                {t(
                  "contactPage.globalDescription",
                  "Avec des bureaux et des partenaires dans plus de 30 pays, nous sommes présents partout où vos voyages vous mènent."
                )}
              </p>
            </div>

            {/* World Map Visualization - Placeholder */}
            <div className="bg-gray-100 rounded-xl p-4 h-96 flex items-center justify-center">
              <p className="text-gray-500 text-lg">
                {t(
                  "contactPage.mapPlaceholder",
                  "Carte interactive de notre présence mondiale"
                )}
              </p>
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </>
  );
}