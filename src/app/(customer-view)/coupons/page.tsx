"use client";

import { JSX, useEffect, useState } from "react";
import {
  Calendar,
  Timer,
  Filter,
  Ticket,
  Download,
  Grid3X3,
  List,
  Wallet,
  Loader2,
} from "lucide-react";
import { useBusStation } from "@/context/Provider";
import {
  getCouponsByUserId,
  getSoldeIndemnisationByUserId,
} from "@/lib/services/coupon-service";
import type { Coupon, SoldeIndemnisation } from "@/lib/types/generated-api";

// ── Helpers ───────────────────────────────────────────────────────────────────

const generateQRCodeUrl = (id: string) => {
  const data = `COUPON:${id}`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(data)}&bgcolor=ffffff&color=1d4ed8`;
};

const statusLabel: Record<string, string> = {
  VALIDE: "Valide",
  EXPIRER: "Expiré",
  UTILISER: "Utilisé",
};

const statusClass: Record<string, string> = {
  VALIDE: "bg-green-100 text-green-700",
  EXPIRER: "bg-red-100 text-red-700",
  UTILISER: "bg-gray-100 text-gray-600",
};

const fmtDate = (d?: string) =>
  d ? new Date(d).toLocaleDateString("fr-FR", { dateStyle: "medium" }) : "—";

// ── Génération PDF (html2pdf chargé dynamiquement) ────────────────────────────

async function loadHtml2Pdf() {
  if (typeof window !== "undefined") {
    const w = window as unknown as Record<string, unknown>;
    if (!w.html2pdf) {
      await new Promise<void>((resolve, reject) => {
        const s = document.createElement("script");
        s.src =
          "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
        s.onload = () => resolve();
        s.onerror = reject;
        document.head.appendChild(s);
      });
    }
    return (w as Record<string, unknown>).html2pdf as (
      el: HTMLElement,
      opts: unknown
    ) => { save: () => Promise<void> };
  }
}

async function downloadCouponPdf(coupon: Coupon) {
  const html2pdf = await loadHtml2Pdf();
  if (!html2pdf) return;

  const el = document.createElement("div");
  el.innerHTML = `
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;border:3px solid #2563eb;border-radius:12px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#2563eb,#1d4ed8);color:white;padding:24px;text-align:center;">
        <div style="font-size:22px;font-weight:bold;">🎫 COUPON DE REMBOURSEMENT</div>
        <div style="font-size:14px;opacity:.85;margin-top:4px;">Annulation de voyage</div>
      </div>
      <div style="padding:24px;">
        <div style="text-align:center;margin-bottom:20px;">
          <div style="font-size:13px;color:#6b7280;">Montant</div>
          <div style="font-size:34px;font-weight:bold;color:#16a34a;">${(coupon.valeur ?? 0).toLocaleString()} FCFA</div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:13px;margin-bottom:20px;">
          <div><div style="color:#6b7280;">ID Coupon</div><div style="font-weight:600;">${coupon.idCoupon ?? "—"}</div></div>
          <div><div style="color:#6b7280;">Statut</div><div style="font-weight:600;">${statusLabel[coupon.statusCoupon ?? ""] ?? coupon.statusCoupon ?? "—"}</div></div>
          <div><div style="color:#6b7280;">Début</div><div style="font-weight:600;">${fmtDate(coupon.dateDebut)}</div></div>
          <div><div style="color:#6b7280;">Fin</div><div style="font-weight:600;">${fmtDate(coupon.dateFin)}</div></div>
        </div>
        <div style="text-align:center;padding-top:16px;border-top:2px dashed #e5e7eb;">
          <img src="${generateQRCodeUrl(coupon.idCoupon ?? "")}" width="120" height="120" alt="QR" />
          <div style="font-size:11px;color:#6b7280;margin-top:6px;">Scannez pour vérification</div>
        </div>
      </div>
    </div>`;

  await html2pdf(el, {
    margin: 0.5,
    filename: `coupon-${coupon.idCoupon}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
  }).save();
}

// ── Page principale ───────────────────────────────────────────────────────────

