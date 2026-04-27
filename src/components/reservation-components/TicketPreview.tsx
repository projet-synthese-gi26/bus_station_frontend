import {Briefcase, Bus, Calendar, Clock, CreditCard, DollarSign, MapPin, User, Users} from "lucide-react";
import {formatDateOnly, formatDateToTime} from "@/lib/services/date-services";
import {Trip} from "@/lib/types/models/Trip";
import {PassengerFormType} from "@/lib/types/schema/passengerReservationSchema";



interface TicketPreviewPropsInterface{
    tripDetails: Trip,
    passengerData: PassengerFormType,
    seatNumber: number
}

export default function TicketPreview({tripDetails, passengerData, seatNumber}: TicketPreviewPropsInterface) {


    return (
        <div
            className="bg-white rounded-lg p-6 mb-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                    <div className="bg-primary rounded-full p-2">
                        <User className="w-6 h-6 text-white"/>
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg text-gray-800">{passengerData.nom}</h4>
                        <p className="text-sm text-gray-500">{passengerData.genre}, {passengerData.age} years</p>
                    </div>
                </div>
                <div className="bg-gray-100 rounded-lg px-3 py-1 flex items-center gap-1">
                    <CreditCard className="w-4 h-4 text-gray-600"/>
                    <span className="font-medium text-sm">{passengerData.numeroPieceIdentific}</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary"/>
                    <span className="text-sm">Seat: <strong>{seatNumber}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary"/>
                    <span className="text-sm">Luggage: <strong>{String(passengerData.nbrBaggage)}</strong></span>
                </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4">
                <h5 className="font-semibold text-primary mb-2">Trip detail</h5>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div className="flex items-center gap-2">
                        <Bus className="w-5 h-5 text-primary"/>
                        <span className="text-sm">Bus: <strong>{tripDetails.vehicule?.plaqueMatricule ?? ""}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary"/>
                        <span
                            className="text-sm">Date: <strong>{tripDetails.dateDepartEffectif ? formatDateOnly(tripDetails?.dateDepartEffectif) : " - "}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary"/>
                        <span className="text-sm">From: <strong>{tripDetails.lieuDepart}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary"/>
                        <span className="text-sm">To: <strong>{tripDetails.lieuArrive}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary"/>
                        <span
                            className="text-sm">Departure: <strong>{tripDetails?.heureDepartEffectif ? formatDateToTime(tripDetails?.heureDepartEffectif) : "not specified"}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-500"/>
                        <span className="text-sm">Price: <strong>{tripDetails.prix} FCFA</strong></span>
                    </div>
                </div>
            </div>
        </div>
    )

}
