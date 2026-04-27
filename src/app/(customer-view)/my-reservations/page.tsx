"use client";

import { MapPin } from "lucide-react";
import TransparentModal from "@/modals/TransparentModal";
import { PaymentModal } from "@/modals/PaymentRequestModal";
import { useMyReservation } from "@/lib/hooks/reservation-hooks/useMyReservation";
import LoadingSpinner from "@/components/my-reservation-components/LoadingSpinner";
import GridCardTrip from "@/components/my-reservation-components/GridCard";
import TripListItem from "@/components/my-reservation-components/TripListItem";
import { Pagination } from "antd";
import MyReservationHeader from "@/components/my-reservation-components/MyReservationHeader";
import { ReservationDetails } from "@/lib/types/models/Reservation";
import TripAnnulationModal from "@/modals/TripAnnulationModal";
import React from "react";

export default function ScheduledTripsPage() {
  const hook = useMyReservation("");

  if (hook.isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen p-3">
      <MyReservationHeader hook={hook} />

      <div className="lg:max-w-7xl max-w-5xl mx-auto">
        {hook.filteredTrips?.length > 0 ? (
          <>
            <div
              className={
                hook.viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6"
                  : "space-y-3"
              }
            >
              {hook.filteredTrips.map(
                (trip: ReservationDetails, index: number) => {
                  const Component =
                    hook.viewMode === "grid" ? GridCardTrip : TripListItem;
                  return (
                    <Component
                      key={trip.reservation.idReservation || index}
                      reservationDetails={trip}
                      onPayment={() => hook.openPaymentModal(trip)}
                      onCancel={() => hook.openCancellationModal(trip)}
                      onViewDetails={() =>
                        hook.navigateToDetails(trip.reservation.idReservation)
                      }
                    />
                  );
                }
              )}
            </div>

            {hook.canRenderPaginationContent && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  current={hook.currentPage}
                  total={hook.totalPages * 10}
                  pageSize={10}
                  onChange={hook.setCurrentPage}
                  showQuickJumper
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <MapPin className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No booked trips found
            </h3>
            <p className="text-gray-600 mb-6">
              {hook.searchQuery
                ? "Try adjusting your search terms"
                : "You haven't booked any trips yet"}
            </p>
            <button
              onClick={() => (window.location.href = "/market-place")}
              className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Browse Available Trips
            </button>
          </div>
        )}
      </div>

      <TransparentModal isOpen={hook.canOpenPaymentRequestModal}>
        <PaymentModal
          reservation={hook.selectedTrip?.reservation}
          onClose={() => hook.setCanOpenPaymentRequestModal(false)}
        />
      </TransparentModal>

      <TransparentModal isOpen={hook.canOpenTripAnnulationModal}>
        <TripAnnulationModal
          trip={hook.selectedTrip}
          onClose={() => hook.setCanOpenTripAnnulationModal(false)}
        />
      </TransparentModal>
    </div>
  );
}
