"use client"

import type React from "react"
import { X, Car, Hash, Users, FileText, Image, Settings, Plus, Edit3 } from "lucide-react"
import type { useVehiclesTab } from "@/lib/hooks/dasboard/useVehiclesTab"
import InputField from "@/ui/InputField"
import TextareaField from "@/ui/TextareaField"
import {Tooltip} from "antd";

interface AddVehicleModalProps {
  hook: ReturnType<typeof useVehiclesTab>
}

const AddVehicleModal: React.FC<AddVehicleModalProps> = ({ hook }) => {
  const {closeModal, form, onSubmit, isSubmitting, apiError, editingVehicle } = hook
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form

  const isEditMode = !!editingVehicle

  return (
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-y-auto">
        {/* Header avec gradient */}
        <div className="relative bg-gradient-to-r from-primary to-primary/80 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                {isEditMode ? (
                    <Edit3 className="h-6 w-6 text-white" />
                ) : (
                    <Plus className="h-6 w-6 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold">
                  {isEditMode ? "Modifier le véhicule" : "Ajout d'un nouveau véhicule"}
                </h2>
                <p className="text-primary-100 text-sm mt-1">
                  {isEditMode ? "Modifiez les informations du véhicule" : "Remplissez les informations du véhicule"}
                </p>
              </div>
            </div>
            <Tooltip placement={"top"} title={"Fermer"}>
              <button
                  onClick={closeModal}
                  className="cursor-pointer flex items-center justify-center hover:bg-white/50 bg-white/30 w-10 h-10 rounded-full transition-colors backdrop-blur-sm"
                  title="Fermer"
              >
                <X className="h-6 w-6 text-white"/>
              </button>
            </Tooltip>
          </div>

          {/* Decorative element */}
          <div
              className="absolute -bottom-2 left-0 right-0 h-4 bg-gradient-to-b from-primary/10 to-transparent rounded-b-2xl"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-6">
            {apiError && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-red-400 rounded-full flex items-center justify-center">
                      <X className="h-3 w-3 text-white" />
                    </div>
                    <p className="text-sm text-red-700 font-medium">{apiError}</p>
                  </div>
                </div>
            )}

            <div className="space-y-6">
              {/* Section Informations générales */}
              <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Car className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">Informations générales</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                      id="nom"
                      label="Nom du Véhicule"
                      register={register("nom")}
                      error={errors.nom?.message}
                      placeholder="Ex: Bus Mercedes"
                      icon={<Car className="h-5 w-5 text-gray-400" />}
                  />
                  <InputField
                      id="modele"
                      label="Modèle"
                      register={register("modele")}
                      error={errors.modele?.message}
                      placeholder="Ex: Sprinter 2023"
                      icon={<Settings className="h-5 w-5 text-gray-400" />}
                  />
                </div>
              </div>

              {/* Section Caractéristiques */}
              <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Hash className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">Caractéristiques</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                      id="plaqueMatricule"
                      label="Plaque d'immatriculation"
                      register={register("plaqueMatricule")}
                      error={errors.plaqueMatricule?.message}
                      placeholder="Ex: ABC-123-DE"
                      icon={<Hash className="h-5 w-5 text-gray-400" />}
                  />
                  <InputField
                      id="nbrPlaces"
                      type="number"
                      label="Nombre de places"
                      register={register("nbrPlaces")}
                      error={errors.nbrPlaces?.message}
                      placeholder="Ex: 50"
                      icon={<Users className="h-5 w-5 text-gray-400" />}
                  />
                </div>
              </div>

              {/* Section Détails supplémentaires */}
              <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">Détails supplémentaires</h3>
                </div>

                <div className="space-y-4">
                  <TextareaField
                      id="description"
                      label="Description (Optionnel)"
                      register={register("description")}
                      error={errors.description?.message}
                      placeholder="Décrivez les caractéristiques du véhicule..."
                      icon={<FileText className="h-5 w-5 text-gray-400" />}
                  />

                  <InputField
                      id="lienPhoto"
                      label="URL de l'image (Optionnel)"
                      register={register("lienPhoto")}
                      error={errors.lienPhoto?.message}
                      placeholder="https://exemple.com/image.jpg"
                      icon={<Image className="h-5 w-5 text-gray-400" />}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer avec design amélioré */}
          <div className="flex items-center justify-end gap-3 p-6 bg-gradient-to-r from-gray-50 to-gray-100/50 border-t border-gray-100 rounded-b-2xl">

            <button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center gap-2 shadow-sm"
            >
              {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    {isEditMode ? "Modification..." : "Création..."}
                  </>
              ) : (
                  <>
                    {isEditMode ? (
                        <Edit3 className="h-4 w-4"/>
                    ) : (
                        <Plus className="h-4 w-4"/>
                    )}
                    {isEditMode ? "Enregistrer les modifications" : "Ajouter le véhicule"}
                  </>
              )}
            </button>
            <button
                type="button"
                onClick={closeModal}
                className="cursor-pointer px-6 py-2.5 text-white bg-red-500  rounded-lg hover:bg-red-700 transition-all duration-200 font-medium"
            >
              Annuler
            </button>

          </div>
        </form>
      </div>
  )
}

export default AddVehicleModal