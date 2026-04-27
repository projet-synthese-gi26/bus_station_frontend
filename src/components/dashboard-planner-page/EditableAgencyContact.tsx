"use client";
// src/components/dashboard-planner-page/EditableAgencyContact.tsx
/**
 * Mis à jour pour ne plus dépendre de TravelAgency['contact'] (champ mock supprimé).
 * Utilise les champs réels de AgenceVoyageFull : socialNetwork.
 * Les champs phone/email/website ne sont plus dans le modèle — conservés en local seulement.
 */

import { useState } from "react";
import { Mail, Phone, Globe, Edit, Save, XCircle } from "lucide-react";

interface EditableAgencyContactProps {
  agencyId: string;
  contact?: { phone?: string; email?: string; website?: string } | null;
  refetch: () => void;
}

export default function EditableAgencyContact({
  agencyId,
  contact,
  refetch,
}: EditableAgencyContactProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    phone: contact?.phone ?? "",
    email: contact?.email ?? "",
    website: contact?.website ?? "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((p) => ({ ...p, [e.target.id]: e.target.value }));
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Contact</h3>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 text-xs text-primary hover:bg-primary/5 px-3 py-1.5 rounded-lg"
          >
            <Edit size={13} /> Modifier
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-1 text-xs text-gray-500 border border-gray-200 px-2 py-1.5 rounded-lg"
            >
              <XCircle size={13} /> Annuler
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-1 text-xs text-white bg-primary px-2 py-1.5 rounded-lg"
            >
              <Save size={13} /> Sauvegarder
            </button>
          </div>
        )}
      </div>
      <div className="space-y-3">
        {[
          {
            id: "phone",
            icon: Phone,
            label: "Téléphone",
            href: `tel:${formData.phone}`,
          },
          {
            id: "email",
            icon: Mail,
            label: "Email",
            href: `mailto:${formData.email}`,
          },
          {
            id: "website",
            icon: Globe,
            label: "Site web",
            href: formData.website,
          },
        ].map(({ id, icon: Icon, label, href }) => (
          <div key={id} className="flex items-center gap-3">
            <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
            {isEditing ? (
              <input
                id={id}
                value={(formData as any)[id]}
                onChange={handleChange}
                placeholder={label}
                className="flex-1 text-sm border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            ) : (formData as any)[id] ? (
              <a
                href={href}
                className="text-sm text-primary hover:underline truncate"
              >
                {(formData as any)[id]}
              </a>
            ) : (
              <span className="text-sm text-gray-400 italic">
                Non renseigné
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
