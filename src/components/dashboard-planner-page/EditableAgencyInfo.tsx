"use client";
/**
 * EditableAgencyInfo.tsx  (reconstruit — P-21)
 *
 * Section "Informations publiques" de la page planning dashboard.
 * Retypé avec AgenceVoyageFull. Supprime les champs mock (specialties, contact).
 * Champs éditables : longName, shortName, description, location, socialNetwork, greetingMessage.
 */

import { useState, useEffect } from "react";
import { Edit, Save, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import type {
  AgenceVoyageFull,
  UpdateAgenceProfilDTO,
} from "@/lib/types/agence.types";

interface EditableAgencyInfoProps {
  agency: AgenceVoyageFull;
  onSave: (data: UpdateAgenceProfilDTO) => Promise<void>;
}

export default function EditableAgencyInfo({
  agency,
  onSave,
}: EditableAgencyInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateAgenceProfilDTO>({
    longName: agency.longName ?? "",
    shortName: agency.shortName ?? "",
    description: agency.description ?? "",
    location: agency.location ?? "",
    socialNetwork: agency.socialNetwork ?? "",
    greetingMessage: agency.greetingMessage ?? "",
    logoUrl: agency.logoUrl ?? "",
  });

  useEffect(() => {
    setFormData({
      longName: agency.longName ?? "",
      shortName: agency.shortName ?? "",
      description: agency.description ?? "",
      location: agency.location ?? "",
      socialNetwork: agency.socialNetwork ?? "",
      greetingMessage: agency.greetingMessage ?? "",
      logoUrl: agency.logoUrl ?? "",
    });
  }, [agency]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));

  const handleSave = async () => {
    try {
      await onSave(formData);
      setIsEditing(false);
    } catch {
      // toast géré dans le hook
    }
  };

  const field = (
    id: keyof UpdateAgenceProfilDTO,
    label: string,
    textarea = false,
  ) => (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
        {label}
      </label>
      {isEditing ? (
        textarea ? (
          <textarea
            id={id}
            value={formData[id] as string}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />
        ) : (
          <input
            id={id}
            value={formData[id] as string}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        )
      ) : (
        <p className="text-sm text-gray-700">
          {(formData[id] as string) || (
            <span className="text-gray-400 italic">Non renseigné</span>
          )}
        </p>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Informations publiques</h3>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 text-xs text-primary hover:bg-primary/5 px-3 py-1.5 rounded-lg transition"
          >
            <Edit size={13} /> Modifier
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  longName: agency.longName ?? "",
                  shortName: agency.shortName ?? "",
                  description: agency.description ?? "",
                  location: agency.location ?? "",
                  socialNetwork: agency.socialNetwork ?? "",
                  greetingMessage: agency.greetingMessage ?? "",
                  logoUrl: agency.logoUrl ?? "",
                });
              }}
              className="flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition"
            >
              <XCircle size={13} /> Annuler
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 text-xs text-white bg-primary px-3 py-1.5 rounded-lg hover:bg-primary/90 transition"
            >
              <Save size={13} /> Sauvegarder
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {field("longName", "Nom complet")}
        {field("shortName", "Nom court")}
        {field("location", "Localisation")}
        {field("socialNetwork", "Réseau social")}
        {field("logoUrl", "URL du logo")}
        {field("greetingMessage", "Message d'accueil", true)}
        <div className="sm:col-span-2">
          {field("description", "Description", true)}
        </div>
      </div>
    </div>
  );
}
