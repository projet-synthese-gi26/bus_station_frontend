"use client"

import React, { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Mail, ArrowRight, Check, AlertCircle, ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation basique de l'email
    if (!email || !email.includes('@')) {
      setError("Veuillez saisir une adresse email valide")
      return
    }
    
    // En situation réelle, envoyez une requête API ici
    console.log("Demande de réinitialisation pour:", email)
    
    // Simule une réponse réussie
    setIsSubmitted(true)
    setError("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      {/* Éléments décoratifs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 rounded-full bg-blue-200 opacity-20"
          animate={{
            y: [0, 20, 0],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-blue-300 opacity-10"
          animate={{
            y: [0, -30, 0],
          }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
      </div>

      {/* Conteneur principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        {/* En-tête */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white w-12 h-12 rounded-lg flex items-center justify-center">
              <span className="font-bold text-2xl text-blue-600">B</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold">Mot de passe oublié</h1>
          <p className="text-blue-100 mt-2">Réinitialisez votre mot de passe Bus Station</p>
        </div>

        {/* Contenu principal */}
        <div className="p-6 md:p-8">
          {!isSubmitted ? (
            // Formulaire de demande de réinitialisation
            <>
              <div className="text-center mb-6">
                <p className="text-gray-600">
                  Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Affichage des erreurs */}
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/* Champ Email */}
                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="votre@email.com"
                      required
                    />
                  </div>
                </div>

                {/* Bouton d'envoi */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  Envoyer le lien de réinitialisation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </motion.button>
              </form>
            </>
          ) : (
            // Message de confirmation
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Email envoyé !</h2>
              <p className="text-gray-600 mb-8">
                Si un compte existe avec l&#39;adresse <span className="font-medium">{email}</span>, vous recevrez un email
                contenant un lien pour réinitialiser votre mot de passe.
              </p>
              <p className="text-gray-500 text-sm mb-6">
                N&#39;oubliez pas de vérifier vos dossiers de spam ou courrier indésirable.
              </p>
              <motion.button
                onClick={() => setIsSubmitted(false)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mb-4 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium flex items-center justify-center hover:bg-gray-200 transition-colors mx-auto"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour au formulaire
              </motion.button>
            </motion.div>
          )}

          {/* Liens de navigation */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                Retour à la connexion
              </Link>
              <span className="mx-2 text-gray-400">•</span>
              <Link href="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Pied de page */}
      <p className="mt-8 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Bus Station. Tous droits réservés.
      </p>
    </div>
  )
}