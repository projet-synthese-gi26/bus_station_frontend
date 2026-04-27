"use client";
/**
 * PaymentMethodsSection.tsx  (nouveau — P-05)
 *
 * Section "Moyens de paiement" affichée sur la page publique d'une agence.
 * Affiche chaque MoyenPaiement actif avec logo, code marchand, numéro de dépôt,
 * et un bouton "Copier" pour chaque information.
 */

import { useState } from "react";
import { Copy, Check, CreditCard } from "lucide-react";
import type { MoyenPaiement, TypePaiement } from "@/lib/types/agence.types";

interface PaymentMethodsSectionProps {
  moyensPaiement?: MoyenPaiement[];
}

// ── Couleurs et logos par opérateur ──────────────────────────────────────────
const OPERATOR_STYLE: Record<
  TypePaiement,
  { bg: string; text: string; label: string }
> = {
  ORANGE_MONEY: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    label: "Orange Money",
  },
  MTN_MOMO: { bg: "bg-yellow-100", text: "text-yellow-700", label: "MTN MoMo" },
  EXPRESS_UNION: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    label: "Express Union",
  },
  YUP: { bg: "bg-teal-100", text: "text-teal-700", label: "YUP" },
  VIREMENT_BANCAIRE: {
    bg: "bg-gray-100",
    text: "text-gray-700",
    label: "Virement bancaire",
  },
  CASH: { bg: "bg-green-100", text: "text-green-700", label: "Espèces" },
  AUTRE: { bg: "bg-purple-100", text: "text-purple-700", label: "Autre" },
};

// ── Bouton copier ─────────────────────────────────────────────────────────────
function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback silencieux
    }
  };

  return (
    <button
      onClick={handleCopy}
      title={`Copier ${label}`}
      className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary transition px-2 py-1 rounded-lg hover:bg-gray-100"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-green-500" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
      {copied ? "Copié !" : "Copier"}
    </button>
  );
}

// ── Composant principal ───────────────────────────────────────────────────────
export default function PaymentMethodsSection({
  moyensPaiement,
}: PaymentMethodsSectionProps) {
  const actifs = (moyensPaiement ?? []).filter((m) => m.actif);

  if (actifs.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <CreditCard className="w-4 h-4 text-primary" />
        <h2 className="font-semibold text-gray-800 text-sm">
          Moyens de paiement acceptés
        </h2>
      </div>

      <div className="space-y-3">
        {actifs.map((moyen) => {
          const style = OPERATOR_STYLE[moyen.type] ?? OPERATOR_STYLE.AUTRE;

          return (
            <div
              key={moyen.id}
              className="border border-gray-100 rounded-xl p-4 space-y-2"
            >
              {/* Badge opérateur */}
              <span
                className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${style.bg} ${style.text}`}
              >
                {moyen.nomOperateur || style.label}
              </span>

              {/* Infos copiables */}
              <div className="space-y-1.5">
                {moyen.codeMarchand && (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                        Code marchand
                      </p>
                      <p className="text-sm font-mono font-medium text-gray-800">
                        {moyen.codeMarchand}
                      </p>
                    </div>
                    <CopyButton
                      value={moyen.codeMarchand}
                      label="le code marchand"
                    />
                  </div>
                )}

                {moyen.numeroDépot && (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                        Numéro de dépôt
                      </p>
                      <p className="text-sm font-mono font-medium text-gray-800">
                        {moyen.numeroDépot}
                      </p>
                    </div>
                    <CopyButton value={moyen.numeroDépot} label="le numéro" />
                  </div>
                )}

                {moyen.nomCompte && (
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                      Nom du compte
                    </p>
                    <p className="text-xs text-gray-600">{moyen.nomCompte}</p>
                  </div>
                )}

                {/* Cash : pas de code à copier, juste un message */}
                {moyen.type === "CASH" &&
                  !moyen.codeMarchand &&
                  !moyen.numeroDépot && (
                    <p className="text-xs text-gray-500">
                      Paiement en espèces accepté directement en agence.
                    </p>
                  )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
