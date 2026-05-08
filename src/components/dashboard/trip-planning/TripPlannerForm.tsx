"use client"

import type React from "react"
import {
  Save, Send, AlertCircle, FileText, MapPin, Calendar, Users, Car,
  Navigation, Info, CheckCircle, Wifi, Wind, Usb, Cookie, Coffee, Zap, Monitor,
} from "lucide-react"
import InputField from "@/ui/InputField"
import TextareaField from "@/ui/TextareaField"
import SelectField, {Option} from "@/ui/SelectField"
import { SuccessModal } from "@/modals/SuccessModal"
import TransparentModal from "@/modals/TransparentModal"
import { Amenity } from "@/lib/types/generated-api/models/VoyageCreateRequestDTO";
import Loader from "@/modals/Loader"
import { useTripPlannerV2 } from "@/lib/hooks/dasboard/useTripPlannerV2"

interface TripPlannerFormProps {
  hook: ReturnType<typeof useTripPlannerV2>
}

const TripPlannerForm: React.FC<TripPlannerFormProps> = ({ hook }) => {
  const {
    form, isSubmitting, isSuccess, successMessage, setIsSuccess,
    globalError, mode, vehicules, chauffeurs, classes,
    canPublish, saveDraft, createAndPublish
  } = hook

  const { register, formState: { errors }, watch, setValue } = form
  const watchedAmenities = watch("amenities") || []

  const toggleAmenity = (value: Amenity) => {
    const newAmenities = watchedAmenities.includes(value)
        ? watchedAmenities.filter((item: string) => item !== value)
        : [...watchedAmenities, value]
    setValue("amenities", newAmenities);
  }

  // CORRECTION DU MAPPING : Utilisation des vrais champs du service
  const vehicleOptions: Option[] = vehicules.map((v) => ({
    label: `${v.nom} (${v.plaqueMatricule})`,
    value: v.idVehicule,
  }))

  const driverOptions: Option[] = chauffeurs.map((c) => ({
    label: c.fullName,
    value: c.id,
  }))

  const travelClassOptions: Option[] = classes.map((cl) => ({
    label: `${cl.nom} (${cl.prix} FCFA)`,
    value: cl.idClassVoyage,
  }))

  const amenitiesList = [
    { value: "WIFI" as Amenity, label: "Wi-Fi", icon: Wifi, iconColor: "text-blue-500", bgActive: "border-blue-300 bg-blue-100" },
    { value: "AC" as Amenity, label: "Climatisation", icon: Wind, iconColor: "text-cyan-500", bgActive: "border-cyan-300 bg-cyan-100" },
    { value: "USB" as Amenity, label: "Ports USB", icon: Usb, iconColor: "text-green-500", bgActive: "border-green-300 bg-green-100" },
    { value: "SNACKS" as Amenity, label: "Collations", icon: Cookie, iconColor: "text-amber-500", bgActive: "border-amber-300 bg-amber-100" },
    { value: "BEVERAGES" as Amenity, label: "Boissons", icon: Coffee, iconColor: "text-orange-500", bgActive: "border-orange-300 bg-orange-100" },
    { value: "POWER_OUTLETS" as Amenity, label: "Prises", icon: Zap, iconColor: "text-yellow-500", bgActive: "border-yellow-300 bg-yellow-100" },
    { value: "ENTERTAINMENT" as Amenity, label: "Écran", icon: Monitor, iconColor: "text-purple-500", bgActive: "border-purple-300 bg-purple-100" },
  ]

  return (
      <>
        <TransparentModal isOpen={isSuccess}>
          <SuccessModal canOpenSuccessModal={() => setIsSuccess(false)} message={successMessage || ""} />
        </TransparentModal>

        {isSubmitting && (
          <TransparentModal isOpen={true}>
            <Loader message="Traitement en cours..." />
          </TransparentModal>
        )}

        <div className="max-w-5xl mx-auto pb-20">
          {/* On empêche le submit par défaut pour éviter le double déclenchement */}
          <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
            
            {globalError && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-center gap-3">
                  <AlertCircle className="h-6 w-6 text-red-600 shrink-0" />
                  <p className="text-red-700 font-medium">{globalError}</p>
                </div>
            )}

            {/* Section 1 : Itinéraire */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="bg-blue-50 px-8 py-4 border-b border-gray-200 flex items-center gap-3">
                <MapPin className="h-5 w-5 text-blue-600" />
                <h2 className="font-bold text-gray-900">Itinéraire & Informations</h2>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField id="titre" label="Titre" register={register("titre")} error={errors.titre?.message} placeholder="Ex: Douala - Yaoundé" />
                <InputField id="lieuDepart" label="Ville de Départ" register={register("lieuDepart")} error={errors.lieuDepart?.message} />
                <InputField id="lieuArrive" label="Ville d'Arrivée" register={register("lieuArrive")} error={errors.lieuArrive?.message} />
                <InputField id="prix" type="number" label="Prix (FCFA)" register={register("prix")} error={errors.prix?.message} />
                <div className="md:col-span-2">
                  <TextareaField id="description" label="Description" register={register("description")} error={errors.description?.message} />
                </div>
              </div>
            </div>

            {/* Section 2 : Ressources */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="bg-teal-50 px-8 py-4 border-b border-gray-200 flex items-center gap-3">
                <Car className="h-5 w-5 text-teal-600" />
                <h2 className="font-bold text-gray-900">Ressources & Capacité</h2>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField id="classVoyageId" label="Classe" options={travelClassOptions} register={register("classVoyageId")} error={errors.classVoyageId?.message} />
                <SelectField id="vehiculeId" label="Véhicule" options={vehicleOptions} register={register("vehiculeId")} error={errors.vehiculeId?.message} />
                <SelectField id="chauffeurId" label="Chauffeur" options={driverOptions} register={register("chauffeurId")} error={errors.chauffeurId?.message} />
                <InputField id="nbrPlaceReservable" type="number" label="Nombre de places" register={register("nbrPlaceReservable")} error={errors.nbrPlaceReservable?.message} />
              </div>
            </div>

            {/* Section 3 : Horaires */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="bg-purple-50 px-8 py-4 border-b border-gray-200 flex items-center gap-3">
                <Calendar className="h-5 w-5 text-purple-600" />
                <h2 className="font-bold text-gray-900">Planning</h2>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <InputField id="dateDepartPrev" type="date" label="Date de départ" register={register("dateDepartPrev")} error={errors.dateDepartPrev?.message} />
                <InputField id="heureDepartEffectif" type="time" label="Heure départ" register={register("heureDepartEffectif")} error={errors.heureDepartEffectif?.message} />
                <InputField id="heureArrive" type="time" label="Heure arrivée" register={register("heureArrive")} error={errors.heureArrive?.message} />
              </div>
            </div>

            {/* Section 4 : Équipements */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <h2 className="font-bold text-gray-900 mb-6">Services à bord</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {amenitiesList.map((amenity) => (
                  <button
                    key={amenity.value}
                    type="button"
                    onClick={() => toggleAmenity(amenity.value)}
                    className={`flex items-center gap-2 p-3 border rounded-xl transition-all ${watchedAmenities.includes(amenity.value) ? amenity.bgActive : "bg-white"}`}
                  >
                    <amenity.icon className={`h-4 w-4 ${amenity.iconColor}`} />
                    <span className="text-xs font-medium">{amenity.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <button
                type="button"
                onClick={saveDraft}
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 px-8 py-4 border-2 border-orange-200 rounded-xl text-orange-700 bg-orange-50 hover:bg-orange-100 transition-all font-bold"
              >
                <Save className="h-5 w-5" />
                Sauvegarder brouillon
              </button>
              
              <button
                type="button"
                onClick={createAndPublish}
                disabled={isSubmitting || !canPublish}
                className={`flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white font-bold shadow-lg transition-all ${!canPublish ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary hover:bg-primary/90'}`}
              >
                <Send className="h-5 w-5" />
                {mode === "edit" ? "Mettre à jour & Publier" : "Créer et publier"}
              </button>
            </div>

          </form>
        </div>
      </>
  )
}

export default TripPlannerForm