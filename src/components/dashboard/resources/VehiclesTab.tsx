"use client";
import { useTranslation } from "react-i18next";
import {
  Plus,
  Edit,
  Trash2,
  Car,
  AlertCircle,
  Search,
  Settings,
  Users,
  Hash,
} from "lucide-react";
import { useVehiclesTab } from "@/lib/hooks/dasboard/useVehiclesTab";
import AddVehicleModal from "./AddVehicleModal";
import Loader from "@/modals/Loader";
import { useState, useMemo } from "react";
import TransparentModal from "@/modals/TransparentModal";
import ConfirmationModal from "@/modals/ConfirmActionModal";

const VehiclesTab = () => {
  const { t } = useTranslation();
  const hook = useVehiclesTab();

  // État pour la recherche
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrage des véhicules basé sur la recherche
  const filteredVehicles = useMemo(() => {
    if (!searchTerm) return hook.vehicles;

    return hook.vehicles.filter(
      (vehicle) =>
        vehicle.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.modele?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.plaqueMatricule
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()),
    );
  }, [hook.vehicles, searchTerm]);

  if (hook.isLoading) {
    return (
      <div className="flex justify-center items-center mt-16 py-20">
        <Loader />
      </div>
    );
  }

  if (hook.apiError && !hook.isModalOpen && !hook.canOpenConfirmationModal) {
    return (
      <div className="p-4 text-center mt-32">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Erreur de chargement
        </h3>
        <p className="text-gray-600 mb-4">{hook.apiError}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-700 transition-colors"
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
              Gestion des Véhicules
            </h3>
            <p className="text-gray-600 text-sm">
              Gérez votre flotte de véhicules
            </p>
          </div>
          <button
            onClick={hook.openModalForCreate}
            className="cursor-pointer flex items-center gap-3 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Plus className="h-5 w-5" />
            {t("dashboard.resources.addVehicle")}
          </button>
        </div>

        {/* Barre de recherche */}
        <div className="group relative max-w-md">
          <Search className="group-hover:stroke-2 group-hover:stroke-primary absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un véhicule..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-3 w-full border-2 border-gray-200 rounded-2xl hover:border-2 hover:border-primary focus:outline-none outline-none focus:border-2 focus:border-primary ring-0  transition-colors"
          />
        </div>

        {/* Indicateur de résultats */}
        {searchTerm && (
          <p className="mt-3 text-sm text-gray-600">
            {filteredVehicles.length} résultat(s) pour &#34;{searchTerm}&#34;
          </p>
        )}
      </div>

      {/* Contenu principal */}
      {filteredVehicles.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
            <Car className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchTerm
              ? "Aucun véhicule trouvé"
              : "Aucun véhicule dans votre flotte"}
          </h3>
          <p className="text-gray-600 mb-6 max-w-sm mx-auto">
            {searchTerm
              ? "Essayez de modifier votre recherche"
              : "Commencez par ajouter votre premier véhicule pour gérer votre flotte."}
          </p>
          {!searchTerm && (
            <button
              onClick={hook.openModalForCreate}
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Ajouter un véhicule
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-blue-200">
              <tr>
                <th className="px-8 py-5 text-center text-sm font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    <Car className="h-6 w-6 text-primary" />
                    Véhicule
                  </div>
                </th>
                <th className="text-center px-8 py-5  text-sm font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    <Hash className="h-7 w-7 text-primary" />
                    Plaque d&#39;immatriculation
                  </div>
                </th>
                <th className="px-8 py-5 text-center text-sm font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    <Users className="h-6 w-6 text-primary" />
                    Capacité
                  </div>
                </th>
                <th className="px-8 py-5 text-center text-sm font-semibold text-gray-700">
                  <div className="flex items-center justify-center gap-2">
                    <Settings className="h-6 w-6 text-primary" />
                    Actions
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredVehicles.map((vehicle, index) => (
                <tr
                  key={vehicle.idVehicule}
                  className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50/50 transition-colors`}
                >
                  {/* Véhicule */}
                  <td className="text-center px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="font-semibold text-gray-900 text-base">
                          {vehicle.nom}
                        </div>
                        <div className="text-gray-600 text-sm">
                          {vehicle.modele}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Plaque */}
                  <td className=" px-8 py-6">
                    <span className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-800">
                      {vehicle.plaqueMatricule}
                    </span>
                  </td>

                  {/* Capacité */}
                  <td className="text-center px-8 py-6">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-gray-900">
                        {vehicle.nbrPlaces}
                      </span>
                      <span className="text-gray-600">places</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => hook.openModalForEdit(vehicle)}
                        className="cursor-pointer p-3 text-green-600 hover:text-green-700 hover:bg-green-100 rounded-full transition-all duration-200"
                        title="Modifier"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => hook.openConfirmModal(vehicle)}
                        className="cursor-pointer p-3 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-full transition-all duration-200"
                        title="Supprimer"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <TransparentModal isOpen={hook.isModalOpen}>
        <AddVehicleModal hook={hook} />
      </TransparentModal>

      <TransparentModal isOpen={hook.canOpenConfirmationModal}>
        <ConfirmationModal
          onClose={() => hook.setCanOpenConfirmationModal(false)}
          onConfirm={hook.handleDelete}
          title={"Suppression de vehicule"}
          message={hook.confirmationMessage}
        />
      </TransparentModal>
    </div>
  );
};

export default VehiclesTab;
