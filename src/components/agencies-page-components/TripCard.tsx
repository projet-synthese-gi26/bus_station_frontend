"use client";

import { Star, MapPin, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { TripCardProps } from "@/lib/types/ui";
import { formatDateOnly } from "@/lib/services/date-services"; // Utilitaire de date existant

export default function TripCard({ trip }: TripCardProps) {
  const { t } = useTranslation();

  // Sécurisation des données pour éviter les crashs
  const imageSrc = trip.bigImage || trip.smallImage || "/placeholder.svg";
  const prix = trip.prix || 0;
  const rating = 4.5; // Valeur par défaut car le modèle Trip n'a pas encore de rating

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <Image
          src={imageSrc} // CORRIGÉ: trip.image -> trip.bigImage
          alt={trip.titre} // CORRIGÉ: trip.title -> trip.titre
          width={400}
          height={300}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-xl font-bold text-white">{trip.titre}</h3>{" "}
          {/* CORRIGÉ */}
          <div className="flex items-center text-white/90">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{trip.lieuArrive}</span>{" "}
            {/* CORRIGÉ: trip.destination -> trip.lieuArrive */}
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
            <span className="text-sm font-medium">{rating}</span>
          </div>
          <div className="text-lg font-bold text-primary">
            {/* CORRIGÉ: trip.price -> prix (sécurisé) */}
            {prix.toLocaleString()} FCFA
          </div>
        </div>

        <div className="flex items-center text-gray-600 text-sm mb-4">
          <Calendar className="h-4 w-4 mr-2" />
          <span>
            {/* CORRIGÉ: Utilisation des champs de date du modèle */}
            {trip.dateDepartPrev
              ? formatDateOnly(trip.dateDepartPrev)
              : "Date N/C"}
          </span>
        </div>

        <p className="text-gray-700 text-sm mb-4 line-clamp-2">
          {trip.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {/* CORRIGÉ: trip.included -> trip.amenities */}
          {trip.amenities &&
            trip.amenities.slice(0, 3).map((item, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-blue-50 text-primary rounded-full text-xs"
              >
                {item}
              </span>
            ))}
          {trip.amenities && trip.amenities.length > 3 && (
            <span className="px-2 py-1 bg-blue-50 text-primary rounded-full text-xs">
              +{trip.amenities.length - 3} {t("agenciesPage.profile.moreItems")}
            </span>
          )}
        </div>

        <button className="w-full py-2 bg-primary text-white rounded-lg hover:bg-start-color transition-colors">
          {t("agenciesPage.profile.viewTripButton")}
        </button>
      </div>
    </div>
  );
}
