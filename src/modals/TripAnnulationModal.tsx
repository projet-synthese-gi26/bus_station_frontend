import React, { useState, useEffect } from "react";
import { XCircle, X } from "lucide-react";
import axiosInstance from "@/lib/services/axios-services/axiosInstance";
import { ReservationDetails } from "@/lib/types/models/Reservation";
import TransparentModal from "@/modals/TransparentModal";
import {SuccessModal} from "@/modals/SuccessModal";



interface TripAnnulationModalProps {
  isOpen?: boolean;
  onClose: () => void;
  trip: ReservationDetails | null;
}

interface Passenger {
  idPassager: string;
  nom: string;
  genre: string;
  age: number;
  numeroPieceIdentific: string;
  nbrBaggage: number;
  placeChoisis: number;
}

export default function TripAnnulationModal({ isOpen, onClose, trip }: TripAnnulationModalProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [selectedCause, setSelectedCause] = useState("");
  const [customCause, setCustomCause] = useState("");
  const [selectedPassengers, setSelectedPassengers] = useState<string[]>([]);
  const [cancelAll, setCancelAll] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [refundAmount, setRefundAmount] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [passengers, setPassengers] = useState<Passenger[]>([]);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    } else if (trip) {
      // Charger les passagers depuis le trip ou depuis l'API
      loadPassengers();
    }
  }, [isOpen, trip]);

  useEffect(() => {
    if (isOpen && trip) {
      getRefundAmount();
    }
  }, [isOpen, trip, selectedPassengers]);

  const loadPassengers = async () => {
    // Si les passagers sont déjà dans trip

      // Sinon, charger depuis l'API
      try {
        const response = await axiosInstance.get(`/reservation/${trip?.reservation?.idReservation}`);
        if (response.data?.passager) {
          setPassengers(response.data.passager);
        }
      } catch (error) {
        console.error("Error loading passengers:", error);
        setPassengers([]);
      }

  };

  const resetForm = () => {
    setSelectedCause("");
    setCustomCause("");
    setSelectedPassengers([]);
    setCancelAll(false);
    setError("");
    setRefundAmount(null);
    setPassengers([]);
  };

  const handleCauseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCause(e.target.value);
  };

  const handleCustomCauseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomCause(e.target.value);
  };

  const handlePassengerChange = (id: string) => {
    setSelectedPassengers((prev) =>
        prev.includes(id)
            ? prev.filter((passengerId) => passengerId !== id)
            : [...prev, id]
    );
  };

  const handleCancelAllChange = () => {
    setCancelAll((prev) => !prev);
    if (!cancelAll) {
      setSelectedPassengers(passengers.map((p) => p.idPassager));
    } else {
      setSelectedPassengers([]);
    }
  };

  const getRefundAmount = async () => {
    if (!trip?.reservation?.idReservation) return;

    try {
      const response = await axiosInstance.post(`/reservation/annuler`, {
        causeAnnulation: "",
        origineAnnulation: "",
        idReservation: trip.reservation.idReservation,
        idPassagers: selectedPassengers,
        canceled: false,
      });

      if (response.status === 200 || response.status === 201) {
        setRefundAmount(response.data);
      }
    } catch (error) {
      console.error("Error getting refund amount:", error);
      setRefundAmount("0");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCause || selectedPassengers.length === 0) {
      setError("Please select a cause and at least one passenger");
      return;
    }

    setIsConfirming(true);
    setError("");

    const causeAnnulation = selectedCause === "other" ? customCause : selectedCause;

    try {
      const response = await axiosInstance.post(`/reservation/annuler`, {
        causeAnnulation,
        origineAnnulation: "user",
        idReservation: trip?.reservation?.idReservation,
        idPassagers: selectedPassengers,
        canceled: true,
      });

      if (response.status === 200 || response.status === 201) {
        setSuccessMessage("Reservation successfully canceled!");
        setIsSuccessModalOpen(true);
      }
    } catch (error) {
      console.error("Cancellation error:", error);
     // setError(error.response?.data?.message || "An error occurred during cancellation");
    } finally {
      setIsConfirming(false);
    }
  };



  if (isSuccessModalOpen) {
    return (
        <TransparentModal isOpen={isSuccessModalOpen}>
          <SuccessModal
              canOpenSuccessModal={setIsSuccessModalOpen}
              message={successMessage}
              makeAction={() => {
                setIsSuccessModalOpen(false);
                onClose();
              }}
          />
        </TransparentModal>
    );
  }

  return (
       <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <div className="flex gap-2 ml-16">
              <div className="bg-red-200 p-2 rounded-full">
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
              <h2 className="text-3xl font-bold text-red-500 mt-1">Cancel Reservation</h2>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-red-500">
              <X className="h-7 w-7" />
            </button>
          </div>

          {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
                {error}
              </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Trip Information */}
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Trip Information</h3>
              <p className="text-sm text-gray-600">
                <strong>Route:</strong> {trip && trip.voyage?.lieuDepart} → {trip && trip.voyage?.lieuArrive}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Agency:</strong> {trip && trip.agence?.longName}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Reservation ID:</strong> {trip && trip.reservation?.idReservation}
              </p>
            </div>

            {/* Passenger Selection */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Select Passengers to Cancel
              </label>
              <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
                {passengers.length > 0 ? (
                    <>
                      {passengers.map((passenger) => (
                          <div key={passenger.idPassager} className="flex items-center mb-2">
                            <input
                                type="checkbox"
                                id={`passenger-${passenger.idPassager}`}
                                checked={selectedPassengers.includes(passenger.idPassager)}
                                onChange={() => handlePassengerChange(passenger.idPassager)}
                                className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label
                                htmlFor={`passenger-${passenger.idPassager}`}
                                className="text-gray-700"
                            >
                              {passenger.nom} (Seat {passenger.placeChoisis})
                            </label>
                          </div>
                      ))}

                      <div className="flex items-center mt-4">
                        <input
                            type="checkbox"
                            id="cancel-all"
                            checked={cancelAll}
                            onChange={handleCancelAllChange}
                            className="mr-2 h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                        />
                        <label htmlFor="cancel-all" className="text-red-700 font-bold">
                          Cancel Entire Trip
                        </label>
                      </div>
                    </>
                ) : (
                    <p className="text-gray-500">Loading passengers...</p>
                )}
              </div>
            </div>

            {/* Cancellation Cause */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Cause of Cancellation
              </label>
              <select
                  value={selectedCause}
                  onChange={handleCauseChange}
                  className="block w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                  required
              >
                <option value="">Select a cause</option>
                <option value="personal">Personal reasons</option>
                <option value="health">Health issues</option>
                <option value="schedule">Schedule conflict</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Custom Cause */}
            {selectedCause === "other" && (
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Custom Cause
                  </label>
                  <input
                      type="text"
                      value={customCause}
                      onChange={handleCustomCauseChange}
                      className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="Please specify the reason"
                      required
                  />
                </div>
            )}

            {/* Refund Amount */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Estimated Refund Amount
              </label>
              <p className="text-primary text-lg font-medium">
                {refundAmount && refundAmount !== "Réservation annulée avec succès."
                    ? `${refundAmount} FCFA`
                    : "Calculating..."}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                *Final refund amount may vary based on cancellation policies
              </p>
            </div>

            <p className="text-lg font-medium text-gray-700 mb-6">
              Are you sure you want to cancel your reservation for this trip?
            </p>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
              >
                No, Keep Reservation
              </button>
              <button
                  type="submit"
                  disabled={isConfirming || !selectedCause || selectedPassengers.length === 0}
                  className="px-6 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isConfirming ? "Canceling..." : "Yes, Cancel"}
              </button>
            </div>
          </form>
        </div>
  );
}