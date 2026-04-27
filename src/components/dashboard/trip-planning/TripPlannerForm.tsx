"use client"

import type React from "react"
import {
  Save,
  Send,
  AlertCircle,
  RefreshCw,
  FileText,
  MapPin,
  Calendar,
  Users,
  Car,
  Navigation,
  Info,
  CheckCircle,
  Wifi,
  Wind,
  Usb,
  Cookie,
  Coffee,
  Zap,
  Monitor,
} from "lucide-react"
import InputField from "@/ui/InputField"
import TextareaField from "@/ui/TextareaField"
import SelectField, {Option} from "@/ui/SelectField"
import type { useTripPlanner } from "@/lib/hooks/dasboard/useTripPlanner"
import { SuccessModal } from "@/modals/SuccessModal"
import TransparentModal from "@/modals/TransparentModal"
import type {UseFormRegisterReturn} from "react-hook-form"
import {Amenity} from "@/lib/types/generated-api/models/VoyageCreateRequestDTO";
import {ClassVoyage, Vehicule} from "@/lib/types/generated-api";
import {Customer} from "@/lib/types/models/BusinessActor";

interface TripPlannerFormProps {
  hook: ReturnType<typeof useTripPlanner>
}

// Composant pour gérer l'affichage d'un select avec chargement/erreur
const ResourceSelect: React.FC<{
  resourceState: {
    isLoading: boolean;
    error: string | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any[]
  }
  options: {
    label: string;
    value: string
  }[]
  onReload: () => void
  label: string
  id: string
  register: UseFormRegisterReturn,
  errorMsg: string | undefined
  icon?: React.ReactNode
}> = ({ resourceState, options, onReload, label, id, register, errorMsg, icon }) => (
    <div>
      {resourceState.error ? (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="flex items-center gap-3 text-red-600 bg-red-50 p-4 rounded-xl border border-red-200">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium">Erreur de chargement</p>
                <p className="text-xs text-red-500">{resourceState.error}</p>
              </div>
              <button
                  type="button"
                  onClick={onReload}
                  className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                  title="Réessayer"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
      ) : (
          <SelectField
              id={id}
              options={options}
              register={register}
              error={errorMsg}
              label={label}
              icon={icon}
              disabled={resourceState.isLoading}
          />
      )}
    </div>
)

