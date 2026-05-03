"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Check, AlertCircle, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { resetPassword } from "@/lib/services/businessActor-service";

type FormFields = {
  newPassword: string;
  confirmPassword: string;
};

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormFields>();

  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setApiError(
        "Lien invalide ou expiré. Veuillez faire une nouvelle demande.",
      );
    }
  }, [token]);

  const onSubmit = async (data: FormFields) => {
    if (!token) return;

    setIsLoading(true);
    setApiError(null);

    try {
      // POST /auth/reset-password — { token, newPassword }
      await resetPassword(token, data.newPassword);
      setIsSuccess(true);
      // Redirection automatique vers login après 3 secondes
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response
        ?.status;
      if (status === 400 || status === 401) {
        setApiError(
          "Ce lien de réinitialisation est invalide ou a expiré. Veuillez faire une nouvelle demande.",
        );
      } else {
        setApiError("Une erreur est survenue. Veuillez réessayer.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const newPwd = watch("newPassword");

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Mot de passe réinitialisé !
        </h2>
        <p className="text-gray-600 mb-6">
          Votre mot de passe a été modifié avec succès. Vous allez être redirigé
          vers la connexion...
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-sm"
        >
          <ArrowLeft className="h-4 w-4" /> Aller à la connexion
        </Link>
      </motion.div>
    );
  }

  return (
    <>
      <p className="text-gray-600 text-center mb-6">
        Choisissez un nouveau mot de passe pour votre compte.
      </p>

      {apiError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{apiError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nouveau mot de passe
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              {...register("newPassword", {
                required: "Champ requis",
                minLength: { value: 8, message: "8 caractères minimum" },
                pattern: {
                  value: /^(?=.*[A-Z])(?=.*\d)/,
                  message: "Doit contenir au moins 1 majuscule et 1 chiffre",
                },
              })}
              className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>
          {errors.newPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirmer le mot de passe
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              {...register("confirmPassword", {
                required: "Champ requis",
                validate: (val) =>
                  val === newPwd || "Les mots de passe ne correspondent pas",
              })}
              className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isLoading || !token}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-300"
        >
          {isLoading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
        </motion.button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
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
            Réinitialiser le mot de passe
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <Suspense
            fallback={
              <p className="text-center text-gray-500">Chargement...</p>
            }
          >
            <ResetPasswordForm />
          </Suspense>
        </div>

        <p className="mt-4 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
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
