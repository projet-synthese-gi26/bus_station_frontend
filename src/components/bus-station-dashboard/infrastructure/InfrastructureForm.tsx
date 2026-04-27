// src/components/bus-station-dashboard/infrastructure/InfrastructureForm.tsx
import React, { useState, useEffect } from "react";
import { BusStation } from "@/lib/types/bus-station";
import { MapPin, Info, Clock, Bus, Globe } from "lucide-react";

interface InfrastructureFormProps {
  station: BusStation;
  onSave?: (updatedStation: BusStation) => void; // Pourrait être utilisé pour sauvegarder les changements
}

const InfrastructureForm: React.FC<InfrastructureFormProps> = ({
  station,
  onSave,
}) => {
  const [formData, setFormData] = useState<BusStation>(station);

  useEffect(() => {
    setFormData(station);
  }, [station]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
    ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    if (name === "estOuvert") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (name === "services") {
      // Pour une liste de services, cela nécessiterait une gestion plus complexe (checkboxes multiples)
      // Pour l'exemple, nous allons le traiter comme une chaîne de caractères simple
      setFormData((prev) => ({
        ...prev,
        [name]: value.split(",").map((s) => s.trim()),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleLocationChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    coord: "latitude" | "longitude"
  ) => {
    setFormData((prev) => ({
      ...prev,
      localisation: {
        ...((prev.adresse as any) ?? {}),
        [coord]: parseFloat(e.target.value),
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
    }
    // Logique de sauvegarde API ici
    console.log("Données de la gare mises à jour (simulation):", formData);
    alert("Données de la gare sauvegardées ! (Simulation)");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Gestion de l'Infrastructure
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nom de la gare */}
        <div>
          <label
            htmlFor="nom"
            className="block text-sm font-medium text-gray-700"
          >
            Nom de la Gare
          </label>
          <input
            type="text"
            name="nom"
            id="nom"
            value={formData.nom}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Adresse */}
        <div>
          <label
            htmlFor="adresse"
            className="block text-sm font-medium text-gray-700"
          >
            Adresse
          </label>
          <input
            type="text"
            name="adresse"
            id="adresse"
            value={formData.adresse}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Ville et Quartier */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="ville"
              className="block text-sm font-medium text-gray-700"
            >
              Ville
            </label>
            <input
              type="text"
              name="ville"
              id="ville"
              value={formData.ville}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="quartier"
              className="block text-sm font-medium text-gray-700"
            >
              Quartier
            </label>
            <input
              type="text"
              name="quartier"
              id="quartier"
              value={formData.quartier ?? ""}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            name="description"
            id="description"
            rows={3}
            value={formData.description ?? ""}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>

        {/* Image URL */}
        <div>
          <label
            htmlFor="imageUrl"
            className="block text-sm font-medium text-gray-700"
          >
            URL de l'image
          </label>
          <input
            type="text"
            name="imageUrl"
            id="imageUrl"
            value={formData.imageUrl ?? ""}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Services (simplifié pour cet exemple) */}
        <div>
          <label
            htmlFor="services"
            className="block text-sm font-medium text-gray-700"
          >
            Services (séparés par des virgules)
          </label>
          <input
            type="text"
            name="services"
            id="services"
            value={(formData.services ?? []).join(", ")}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Horaires */}
        <div>
          <label
            htmlFor="horaires"
            className="block text-sm font-medium text-gray-700"
          >
            Horaires
          </label>
          <input
            type="text"
            name="horaires"
            id="horaires"
            value={formData.horaires ?? ""}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Est Ouvert */}
        <div className="flex items-center">
          <input
            id="estOuvert"
            name="estOuvert"
            type="checkbox"
            checked={formData.estOuvert}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="estOuvert" className="ml-2 block text-sm text-gray-900">
            Ouvert actuellement
          </label>
        </div>

        {/* Coordonnées de localisation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="latitude"
              className="block text-sm font-medium text-gray-700"
            >
              Latitude
            </label>
            <input
              type="number"
              name="latitude"
              id="latitude"
              step="any"
              value={(formData as any).adresse?.latitude ?? 0}
              onChange={(e) => handleLocationChange(e, "latitude")}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="longitude"
              className="block text-sm font-medium text-gray-700"
            >
              Longitude
            </label>
            <input
              type="number"
              name="longitude"
              id="longitude"
              step="any"
              value={(formData as any).adresse?.longitude ?? 0}
              onChange={(e) => handleLocationChange(e, "longitude")}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Bouton de sauvegarde */}
        <div className="pt-5">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sauvegarder les modifications
          </button>
        </div>
      </form>
    </div>
  );
};

export default InfrastructureForm;
