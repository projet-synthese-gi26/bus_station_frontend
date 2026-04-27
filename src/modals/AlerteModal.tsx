"use client";
/**
 * AlerteModal.tsx  (nouveau — P-26)
 *
 * Modale partagée pour :
 *   - Envoyer une alerte libre (ALERTE_GENERALE, AVERTISSEMENT)
 *   - Envoyer un rappel de taxe (TAX_REMINDER) avec message prédéfini
 */

import { useState, useEffect } from "react";
import { X, Send, AlertTriangle, CreditCard } from "lucide-react";
import type { TypeAlerte } from "@/lib/types/bsm.types";
import type { AgenceVoyageFull } from "@/lib/types/agence.types";
import type { TaxeAffiliation } from "@/lib/types/bsm.types";

interface AlerteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (message: string, type: TypeAlerte) => Promise<void>;
  agence: AgenceVoyageFull | null;
  type: "ALERTE" | "TAX_REMINDER";
  taxeEnRetard?: TaxeAffiliation | null; // pour pré-remplir le rappel taxe
}

export default function AlerteModal({
  isOpen,
  onClose,
  onSend,
  agence,
  type,
  taxeEnRetard,
}: AlerteModalProps) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (type === "TAX_REMINDER" && taxeEnRetard) {
      setMessage(
        `Bonjour,\n\nNous vous rappelons que votre taxe d'affiliation de ${taxeEnRetard.montant.toLocaleString("fr-FR")} FCFA pour la période ${taxeEnRetard.periode} est en retard de paiement (échéance : ${new Date(taxeEnRetard.dateEcheance).toLocaleDateString("fr-FR")}).\n\nMerci de régulariser votre situation dans les plus brefs délais afin d'éviter toute suspension de vos activités.\n\nCordialement,\nLe Bureau de la Gare`,
      );
    } else {
      setMessage("");
    }
  }, [isOpen, type, taxeEnRetard]);

  if (!isOpen || !agence) return null;

  const handleSend = async () => {
    if (!message.trim()) return;
    setIsSending(true);
    try {
      const alerteType: TypeAlerte =
        type === "TAX_REMINDER" ? "TAX_REMINDER" : "ALERTE_GENERALE";
      await onSend(message, alerteType);
      onClose();
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            {type === "TAX_REMINDER" ? (
              <CreditCard className="w-4 h-4 text-orange-500" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-primary" />
            )}
            <h2 className="font-bold text-gray-800">
              {type === "TAX_REMINDER"
                ? "Rappel de taxe"
                : "Envoyer une alerte"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        {/* Corps */}
        <div className="p-5 space-y-4">
          <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-700">
            Destinataire :{" "}
            <strong>{agence.longName ?? agence.shortName}</strong>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">
              {type === "TAX_REMINDER"
                ? "Message (pré-rempli, modifiable)"
                : "Message *"}
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={7}
              placeholder="Rédigez votre message..."
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-5 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
          >
            Annuler
          </button>
          <button
            onClick={handleSend}
            disabled={isSending || !message.trim()}
            className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-primary rounded-xl hover:bg-primary/90 disabled:opacity-60 transition"
          >
            <Send size={15} />
            {isSending ? "Envoi..." : "Envoyer"}
          </button>
        </div>
      </div>
    </div>
  );
}
