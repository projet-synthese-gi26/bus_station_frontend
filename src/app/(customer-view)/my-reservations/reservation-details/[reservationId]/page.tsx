"use client";

import React from "react";
import { ArrowLeft, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../../../../../components/my-reservation-components/LoadingSpinner";
import ErrorHandler from "../../../../../components/error-handler/ErrorHandler";
import TripAnnulationModal from "../../../../../modals/TripAnnulationModal";
import ReservationSummary from "../../../../../components/my-reservation-components/ReservationSummary";
import {useMyReservation} from "@/lib/hooks/reservation-hooks/useMyReservation";
import TransparentModal from "@/modals/TransparentModal";




export default function ReservationDetails({ params }: {params: Promise<{reservationId: string}>}) {


  const router = useRouter();
  const resolvedParams = React.use(params);
  const reservationId = resolvedParams?.reservationId;
  const reservationHook = useMyReservation(reservationId);


  if (reservationHook.isLoading) {
    return <LoadingSpinner />;
  }

  if (reservationHook.error) {
    return <ErrorHandler error={reservationHook.error} />;
  }

  if (!reservationHook.reservationDetail) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Reservation not found</h2>
            <p className="text-gray-600">The reservation you&#39;re looking for doesn&#39;t exist.</p>
          </div>
        </div>
    );
  }

  return (
      <div className="p-2 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row bg-gray-100 items-center mb-8 p-4 sm:p-6 rounded-xl">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <button
                onClick={() => router.back()}
                className="p-2 bg-blue-200 rounded-full text-primary hover:bg-blue-400 w-10 h-10 flex justify-center items-center transition-all duration-300"
            >
              <ArrowLeft className="h-7 w-7" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-primary">
                Reservation Details
              </h1>
              <p className="text-sm sm:text-base text-gray-500 font-medium mt-1">
                Booking Reference: {reservationHook.reservationDetail.reservation?.idReservation}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Reservation Summary */}
          <ReservationSummary reservationDetails={reservationHook.reservationDetail} />

          {/* Passenger Details
          <PassengerDetails
              reservationDetails={reservationHook.reservationDetail}
              onCancelTrip={() => reservationHook.setCanOpenTripAnnulationModal(true)}
          /> */}
        </div>

        {/* Modal d'annulation */}
          <TransparentModal isOpen={reservationHook.canOpenTripAnnulationModal}>
              <TripAnnulationModal
                  trip={reservationHook.reservationDetail}
                  onClose={() => reservationHook.setCanOpenTripAnnulationModal(false)}
              />
          </TransparentModal>
      </div>
  );
}