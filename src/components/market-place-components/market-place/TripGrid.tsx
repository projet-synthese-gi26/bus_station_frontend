import { ArrowRight, Calendar, Clock, MapPin, Users, Wifi, Snowflake, Usb, Zap } from "lucide-react";
import React, { useState, useEffect } from "react";
import { formatDateOnly } from "@/lib/services/date-services";
import { Trip } from "@/lib/types/models/Trip";
import { useRouter } from "next/navigation";

function safeSrc(url: string | null | undefined): string {
  if (!url) return "/urban-bus-stop-public-transport-dubai-city.jpg";
  try { new URL(url); return url; } catch { return "/urban-bus-stop-public-transport-dubai-city.jpg"; }
}

function amenityIcon(a: string): React.ReactNode {
  switch (a.toLowerCase()) {
    case "wifi": return <Wifi className="h-3 w-3" />;
    case "ac": return <Snowflake className="h-3 w-3" />;
    case "usb": return <Usb className="h-3 w-3" />;
    default: return <Zap className="h-3 w-3" />;
  }
}

function classColor(c: string): string {
  switch (c.toLowerCase()) {
    case "vip": return "bg-amber-100 text-amber-700";
    case "premium": return "bg-purple-100 text-purple-700";
    case "standard": return "bg-blue-100 text-blue-700";
    default: return "bg-gray-100 text-gray-600";
  }
}

// ── Countdown Timer ───────────────────────────────────────────────────────────

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function buildDepartureDateTime(dateDepartPrev?: string, heureDepartEffectif?: string): string | null {
  if (!dateDepartPrev) return null;
  // dateDepartPrev can be an ISO string or just a date "YYYY-MM-DD"
  const dateOnly = dateDepartPrev.split("T")[0];
  if (heureDepartEffectif) {
    // heureDepartEffectif can be "HH:mm" or a full ISO
    const timeOnly = heureDepartEffectif.includes("T")
      ? heureDepartEffectif.split("T")[1].substring(0, 5)
      : heureDepartEffectif.substring(0, 5);
    return `${dateOnly}T${timeOnly}:00`;
  }
  return `${dateOnly}T00:00:00`;
}

function CountdownTimer({ departureDateTime }: { departureDateTime: string }) {
  const calc = (): TimeLeft | null => {
    const diff = +new Date(departureDateTime) - +new Date();
    if (diff <= 0) return null;
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(calc);

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [departureDateTime]);

  if (!timeLeft) return null;

  const pad = (n: number) => String(n).padStart(2, "0");

  const Unit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <span className="text-sm font-bold text-red-500 tabular-nums">{pad(value)}</span>
      <span className="text-[9px] text-red-400 uppercase tracking-wide">{label}</span>
    </div>
  );

  const Sep = () => <span className="text-red-400 font-bold text-sm pb-2">:</span>;

  // Only show "imminent" badge when departure is less than 2 hours away
  const totalMinutes = timeLeft.days * 1440 + timeLeft.hours * 60 + timeLeft.minutes;
  const isImminent = totalMinutes <= 120;

  return (
    <div className={`rounded-xl px-3 py-2 mb-3 ${isImminent ? "bg-red-50 border border-red-100" : "bg-orange-50 border border-orange-100"}`}>
      <p className={`text-[10px] font-semibold text-center mb-1 ${isImminent ? "text-red-600" : "text-orange-600"}`}>
        {isImminent ? "🔥 Départ imminent !" : "⏳ Départ dans :"}
      </p>
      <div className="flex items-end justify-center gap-1">
        {timeLeft.days > 0 && (
          <>
            <Unit value={timeLeft.days} label="j" />
            <Sep />
          </>
        )}
        <Unit value={timeLeft.hours} label="h" />
        <Sep />
        <Unit value={timeLeft.minutes} label="m" />
        <Sep />
        <Unit value={timeLeft.seconds} label="s" />
      </div>
    </div>
  );
}

// ── TripGrid ──────────────────────────────────────────────────────────────────

export interface TripGrid {
  filteredTrips: Partial<Trip>[];
  getClassColor: (classe: string) => string;
  getAmenityIcon: (amenity: string) => React.JSX.Element | null;
  navigate: (tripId: string) => void;
}

