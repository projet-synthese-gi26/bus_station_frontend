// src/modals/ConfirmActionModal.tsx
"use client";

import { useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

interface ConfirmActionModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>; // Make it async
  title: string;
  message: string;
}

export default function ConfirmActionModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}: ConfirmActionModalProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await onConfirm();
    } finally {
      // The parent component is responsible for closing the modal on success
      setIsConfirming(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-start gap-4 mb-4">
          <AlertCircle className="w-12 h-12 text-yellow-500 flex-shrink-0" />
          <div>
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <p className="text-gray-600 mt-1">{message}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isConfirming}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            disabled={isConfirming}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 disabled:bg-red-400 transition-all"
          >
            {isConfirming ? <Loader2 className="animate-spin" /> : "Confirmer"}
          </button>
        </div>
      </div>
    </div>
  );
}
