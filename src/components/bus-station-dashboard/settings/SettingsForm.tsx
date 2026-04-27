// src/components/bus-station-dashboard/settings/SettingsForm.tsx
import React, { useState, useEffect } from "react";
import { BusStationManagerAccount } from "@/lib/types/bus-station";
import { User, Mail, Phone, Briefcase } from "lucide-react";

interface SettingsFormProps {
  account: BusStationManagerAccount;
  onSave?: (updatedAccount: BusStationManagerAccount) => void;
}

const SettingsForm: React.FC<SettingsFormProps> = ({ account, onSave }) => {
  const [formData, setFormData] = useState<BusStationManagerAccount>(account);

  useEffect(() => {
    setFormData(account);
  }, [account]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
    }
    console.log("Données du compte manager mises à jour (simulation):", formData);
    alert("Données du compte sauvegardées ! (Simulation)");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Paramètres du Compte Manager
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nom */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Nom Complet
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Téléphone */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Téléphone
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Rôle */}
        <div>
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700"
          >
            Rôle
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Briefcase
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <input
              type="text"
              name="role"
              id="role"
              value={formData.role}
              onChange={handleChange}
              readOnly // Le rôle est probablement non modifiable par l'utilisateur
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Dernière Connexion */}
        <div>
          <label
            htmlFor="lastLogin"
            className="block text-sm font-medium text-gray-700"
          >
            Dernière Connexion
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="text"
              name="lastLogin"
              id="lastLogin"
              value={formData.lastLogin ? new Date(formData.lastLogin).toLocaleString() : ""}
              readOnly
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-10 sm:text-sm border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
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

export default SettingsForm;
