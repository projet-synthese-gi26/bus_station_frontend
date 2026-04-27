/*import React from "react";
import {
    User,
    Ticket,
    Users,
    CreditCard,
    Briefcase,
    Printer
} from "lucide-react";
import { MdCancel } from "react-icons/md";
import { ReservationDetails } from "@/lib/types/models/Reservation";

interface PassengerDetailsProps {
    reservationDetails: ReservationDetails;
    onCancelTrip: () => void;
}

export default function PassengerDetails({ reservationDetails, onCancelTrip }: PassengerDetailsProps) {
    const isConfirmed = reservationDetails?.reservation?.statutReservation === "CONFIRMER";

    const calculateTicketPrice = () => {
        const totalPrice = reservationDetails?.reservation?.prixTotal ;
        const passengerCount = reservationDetails?.reservation?.nbrPassager;
        return totalPrice / passengerCount;
    };

    const handlePrint = (passengerName: string) => {
        // Logique d'impression
        console.log(`Printing ticket for ${passengerName}`);
        // Ici vous pouvez implémenter la logique d'impression réelle
    };

    return (
        <div className="bg-gray rounded-lg overflow-hidden shadow-md mt-8">
            <div className="p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
                    Passenger Details
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {reservationDetails?.passager?.map((passenger, index) => (
                        <div
                            key={index}
                            className="bg-gray-100 p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-lg hover:-translate-y-2 transform transition-all duration-500"
                        >
                            <h3 className="font-semibold text-lg sm:text-xl mb-3 sm:mb-4 flex items-center">
                                <User className="mr-2 h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                                {passenger?.nom}
                            </h3>

                            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm mb-4 sm:mb-6">
                                <p className="flex items-center">
                                    <Ticket className="mr-2 h-5 w-5 text-gray-400" />
                                    <span className="text-gray-500 mr-2">Seat:</span>
                                    <span className="font-semibold">{passenger?.placeChoisis}</span>
                                </p>

                                <p className="flex items-center">
                                    <Users className="mr-2 h-5 w-5 text-gray-400" />
                                    <span className="text-gray-500 mr-2">Age:</span>
                                    <span className="font-semibold">{passenger?.age}</span>
                                </p>

                                <p className="flex items-center">
                                    <CreditCard className="mr-2 h-5 w-5 text-gray-400" />
                                    <span className="text-gray-500 mr-2">ID Card:</span>
                                    <span className="font-semibold">{passenger?.numeroPieceIdentific}</span>
                                </p>

                                <p className="flex items-center">
                                    <Briefcase className="mr-2 h-5 w-5 text-gray-400" />
                                    <span className="text-gray-500 mr-2">Luggage:</span>
                                    <span className="font-semibold">{passenger?.nbrBaggage}</span>
                                </p>

                                <p className="flex items-center">
                                    <User className="mr-2 h-5 w-5 text-gray-400" />
                                    <span className="text-gray-500 mr-2">Gender:</span>
                                    <span className="font-semibold">{passenger?.genre}</span>
                                </p>

                                <p className="flex items-center">
                                    <Ticket className="mr-2 h-5 w-5 text-gray-400" />
                                    <span className="text-gray-500 mr-2">Ticket Price:</span>
                                    <span className="font-semibold">
                                        {calculateTicketPrice().toLocaleString()} FCFA
                                    </span>
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
                                <button
                                    onClick={() => handlePrint(passenger?.nom)}
                                    disabled={!isConfirmed}
                                    className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-800 transition-all duration-300 flex items-center justify-center disabled:cursor-not-allowed disabled:bg-gray-400 text-xs sm:text-sm"
                                >
                                    <Printer className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                                    Print Ticket
                                </button>

                                <button
                                    onClick={onCancelTrip}
                                    className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300 flex items-center justify-center text-xs sm:text-sm"
                                >
                                    <MdCancel className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                                    Cancel Trip
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

 */