const TripPlannerForm: React.FC<TripPlannerFormProps> = ({ hook }) => {
  const {
    form,
    onSubmit,
    isSubmitting,
    isSuccess,
    successMessage,
    setIsSuccess,
    formApiError,
    isEditMode,
    vehicles,
    drivers,
    travelClasses,
    reloadVehicles,
    reloadDrivers,
    reloadClasses,
  } = hook

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = form



  const watchedAmenities = watch("amenities") || []


  const toggleAmenity = (value: Amenity) => {
    const currentAmenities = watchedAmenities || []
    const newAmenities = currentAmenities.includes(value)
        ? currentAmenities.filter((item: string) => item !== value)
        : [...currentAmenities, value]

    setValue("amenities", newAmenities);
  }

  const vehicleOptions: Option[] = vehicles.data.map((vehicle: Vehicule) => ({
    label: `${vehicle.nom} (${vehicle.plaqueMatricule}) - ${vehicle.nbrPlaces} places`,
    value: vehicle.idVehicule!,
  }))

  const driverOptions: Option[] = drivers.data.map((driver: Customer) => ({
    label: `${driver.first_name} ${driver.last_name}`,
    value: driver.userId!,
  }))

  const travelClassOptions: Option[] = travelClasses.data.map((classVoyage: ClassVoyage) => ({
    label: `${classVoyage.nom} (${classVoyage.prix} FCFA)`,
    value: classVoyage.idClassVoyage!,
  }))

  const amenitiesList = [
    {
      value: "WIFI" as Amenity,
      label: "Wi-Fi",
      icon: Wifi,
      bgActive: "border-blue-300 bg-blue-100",
      bgHover: "hover:bg-blue-50 hover:border-blue-300",
      iconColor: "text-blue-500",
      textActive: "text-black"
    },
    {
      value: "AC" as Amenity,
      label: "Climatisation",
      icon: Wind,
      bgActive: "border-cyan-300 bg-cyan-100",
      bgHover: "hover:bg-cyan-50 hover:border-cyan-300",
      iconColor: "text-cyan-500",
      textActive: "text-black"
    },
    {
      value: "USB" as Amenity,
      label: "Ports USB",
      icon: Usb,
      bgActive: "border-green-300 bg-green-100",
      bgHover: "hover:bg-green-50 hover:border-green-300",
      iconColor: "text-green-500",
      textActive: "text-black"
    },
    {
      value: "SNACKS" as Amenity,
      label: "Collations",
      icon: Cookie,
      bgActive: "border-amber-300 bg-amber-100",
      bgHover: "hover:bg-amber-50 hover:border-amber-300",
      iconColor: "text-amber-500",
      textActive: "text-black"
    },
    {
      value: "BEVERAGES" as Amenity,
      label: "Boissons",
      icon: Coffee,
      bgActive: "border-orange-300 bg-orange-100",
      bgHover: "hover:bg-orange-50 hover:border-orange-300",
      iconColor: "text-orange-500",
      textActive: "text-black"
    },
    {
      value: "POWER_OUTLETS" as Amenity,
      label: "Prises électriques",
      icon: Zap,
      bgActive: "border-yellow-300 bg-yellow-100",
      bgHover: "hover:bg-yellow-50 hover:border-yellow-300",
      iconColor: "text-yellow-500",
      textActive: "text-black"
    },
    {
      value: "ENTERTAINMENT" as Amenity,
      label: "Divertissement",
      icon: Monitor,
      bgActive: "border-purple-300 bg-purple-100",
      bgHover: "hover:bg-purple-50 hover:border-purple-300",
      iconColor: "text-purple-500",
      textActive: "text-black"
    },
  ]

  return (
      <>
        <TransparentModal isOpen={isSuccess}>
          <SuccessModal
              canOpenSuccessModal={() => setIsSuccess(false)}
              message={successMessage}
          />
        </TransparentModal>

        <div className="max-w-5xl mx-auto">
          {/* Information Banner */}
          <div className="mb-8 bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Info className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {isEditMode ? "Modification de voyage" : "Création de voyage"}
                </h3>
                <p className="text-sm text-gray-700 italic leading-relaxed">
                  {isEditMode
                      ? "Vous modifiez un voyage existant. Tous les changements seront sauvegardés automatiquement. Vous pouvez choisir de mettre à jour le brouillon ou de republier directement."
                      : "Créez votre voyage en remplissant les informations ci-dessous. Vous pouvez sauvegarder en brouillon pour continuer plus tard, ou publier directement pour le rendre visible aux clients."
                  }
                </p>
                <div className="flex items-center gap-4 mt-3 text-xs text-orange-700">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Sauvegarde automatique
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Modification illimitée
                  </span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
            {/* Erreur globale */}
            {formApiError && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
                    <div>
                      <h4 className="text-lg font-semibold text-red-800 mb-1">Erreur de soumission</h4>
                      <p className="text-red-700">{formApiError}</p>
                    </div>
                  </div>
                </div>
            )}

            {/* Informations Générales */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-8 py-5 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Informations Générales</h2>
                    <p className="text-sm text-gray-600 mt-1">Titre et description de votre voyage</p>
                  </div>
                </div>
              </div>
              <div className="p-8 space-y-6">
                <InputField
                    id="titre"
                    label="Titre du voyage"
                    register={register("titre")}
                    error={errors.titre?.message}
                    placeholder="Ex: Douala - Yaoundé Express"
                />
                <TextareaField
                    id="description"
                    label="Description"
                    register={register("description")}
                    error={errors.description?.message}
                    placeholder="Décrivez votre voyage, les services inclus, les arrêts prévus..."
                />
              </div>
            </div>

            {/* Itinéraire */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 px-8 py-5 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Itinéraire</h2>
                    <p className="text-sm text-gray-600 mt-1">Points de départ et d'arrivée</p>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Départ */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-3 border-b border-emerald-100">
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                        <Navigation className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="text-base font-semibold text-gray-900">Point de Départ</h3>
                    </div>
                    <InputField
                        id="lieuDepart"
                        label="Ville de Départ"
                        register={register("lieuDepart")}
                        error={errors.lieuDepart?.message}
                        placeholder="Ex: Douala"
                    />
                    <InputField
                        id="pointDeDepart"
                        label="Point de Départ précis"
                        register={register("pointDeDepart")}
                        error={errors.pointDeDepart?.message}
                        placeholder="Ex: Gare routière de Bonabéri"
                    />
                  </div>

                  {/* Arrivée */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-3 border-b border-red-100">
                      <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="text-base font-semibold text-gray-900">Point d&#39;Arrivée</h3>
                    </div>
                    <InputField
                        id="lieuArrive"
                        label="Ville d'Arrivée"
                        register={register("lieuArrive")}
                        error={errors.lieuArrive?.message}
                        placeholder="Ex: Yaoundé"
                    />
                    <InputField
                        id="pointArrivee"
                        label="Point d'Arrivée précis"
                        register={register("pointArrivee")}
                        error={errors.pointArrivee?.message}
                        placeholder="Ex: Gare routière de Mvan"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Planning et Horaires */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 px-8 py-5 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Planning et Horaires</h2>
                    <p className="text-sm text-gray-600 mt-1">Dates et heures du voyage</p>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                      id="dateDepartPrev"
                      type="date"
                      label="Date de départ"
                      register={register("dateDepartPrev")}
                      error={errors.dateDepartPrev?.message}
                  />
                  <InputField
                      id="dateDepartPrev"
                      type="time"
                      label="Heure de départ"
                      register={register("heureDepartEffectif")}
                      error={errors.heureDepartEffectif?.message}
                  />
                  <InputField
                      id="heureArrive"
                      type="time"
                      label="Heure d'arrivée prévue"
                      register={register("heureArrive")}
                      error={errors.heureArrive?.message}
                  />
                  <InputField
                      id="dateLimiteReservation"
                      type="date"
                      label="Date Limite Réservation"
                      register={register("dateLimiteReservation")}
                      error={errors.dateLimiteReservation?.message}
                  />
                  <InputField
                      id="dateLimiteConfirmation"
                      type="date"
                      label="Date Limite Confirmation"
                      register={register("dateLimiteConfirmation")}
                      error={errors.dateLimiteConfirmation?.message}
                  />
                </div>
              </div>
            </div>

            {/* Capacité */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 px-8 py-5 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Capacité</h2>
                    <p className="text-sm text-gray-600 mt-1">Nombre de places disponibles</p>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="max-w-md">
                  <InputField
                      id="nbrPlaceReservable"
                      type="number"
                      label="Nombre de places"
                      register={register("nbrPlaceReservable")}
                      error={errors.nbrPlaceReservable?.message}
                      placeholder="Ex: 50"
                  />
                </div>
              </div>
            </div>

            {/* Ressources */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-teal-50 to-teal-100 px-8 py-5 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center">
                    <Car className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Ressources</h2>
                    <p className="text-sm text-gray-600 mt-1">Véhicule, chauffeur et classe de voyage</p>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <ResourceSelect
                      resourceState={travelClasses}
                      options={travelClassOptions}
                      onReload={reloadClasses}
                      label="Classe de Voyage"
                      id="classVoyageId"
                      register={register("classVoyageId")}
                      errorMsg={errors.classVoyageId?.message}
                  />
                  <ResourceSelect
                      resourceState={vehicles}
                      options={vehicleOptions}
                      onReload={reloadVehicles}
                      label="Véhicule"
                      id="vehiculeId"
                      register={register("vehiculeId")}
                      errorMsg={errors.vehiculeId?.message}
                  />
                  <ResourceSelect
                      resourceState={drivers}
                      options={driverOptions}
                      onReload={reloadDrivers}
                      label="Chauffeur"
                      id="chauffeurId"
                      register={register("chauffeurId")}
                      errorMsg={errors.chauffeurId?.message}
                  />
                </div>
              </div>
            </div>

            {/* Services et Équipements */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-rose-50 to-rose-100 px-8 py-5 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Services et Équipements</h2>
                    <p className="text-sm text-gray-600 mt-1">Sélectionnez les services inclus dans ce voyage</p>
                  </div>
                </div>
              </div>
              <div className="p-8">
                {/* Hidden input pour react-hook-form */}
                <input type="hidden" {...register("amenities")} />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                  {amenitiesList.map((amenity) => {
                    const IconComponent = amenity.icon
                    const isSelected = watchedAmenities.includes(amenity.value)

                    return (
                        <button
                            key={amenity.value}
                            type="button"
                            onClick={() => toggleAmenity(amenity.value)}
                            className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 group ${isSelected? `${amenity.bgActive} border-2 shadow-lg transform scale-105` : `border-gray-200 ${amenity.bgHover}`}`}
                        >
                          <IconComponent className={`h-5 w-5 transition-colors ${amenity.iconColor}`}/>
                          <span className={`text-sm font-medium transition-colors ${isSelected ? amenity.textActive : "text-gray-700 group-hover:text-gray-900"}`}>
                            {amenity.label}
                          </span>
                          {isSelected && (
                              <CheckCircle className={`h-4 w-4 ${amenity.iconColor} ml-auto`} />
                          )}
                        </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className={`p-4 ${formApiError && "flex justify between gap-20"}`}>

              <p className="text-red-600 font-semibold mt-4 text-md ">{formApiError}</p>

              <div className="flex flex-col sm:flex-row gap-4 sm:justify-end">
                <button
                    type="button"
                    onClick={handleSubmit((data) => onSubmit(data, "EN_ATTENTE"))}
                    disabled={isSubmitting}
                    className="cursor-pointer flex items-center justify-center gap-3 px-8 py-4 border-2 border-orange-300 rounded-xl text-orange-700 bg-orange-50 hover:bg-orange-100 hover:border-orange-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                >
                  <Save className="h-5 w-5"/>
                  {isEditMode ? "Mettre à jour le brouillon" : "Enregistrer en brouillon"}
                </button>
                <button
                    type="button"
                    onClick={handleSubmit((data) => onSubmit(data, "PUBLIE"))}
                    disabled={isSubmitting}
                    className="cursor-pointer flex items-center justify-center gap-3 px-8 py-4 bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg"
                >
                  <Send className="h-5 w-5"/>
                  {isEditMode ? "Mettre à jour et Publier" : "Publier le voyage"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </>
  )
}

export default TripPlannerForm