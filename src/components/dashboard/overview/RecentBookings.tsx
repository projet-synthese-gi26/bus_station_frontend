import type React from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import type { ReservationPreviewDTO } from "@/lib/types/generated-api";
import { Clock, ArrowRight } from "lucide-react";

interface RecentBookingsProps {
  bookings: ReservationPreviewDTO[];
}

const RecentBookings: React.FC<RecentBookingsProps> = ({ bookings }) => {
  const { t } = useTranslation();

  return (
    <div className="col-span-12 xl:col-span-4">
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300 h-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              Réservations Récentes
            </h3>
            <p className="text-gray-600">Dernières activités</p>
          </div>
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        {bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.slice(0, 5).map(({ reservation, voyage }) => (
              <div
                key={reservation?.idReservation}
                className="group flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 cursor-pointer"
              >
                <div className="relative">
                  <Image
                    src={
                      voyage?.smallImage
                        ? voyage.smallImage.startsWith("http") ||
                          voyage.smallImage.startsWith("/")
                          ? voyage.smallImage
                          : `/${voyage.smallImage}`
                        : "/placeholder.svg"
                    }
                    alt={voyage?.titre || "Voyage"}
                    width={48}
                    height={48}
                    className="rounded-xl object-cover"
                  />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    #{reservation?.idReservation?.substring(0, 8)}...
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {voyage?.titre || "Voyage sans titre"}
                  </p>
                </div>

                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors duration-200" />
              </div>
            ))}

            <button className="w-full mt-4 py-3 text-primary font-semibold hover:bg-blue-50 rounded-xl transition-colors duration-200">
              Voir toutes les réservations
            </button>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Aucune réservation
            </h4>
            <p className="text-gray-500 text-sm">
              Les nouvelles réservations apparaîtront ici
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentBookings;
