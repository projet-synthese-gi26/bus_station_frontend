"use client";
import { useTranslation } from "react-i18next";
import {
  Plus,
  Edit,
  Trash2,
  UserCheck,
  AlertCircle,
  Search,
  Phone,
  Mail,
  Settings,
  CheckCircle,
  User,
} from "lucide-react";
import { useDriversTab } from "@/lib/hooks/dasboard/useDriverTab";
import AddDriverModal from "./AddDriverModal";
import Loader from "@/modals/Loader";
import TransparentModal from "@/modals/TransparentModal";
import type { Customer } from "@/lib/types/models/BusinessActor";
import { useState, useMemo } from "react";
import ConfirmationModal from "@/modals/ConfirmActionModal";

const DriversTab = () => {
  const { t } = useTranslation();
  const hook = useDriversTab();

  // État pour la recherche
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrage des chauffeurs basé sur la recherche
  const filteredDrivers = useMemo(() => {
    if (!searchTerm) return hook.drivers;

    return hook.drivers.filter(
      (driver: Customer) =>
        driver.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.phone_number?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [hook.drivers, searchTerm]);

  // Fonction pour obtenir les initiales
  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  // Fonction pour obtenir la couleur d'avatar
  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-blue-400",
      "bg-green-400",
      "bg-purple-400",
      "bg-pink-400",
      "bg-indigo-400",
      "bg-yellow-400",
      "bg-red-400",
      "bg-teal-400",
    ];
    const charCode = name.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };

  if (hook.isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader />
      </div>
    );
  }

  if (hook.apiError && !hook.isModalOpen) {
    return (
      <div className="p-4 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Erreur de chargement
        </h3>
        <p className="text-gray-600 mb-4">{hook.apiError}</p>
        <button
          onClick={() => window.location.reload()}
          className="cursor-pointer px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header avec recherche */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Gestion des Chauffeurs
            </h3>
            <p className="text-gray-600 text-sm">
              Gérez votre équipe de chauffeurs
            </p>
          </div>
          <button
            onClick={hook.openModalForCreate}
            className="cursor-pointer flex items-center gap-3 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Plus className="h-5 w-5" />
            {t("dashboard.resources.addDriver")}
          </button>
        </div>

        {/* Barre de recherche */}
        <div className="relative max-w-md">
          <Search className="group-hover:stroke-2 group-hover:stroke-primary absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un chauffeur par nom, email ou téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-3 w-full border-2 border-gray-200 rounded-2xl hover:border-2 hover:border-primary focus:outline-none outline-none focus:border-2 focus:border-primary ring-0  transition-colors"
          />
        </div>

        {/* Indicateur de résultats */}
        {searchTerm && (
          <p className="mt-3 text-sm text-gray-600">
            {filteredDrivers.length} résultat(s) pour &#34;{searchTerm}&#34;
          </p>
        )}
      </div>

      {/* Contenu principal */}
      {filteredDrivers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
            <UserCheck className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchTerm
              ? "Aucun chauffeur trouvé"
              : "Aucun chauffeur dans votre équipe"}
          </h3>
          <p className="text-gray-600 mb-6 max-w-sm mx-auto">
            {searchTerm
              ? "Essayez de modifier votre recherche"
              : "Commencez par ajouter votre premier chauffeur pour gérer votre équipe."}
          </p>
          {!searchTerm && (
            <button
              onClick={hook.openModalForCreate}
              className="cursor-pointer inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Ajouter un chauffeur
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-blue-200">
              <tr>
                <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Chauffeur
                  </div>
                </th>
                <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-primary" />
                    Contact
                  </div>
                </th>
                <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Statut
                  </div>
                </th>
                <th className="px-8 py-5 text-center text-sm font-semibold text-gray-700">
                  <div className="flex items-center justify-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    Actions
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredDrivers.map((driver: Customer, index) => {
                const avatarColor = getAvatarColor(driver.first_name || "A");
                return (
                  <tr
                    key={driver.userId || index}
                    className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50/50 transition-colors`}
                  >
                    {/* Chauffeur */}
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-full ${avatarColor} flex items-center justify-center text-white font-bold shadow-md`}
                        >
                          {getInitials(driver.first_name, driver.last_name)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-base">
                            {driver.first_name} {driver.last_name}
                          </div>
                          <div className="text-gray-600 text-sm">
                            @{driver.username}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-8 py-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-900">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{driver.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{driver.phone_number}</span>
                        </div>
                      </div>
                    </td>

                    {/* Statut */}
                    <td className="px-8 py-6">
                      <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
                        Actif
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => hook.openModalForEdit(driver)}
                          className="cursor-pointer p-3 text-green-600 hover:text-green-700 hover:bg-green-100 rounded-full transition-all duration-200"
                          title="Modifier"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => hook.openConfirmModal(driver)}
                          className="cursor-pointer p-3 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-full transition-all duration-200"
                          title="Supprimer"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <TransparentModal isOpen={hook.isModalOpen}>
        <AddDriverModal hook={hook} />
      </TransparentModal>

      <TransparentModal isOpen={hook.canOpenConfirmModal}>
        <ConfirmationModal
          onClose={() => hook.setCanOpenConfirmModal(false)}
          onConfirm={hook.handleDelete}
          title={"Delete Driver"}
          message={hook.confirmationMessage}
        />
      </TransparentModal>
    </div>
  );
};

export default DriversTab;
