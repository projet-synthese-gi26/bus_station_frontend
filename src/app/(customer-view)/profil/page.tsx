"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useBusStation } from "@/context/Provider";
import { User, Mail, Phone, KeyRound, Edit, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { Customer } from "@/lib/types/models/BusinessActor";
import {
  updateUserProfile,
  changePassword,
} from "@/lib/services/businessActor-service";

// ─── Utilitaires ─────────────────────────────────────────────────────────────

const getInitials = (
  firstName?: string | null,
  lastName?: string | null,
): string => {
  const a = firstName ? firstName[0] : "";
  const b = lastName ? lastName[0] : "";
  return `${a}${b}`.toUpperCase();
};

// ─── Modale générique ─────────────────────────────────────────────────────────

const Modal = ({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
      <div className="flex items-center justify-between p-5 border-b">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
      </div>
      <div className="p-5">{children}</div>
    </div>
  </div>
);

// ─── Champ d'affichage ────────────────────────────────────────────────────────

const ProfileField = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null | undefined;
}) => (
  <div className="flex items-start py-3 border-b border-gray-100 last:border-0">
    <div className="text-blue-600 mr-4 mt-1">{icon}</div>
    <div>
      <p className="text-sm font-semibold text-gray-500">{label}</p>
      <p className="text-base text-gray-800">{value ?? "Non renseigné"}</p>
    </div>
  </div>
);

// ─── Modale édition du profil ─────────────────────────────────────────────────

type EditFields = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
};