export default function TripGrid({ filteredTrips, navigate }: TripGrid) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {filteredTrips.map((trip) => {
        const now = new Date();
        const departure = trip.dateDepartPrev ? new Date(trip.dateDepartPrev) : null;
        const isPast = departure ? departure < now : false;
        const hoursLeft = departure
          ? (departure.getTime() - now.getTime()) / 3_600_000
          : Infinity;
        const canPayNow = hoursLeft > 0 && hoursLeft <= 2;
        const seatsLeft = trip.nbrPlaceRestante ?? 0;
        const seatsFull = seatsLeft === 0;

        // Build a reliable ISO datetime for the countdown
        const departureISO = buildDepartureDateTime(
          trip.dateDepartPrev,
          trip.heureDepartEffectif,
        );
        const showCountdown = !isPast && !seatsFull && !!departureISO;

        return (
          <div
            key={trip.idVoyage}
            onClick={() => !isPast && !seatsFull && navigate(trip.idVoyage || "")}
            className={`group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 ${
              !isPast && !seatsFull
                ? "cursor-pointer hover:shadow-lg hover:-translate-y-1"
                : "opacity-60"
            }`}
          >
            {/* Image */}
            <div className="relative h-40 overflow-hidden bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={safeSrc(trip.bigImage)}
                alt={`${trip.lieuDepart} → ${trip.lieuArrive}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => { e.currentTarget.src = "/urban-bus-stop-public-transport-dubai-city.jpg"; }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />

              {/* Badges top */}
              <div className="absolute top-3 left-3 flex gap-1.5">
                {trip.nomClasseVoyage && (
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${classColor(trip.nomClasseVoyage)}`}>
                    {trip.nomClasseVoyage}
                  </span>
                )}
                {isPast && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-900/60 text-white">
                    Expiré
                  </span>
                )}
                {seatsFull && !isPast && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-500 text-white">
                    Complet
                  </span>
                )}
              </div>

              {/* Prix */}
              <div className="absolute bottom-3 right-3">
                <span className="bg-white/95 text-blue-700 font-bold text-sm px-2.5 py-1 rounded-xl shadow">
                  {(trip.prix ?? 0).toLocaleString()} FCFA
                </span>
              </div>
            </div>

            {/* Contenu */}
            <div className="p-4">
              {/* Trajet */}
              <div className="flex items-center gap-1.5 mb-3">
                <MapPin className="h-3.5 w-3.5 text-red-400 shrink-0" />
                <span className="text-sm font-semibold text-gray-800 truncate">{trip.lieuDepart}</span>
                <ArrowRight className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                <span className="text-sm font-semibold text-gray-800 truncate">{trip.lieuArrive}</span>
              </div>

              {/* Agence */}
              <p className="text-xs text-gray-500 mb-3 truncate">{trip.nomAgence}</p>

              {/* Infos */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="flex flex-col items-center bg-gray-50 rounded-xl py-2 px-1 text-center">
                  <Calendar className="h-3.5 w-3.5 text-blue-500 mb-0.5" />
                  <span className="text-[10px] text-gray-500">Départ</span>
                  <span className="text-xs font-semibold text-gray-800 leading-tight">
                    {trip.dateDepartPrev ? formatDateOnly(trip.dateDepartPrev) : "—"}
                  </span>
                </div>
                <div className="flex flex-col items-center bg-gray-50 rounded-xl py-2 px-1 text-center">
                  <Clock className="h-3.5 w-3.5 text-purple-500 mb-0.5" />
                  <span className="text-[10px] text-gray-500">Durée</span>
                  <span className="text-xs font-semibold text-gray-800 leading-tight">
                    {trip.dureeVoyage ? String(trip.dureeVoyage) : "—"}
                  </span>
                </div>
                <div className="flex flex-col items-center bg-gray-50 rounded-xl py-2 px-1 text-center">
                  <Users className="h-3.5 w-3.5 text-green-500 mb-0.5" />
                  <span className="text-[10px] text-gray-500">Places</span>
                  <span className={`text-xs font-semibold leading-tight ${seatsLeft <= 3 && seatsLeft > 0 ? "text-orange-600" : "text-gray-800"}`}>
                    {seatsLeft}
                  </span>
                </div>
              </div>

              {/* Aménités */}
              {trip.amenities && trip.amenities.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {trip.amenities.slice(0, 4).map((a, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600"
                    >
                      {amenityIcon(a)}
                      {a}
                    </span>
                  ))}
                  {trip.amenities.length > 4 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                      +{trip.amenities.length - 4}
                    </span>
                  )}
                </div>
              )}

              {/* ── Countdown ── affiché uniquement pour les voyages à venir */}
              {showCountdown && (
                <CountdownTimer departureDateTime={departureISO!} />
              )}

              {/* Bouton */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (canPayNow) router.push(`/payment?tripId=${trip.idVoyage}`);
                  else if (!isPast && !seatsFull) navigate(trip.idVoyage || "");
                }}
                disabled={isPast || seatsFull}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isPast || seatsFull
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : canPayNow
                    ? "bg-green-600 hover:bg-green-700 text-white shadow-md"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                }`}
              >
                {isPast ? "Voyage expiré" : seatsFull ? "Complet" : canPayNow ? "Payer maintenant" : "Réserver"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}