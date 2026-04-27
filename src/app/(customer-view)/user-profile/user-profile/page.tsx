"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState } from "react";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import { fadeInUp, staggerContainer } from "@/lib/animations/animationTool";
import { JSX } from "react";
import { User, Mail, Phone, Calendar, MapPin, Award, TrendingUp, TrendingDown } from "lucide-react";
import { ClipboardList, CheckCircle, XCircle } from "lucide-react";
import ProfilePhotoUploader from "@/components/ProfilePhotoUploader";

const stats = [
  { icon: TrendingUp, title: "Voyages réussis", value: "12" },
  { icon: TrendingDown, title: "Annulations", value: "1" },
  { icon: Award, title: "Points de fidélité", value: "250" },
  { icon: MapPin, title: "Villes visitées", value: "5" },
];

export default function ProfilePage(): JSX.Element {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+33 1 23 45 67 89"
  });

  const handleProfileImageUpload = async (file: File) => {
    try {
      // Convertir le fichier en base64 pour l'affichage temporaire
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setProfileImage(reader.result.toString());
        }
      };
      reader.readAsDataURL(file);

      // Ici vous devrez implémenter l'upload vers votre backend
      console.log('Image uploaded:', file);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'image:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Ici vous devrez implémenter l'envoi des données vers votre backend
      console.log('Submitting form data:', formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="container mx-auto px-4 py-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 pointer-events-none"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 opacity-50"></div>
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-4xl font-bold text-gray-800 mb-8">
            Mon Profil
          </motion.h1>
          
          {/* Section de profil */}
          <motion.div variants={fadeInUp} className="bg-white rounded-xl shadow-xl overflow-hidden mb-12">
            <div className="h-48 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <div className="relative">
                <ProfilePhotoUploader
                  profileImage={profileImage}
                  onUpload={handleProfileImageUpload}
                />
              </div>
            </div>
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">John Doe</h1>
              <p className="text-gray-600 mb-6">Voyageur passionné</p>
              <div className="flex space-x-4">
                <button 
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
                >
                  {isEditing ? "Annuler" : "Modifier le profil"}
                </button>
                <button className="px-6 py-3 bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200 transition-colors font-semibold">
                  Mes préférences
                </button>
              </div>
            </div>
          </motion.div>

          {/* Formulaire de modification du profil */}
          {isEditing && (
            <motion.div 
              variants={fadeInUp} 
              className="bg-white rounded-lg shadow-lg overflow-hidden mb-12 p-6"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Modifier votre profil</h2>
              <form className="space-y-8">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    placeholder="Votre prénom"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    placeholder="adresse@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    placeholder="+33 1 23 45 67 89"
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    onClick={(e) => handleSubmit(e)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Sauvegarder
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Section des statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-xl shadow-xl p-8"
              >
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className="w-8 h-8 text-blue-600" />
                  <div className="flex-1 text-right">
                    <h3 className="text-lg font-semibold text-gray-900">{stat.title}</h3>
                    <p className="text-2xl font-bold text-blue-700">{stat.value}</p>
                  </div>
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
            <div className="space-y-8">
              <motion.div variants={fadeInUp} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
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
              <motion.div variants={fadeInUp} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
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
          </div>
        </motion.div>
      </main>
      <Footer />
    </>
  );
}