const EditProfileModal = ({
  user,
  onClose,
  onUpdate,
}: {
  user: Customer;
  onClose: () => void;
  onUpdate: (updated: Customer) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditFields>({
    defaultValues: {
      first_name: user.first_name ?? "",
      last_name: user.last_name ?? "",
      email: user.email ?? "",
      phone_number: user.phone_number ?? "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit = async (data: EditFields) => {
    setIsSubmitting(true);
    setApiError(null);
    try {
      // PUT /auth/me — UserDTO partiel
      const updated = await updateUserProfile(data);
      if (updated) {
        onUpdate(updated);
        onClose();
      } else {
        setApiError("Une erreur est survenue lors de la mise à jour.");
      }
    } catch {
      setApiError("Une erreur est survenue lors de la mise à jour.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal title="Modifier le profil" onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-gray-700">Prénom</label>
            <input
              {...register("first_name", { required: "Requis" })}
              className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
            {errors.first_name && (
              <p className="text-red-500 text-xs mt-1">
                {errors.first_name.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Nom</label>
            <input
              {...register("last_name", { required: "Requis" })}
              className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
            {errors.last_name && (
              <p className="text-red-500 text-xs mt-1">
                {errors.last_name.message}
              </p>
            )}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            {...register("email", { required: "Requis" })}
            className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Téléphone</label>
          <input
            type="tel"
            {...register("phone_number")}
            className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {apiError && (
          <p className="text-red-500 text-sm text-center">{apiError}</p>
        )}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 rounded-lg font-semibold hover:bg-gray-200"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isSubmitting ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// ─── Modale changement de mot de passe ───────────────────────────────────────

type PwdFields = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

const ChangePasswordModal = ({ onClose }: { onClose: () => void }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<PwdFields>();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const onSubmit = async (data: PwdFields) => {
    setIsSubmitting(true);
    setApiError(null);
    setSuccessMessage(null);
    try {
      // PUT /auth/me/password — { oldPassword, newPassword }
      await changePassword(data.oldPassword, data.newPassword);
      setSuccessMessage("Mot de passe changé avec succès !");
      reset();
      setTimeout(onClose, 2000);
    } catch (error: unknown) {
      const status = (error as { response?: { status?: number } })?.response
        ?.status;
      if (status === 401) {
        setApiError("Ancien mot de passe incorrect.");
      } else {
        setApiError("Une erreur est survenue, veuillez réessayer.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const newPwd = watch("newPassword");

  return (
    <Modal title="Changer le mot de passe" onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">
            Ancien mot de passe
          </label>
          <input
            type="password"
            {...register("oldPassword", { required: "Champ requis" })}
            className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
          {errors.oldPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.oldPassword.message}
            </p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">
            Nouveau mot de passe
          </label>
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
            className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
          {errors.newPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.newPassword.message}
            </p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">
            Confirmer le nouveau mot de passe
          </label>
          <input
            type="password"
            {...register("confirmNewPassword", {
              required: "Champ requis",
              validate: (val) =>
                val === newPwd || "Les mots de passe ne correspondent pas",
            })}
            className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
          {errors.confirmNewPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.confirmNewPassword.message}
            </p>
          )}
        </div>
        {apiError && (
          <p className="text-red-500 text-sm text-center">{apiError}</p>
        )}
        {successMessage && (
          <p className="text-green-600 text-sm text-center">{successMessage}</p>
        )}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 rounded-lg font-semibold hover:bg-gray-200"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isSubmitting ? "Modification..." : "Changer"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// ─── Page principale ─────────────────────────────────────────────────────────

export default function ProfilPage() {
  const router = useRouter();
  const {
    userData,
    isLoading,
    isCustomerAuthenticated,
    isAgencyConnected,
    logout,
  } = useBusStation();

  const isAuthenticated = isCustomerAuthenticated || isAgencyConnected;
  const [displayUserData, setDisplayUserData] = useState<Customer | null>(null);
  const [modalOpen, setModalOpen] = useState<"edit" | "password" | null>(null);

  useEffect(() => {
    if (userData) {
      setDisplayUserData(userData);
    }
  }, [userData]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  const handleProfileUpdate = (updatedData: Customer) => {
    setDisplayUserData(updatedData);
  };

  if (isLoading || !displayUserData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Chargement...</p>
      </div>
    );
  }

  const roleLabel = displayUserData.role?.includes("AGENCE_VOYAGE")
    ? "Responsable Agence"
    : displayUserData.role?.includes("BUS_STATION_MANAGER")
      ? "Gestionnaire de Gare"
      : "Client";

  return (
    <>
      {modalOpen === "edit" && (
        <EditProfileModal
          user={displayUserData}
          onClose={() => setModalOpen(null)}
          onUpdate={handleProfileUpdate}
        />
      )}
      {modalOpen === "password" && (
        <ChangePasswordModal onClose={() => setModalOpen(null)} />
      )}

      <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Paramètres du Compte
          </h1>
          <p className="mt-1 text-gray-500">
            Gérez vos informations personnelles et de sécurité.
          </p>
        </header>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Colonne avatar */}
            <div className="md:w-1/3 p-8 bg-gray-50 border-r border-gray-200 flex flex-col items-center justify-center text-center gap-3">
              <div className="w-24 h-24 rounded-full ring-4 ring-blue-200 bg-blue-600 flex items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {getInitials(
                    displayUserData.first_name,
                    displayUserData.last_name,
                  )}
                </span>
              </div>
              <div>
                <p className="font-bold text-gray-900 text-lg">
                  {displayUserData.first_name} {displayUserData.last_name}
                </p>
                <p className="text-sm text-gray-500">
                  @{displayUserData.username}
                </p>
                <span className="mt-1 inline-block text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  {roleLabel}
                </span>
              </div>
            </div>

            {/* Colonne infos */}
            <div className="flex-1 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-gray-700">
                  Informations personnelles
                </h2>
                <button
                  onClick={() => setModalOpen("edit")}
                  className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  <Edit size={14} /> Modifier
                </button>
              </div>

              <ProfileField
                icon={<User size={16} />}
                label="Nom complet"
                value={
                  `${displayUserData.first_name ?? ""} ${displayUserData.last_name ?? ""}`.trim() ||
                  null
                }
              />
              <ProfileField
                icon={<Mail size={16} />}
                label="Adresse email"
                value={displayUserData.email}
              />
              <ProfileField
                icon={<Phone size={16} />}
                label="Téléphone"
                value={displayUserData.phone_number}
              />

              <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setModalOpen("password")}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-sm"
                >
                  <KeyRound size={14} /> Changer le mot de passe
                </button>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition-colors text-sm"
                >
                  Se déconnecter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
