"use client";

import { Suspense, useState } from "react";
import {
  MapPin, Calendar, Clock, Users, Truck, User, Layers,
  CheckCircle2, ChevronRight, ChevronLeft, AlertCircle,
  Loader2, Wifi, Wind, Zap, Coffee, Package, UtensilsCrossed,
  LayoutGrid, Save, Send, ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { Controller } from "react-hook-form";
import { useTripPlannerV2 } from "@/lib/hooks/dasboard/useTripPlannerV2";
import {
  AMENITIES_LIST,
  STEP_TITLES,
  type StepIndex,
} from "@/lib/types/schema/tripPlannerSchema";
import type {
  VehiculeOption,
  ChauffeurOption,
  ClassVoyageOption,
  GareOption,
} from "@/lib/services/voyage-form.service";

// ── Icônes amenities ──────────────────────────────────────────────────────────

const AMENITY_ICONS: Record<string, React.ElementType> = {
  Wifi, Wind, Zap, Coffee, Package, UtensilsCrossed, LayoutGrid,
};

function AmenityIcon({ icon }: { icon: string }) {
  const I = AMENITY_ICONS[icon] ?? Layers;
  return <I className="w-4 h-4" />;
}

// ── Stepper ───────────────────────────────────────────────────────────────────

function Stepper({
  current,
  total,
  onGoTo,
}: {
  current: StepIndex;
  total: number;
  onGoTo: (step: StepIndex) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEP_TITLES.map((title, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={i} className="flex items-center">
            <button
              type="button"
              onClick={() => done && onGoTo(i as StepIndex)}
              className={`flex flex-col items-center gap-1 group ${done ? "cursor-pointer" : "cursor-default"}`}
            >
              <div
                className={`
                  w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200
                  ${active ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110" : ""}
                  ${done ? "bg-green-500 text-white" : ""}
                  ${!active && !done ? "bg-slate-100 text-slate-400 border-2 border-slate-200" : ""}
                `}
              >
                {done ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
              </div>
              <span
                className={`text-xs font-medium hidden sm:block ${active ? "text-blue-600" : done ? "text-green-600" : "text-slate-400"}`}
              >
                {title}
              </span>
            </button>
            {i < total - 1 && (
              <div
                className={`w-12 sm:w-20 h-0.5 mx-1 mb-4 ${i < current ? "bg-green-400" : "bg-slate-200"} transition-colors duration-300`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Field / Input / Textarea / Select ─────────────────────────────────────────

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  );
}

function Input({
  error,
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  return (
    <input
      {...props}
      className={`w-full px-3 py-2.5 rounded-xl border text-sm transition-all outline-none
        ${error
          ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100"
          : "border-slate-200 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
        } ${className}`}
    />
  );
}

function Textarea({
  error,
  className = "",
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }) {
  return (
    <textarea
      {...props}
      className={`w-full px-3 py-2.5 rounded-xl border text-sm transition-all outline-none resize-none
        ${error
          ? "border-red-300 bg-red-50 focus:border-red-400"
          : "border-slate-200 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
        } ${className}`}
    />
  );
}

function Select({
  error,
  className = "",
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { error?: string }) {
  return (
    <select
      {...props}
      className={`w-full px-3 py-2.5 rounded-xl border text-sm transition-all outline-none bg-white
        ${error
          ? "border-red-300 bg-red-50 focus:border-red-400"
          : "border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
        } ${className}`}
    >
      {children}
    </select>
  );
}

// ── Étape 1 ───────────────────────────────────────────────────────────────────

function Step1({
  form,
  gares,
}: {
  form: ReturnType<typeof useTripPlannerV2>["form"];
  gares: ReturnType<typeof useTripPlannerV2>["gares"];
}) {
  const { register, formState: { errors } } = form;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Titre du voyage" required error={errors.titre?.message}>
          <Input {...register("titre")} placeholder="ex: Yaoundé → Douala Express" error={errors.titre?.message} />
        </Field>
        <Field label="Description" error={errors.description?.message}>
          <Input {...register("description")} placeholder="Description courte (optionnel)" />
        </Field>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Lieu de départ" required error={errors.lieuDepart?.message}>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
            <Input {...register("lieuDepart")} className="pl-9" placeholder="ex: Yaoundé" error={errors.lieuDepart?.message} />
          </div>
        </Field>
        <Field label="Lieu d'arrivée" required error={errors.lieuArrive?.message}>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400" />
            <Input {...register("lieuArrive")} className="pl-9" placeholder="ex: Douala" error={errors.lieuArrive?.message} />
          </div>
        </Field>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Point de départ (gare)">
          {gares.length > 0 ? (
            <Select {...register("pointDeDepart")}>
              <option value="">Sélectionner une gare...</option>
              {gares.map((g: GareOption) => (
                <option key={g.idGare} value={g.nom}>{g.nom}{g.ville ? ` — ${g.ville}` : ""}</option>
              ))}
            </Select>
          ) : (
            <Input {...register("pointDeDepart")} placeholder="ex: Gare de Mvan" />
          )}
        </Field>
        <Field label="Point d'arrivée (gare)">
          {gares.length > 0 ? (
            <Select {...register("pointArrivee")}>
              <option value="">Sélectionner une gare...</option>
              {gares.map((g: GareOption) => (
                <option key={g.idGare} value={g.nom}>{g.nom}{g.ville ? ` — ${g.ville}` : ""}</option>
              ))}
            </Select>
          ) : (
            <Input {...register("pointArrivee")} placeholder="ex: Gare de Bonabéri" />
          )}
        </Field>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Field label="Date de départ" required error={errors.dateDepartPrev?.message}>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input type="date" {...register("dateDepartPrev")} className="pl-9" error={errors.dateDepartPrev?.message} />
          </div>
        </Field>
        <Field label="Heure de départ" required error={errors.heureDepartEffectif?.message}>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input type="time" {...register("heureDepartEffectif")} className="pl-9" error={errors.heureDepartEffectif?.message} />
          </div>
        </Field>
        <Field label="Heure d'arrivée estimée">
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input type="time" {...register("heureArrive")} className="pl-9" />
          </div>
        </Field>
      </div>
      <Field label="Durée estimée">
        <Input {...register("dureeEstimee")} placeholder="ex: 4h30 ou PT4H30M" />
      </Field>
    </div>
  );
}

// ── Étape 2 ───────────────────────────────────────────────────────────────────

function Step2({ form }: { form: ReturnType<typeof useTripPlannerV2>["form"] }) {
  const { register, formState: { errors }, watch } = form;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Nombre de places réservables" required error={errors.nbrPlaceReservable?.message}>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input type="number" min={1} {...register("nbrPlaceReservable", { valueAsNumber: true })} className="pl-9" error={errors.nbrPlaceReservable?.message} />
          </div>
        </Field>
        <Field label="Prix (XAF)" required error={errors.prix?.message}>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">XAF</span>
            <Input type="number" min={0} step={500} {...register("prix", { valueAsNumber: true })} className="pl-12" error={errors.prix?.message} />
          </div>
        </Field>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Date limite de réservation">
          <Input type="date" {...register("dateLimiteReservation")} />
        </Field>
        <Field label="Date limite de confirmation">
          <Input type="date" {...register("dateLimiteConfirmation")} />
        </Field>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Image miniature (URL)">
          <Input {...register("smallImage")} placeholder="https://..." error={errors.smallImage?.message} />
          {watch("smallImage") && (
            <img src={watch("smallImage")} alt="Aperçu" className="mt-2 h-24 w-full object-cover rounded-lg border" onError={(e) => (e.currentTarget.style.display = "none")} />
          )}
        </Field>
        <Field label="Image principale (URL)">
          <Input {...register("bigImage")} placeholder="https://..." error={errors.bigImage?.message} />
          {watch("bigImage") && (
            <img src={watch("bigImage")} alt="Aperçu" className="mt-2 h-24 w-full object-cover rounded-lg border" onError={(e) => (e.currentTarget.style.display = "none")} />
          )}
        </Field>
      </div>
    </div>
  );
}

// ── Étape 3 ───────────────────────────────────────────────────────────────────

function Step3({
  form, vehicules, chauffeurs, classes, isLoadingResources,
}: {
  form: ReturnType<typeof useTripPlannerV2>["form"];
  vehicules: VehiculeOption[];
  chauffeurs: ChauffeurOption[];
  classes: ClassVoyageOption[];
  isLoadingResources: boolean;
}) {
  const { register, control, watch } = form;

  if (isLoadingResources) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
        <p className="text-sm">Chargement des ressources...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Ressources opérationnelles</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Field label="Véhicule">
            <div className="relative">
              <Truck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Select {...register("vehiculeId")} className="pl-9">
                <option value="">Aucun (brouillon)</option>
                {vehicules.map((v) => (
                  <option key={v.idVehicule} value={v.idVehicule}>{v.nom} — {v.nbrPlaces} places</option>
                ))}
              </Select>
            </div>
            {vehicules.length === 0 && (
              <p className="text-xs text-amber-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Aucun véhicule trouvé</p>
            )}
          </Field>
          <Field label="Chauffeur">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Select {...register("chauffeurId")} className="pl-9">
                <option value="">Aucun (brouillon)</option>
                {chauffeurs.map((c) => (
                  <option key={c.id} value={c.id}>{c.fullName}</option>
                ))}
              </Select>
            </div>
          </Field>
          <Field label="Classe de voyage">
            <div className="relative">
              <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Select {...register("classVoyageId")} className="pl-9">
                <option value="">Sélectionner...</option>
                {classes.map((c) => (
                  <option key={c.idClassVoyage} value={c.idClassVoyage}>{c.nom} — {c.prix.toLocaleString()} XAF</option>
                ))}
              </Select>
            </div>
          </Field>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Services à bord</h3>
        <Controller
          control={control}
          name="amenities"
          render={({ field }) => (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {AMENITIES_LIST.map((a) => {
                const active = (field.value ?? []).includes(a.value);
                return (
                  <button
                    key={a.value}
                    type="button"
                    onClick={() => {
                      const current = field.value ?? [];
                      field.onChange(active ? current.filter((v: string) => v !== a.value) : [...current, a.value]);
                    }}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 text-xs font-medium transition-all duration-150 cursor-pointer select-none
                      ${active ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"}`}
                  >
                    <AmenityIcon icon={a.icon} />
                    {a.label}
                  </button>
                );
              })}
            </div>
          )}
        />
      </div>
    </div>
  );
}

// ── Étape 4 ───────────────────────────────────────────────────────────────────

function Step4({
  form, vehicules, chauffeurs, classes, mode, brouillonStatut,
}: {
  form: ReturnType<typeof useTripPlannerV2>["form"];
  vehicules: VehiculeOption[];
  chauffeurs: ChauffeurOption[];
  classes: ClassVoyageOption[];
  mode: string;
  brouillonStatut: string | null;
}) {
  const values = form.getValues();
  const vehicule = vehicules.find((v) => v.idVehicule === values.vehiculeId);
  const chauffeur = chauffeurs.find((c) => c.id === values.chauffeurId);
  const classe = classes.find((c) => c.idClassVoyage === values.classVoyageId);

  const row = (label: string, value: string | number | undefined) =>
    value ? (
      <div className="flex justify-between py-2 border-b border-slate-100 last:border-0 text-sm">
        <span className="text-slate-500">{label}</span>
        <span className="font-medium text-slate-800 text-right max-w-[60%]">{value}</span>
      </div>
    ) : null;

  const missingResources = [];
  if (!values.vehiculeId) missingResources.push("Véhicule");
  if (!values.classVoyageId) missingResources.push("Classe");
  if (!values.nbrPlaceReservable) missingResources.push("Places");

  return (
    <div className="space-y-5">
      {missingResources.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-700">Ressources manquantes</p>
            <p className="text-xs text-amber-600 mt-1">
              Ce voyage sera sauvegardé comme brouillon <strong>INCOMPLET</strong> : {missingResources.join(", ")} non renseigné(s).
            </p>
          </div>
        </div>
      )}
      {mode === "draft" && brouillonStatut === "PRET" && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
          <p className="text-sm text-green-700 font-medium">Brouillon <strong>PRÊT</strong> — vous pouvez le publier directement.</p>
        </div>
      )}
      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
        <div className="bg-slate-50 px-4 py-3"><p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Itinéraire</p></div>
        <div className="px-4 py-2">
          {row("Titre", values.titre)}
          {row("Trajet", `${values.lieuDepart} → ${values.lieuArrive}`)}
          {row("Date", values.dateDepartPrev)}
          {row("Départ", values.heureDepartEffectif)}
          {row("Arrivée", values.heureArrive)}
          {row("Durée", values.dureeEstimee)}
        </div>
        <div className="bg-slate-50 px-4 py-3"><p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Planning</p></div>
        <div className="px-4 py-2">
          {row("Places", values.nbrPlaceReservable)}
          {row("Prix", values.prix ? `${values.prix.toLocaleString()} XAF` : undefined)}
          {row("Limite réservation", values.dateLimiteReservation)}
          {row("Limite confirmation", values.dateLimiteConfirmation)}
        </div>
        <div className="bg-slate-50 px-4 py-3"><p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ressources</p></div>
        <div className="px-4 py-2">
          {row("Véhicule", vehicule ? `${vehicule.nom} (${vehicule.plaqueMatricule})` : "Non assigné")}
          {row("Chauffeur", chauffeur?.fullName ?? "Non assigné")}
          {row("Classe", classe?.nom ?? "Non assignée")}
        </div>
        {values.amenities && values.amenities.length > 0 && (
          <>
            <div className="bg-slate-50 px-4 py-3"><p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Services à bord</p></div>
            <div className="px-4 py-3">
              <div className="flex flex-wrap gap-2">
                {values.amenities.map((a: string) => {
                  const amenity = AMENITIES_LIST.find((al) => al.value === a);
                  return (
                    <span key={a} className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
                      {amenity && <AmenityIcon icon={amenity.icon} />}
                      {amenity?.label ?? a}
                    </span>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Page principale ───────────────────────────────────────────────────────────

function TripPlanningContent() {
  const planner = useTripPlannerV2();

  // ── État local : quelle action est en cours ───────────────────────────────
  const [activeAction, setActiveAction] = useState<"draft" | "publish" | null>(null);

  const {
    form, currentStep, totalSteps, isLastStep,
    goNext, goBack, goToStep,
    mode, isLoadingResources, isLoadingPrefill, isSubmitting,
    globalError, successMessage,
    vehicules, chauffeurs, classes, gares,
    brouillonStatut, canPublish, pageTitle, pageSubtitle,
    saveDraft, createAndPublish,
  } = planner;

  // ── Handlers isolés — chaque bouton a son propre état visuel ─────────────
  const handleSaveDraft = async () => {
    setActiveAction("draft");
    try {
      await saveDraft();
    } finally {
      setActiveAction(null);
    }
  };

  const handlePublish = async () => {
    setActiveAction("publish");
    try {
      await createAndPublish();
    } finally {
      setActiveAction(null);
    }
  };

  const isLoading = isLoadingPrefill;
  const isBusy = isSubmitting || activeAction !== null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Header ── */}
      <div className="bg-linear-to-r from-blue-700 to-indigo-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <Link href="/dashboard/drafts" className="inline-flex items-center gap-2 text-blue-200 hover:text-white text-sm mb-5 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Retour aux brouillons
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold">{pageTitle}</h1>
          <p className="text-blue-200 text-sm mt-2">{pageSubtitle}</p>
        </div>
      </div>

      {/* ── Contenu ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{successMessage}</p>
          </div>
        )}
        {globalError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{globalError}</p>
          </div>
        )}

        <Stepper current={currentStep} total={totalSteps} onGoTo={goToStep} />

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Titre étape */}
          <div className="px-6 pt-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                {currentStep + 1}
              </div>
              <h2 className="text-lg font-semibold text-slate-800">
                {["Itinéraire", "Planning & Limites", "Ressources", "Récapitulatif"][currentStep]}
              </h2>
            </div>
          </div>

          {/* Corps */}
          <div className="px-6 py-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                <p className="text-sm">Chargement...</p>
              </div>
            ) : (
              <>
                {currentStep === 0 && <Step1 form={form} gares={gares} />}
                {currentStep === 1 && <Step2 form={form} />}
                {currentStep === 2 && (
                  <Step3 form={form} vehicules={vehicules} chauffeurs={chauffeurs} classes={classes} isLoadingResources={isLoadingResources} />
                )}
                {currentStep === 3 && (
                  <Step4 form={form} vehicules={vehicules} chauffeurs={chauffeurs} classes={classes} mode={mode} brouillonStatut={brouillonStatut} />
                )}
              </>
            )}
          </div>

          {/* Footer navigation */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center gap-3">
            <button
              type="button"
              onClick={goBack}
              disabled={currentStep === 0 || isBusy}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              Précédent
            </button>

            <div className="flex items-center gap-3">
              {/* Sauvegarder brouillon — spinner uniquement si CETTE action est active */}
              {isLastStep && (
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={isBusy}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  {activeAction === "draft" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Sauvegarder brouillon
                </button>
              )}

              {!isLastStep ? (
                <button
                  type="button"
                  onClick={goNext}
                  disabled={isBusy}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  Suivant
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                /* Créer et publier — spinner uniquement si CETTE action est active */
                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={isBusy || !canPublish}
                  title={!canPublish ? "Le brouillon doit être PRÊT pour être publié" : undefined}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-green-600 text-white hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  {activeAction === "publish" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {mode === "edit" ? "Enregistrer" : "Créer et publier"}
                </button>
              )}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          Étape {currentStep + 1} sur {totalSteps}
        </p>
      </div>
    </div>
  );
}

export default function TripPlanningPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      }
    >
      <TripPlanningContent />
    </Suspense>
  );
}