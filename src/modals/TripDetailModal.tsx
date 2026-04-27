import React from "react";
import {
  AlertCircle,
  CheckCircle2,
  X,
  MapPin,
  Calendar,
  Clock,
  Timer,
  Wallet
} from "lucide-react";
import { FaInfo, FaLandmark } from "react-icons/fa";
import { Tooltip } from "antd";
import { MdAirlineSeatReclineNormal } from "react-icons/md";
import { AiFillInfoCircle } from "react-icons/ai";

interface TripDetailsModalProps {
  isOPen: boolean;
  trip: {
    from: string;
    to: string;
    status: string;
    busType: string;
    price: number;
    seatNumber: string;
    date: string;
    departureTime: string;
    arrivalTime: string;
    departureLocation: string;
    deadline: string;
    company: string;
    remainingAmount?: number;
    totalAmount?: number;
  };
  onClose: () => void;
}

export function TripDetailsModal({ isOPen, trip, onClose }: TripDetailsModalProps) {
  if (!isOPen) return null;

  const isConfirmed = trip.status === "confirmed";
  const isReserved = trip.status === "reserved";

  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm transition-all duration-300">
        <div className="bg-white rounded-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <div className="flex gap-2 ml-16">
              <div className="bg-blue-200 p-2 rounded-full">
                <FaInfo className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-primary mt-1">
                Trip Details
              </h2>
            </div>
            <Tooltip placement="top" title="close modal">
              <button
                  onClick={onClose}
                  className="text-red-500 hover:text-red-700"
              >
                <X className="h-7 w-7" />
              </button>
            </Tooltip>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-primary">
                <MapPin className="h-6 w-6" />
                <h3 className="text-xl font-bold">
                  {trip.from} - {trip.to}
                </h3>
              </div>
              <div className="flex gap-2">
                {isConfirmed ? (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 flex items-center gap-1">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Confirmed
                                </span>
                ) : (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700 flex items-center gap-1">
                                    <AlertCircle className="h-4 w-4" />
                                    waiting for confirmation
                                </span>
                )}
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                                {trip.busType}
                            </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">
                {trip.price.toLocaleString()} FCFA
              </p>
              <div className="flex gap-1 ml-7">
                <MdAirlineSeatReclineNormal className="text-green-500 w-6 h-6" />
                <p className="text-sm text-green-500 font-semibold mt-1">
                  Seat {trip.seatNumber}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 ml-10 pb-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-gray-500">Departure Date</p>
                <p className="font-medium">
                  {new Date(trip.date).toLocaleDateString("en-EN", {
                    dateStyle: "long",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-gray-500">Departure time</p>
                <p className="font-medium">{trip.departureTime}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-gray-500">
                  Estimated time of arrival
                </p>
                <p className="font-medium">{trip.arrivalTime}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-gray-500">Departure Location</p>
                <p className="font-medium">{trip.departureLocation}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Timer className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-gray-500">Payment deadline</p>
                <p className="font-medium">
                  {new Date(trip.deadline).toLocaleDateString("fr-FR", {
                    dateStyle: "long",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-gray-500">Arrival location</p>
                <p className="font-medium">{trip.departureLocation}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-400 pt-4">
            <div className="flex gap-1 mb-2">
              <AiFillInfoCircle className="text-primary h-7 w-7" />
              <h4 className="text-xl text-primary font-bold">
                Additional information
              </h4>
            </div>
            <ul className="ml-10 space-y-2 pb-4 text-gray-600">
              <li className="flex gap-3">
                <p>Transport company :</p>
                <p className="font-semibold">{trip.company}</p>
              </li>
              <li className="flex gap-3">
                <p>Type of bus:</p>
                <p className="font-semibold">{trip.busType}</p>
              </li>
              <li className="flex gap-3">
                <p>Seat number:</p>
                <p className="font-semibold">{trip.seatNumber}</p>
              </li>
              <li className="flex gap-3">
                <p>Estimated travel time:</p>
                <p className="font-semibold">4 hours</p>
              </li>
            </ul>
          </div>

          <div className="border-t border-gray-400 pt-6 mb-5">
            <div className="flex gap-2 mb-2">
              <FaLandmark className="text-primary h-7 w-7" />
              <h4 className="text-xl text-primary font-bold">
                Cancellation Policy
              </h4>
            </div>
            <p className="text-gray-600 ml-10">
              Free cancellation up to 24 hours before departure. Fees may apply
              for late cancellations. Please see our terms and conditions for
              further details.
            </p>
          </div>

          {/* Payment Section for Reserved Status */}
          {isReserved && trip.remainingAmount && (
              <div className="border-t border-gray-400 pt-6">
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Wallet className="h-5 w-5 text-yellow-500" />
                      <div>
                        <p className="font-medium text-yellow-800">
                          Amount remaining to be paid:{" "}
                          {trip.remainingAmount.toLocaleString()} FCFA
                        </p>
                        <p className="text-sm text-yellow-600">
                          on a total of {trip.totalAmount?.toLocaleString()} FCFA
                        </p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors">
                      Complete payment
                    </button>
                  </div>
                </div>
              </div>
          )}
        </div>
      </div>
  );
}

