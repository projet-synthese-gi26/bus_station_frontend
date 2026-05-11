"use client";

import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface GaresErrorProps {
  error: string;
  onRetry: () => void;
}

export default function GaresError({ error, onRetry }: GaresErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 ring-8 ring-red-50/50">
        <AlertCircle className="h-9 w-9 text-red-400" />
      </div>
      <h3 className="mb-2 text-xl font-bold text-slate-800">Une erreur est survenue</h3>
      <p className="mb-6 max-w-sm text-sm text-slate-500 leading-relaxed">{error}</p>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
      >
        <RefreshCw className="h-4 w-4" />
        Réessayer
      </button>
    </div>
  );
}