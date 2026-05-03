"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Check, AlertCircle, ArrowLeft } from "lucide-react";
import { forgotPassword } from "@/lib/services/businessActor-service";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * En DEV, le backend retourne aussi { token } dans la réponse
   * pour faciliter les tests (pas d'email réel envoyé).
   * On l'affiche à l'écran pour pouvoir tester /reset-password directement.
   */
  const [devToken, setDevToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setError("Veuillez saisir une adresse email valide.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // POST /auth/forgot-password — { email }
      const result = await forgotPassword(email);
      setIsSubmitted(true);
      // En DEV : le backend retourne le token en clair pour faciliter les tests
      if (result.token) {
        setDevToken(result.token);
      }
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response
        ?.status;
      // Le backend retourne toujours un message générique (200)
      // même si l'email n'existe pas — on affiche le succès dans tous les cas
      if (status === undefined || status === 200 || status === 404) {
        setIsSubmitted(true);
      } else {
        setError("Une erreur est survenue. Veuillez réessayer.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-white shadow mb-4"
          >
            <span className="font-bold text-2xl text-blue-600">M</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Mot de passe oublié
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {!isSubmitted ? (
            <>
              <p className="text-gray-600 text-center mb-6">
                Entrez votre adresse email et nous vous enverrons un lien de
                réinitialisation.
              </p>

              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2 shrink-0" />
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <div className="mb-6">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Adresse email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="votre@email.com"
                      required
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                >
                  {isLoading ? (
                    "Envoi en cours..."
                  ) : (
                    <>
                      Envoyer le lien
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </motion.button>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Email envoyé !
              </h2>
              <p className="text-gray-600 mb-4">
                Si un compte existe pour{" "}
                <span className="font-medium">{email}</span>, vous recevrez un
                email de réinitialisation.
              </p>

              {/* Bloc visible uniquement si le backend retourne le token (mode DEV) */}
              {devToken && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-left">
                  <p className="text-xs font-semibold text-yellow-700 mb-1">
                    Mode DEV — token de réinitialisation :
                  </p>
                  <code className="text-xs text-yellow-800 break-all">
                    {devToken}
                  </code>
                  <Link
                    href={`/reset-password?token=${devToken}`}
                    className="mt-2 block text-center text-sm text-blue-600 hover:underline font-medium"
                  >
                    Tester la réinitialisation →
                  </Link>
                </div>
              )}

              <Link
                href="/login"
                className="mt-6 inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Retour à la connexion
              </Link>
            </motion.div>
          )}
        </div>

        <p className="mt-4 text-center text-sm text-gray-500">
          <Link
            href="/login"
            className="flex items-center justify-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
          >
            <ArrowLeft className="h-4 w-4" /> Retour à la connexion
          </Link>
        </p>
      </motion.div>

      <p className="mt-8 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Bus Station. Tous droits réservés.
      </p>
    </div>
  );
}
