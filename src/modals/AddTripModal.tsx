"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X } from "lucide-react";
import type { CreateLigneServiceDTO, JourSemaine } from "@/lib/types/ligne-service.types";
import type { ClassVoyage } from "@/lib/types/generated-api";

interface AddTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateLigneServiceDTO) => Promise<void>;
  agencyId: string;
  classes?: ClassVoyage[];
}

const JOURS: { value: JourSemaine; label: string }[] = [
  { value: "LUNDI", label: "Lun" },
  { value: "MARDI", label: "Mar" },
  { value: "MERCREDI", label: "Mer" },
  { value: "JEUDI", label: "Jeu" },
  { value: "VENDREDI", label: "Ven" },
  { value: "SAMEDI", label: "Sam" },
  { value: "DIMANCHE", label: "Dim" },
];

const schema = z.object({
  lieuDepart: z.string().min(2, "Lieu de départ requis"),
  lieuArrive: z.string().min(2, "Lieu d'arrivée requis"),
  heureDepart: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format HH:MM invalide"),
  heureArrivee: z.string().optional().or(z.literal("")),
  joursOperation: z.array(z.string()).min(1, "Sélectionnez au moins un jour"),
  classVoyageId: z.string().min(1, "Sélectionnez une classe de voyage"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function AddTripModal({ isOpen, onClose, onSave, agencyId, classes = [] }: AddTripModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      lieuDepart: "",
      lieuArrive: "",
      heureDepart: "09:00",
      heureArrivee: "11:00",
      joursOperation: [],
      classVoyageId: "",
      description: "",
    },
  });

  const selectedJours = (watch("joursOperation") ?? []) as JourSemaine[];

  const toggleJour = (jour: JourSemaine) => {
    const next = selectedJours.includes(jour)
      ? selectedJours.filter((j) => j !== jour)
      : [...selectedJours, jour];
    setValue("joursOperation", next, { shouldValidate: true });
  };

  const onSubmit = async (data: FormValues) => {
    const payload: CreateLigneServiceDTO = {
      nom: `${data.lieuDepart} → ${data.lieuArrive}`,
      agenceVoyageId: agencyId,
      lieuDepart: data.lieuDepart,
      lieuArrive: data.lieuArrive,
      pointDeDepart: null,
      pointArrivee: null,
      heureDepart: data.heureDepart,
      heureArrivee: data.heureArrivee || null,
      joursOperation: data.joursOperation as JourSemaine[],
      classVoyageId: data.classVoyageId || null,
      vehiculeId: null,
      nomClasse: null,
      prix: null,
      dureeEstimee: null,
      actif: true,
      description: data.description || null,
    };
    await onSave(payload);
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-6">Ajouter un créneau au planning</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Trajet */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Lieu de départ</label>
              <input {...register("lieuDepart")} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Ex: Yaoundé" />
              {errors.lieuDepart && <p className="text-red-500 text-xs mt-1">{errors.lieuDepart.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Lieu d'arrivée</label>
              <input {...register("lieuArrive")} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Ex: Douala" />
              {errors.lieuArrive && <p className="text-red-500 text-xs mt-1">{errors.lieuArrive.message}</p>}
            </div>
          </div>

          {/* Jours */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jours d'opération</label>
            <div className="flex flex-wrap gap-2">
              {JOURS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => toggleJour(value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition ${
                    selectedJours.includes(value)
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-700 border-gray-300 hover:border-primary"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {errors.joursOperation && <p className="text-red-500 text-xs mt-1">{errors.joursOperation.message as string}</p>}
          </div>

          {/* Horaires */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Heure de départ</label>
              <input type="time" {...register("heureDepart")} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
              {errors.heureDepart && <p className="text-red-500 text-xs mt-1">{errors.heureDepart.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Heure d'arrivée</label>
              <input type="time" {...register("heureArrivee")} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
          </div>

          {/* Classe */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Classe de voyage *</label>
            <select {...register("classVoyageId")} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
              <option value="">-- Sélectionner --</option>
              {classes.map((c) => {
                const classId = (c as any).id ?? c.idClassVoyage ?? "";
                return (
                  <option key={classId || c.nom} value={classId}>
                    {c.nom}
                  </option>
                );
              })}
            </select>
            {errors.classVoyageId && <p className="text-red-500 text-xs mt-1">{errors.classVoyageId.message}</p>}
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">
              Annuler
            </button>
            <button type="submit" disabled={isSubmitting} className="py-2 px-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 shadow-md disabled:opacity-50">
              {isSubmitting ? "Sauvegarde..." : "Sauvegarder"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}