// src/modals/AddTripModal.tsx
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlannerTrip } from "@/lib/types/models/Trip";
import { X } from "lucide-react";
import { getAllClassVoyagesByAgence } from "@/lib/services/class-voyage-service";
import { getVehiclesByAgency } from "@/lib/services/vehicule-service";
import { ClassVoyage, Vehicule } from "@/lib/types/generated-api";

interface AddTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<PlannerTrip, "id">) => Promise<void>;
  agencyId: string;
}

// ⚠️ BLOC 4 : le backend exige lieu_depart, lieu_arrive, id_class_voyage,
// id_vehicule pour créer un créneau. Le formulaire les expose explicitement.
const tripSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Le titre doit contenir au moins 3 caractères." }),
  dayOfWeek: z.coerce.number().min(1).max(7),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Format HH:MM invalide.",
  }),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Format HH:MM invalide.",
  }),
  lieuDepart: z.string().min(2, { message: "Le lieu de départ est requis." }),
  lieuArrive: z.string().min(2, { message: "Le lieu d'arrivée est requis." }),
  classVoyageId: z
    .string()
    .min(1, { message: "Sélectionnez une classe de voyage." }),
  vehiculeId: z.string().min(1, { message: "Sélectionnez un véhicule." }),
  nbrPlaces: z.coerce.number().min(1).optional(),
});

type FormType = z.infer<typeof tripSchema>;

