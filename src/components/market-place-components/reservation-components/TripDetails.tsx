import {JSX} from "react";
import {MapPin, X} from "lucide-react";
import {FaCalendar, FaChair, FaDollarSign, FaMoneyBill, FaUsers} from "react-icons/fa";
import {useReservation} from "@/lib/hooks/reservation-hooks/useReservation";
import {Trip} from "@/lib/types/models/Trip";
import {FaHouse} from "react-icons/fa6";
import {formatDateOnly} from "@/lib/services/date-services";



export interface TripDetailsPropsInterface {
    tripDetails: Trip,
    selectedSeats: number[],
    onClose: ()=> void,
    onContinue: ()=> void,
    totalPrice: number
}

export default function TripDetails({onClose, selectedSeats,onContinue, tripDetails, totalPrice}: TripDetailsPropsInterface): JSX.Element
{


    const reservationDetails = [
        { icon: FaHouse, label: "Travel agency", value: tripDetails?.nomAgence },
        { icon: FaCalendar, label: "Travel date", value: formatDateOnly(tripDetails?.dateDepartPrev || "")},
        { icon: MapPin, label: "Departure location", value: tripDetails?.lieuDepart },
        { icon: MapPin, label: "Arrival Location", value: tripDetails?.lieuArrive },
        { icon: FaMoneyBill, label: "Unit price", value: tripDetails?.prix + " FCFA" },
    ];

    return (
        <>
            <div className=" flex justify-between items-center mb-6">
                <h1 className="text-2xl text-primary font-bold">Booking Details</h1>
                <button onClick={onClose} className="cursor-pointer hidden sm:block bg-red-100 rounded-full p-2">
                    <X className="w-6 h-6 text-red-500"/>
                </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 lg:gap-6 mb-6">
                {reservationDetails.map((detail, index) => (
                    <div key={index} className="flex items-center">
                        <detail.icon className="w-5 h-5 text-primary mr-3"/>
                        <div className="flex-1">
                            <p className="lg:text-sm text-xs font-medium text-gray-500">{detail.label}</p>
                            <p className="lg:text-lg text-md font-semibold text-gray-800">{detail.value}</p>
                        </div>
                    </div>
                ))}
                <div className="flex items-center">
                    <FaUsers className="w-5 h-5 text-primary mr-3"/>
                    <div className="flex-1">
                        <p className="lg:text-sm text-xs font-medium text-gray-500">Number of places to reserve</p>
                        <p className="lg:text-lg text-md font-semibold text-gray-800">
                            {selectedSeats.length === 0 ? " - " : selectedSeats.length}
                        </p>
                    </div>
                </div>
                <div className="flex items-center">
                    <FaDollarSign className="w-5 h-5 text-green-500 mr-3"/>
                    <div className="flex-1">
                        <p className="lg:text-sm text-xs font-medium text-gray-500">Total Price</p>
                        <p className="lg:text-lg text-md font-semibold text-green-500">{totalPrice + " FCFA"}</p>
                    </div>
                </div>
            </div>

            <div className=" flex items-center mt-4 mb-6">
                <FaChair className="w-5 h-5 text-primary mr-3"/>
                <div className="flex-1">
                    <p className="lg:text-sm text-xs font-medium text-gray-500">Selected seats</p>
                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 mt-2">
                        {selectedSeats.map((seat, index: number) => (
                            <div
                                key={index}
                                className="w-8 h-7 border-green-500 border-2 rounded-md bg-green-100 flex justify-center items-center"
                            >
                                <p className="text-sm text-gray-600 font-semibold">{seat}</p>
                            </div>
                        ))}
                        {selectedSeats.length === 0 && " - "}
                    </div>
                </div>
            </div>

            <div className="mt-auto flex justify-center">
                <button
                    onClick={onContinue}
                    className=" bg-primary font-bold text-white py-3 px-10 rounded-2xl transition-all duration-300 disabled:bg-gray-400 cursor-pointer hover:bg-blue-800 disabled:cursor-not-allowed"
                    disabled={selectedSeats.length === 0}
                >
                    Continue
                </button>
            </div>
        </>
    )
}