export default function Coupons(): JSX.Element {
  const { userData } = useBusStation();

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [soldes, setSoldes] = useState<SoldeIndemnisation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    const uid = userData?.userId;
    if (!uid) {
      setIsLoading(false);
      return;
    }
    Promise.all([getCouponsByUserId(uid), getSoldeIndemnisationByUserId(uid)])
      .then(([c, s]) => {
        setCoupons(c);
        setSoldes(s);
      })
      .finally(() => setIsLoading(false));
  }, [userData?.userId]);

  const totalSolde = soldes.reduce((sum, s) => sum + (s.solde ?? 0), 0);

  const filtered = coupons.filter(
    (c) => activeTab === "all" || c.statusCoupon === activeTab,
  );

  const filterBtn = (key: string, label: string) => (
    <button
      onClick={() => setActiveTab(key)}
      className={`cursor-pointer px-4 py-2 rounded-full font-semibold text-sm transition-all shadow-sm ${
        activeTab === key
          ? "bg-blue-600 text-white"
          : "bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300 hover:text-blue-600"
      }`}
    >
      {label}
    </button>
  );

  const handleDownload = async (c: Coupon) => {
    setDownloading(c.idCoupon ?? null);
    try {
      await downloadCouponPdf(c);
    } catch {
      alert("Erreur lors du téléchargement.");
    } finally {
      setDownloading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gray-100 rounded-xl shadow-sm p-6 border border-gray-200 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Mes Coupons</h1>
            <p className="text-gray-600">Gérez vos coupons de remboursement</p>
          </div>
          <div className="flex items-center gap-2 text-blue-600">
            <Ticket className="h-6 w-6" />
            <span className="text-lg font-semibold">{coupons.length} coupon{coupons.length !== 1 ? "s" : ""}</span>
          </div>
        </div>

        {/* Solde indemnisation */}
        {totalSolde > 0 && (
          <div className="bg-linear-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white flex items-center gap-5 shadow-lg">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <Wallet className="h-7 w-7" />
            </div>
            <div>
              <p className="text-emerald-100 text-sm font-medium">Solde d'indemnisation disponible</p>
              <p className="text-3xl font-bold">{totalSolde.toLocaleString()} FCFA</p>
              <p className="text-emerald-100 text-xs mt-0.5">{soldes.length} solde{soldes.length !== 1 ? "s" : ""} actif{soldes.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
        )}

        {/* Filtres + toggle vue */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-wrap gap-2">
            {filterBtn("all", "Tous")}
            {filterBtn("VALIDE", "Valides")}
            {filterBtn("EXPIRER", "Expirés")}
            {filterBtn("UTILISER", "Utilisés")}
            <button className="cursor-pointer px-4 py-2 rounded-full bg-white text-gray-600 border-2 border-gray-200 hover:bg-blue-50 text-sm flex items-center gap-2">
              <Filter className="h-4 w-4" /> Filtres
            </button>
          </div>
          <div className="flex items-center gap-1 bg-white rounded-lg p-1 border-2 border-gray-200">
            {(["grid", "list"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === m ? "bg-blue-600 text-white shadow" : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {m === "grid" ? <Grid3X3 className="h-4 w-4" /> : <List className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </div>

        {/* Liste vide */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Ticket className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-1">Aucun coupon trouvé</h3>
            <p className="text-gray-400 text-sm">Vous n&apos;avez pas encore de coupons dans cette catégorie.</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((c) => (
              <CouponCard
                key={c.idCoupon}
                coupon={c}
                downloading={downloading}
                onDownload={handleDownload}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((c) => (
              <CouponRow
                key={c.idCoupon}
                coupon={c}
                downloading={downloading}
                onDownload={handleDownload}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Carte coupon (vue grille) ─────────────────────────────────────────────────

function CouponCard({
  coupon,
  downloading,
  onDownload,
}: {
  coupon: Coupon;
  downloading: string | null;
  onDownload: (c: Coupon) => void;
}) {
  const status = coupon.statusCoupon ?? "VALIDE";
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="bg-linear-to-r from-blue-600 to-blue-700 p-5 text-white text-center relative">
        <span className={`absolute top-3 right-3 px-3 py-0.5 rounded-full text-xs font-bold ${statusClass[status] ?? "bg-gray-100 text-gray-600"}`}>
          {statusLabel[status] ?? status}
        </span>
        <Ticket className="h-8 w-8 mx-auto mb-1" />
        <p className="font-bold text-lg">Coupon de remboursement</p>
      </div>

      <div className="p-5 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500">ID</p>
            <p className="font-bold text-blue-800 text-sm truncate max-w-35">{coupon.idCoupon}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-600">{(coupon.valeur ?? 0).toLocaleString()}</p>
            <p className="text-xs text-green-600">FCFA</p>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar size={14} className="text-green-500 shrink-0" />
            <span>Début : {fmtDate(coupon.dateDebut)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Timer size={14} className="text-orange-500 shrink-0" />
            <span>Fin : {fmtDate(coupon.dateFin)}</span>
          </div>
        </div>

        <div className="text-center p-3 bg-gray-50 rounded-xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={generateQRCodeUrl(coupon.idCoupon ?? "")}
            alt="QR"
            className="w-16 h-16 mx-auto mb-1 border border-gray-200 rounded"
          />
          <p className="text-xs text-gray-400">Code de vérification</p>
        </div>

        {status === "VALIDE" && (
          <button
            onClick={() => onDownload(coupon)}
            disabled={downloading === coupon.idCoupon}
            className="cursor-pointer w-full flex items-center justify-center gap-2 bg-primary text-white rounded-xl py-2.5 font-semibold text-sm hover:bg-blue-700 transition disabled:opacity-50"
          >
            {downloading === coupon.idCoupon ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Télécharger PDF
          </button>
        )}
        {status !== "VALIDE" && (
          <div className={`text-center py-2 px-4 rounded-xl text-sm font-medium ${statusClass[status] ?? "bg-gray-100 text-gray-600"}`}>
            {statusLabel[status] ?? status}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Ligne coupon (vue liste) ──────────────────────────────────────────────────

function CouponRow({
  coupon,
  downloading,
  onDownload,
}: {
  coupon: Coupon;
  downloading: string | null;
  onDownload: (c: Coupon) => void;
}) {
  const status = coupon.statusCoupon ?? "VALIDE";
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 bg-linear-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shrink-0">
            <Ticket className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-bold text-gray-900 truncate max-w-xs">{coupon.idCoupon}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${statusClass[status] ?? "bg-gray-100 text-gray-600"}`}>
                {statusLabel[status] ?? status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-gray-500">
              <span>Début : {fmtDate(coupon.dateDebut)}</span>
              <span>Fin : {fmtDate(coupon.dateFin)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right">
            <p className="text-xl font-bold text-green-600">{(coupon.valeur ?? 0).toLocaleString()}</p>
            <p className="text-xs text-green-600">FCFA</p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={generateQRCodeUrl(coupon.idCoupon ?? "")}
            alt="QR"
            className="w-10 h-10 border border-gray-200 rounded"
          />
          {status === "VALIDE" && (
            <button
              onClick={() => onDownload(coupon)}
              disabled={downloading === coupon.idCoupon}
              className="cursor-pointer bg-primary text-white rounded-lg px-3 py-2 hover:bg-blue-700 transition disabled:opacity-50"
            >
              {downloading === coupon.idCoupon ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
