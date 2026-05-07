"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, ArrowRight, Check, AlertCircle, ArrowLeft } from "lucide-react";
import { resetPassword } from "@/lib/services/auth-service";
import axios from "axios";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialToken = searchParams.get("token") ?? "";

  const [token, setToken] = useState(initialToken);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token.trim()) {
      setError("Le token de réinitialisation est manquant.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Le nouveau mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(token, newPassword);
      setIsSuccess(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch (err) {
      console.error("Erreur lors de la réinitialisation :", err);
      if (axios.isAxiosError(err) && err.response?.status === 400) {
        setError(
          "Le token est invalide ou expiré. Veuillez demander un nouveau lien.",
        );
      } else {
        setError("Une erreur est survenue. Veuillez réessayer.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      {/* Éléments décoratifs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 rounded-full bg-blue-200 opacity-20"
          animate={{ y: [0, 20, 0] }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-blue-300 opacity-10"
          animate={{ y: [0, -30, 0] }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
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
          <h1 className="text-2xl font-bold">Réinitialiser le mot de passe</h1>
          <p className="text-blue-100 mt-2">
            Choisissez un nouveau mot de passe
          </p>
        </div>

        {/* Contenu principal */}
        <div className="p-6 md:p-8">
          {!isSuccess ? (
            <>
              <div className="text-center mb-6">
                <p className="text-gray-600">
                  Entrez le token reçu par email et votre nouveau mot de passe.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/* Token */}
                <div className="mb-4">
                  <label
                    htmlFor="token"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Token de réinitialisation
                  </label>
                  <input
                    id="token"
                    name="token"
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                    placeholder="Collez le token reçu par email"
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Nouveau mot de passe */}
                <div className="mb-4">
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Au moins 8 caractères"
                      required
                      minLength={8}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Confirmation */}
                <div className="mb-6">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Re-saisissez le mot de passe"
                      required
                      minLength={8}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Réinitialisation..."
                    : "Réinitialiser le mot de passe"}
                  {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
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
                Mot de passe modifié !
              </h2>
              <p className="text-gray-600 mb-6">
                Votre mot de passe a été réinitialisé avec succès. Redirection
                vers la connexion…
              </p>
              <Link
                href="/login"
                className="inline-flex items-center py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Aller à la connexion
              </Link>
            </motion.div>
          )}

          {/* Liens de navigation */}
          {!isSuccess && (
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Retour à la connexion
                </Link>
                <span className="mx-2 text-gray-400">•</span>
                <Link
                  href="/forgot-password"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Demander un nouveau lien
                </Link>
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Pied de page */}
      <p className="mt-8 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Bus Station. Tous droits réservés.
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white" />
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
