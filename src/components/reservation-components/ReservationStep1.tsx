import {  X } from "lucide-react"
import Bus70SeatsDisposition from "@/components/seat-disposition-components/Bus70SeatsDisposition"
import Bus75SeatsDisposition from "@/components/seat-disposition-components/Bus75SeatsDisposition"
import Bus80SeatsDisposition from "@/components/seat-disposition-components/Bus80SeatsDisposition"
import Bus56SeatsDisposition from "@/components/seat-disposition-components/Bus56SeatsDisposition"
import {Trip} from "@/lib/types/models/Trip";
import TripDetails from "@/components/market-place-components/reservation-components/TripDetails";


export interface ReservationStep1PropsInterface {
    tripDetails: Trip,
    setSelectedSeats: (param: number[])=> void,
    selectedSeats: number[],
    onClose: ()=> void,
    onContinue: ()=> void,
    totalPrice: number
}

export default function ReservationStep1({ tripDetails, setSelectedSeats, selectedSeats, onClose, onContinue, totalPrice }: ReservationStep1PropsInterface) {



    return (
        <>
            <div className="flex flex-col lg:flex-row h-full">

                {/* Seat disposition */}
                <div className="w-full lg:w-1/2 p-6 bg-white lg:h-full lg:overflow-y-auto">
                    <div className="flex justify-between">
                        <h3 className="lg:text-2xl text-xl font-bold text-primary mb-4">Selection of places</h3>

                        <button onClick={onClose}
                                className=" w-8 h-8 cursor-pointer lg:hidden bg-red-100 rounded-full flex justify-center items-center hover:bg-red-200 transition-all duration-300">
                            <X className="w-6 h-6 text-red-500"/>
                        </button>
                    </div>

                    <p className="italic text-md mb-6 text-gray-600">Please choose the seat(s) you want to book</p>
                    <div className="flex flex-wrap gap-4 mb-6">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg border-2 border-gray-500 bg-gray-200"/>
                            <span className="text-sm text-gray-500 font-medium">Available</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-green-300 border-2 border-green-500"/>
                            <span className="text-sm text-green-600 font-medium">Selected </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-orange-300 border-2 border-red-500"/>
                            <span className="text-sm text-orange-600 font-medium">Occupied </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-red-300 border-2 border-red-500"/>
                            <span className="text-sm text-red-600 font-medium">Reserved </span>
                        </div>
                    </div>
                    {tripDetails.nbrPlaceRestante === 70 && (
                        <Bus70SeatsDisposition
                            setSeats={setSelectedSeats}
                            _reservedSeats={tripDetails?.nbrPlaceReserve}
                            tripId={tripDetails.idVoyage}
                        />
                    )}
                    {tripDetails.nbrPlaceRestante === 75 && (
                        <Bus75SeatsDisposition
                            setSeats={setSelectedSeats}
                            _reservedSeats={tripDetails?.nbrPlaceReserve}
                            tripId={tripDetails.idVoyage}
                        />
                    )}
                    {tripDetails.nbrPlaceRestante === 80 && (
                        <Bus80SeatsDisposition
                            setSeats={setSelectedSeats}
                            _reservedSeats={tripDetails?.nbrPlaceReserve}
                            tripId={tripDetails.idVoyage}
                        />
                    )}
                    {tripDetails.nbrPlaceRestante === 56 && (
                        <Bus56SeatsDisposition
                            setSeats={setSelectedSeats}
                            _reservedSeats={tripDetails?.nbrPlaceReserve}
                            tripId={tripDetails.idVoyage}
                        />
                    )}
                </div>


                {/* Reservation and trip details */}
                <div className="bg-gray-50 w-full lg:w-1/2 lg:h-full lg:overflow-y-auto flex flex-col p-6">
                    <TripDetails
                        totalPrice={totalPrice}
                        onClose={onClose}
                        selectedSeats={selectedSeats}
                        onContinue={onContinue}
                        tripDetails={tripDetails}
                    />
                </div>
            </div>
        </>
    )
}