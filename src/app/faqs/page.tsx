"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ChevronDown, ChevronUp, Phone, Mail, HelpCircle } from "lucide-react";
import {
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  staggerContainer,
} from "@/lib/animations/animationTool";
import { useTranslation } from "react-i18next";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import { useNavigation } from "@/lib/hooks/useNavigation";
import SearchBar from "@/components/faqs-page-component/SearchBar";

// Fix 1: Properly type the recentSearches state
export default function FAQPage() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Fix 2: Make sure handleSearch is properly defined
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // The filtering logic is already handled by filteredFAQs
  };

  // Fix 3: Correctly type the function for updating recent searches
  const saveRecentSearch = (query: string) => {
    setRecentSearches((prev: string[]) => {
      // Avoid duplicates and keep only the 5 most recent searches
      const updatedSearches = [
        query,
        ...prev.filter((item) => item !== query),
      ].slice(0, 5);
      // Optional: save to localStorage to persist between sessions
      localStorage.setItem(
        "faqRecentSearches",
        JSON.stringify(updatedSearches)
      );
      return updatedSearches;
    });
  };

  // Retrieve recent searches on load
  useEffect(() => {
    try {
      const saved = localStorage.getItem("faqRecentSearches");
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Error retrieving recent searches:", e);
    }
  }, []);

  // FAQ item type definition
  type FAQItem = {
    id: number;
    question: string;
    answer: string;
    category: string;
  };

  // FAQ data
  const faqItems: FAQItem[] = [
    {
      id: 1,
      question: t(
        "faqPage.questions.bookingProcess",
        "Comment réserver un voyage via Bus Station ?"
      ),
      answer: t(
        "faqPage.answers.bookingProcess",
        "Pour réserver un voyage sur Bus Station, connectez-vous à votre compte, recherchez votre destination, sélectionnez les options qui vous conviennent et procédez au paiement. Vous recevrez une confirmation par email avec tous les détails de votre réservation."
      ),
      category: "booking",
    },
    {
      id: 2,
      question: t(
        "faqPage.questions.cancellation",
        "Quelle est la politique d'annulation ?"
      ),
      answer: t(
        "faqPage.answers.cancellation",
        "Notre politique d'annulation varie selon les prestataires. En général, les annulations effectuées 30 jours avant le départ sont remboursées à 100%, 15-29 jours avant à 50%, et moins de 15 jours ne sont pas remboursables. Consultez les conditions spécifiques à chaque réservation."
      ),
      category: "booking",
    },
    {
      id: 3,
      question: t(
        "faqPage.questions.payment",
        "Quels moyens de paiement acceptez-vous ?"
      ),
      answer: t(
        "faqPage.answers.payment",
        "Nous acceptons les cartes de crédit (Visa, Mastercard, American Express), PayPal, les virements bancaires et dans certains pays les paiements en plusieurs fois. Toutes les transactions sont sécurisées avec un cryptage SSL."
      ),
      category: "payment",
    },
    {
      id: 4,
      question: t(
        "faqPage.questions.refund",
        "Combien de temps faut-il pour obtenir un remboursement ?"
      ),
      answer: t(
        "faqPage.answers.refund",
        "Les remboursements sont généralement traités dans un délai de 5 à 10 jours ouvrables. Le délai d'apparition sur votre compte bancaire dépend de votre banque et peut prendre jusqu'à 30 jours selon les institutions financières."
      ),
      category: "payment",
    },
    {
      id: 5,
      question: t(
        "faqPage.questions.account",
        "Comment modifier les informations de mon compte ?"
      ),
      answer: t(
        "faqPage.answers.account",
        "Connectez-vous à votre compte, cliquez sur 'Mon profil' dans le menu principal, puis sur 'Modifier le profil'. Vous pourrez y mettre à jour vos informations personnelles, changer votre mot de passe ou mettre à jour vos préférences de communication."
      ),
      category: "account",
    },
    {
      id: 6,
      question: t(
        "faqPage.questions.travelDocuments",
        "Quels documents de voyage sont nécessaires ?"
      ),
      answer: t(
        "faqPage.answers.travelDocuments",
        "Les documents requis varient selon votre destination. En général, vous aurez besoin d'un passeport valide, et parfois d'un visa. Pour certaines destinations, des certificats de vaccination peuvent être exigés. Nous vous recommandons de vérifier les exigences spécifiques à votre destination avant de voyager."
      ),
      category: "travel",
    },
    {
      id: 7,
      question: t(
        "faqPage.questions.insurance",
        "L'assurance voyage est-elle incluse ?"
      ),
      answer: t(
        "faqPage.answers.insurance",
        "L'assurance voyage n'est pas automatiquement incluse dans nos offres. Nous vous proposons différentes options d'assurance voyage lors du processus de réservation, couvrant l'annulation, les soins médicaux à l'étranger, les bagages perdus et plus encore."
      ),
      category: "travel",
    },
    {
      id: 8,
      question: t(
        "faqPage.questions.agencyRegistration",
        "Comment inscrire mon agence sur Bus Station ?"
      ),
      answer: t(
        "faqPage.answers.agencyRegistration",
        "Pour inscrire votre agence, rendez-vous sur notre page 'Devenir partenaire' et suivez le processus d'inscription. Vous devrez fournir des informations sur votre agence, vos licences professionnelles et accepter nos conditions d'utilisation. Notre équipe examinera votre demande dans un délai de 48 heures."
      ),
      category: "agency",
    },
    {
      id: 9,
      question: t(
        "faqPage.questions.commission",
        "Quelles sont les commissions pour les agences partenaires ?"
      ),
      answer: t(
        "faqPage.answers.commission",
        "Notre structure de commission est progressive et basée sur le volume de ventes. Elle varie généralement de 8% à 15%. Les partenaires Premium bénéficient de taux préférentiels et d'avantages supplémentaires. Contactez notre équipe partenaires pour plus de détails."
      ),
      category: "agency",
    },
    {
      id: 10,
      question: t(
        "faqPage.questions.api",
        "Proposez-vous une API pour les agences ?"
      ),
      answer: t(
        "faqPage.answers.api",
        "Oui, nous proposons une API complète permettant aux agences partenaires d'intégrer notre inventaire de voyages et notre système de réservation directement dans leur site web ou application. La documentation technique et les clés d'API sont disponibles après approbation de votre compte partenaire."
      ),
      category: "technical",
    },
    {
      id: 11,
      question: t(
        "faqPage.questions.mobileApp",
        "Existe-t-il une application mobile Moving.com ?"
      ),
      answer: t(
        "faqPage.answers.mobileApp",
        "Oui, notre application mobile est disponible gratuitement sur iOS et Android. Elle vous permet de rechercher et réserver des voyages, d'accéder à vos réservations existantes, de recevoir des notifications de voyage et de contacter notre service client, même en déplacement."
      ),
      category: "technical",
    },
    {
      id: 12,
      question: t(
        "faqPage.questions.customerService",
        "Comment contacter le service client ?"
      ),
      answer: t(
        "faqPage.answers.customerService",
        "Notre service client est disponible 7j/7 par téléphone au +33 1 23 45 67 89, par email à support@busstation.com, ou via le chat en direct sur notre site et notre application mobile. Pour les urgences en voyage, nous disposons d'une ligne dédiée accessible 24h/24."
      ),
      category: "support",
    },
  ];

  const categories = [
    { id: "all", name: t("faqPage.categories.all", "Toutes les questions") },
    { id: "booking", name: t("faqPage.categories.booking", "Réservation") },
    { id: "payment", name: t("faqPage.categories.payment", "Paiement") },
    { id: "account", name: t("faqPage.categories.account", "Compte") },
    { id: "travel", name: t("faqPage.categories.travel", "Voyage") },
    { id: "agency", name: t("faqPage.categories.agency", "Agences") },
    { id: "technical", name: t("faqPage.categories.technical", "Technique") },
    { id: "support", name: t("faqPage.categories.support", "Support") },
  ];

  const toggleItem = (id: number) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFAQs = faqItems
    .filter(
      (item) => activeCategory === "all" || item.category === activeCategory
    )
    .filter(
      (item) =>
        searchQuery === "" ||
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const [heroRef, heroInView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const [categoriesRef, categoriesInView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const [faqRef, faqInView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const [ctaRef, ctaInView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  return (
    <>
      <Header />
      <main className="flex flex-col min-h-screen overflow-hidden">
        {/* Hero Section */}
        <motion.div
          ref={heroRef}
          initial="hidden"
          animate={heroInView ? "visible" : "hidden"}
          variants={fadeInUp}
          className="relative py-24 md:py-32 bg-gradient-to-br from-blue-600 to-blue-800"
        >
          <div className="container mx-auto px-4">
            <motion.h1
              variants={fadeInUp}
              className="text-3xl md:text-5xl font-semibold mb-6 tracking-normal leading-tight text-white text-center"
            >
              {t("faqPage.title", "Foire Aux Questions")}
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="md:text-xl text-lg mb-12 text-blue-100 max-w-3xl mx-auto text-center"
            >
              {t(
                "faqPage.subtitle",
                "Trouvez rapidement des réponses à vos questions les plus fréquentes."
              )}
            </motion.p>

            {/* Search Bar */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm  max-w-2xl mx-auto mb-8">
              <SearchBar
                initialQuery={searchQuery}
                onSearch={handleSearch}
                placeholder={t(
                  "faqPage.searchPlaceholder",
                  "Rechercher une question..."
                )}
                recentSearches={recentSearches}
                onSaveRecentSearch={saveRecentSearch}
                className="w-full" // This class will apply to the SearchBar component itself
              />
            </div>
          </div>

          {/* Wavy separator */}
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

        {/* Categories Section */}
        <motion.div
          ref={categoriesRef}
          initial="hidden"
          animate={categoriesInView ? "visible" : "hidden"}
          variants={fadeInUp}
          className="py-12 bg-white"
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-6 py-3 rounded-full text-sm md:text-base font-medium transition-colors duration-300 ${
                    activeCategory === category.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category.name}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          ref={faqRef}
          initial="hidden"
          animate={faqInView ? "visible" : "hidden"}
          variants={fadeInUp}
          className="py-16 bg-gray-50"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {filteredFAQs.length > 0 ? (
                <motion.div variants={staggerContainer} className="space-y-4">
                  {filteredFAQs.map((item) => (
                    <motion.div
                      key={item.id}
                      variants={fadeInUp}
                      className="bg-white rounded-xl shadow-sm overflow-hidden"
                    >
                      <button
                        onClick={() => toggleItem(item.id)}
                        className="flex justify-between items-center w-full p-6 text-left"
                      >
                        <span className="font-medium text-lg text-gray-900">
                          {item.question}
                        </span>
                        {expandedItems.includes(item.id) ? (
                          <ChevronUp className="h-5 w-5 text-blue-600 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-blue-600 flex-shrink-0" />
                        )}
                      </button>
                      {expandedItems.includes(item.id) && (
                        <div className="px-6 pb-6 pt-0 text-gray-600">
                          <div className="border-t border-gray-100 pt-4 mt-2">
                            {item.answer}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-12">
                  <HelpCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    {t("faqPage.noResults", "Aucun résultat trouvé")}
                  </h3>
                  <p className="text-gray-600">
                    {t(
                      "faqPage.tryAgain",
                      "Essayez de modifier votre recherche ou consultez une autre catégorie"
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Still Have Questions Section */}
        <motion.div
          ref={ctaRef}
          initial="hidden"
          animate={ctaInView ? "visible" : "hidden"}
          variants={fadeInUp}
          className="py-16 bg-white"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-xl p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center md:space-x-8">
                <div className="md:w-1/2 mb-8 md:mb-0">
                  <motion.h2
                    variants={fadeInLeft}
                    className="text-2xl md:text-3xl font-semibold mb-4 text-white"
                  >
                    {t(
                      "faqPage.stillQuestions",
                      "Vous avez encore des questions ?"
                    )}
                  </motion.h2>
                  <motion.p
                    variants={fadeInLeft}
                    className="text-blue-100 mb-6"
                  >
                    {t(
                      "faqPage.contactUs",
                      "Notre équipe de support client est disponible pour vous aider avec n'importe quelle question que vous pourriez avoir."
                    )}
                  </motion.p>
                  <motion.div variants={fadeInLeft} className="space-y-4">
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-blue-300 mr-3" />
                      <span className="text-white">+237 6 98 45 67 89</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-blue-300 mr-3" />
                      <span className="text-white">support@busstation.com</span>
                    </div>
                  </motion.div>
                </div>
                <motion.div variants={fadeInRight} className="md:w-1/2 w-full">
                  <button
                    onClick={() => navigation.onGoToContactUs()}
                    className="w-full bg-white text-blue-600 font-medium py-4 px-6 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Mail className="h-5 w-5" />
                    {t("faqPage.contactUsButton", "Contactez-nous")}
                  </button>
                  <div className="mt-4 text-center">
                    <span className="text-blue-100 text-sm">
                      {t(
                        "faqPage.responseTime",
                        "Temps de réponse moyen : moins de 24 heures"
                      )}
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Popular Topics Section */}
        <div className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                {t("faqPage.popularTopics", "Sujets populaires")}
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                {t(
                  "faqPage.quickLinks",
                  "Accédez rapidement à nos guides et ressources les plus consultés"
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Topic 1 */}
              <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="mb-4 text-blue-600">
                  <svg
                    className="h-10 w-10"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-3.54-4.46a1 1 0 0 1 1.42-1.42 3 3 0 0 0 4.24 0 1 1 0 0 1 1.42 1.42 5 5 0 0 1-7.08 0zM9 11a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm6 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">
                  {t("faqPage.topics.booking", "Guide de réservation")}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t(
                    "faqPage.topicDescriptions.booking",
                    "Apprenez à réserver votre voyage en quelques étapes simples."
                  )}
                </p>
                <a
                  href="#"
                  className="text-blue-600 font-medium hover:underline flex items-center"
                >
                  {t("faqPage.readMore", "En savoir plus")}
                  <svg
                    className="h-4 w-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              </div>

              {/* Topic 2 */}
              <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="mb-4 text-blue-600">
                  <svg
                    className="h-10 w-10"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 22H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1zm-1-2V4H5v16h14zM8 9h8v2H8V9zm0 4h8v2H8v-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">
                  {t("faqPage.topics.documents", "Documents de voyage")}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t(
                    "faqPage.topicDescriptions.documents",
                    "Tous les documents dont vous avez besoin pour voyager sereinement."
                  )}
                </p>
                <a
                  href="#"
                  className="text-blue-600 font-medium hover:underline flex items-center"
                >
                  {t("faqPage.readMore", "En savoir plus")}
                  <svg
                    className="h-4 w-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              </div>

              {/* Topic 3 */}
              <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="mb-4 text-blue-600">
                  <svg
                    className="h-10 w-10"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm1-11v2h1a3 3 0 0 1 0 6h-1v1a1 1 0 0 1-2 0v-1H8a1 1 0 0 1 0-2h3v-2h-1a3 3 0 0 1 0-6h1V6a1 1 0 0 1 2 0v1h3a1 1 0 0 1 0 2h-3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">
                  {t("faqPage.topics.payment", "Options de paiement")}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t(
                    "faqPage.topicDescriptions.payment",
                    "Découvrez toutes nos options de paiement et de financement."
                  )}
                </p>
                <a
                  href="#"
                  className="text-blue-600 font-medium hover:underline flex items-center"
                >
                  {t("faqPage.readMore", "En savoir plus")}
                  <svg
                    className="h-4 w-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