export default function AddTripModal({
  isOpen,
  onClose,
  onSave,
  agencyId,
}: AddTripModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormType>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      title: "",
      dayOfWeek: 1,
      startTime: "09:00",
      endTime: "11:00",
      lieuDepart: "",
      lieuArrive: "",
      classVoyageId: "",
      vehiculeId: "",
      nbrPlaces: 50,
    },
  });

  const [classes, setClasses] = useState<ClassVoyage[]>([]);
  const [vehicles, setVehicles] = useState<Vehicule[]>([]);
  const [isLoadingResources, setIsLoadingResources] = useState<boolean>(false);
  const [resourcesError, setResourcesError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Charger classes & véhicules dès l'ouverture
  useEffect(() => {
    if (!isOpen || !agencyId) return;
    let cancelled = false;
    setIsLoadingResources(true);
    setResourcesError(null);
    Promise.all([
      getAllClassVoyagesByAgence(agencyId).catch(() => [] as ClassVoyage[]),
      getVehiclesByAgency(agencyId).catch(() => [] as Vehicule[] | null),
    ])
      .then(([classData, vehicleData]) => {
        if (cancelled) return;
        setClasses(classData ?? []);
        setVehicles((vehicleData ?? []) as Vehicule[]);
        // Pré-sélection raisonnable
        if (classData && classData.length > 0 && classData[0].idClassVoyage) {
          setValue("classVoyageId", classData[0].idClassVoyage);
        }
        if (vehicleData && vehicleData.length > 0) {
          const firstVeh = vehicleData[0];
          // VehiculeDTO peut exposer idVehicule (camelCase) ou id selon contexte
          const vehId =
            (firstVeh as Vehicule & { idVehicule?: string; id?: string })
              .idVehicule ??
            (firstVeh as Vehicule & { idVehicule?: string; id?: string }).id ??
            "";
          if (vehId) setValue("vehiculeId", vehId);
        }
      })
      .catch((err) => {
        console.error("[AddTripModal] Erreur chargement ressources :", err);
        if (!cancelled)
          setResourcesError(
            "Impossible de charger les classes voyage ou les véhicules.",
          );
      })
      .finally(() => {
        if (!cancelled) setIsLoadingResources(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen, agencyId, setValue]);

  const onSubmit = async (data: FormType) => {
    // Catégorie déduite du nom de la classe sélectionnée (lecture-seule)
    const selectedClass = classes.find(
      (c) => c.idClassVoyage === data.classVoyageId,
    );
    const category = selectedClass?.nom || "Classic";

    const dataToSave: Omit<PlannerTrip, "id"> = {
      agencyId,
      title: data.title,
      dayOfWeek: Number(data.dayOfWeek),
      startTime: data.startTime,
      endTime: data.endTime,
      category,
      // Champs Bloc 4
      lieuDepart: data.lieuDepart,
      lieuArrive: data.lieuArrive,
      classVoyageId: data.classVoyageId,
      vehiculeId: data.vehiculeId,
      nbrPlaces: data.nbrPlaces ?? 50,
    };

    try {
      setIsSubmitting(true);
      await onSave(dataToSave);
      reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-6">
          Ajouter un nouveau voyage au planning
        </h2>

        {resourcesError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {resourcesError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Titre */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Titre du voyage
            </label>
            <input
              {...register("title")}
              id="title"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Ex: Yaoundé → Douala (matin)"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Jour + classe */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="dayOfWeek"
                className="block text-sm font-medium text-gray-700"
              >
                Jour
              </label>
              <select
                {...register("dayOfWeek")}
                id="dayOfWeek"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="1">Lundi</option>
                <option value="2">Mardi</option>
                <option value="3">Mercredi</option>
                <option value="4">Jeudi</option>
                <option value="5">Vendredi</option>
                <option value="6">Samedi</option>
                <option value="7">Dimanche</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="classVoyageId"
                className="block text-sm font-medium text-gray-700"
              >
                Classe
              </label>
              <select
                {...register("classVoyageId")}
                id="classVoyageId"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                disabled={isLoadingResources || classes.length === 0}
              >
                <option value="">-- Choisir --</option>
                {classes.map((c) => (
                  <option key={c.idClassVoyage} value={c.idClassVoyage}>
                    {c.nom}
                    {typeof c.prix === "number" ? ` (${c.prix} FCFA)` : ""}
                  </option>
                ))}
              </select>
              {errors.classVoyageId && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.classVoyageId.message}
                </p>
              )}
            </div>
          </div>

          {/* Heures */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="startTime"
                className="block text-sm font-medium text-gray-700"
              >
                Heure de début
              </label>
              <input
                type="time"
                {...register("startTime")}
                id="startTime"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.startTime && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.startTime.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="endTime"
                className="block text-sm font-medium text-gray-700"
              >
                Heure de fin
              </label>
              <input
                type="time"
                {...register("endTime")}
                id="endTime"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.endTime && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.endTime.message}
                </p>
              )}
            </div>
          </div>

          {/* Lieux */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="lieuDepart"
                className="block text-sm font-medium text-gray-700"
              >
                Lieu de départ
              </label>
              <input
                {...register("lieuDepart")}
                id="lieuDepart"
                placeholder="Ex: Yaoundé"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.lieuDepart && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.lieuDepart.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="lieuArrive"
                className="block text-sm font-medium text-gray-700"
              >
                Lieu d&apos;arrivée
              </label>
              <input
                {...register("lieuArrive")}
                id="lieuArrive"
                placeholder="Ex: Douala"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.lieuArrive && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.lieuArrive.message}
                </p>
              )}
            </div>
          </div>

          {/* Véhicule + places */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="vehiculeId"
                className="block text-sm font-medium text-gray-700"
              >
                Véhicule
              </label>
              <select
                {...register("vehiculeId")}
                id="vehiculeId"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                disabled={isLoadingResources || vehicles.length === 0}
              >
                <option value="">-- Choisir --</option>
                {vehicles.map((v) => {
                  const vid =
                    (v as Vehicule & { idVehicule?: string; id?: string })
                      .idVehicule ??
                    (v as Vehicule & { idVehicule?: string; id?: string }).id ??
                    "";
                  return (
                    <option key={vid} value={vid}>
                      {v.nom || v.modele || vid}
                      {v.plaqueMatricule ? ` — ${v.plaqueMatricule}` : ""}
                    </option>
                  );
                })}
              </select>
              {errors.vehiculeId && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.vehiculeId.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="nbrPlaces"
                className="block text-sm font-medium text-gray-700"
              >
                Nombre de places
              </label>
              <input
                type="number"
                min={1}
                {...register("nbrPlaces")}
                id="nbrPlaces"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300"
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isLoadingResources}
              className="py-2 px-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sauvegarde…" : "Sauvegarder"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
// END OF FILE: src/modals/AddTripModal.tsx
