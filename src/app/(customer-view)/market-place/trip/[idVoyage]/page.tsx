"use client";

import React, { JSX, use } from "react";
import { FaArrowLeft } from "react-icons/fa";
import TripDetailsLoader from "@/components/market-place-components/trip-details/TripDetailsLoader";
import { useTripDetails } from "@/lib/hooks/market-place/useTripDetails";
import PrincipalSection from "@/components/market-place-components/trip-details/principal-section/PrincipalSection";
import DetailedInformation from "@/components/market-place-components/trip-details/DetailedInformation";
import TripDetailsLoadingError from "@/components/market-place-components/trip-details/TripDetailsLoadingError";
import TransparentModal from "@/modals/TransparentModal";
import ReservationProcessModal from "@/modals/ReservationProcessModal";
import { PaymentModal } from "@/modals/PaymentRequestModal";


export default function TripDetails({params,}: { params: Promise<{ idVoyage: string }>; }): JSX.Element
{
  const { idVoyage } = use(params);
  const tripDetailsHook = useTripDetails(idVoyage);

  if (tripDetailsHook.isLoading) return <TripDetailsLoader />;

  if (tripDetailsHook.axiosError) return <TripDetailsLoadingError />;

  return (
    <div className="min-h-screen">
      {/* Header avec bouton retour */}
      <div className="bg-gray-100 rounded-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => window.history.back()}
            className="flex items-center cursor-pointer gap-2 text-blue-600 hover:text-blue-700 transition-colors group"
          >
            <FaArrowLeft className="text-lg group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="font-semibold">Back to Available Trips</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-2">
        {/* Section principale */}
        <PrincipalSection
          tripDetails={tripDetailsHook.tripDetails}
          setCanOpenReservationModal={
            tripDetailsHook.setCanOpenReservationModal
          }
        />

        {/* Informations détaillées */}
        <DetailedInformation
          tripDetails={tripDetailsHook.tripDetails}
          equipmentsOnBus={tripDetailsHook.equipmentsOnBus}
        />

        {/* Bouton mobile */}
        <div className="mt-4  lg:hidden  p-2">
          <button
            onClick={() => tripDetailsHook.setCanOpenReservationModal(true)}
            className="w-full bg-primary text-white rounded-xl py-2.5 font-semibold text-lg cursor-pointer hover:bg-blue-800 transition-all duration-300 shadow-lg"
          >
            Book This Trip - {(tripDetailsHook.tripDetails.prix ?? 0).toLocaleString()}{" "}
            FCFA
          </button>
        </div>
      </div>

      <TransparentModal isOpen={tripDetailsHook.canOpenReservationModal}>
        <ReservationProcessModal
          setReservationSuccessMessage={tripDetailsHook.setReservationSuccessMessage}
          onCloseAction={() => tripDetailsHook.setCanOpenReservationModal(false)}
          tripDetails={tripDetailsHook.tripDetails}
          setCanOpenPaymentModal={tripDetailsHook.setCanOpenPaymentModal}
        />
      </TransparentModal>

      <TransparentModal isOpen={tripDetailsHook.canOpenPaymentModal}>
        <PaymentModal
          onClose={() => tripDetailsHook.setCanOpenPaymentModal(false)}
          reservationSuccessMessage={tripDetailsHook.reservationSuccessMessage}
        />
      </TransparentModal>
    </div>
  );
}
