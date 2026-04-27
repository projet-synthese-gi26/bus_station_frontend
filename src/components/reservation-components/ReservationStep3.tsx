import {
    ArrowLeft,
    Briefcase,
    Bus,
    Calendar,
    CheckCircle,
    Clock,
    DollarSign, House,
    MapPin,
    Users,
    X,
} from "lucide-react";
import {formatDateOnly, formatDateToTime} from "@/lib/services/date-services";
import {Trip} from "@/lib/types/models/Trip";
import {PassengerFormType} from "@/lib/types/schema/passengerReservationSchema";
import {Tooltip} from "antd";

interface ReservationStep3PropsInterface{
    selectedSeats: number[],
    tripDetails: Trip,
    passengersData: PassengerFormType[],
    onClose: ()=>void,
    setStep: (step: number)=>void,
    totalPrice: number,
    subTotalPrice: number,
    serviceFee: number,
    totalLuggage: number,
    totalPassengers: number,
    onBookTrip: () => Promise<void>,
    isLoading: boolean,
    errorMessage: string
}

export default function ReservationStep3({selectedSeats, tripDetails, passengersData, onClose, setStep, totalPrice, subTotalPrice, serviceFee, totalLuggage, totalPassengers, onBookTrip, isLoading, errorMessage}: ReservationStep3PropsInterface) {



    return (
        <div className="p-4 lg:p-8">
            <div className="flex  lg:flex-row justify-between   mb-6">
                <div className="flex items-center gap-4 mb-4 lg:mb-0">
                    <Tooltip placement={"top"} title={"go back"}>
                        <button
                            onClick={() => setStep(2)}
                            className="cursor-pointer w-10 h-10 bg-green-100 text-green-600 p-2 rounded-full hover:bg-green-200 transition-all duration-300"
                        >
                            <ArrowLeft/>
                        </button>
                    </Tooltip>
                    <div className={`${errorMessage !== "" && "flex justify-between items-center gap-5"}`}>
                        <h2 className="text-2xl lg:text-3xl font-semibold text-primary">Reservation Summary</h2>
                        <p className="text-red-500 text-md font-semibold mt-1">
                            {errorMessage}
                        </p>
                    </div>
                </div>
                <Tooltip placement={"top"} title={"close"}>
                    <button
                        onClick={onClose}
                        className="cursor-pointer w-10 h-10 bg-red-100 text-red-600 p-2 rounded-full hover:bg-red-200 transition-all duration-300"
                        >
                            <X/>
                        </button>
                    </Tooltip>
                </div>

                <div className="rounded-xl overflow-hidden border border-gray-200">

                {/*** TRAVELLER ***/}
                <div className="p-4 lg:p-6 border-b border-gray-200">
                    <h3 className="font-semibold text-lg text-primary mb-4 flex items-center">
                        <Users className="w-6 h-6 mr-2"/>
                        Travellers
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {passengersData.map((passenger: PassengerFormType) => (
                            <div key={passenger.placeChoisis} className="bg-gray-100 p-3 rounded-lg">
                            <p className="font-medium text-gray-800">{passenger.nom}</p>
                                <p className="text-sm text-gray-600">
                                    Seat {passenger.placeChoisis} - {passenger.nbrBaggage} luggage(s)
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/*** TRIP DETAILS ***/}
                <div className="p-4 lg:p-6 border-b border-gray-200">
                    <h3 className="font-semibold text-lg text-primary mb-4 flex items-center">
                        <Bus className="w-6 h-6 mr-2"/>
                        Trip Details
                    </h3>
                    <div className="ml-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        <div className="space-y-5 text-gray-600">
                            <div className="flex items-center">
                                <House className="w-5 h-5 mr-2 text-primary"/>
                                <div>
                                    <span className="font-medium text-gray-600">Agency: </span>
                                    <span className="font-bold text-black">{tripDetails.nomAgence}</span>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Bus className="w-5 h-5 mr-2 text-primary"/>
                                <div>
                                    <span className="font-medium text-gray-600">Bus: </span>
                                    <span className="font-bold text-black">{tripDetails.vehicule?.plaqueMatricule ?? ""}</span>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Clock className="w-5 h-5 mr-2 text-primary"/>
                                <div>
                                    <span className="font-medium text-gray-600">Departure time: </span>
                                    <span className="font-bold text-black">
                                        {tripDetails?.heureDepartEffectif
                                            ? formatDateToTime(tripDetails?.heureDepartEffectif)
                                            : "not specified"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-5 text-gray-600">
                            <div className="flex items-center">
                                <MapPin className="w-5 h-5 mr-2 text-red-600"/>
                                <div>
                                    <span className="font-medium text-gray-600">From: </span>
                                    <span className="font-bold text-black">{tripDetails?.lieuDepart}</span>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <MapPin className="w-5 h-5 mr-2 text-red-600"/>
                                <div>
                                    <span className="font-medium text-gray-600">To: </span>
                                    <span className="font-bold text-black">{tripDetails?.lieuArrive}</span>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Calendar className="w-5 h-5 mr-2 text-primary"/>
                                <div>
                                    <span className="font-medium text-gray-600">Date: </span>
                                    <span className="font-bold text-black">
                                        {tripDetails?.dateDepartEffectif ? formatDateOnly(tripDetails?.dateDepartEffectif) : "not specified"}
                                  </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-5 text-gray-600">
                            <div className="flex items-start">
                                <Users className="w-5 h-5 mr-2 text-primary mt-1"/>
                                <div>
                                    <span className="font-medium text-gray-600">Selected Seats: </span>
                                    <div className="grid grid-cols-4 gap-1 mt-1">
                                        {selectedSeats.map((seat, index) => (
                                            <div
                                                key={index}
                                                className="w-8 h-7 border-green-500 border-2 rounded-md bg-green-100 flex justify-center items-center"
                                            >
                                                <p className="text-sm text-gray-600 font-semibold">{seat}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Briefcase className="w-5 h-5 mr-2 text-primary"/>
                                <div>
                                    <span className="font-medium text-gray-600">Total Luggage: </span>
                                    <span className="font-bold text-black">{totalLuggage}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/*** PRICE SUMMARY ***/}
                <div className="p-4 lg:p-6">
                    <h3 className="font-semibold text-lg text-primary mb-4 flex items-center">
                        <DollarSign className="w-6 h-6 mr-2"/>
                        Price Summary
                    </h3>
                    <div className="space-y-2 text-gray-600">
                        <p className="flex justify-between">
                            <span>Price per traveller</span>
                            <span className="font-bold text-black">{tripDetails.prix} FCFA</span>
                        </p>
                        <p className="flex justify-between">
                            <span>Number of Travellers</span>
                            <span className="font-bold text-black">{totalPassengers}</span>
                        </p>
                        <p className="flex justify-between">
                            <span>Subtotal</span>
                            <span className="font-bold text-black">{subTotalPrice.toLocaleString()} FCFA</span>
                        </p>
                        <p className="flex justify-between">
                            <span>Service Fee (2%)</span>
                            <span className="font-bold text-black">{serviceFee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} FCFA</span>
                        </p>
                        <div className="border-t border-gray-200 pt-2 mt-2">
                            <p className="flex justify-between text-lg font-semibold text-green-500">
                                <span>Total Price</span>
                                <span>{totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} FCFA</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`flex ${errorMessage === "" ? "justify-end" : "justify-between"}  mr-2 mt-8`}>
                <p className="text-red-500 text-md font-semibold">
                    {errorMessage}
                </p>
                <button
                    onClick={onBookTrip}
                    disabled={isLoading}
                    className={` ${isLoading && "animate-bounce "} cursor-pointer bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-opacity-90 transition-colors duration-200 flex items-center justify-center`}
                >
                    <CheckCircle className="w-5 h-5 mr-2"/>
                    {isLoading ? "Booking..." : "Book"}
                </button>
            </div>
        </div>
    )
}