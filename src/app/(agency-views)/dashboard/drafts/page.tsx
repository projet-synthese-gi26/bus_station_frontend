"use client";

import React, { useState, useMemo } from "react";
import {
  Edit,
  Send,
  Trash2,
  FileEdit,
  AlertCircle,
  Search,
  MapPin,
  Calendar,
  Settings,
  Route,
} from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import { useDraftsPage } from "@/lib/hooks/dasboard/useDraftsPage";
import Loader from "@/modals/Loader";
import TransparentModal from "@/modals/TransparentModal";
import ConfirmationModal from "@/modals/ConfirmActionModal";
import { formatDateOnly } from "@/lib/services/date-services";

const DraftsPage = () => {
  const hook = useDraftsPage();

  const [searchTerm, setSearchTerm] = useState("");

  const filteredDrafts = useMemo(() => {
    if (!searchTerm) return hook.drafts;

    return hook.drafts.filter(
      (draft) =>
        draft.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        draft.lieuDepart?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        draft.lieuArrive?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [hook.drafts, searchTerm]);

  const getAvatarColor = (titre: string) => {
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
    const charCode = titre.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };

  const getInitials = (titre: string) => {
    return titre
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (hook.isLoading) {
    return (
      <>
        <PageHeader
          title={"Brouillons de Voyages"}
          subtitle={"Gérez, modifiez et publiez vos voyages en attente."}
        />
        <div className="flex justify-center items-center py-32">
          <Loader />
        </div>
      </>
    );
  }

  if (hook.apiError && !hook.canOpenConfirmationModal) {
    return (
      <div className="p-4 text-center">
        <PageHeader
          title={"Brouillons de Voyages"}
          subtitle={"Gérez, modifiez et publiez vos voyages en attente."}
        />
        <div className="mt-28">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
            <AlertCircle className="h-12 w-12 text-red-600 animate-pulse" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Erreur de chargement
          </h3>
          <p className="text-gray-600 mb-4">{hook.apiError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header avec recherche */}
      <div className="mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-6">
          <PageHeader
            title={"Brouillons de Voyages"}
            subtitle={"Gérez, modifiez et publiez vos voyages en attente."}
          />
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-800 bg-gray-100 px-3 py-1 rounded-full">
              {filteredDrafts.length} brouillon(s) trouvé(s)
            </span>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="relative max-w-md">
          <Search className="group-hover:stroke-2 group-hover:stroke-primary absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un brouillon..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-3 w-full border-2 border-gray-200 rounded-2xl hover:border-2 hover:border-primary focus:outline-none outline-none focus:border-2 focus:border-primary ring-0 transition-colors"
          />
        </div>

        {/* Indicateur de résultats */}
        {searchTerm && (
          <p className="mt-3 text-sm text-gray-600">
            {filteredDrafts.length} résultat(s) pour &quot;{searchTerm}&quot;
          </p>
        )}
      </div>

      {/* Modals */}
      <TransparentModal isOpen={hook.canOpenConfirmationModal}>
        <ConfirmationModal
          onClose={() => hook.setCanOpenConfirmationModal(false)}
          onConfirm={hook.handleDelete}
          title={"Supprimer le Brouillon"}
          message={hook.confirmationMessage}
        />
      </TransparentModal>

      <TransparentModal isOpen={hook.canOpenPublishModal}>
        <ConfirmationModal
          onClose={() => hook.setCanOpenPublishModal(false)}
          onConfirm={hook.handlePublish}
          title={"Publier le Voyage"}
          message={hook.publishMessage}
        />
      </TransparentModal>

      {/* Contenu principal */}
      {filteredDrafts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
            <FileEdit className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchTerm
              ? "Aucun brouillon trouvé"
              : "Aucun brouillon disponible"}
          </h3>
          <p className="text-gray-600 mb-6 max-w-sm mx-auto">
            {searchTerm
              ? "Essayez de modifier votre recherche"
              : "Vous n'avez aucun voyage en cours de planification. Créez votre premier voyage !"}
          </p>
          {!searchTerm && (
            <button
              onClick={() => hook.handleEdit("")}
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Edit className="h-5 w-5" />
              Créer un voyage
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-blue-200">
              <tr>
                <th className="px-8 py-5 text-center text-sm font-semibold text-gray-700">
                  <div className="flex items-center justify-center gap-2">
                    <FileEdit className="h-6 w-6 text-primary" />
                    Voyage
                  </div>
                </th>
                <th className="px-8 py-5 text-center text-sm font-semibold text-gray-700">
                  <div className="flex items-center justify-center gap-2">
                    <Route className="h-6 w-6 text-primary" />
                    Itinéraire
                  </div>
                </th>
                <th className="px-8 py-5 text-center text-sm font-semibold text-gray-700">
                  <div className="flex items-center justify-center gap-2">
                    <Calendar className="h-6 w-6 text-primary" />
                    Date de Départ
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
              {filteredDrafts.map((draft, index) => {
                const avatarColor = getAvatarColor(draft.titre || "V");

                return (
                  <tr
                    key={draft.idVoyage}
                    className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50/50 transition-colors`}
                  >
                    {/* Voyage */}
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-full ${avatarColor} flex items-center justify-center text-white font-bold shadow-md`}
                        >
                          {getInitials(draft.titre || "Voyage")}
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-gray-900 text-base">
                            {draft.titre}
                          </div>
                          <div className="text-gray-600 text-sm flex items-center justify-center gap-1">
                            <FileEdit className="h-4 w-4" />
                            Brouillon
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Itinéraire */}
                    <td className="px-8 py-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className="font-medium text-gray-900">
                          {draft.lieuDepart}
                        </span>
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {draft.lieuArrive}
                        </span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-8 py-6 text-center">
                      <div className="text-base font-medium text-gray-900">
                        {formatDateOnly(draft.dateDepartPrev || "")}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => hook.handleEdit(draft.idVoyage!)}
                          className="cursor-pointer p-3 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-full transition-all duration-200"
                          title="Modifier ce voyage"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => hook.openPublishModal(draft)}
                          className="cursor-pointer p-3 text-green-600 hover:text-green-700 hover:bg-green-100 rounded-full transition-all duration-200"
                          title="Publier ce voyage"
                        >
                          <Send className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => hook.openConfirmModal(draft)}
                          className="cursor-pointer p-3 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-full transition-all duration-200"
                          title="Supprimer ce voyage"
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
    </div>
  );
};

export default DraftsPage;
