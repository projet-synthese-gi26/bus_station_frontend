"use client";
/**
 * app/(bus-station-manager-views)/bsm-dashboard/page.tsx  (recâblé — P-24)
 *
 * Remplace l'ancienne version qui utilisait useBusStationDashboard("gare-001")
 * hardcodé. Utilise maintenant useBsm() → BsmContext → useBsmDashboard()
 * qui résout le gareId dynamiquement depuis le compte BSM connecté.
 */

import {
  Building2,
  Users,
  Bus,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  AlertCircle,
  MapPin,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import Loader from "@/modals/Loader";
import { useBsm } from "@/lib/contexts/BsmContext";

// ── Composant KPI Card ────────────────────────────────────────────────────────

function KpiCard({
  label,
  value,
  icon: Icon,
  color,
  sub,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  sub?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-start gap-4">
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-slate-800 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

// ── Composant badge statut agence ─────────────────────────────────────────────

function StatutBadge({ statut }: { statut: string }) {
  if (statut === "ACTIVE")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
        <CheckCircle2 className="w-3 h-3" /> Active
      </span>
    );
  if (statut === "SUSPENDUE")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
        <XCircle className="w-3 h-3" /> Suspendue
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-slate-50 text-slate-500 border border-slate-200">
      {statut}
    </span>
  );
}

// ── Page principale ───────────────────────────────────────────────────────────

export default function BsmDashboardPage() {
  const { gare, agences, kpis, statistiques, isLoading, error, refetch } =
    useBsm();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-600 bg-red-50 rounded-xl border border-red-200">
        <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-lg font-semibold">Erreur de chargement</h3>
        <p className="mt-1 text-sm">{error}</p>
        <button
          onClick={refetch}
          className="mt-4 px-6 py-3 bg-red-600 text-white rounded-xl flex items-center gap-2 mx-auto hover:bg-red-700 transition-all"
        >
          <RefreshCw className="h-4 w-4" /> Réessayer
        </button>
      </div>
    );
  }

  const tauxPct = statistiques
    ? Math.round(statistiques.tauxRemplissageMoyen * 100)
    : 0;

  return (
    <div className="space-y-8">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          {gare ? gare.nom : "Dashboard BSM"}
        </h1>
        {gare && (
          <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {gare.ville}
            {gare.adresse ? ` — ${gare.adresse}` : ""}
            <span
              className={`ml-2 inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${
                gare.estOuvert
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-slate-50 text-slate-500 border-slate-200"
              }`}
            >
              {gare.estOuvert ? "Ouvert" : "Fermé"}
            </span>
          </p>
        )}
      </div>

      {/* ── KPI Cards ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Agences actives"
          value={kpis.nbAgencesActives}
          icon={Users}
          color="bg-blue-500"
          sub={`${kpis.nbAgencesSuspendues} suspendue(s)`}
        />
        <KpiCard
          label="Voyages aujourd'hui"
          value={kpis.nbVoyagesAujourdhui}
          icon={Bus}
          color="bg-indigo-500"
          sub={`${kpis.nbVoyagesAVenir} à venir`}
        />
        <KpiCard
          label="Taxes en retard"
          value={kpis.taxesEnRetard}
          icon={AlertTriangle}
          color={kpis.taxesEnRetard > 0 ? "bg-amber-500" : "bg-slate-400"}
          sub={kpis.taxesEnRetard > 0 ? "Action requise" : "Tout est à jour"}
        />
        <KpiCard
          label="Taux de remplissage"
          value={`${tauxPct} %`}
          icon={TrendingUp}
          color="bg-emerald-500"
          sub="Moyenne sur voyages publiés"
        />
      </div>

      {/* ── Ligne 2 : Infos gare + Agences récentes ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Carte infos gare */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-400" />
              Informations de la gare
            </h2>
            <Link
              href="/bsm-dashboard/infrastructure"
              className="text-xs text-blue-600 hover:underline"
            >
              Modifier →
            </Link>
          </div>
          {gare ? (
            <dl className="space-y-2.5">
              {[
                ["Nom", gare.nom],
                ["Ville", gare.ville],
                ["Adresse", gare.adresse],
                ["Quartier", gare.quartier ?? "—"],
                ["Horaires", gare.horaires ?? "—"],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between text-sm">
                  <dt className="text-slate-400">{label}</dt>
                  <dd className="font-medium text-slate-700 text-right max-w-[60%] truncate">
                    {val}
                  </dd>
                </div>
              ))}
              {gare.services && gare.services.length > 0 && (
                <div className="pt-2">
                  <p className="text-xs text-slate-400 mb-2">Services</p>
                  <div className="flex flex-wrap gap-1.5">
                    {gare.services.slice(0, 6).map((s) => (
                      <span
                        key={s}
                        className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full"
                      >
                        {s}
                      </span>
                    ))}
                    {gare.services.length > 6 && (
                      <span className="text-xs text-slate-400">
                        +{gare.services.length - 6}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </dl>
          ) : (
            <p className="text-sm text-slate-400 text-center py-6">
              Données gare indisponibles
            </p>
          )}
        </div>

        {/* Liste courte agences affiliées */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-400" />
              Agences affiliées
              <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full">
                {agences.length}
              </span>
            </h2>
            <Link
              href="/bsm-dashboard/affiliated-agencies"
              className="text-xs text-blue-600 hover:underline"
            >
              Voir tout →
            </Link>
          </div>

          {agences.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">
              Aucune agence affiliée
            </p>
          ) : (
            <div className="space-y-2.5">
              {agences.slice(0, 5).map((agence) => (
                <div
                  key={agence.agencyId}
                  className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
                >
                  <div className="flex items-center gap-2.5">
                    {agence.logoUrl ? (
                      <img
                        src={agence.logoUrl}
                        alt={agence.shortName}
                        className="w-7 h-7 rounded-lg object-cover border border-slate-100"
                        onError={(e) =>
                          (e.currentTarget.style.display = "none")
                        }
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-400">
                        {agence.shortName?.[0] ?? "A"}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-slate-700 truncate max-w-35">
                        {agence.shortName ?? agence.longName}
                      </p>
                    </div>
                  </div>
                  <StatutBadge statut={agence.statutAgence ?? "ACTIVE"} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Ligne 3 : Stats rapides ──────────────────────────────────────── */}
      {statistiques && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-slate-400" />
            Activité de la gare
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                label: "Agences totales",
                value: statistiques.nbAgencesAffiliees,
                icon: Users,
              },
              {
                label: "Agences actives",
                value: statistiques.nbAgencesActives,
                icon: CheckCircle2,
              },
              {
                label: "Voyages ce jour",
                value: statistiques.nbVoyagesAujourdhui,
                icon: Clock,
              },
              {
                label: "Voyages à venir",
                value: statistiques.nbVoyagesAVenir,
                icon: Bus,
              },
            ].map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="text-center p-3 bg-slate-50 rounded-xl"
              >
                <Icon className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                <p className="text-xl font-bold text-slate-800">{value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Barre taux de remplissage */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-slate-500">Taux de remplissage moyen</span>
              <span className="font-semibold text-slate-700">{tauxPct} %</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  tauxPct >= 80
                    ? "bg-green-500"
                    : tauxPct >= 50
                      ? "bg-blue-500"
                      : "bg-amber-400"
                }`}
                style={{ width: `${Math.min(tauxPct, 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Navigation rapide ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            href: "/bsm-dashboard/infrastructure",
            icon: Building2,
            label: "Infrastructure",
            color: "text-blue-600 bg-blue-50",
          },
          {
            href: "/bsm-dashboard/affiliated-agencies",
            icon: Users,
            label: "Agences",
            color: "text-indigo-600 bg-indigo-50",
          },
          {
            href: "/bsm-dashboard/policies-taxes",
            icon: BarChart3,
            label: "Politiques & Taxes",
            color: "text-amber-600 bg-amber-50",
          },
          {
            href: "/bsm-dashboard/alertes",
            icon: AlertTriangle,
            label: "Alertes",
            color: "text-red-600 bg-red-50",
          },
        ].map(({ href, icon: Icon, label, color }) => (
          <Link
            key={href}
            href={href}
            className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col items-center gap-2 hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-slate-600 text-center">
              {label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
