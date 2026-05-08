"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight, Calendar, Users } from "lucide-react";
import { getSimilairVoyages } from "@/lib/services/trip-service";
import type { VoyagePreviewDTO } from "@/lib/types/generated-api";

interface SimilarTripsProps {
  voyageId: string;
}

export default function SimilarTrips({ voyageId }: SimilarTripsProps) {
  const [trips, setTrips] = useState<VoyagePreviewDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSimilairVoyages(voyageId).then((data) => {
      setTrips(data.slice(0, 4));
      setLoading(false);
    });
  }, [voyageId]);

  if (loading || trips.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-2 pb-10 mt-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Voyages similaires</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {trips.map((trip) => (
          <Link
            key={trip.idVoyage}
            href={`/market-place/trip/${trip.idVoyage}`}
            className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            <div className="relative h-36 overflow-hidden">
              <Image
                src={trip.smallImage || trip.bigImage || "/placeholder.svg"}
                alt={`${trip.lieuDepart} → ${trip.lieuArrive}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
              <span className="absolute bottom-2 right-2 bg-white/90 text-primary font-bold text-xs px-2 py-1 rounded-lg">
                {(trip.prix ?? 0).toLocaleString()} FCFA
              </span>
            </div>

            <div className="p-3">
              <div className="flex items-center gap-1 text-sm text-gray-700 font-medium mb-2">
                <MapPin size={13} className="text-red-400 shrink-0" />
                <span className="truncate">{trip.lieuDepart}</span>
                <ArrowRight size={12} className="shrink-0 text-gray-400" />
                <span className="truncate">{trip.lieuArrive}</span>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar size={11} />
                  <span>
                    {trip.dateDepartPrev
                      ? new Date(trip.dateDepartPrev).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                        })
                      : "—"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={11} />
                  <span>{trip.nbrPlaceRestante ?? 0} places</span>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-1.5 truncate">{trip.nomAgence}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
