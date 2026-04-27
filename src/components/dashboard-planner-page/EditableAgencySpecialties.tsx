"use client";
// src/components/dashboard-planner-page/EditableAgencySpecialties.tsx
/**
 * Mis à jour pour ne plus dépendre de TravelAgency['specialties'] (champ mock).
 * Accepte string[] | undefined directement.
 */

import { useState, useEffect } from "react";
import { Edit, Save, XCircle, PlusCircle, X } from "lucide-react";

interface EditableAgencySpecialtiesProps {
  agencyId: string;
  specialties?: string[] | null;
  refetch: () => void;
}

export default function EditableAgencySpecialties({
  agencyId,
  specialties,
  refetch,
}: EditableAgencySpecialtiesProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [current, setCurrent] = useState<string[]>(specialties ?? []);
  const [newItem, setNewItem] = useState("");

  useEffect(() => {
    setCurrent(specialties ?? []);
  }, [specialties]);

  const handleRemove = (i: number) =>
    setCurrent((p) => p.filter((_, idx) => idx !== i));

  const handleAdd = () => {
    if (newItem.trim() && !current.includes(newItem.trim())) {
      setCurrent((p) => [...p, newItem.trim()]);
      setNewItem("");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Spécialités</h3>
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
              onClick={() => {
                setIsEditing(false);
                setCurrent(specialties ?? []);
              }}
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

      <div className="flex flex-wrap gap-2">
        {current.map((s, i) => (
          <span
            key={s}
            className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-primary rounded-full text-xs font-medium"
          >
            {s}
            {isEditing && (
              <button
                onClick={() => handleRemove(i)}
                className="ml-1 text-primary/60 hover:text-red-500"
              >
                <X size={11} />
              </button>
            )}
          </span>
        ))}
        {current.length === 0 && !isEditing && (
          <p className="text-sm text-gray-400 italic">Aucune spécialité.</p>
        )}
      </div>

      {isEditing && (
        <div className="flex gap-2 mt-3">
          <input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Nouvelle spécialité..."
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className="flex-1 text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button
            onClick={handleAdd}
            className="flex items-center gap-1 text-xs text-white bg-primary px-3 py-1.5 rounded-lg"
          >
            <PlusCircle size={13} /> Ajouter
          </button>
        </div>
      )}
    </div>
  );
}
